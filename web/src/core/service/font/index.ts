import type * as OpenType from 'opentype.js'
import openType from 'opentype.js'
import Service from '../service-base'

class FontService extends Service {
  constructor() {
    super()
  }

  fontList: string[] = []
  fontBuffer: null | ArrayBuffer = null
  fontParsed: null | OpenType.Font = null
  glyphsOptions: { id: number; label: string }[] = []

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

  getDrawParams(glyph: OpenType.Glyph, cellWidth: number, padding: number) {
    const font = this.fontParsed as OpenType.Font
    const scale = cellWidth / font.unitsPerEm
    const x = (cellWidth - (glyph.advanceWidth ?? 0) * scale) / 2 + padding
    const head = font.tables.head
    const maxHeight = head.yMax - head.yMin
    const fontBaseline = (cellWidth * head.yMax) / maxHeight + padding
    return {
      x,
      y: fontBaseline,
    }
  }

  drawSlectedGlyphs(id: number, width = 50) {
    if (!this.fontParsed) {
      throw new Error('not parsed')
    }
    const res: {
      _id: number
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
      const drawParams = this.getDrawParams(glyph, width * 0.7, width * 0.15)

      glyph?.draw(ctx, drawParams.x, drawParams.y, width * 0.7)

      res.push({
        _id: Math.random(),
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
}

export default FontService
