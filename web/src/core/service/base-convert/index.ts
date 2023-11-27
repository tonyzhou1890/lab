import CoreError, { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import baseConvert from 'allbox/dist/number.base-convert'

class BaseConvertService extends Service {
  constructor() {
    super()
  }

  baseTable = '0123456789abcdefghijklmnopqrstuvwxyz'

  baseList: number[] = new Array(36).fill(2).map((item, index) => {
    return item + index
  })

  convert(
    source: string,
    sourceBase: number,
    targetBase: number,
    sourceTable = '',
    targetTable = ''
  ): string {
    console.log(sourceBase, targetBase)
    if (sourceBase <= 36) {
      sourceTable = this.baseTable.slice(0, sourceBase)
    }
    if (targetBase <= 36) {
      targetTable = this.baseTable.slice(0, targetBase)
    }
    let res = ''
    try {
      console.log(sourceTable, targetTable)
      res = baseConvert(source, [...sourceTable], [...targetTable])
    } catch (e) {
      console.log(e)
      throw new CoreError(CoreErrorEnum['Execute Error'])
    }
    return res
  }

  purifyBaseStr(baseStr: string): string {
    return [...new Set(baseStr.replace(/[\s\.\\\/'"`]/g, ''))].join('')
  }
}

export default BaseConvertService
