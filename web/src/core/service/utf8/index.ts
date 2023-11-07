import Service from '../service-base'

class Utf8Service extends Service {
  constructor() {
    super()
    this.textEncoder = new TextEncoder()
    this.textDecoder = new TextDecoder()
  }

  textEncoder: TextEncoder
  textDecoder: TextDecoder

  encode(str: string) {
    return this.textEncoder.encode(str)
  }

  decode(buf: Uint8Array) {
    return this.textDecoder.decode(buf)
  }

  /**
   * 解析 utf8 字符串
   * @param str
   */
  utf8StringParse(str: string): Uint8Array | boolean {
    str = str.trim()
    const arr: number[] = []
    if (str.length === 0) {
      return false
    }
    // 数组标识检查
    if (str[0] !== '[' || str[str.length - 1] !== ']') {
      return false
    }
    const strArr = str.slice(1, -1).split(',')
    for (let i = 0; i < strArr.length; i++) {
      const num = Number(strArr[i])
      if (num < 0 || num > 255 || num >> 0 !== num) {
        return false
      }
      arr[i] = num
    }
    return new Uint8Array(arr)
  }
}

export default Utf8Service
