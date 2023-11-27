export interface ElementData {
  symbol: string
  atomicNumber: number
  atomicMass: number
  names: {
    [x: string]: {
      text: string
      phonetic: string
    }
  }
  intro: string
}

/**
 * 生成周期表表格数据
 * @param areaCodeData
 * @returns
 */
function makeTable(list: ElementData[]): ElementData[][] {
  const arr = [
    [list[0], ...new Array(16), list[1]],
    [list[2], list[3], ...new Array(10), ...list.slice(4, 10)],
    [list[10], list[11], ...new Array(10), ...list.slice(12, 18)],
    [...list.slice(18, 36)],
    [...list.slice(36, 54)],
    [list[54], list[55], , ...list.slice(71, 86)],
    [list[86], list[87], , ...list.slice(103, 118)],
    [...new Array(3), ...list.slice(56, 71)],
    [...new Array(3), ...list.slice(88, 103)],
  ]
  return arr
}

export default {
  makeTable,
}
