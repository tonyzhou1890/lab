// import { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import IO from '@/core/io'
import config from '@/core/config'
import { SourceItemCfg } from '@/core/typings/general-types'
import type { SearchPatternCfg } from 'allbox/dist/other.search-pattern-check'

export interface SNESItemCfg extends SourceItemCfg {
  _id: symbol
  // 封面图
  cover: string
  // 标签
  tags: string[]
  // 语言
  lang: string[]
  // 版本
  edition: string[]
}

class SNESService extends Service {
  constructor() {
    super()
  }

  searchCfg: SearchPatternCfg = {
    patterns: [{ field: '' }, { field: 'tag', multiple: true, seperator: ',' }],
  }

  gameIndex: {
    storeName: string
    list: SNESItemCfg[]
    langList: string[]
    factorList: string[]
    typeList: string[]
    editionList: string[]
    invincible: boolean
  } = {
    storeName: 'snes',
    list: [],
    langList: [],
    factorList: [],
    typeList: [],
    editionList: [],
    invincible: false,
  }

  /**
   * @desc 初始化，主要是拉取游戏列表
   */
  async init(): Promise<void> {
    const data = await IO.loadDepFile<Blob>({
      key: 'snes',
      ...config.deps.snes,
    })
    Object.assign(this.gameIndex, JSON.parse((await data?.data.text()) ?? '{}'))
    const langMap: { [x: string]: boolean } = {}
    const editionMap: { [x: string]: boolean } = {}
    this.gameIndex.list = this.gameIndex.list
      .filter((item) => !item.ignore)
      .map((item) => {
        // 生成封面绝对路径
        item.cover = new URL(
          item.cover || `./${item.name}.png`,
          config.deps.snes.url
        ).toString()
        item._id = Symbol()
        // lang
        if (!item.lang?.length) {
          // 默认日语
          item.lang = ['ja']
          item.tags = [...(item.tags || []), 'ja', '日文']
        }
        item.lang = item.lang?.length ? item.lang : ['ja']

        item.lang.map((v) => (langMap[v] = true))
        // 版本
        item.edition?.map((edition) => {
          editionMap[edition] = true
        })
        return item
      })

    this.gameIndex.langList = Object.keys(langMap)
    this.gameIndex.editionList = Object.keys(editionMap)
  }

  /**
   * 搜索
   * @param cfg
   * @returns
   */
  search(cfg: { keyword: string; tags: string[]; page: number; size: number }) {
    const keyword = cfg.keyword?.trim() ?? ''
    const tags = (cfg.tags ?? [])
      .map((item) => item.trim())
      .filter((item) => item)
    const page = cfg.page ?? 1
    const size = cfg.size ?? 10
    const start = (page - 1) * size
    const end = start + size
    const list: SNESItemCfg[] = []
    let total = 0

    const filters = [
      (item: SNESItemCfg) => !keyword || item.name.includes(keyword),
      (item: SNESItemCfg) =>
        !tags.length || tags.every((tag) => item.tags.includes(tag)),
    ]
    this.gameIndex.list.forEach((item) => {
      if (filters.every((f) => f(item))) {
        total++
        if (total > start && total <= end) {
          list.push(item)
        }
      }
    })
    return {
      list,
      total,
    }
  }
}

export default SNESService
