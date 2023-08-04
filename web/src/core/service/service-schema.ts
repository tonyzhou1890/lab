import { QFieldProps } from 'quasar';

/**
 * 值类型
 * @description input 和 output 的值类型必须要是在指定的类型范围，不在范围内则无法外部调用。
 * 但是，这里的类型只是一个标记，用于编排工作流的时候判断操作是否可以匹配，与实际的值没有关系，实际的值校验由 ServiceParamConfig 里的 rules 处理，或者功能自行你实现。
 */
export const ValueTypes = {
  number: 1,
  string: 2,
};

/**
 * 功能参数说明
 * 如果既没有 formType，也没有 default，同时必须，则说明参数只能由上一步操作传递，该操作不能作为工作流的第一步。
 */
export interface ServiceParamConfig {
  /**
   * @name input表单类型
   */
  formType?: string; // input, textarea, date……
  min?: any;
  max?: any;
  precision: number;
  /**
   * 该参数可以代替 rules 里的必填校验。即，rules 里不需要进行必填校验，直接设置该参数即可。
   */
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  accept?: string;
  /**
   * @description 默认参数，可以直接是值，也可以是返回值的函数
   */
  default?: any;
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
  rules?: QFieldProps['rules'];
}

export interface ServiceSchemaConfig {
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
   * @description 可以是任何 img 元素可以显示的字符串，或者返回该字符串的函数（可以是异步函数）。如果没有提供，则程序会根据功能的第一个字（母）生成图片。
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
   * @name 功能分类
   * @description 对该功能的分类，这里的值只是对于 i18n 的 key，实际的描述在 i18n 中。这主要是为了国际化。
   * 这个分类只有服务的第一层功能才起作用。即服务的分类。
   * 一个服务可以属于多个分类。
   */
  categories?: [];
  /**
   * @name 功能初始化（可选）
   * @description 功能执行之前需要进行的准备活动。可以是异步函数。
   */
  init?: (...args: any[]) => void;
  /**
   * @name 主函数（可选）
   * @description 实现功能的函数。可以是异步函数。
   */
  main?<T, V>(...args: T[]): V;
  /**
   * @name 功能参数
   * @description 数组表示的参数列表描述对象，每一个参数需要指定类型、是否必填、范围？、默认值？、是否可以通过表单补充等。
   */
  inputs?: ServiceParamConfig[][];
  /**
   * @name 返回值
   * @description 功能返回值。这里同样是返回值描述对象。每个元素代表一种返回情况，对于返回值确定一种的函数，则只有一个元素。
   */
  outputs?: [];
  /**
   * @name 结束操作下载（默认下载，除非覆盖了该方法）
   * @description
   * 这个函数在工作流结束之后调用，第一个参数是最后一个操作的结果。第二个参数为对象，由执行器自动传入，包括工作流原始输入（可能没有）。
   * 函数的行为默认为下载。即使是可以显示的文本类型，也直接下载，因为文本可能很大，网页显示压力很大。如果结果有多个文件，则封装为 zip 文件下载。
   * 该方法可以被覆盖，由具体功能自行处理结果，但不建议。
   * 如果生成工作流的时候，最后一个操作没有 end 方法，则无法生成工作流。
   */
  end?<T, V>(...args: T[]): V;
  /**
   * @name 子功能
   */
  children?: ServiceSchemaConfig[];
}

/**
 * 服务功能模板
 */
class ServiceSchema {
  constructor(config: ServiceSchemaConfig) {
    Object.assign(this, config);
  }
}

export default ServiceSchema;
