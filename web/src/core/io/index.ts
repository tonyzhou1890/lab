import localforage from 'localforage'
import type LocalForage from 'localforage'
import { apiBundle } from '@/boot/axios'
import { DepLoadCallbackParams } from '@/core/typings/general-types'
import { noop } from '../utils'
import { matchVersion, getDataSize } from './utils'
import getTypeName from 'allbox/dist/other.get-type-name'
import { StringKeyObjType } from 'allbox/dist/types'

const defaultName = 'default'
const metaname = 'metadata'
const storeMetadataName = 'storeMetadata'
// 存储实例
const forageInstances: {
  [x: string]: LocalForage
} = {
  // 默认存储仓库--未指定 storeName 的资源会存在这里
  deafult: localforage.createInstance({
    name: defaultName,
    storeName: defaultName,
  }),
  // 仓库元数据
  metadata: localforage.createInstance({
    name: defaultName,
    storeName: metaname,
  }),
}

// 读取参数
export interface IOReadConfig<T> {
  key?: string
  storeName?: string
  version?: string
  cache?: boolean
  request?: () => Promise<T>
  /**
   * 其他元信息
   */
  extra?: StringKeyObjType
}

// 读取结果
export interface IOData<T> {
  data: T
  version?: string
  // 当前是否为最新
  latest: boolean
}

// 写入参数
export interface IOWriteConfig<T> {
  key: string
  storeName?: string
  version?: string
  /**
   * 其他元信息
   */
  extra?: StringKeyObjType
  data: T
}

// 仓库元数据
export interface StoreMetadata {
  storeName: string
  data: {
    key: string
    version?: string
    size: number
    exact: boolean
    type: string
    /**
     * 其他元信息
     */
    extra?: StringKeyObjType
    created: string
    updated: string
  }[]
}

// 加载依赖参数
export interface DepLoadConfig {
  key?: string
  storeName?: string
  url: string
  version?: string
  cache?: boolean
  script?: boolean
  loadCallback?: (params: DepLoadCallbackParams) => void
}

// 获取仓库实例，如果没有，创建
function getStore(storeName = defaultName) {
  if (!forageInstances[storeName]) {
    forageInstances[storeName] = localforage.createInstance({
      name: defaultName,
      storeName,
    })
  }
  return forageInstances[storeName]
}

/**
 * 这里不需要使用 class，因为 IO 没有内部状态，没有实例化隔离数据的必要
 */
