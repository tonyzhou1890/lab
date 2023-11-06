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
  [x: string]: any
} = {
  data: {
    indices: [],
    records: [],
  },
}

/**
 * 设置数据
 * @param key
 * @param value
 * @returns
 */
function setData<T>(key: string, value: T): boolean {
  local[key] = value
  return true
}

/**
 * 搜索成语--完全匹配
 * @param keyword
 */
function searchIdiom(keyword: string) {
  const res = local.data.records.find((item) => item.word === keyword)
  // 成语接龙
  if (res) {
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
      if (val.phonetic?.startsWith?.(endPhonetic)) {
        res.phoneticChain?.push(val.word)
      }
    })
  }
  return res
}

const core = {
  setData,
  searchIdiom,
}

export default core

export type Core = typeof core
