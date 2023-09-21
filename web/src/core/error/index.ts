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
    this.coreErrorFullMsg = ''
  }
  coreErrorCode
  coreErrorMsg
  coreErrorFullMsg
}
