import io from '@/core/io'
import type { ComposerTranslation } from 'vue-i18n'

let lemmatizer: any = null

// 下载脚本，初始化实例
async function init() {
  // 加载 underscore。因为 underscore 以 _ 作为命名空间，其他库也可能用这个符号，所以直接加载覆盖。
  const underscoreSrc = '/libs/underscore/underscore-min.js'
  await io.loadScript({
    path: underscoreSrc,
    version: '1.7.0',
  })
  if (!lemmatizer) {
    const src = '/libs/lemmatizer/lemmatizer.js'
    await io.loadScript({
      path: src,
      version: '0.0.2',
    })
  }
  lemmatizer = new Lemmatizer('/libs/lemmatizer/')
}

export interface WordCountItem {
  index?: number
  word: string
  count: number
  lang: string
}

// 统计
function count(data: string): WordCountItem[] {
  type NumberObj = { [x: string]: number }

  // 英语统计
  const enData = data.replace(/\W+/g, '\n').toLowerCase()
  const enRes: NumberObj = _count(
    enData.split('\n').filter((v: string) => v),
    'en'
  )
  // 中文统计
  const zhData = data.replace(/[^\u4e00-\u9fa5]/g, '')
  const zhRes: NumberObj = _count(zhData.split(''), 'zh')

  let res: WordCountItem[] = []

  res = res.concat(
    Object.entries(enRes).map((item) => ({
      word: item[0],
      count: item[1],
      lang: 'en',
    }))
  )
  res = res.concat(
    Object.entries(zhRes).map((item) => ({
      word: item[0],
      count: item[1],
      lang: 'zh',
    }))
  )

  res.sort((a, b) => b.count - a.count)

  return res

  function _count(arr: string[], lang: string): NumberObj {
    const res: { [x: string]: number } = {}
    for (let i = 0, len = arr.length; i < len; i++) {
      const word = arr[i]
      if (lang === 'en') {
        const lemmasResult = lemmatizer.lemmas(word)
        lemmasResult
          .map((item: [string, string]) => item[0])
          .filter((v: string) => v)
          .map((item: string) => {
            res[item] = (res[item] || 0) + 1
          })
      } else {
        res[word] = (res[word] || 0) + 1
      }
    }

    return res
  }
}

export type GroupedWordData = {
  name: string
  value: string
  list: WordCountItem[]
}[]

const defaultAllTabs = [
  {
    name: 'wordCount.all',
    value: 'all',
  },
  {
    name: 'wordCount.zh',
    value: 'zh',
  },
  {
    name: 'wordCount.en',
    value: 'en',
  },
]

// 获取分类数据
function listGrouping(list: WordCountItem[], lang?: string): GroupedWordData {
  let tabs: { name: string; value: string }[] = []
  if (lang && lang !== 'all') {
    tabs = [
      {
        name: `wordCount.${lang}`,
        value: lang,
      },
    ]
  } else {
    tabs = JSON.parse(JSON.stringify(defaultAllTabs))
  }
  return tabs.map((item) => {
    return {
      ...item,
      list: list
        .filter((word) => {
          if (item.value === 'all') {
            return true
          }
          return word.lang === item.value
        })
        .map((item, index) => {
          item.index = index + 1
          return item
        }),
    }
  })
}

// 下载为 excel 格式
async function downloadExcel(
  tabs: GroupedWordData,
  filename: string,
  t: ComposerTranslation,
  lang?: string
) {
  const XLSX = await import('xlsx')
  tabs = tabs.filter((tab) => {
    return tab.value === lang
  })
  /* generate worksheet and workbook */
  const workbook = XLSX.utils.book_new()
  tabs.map((tab) => {
    const worksheet = XLSX.utils.json_to_sheet(
      tab.list.map((item) => {
        return {
          index: item.index,
          word: item.word,
          count: item.count,
        }
      })
    )
    /* fix headers */
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          t('wordCount.freListIndex'),
          t('wordCount.freListWord'),
          t('wordCount.freListCount'),
        ],
      ],
      { origin: 'A1' }
    )
    XLSX.utils.book_append_sheet(workbook, worksheet, t(tab.name))
  })

  /* create an XLSX file and try to save to xxx.xlsx */
  XLSX.writeFile(workbook, filename, { compression: true })
}

// 下载为 txt 格式
async function downloadTxt(
  tabs: GroupedWordData,
  filename: string,
  lang: string
) {
  const FileSaver = await import('file-saver')
  const list = tabs.find((tab) => tab.value === lang)?.list
  if (!list) {
    return Promise.reject('error')
  }
  const blob = new Blob([list.map((item) => item.word).join('\r\n')], {
    type: 'text/plain;charset=utf-8',
  })
  FileSaver.saveAs(blob, filename)
}

export default { init, count, listGrouping, downloadExcel, downloadTxt }

export type Init = typeof init
export type Count = typeof count
