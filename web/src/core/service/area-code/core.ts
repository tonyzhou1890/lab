export interface AreaCodeData {
  province_list: {
    [x: string]: string
  }
  city_list: {
    [x: string]: string
  }
  county_list: {
    [x: string]: string
  }
}

export interface AreaCodeTreeNode {
  label: string
  code: string
  children: AreaCodeTreeNode[]
}

/**
 * 生成地区树
 * @param areaCodeData
 * @returns
 */
function makeTree(areaCodeData: AreaCodeData): AreaCodeTreeNode[] {
  const provinceKeys = Object.keys(areaCodeData.province_list)
  const cityKeys = Object.keys(areaCodeData.city_list)
  const countyKeys = Object.keys(areaCodeData.county_list)

  const list: AreaCodeTreeNode[] = []
  provinceKeys.forEach((provinceCode) => {
    const province: AreaCodeTreeNode = {
      label: areaCodeData.province_list[provinceCode],
      code: provinceCode,
      children: [],
    }
    const provinceCodePrefix = provinceCode.substring(0, 2)
    console.log(provinceCodePrefix)
    // 获取市
    cityKeys.forEach((cityCode) => {
      if (cityCode.startsWith(provinceCodePrefix)) {
        const city: AreaCodeTreeNode = {
          label: areaCodeData.city_list[cityCode],
          code: cityCode,
          children: [],
        }
        province.children.push(city)
        const cityCodePrefix = cityCode.substring(0, 4)
        // 获取区县
        countyKeys.forEach((countyCode) => {
          if (countyCode.startsWith(cityCodePrefix)) {
            city.children.push({
              label: areaCodeData.county_list[countyCode],
              code: countyCode,
              children: [],
            })
          }
        })
      }
    })
    list.push(province)
  })

  return list
}

export default {
  makeTree,
}
