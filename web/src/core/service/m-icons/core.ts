export interface IconsData {
  key: string
  label?: string
  icons: {
    label: string
    icon: string
  }
}

/**
 * 将 material design 图标驼峰名称转成 q-icon 需要的下划线名称
 * @param str
 */
export function mStringToIconName(str: string, prefix?: string): string {
  str = str.replace(/([A-Z]|[0-9]+)/g, '_$1').toLowerCase()
  if (!prefix) {
    return str.replace(/^mat_/, '')
  }
  if (prefix === 'o_') {
    return prefix + str.replace(/^outlined_/, '')
  }
  if (prefix === 'r_') {
    return prefix + str.replace(/^round_/, '')
  }
  if (prefix === 's_') {
    return prefix + str.replace(/^sharp_/, '')
  }
  return str
}

/**
 * 过滤数据
 * @param data
 * @param filter
 * @returns
 */
export function filterMapList(data: IconsData[], filter: string): IconsData[] {
  return data.map((item) => {
    return {
      ...item,
      icons: item.icons.filter(
        (icon) => !filter || icon.label.includes(filter)
      ),
    }
  })
}

export default {
  mStringToIconName,
  filterMapList,
}
