import localforage from 'localforage'
import { apiBundle } from '@/boot/axios'
import { DepLoadCallbackParams } from '@/core/typings/general-types'
import { noop } from '../utils'

const forageInstances = {
  deafult: localforage.createInstance({
    name: 'default',
  }),
}

export interface IOReadConfig<T> {
  path: string
  version?: string
  cache?: boolean
  request?: () => Promise<T>
}

export interface IOData<T> {
  data: T
  version: string
}

export interface IOWriteConfig<T> {
  path: string
  version?: string
  data: T
}

export interface DepLoadConfig {
  path: string
  version?: string
  cache?: boolean
  script?: boolean
  loadCallback?: (params: DepLoadCallbackParams) => void
}

/**
 * 这里不需要使用 class，因为 IO 没有内部状态，没有实例化隔离数据的必要
 */
const IO = {
  store: forageInstances.deafult,
  /**
   * 读取数据
   * @desc
   * 这个 read 用来根据 path 读取本地缓存文件。
   * 或者在本地不存在的情况下，依据是否配置了请求函数进行远程请求并缓存。
   * @param config
   * @returns
   */
  async read<T>(config: IOReadConfig<T>): Promise<T | null> {
    // 如果没有指定不使用缓存，先从缓存读取
    if (config.cache !== false) {
      const data = await this.store.getItem<IOData<T>>(config.path)
      if (data) {
        if (
          (config.version && data.version === config.version) ||
          !config.version
        ) {
          return data.data as T
        }
      }
    }
    // 配置了请求函数，就从远程获取文件
    if (config.request) {
      let res: T | null = null
      try {
        res = (await config.request()) as T
      } catch (e) {
        return Promise.reject(e)
      }
      // 缓存
      if (res && config.cache !== false) {
        await this.write({
          path: config.path,
          version: config.version,
          data: res,
        })
      }
      return res as T
    }
    return null
  },
  /**
   * 写入数据，后期会加入远程写入
   * @param config
   * @returns
   */
  async write<T>(config: IOWriteConfig<T>): Promise<boolean> {
    try {
      await this.store.setItem(config.path, {
        data: config.data,
        version: config.version,
      })
    } catch (e) {
      return false
    }
    return true
  },
  /**
   * @name 加载依赖文件
   */
  async loadDepFile<T>(config: DepLoadConfig): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const cb =
        typeof config.loadCallback === 'function' ? config.loadCallback : noop
      const src = config.path + (config.version ? `?${config.version}` : '')
      const request = () => {
        return apiBundle.IOAPI!.get<any, T>(src, {
          responseType: config.script === true ? 'text' : 'blob',
          withCredentials: false,
          onDownloadProgress: (progressEvent) => {
            let percent = 0
            if (progressEvent.total) {
              percent = progressEvent.loaded / progressEvent.total
            }
            cb({
              path: config.path,
              percent,
              status: percent === 1 ? 3 : 2,
            })
          },
        })
      }
      try {
        const readRes = (await this.read<T>({
          path: config.path,
          version: config.version,
          cache: config.cache,
          request,
        })) as T
        // 如果是脚本，需要通过 script 解析
        if (config.script === true) {
          let script = document.querySelector(
            `script[raw-src="${src}"]`
          ) as HTMLScriptElement
          if (!script) {
            script = document.createElement('script')
            script.setAttribute('raw-src', src)
            document.body.appendChild(script)
          }
          script.onerror = (e) => reject(e)
          // innerText 会导致无法正确解析，比如出现 <br> 标签
          script.innerHTML = readRes as string
          cb({
            path: config.path,
            percent: 1,
            status: 3,
          })
          resolve(readRes)
        } else {
          // 非脚本，直接完成
          cb({
            path: config.path,
            percent: 1,
            status: 3,
          })
          resolve(readRes)
        }
      } catch (e) {
        return reject(e)
      }
    })
  },
}

export default IO
