// import { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import IO from '@/core/io'
import config from '@/core/config'
import { SourceItemCfg } from '@/core/typings/general-types'

export interface NesItemCfg extends SourceItemCfg {
  _id: symbol
  // 封面图
  cover: string
  lang: string
}

class NesService extends Service {
  constructor() {
    super()
  }

  searchCfg = {
    patterns: [
      { field: '' },
      { field: 'lang', values: ['zh-CN', 'en-US', 'ja'] },
    ],
  }

  nesIndex: {
    storeName: string
    langList: string[]
    list: NesItemCfg[]
  } = {
    storeName: 'nes',
    langList: [],
    list: [],
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
    this.nesIndex.list = this.nesIndex.list
      .filter((item) => !item.ignore)
      .map((item) => {
        // 如果有封面地址，就生成绝对路径
        if (item.cover) {
          item.cover = new URL(item.cover, config.deps.nes.url).toString()
        }
        item._id = Symbol()
        // lang
        item.lang = item.lang || 'ja'
        langMap[item.lang] = true
        return item
      })
    this.nesIndex.langList = Object.keys(langMap)
  }

  /**
   * 搜索
   * @param cfg
   * @returns
   */
  search(cfg: { keyword: string; lang: string; page: number; size: number }) {
    const keyword = cfg.keyword?.trim() ?? ''
    const lang = cfg.lang?.trim() ?? ''
    const page = cfg.page ?? 1
    const size = cfg.size ?? 10
    const start = (page - 1) * size
    const end = start + size
    const list: NesItemCfg[] = []
    let total = 0

    const filters = [
      (item: NesItemCfg) => !keyword || item.name.includes(keyword),
      (item: NesItemCfg) => !lang || item.lang === lang,
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
