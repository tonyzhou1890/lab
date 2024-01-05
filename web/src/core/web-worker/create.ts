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
export interface WorkerJobWrapType<T = any> {
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

  const waiting: Array<WorkerJobWrapType<R>> = []
  const workers: {
    index: number
    worker: Worker
    task: WorkerJobWrapType | null
  }[] = new Array(workerNum).fill(null).map((_, index) => {
    return {
      index,
      worker:
        type === 'string'
          ? new Worker(w as string)
          : new (w as new () => Worker)(),
      task: null,
    }
  })

  workers.map((item) => {
    item.worker.addEventListener('message', (e) => {
      const task = item.task
      // 任务发出的消息
      if (task && task?._sign === e.data?._sign) {
        const { error, result } = e.data
        // 发生错误
        if (error) {
          task.p.reject(typeof error === 'string' ? new Error(error) : error)
        } else {
          // 返回结果
          task.p.resolve(result)
        }
        item.task = null
        // 尝试接受新任务
        assignJob()
      }
    })
    item.worker.addEventListener('error', (e) => {
      const task = item.task
      // 执行任务过程出错
      if (task) {
        task.p.reject(e)
        item.task = null
        assignJob()
      }
    })
  })

  /**
   * 将等待队列中的任务加入空闲线程
   */
  function assignJob() {
    let idleWorker = null

    if (waiting.length) {
      idleWorker = workers.find((item) => !item.task)
      if (idleWorker) {
        idleWorker.task = waiting.shift() as WorkerJobWrapType<R>

        idleWorker.worker.postMessage({
          ...idleWorker.task.job,
          _sign: idleWorker.task._sign,
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
