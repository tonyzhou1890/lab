import Service from '../service-base'
import IO from '@/core/io'
import core from './core'
import coreConfig from '@/core/config'

// 所有实例共享的数据
const local: {
  data: string
  inited: boolean
} = {
  data: '',
  inited: false,
}

class PeriodicTableOfElementsService extends Service {
  constructor() {
    super()
  }

  /**
   * 服务初始化
   * @param config
   * @returns
   */
  async init(): Promise<void> {
    if (local.data) {
      local.inited = true
      return
    }
    try {
      // 加载 json 数据
      const data = await IO.loadDepFile<Blob>(
        coreConfig.deps.periodicTableOfElements
      )
      local.data = (await data?.data.text()) ?? ''

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
    if (local.data) {
      local.data = ''
      local.inited = false
    }
  }

  getData() {
    return core.makeTable(JSON.parse(local.data).list)
  }
}

export default PeriodicTableOfElementsService
