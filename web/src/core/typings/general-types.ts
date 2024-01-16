/**
 * 服务通用依赖（非脚本类型）加载回调参数
 */
export interface DepLoadCallbackParams {
  storeName?: string
  key?: string
  percent: number
  /**
   * 0--未开始
   * 1--请求中
   * 2--加载中
   * 3--已完成
   * 4--错误
   */
  status: 0 | 1 | 2 | 3 | 4
  error?: Error
}

/**
 * 服务初始化配置
 */
export interface ServiceInitConfig {
  loadCallback?: (params: DepLoadCallbackParams) => void
}

/**
 * 文件导出
 */
export interface ExportFileOpts {
  mimeType?: string
  byteOrderMark?: string | Uint8Array
  encoding?: string
}

/**
 * 远程列表单个资源配置
 */
export interface SourceItemCfg {
  name: string
  path: string
  version: string
  compressedSize: number
  ignore?: boolean
}
