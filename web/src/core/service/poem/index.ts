import create, { WorkerInstance } from '@/core/web-worker/create'
import Service from '../service-base'
import worker from './worker?worker'
import IO from '@/core/io'
import type { Core, PoemDB } from './core'
import type { ServiceInitConfig } from '@/core/typings/general-types'
import JSZip from 'jszip'
import coreConfig from '@/core/config'

// 所有实例共享的数据
const local: {
  workerInstance: null | WorkerInstance<Core>
  data: null | Blob
  inited: boolean
} = {
  workerInstance: null,
  data: null,
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

  /**
   * 服务初始化
   * @param config
   * @returns
   */
  async init(
    config?: {
      data?: Blob
    } & ServiceInitConfig
  ): Promise<void> {
    if (local.workerInstance) {
      local.inited = true
      return
    }
    try {
      // 如果有数据，直接使用
      if (config?.data) {
        local.data = config.data
      } else {
        // 加载数据
        const blolData = await IO.loadDepFile<Blob>({
          ...coreConfig.deps.poem,
          loadCallback: config?.loadCallback,
        })
        local.data = blolData
      }

      // 解压数据
      const zip = new JSZip()
      const data = await zip.loadAsync(local.data, {
        optimizedBinaryString: true,
      })
      let poemData: PoemDB | null = null
      for (const key in data.files) {
        if (!data.files[key].dir && data.files[key].name === 'poem.json') {
          const jsonStr = await data.file(data.files[key].name)?.async('string')
          if (!jsonStr) {
            throw new Error('Resource Not Found')
          } else {
            poemData = JSON.parse(jsonStr)
          }
        }
      }

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
    const blobData = await IO.read<Blob>(coreConfig.deps.poem)
    if (blobData) {
      await this.init({
        data: blobData,
      })
      return true
    } else {
      return false
    }
  }

  worker = workerMethods
}

export default PoemService
