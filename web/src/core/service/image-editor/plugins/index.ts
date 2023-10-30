import type { ImageEditorServiceCtx } from '../date-types'
import Plugin from './base'
import LayersPlugin from './layers'

class Plugins extends Plugin {
  constructor(ctx: ImageEditorServiceCtx) {
    super({
      code: 'ImageEditor',
      name: 'ImageEditor',
      version: '0.0.1',
      ctx,
    })
    this.plugins.push(new LayersPlugin(ctx))
  }
}

export default Plugins
