import doc from './base-convert.doc.md?raw'

export default {
  title: '进制转换',
  keywords:
    '进制转换，二进制转换，八进制转换，十进制转换，十六进制转换、三十六进制转换',
  desc: '该工具转换任意进制任意长度的数值，比如二进制、八进制、十进制、十六进制、三十六进制等。',
  doc,
  base: '进制',
  source: '源数值',
  sourceBase: '源进制',
  targetBase: '目标进制',
  baseNumsInput: '请输入进制基数，比如二进制：01',
  custom: '自定义',
  customPlaceholder:
    '请输入不含重复字符的字符串。如点号、空格等特殊字符会被过滤掉，详见文档。',
  notEmptyAddNotLessThanTwo: '不为空且不能少于两个字符',
}
