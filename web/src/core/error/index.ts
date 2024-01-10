/**
 * @desc 错误枚举。其实这枚举用起来不如 Map 方便
 */
export enum CoreErrorEnum {
  'Execute Error' = 100,
  'Not Initialized' = 101,
  'Not Found' = 200,
  'Resource Not Found' = 201,
  // worker
  'Action Not Found' = 202,
  'Input Error' = 203,
  'Custom' = 900,
}
