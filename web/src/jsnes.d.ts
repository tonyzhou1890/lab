/* eslint-disable */
interface NESOpts {
  onFrame: (frameBuffer: Uint8ClampedArray) => void
  onAudioSample: (left: Uint8ClampedArray, right: Uint8ClampedArray) => void
}
declare module 'jsnes' {
  class NES {
    constructor(config: NESOpts)

    loadROM: (rom: ArrayBuffer) => void
  }
}
