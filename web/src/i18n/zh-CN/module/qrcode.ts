import doc from './qrcode.doc.md?raw'

export default {
  title: '二维码生成识别',
  keywords: '二维码生成，二维码识别',
  desc: '可以生成、识别、扫描二维码',
  doc,
  generate: '生成',
  recognize: '识别',
  scan: '扫描',
  genForm: {
    string: '文本',
  },
  qrcode: '二维码',
  recognizeForm: {
    file: '图片',
  },
  recognizeResult: '识别结果',
  codeFind: '已识别',
  error: {
    'No QR code found': '二维码未找到',
    noCamera: '未找到相机',
  },
}
