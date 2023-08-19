import Counter, { CounterConfig } from './core'
import { uid } from 'quasar'

export interface CounterItem {
  id: string
  instance: Counter
}

function createCounter(config: CounterConfig): CounterItem {
  return {
    id: uid(),
    instance: new Counter(config),
  }
}

function resetCounter(counterList: CounterItem[], uid: string) {
  counterList.find((item) => item.id === uid)?.instance?.reset()
}

function removeCounter(counterList: CounterItem[], uid: string) {
  return counterList.filter((item) => item.id !== uid)
}

function updateConfig(
  counterList: CounterItem[],
  uid: string,
  conf: CounterConfig
) {
  const counter = counterList.find((item) => item.id === uid)
  if (counter) {
    counter.instance.updateConfig(conf)
  }
}

export default {
  createCounter,
  resetCounter,
  removeCounter,
  updateConfig,
}
