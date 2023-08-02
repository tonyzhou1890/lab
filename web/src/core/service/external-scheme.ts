export interface ExternalSchemeConfig {
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
  name: string;
  /**
   * @name 功能图标（可选）
   * @description 可以是任何 img 元素可以显示的字符串，或者返回该字符串的函数（可以是异步函数）
   * @example
   * ```
   * {
   *   icon: 'http://img.com/img.png'
   * }
   * ```
   */
  icon?: string | ((...args: unknown[]) => string);
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
  desc: '';
  /**
   * @name 功能初始化（可选）
   * @description 功能执行之前需要进行的准备活动。可以是异步函数。
   */
  init?: (...args: unknown[]) => void;
  /**
   * @name 主函数（可选）
   * @description 实现功能的函数。可以是异步函数。
   */
  main?: (...args: unknown[]) => unknown;
  /**
   * @name 功能参数
   * @description 数组表示的参数列表描述对象，每一个参数需要指定类型、是否必填、范围？、默认值？、是否可以通过表单补充等。
   */
  input?: [];
  /**
   * @name 返回值
   * @description 功能返回值。这里同样是返回值描述对象
   */
  output?: null;
  /**
   * @name 子功能
   */
  children?: ExternalSchemeConfig[];
}

/**
 * 外部可调用服务功能模板，只有属于这个类的实例才是外部可调用功能。
 */
class ExternalScheme {
  constructor(config: ExternalSchemeConfig) {
    Object.assign(this, config);
  }
}

export default ExternalScheme;
