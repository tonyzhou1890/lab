import { exportFile } from 'quasar'
import { ExportFileOpts, ServiceInitConfig } from '../typings/general-types'

/**
 * 服务类模板
 */
class Service {
  // 因为服务初始化有异步操作，比如加载依赖。所以初始化不放到 constructor 里面。constructor 无法异步。
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async init(config?: ServiceInitConfig) {
    /** */
  }
  async end() {
    /** */
  }
  saveAs(
    fileName: string,
    rawData: string | ArrayBuffer | ArrayBufferView | Blob,
    opts?: string | ExportFileOpts | undefined
  ) {
    exportFile(fileName, rawData, opts)
  }
}

export default Service
