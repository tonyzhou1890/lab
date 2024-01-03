import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { Notify } from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// 这个 api 用来加载脚本、依赖文件等，以后请求后台的 axios 实例不是这个。请求后台接口的实例为了避免状态交叉污染，需要在 boot 函数里创建。

const apiBundle: {
  IOAPI?: AxiosInstance
} = {}

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  // 无鉴权文件读取 api
  const IOAPI = axios.create({ baseURL: '/' })
  apiBundle.IOAPI = IOAPI
  //       so you can easily perform requests against your app's API
  // 请求拦截
  IOAPI.interceptors.request.use(
    (config) => {
      // 需要 oss 设置，目前只能设置单文件
      // config.headers.set('Cache-Control', 'no-cache')
      return config
    },
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  IOAPI.interceptors.response.use(
    (response) => {
      // apiData 是 API 返回的数据
      const apiData = response.data as any
      return apiData
    },
    (error) => {
      Notify.create(error)
      return Promise.reject(error)
    }
  )
})

export { apiBundle }
