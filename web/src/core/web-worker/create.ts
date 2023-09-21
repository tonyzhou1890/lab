import CoreError from '../error'
/**
 * worker job type
 */
export interface WorkerJobType {
  action: string
  param?: Array<unknown>
}

/**
 * worker job wrap type
 */
export interface WorkerJobWrapType<T> {
  _sign: number
  job: WorkerJobType
  p: {
    resolve: (value: T) => void
    reject: (value: unknown) => void
  }
}

/**
 * worker call promisify
 */
export type WorkerCallPromisify<T extends (...args: any) => any> = (
  ...rest: Parameters<T>
) => Promise<ReturnType<T>>

/**
 * worker instance
 */
export interface WorkerInner {
  _terminate: () => void
  _workerNum: number
}
export type WorkerInstance<T> = T & WorkerInner

async function create<T extends { [x: string]: any }>(
  w: string | (new () => Worker),
  threadNum?: number
) {
  const type = typeof w
  if (type !== 'string' && type !== 'function') {
    throw new Error('worker 参数类型错误')
  }

  // 函数返回值类型
  type R = Promise<ReturnType<T[string]>>

  const workerNum =
    threadNum ?? Math.max(window.navigator.hardwareConcurrency - 1, 1) // 线程数量
  const quene = new Map()
  const waiting: Array<WorkerJobWrapType<R>> = []
  const workers = new Array(workerNum).fill(null).map((_, index) => {
    return {
      index,
      worker:
        type === 'string'
          ? new Worker(w as string)
          : new (w as new () => Worker)(),
      idle: true, // 是否空闲
    }
  })

  workers.map((item) => {
    item.worker.addEventListener('message', (e) => {
      if (e.data?._sign) {
        const { errorCode, errorMsg, _sign, result, action } = e.data
        const queneItem = quene.get(_sign)
        // 发生错误
        if (errorCode !== undefined) {
          const error = new CoreError(errorCode)
          error.coreErrorFullMsg = errorMsg || ''
          queneItem.p.reject({
            action,
            error,
          })
        } else {
          // 返回结果
          queneItem.p.resolve(result)
        }
        quene.delete(e.data._sign)
        item.idle = true
        // 尝试接受新任务
        assignJob()
      }
    })
  })

  /**
   * 将等待队列中的任务加入空闲线程
   */
  function assignJob() {
    let idleWorker = null
    let waitingJob = null
    if (waiting.length) {
      idleWorker = workers.find((item) => item.idle)
      if (idleWorker) {
        idleWorker.idle = false
        waitingJob = waiting.shift() as WorkerJobWrapType<R>
        quene.set(waitingJob._sign, waitingJob)

        idleWorker.worker.postMessage({
          ...waitingJob.job,
          _sign: waitingJob._sign,
        })
      }
    }
  }

  /**
   * 结束多线程
   */
  function _terminate() {
    workers.map((item) => {
      item.worker.terminate()
    })
  }

  const fns = new Proxy(
    {
      _terminate,
      _workerNum: workerNum,
    } as T & WorkerInner,
    {
      get(target, prop) {
        /**
         * https://juejin.cn/post/6847902216028848141
         * 因为 promise 的 then 会链式调用，所以，为了中断调用，这里返回一个永远 pending 的 promise。
         */
        if (prop === 'then') {
          return new Promise(() => {
            /** */
          })
        }
        if (['_terminate', '_workerNum'].includes(prop as string)) {
          return target[prop as string]
        }
        return function (...rest: Parameters<T[string]>): R {
          return new Promise((resolve, reject) => {
            const _sign = Date.now() * Math.random()
            waiting.push({
              _sign,
              job: {
                action: prop as string,
                param: rest,
              },
              p: { resolve, reject },
            } as WorkerJobWrapType<R>)
            // 分配线程
            assignJob()
          })
        }
      },
    }
  )

  return Promise.resolve(fns)
}

export default create
