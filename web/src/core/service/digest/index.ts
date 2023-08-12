import create, { WorkerInstance } from '@/core/web-worker/create'
import worker from './worker?worker'
export { charset, encryptTypes, decryptTypes } from './core'
import type { Encrypt, Decrypt } from './core'
import CoreError, { CoreErrorEnum } from '@/core/error'
import { DigestError } from './error'
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
export interface DecryptCallbackParameter {
  total: bigint
  checkedItems: bigint
  speed: bigint // unit: items/s
  timeRemaining: bigint
  result: string
  error?: CoreError | DigestError
}
type decryptCallback = (param: DecryptCallbackParameter) => void
/**
 * @name decrypt
 * @param type 摘要算法
 * @param cipher 密文
 * @param sourceLength 明文最大长度
 * @param chars 字符集
 * @param callback 解码进度回调
 * @returns 终止函数
 */
function decrypt(
  type: string,
  cipher: string,
  sourceLength: number,
  chars: string[],
  callback: decryptCallback = () => {
    return undefined
  }
): () => void {
  sourceLength = Math.max(0, sourceLength)

  const status: DecryptCallbackParameter = {
    total: BigInt(chars.length) ** BigInt(sourceLength),
    checkedItems: 0n,
    speed: 0n,
    timeRemaining: 0n,
    result: '',
  }

  // 运行中标识
  let flag = true
  // 一次爆破的量
  const groupNumbers = 1000n
  // 开始时间
  const startTime = Date.now()
  // 开始爆破
  brutalForce(0n)

  // 供外界调用，停止解码
  function _stop() {
    if (flag) {
      flag = false
    }
  }

  // 爆破
  function brutalForce(start = 0n) {
    if (!flag) return
    // 一万个可能性为一组，线程数的十倍作为一批
    const indexList = []
    const threads = local.workerInstance?._workerNum ?? 1
    for (let i = 0; i < threads * 10; i++) {
      if (start < status.total) {
        let end = start + groupNumbers
        if (end > status.total) {
          end = status.total
        }
        indexList.push([start, end])
        start = end
      }
    }

    indexList.length &&
      Promise.all(
        indexList.map((item) =>
          local.workerInstance?.decrypt?.(type, cipher, chars, item[0], item[1])
        )
      )
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            // 进度更新
            status.checkedItems += groupNumbers
            if (status.checkedItems > status.total) {
              status.checkedItems = status.total
            }
            // 速度和剩余时间
            if (status.total) {
              status.speed =
                status.checkedItems /
                BigInt(Math.round((Date.now() - startTime) / 1000) || 1)
              status.timeRemaining =
                (status.total - status.checkedItems) / status.speed
            }

            // 如果出错，结束
            if (typeof res[i] !== 'string') {
              callback({
                ...status,
                error: res[i] as CoreError & DigestError,
              })
              _stop()
              return
            }

            // 找到结果或者全部尝试完毕，结束
            if (res[i] || status.checkedItems === status.total) {
              _stop()
              status.result = res[i] as string
              status.timeRemaining = 0n
              callback({ ...status })
              return
            }
          }

          // 进度回调
          callback({ ...status })

          // 递归调用
          brutalForce(start)
        })
        .catch((e) => {
          _stop()
          const temp = new CoreError(CoreErrorEnum['Execute Error'])
          temp.coreErrorFullMsg = e?.message ?? ''
          callback({
            ...status,
            error: temp,
          })
        })
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
