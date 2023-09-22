/**
 * 数据类型基类
 */
export default class DataType {
  value?: any
  print?() {
    undefined
  }
  download?() {
    undefined
  }
}

/**
 * 文件类
 */
export interface FileDataConfig {
  value?: File
  accept?: string
  multiple?: boolean
  maxFileSize?: number // bytes
  maxTotalSize?: number
  maxFiles?: number
}
export class FileData extends DataType implements FileDataConfig {
  constructor(config: FileDataConfig) {
    super()
    Object.assign(this, config)
  }

  value = undefined
  accept = ''
  multiple = false
}
