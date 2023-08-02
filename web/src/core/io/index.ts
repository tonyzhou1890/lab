import localforage from 'localforage';
import type { AxiosResponse } from 'axios';

export interface IOReadConfig {
  path: string;
  version?: string;
  request?: () => Promise<AxiosResponse<any, any>>;
}

export interface IOData {
  data: unknown;
  version: string;
}

export interface IOWriteConfig {
  path: string;
  version?: string;
  data: unknown;
}

async function read<T>(config: IOReadConfig): Promise<T | null> {
  const data = (await localforage.getItem(config.path)) as
    | IOData
    | undefined
    | null;
  if (data) {
    if (
      (config.version && data.version === config.version) ||
      !config.version
    ) {
      return data.data as T;
    }
  }
  if (typeof config.request === 'function') {
    let res = null;
    try {
      res = await config.request();
    } catch (e) {
      return Promise.reject(e);
    }
    if (res) {
      await write({
        path: config.path,
        version: config.version,
        data: res,
      });
      return res as T;
    }
  }
  return null;
}

async function write(config: IOWriteConfig): Promise<boolean> {
  try {
    await localforage.setItem(config.path, {
      data: config.data,
      version: config.version,
    });
  } catch (e) {
    return false;
  }
  return true;
}

export interface ScriptConfig {
  path: string;
  version?: string;
  cache?: boolean;
}

/**
 * @name 加载脚本
 * @description 加载脚本。因为使用了 script 标签，所以无法在 worker 中使用
 */
async function loadScript(config: ScriptConfig): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const script = document.createElement('script');
    // 如果使用缓存，尝试从缓存读取
    if (config.cache !== false) {
      const res = await read<string>(config);
      if (res) {
        script.innerHTML = res;
        document.body.appendChild(script);
        return resolve(true);
      }
    }
    const src = config.path + (config.version ? `?${config.version}` : '');
    script.src = src;
    script.onload = () => {
      if (config.cache !== false) {
        write({
          ...config,
          data: script.innerHTML,
        });
      }
      resolve(true);
    };
    script.onerror = (e) => reject(e);
    document.body.appendChild(script);
  });
}

export default {
  read,
  write,
  loadScript,
};
