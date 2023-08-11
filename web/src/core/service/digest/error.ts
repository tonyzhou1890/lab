import CoreError from '@/core/error'

export enum DigestErrorEnum {
  'Cipher Error' = 901,
  'Cipher Length Error' = 902,
  'Cipher Char Error' = 903,
  'Charset Error' = 910,
}

export class DigestError extends CoreError {
  constructor(code: number) {
    super(code)
    this.coreErrorCode = code
    this.coreErrorMsg = DigestErrorEnum[code]
  }
}
