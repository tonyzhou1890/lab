import create, { WorkerInstance } from '@/core/web-worker/create'
import Service from '../service-base'
import worker from './worker?worker'
import IO, { IOData } from '@/core/io'
import type { Core, PoemDB, PoemItem } from './core'
import type { ServiceInitConfig } from '@/core/typings/general-types'
import FileManagerService from '../file-manager'
import coreConfig from '@/core/config'

// 所有实例共享的数据
const local: {
  workerInstance: null | WorkerInstance<Core>
  data: null | Blob
  latest: boolean
  inited: boolean
} = {
  workerInstance: null,
  data: null,
  latest: false,
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

class PoemService extends Service {
  constructor() {
    super()
  }

  searchCfg = {
    patterns: [{ field: '' }, { field: 'author' }],
  }

  /**
   * 服务初始化
   * @param config
   * @returns
   */
  async init(
    config?: {
      data?: IOData<Blob>
    } & ServiceInitConfig
  ): Promise<void> {
    if (local.workerInstance) {
      local.inited = true
      return
    }
    try {
      // 如果有数据，直接使用
      if (config?.data) {
        local.data = config.data.data
        local.latest = config.data.latest
      } else {
        // 加载数据
        const data = await IO.loadDepFile<Blob>({
          key: 'poem',
          ...coreConfig.deps.poem,
          loadCallback: config?.loadCallback,
        })
        local.data = data!.data
        local.latest = data!.latest
      }

      // 解压数据
      const file = await FileManagerService.extractSingleFile(
        new File([local.data], ''),
        'poem.json'
      )
      const poemData: PoemDB | null = JSON.parse(await file.text())

      // 创建多线程
      const instance = await create<Core>(worker, 1)
      local.workerInstance = instance
      await local.workerInstance.setData('data', poemData)

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
      local.data = null
      local.workerInstance = null
      local.inited = false
    }
  }

  /**
   * 初始化本地依赖
   * @returns
   */
  async initLocalDep(): Promise<boolean> {
    const blobData = await IO.read<Blob>({
      key: 'poem',
      ...coreConfig.deps.poem,
    })
    if (blobData?.data) {
      await this.init({
        data: blobData,
      })
      return true
    } else {
      return false
    }
  }

  /**
   * @param list
   * @param name
   * @returns
   * @desc 生成 md 字符串
   */
  generateMd(list: PoemItem[], name: string) {
    const md = `# ${name}\r\n\r\n${list
      .map((item) => {
        return `## ${item.title}\r\n\r\n${
          item.dynasty ? '[' + item.dynasty + ']' : ''
        }${item.author}\r\n\r\n${item.content.replace(/[\r\n]+/g, '\r\n\r\n')}`
      })
      .join('\r\n\r\n')}`
    return md
  }

  worker = workerMethods
}

export default PoemService
