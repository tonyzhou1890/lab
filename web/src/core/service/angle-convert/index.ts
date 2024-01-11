import { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import angleConvert from 'allbox/dist/other.angle-convert'

export type AngleType = 'D' | 'R'

class AngleConvertService extends Service {
  constructor() {
    super()
  }

  // 角度类型
  typeList = ['D', 'R']

  convert(
    source: number,
    sourceType: AngleType,
    targetType: AngleType
  ): number {
    let res = 0
    try {
      res = angleConvert(source, sourceType, targetType)
    } catch (e) {
      throw new Error(CoreErrorEnum[100])
    }
    return res
  }
}

export default AngleConvertService
