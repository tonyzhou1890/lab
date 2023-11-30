import CoreError, { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import bmi from 'allbox/dist/common.bmi'

class BMIService extends Service {
  constructor() {
    super()
    const length =
      this.standards[this.standards.length - 1].value[1] -
      this.standards[0].value[0]
    this.standards.map((item, idx) => {
      item.percent =
        ((item.value[1] - this.standards[0].value[0]) / length) * 100
      item.diffPercent = idx
        ? item.percent - this.standards[idx - 1].percent
        : item.percent
    })
  }

  standards = [
    {
      key: 'thin',
      value: [14, 18.5], // 14 只是作为标尺最左侧限值
      percent: 0,
      diffPercent: 0,
    },
    {
      key: 'normal',
      value: [18.5, 24],
      percent: 0,
      diffPercent: 0,
    },
    {
      key: 'weight',
      value: [24, 28],
      percent: 0,
      diffPercent: 0,
    },
    {
      key: 'fat',
      value: [28, 32], // 32 只是作为标尺右侧限值
      percent: 0,
      diffPercent: 0,
    },
  ]

  calc(height: number, weight: number): number {
    let res = 0
    try {
      res = bmi(height, weight)
    } catch (e) {
      throw new CoreError(CoreErrorEnum['Execute Error'])
    }
    return res
  }

  // 标准定位
  locate(value: number): {
    index: number
    tag: string
    percent: number
  } {
    const res = {
      index: -1,
      tag: '',
      percent: 0,
    }
    this.standards.map((item, idx) => {
      console.log(value, item.value[1])
      if (value >= item.value[0]) {
        res.index = idx
        res.tag = item.key
        console.log({ ...res })
      }
    })
    // 没有匹配到任何区间，说明没有超过第一个区间左限值
    if (res.index === -1) {
      res.index = 0
      res.tag = this.standards[0].key
    }
    const lastEl = this.standards[this.standards.length - 1]
    res.percent =
      Math.min(
        Math.max(value - this.standards[0].value[0], 0) /
          (lastEl.value[1] - this.standards[0].value[0]),
        1
      ) * 100
    return res
  }
}

export default BMIService
