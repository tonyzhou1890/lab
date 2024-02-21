const cacheName = 'fetch-cache'

interface CacheConfigItem {
  reg: RegExp
  head: boolean // 是否通过 head 请求比较文件，默认 true
}
const cacheConfig: CacheConfigItem[] = [
  // 二进制文件，比如谷歌模型文件
  {
    reg: /google.*\.bin$/,
    head: false,
  },
]

function matchCacheRule(url: string) {
  return cacheConfig.find((item) => item.reg.test(url))
}

async function getCache(url: string): Promise<Response | undefined> {
  return await (await caches.open(cacheName))?.match(url)
}

async function setCache(url: string, res: Response) {
  // console.log('setCache: ', url, res)
  // ps: 不能用 localforage，'IDBObjectStore': Response object could not be cloned.
  if (res.status === 200) {
    const cache = await caches.open(cacheName)
    cache.put(url, res)
  }
}

// head 请求，用来判断资源是否变化
async function getHead(request: Request) {
  const req = new Request(request.url, {
    ...request.clone(),
    method: 'HEAD',
  })

  try {
    return await fetch(req)
  } catch (e) {
    return e
  }
}

// event.respondWith 必须同步执行，否则报错： Uncaught (in promise) DOMException: Failed to execute 'respondWith' on 'FetchEvent': The event handler is already finished.
function fetchHandler(e: Event) {
  const event = e as FetchEvent
  const urlObj = new URL(event.request.url)
  const url = urlObj.origin + urlObj.pathname
  let matched: CacheConfigItem | undefined
  if (event.request.method === 'GET' && (matched = matchCacheRule(url))) {
    // console.log('matched')
    event.respondWith(
      (async () => {
        const data = await getCache(url)
        if (data) {
          // 不需要比较文件，直接使用缓存
          if (matched?.head === false) {
            return data
          }

          const remoteData = await getHead(event.request)
          // 缓存有效
          if (
            remoteData instanceof Response &&
            remoteData.headers.get('ETag') === data.headers.get('Etag')
          ) {
            return data
          }
        }
        return fetchData()
      })()
    )
  } else {
    event.respondWith(fetch(event.request))
  }

  function fetchData() {
    return fetch(event.request).then((response) => {
      setCache(url, response.clone())
      return response
    })
  }
}

export default function init() {
  self.addEventListener('fetch', fetchHandler)
}
