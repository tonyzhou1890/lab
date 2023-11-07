import create, { WorkerInstance } from '@/core/web-worker/create'
import Service from '../service-base'
import worker from './worker?worker'
import IO from '@/core/io'
import type { Core, IdiomDB } from './core'
import type { ServiceInitConfig } from '@/core/typings/general-types'
import JSZip from 'jszip'
import coreConfig from '@/core/config'
import CoreError, { CoreErrorEnum } from '@/core/error'

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

class IdiomService extends Service {
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
        const blobData = await IO.loadDepFile<Blob>({
          ...coreConfig.deps.idiom,
          loadCallback: config?.loadCallback,
        })
        local.data = blobData
      }

      // 解压数据
      const zip = new JSZip()
      const data = await zip.loadAsync(local.data, {
        optimizedBinaryString: true,
      })
      let chengYuData: IdiomDB | null = null
      for (const key in data.files) {
        console.log(data.files)
        if (!data.files[key].dir && data.files[key].name === 'idiom.json') {
          const jsonStr = await data.file(data.files[key].name)?.async('string')
          if (!jsonStr) {
            return Promise.reject(
              new CoreError(CoreErrorEnum['Resource Not Found'])
            )
          } else {
            chengYuData = JSON.parse(jsonStr)
          }
        }
      }
      if (!chengYuData) {
        return Promise.reject(
          new CoreError(CoreErrorEnum['Resource Not Found'])
        )
      }

      // 创建多线程
      const instance = await create<Core>(worker, 1)
      local.workerInstance = instance
      await local.workerInstance.setData('data', chengYuData)

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
    const blobData = await IO.read<Blob>(coreConfig.deps.idiom)
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

export default IdiomService
