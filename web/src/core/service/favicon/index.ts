import create, { WorkerInstance } from '@/core/web-worker/create'
import Service from '../service-base'
import worker from './worker?worker'
import IO from '@/core/io'
import type { Core } from './core'
import type { ServiceInitConfig } from '@/core/typings/general-types'
import { MagickFormat } from '@imagemagick/magick-wasm'
import JSZip from 'jszip'
import { svgToPng } from '@/core/utils/image'

// 所有实例共享的数据
const local: {
  workerInstance: null | WorkerInstance<Core>
  magickWasm: null | Blob
  inited: boolean
} = {
  workerInstance: null,
  magickWasm: null,
  inited: false,
}

/**
 * 线程里的方法
 */
const workerMethods = new Proxy({} as Core, {
  get(target, prop: keyof Core) {
    return local.workerInstance?.[prop as keyof Core]
  },
})

class FaviconService extends Service {
  constructor() {
    super()
    this.pack = null
  }

  pack: Blob | null

  /**
   * 服务初始化
   * @param config
   * @returns
   */
  async init(config?: ServiceInitConfig): Promise<void> {
    if (local.workerInstance) {
      local.inited = true
      return
    }
    try {
      // 加载 magick
      const wasm = await IO.loadDepFile<Blob>({
        path: '/libs/image-magick/magick.wasm',
        version: '0.0.23',
        loadCallback: config?.loadCallback,
      })
      local.magickWasm = wasm

      // 创建多线程
      const instance = await create<Core>(worker)
      local.workerInstance = instance
      // 实例化 magick
      const buf = await local.magickWasm.arrayBuffer()
      const uint8Buf = new Uint8Array(buf as ArrayBuffer)
      await local.workerInstance.initializeWasm(uint8Buf)

      local.inited = true
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  /**
   * 结束服务
   */
  async end() {
    if (local.workerInstance) {
      local.workerInstance._terminate()
      local.workerInstance = null
      local.inited = false
    }
  }

  /**
   * 生成并下载
   * @param file
   */
  async generate(file: File | Blob): Promise<Blob> {
    // 格式处理
    // 因为 magick 对 svg 的支持依赖于 inkscape，所以这个转换需要自行处理
    console.log(file.type)
    if (file.type === 'image/svg+xml') {
      file = await svgToPng(file, {
        width: 512,
      })
    }
    const buf = await file.arrayBuffer()
    const uint8Arr = new Uint8Array(buf)
    // 打包成 zip
    const pack = new JSZip()

    // ico 文件
    const icoFile = await workerMethods.transformFormat(
      uint8Arr,
      MagickFormat.Ico,
      16
    )

    pack.file('favicon.ico', icoFile)

    // 各种尺寸的 png
    const pngSizes = [512, 384, 256, 192, 128, 96, 32, 16]
    for (let i = 0; i < pngSizes.length; i++) {
      const size = pngSizes[i]
      const pngFile = await workerMethods.transformFormat(
        uint8Arr,
        MagickFormat.Png,
        size
      )
      pack.file(`icons/favicon-${size}x${size}.png`, pngFile)
    }
    this.pack = await pack.generateAsync({ type: 'blob' })
    return this.pack
  }
}

export default FaviconService
