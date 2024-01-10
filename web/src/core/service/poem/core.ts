export interface PoemItem {
  _id: number
  title: string
  dynasty: string
  author: string
  content: string
}

export interface AuthorItem {
  _id: number
  name: string
  biography: string
}

export interface PoemDB {
  authors: AuthorItem[]
  poems: PoemItem[]
}

// 本地数据
const local: {
  data: PoemDB
  [x: string]: any
} = {
  data: {
    authors: [],
    poems: [],
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
 * 搜索诗词--分页
 * @param params
 */
function searchPoem(params: {
  keyword: string
  author: string
  page: number
  size: number
}) {
  const res: {
    list: PoemItem[]
    total: number
  } = {
    list: [],
    total: 0,
  }
  const filters: ((p: PoemItem) => boolean)[] = []
  // 作者完全匹配
  if (params.author) {
    filters.push((p: PoemItem) => p.author === params.author)
  }
  // 关键字模糊匹配
  if (params.keyword) {
    filters.push(
      (p: PoemItem) =>
        p.title.includes(params.keyword) ||
        p.author.includes(params.keyword) ||
        p.content.includes(params.keyword)
    )
  }
  const page = params.page ?? 0
  const size = params.size ?? 10
  const start = (page - 1) * size
  const end = start + size
  const filterLen = filters.length
  // 所有诗词查询
  for (let i = 0, len = local.data.poems.length; i < len; i++) {
    const item = local.data.poems[i]
    let flag = true
    // 应用查询函数
    for (let j = 0; j < filterLen; j++) {
      if (!filters[j](item)) {
        flag = false
        break
      }
    }
    if (flag) {
      res.total++
      if (res.total > start && res.total <= end) {
        res.list.push(item)
      }
    }
  }
  return res
}

const core = {
  setData,
  searchPoem,
}

export default core

export type Core = typeof core
