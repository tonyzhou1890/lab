import {
  initializeImageMagick,
  ImageMagick,
  Magick,
  MagickFormat,
  Quantum,
  ByteArray,
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
  blobConfig?: BlobPropertyBag
): Promise<Blob> {
  return new Promise((resolve) => {
    ImageMagick.read(data, (img) => {
      // img.resize(64, 64)
      img.write(type, (resData) => {
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

export type CoreMagick = typeof coreMagick
