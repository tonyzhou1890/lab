import { QFieldProps } from 'quasar'

/**
 * 功能参数说明
 * 如果既没有 formType，也没有 default，同时必须，则说明参数只能由上一步操作传递，该操作不能作为工作流的第一步。
 */
export interface ServiceParamConfig {
  /**
   * @name input表单类型
   */
  formType?: string // input, textarea, date……
  min?: any
  max?: any
  precision: number
  /**
   * 该参数可以代替 rules 里的必填校验。即，rules 里不需要进行必填校验，直接设置该参数即可。
   */
  required?: boolean
  maxLength?: number
  minLength?: number
  accept?: string
  /**
   * @description 默认参数，可以直接是值，也可以是返回值的函数
   */
  default?: any
  /**
   * @name 校验规则
   * @description 用于表单校验。
   * 在运行当前功能之前，执行器也会尝试调用 rules 对参数进行校验。
   * 所以，即使非表单参数，也可以有 rules。
   * 当然，参数校验也可以功能函数自行处理。
   * 编排工作流的时候，如果指定当前参数为运行时输入，则该参数的所有校验规则都不会被调用。
   * @example
   * ```
   * [val => !!val || 'Field is required']
   * ```
   */
  rules?: QFieldProps['rules']
}

/**
 * 服务功能模板
 */
export class ServiceSchema {
  constructor(config: ServiceSchema) {
    Object.assign(this, config)
  }
  /**
   * @name 功能标识
   * @description 功能唯一性标识。首字母大写。
   * 用途：路由识别匹配、权限控制、功能编排匹配
   */
  code = ''
  /**
   * @name 功能名称
   * @description 这里的值只是对于 i18n 的 key，实际的描述在 i18n 中。这主要是为了国际化。
   * @example
   * ```
   * {
   *   name: 'wordCount.name'
   * }
   * ```
   */
  name = ''
  /**
   * @name 功能图标（可选）
   * @description 可以是任何 img 元素可以显示的字符串，或者返回该字符串的函数（可以是异步函数）。如果没有提供，则程序会根据功能的第一个字（母）生成图片。
   * @example
   * ```
   * {
   *   icon: 'http://img.com/img.png'
   * }
   * ```
   */
  icon?: string | ((...args: unknown[]) => string)
  /**
   * @name 功能描述
   * @description 对于该功能的描述，这里的值只是对于 i18n 的 key，实际的描述在 i18n 中。这主要是为了国际化。
   * @example
   * ```
   * {
   *   desc: 'wordCount.desc'
   * }
   * ```
   */
  desc = ''
  /**
   * @name 应用关键字
   * @description 应用的关键字，用于 seo 等。这里的值只是对于 i18n 的 key。
   */
  keywords = ''
  /**
   * @name 功能分类
   * @description 对该功能的分类，这里的值只是对于 i18n 的 key，实际的描述在 i18n 中。这主要是为了国际化。
   * 这个分类只有服务的第一层功能才起作用。即服务的分类。
   * 一个服务可以属于多个分类。
   */
  categories?: string[]
  /**
   * @name 外链标识
   * @description true 表示是外链打开，可以不填，实例化的时候传入 link 会自动判断
   */
  extra?: boolean
  /**
   * @name 跳转地址
   * @description 服务对应的页面地址。站内服务可以不填。
   */
  link?: string
  /**
   * @name 功能初始化（可选）
   * @description 功能执行之前需要进行的准备活动。可以是异步函数。
   */
  init?: (...args: any[]) => void
  /**
   * @name 主函数（可选）
   * @description 实现功能的函数。可以是异步函数。
   */
  main?<T, V>(...args: T[]): V
  /**
   * @name 功能参数
   * @description 数组表示的参数列表描述对象，每一个参数需要指定类型、是否必填、范围？、默认值？、是否可以通过表单补充等。
   */
  inputs?: ServiceParamConfig[][]
  /**
   * @name 返回值
   * @description 功能返回值。这里同样是返回值描述对象。每个元素代表一种返回情况，对于返回值确定一种的函数，则只有一个元素。
   */
  outputs?: []
  /**
   * @name 子功能
   */
  children?: ServiceSchema[]
}

// class ServiceSchema implements ServiceSchemaConfig {
//   constructor(config: ServiceSchemaConfig) {
//     Object.assign(this, config)
//   }
//   code = ''
//   name = ''
//   keywords = ''
//   desc = ''
//   categories = ['global.category.default']
// }

/**
 * 服务分类
 */
export interface GroupedService {
  key: string
  value: ServiceSchema[]
}
export function groupService(list: ServiceSchema[]): GroupedService[] {
  const res: GroupedService[] = []
  const ungrouped: GroupedService = {
    key: 'global.category.default',
    value: [],
  }
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    if (!item.categories || !item.categories.length) {
      ungrouped.value.push(item)
    } else {
      item.categories.forEach((category) => {
        const temp = res.find((v) => v.key === category)
        if (temp) {
          temp.value.push(item)
        } else {
          res.push({
            key: category,
            value: [item],
          })
        }
      })
    }
  }
  if (ungrouped.value.length) {
    res.push(ungrouped)
  }
  return res
}

export default ServiceSchema
