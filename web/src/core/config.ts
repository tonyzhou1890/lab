const config = {
  langIsoList: ['zh-CN', 'en-US'],
  deps: {
    undercore: {
      path: '/libs/underscore/underscore-min.js',
      version: '1.7.0',
      script: true,
    },
    lemmatizer: {
      path: '/libs/lemmatizer/lemmatizer.js',
      version: '0.0.2',
      script: true,
    },
    imageMagick: {
      path: '/libs/image-magick/magick.wasm',
      version: '0.0.23',
    },
    areaCode: {
      path: '/resources/area-code/data.json',
      version: '0.0.1',
    },
    poem: {
      path: 'https://general-resources.oss-cn-shanghai.aliyuncs.com/poem/poem.json.zip',
      version: '1.0.0',
    },
    idiom: {
      path: 'https://general-resources.oss-cn-shanghai.aliyuncs.com/dict/idiom.json.zip',
      version: '1.0.0',
    },
  },
}

export default config
