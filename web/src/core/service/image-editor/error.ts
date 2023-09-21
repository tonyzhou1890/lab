import CoreError from '@/core/error'

export enum ImageErrorEnum {}

export class ImageError extends CoreError {
  constructor(code: number) {
    super(code)
    this.coreErrorCode = code
    this.coreErrorMsg = ImageErrorEnum[code]
  }
}
