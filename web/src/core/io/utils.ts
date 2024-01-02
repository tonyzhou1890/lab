import { Loading } from 'quasar'
import { DepLoadCallbackParams } from '@/core/typings/general-types'

export const loading = {
  show() {
    Loading.show({
      message: 'loading_',
    })
  },
  update(params: DepLoadCallbackParams) {
    Loading.show({
      message: `${params.key}<br />${Number(
        (params.percent * 100).toFixed(2)
      )}%`,
      html: true,
    })
  },
  hide() {
    Loading.hide()
  },
}

/**
 * @name matchVersion
 * @param v1
 * @param v2
 * @returns
 * @desc 对比版本，只要主版本一致，缓存就有效
 */
export function matchVersion(v1: string, v2: string) {
  const res = {
    valid: true,
    latest: true,
  }
  if (v1 === v2) return res
  if (v1.split('.')[0] === v2.split('.')[0]) {
    res.latest = false
    return res
  }
  res.valid = false
  res.latest = false
  return res
}

// 获取数据大小
export function getDataSize(data: unknown) {
  const res = {
    size: 0,
    exact: false,
  }
  if (data instanceof Blob || data instanceof File) {
    res.size = data.size
    res.exact = true
    return res
  }
  if (typeof data === 'string') {
    // js 中每个字符两个字节，但这并不准确，因为存在四字节字符以及存储实现差异
    res.size = data.length * 2
    res.exact = false
    return res
  }
  if (ArrayBuffer.isView(data)) {
    res.size = data.byteLength
    res.exact = true
    return res
  }
  return res
}
