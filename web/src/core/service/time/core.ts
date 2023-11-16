import { isFunction } from '@/core/utils/type-check'

class Time {
  constructor() {
    this.quene = []
    this._checkClock = this._checkClock.bind(this)
    this._checkCountDown = this._checkCountDown.bind(this)
    this._checkStopwatch = this._checkStopwatch.bind(this)
    this.addCallback(this._checkClock)
    this.addCallback(this._checkCountDown)
    this.addCallback(this._checkStopwatch)
    this.update(0)
  }

  private quene: any[]
  private rafPoint = -1
  private prevTime: number = performance.now()

  /**
   * @param delta 距离上一帧的时间偏移量，单位 ms。
   */
  private update(delta: number) {
    this.quene.forEach((val) => {
      if (isFunction(val)) {
        val(delta)
      }
    })
    this.rafPoint = window.requestAnimationFrame((now) => {
      const newDelta = now - this.prevTime
      this.prevTime = now
      this.update(newDelta)
    })
  }

  addCallback(func: (delta: number) => void) {
    this.quene.push(func)
  }

  removeCallback(func: (delta: number) => void) {
    this.quene = this.quene.filter((item) => item !== func)
  }

  destroy() {
    if (this.rafPoint !== -1) {
      window.cancelAnimationFrame(this.rafPoint)
      this.quene = []
    }
  }

  getTime() {
    return Date.now()
  }

  // 时钟提醒
  clock: ({ time: Date; callback: (delta?: number) => void } | null)[] = []

  setClock(time: Date, callback: (delta?: number) => void): number {
    if (
      !(time instanceof Date) ||
      time.getTime() < Date.now() ||
      !isFunction(callback)
    ) {
      return -1
    }
    this.clock.push({
      time,
      callback,
    })
    return this.clock.length - 1
  }

  clearClock(index?: number) {
    if (index !== undefined) {
      if (this.clock[index]) {
        this.clock[index] = null
      }
    } else {
      this.clock = []
    }
  }

  private _checkClock() {
    this.clock.forEach((currClock, index) => {
      if (currClock) {
        const delta = this.getTime() - currClock.time.getTime()
        // 时间到了，执行回调，移除任务
        if (delta >= 0) {
          // 先移除任务，防止回调执行时间过长，过程中再次触发回调
          this.clock[index] = null
          if (isFunction(currClock.callback)) {
            currClock.callback(delta)
          }
        }
      }
    })
  }

  // 倒计时
  countDown: ({
    time: number
    callback: (leftTime: number, delta: number) => void
    paused: boolean
  } | null)[] = []

  setCountDown(
    time: number,
    callback: (leftTime: number, delta: number) => void
  ): number {
    if (time <= 0 || !isFunction(callback)) {
      return -1
    }
    this.countDown.push({
      time,
      callback,
      paused: false,
    })
    return this.countDown.length - 1
  }

  clearCountDown(index?: number) {
    if (index !== undefined) {
      if (this.countDown[index]) {
        this.countDown[index] = null
      }
    } else {
      this.countDown = []
    }
  }

  toggleCountDown(index: number): boolean | undefined {
    if (this.countDown[index]) {
      return (this.countDown[index]!.paused = !this.countDown[index]?.paused)
    }
  }

  private _checkCountDown(delta: number) {
    this.countDown.forEach((currCountDown, index) => {
      if (currCountDown && !currCountDown.paused) {
        const newTime = currCountDown.time - delta
        // 先更细数据，移除任务，防止回调执行时间过长，过程中再次触发回调
        currCountDown.time = newTime
        if (newTime <= 0) {
          this.countDown[index] = null
        }
        if (isFunction(currCountDown.callback)) {
          currCountDown.callback(newTime, delta)
        }
      }
    })
  }

  // 秒表
  stopwatch: ({
    time: number
    callback: (time: number, delta: number) => void
    paused: boolean
    snapshots: number[]
  } | null)[] = []

  setStopwatch(callback: (time: number, delta: number) => void): number {
    if (!isFunction(callback)) {
      return -1
    }
    this.stopwatch.push({
      time: 0,
      callback,
      paused: false,
      snapshots: [],
    })
    return this.stopwatch.length - 1
  }

  clearStopwatch(index?: number) {
    if (index !== undefined) {
      if (this.stopwatch[index]) {
        this.stopwatch[index] = null
      }
    } else {
      this.stopwatch = []
    }
  }

  toggleStopwatch(index: number): boolean | undefined {
    if (this.stopwatch[index]) {
      return (this.stopwatch[index]!.paused = !this.stopwatch[index]?.paused)
    }
  }

  snapStopwatch(index: number): number[] {
    if (this.stopwatch[index]) {
      this.stopwatch[index]!.snapshots.push(this.stopwatch[index]!.time)
      return this.stopwatch[index]?.snapshots ?? []
    }
    return []
  }

  private _checkStopwatch(delta: number) {
    this.stopwatch.forEach((currStopwatch) => {
      if (currStopwatch && !currStopwatch.paused) {
        currStopwatch.time += delta
        console.log(delta, currStopwatch.time)
        if (isFunction(currStopwatch.callback)) {
          currStopwatch.callback(currStopwatch.time, delta)
        }
      }
    })
  }
}

export default Time
