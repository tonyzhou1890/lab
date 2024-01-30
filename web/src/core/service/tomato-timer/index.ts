import Time from '@/core/service/time/core'
import Service from '../service-base'
import { Ref, ref } from 'vue'
import { formatOffsetTime } from '@/core/utils/time'
import { noop } from '@/core/utils'
import config from '@/core/config'
import IO from '@/core/io'

export interface TomatoTimerCfg {
  workTime: number // unit--minute
  shortBreak: number
  round: number
  longBreak: number
}

type TomatoTimerStage = 'work' | 'short-break' | 'long-break'

export interface TomatoTimerData {
  running: boolean
  time: number
  formated: string
  stage: '' | TomatoTimerStage
  round: number // 当前周期，从 1 开始。long-break\未开始 会被设为 0
}

export type StageDoneCb = (
  doneStage: TomatoTimerStage,
  doneRound: number
) => void

const StoreName = 'tomato-timer'

class TomatoTimerService extends Service {
  constructor(cfg?: Ref<TomatoTimerCfg>, data?: Ref<TomatoTimerData>) {
    super()
    this.time = new Time()
    this.countdownCallback = this.countdownCallback.bind(this)
    if (cfg) {
      this.cfg = cfg
    }
    if (data) {
      this.countdownData = data
    }
    this.audio = new Audio(config.deps.tomatoTimer.url)
    this.audio.autoplay = false
  }

  cfg = ref<TomatoTimerCfg>({
    workTime: 25,
    shortBreak: 5,
    round: 4,
    longBreak: 30,
  })

  time: Time

  audio: HTMLAudioElement

  end(): Promise<void> {
    return new Promise((resolve) => {
      resolve(this.time?.destroy?.())
    })
  }

  private countdownData = ref<TomatoTimerData>({
    running: false,
    time: 0,
    formated: '00:00:00.000',
    stage: '',
    round: 0,
  })

  /**
   * 读取缓存
   * @returns
   */
  async loadCache() {
    try {
      const cfgRes = await IO.read<TomatoTimerCfg>({
        storeName: StoreName,
        key: 'cfg',
      })
      if (cfgRes?.data) {
        Object.assign(this.cfg.value, cfgRes.data)
      }
      const dataRes = await IO.read<TomatoTimerData>({
        storeName: StoreName,
        key: 'data',
      })
      if (dataRes?.data) {
        Object.assign(this.countdownData.value, dataRes.data)
      }
    } catch (e) {
      return
    }
  }

  /**
   * 保存缓存
   */
  async saveCache(key?: string) {
    try {
      if (!key || key === 'cfg') {
        await IO.write({
          storeName: StoreName,
          key: 'cfg',
          data: { ...this.cfg.value },
        })
      }
      if (!key || key === 'data') {
        await IO.write({
          storeName: StoreName,
          key: 'data',
          data: { ...this.countdownData.value },
        })
      }
    } catch (e) {
      return
    }
  }

  stageDoneCb: StageDoneCb = noop

  start(data: Ref<TomatoTimerData> | undefined, cb: StageDoneCb) {
    // 先清空已有倒计时
    this.time.clearCountDown()

    if (data) {
      this.countdownData = data
    }

    this.stageDoneCb = cb

    const time = this.cfg.value.workTime * 60 * 1000
    this.countdownData.value = {
      running: true,
      time,
      formated: this.formatTime(time),
      stage: 'work',
      round: 1,
    }

    // 开始的时候，配置和数据一同保存
    this.saveCache()

    this.time.setCountDown(
      this.countdownData.value.time,
      this.countdownCallback
    )
  }

  resume(cb: StageDoneCb) {
    this.stageDoneCb = cb
    this.time.setCountDown(
      this.countdownData.value.time,
      this.countdownCallback
    )
  }

  countdownCallback(time: number) {
    time = Math.max(time, 0)
    const data = this.countdownData.value
    data.time = time
    data.formated = this.formatTime(time)

    // 时间为 0 时，蜂鸣提醒
    if (time === 0) {
      this.stageDoneCb(data.stage as TomatoTimerStage, data.round)
      this.playAudio()

      // 长休息结束，重新开始
      if (this.countdownData.value.stage === 'long-break') {
        this.start(this.countdownData, this.stageDoneCb)
      } else {
        // 工作阶段结束
        if (data.stage === 'work') {
          // 短暂休息
          if (data.round < this.cfg.value.round) {
            data.stage = 'short-break'
            data.time = this.cfg.value.shortBreak * 60 * 1000
            data.formated = this.formatTime(data.time)
          } else {
            // 长时间休息
            data.round = 0
            data.stage = 'long-break'
            data.time = this.cfg.value.longBreak * 60 * 1000
            data.formated = this.formatTime(data.time)
          }
        } else {
          // 短暂休息结束
          data.round++
          data.stage = 'work'
          data.time = this.cfg.value.workTime * 60 * 1000
          data.formated = this.formatTime(data.time)
        }
        this.time.setCountDown(data.time, this.countdownCallback)
      }
    }

    // 进行中，只保存数据
    this.saveCache('data')
  }

  /**
   * 播放提示音频
   */
  playAudio() {
    const max = 4
    let count = 0

    const _play = () => {
      this.audio.play()
      count++
      if (count >= max) {
        this.audio.removeEventListener('ended', _play)
      }
    }

    this.audio.addEventListener('ended', _play)

    _play()
  }

  // 结束
  clear() {
    this.countdownData.value.running = false
    this.time.clearCountDown()
  }

  formatTime(time: number) {
    return formatOffsetTime(time).split('.')[0]
  }
}

export default TomatoTimerService
