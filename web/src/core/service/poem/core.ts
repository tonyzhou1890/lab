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
 * 搜索诗词--标题、作者、内容包含即可，不分页
 * @param keyword
 */
function searchPoem(keyword: string) {
  const res = []
  for (let i = 0, len = local.data.poems.length; i < len; i++) {
    const item = local.data.poems[i]
    if (
      item.title.includes(keyword) ||
      item.author.includes(keyword) ||
      item.content.includes(keyword)
    ) {
      res.push(item)
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
