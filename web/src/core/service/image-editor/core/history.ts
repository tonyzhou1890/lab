/**
 * 这里定义 history 这个类，用来管理操作记录，方便撤销
 */
interface HistoryConfig {
  // 最大记录数, 默认 100
  max?: number
}

class HistoryItem {
  constructor(name: string, desc: string, snapshot: string, data: any) {
    this.name = name
    this.desc = desc
    this.snapshot = snapshot
    this.data = data
  }
  name: string
  desc: string
  snapshot: string
  data: string
}

class History {
  constructor(config: HistoryConfig) {
    this.max = config.max ?? 100
  }
  max: number
  // 记录栈
  private stack: HistoryItem[] = []
}

export default History
