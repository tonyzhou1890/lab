import Service from '../service-base'
import IO from '@/core/io'
import IdiomService from '../idiom'
import { IdiomItem } from '../idiom/core'
import type { ServiceInitConfig } from '@/core/typings/general-types'
import coreConfig from '@/core/config'

export interface IdiomGroup {
  key: string
  list: IdiomItem[]
}

export class UsualIdiomService extends Service {
  constructor() {
    super()
  }

  data: IdiomGroup[] = []

  /**
   * 服务初始化
   * @param config
   * @returns
   */
  async init(
    config?: {
      data?: Blob
    } & ServiceInitConfig
  ): Promise<void> {
    try {
      // 加载数据
      const data = await IO.loadDepFile<Blob>({
        ...coreConfig.deps.usualIdiom,
        loadCallback: config?.loadCallback,
      })
      const list = (await data!.data.text()).split('\n').filter((v) => v)

      // 获取词典
      const idiomService = new IdiomService()
      console.log(list, idiomService)
      await idiomService.init({
        loadCallback: config?.loadCallback,
      })
      console.log('search')
      // 查询
      let groupedList: IdiomGroup[] = []
      for (let i = 0; i < list.length; i++) {
        if (/^[a-z]$/.test(list[i])) {
          groupedList.push({
            key: list[i],
            list: [],
          })
        } else {
          const idiomItem = await idiomService.worker.searchIdiom(list[i], {
            simple: true,
          })
          if (idiomItem && groupedList.length) {
            groupedList[groupedList.length - 1].list.push(idiomItem)
          }
        }
      }
      groupedList = groupedList.filter((item) => item.list.length)
      this.data = groupedList
      console.log(list, groupedList)
      return
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

export default UsualIdiomService
