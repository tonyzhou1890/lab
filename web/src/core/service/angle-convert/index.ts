import CoreError, { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import angleConvert from 'allbox/dist/common.angle-convert'

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
      throw new CoreError(CoreErrorEnum['Execute Error'])
    }
    return res
  }
}

export default AngleConvertService
