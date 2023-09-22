import { exportFile } from 'quasar'
import { ExportFileOpts } from '../typings/general-types'

/**
 * 服务类模板
 */
class Service {
  async init() {
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
