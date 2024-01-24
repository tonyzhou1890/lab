// import { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import IO from '@/core/io'
import config from '@/core/config'
import { SourceItemCfg } from '@/core/typings/general-types'
import type { SearchPatternCfg } from 'allbox/dist/other.search-pattern-check'

export interface NesItemCfg extends SourceItemCfg {
  _id: symbol
  // 封面图
  cover: string
  // 标签
  tags: string[]
  // 语言
  lang: string[]
  // 厂商
  factor: string[]
  // 版本
  edition: string[]
  // 类型
  type: string[]
  // 无敌
  invincible: boolean
}

class NesService extends Service {
  constructor() {
    super()
  }

  searchCfg: SearchPatternCfg = {
    patterns: [{ field: '' }, { field: 'tag', multiple: true, seperator: ',' }],
  }

  nesIndex: {
    storeName: string
    list: NesItemCfg[]
    langList: string[]
    factorList: string[]
    typeList: string[]
    editionList: string[]
    invincible: boolean
  } = {
    storeName: 'nes',
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
      key: 'nes',
      ...config.deps.nes,
    })
    Object.assign(this.nesIndex, JSON.parse((await data?.data.text()) ?? '{}'))
    const langMap: { [x: string]: boolean } = {}
    const factorMap: { [x: string]: boolean } = {}
    const typeMap: { [x: string]: boolean } = {}
    const editionMap: { [x: string]: boolean } = {}
    let invincible = false
    this.nesIndex.list = this.nesIndex.list
      .filter((item) => !item.ignore)
      .map((item) => {
        // 生成封面绝对路径
        item.cover = new URL(
          item.cover || `./${item.name}.png`,
          config.deps.nes.url
        ).toString()
        item._id = Symbol()
        // lang
        if (!item.lang?.length) {
          // 默认日语
          item.lang = ['ja']
          item.tags = [...(item.tags || []), 'ja', '日文']
        }
        item.lang = item.lang?.length ? item.lang : ['ja']
        item.tags
        langMap[item.lang[0]] = true
        // 厂商
        item.factor?.map((factor) => {
          factorMap[factor] = true
        })
        // 类型
        item.type?.map((type) => {
          typeMap[type] = true
        })
        // 版本
        item.edition?.map((edition) => {
          editionMap[edition] = true
        })
        invincible = invincible || item.invincible
        return item
      })

    this.nesIndex.langList = Object.keys(langMap)
    this.nesIndex.factorList = Object.keys(factorMap)
    this.nesIndex.typeList = Object.keys(typeMap)
    this.nesIndex.editionList = Object.keys(editionMap)
    this.nesIndex.invincible = invincible
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
    const list: NesItemCfg[] = []
    let total = 0

    const filters = [
      (item: NesItemCfg) => !keyword || item.name.includes(keyword),
      (item: NesItemCfg) =>
        !tags.length || tags.every((tag) => item.tags.includes(tag)),
    ]
    this.nesIndex.list.forEach((item) => {
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

export default NesService
