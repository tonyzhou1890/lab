/**
 * CoreError 类会在 worker 中使用，而 errorNotify 用到 quasar，所以不能将这里的方法合并到 index.ts 文件中，否则 quasar 会报错：window is not defined
 */
import { Notify } from 'quasar'
import type { ComposerTranslation } from 'vue-i18n'

export interface ErrorNotifyConfig {
  i18nKey?: string
  silence?: boolean
  t: ComposerTranslation
}

/**
 * 错误提示处理
 * @param error
 * @param config
 */
export function errorNotify(error: any, config?: ErrorNotifyConfig): string {
  const silence = !!config?.silence
  let key = ''
  let msg = ''
  // 首先尝试翻译自定义错误
  if (config?.i18nKey) {
    key = `${config.i18nKey}.error.${error.message}`
    msg = config?.t?.(key) ?? ''
  }
  // 如果没有自定义，尝试全局错误
  if (!msg || key === msg) {
    key = `global.error.${error.message}`
    msg = config?.t?.(key) ?? ''
  }
  // 都没有找到，直接使用原始错误信息
  if (!msg || key === msg) {
    msg = error.message
  }

  if (!silence) {
    Notify.create({
      message: msg,
    })
  }
  return msg
}
