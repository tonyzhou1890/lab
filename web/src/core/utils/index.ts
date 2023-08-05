import config from '../config'

/**
 * 修改路由中的语言部分
 * @param path
 * @param langIso
 * @returns
 */
export function changePathLangIso(path: string, langIso: string): string {
  const pathArr = path.split('/').filter((v) => v)
  if (!config.langIsoList.includes(pathArr[0])) {
    pathArr.unshift(langIso)
  } else {
    pathArr[0] = langIso
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
