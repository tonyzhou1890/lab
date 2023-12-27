// oss 资源路径前缀
const ossPrefix = 'https://general-resources.oss-cn-shanghai.aliyuncs.com'
// 依赖库分组
const depsStores = {
  libs: 'libs',
  resources: 'resources',
}

const config = {
  langIsoList: ['zh-CN', 'en-US'],
  /**
   * 依赖列表
   * 当指定版本号与缓存版本号不同时，主版本不同，必须更新，否则提示可以更新（各 service 自行决定）
   */
  deps: {
    undercore: {
      url: '/libs/underscore/underscore-min.js',
      version: '1.7.0',
      script: true,
      storeName: depsStores.libs,
    },
    lemmatizer: {
      url: '/libs/lemmatizer/lemmatizer.js',
      version: '0.0.2',
      script: true,
      storeName: depsStores.libs,
    },
    imageMagick: {
      url: `${ossPrefix}/libs/image-magick/magick.wasm`,
      version: '0.0.23',
      storeName: depsStores.libs,
    },
    areaCode: {
      url: '/resources/area-code/data.json',
      version: '0.0.1',
      storeName: depsStores.resources,
    },
    poem: {
      url: 'https://general-resources.oss-cn-shanghai.aliyuncs.com/poem/poem.json.zip',
      version: '1.0.0',
      storeName: depsStores.resources,
    },
    idiom: {
      url: 'https://general-resources.oss-cn-shanghai.aliyuncs.com/dict/idiom.json.zip',
      version: '1.0.0',
      storeName: depsStores.resources,
    },
    periodicTableOfElements: {
      url: '/resources/periodic-table-of-elements/data.json',
      version: '0.0.1',
      // 这个不需要缓存，因为可能需要数据修正
      cache: false,
    },
  },
}

export default config
