import Service from '../service-base'
import type { Classifier } from 'ml5'

class ImageClassifierService extends Service {
  constructor() {
    super()
  }

  classifier: Classifier | null = null

  /**
   * 服务初始化
   * @param config
   * @returns
   */
  async init(): Promise<void> {
    if (this.classifier) {
      return
    }
    try {
      const ml5 = (await import('ml5')).default
      this.classifier = await ml5.imageClassifier('MobileNet')
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  /**
   * 识别
   * @param rest
   * @returns
   */
  async classify(...rest: Parameters<Classifier['classify']>) {
    await this.init()
    const result = await this.classifier!.classify(...rest)
    return result
  }
}

export default ImageClassifierService
