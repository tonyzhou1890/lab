import doc from './bmi.doc.md?raw'

export default {
  title: 'BMI计算',
  keywords: 'BMI,身体质量指数',
  desc: '计算身体质量指数（BMI）。默认参考值为中国参考标准，其他标准和注意事项见文档。',
  // 直接使用 doc 会报错： Message compilation error: Plural must have messages。所以这里使用函数形式
  doc: () => doc,
  height: '身高',
  weight: '体重',
  standard: {
    standard: '标准',
    thin: '偏瘦',
    normal: '正常',
    weight: '偏重',
    fat: '肥胖',
  },
  sourceInput: '请输入数值',
}
