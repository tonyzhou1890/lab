import type * as OpenType from 'opentype.js'
import openType from 'opentype.js'
import Service from '../service-base'
import IO, { DepLoadConfig } from '@/core/io'
import config from '@/core/config'
import { CoreErrorEnum } from '@/core/error'
import JSZip from 'jszip'

export interface FontConfig {
  name: string
  path: string
  fontPath: string
  version: string
  compressedSize: number
  ignore?: boolean
}

class FontService extends Service {
  constructor() {
    super()
  }

  fontIndex: {
    storeName: string
    list: FontConfig[]
  } = { storeName: 'fonts', list: [] }
  fontBuffer: null | ArrayBuffer = null
  fontParsed: null | OpenType.Font = null
  glyphsOptions: { id: number; label: string }[] = []

  /**
   * @desc 初始化，主要是拉取字体列表
   */
  async init(): Promise<void> {
    const data = await IO.loadDepFile<Blob>({
      key: 'fonts',
      ...config.deps.fonts,
    })
    Object.assign(this.fontIndex, JSON.parse((await data?.data.text()) ?? '{}'))
    this.fontIndex.list = this.fontIndex.list.filter((item) => !item.ignore)
  }

  /**
   * @param cfg
   * @returns
   * @desc 加载远程字体
   */
  async loadFont(
    cfg: FontConfig & {
      loadCallback?: DepLoadConfig['loadCallback']
    }
  ): Promise<Blob | void> {
    const url = new URL(cfg.path, config.deps.fonts.url)
    const data = await IO.loadDepFile<Blob>({
      key: cfg.name,
      url: url.href,
      version: cfg.version,
      storeName: this.fontIndex.storeName,
      loadCallback: cfg.loadCallback,
    })
    if (!data?.data) {
      throw new Error(CoreErrorEnum[201])
    }
    // 解压数据
    const zip = new JSZip()
    const font = await (
      await zip.loadAsync(data.data, {
        optimizedBinaryString: true,
      })
    )
      .file(cfg.fontPath)
      ?.async('blob')

    if (!font) {
      throw new Error(CoreErrorEnum[201])
    }
    return font
  }

  parse(buffer?: ArrayBuffer): OpenType.Font {
    if ((buffer && buffer !== this.fontBuffer) || !this.fontParsed) {
      this.fontBuffer = buffer!
      this.fontParsed = openType.parse(buffer!)
      // 更新 glyphsOptions
      this.glyphsOptions = new Array(
        Math.ceil((this.fontParsed?.numGlyphs ?? 0) / 100)
      )
        .fill(0)
        .map((_, index: number) => {
          return {
            id: index,
            label: `${100 * index + 1}~${Math.min(
              100 * (index + 1),
              this.fontParsed?.numGlyphs ?? 0
            )}`,
          }
        })
    }
    return this.fontParsed as OpenType.Font
  }

  /**
   * @param glyph
   * @param cellWidth
   * @param padding
   * @returns
   * @desc 计算字体绘制坐标。参考：view-source:https://opentype.js.org/glyph-inspector.html
   */
  getDrawParams(glyph: OpenType.Glyph, cellWidth: number, padding: number) {
    const font = this.fontParsed as OpenType.Font
    const head = font.tables.head
    const maxWidth = head.xMax - head.xMin
    const maxHeight = head.yMax - head.yMin
    const fontScale = Math.min(cellWidth / maxWidth, cellWidth / maxHeight)
    const fontSize = fontScale * font.unitsPerEm
    const glyphWidth = fontScale * (glyph.advanceWidth ?? 0)
    const x = (cellWidth - glyphWidth) / 2 + padding
    const fontBaseline = (cellWidth * head.yMax) / maxHeight + padding
    return {
      x,
      y: fontBaseline,
      fontSize,
    }
  }

  drawSlectedGlyphs(id: number, width = 50) {
    if (!this.fontParsed) {
      throw new Error('not parsed')
    }
    const res: {
      _id: symbol
      dataUrl: string
      index: number
      glyph: OpenType.Glyph
    }[] = []
    const start = id * 100
    const end = Math.min(start + 100, this.fontParsed.numGlyphs)
    const DPR = window.devicePixelRatio
    for (let i = start; i < end; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.height = canvas.style.width = `${width}px`
      canvas.height = canvas.width = width * DPR
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.scale(DPR, DPR)
      const glyph = this.fontParsed.glyphs.get(i)
      const drawParams = this.getDrawParams(glyph, width * 0.9, width * 0.05)

      glyph?.draw(ctx, drawParams.x, drawParams.y, drawParams.fontSize)

      res.push({
        _id: Symbol(),
        dataUrl: canvas.toDataURL(),
        index: i,
        glyph,
      })
    }
    return res
  }

  drawText(text: string, ctx: CanvasRenderingContext2D) {
    if (!this.fontParsed) {
      throw new Error('no font')
    }
    this.fontParsed.draw(ctx, text)
  }

  /**
   * 裁剪字体
   * @param text
   */
  cutFont(text: string) {
    if (!this.fontParsed) {
      throw new Error('no font')
    }
    // 文本去重
    const uniqueText = Array.from(new Set([...text])).join('')
    const glyphs = this.fontParsed.stringToGlyphs(uniqueText)
    let notDef = this.fontParsed.glyphs.get(0)
    if (notDef.name !== '.notdef') {
      notDef = new openType.Glyph({
        name: '.notdef',
        unicode: 0,
        advanceWidth: 650,
        path: new openType.Path(),
      })
    }
    glyphs.unshift(notDef)
    const names = this.fontParsed.names
    const newFont = new openType.Font({
      // 生成的字体只有英文名称，所以这里只选择英文
      // 如果这里用中文，火狐浏览器解析字体会报错：downloadable font: CFF : Failed to parse Name INDEX data ……
      // 谷歌浏览器报错：OTS parsing error: CFF : Failed to parse table
      familyName: names.fontFamily.en || 'custom',
      styleName: names.fontSubfamily.en || 'Regular',
      unitsPerEm: this.fontParsed.unitsPerEm,
      ascender: this.fontParsed.ascender,
      descender: this.fontParsed.descender,
      glyphs,
    })
    return newFont
  }

  /**
   * 设置自定义字体
   * @param font
   * @param name
   * @desc 暂不考虑字体重复和内存膨胀问题
   */
  setCssFont(font: File, name?: string) {
    name = name ?? 'font-' + Math.random().toString().substring(2)
    const url = `url(${URL.createObjectURL(font)})`
    const style = document.createElement('style')
    style.id = name
    style.innerHTML = `
      @font-face {
        font-family: ${name};
        src: ${url}
      }
      `
    document.head.appendChild(style)
    return name
  }

  /**
   * @param name
   * @desc 根据指定名称自动设置 css 字体。在 setCssFont 基础上增加了下载筛选字体的过程
   */
  async setCssFontAuto(name: string) {
    try {
      await this.init()
      const targetFont = this.fontIndex.list.find((item) => item.name === name)
      if (targetFont) {
        const fontFile = await this.loadFont(targetFont)
        if (fontFile) {
          return this.setCssFont(fontFile as File, name)
        }
      }
    } catch (e) {
      console.warn(e)
      return false
    }
  }
}

export default FontService
