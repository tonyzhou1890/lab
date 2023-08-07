import create from './create'
import worker from '../service/word-count/utils.worker?worker'
import type { Init, Count } from '../service/word-count/'

export interface Utils {
  init: Init
  count: Count
}

const local: {
  workerInstance: null | Utils
  inited: boolean
} = {
  workerInstance: null,
  inited: false,
}

async function init() {
  if (local.workerInstance) {
    return local.workerInstance
  }

  try {
    const instance = create<Utils>(worker, 1)
    local.workerInstance = instance
  } catch (e) {
    throw new Error((e as Error).message)
  }

  await local.workerInstance.init()
}

export default {
  init,
  count: local.workerInstance?.count as Count,
}
