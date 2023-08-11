import Crypto from 'crypto-js'
import { getPermutationStringByIndex } from '@/core/utils'
import CoreError, { CoreErrorEnum } from '@/core/error'
import { DigestError, DigestErrorEnum } from './error'

// https://cloud.tencent.com/developer/ask/sof/1400715

/**
 * @name md5
 */
function md5(message: string | ArrayBuffer): string {
  let res: Crypto.lib.WordArray | null = null
  if (typeof message === 'string') {
    res = Crypto.MD5(message)
  }
  if (message instanceof ArrayBuffer) {
    const inputWordArray = Crypto.lib.WordArray.create(
      message as unknown as number[]
    )
    res = Crypto.MD5(inputWordArray)
  }
  return res ? res.toString() : ''
}

/**
 * @name md5 解码
 */
function deMd5(
  chars: string[],
  start: bigint,
  end: bigint,
  cipher: string,
  isSixteen: boolean
): string {
  for (let i = start; i < end; i++) {
    const str = getPermutationStringByIndex(chars, i)
    let res = md5(str)
    // 16 位密文
    if (isSixteen) {
      res = res.substring(8, 24)
    }
    if (md5(str) === cipher) {
      return str
    }
  }
  return ''
}

/**
 * @name encrypt
 * @description 加密操作封装
 */
function encrypt(
  type: string,
  message: string | ArrayBuffer
): string | CoreError {
  const temp = encryptTypes.find((item) => item.name === type)

  if (!temp) {
    const e = new CoreError(CoreErrorEnum['Not Found'])
    return e
  }

  if (temp.name === 'md5') return md5(message)
  return ''
}

/**
 * @name decrypt
 * @param type 摘要算法
 * @param cipher 密文
 * @param chars 字符集
 * @param start 开始序号
 * @param end 结束序号（不含）
 * @returns
 */
function decrypt(
  type: string,
  cipher: string,
  chars: string[],
  start: bigint,
  end: bigint
): string | CoreError | DigestError {
  const temp = decryptTypes.find((item) => item.name === type)

  if (!temp) {
    return new CoreError(CoreErrorEnum['Not Found'])
  }

  // 检查字符集
  if (!chars.length) {
    return new DigestError(DigestErrorEnum['Charset Error'])
  }

  if (temp.name === 'md5') {
    // 检查密文
    if (cipher.length !== 16 && cipher.length !== 32) {
      return new DigestError(DigestErrorEnum['Cipher Length Error'])
    }
    return deMd5(chars, start, end, cipher, cipher.length === 16)
  }

  return ''
}

export default {
  encrypt,
  decrypt,
}
export type MD5 = typeof md5
export type DeMd5 = typeof deMd5
export type Encrypt = typeof encrypt
export type Decrypt = typeof decrypt

/**
 * 字符集
 */
export const charset = [
  {
    name: 'lowercase',
    chars: new Array(26).fill(97).map((item, index) => {
      return String.fromCharCode(item + index)
    }),
    desc: 'a-z',
  },
  {
    name: 'uppercase',
    chars: new Array(26).fill(65).map((item, index) => {
      return String.fromCharCode(item + index)
    }),
    desc: 'A-Z',
  },
  {
    name: 'number',
    chars: new Array(10).fill(48).map((item, index) => {
      return String.fromCharCode(item + index)
    }),
    desc: '0-9',
  },
  {
    name: 'special',
    chars: [...'. @$!%*#_~?&^'],
    desc: '. @$!%*#_~?&^',
  },
]

/**
 * 加密可用方式
 */
export const encryptTypes = [
  {
    name: 'md5',
  },
]

/**
 * 解密可用方式
 */
export const decryptTypes = [
  {
    name: 'md5',
  },
]
