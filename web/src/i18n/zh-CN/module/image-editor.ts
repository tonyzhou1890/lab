export default {
  title: '图片编辑器',
  desc: '提供一个轻量级的图片编辑器，可以对图片做出裁切、转换、调色、合成等操作。',
  keywords: '图片编辑器，轻量级 ps',
  encrypt: '加密',
  decrypt: '解密',
  encryptForm: {
    type: '原数据类型',
    string: '字符串',
    file: '文件',
    algorithm: '算法',
  },
  start: '开始',
  stop: '停止',
  encryptResult: '计算结果',
  md5: {
    lower16: '16位小写',
    upper16: '16位大写',
    lower32: '32位小写',
    upper32: '32位大写',
  },
  sha: {
    lower: '小写',
    upper: '大写',
  },
  decryptForm: {
    string: '密文',
    algorithm: '算法',
    sourceLength: '原文最大长度',
    charset: '原文字符集',
  },
  charset: {
    lowercase: '小写字母',
    uppercase: '大写字母',
    number: '数字',
    special: '特殊字符',
  },
  calculating: '计算中',
  speed: '速度',
  timeRemaining: '剩余时间',
  result: '结果',
  // 错误提示
  error: {
    'Cipher Error': '密文错误',
    'Cipher Length Error': '密文长度错误',
    'Cipher Char Error': '密文字符错误',
    'Charset Error': '字符集错误',
  },
}
