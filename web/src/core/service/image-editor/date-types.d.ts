import type { WorkerInstance } from '@/core/web-worker/create'
import type Konva from 'konva'
import type { CoreWorker } from './core'

// 服务上下文
export interface ImageEditorServiceCtx {
  history: null | any[]
  core: null
  ui: null
  stage: null | Konva.Stage
  worker: null | WorkerInstance<CoreWorker>
  loading: null
}

// 插件初始化参数
export interface PluginCfg {
  code: string
  name: string
  version: string
  ctx: ImageEditorServiceCtx
}
