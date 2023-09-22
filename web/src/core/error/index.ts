export enum CoreErrorEnum {
  'Execute Error' = 100,
  'Not Initialized' = 101,
  'Not Found' = 200,
  'Resource Not Found' = 201,
  // worker
  'Action Not Found' = 202,
  'Custom' = 900,
}

export default class CoreError {
  constructor(code: number) {
    this.coreErrorCode = code
    this.coreErrorMsg = CoreErrorEnum[code] ?? 'Unknown Error'
    // 该字段有值的时候，直接提示，否则根据 coreErrorMsg 翻译
    this.coreErrorFullMsg = ''
  }
  coreErrorCode
  coreErrorMsg
  coreErrorFullMsg
}
