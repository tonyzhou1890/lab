export interface IdiomItem {
  word: string
  phonetic: string
  definition: string
  source: string
  example: string
  synonyms: string
  antonyms: string
  wisecrack: string
  grammar: string
  english: string
  franch: string
  japanese: string
  german: string
  russian: string
  story: string
  chain?: string[]
  phoneticChain?: string[]
}

export interface IndexItem {
  word: string
  items: string[]
}

export interface IdiomDB {
  indices: IndexItem[]
  records: IdiomItem[]
}

// 本地数据
const local: {
  data: IdiomDB
  recordsMap: {
    [x: string]: IdiomItem
  }
  [x: string]: any
} = {
  data: {
    indices: [],
    records: [],
  },
  recordsMap: {},
}

/**
 * 设置数据
 * @param key
 * @param value
 * @returns
 */
function setData<T>(key: string, value: T): boolean {
  local[key] = value
  // map 缓存，加速搜索
  if (key === 'data') {
    for (let i = 0; i < (value as IdiomDB).records.length; i++) {
      const item = (value as IdiomDB).records[i]
      local.recordsMap[item.word.replaceAll('，', '')] = item
    }
  }
  return true
}

/**
 * 模糊搜索
 * @param keyword
 */
function fuzzySearch(keyword: string) {
  if (!keyword) {
    return []
  }
  const startMatchList: string[] = []
  const includeList: string[] = []
  for (let i = 0; i < local.data.records.length; i++) {
    const item = local.data.records[i]
    // 先尝试开头匹配
    if (item.word.startsWith(keyword)) {
      startMatchList.push(item.word)
    } else if (includeList.length < 20) {
      // 再尝试正则
      try {
        const reg = new RegExp(keyword)
        if (reg.test(item.word)) {
          includeList.push(item.word)
        }
      } catch (e) {
        // 正则报错就尝试包含
        if (item.word.includes(keyword)) {
          includeList.push(item.word)
        }
      }
    }
    if (startMatchList.length >= 20) {
      break
    }
  }
  return [...startMatchList, ...includeList].slice(0, 20)
}

/**
 * 搜索成语--完全匹配
 * @param keyword
 */
function searchIdiom(
  keyword: string,
  cfg?: {
    simple?: boolean // 简洁模式，没有成语接龙
  }
) {
  const res = local.recordsMap[keyword.replaceAll('，', '')]
  // 成语接龙
  if (res && !cfg?.simple) {
    res.chain = []
    res.phoneticChain = []
    // 同字
    const endChar = [...res.word].pop() ?? ''
    local.data.records.forEach((val) => {
      if (val.word.startsWith(endChar)) {
        res.chain?.push(val.word)
      }
    })
    // 同音
    const endPhonetic =
      (res.phonetic ?? '')
        .split(/\s/)
        .filter((v) => v)
        .pop() ?? ''
    local.data.records.forEach((val) => {
      const startPhonetic = (val.phonetic ?? '')
        .split(/\s/)
        .filter((v) => v)
        .shift()

      if (startPhonetic === endPhonetic) {
        res.phoneticChain?.push(val.word)
      }
    })
  }
  return res
}

const core = {
  setData,
  fuzzySearch,
  searchIdiom,
}

export default core

export type Core = typeof core
