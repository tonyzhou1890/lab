import Time from './core'
import Service from '../service-base'
import dayjs from 'dayjs'
import { Ref, ref } from 'vue'
import { Notify } from 'quasar'
import type { ComposerTranslation } from 'vue-i18n'
import { formatOffsetTime } from '@/core/utils/time'

export interface ClockData {
  date: string
  time: string
}

export interface CountdownData {
  time: number
  formated: string
  index: number
  done: boolean
  paused: boolean
}

export interface StopwatchData {
  time: number
  formated: string
  snapshots: {
    index: number
    time: number
    formated: string
    offset: number
    formatedOffset: string
  }[]
  index: number
  running: boolean
  paused: boolean
}

class TimeService extends Service {
  constructor(cfg?: { t: ComposerTranslation }) {
    super()
    this.time = new Time()
    this.setClockData = this.setClockData.bind(this)
    this.countdownCallback = this.countdownCallback.bind(this)
    this.stopwatchCallback = this.stopwatchCallback.bind(this)
    this.cfg = cfg ?? {}
  }

  cfg: {
    t?: ComposerTranslation
  }

  time: Time

  end(): Promise<void> {
    return new Promise((resolve) => {
      resolve(this.time?.destroy?.())
    })
  }

  private clockData = ref<ClockData>({ date: '', time: '' })

  connectClock(container: Ref<ClockData>) {
    this.time.addCallback(this.setClockData)
    this.clockData = container
  }

  private setClockData() {
    const t = dayjs(this.time.getTime())
      .format('YYYY-MM-DD HH:mm:ss')
      .split(' ')
    this.clockData.value = {
      date: t[0],
      time: t[1],
    }
  }

  private countdownData = ref<CountdownData>({
    time: 0,
    formated: '00:00:00.000',
    index: 0,
    done: false,
    paused: false,
  })

  connectCountdown(container: Ref<CountdownData>, time: string) {
    // 先清空已有倒计时
    this.time.clearCountDown()

    this.countdownData = container
    this.countdownData.value.time =
      dayjs(dayjs().format('YYYY-MM-DD') + ' ' + time).valueOf() -
      dayjs(dayjs().format('YYYY-MM-DD') + ' 00:00:00').valueOf()
    this.countdownData.value.index = this.time.setCountDown(
      this.countdownData.value.time,
      this.countdownCallback
    )
  }

  countdownCallback(time: number) {
    time = Math.max(time, 0)
    this.countdownData.value.time = time
    this.countdownData.value.formated = formatOffsetTime(time)
    // 时间为 0 时，notify、蜂鸣提醒
    if (time === 0) {
      this.countdownData.value.done = true
      if (this.cfg.t) {
        Notify.create(this.cfg.t?.('time.countdown.done') ?? '')
      }
    }
  }

  toggleCountdown() {
    const state = this.time.toggleCountDown(this.countdownData.value.index)
    if (state !== undefined) {
      this.countdownData.value.paused = state
    }
  }

  stopCountdown() {
    this.time.clearCountDown()
    this.countdownData.value = {
      time: 0,
      formated: formatOffsetTime(0),
      index: 0,
      done: false,
      paused: false,
    }
  }

  private stopwatchData = ref<StopwatchData>({
    time: 0,
    formated: formatOffsetTime(0),
    snapshots: [],
    index: 0,
    running: false,
    paused: false,
  })

  connectStopwatch(container: Ref<StopwatchData>) {
    // 先清空已有秒表
    this.time.clearStopwatch()

    this.stopwatchData = container
    this.stopwatchData.value = {
      time: 0,
      formated: formatOffsetTime(0),
      snapshots: [],
      index: this.time.setStopwatch(this.stopwatchCallback),
      running: true,
      paused: false,
    }
  }

  stopwatchCallback(time: number) {
    const max = 24 * 3600 * 1000 - 1
    time = Math.min(time, max)
    this.stopwatchData.value.time = time
    this.stopwatchData.value.formated = formatOffsetTime(time)
    if (time === max) {
      this.stopwatchData.value.running = false
    }
  }

  toggleStopwatch() {
    const state = this.time.toggleStopwatch(this.stopwatchData.value.index)
    if (state !== undefined) {
      this.stopwatchData.value.paused = state
    }
  }

  snapStopwatch() {
    const snapshots = this.time.snapStopwatch(this.stopwatchData.value.index)
    this.stopwatchData.value.snapshots = snapshots.map((item, index) => {
      const offset = index ? item - snapshots[index - 1] : item
      return {
        index: index + 1,
        time: item,
        formated: formatOffsetTime(item),
        offset,
        formatedOffset: formatOffsetTime(offset),
      }
    })
  }

  stopStopwatch() {
    this.time.clearStopwatch()
    this.stopwatchData.value = {
      time: 0,
      formated: formatOffsetTime(0),
      snapshots: [],
      index: 0,
      running: true,
      paused: false,
    }
  }
}

export default TimeService
