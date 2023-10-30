import create, { WorkerInstance } from '@/core/web-worker/create'
import Service from '../service-base'
import worker from './worker?worker'
import IO from '@/core/io'
import type { CoreWorker } from './core'
import type { ServiceInitConfig } from '@/core/typings/general-types'
import { MagickFormat } from '@imagemagick/magick-wasm'
import JSZip from 'jszip'
import Konva from 'konva'
import { svgToPng } from '@/core/utils/image'
import coreConfig from '@/core/config'
import type { ImageEditorServiceCtx } from './date-types'

// 所有实例共享的数据
const local: {
  workerInstance: null | WorkerInstance<CoreWorker>
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
const workerMethods = new Proxy({} as CoreWorker, {
  get(target, prop: keyof CoreWorker) {
    return local.workerInstance?.[prop as keyof CoreWorker]
  },
})

class ImageEditorService extends Service {
  constructor() {
    super()
    this.pack = null
  }

  /**
   * 服务上下文，核心服务，各类插件都可以访问这部分数据
   */
  context: ImageEditorServiceCtx = {
    history: null,
    core: null,
    ui: null,
    stage: null,
    loading: null,
    worker: null,
  }

  pack: Blob | null

  /**
   * 服务初始化
   * @param config
   * @returns
   */
  async init(
    config: ServiceInitConfig & {
      container: HTMLDivElement
    }
  ): Promise<void> {
    if (!this.context.stage) {
      this.context.stage = new Konva.Stage({
        container: config?.container,
      })
    }
    if (local.workerInstance) {
      local.inited = true
      this.context.worker = local.workerInstance
      return
    }
    try {
      // 加载 magick
      const wasm = await IO.loadDepFile<Blob>({
        ...coreConfig.deps.imageMagick,
        loadCallback: config?.loadCallback,
      })
      local.magickWasm = wasm

      // 创建多线程
      const instance = await create<CoreWorker>(worker)
      local.workerInstance = instance
      // 实例化 magick
      const buf = await local.magickWasm.arrayBuffer()
      const uint8Buf = new Uint8Array(buf as ArrayBuffer)
      await local.workerInstance.initializeWasm(uint8Buf)
      this.context.worker = local.workerInstance

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

export default ImageEditorService
