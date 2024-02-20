/* eslint-disable */
declare module 'ml5' {
  type ClassifyOutputItem = {
    label: string
    confidence: number
  }
  interface Classifier {
    classify(
      input?:
        | HTMLImageElement
        | ImageData
        | HTMLCanvasElement
        | HTMLVideoElement,
      numberOfClasses?: number,
      callback?: Function
    ): ClassifyOutputItem[]
    classify(
      input?:
        | HTMLImageElement
        | ImageData
        | HTMLCanvasElement
        | HTMLVideoElement,
      numberOfClasses?: number
    ): Promise<ClassifyOutputItem[]>
  }
  interface ML5 {
    imageClassifier(
      model: string,
      video?: HTMLVideoElement,
      options?: Object,
      modelLoaded?: Function
    ): Classifier
    imageClassifier(
      model: string,
      video?: HTMLVideoElement,
      options?: Object
    ): Promise<Classifier>
  }
  var ml5: ML5
  export default ml5
  export { Classifier }
}
