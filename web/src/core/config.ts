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
  },
}

export default config
