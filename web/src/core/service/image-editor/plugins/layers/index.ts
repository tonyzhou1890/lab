import { ImageEditorServiceCtx } from '../../date-types'
import Plugin from '../base'

class LayersPlugin extends Plugin {
  constructor(ctx: ImageEditorServiceCtx) {
    super({
      name: 'Layers',
      code: 'Layers',
      version: '0.0.1',
      ctx,
    })
  }

  getLayers() {
    return this.ctx.stage?.getLayers()
  }
}

export default LayersPlugin
