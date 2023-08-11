import create, { WorkerInstance } from '@/core/web-worker/create'
import worker from './worker?worker'
export { charset, encryptTypes, decryptTypes } from './core'
import type { Encrypt, Decrypt } from './core'
import CoreError from '@/core/error'
import { DigestError, DigestErrorEnum } from './error'
import type { WorkerCallPromisify } from '@/core/web-worker/create'

export interface Core {
  encrypt: WorkerCallPromisify<Encrypt>
  decrypt: WorkerCallPromisify<Decrypt>
}

const local: {
  workerInstance: null | WorkerInstance<Core>
  inited: boolean
} = {
  workerInstance: null,
  inited: false,
}

/**
 * @name init
 * @description 服务初始化
 */
async function init() {
  if (local.workerInstance) {
    local.inited = true
    return local.workerInstance
  }

  try {
    const instance = await create<Core>(worker)
    local.workerInstance = instance
  } catch (e) {
    throw new Error((e as Error).message)
  }
}

/**
 * @name 结束服务
 * @description 服务结束
 */
function end() {
  if (local.workerInstance) {
    local.workerInstance._terminate()
    local.workerInstance = null
    local.inited = false
  }
}

// type decryptCallback = { total: number, checkedItems: number, result: string, error: CoreError | DigestError } => void
interface DecryptCallbackParameter {
  total: number
  checkedItems: number
  result: string
  error?: CoreError | DigestError
}
type decryptCallback = (param: DecryptCallbackParameter) => void
/**
 * @name decrypt
 * @param type 摘要算法
 * @param cipher 密文
 * @param chars 字符集
 * @param start 开始序号
 * @param end 结束序号（不含）
 * @returns 终止函数
 */
function decrypt(
  type: string,
  cipher: string,
  chars: string[],
  customChars?: string[],
  callback: decryptCallback = () => {
    return undefined
  }
): () => void {
  const status: DecryptCallbackParameter = {
    total: 0,
    checkedItems: 0,
    result: '',
  }

  // 检查字符集
  if (!customChars || !customChars.length) {
    if (!chars.length) {
      callback({
        ...status,
        error: new DigestError(DigestErrorEnum['Charset Error']),
      })
    }
  }

  // 运行中标识
  let flag = true

  // 供外界调用，停止解码
  function _stop() {
    if (flag) {
      flag = false
    }
  }
  return _stop
}

const methods = new Proxy({} as Core, {
  get(target, prop: keyof Core) {
    return local.workerInstance?.[prop as keyof Core]
  },
})

export default {
  worker: methods,
  init,
  end,
  decrypt,
}
