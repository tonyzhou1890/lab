import create, { WorkerInstance } from '@/core/web-worker/create'
import worker from './worker?worker'
import io from '@/core/io'
import type { Core } from './core'
import type { ServiceInitConfig } from '@/core/types/general-types'
import type Fabric from 'fabric'
import { uid } from 'quasar'
import type { ComposerTranslation } from 'vue-i18n'

// 所有实例共享的数据
const local: {
  workerInstance: null | WorkerInstance<Core>
  fabric?: typeof Fabric.fabric
  magickWasm: null | Blob
  inited: boolean
  editorInstances: ImageEditor[]
} = {
  workerInstance: null,
  magickWasm: null,
  inited: false,
  editorInstances: [],
}

/**
 * @name init
 * @description 服务初始化
 */
async function init(config?: ServiceInitConfig) {
  if (local.workerInstance) {
    local.inited = true
    return local.workerInstance
  }

  try {
    // 加载 magick
    const wasm = await io.loadDepFile<Blob>({
      path: '/libs/image-magick/magick.wasm',
      version: '0.0.23',
      loadCallback: config?.loadCallback,
    })
    local.magickWasm = wasm
    console.log('wasm: ', wasm)
    // 创建超线程
    const instance = await create<Core>(worker)
    local.workerInstance = instance
    // 实例化 magick
    const buf = await local.magickWasm.arrayBuffer()
    const uint8Buf = new Uint8Array(buf as ArrayBuffer)
    await local.workerInstance.initializeWasm(uint8Buf)
    // 加载 fabric
    const fabric = (await import('fabric')).default.fabric
    local.fabric = fabric

    local.inited = true
  } catch (e) {
    console.log(e)
    throw e
  }
}

/**
 * @name 结束服务
 * @description 服务结束
 */
function end() {
  if (local.workerInstance) {
    local.workerInstance._terminate()
    local.workerInstance = null
    local.editorInstances.map((item) => item.destroy())
    local.inited = false
  }
}

/**
 * 线程里的方法
 */
const workerMethods = new Proxy({} as Core, {
  get(target, prop: keyof Core) {
    return local.workerInstance?.[prop as keyof Core]
  },
})

interface ImageEditorConfig {
  canvas?: HTMLCanvasElement
  t: ComposerTranslation
}

/**
 * 编辑器类，比较粗糙，将就用吧。其实应该将 fabric、magick 和自定义方法作为底层封装的，但是……太麻烦了，就这样吧。
 */
export class ImageEditor {
  constructor(config: ImageEditorConfig) {
    this.t = config.t
    if (!local.inited) {
      throw new Error(this.t('global.error.Not Initialized'))
    }
    this.id = uid()
    this.Fabric = local.fabric!
    const rect = config.canvas?.getBoundingClientRect() ?? null
    console.log(rect)
    this.canvas = new local.fabric!.Canvas(
      config.canvas ?? this.id,
      rect ? { width: rect.width, height: rect.height } : undefined
    )
    Object.assign(this, workerMethods)
    local.editorInstances.push(this)
  }
  id: string
  t: ComposerTranslation
  Fabric: typeof Fabric.fabric
  canvas: Fabric.fabric.Canvas
  /**
   * 销毁当前实例
   */
  destroy() {
    this.canvas.dispose()
    local.editorInstances = local.editorInstances.filter(
      (item) => item !== this
    )
  }
}

export default {
  init,
  end,
  ImageEditor,
}
