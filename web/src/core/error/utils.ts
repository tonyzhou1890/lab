/**
 * CoreError 类会在 worker 中使用，而 errorNotify 用到 quasar，所以不能将这里的方法合并到 index.ts 文件中，否则 quasar 会报错：window is not defined
 */
import { Notify } from 'quasar'
import CoreError from '.'
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
  let msg = ''
  // 可翻译核心错误
  if (error instanceof CoreError) {
    // 900 为服务自定义错误 code，其余为通用
    const i18nKey =
      error.coreErrorCode >= 900 ? config?.i18nKey || 'global' : 'global'
    msg =
      error.coreErrorFullMsg ||
      config?.t?.(`${i18nKey}.error.${error.coreErrorMsg}`) ||
      ''
  } else {
    // 其他错误
    msg = error.message
  }
  console.log(error, msg)
  if (!silence) {
    Notify.create({
      message: msg,
    })
  }
  return msg
}
