// import { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import { Archive } from 'libarchive.js'

Archive.init({
  workerUrl: '/libs/libarchive.js/dist/worker-bundle.js',
})

class FileManagerService extends Service {
  /**
   * 从压缩包获取单个文件
   * @param file
   * @param path
   * @returns
   */
  static async extractSingleFile(file: File, path: string) {
    const zip = await Archive.open(file)
    // console.log(zip)
    const target = await zip.extractSingleFile(path)
    // console.log(target)
    return target
  }
}

export default FileManagerService