const IO = {
  /**
   * 读取仓库元数据
   * @param storeName
   * @returns
   */
  async getStoreMetadata(storeName?: string) {
    try {
      const metaStore = getStore(metaname)
      const list =
        (await metaStore.getItem<StoreMetadata[]>(storeMetadataName)) ?? []
      return list.filter((item) =>
        storeName ? item.storeName === storeName : true
      )
    } catch (e) {
      throw e
    }
  },

  /**
   * 读取数据
   * @desc
   * 这个 read 用来根据 key 读取本地缓存文件。
   * 或者在本地不存在的情况下，依据是否配置了请求函数进行远程请求并缓存。
   * @param config
   * @returns
   */
  async read<T>(config: IOReadConfig<T>): Promise<IOData<T> | null> {
    const storeName = config.storeName || defaultName
    const store = getStore(storeName)
    const metaStore = getStore(metaname)
    // 如果没有指定不使用缓存，先从缓存读取
    if (config.key && config.cache !== false) {
      // 元数据
      const metadata = (
        await metaStore.getItem<StoreMetadata[]>(storeMetadataName)
      )?.find((item) => item.storeName === storeName)
      const dataInfo = metadata?.data?.find((item) => item.key === config.key)
      // 元数据预判断
      if (dataInfo) {
        // console.log('dataInfo: ', dataInfo, config)
        const matched =
          // 没有版本号，则缓存一直有效
          !dataInfo.version || !config.version
            ? {
                valid: true,
                latest: true,
              }
            : matchVersion(dataInfo.version, config.version)
        if (matched.valid) {
          // 预判断有效的情况下，获取缓存
          const data = await store.getItem<T>(config.key)
          if (data) {
            return {
              data,
              version: dataInfo.version,
              latest: matched.latest,
            }
          }
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
      if (res && config.key && config.cache !== false) {
        await this.write({
          key: config.key,
          storeName: config.storeName,
          version: config.version,
          data: res,
          extra: config.extra,
        })
      }
      return {
        data: res,
        version: config.version,
        latest: true,
      }
    }
    return null
  },
  /**
   * 写入数据，后期会加入远程写入
   * @param config
   * @returns
   */
  async write<T>(config: IOWriteConfig<T>): Promise<boolean> {
    const storeName = config.storeName || defaultName
    const store = getStore(storeName)
    const metaStore = getStore(metaname)
    try {
      await store.setItem(config.key, config.data)

      // 元数据
      const metadataList =
        (await metaStore.getItem<StoreMetadata[]>(storeMetadataName)) || []
      let metadata = metadataList.find((item) => item.storeName === storeName)
      if (!metadata) {
        metadata = {
          storeName,
          data: [],
        }
        metadataList.push(metadata)
      }
      let dataInfo = metadata?.data?.find((item) => item.key === config.key)
      const dataSize = getDataSize(config.data)
      const type = getTypeName(config.data)
      if (!dataInfo) {
        dataInfo = {
          key: config.key,
          version: config.version,
          size: dataSize.size,
          exact: dataSize.exact,
          type,
          extra: config.extra,
          created: Date(),
          updated: Date(),
        }
        metadata.data.push(dataInfo)
      } else {
        Object.assign(dataInfo, {
          key: config.key,
          version: config.version,
          size: dataSize.size,
          exact: dataSize.exact,
          type,
          extra: config.extra,
          updated: Date(),
        })
      }

      await metaStore.setItem(storeMetadataName, metadataList)
    } catch (e) {
      throw e
    }
    return true
  },
  /**
   * 删除数据
   * @param config
   */
  async remove(config: { storeName: string; key: string }) {
    try {
      const store = getStore(config.storeName)
      await store.removeItem(config.key)

      const metaStore = getStore(metaname)
      const metadataList =
        (await metaStore.getItem<StoreMetadata[]>(storeMetadataName)) || []
      const metadata = metadataList?.find(
        (item) => item.storeName === config.storeName
      ) ?? {
        storeName: config.storeName,
        data: [],
      }
      metadata.data = metadata.data.filter((item) => item.key !== config.key)

      await metaStore.setItem(storeMetadataName, metadataList)
    } catch (e) {
      throw e
    }
  },
  /**
   * 清空数据库
   * @param storeName
   */
  async clear(storeName?: string) {
    if (!storeName) {
      const storeList = Object.values(forageInstances)
      for (let i = 0; i < storeList.length; i++) {
        await storeList[i].clear()
      }
    } else {
      const store = getStore(storeName)
      await store.clear()

      if (storeName !== metaname) {
        const metaStore = getStore(metaname)
        const metadataList = (
          (await metaStore.getItem<StoreMetadata[]>(storeMetadataName)) || []
        ).filter((item) => item.storeName === storeName)

        await metaStore.setItem(storeMetadataName, metadataList)
      }
    }
  },
  /**
   * @name 加载依赖文件
   */
  async loadDepFile<T>(config: DepLoadConfig): Promise<IOData<T> | null> {
    return new Promise(async (resolve, reject) => {
      const cb =
        typeof config.loadCallback === 'function' ? config.loadCallback : noop
      const src = config.url + (config.version ? `?${config.version}` : '')
      const request = () => {
        // 确保不读取浏览器缓存
        return apiBundle.IOAPI!.get<any, T>(
          src + `${src.includes('?') ? '&' : '?'}t=${Date.now()}`,
          {
            responseType: config.script === true ? 'text' : 'blob',
            withCredentials: false,
            onDownloadProgress: (progressEvent) => {
              let percent = 0
              if (progressEvent.total) {
                percent = progressEvent.loaded / progressEvent.total
              }
              cb({
                storeName: config.storeName,
                key: config.key,
                percent,
                status: percent === 1 ? 3 : 2,
              })
            },
          }
        )
      }
      try {
        const readRes = await this.read<T>({
          storeName: config.storeName,
          key: config.key,
          version: config.version,
          cache: config.cache,
          request,
          extra: {
            src,
          },
        })
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
          script.innerHTML = (readRes?.data ?? '') as string
        }
        // 非脚本，直接完成
        cb({
          key: config.key,
          percent: 1,
          status: 3,
        })
        resolve(readRes)
      } catch (e) {
        return reject(e)
      }
    })
  },
}

if (process.env.CLIENT) {
  console.log('browser')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.IO = IO
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.localforage = localforage
}

export default IO
