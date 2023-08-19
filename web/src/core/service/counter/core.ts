export interface CounterConfig {
  min?: number
  max?: number
  step?: number
  initial?: number
  value?: number
}

class Counter {
  constructor(config: CounterConfig) {
    Object.assign(this.conf, config)
    this.value = this.conf.initial
  }

  conf = {
    min: 0,
    max: Infinity,
    step: 1,
    initial: 0,
  }

  value = 0

  updateConfig(config: CounterConfig) {
    Object.assign(this.conf, config)
    if (this.value > this.conf.max) {
      this.value = this.conf.max
    }
    if (this.value < this.conf.min) {
      this.value = this.conf.min
    }
  }

  increase() {
    this.value = Math.min(this.conf.max, this.value + this.conf.step)
  }

  decrease() {
    this.value = Math.max(this.conf.min, this.value - this.conf.step)
  }

  reset() {
    this.value = this.conf.initial
  }
}

export default Counter
