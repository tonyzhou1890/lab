export enum CoreErrorEnum {
  'Not Found' = 100,
  'Resource Not Found' = 101,
  'Inner Error' = 200,
  'Custom' = 900,
}

export default class CoreError {
  constructor(code: number) {
    this.coreErrorCode = code
    this.coreErrorMsg = CoreErrorEnum[code]
    this.coreErrorFullMsg = ''
  }
  coreErrorCode
  coreErrorMsg
  coreErrorFullMsg
}
