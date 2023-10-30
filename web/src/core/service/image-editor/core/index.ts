import {
  initializeImageMagick,
  ImageMagick,
  Magick,
  MagickFormat,
  Quantum,
  ByteArray,
  MagickGeometry,
} from '@imagemagick/magick-wasm' // Change to '@imagemagick/magick-wasm' when using this in your project.

/**
 * 初始化
 * @param {ByteArray} wasmData
 */
function initializeWasm(wasmData: ByteArray) {
  return new Promise((resolve, reject) => {
    initializeImageMagick(wasmData)
      .then(() => {
        console.log(Magick.imageMagickVersion)
        console.log('Delegates:', Magick.delegates)
        console.log('Features:', Magick.features)
        console.log('Quantum:', Quantum.depth)

        resolve('')
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 格式转换
 * @returns
 */
function transformFormat(
  data: ByteArray,
  type: MagickFormat,
  size: number,
  blobConfig?: BlobPropertyBag
): Promise<Blob> {
  return new Promise((resolve) => {
    ImageMagick.read(data, (img) => {
      // img.resize(size, size)
      const geo = new MagickGeometry(size, size)
      geo.ignoreAspectRatio = true
      img.resize(geo)
      console.log('resize done')
      img.write(type, (resData) => {
        console.log('write done')
        resolve(new Blob([resData], blobConfig))
      })
    })
  })
}

const coreMagick = {
  initializeWasm,
  transformFormat,
}

export default coreMagick

export type CoreWorker = typeof coreMagick
