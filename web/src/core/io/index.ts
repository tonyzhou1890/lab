import localforage from 'localforage'
import type { AxiosResponse } from 'axios'
import { apiBundle } from '@/boot/axios'
import { DepLoadCallbackParams } from '@/core/types/general-types'
import { noop } from '../utils'

const forageInstances = {
  deafult: localforage.createInstance({
    name: 'default',
  }),
}

export interface IOReadConfig {
  path: string
  version?: string
  request?: () => Promise<AxiosResponse<any, any>>
}

export interface IOData {
  data: unknown
  version: string
}

export interface IOWriteConfig {
  path: string
  version?: string
  data: unknown
}

export interface ScriptConfig {
  path: string
  version?: string
  cache?: boolean
  loadCallback?: (params: DepLoadCallbackParams) => void
}

const baseIO = {
  store: forageInstances.deafult,
  async read<T>(config: IOReadConfig): Promise<T | null> {
    const data = (await this.store.getItem(config.path)) as
      | IOData
      | undefined
      | null
    if (data) {
      if (
        (config.version && data.version === config.version) ||
        !config.version
      ) {
        return data.data as T
      }
    }
    if (typeof config.request === 'function') {
      let res = null
      try {
        res = await config.request()
      } catch (e) {
        return Promise.reject(e)
      }
      if (res) {
        await this.write({
          path: config.path,
          version: config.version,
          data: res,
        })
        return res as T
      }
    }
    return null
  },
  async write(config: IOWriteConfig): Promise<boolean> {
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
}

const defaultIO = {
  ...baseIO,
  /**
   * @name 加载脚本
   * @description 加载脚本。因为使用了 script 标签，所以无法在 worker 中使用
   */
  async loadScript(config: ScriptConfig): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const script = document.createElement('script')
      // 如果使用缓存，尝试从缓存读取
      if (config.cache !== false) {
        const res = await this.read<string>(config)
        if (res) {
          script.innerHTML = res
          document.body.appendChild(script)
          return resolve(true)
        }
      }
      const src = config.path + (config.version ? `?${config.version}` : '')
      const res = await apiBundle.IOAPI!.get<string, string>(src, {
        withCredentials: false,
      })
      script.innerHTML = res
      script.onerror = (e) => reject(e)
      document.body.appendChild(script)
      // 缓存
      if (config.cache !== false) {
        this.write({
          ...config,
          data: script.innerHTML,
        })
      }
      resolve(true)
    })
  },
  /**
   * @name 加载依赖文件
   */
  async loadDepFile<T>(config: ScriptConfig): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const cb =
        typeof config.loadCallback === 'function' ? config.loadCallback : noop
      // 如果使用缓存，尝试从缓存读取
      if (config.cache !== false) {
        const res = await this.read<T>(config)
        if (res) {
          cb({
            depName: config.path,
            percent: 1,
            status: 3,
          })
          return resolve(res)
        }
      }
      const src = config.path + (config.version ? `?${config.version}` : '')
      const res = await apiBundle
        .IOAPI!.get<any, T>(src, {
          responseType: 'blob',
          withCredentials: false,
          onDownloadProgress: (progressEvent) => {
            let percent = 0
            if (progressEvent.total) {
              percent = progressEvent.loaded / progressEvent.total
            }
            cb({
              depName: config.path,
              percent,
              status: percent === 1 ? 3 : 2,
            })
          },
        })
        .catch((e) => reject(e))
      console.log(res)
      if (res) {
        // 缓存
        if (config.cache !== false) {
          this.write({
            ...config,
            data: res,
          })
        }
        resolve(res)
      }
    })
  },
}

export default defaultIO
