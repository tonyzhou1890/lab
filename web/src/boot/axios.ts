import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import getTypeName from 'allbox/dist/common.get-type-name'

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
const api = axios.create({ baseURL: '/' })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
  // 请求拦截
  api.interceptors.request.use(
    (config) => config,
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  api.interceptors.response.use(
    (response) => {
      // apiData 是 API 返回的数据
      const apiData = response.data as any
      const type = getTypeName(apiData)
      if (type === 'String') {
        return apiData
      }
      // 这个 Code 是和后端约定的业务 Code
      const { error, code } = apiData

      if (code !== 0) {
        // 添加 message 是为了业务页面可以直接调用 Toast 提示
        return Promise.reject({
          ...(apiData || {}),
          message: error,
        })
      } else {
        return apiData
      }
    },
    (error) => {
      // Status 是 HTTP 状态码
      const status = error?.response?.status
      console.log(error)
      switch (status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求地址出错'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP 版本不受支持'
          break
        default:
          break
      }
      return Promise.reject(error)
    }
  )
})

export { api }
