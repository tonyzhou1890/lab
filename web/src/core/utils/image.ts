import CoreError, { CoreErrorEnum } from '../error'

/**
 * svg 转 png
 * @param file
 */
export function svgToPng(
  file: File | Blob,
  cfg?: {
    width?: number
    height?: number
  }
): Promise<Blob | File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      // 如果设置了宽高，调整图像
      if (cfg?.width || cfg?.height) {
        const dataUrl = canvas.toDataURL('image/png')
        const img2 = new Image()
        img2.src = dataUrl
        img2.onload = () => {
          const w =
            cfg?.width || ((cfg.height as number) / img.height) * img.width
          const h =
            cfg?.height || ((cfg.width as number) / img.width) * img.height
          canvas.width = w
          canvas.height = h
          ctx?.drawImage(img2, 0, 0, w, h)
          returnBlob(canvas)
        }
        img2.onerror = (e) => reject(e)
      } else {
        returnBlob(canvas)
      }
    }
    img.onerror = (e) => reject(e)

    function returnBlob(canvas: HTMLCanvasElement) {
      canvas.toBlob((file) => {
        if (file) {
          resolve(file)
        } else {
          const error = new CoreError(CoreErrorEnum['Execute Error'])
          error.coreErrorFullMsg = 'canvas to blob error'
          reject(error)
        }
      }, 'image/png')
    }
  })
}
