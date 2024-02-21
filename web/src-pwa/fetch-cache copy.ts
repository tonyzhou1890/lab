import localforage from 'localforage'

// 使用 localforage，而不是 service worker 自带的 cache，因为 sw 自带 cache 容量太小（部分浏览器只有 5M）

const forageInstances = {
  fetchCache: localforage.createInstance({
    name: 'default',
    storeName: 'fetch-cache',
  }),
}

const cacheUrlRregs: RegExp[] = [/\/share\/audio\/didididi\.mp3$/]

function matchCacheRule(url: string) {
  console.log(url)
  return cacheUrlRregs.some((item) => item.test(url))
}

async function getCache<T>(url: string): Promise<T | null> {
  return await forageInstances.fetchCache.getItem(url)
}

function setCache(url: string, res: Response) {
  forageInstances.fetchCache.setItem(url, res)
}

// head 请求，用来判断资源是否变化
async function getHead(request: Request) {
  console.log(request)
  try {
    return await fetch(request)
  } catch (e) {
    return e
  }
}

// 不能用同步，否则报错：fetch-cache.ts:55 Uncaught (in promise) DOMException: Failed to execute 'respondWith' on 'FetchEvent': The event handler is already finished.
async function fetchHandler(e: Event) {
  const event = e as FetchEvent
  console.log(event)
  const urlObj = new URL(event.request.url)
  const url = urlObj.origin + urlObj.pathname
  if (event.request.method === 'GET' && matchCacheRule(url)) {
    // const data = await getCache<Response>(url)
    // if (data) {
    //   console.log(data)
    //   const remoteData = await getHead(event.request)
    //   // 缓存有效
    //   if (
    //     remoteData instanceof Response &&
    //     remoteData.headers.get('ETag') === data.headers.get('Etag')
    //   ) {
    //     event.respondWith(remoteData)
    //     return
    //   }
    // }
    event.respondWith(
      // getCache<Response>(url).then((data) => {
      //   if (data) {
      //     return getHead(event.request).then((remoteData) => {
      //       if (
      //         remoteData instanceof Response &&
      //         remoteData.headers.get('ETag') === data.headers.get('Etag')
      //       ) {
      //         return remoteData
      //       } else {
      //         return fetchData()
      //       }
      //     })
      //   } else {
      //     return fetchData()
      //   }
      // })
      (async () => {
        const data = await getCache<Response>(url)
        if (data) {
          console.log(data)
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
      // fetch(event.request).then((response) => {
      //   console.log(response)
      //   // response.clone()
      //   return response
      // })
    )
  } else {
    event.respondWith(fetch(event.request))
  }

  function fetchData() {
    return fetch(event.request).then((response) => {
      console.log(response)
      // response.clone()
      return response
    })
  }
}

export default function init() {
  self.addEventListener('fetch', fetchHandler)
}
