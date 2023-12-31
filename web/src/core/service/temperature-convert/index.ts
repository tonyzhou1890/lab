import CoreError, { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import temperatureConvert from 'allbox/dist/common.temperature-convert'

export type TempType = 'C' | 'F' | 'K'

class TemperatureConvertService extends Service {
  constructor() {
    super()
  }

  // 温度类型
  typeList = ['C', 'F', 'K']

  convert(source: number, sourceType: TempType, targetType: TempType): number {
    let res = 0
    try {
      res = temperatureConvert(source, sourceType, targetType)
    } catch (e) {
      throw new CoreError(CoreErrorEnum['Execute Error'])
    }
    return res
  }
}

export default TemperatureConvertService
