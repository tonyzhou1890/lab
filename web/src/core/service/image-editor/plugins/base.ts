import type { ImageEditorServiceCtx, PluginCfg } from '../date-types'

class Plugin {
  constructor(cfg: PluginCfg) {
    this.name = cfg.name
    this.code = cfg.code
    this.version = cfg.version
    this.ctx = cfg.ctx
  }
  name: string
  code: string
  version: string
  ctx: ImageEditorServiceCtx
  // 子插件
  plugins: Plugin[] = []
  // 父插件
  parent?: Plugin
}

export default Plugin
