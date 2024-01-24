import config from '../config'
import { isEmpty } from './validate'

/**
 * 空函数
 */
export function noop() {
  /**  */
}

/**
 * 修改路由中的语言部分
 * @param path
 * @param langIso
 * @returns
 */
export function changePathLangIso(path: string, langIso: string): string {
  const pathArr = path.split('/').filter((v) => v)
  if (
    config.langIsoList.includes(pathArr[0]) ||
    pathArr[0].startsWith(':lang')
  ) {
    pathArr[0] = langIso
  } else {
    pathArr.unshift(langIso)
  }
  return '/' + pathArr.join('/')
}

/**
 * 获取文件名
 */
export function getFileName(file: File | string): string {
  let fullname = ''
  if (typeof file === 'string') {
    fullname = file
  }
  if (file instanceof File) {
    fullname = file.name
  }
  const arr = fullname.split('.').filter((v) => v)
  // 没有文件名
  if (!arr.length) {
    return ''
  } else if (arr.length === 1) {
    // 没有后缀
    return arr[0]
  } else {
    arr.pop()
    return arr.join('.')
  }
}

/**
 * 根据序号获取排列中的字符串(长度从 1 开始，结果字符可重复)
 * @param chars
 * @param index
 * @returns
 * @example
 * ```
 * // 比如 1,2,3,4 四个数。
 * // 一位的排列有四种：1、2、3、4，
 * // 二位的排列有十六种：11、12、13、14、21、22、23……
 * // 序号为 0 的字符串：1
 * // 序号为 4 的字符串：11
 * getPermutationStringByIndex([1,2,3,4], 0) // 1
 * ```
 */
export function getPermutationStringByIndex(chars: string[], index: bigint) {
  const len = BigInt(chars.length)
  // 排列字符串长度从 1 开始
  for (let i = 1n; ; i++) {
    // 当前排列长度的所有可能数量
    const currNumbers = len ** i
    // 如果当前可能数比索引小（索引从 0 开始，所以这里是小于等于），说明当前长度不包含目标字符串
    if (currNumbers <= index) {
      index -= currNumbers
    } else {
      // i 长度第 index 种可能
      let temp = ''
      // 目标字符串，从左到右，计算每一位的字符
      for (let j = 0n; j < i; j++) {
        // chars 中的索引
        let pos = null
        // 目标字符串最后一位
        if (i - j === 1n) {
          index %= BigInt(len)
          pos = index
        } else {
          // 当前位之后的字符串可能的数量
          const currNumbers = len ** (i - j - 1n)
          pos = index / currNumbers
          if (index >= currNumbers) {
            index -= pos * currNumbers
          }
        }

        // temp[j] = chars[pos]
        temp += chars[Number(pos)]
      }
      // return temp.join('')
      return temp
    }
  }
}

/**
 * 格式化 unicode 码为字符串
 * @param index
 * @returns
 */
export function formatUnicode(index?: number) {
  if (isEmpty(index)) {
    return ''
  }
  const strLen = index!.toString().length > 4 ? 4 : 4
  return (
    'U+' +
    index!.toString(16).toUpperCase().padStart(strLen, '0').slice(-strLen)
  )
}

/**
 * @param cfg
 * @returns
 * @desc 获取本地文件
 */
export function getLocalFile(cfg: {
  accept: string
  multiple?: boolean
}): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = cfg.multiple || false
    input.accept = cfg.accept
    input.onchange = () => {
      resolve([].slice.call(input.files))
    }
    input.click()
  })
}

/**
 * 移除括号内容
 * @param str
 */
export function removeBraceletsContent(str: string) {
  return str.replace(/(（.*?）|\[.*?\]|\(.*?\))/g, '').trim()
}

/**
 * 将数组中的部分值根据 map 规则替换
 * @param arr
 * @param map
 */
export function replaceArrayWithMap(
  arr: string[],
  map: { [x: string]: string }
) {
  arr.map((item, index) => {
    if (map[item]) {
      arr[index] = map[item]
    }
  })
  return arr
}
