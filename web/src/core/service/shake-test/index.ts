import { CoreErrorEnum } from '@/core/error'
import Service from '../service-base'
import { noop } from '@/core/utils'

export interface EventLogItem {
  data: {
    x: number
    y: number
  }
  e: DeviceMotionEvent
}

export type ShakeMotionCb = (
  data: {
    x: number
    y: number
  },
  e: DeviceMotionEvent,
  log: EventLogItem[],
  /**
   * 计算相对精度比例（-1 ~ +1）
   */
  calc: (accuracy: number) => {
    x: number
    y: number
    xScale: number
    yScale: number
  }
) => void

class ShakeTestService extends Service {
  constructor(cfg?: { reverse: boolean }) {
    super()
    if (cfg) {
      this.reverse = cfg?.reverse
    }
  }

  // 是否数值反转，比如 ios 与安卓方向相反
  reverse = false
  hasEnable = false
  isListening = false
  log: EventLogItem[] = []
  update: ShakeMotionCb = noop

  /**
   * 开启运动传感器的监听
   * @returns
   */
  enableSensor() {
    return new Promise((resolve, reject) => {
      if (this.hasEnable) {
        return resolve(true)
      }
      if (!DeviceMotionEvent) {
        return reject(new Error(CoreErrorEnum[120]))
      }
      if (typeof (DeviceMotionEvent as any)!.requestPermission === 'function') {
        // 鉴权，比如 safari
        ;(DeviceMotionEvent as any)
          .requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              this.hasEnable = true
              window.addEventListener('devicemotion', this.deviceMotionEventCb)
            } else {
              reject(new Error(CoreErrorEnum[110]))
            }
          })
          .catch((e: Error) => {
            reject(e)
          })
      } else {
        // 不需鉴权，直接监听
        this.hasEnable = true
        window.addEventListener('devicemotion', this.deviceMotionEventCb)
        resolve(true)
      }
    })
  }

  /**
   * 运动传感器回调
   * @param event
   */
  deviceMotionEventCb(event: DeviceMotionEvent) {
    console.log(this.hasEnable, this.isListening, this.update)
    if (this.hasEnable && this.isListening) {
      const x = event.acceleration?.x ?? 0
      const y = event.acceleration?.y ?? 0
      const data = {
        x: this.reverse ? -x : x,
        y: this.reverse ? -y : y,
      }
      this.log.push({
        data,
        e: event,
      })
      console.log(data)
      this.update(data, event, this.log, (accuracy: number) => {
        const xScale = Math.sign(x) * Math.min(Math.abs(x) / accuracy, 1)
        const yScale = Math.sign(x) * Math.max(Math.abs(y) / accuracy, 1)
        console.log(xScale, yScale)
        return {
          x,
          y,
          xScale,
          yScale,
        }
      })
    }
  }

  /**
   * 开始记录
   */
  startLog(update?: ShakeMotionCb) {
    this.isListening = true
    this.log = []
    if (update) this.update = update
  }

  /**
   * 结束记录
   */
  endLog() {
    this.isListening = false
  }

  end(): Promise<void> {
    window.removeEventListener('devicemotion', this.deviceMotionEventCb)
    this.hasEnable = false
    this.isListening = false
    this.log = []
    this.update = noop
    return Promise.resolve()
  }
}

export default ShakeTestService
