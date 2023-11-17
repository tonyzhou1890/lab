import Service from '../service-base'
import core from './core'
import type { ComposerTranslation } from 'vue-i18n'
import type { IconsData } from './core'

// 所有实例共享的数据
const local: {
  data: IconsData[] | null
  inited: boolean
} = {
  data: null,
  inited: false,
}

class MIconsService extends Service {
  constructor() {
    super()
  }

  /**
   * 服务初始化
   * @param config
   * @returns
   */
  async init(): Promise<void> {
    if (local.data) {
      local.inited = true
      return
    }
    try {
      // 加载 icon 数据
      const mIcons = await import('@quasar/extras/material-icons')
      const outlinedIcons = await import(
        '@quasar/extras/material-icons-outlined'
      )
      const roundIcons = await import('@quasar/extras/material-icons-round')
      const sharpIcons = await import('@quasar/extras/material-icons-sharp')

      local.data = [
        {
          key: 'm',
          icons: Object.entries(mIcons).map((item) => {
            return {
              label: core.mStringToIconName(item[0]),
              icon: item[1] as string,
            }
          }),
        },
        {
          key: 'outlined',
          icons: Object.entries(outlinedIcons).map((item) => {
            return {
              label: core.mStringToIconName(item[0], 'o_'),
              icon: item[1] as string,
            }
          }),
        },
        {
          key: 'round',
          icons: Object.entries(roundIcons).map((item) => {
            return {
              label: core.mStringToIconName(item[0], 'r_'),
              icon: item[1] as string,
            }
          }),
        },
        {
          key: 'sharp',
          icons: Object.entries(sharpIcons).map((item) => {
            return {
              label: core.mStringToIconName(item[0], 's_'),
              icon: item[1] as string,
            }
          }),
        },
      ]

      local.inited = true
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  /**
   * 结束服务
   */
  async end() {
    if (local.data) {
      local.data = null
      local.inited = false
    }
  }

  /**
   * 一次性获取所有数据
   * @returns
   */
  getData() {
    if (!local.data) return []
    else return local.data
  }

  /**
   * 过滤数据并本地化
   * @param data
   * @param filter
   * @param t
   * @returns
   */
  filterList(data: IconsData[], filter: string, t: ComposerTranslation) {
    return core.filterMapList(data, filter).map((item) => {
      item.label = t(`mIcons.tabs.${item.key}`)
      return item
    })
  }
}

export default MIconsService
