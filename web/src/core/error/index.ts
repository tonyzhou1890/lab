export enum CoreErrorEnum {
  'Execute Error' = 100,
  'Not Found' = 200,
  'Resource Not Found' = 201,
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
