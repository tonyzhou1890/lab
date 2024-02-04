import global from './module/global'
import layout from './module/layout'
import home from './module/home'
import nav from './module/nav'
import wordCount from './module/word-count'
import font from './module/font'
import digest from './module/digest'
import counter from './module/counter'
import qrcode from './module/qrcode'
import favicon from './module/favicon'
import areaCode from './module/area-code'
import poem from './module/poem'
import mIcons from './module/m-icons'
import idiom from './module/idiom'
import utf8 from './module/utf8'
import time from './module/time'
import baseConvert from './module/base-convert'
import periodicTableOfElements from './module/periodic-table-of-elements'
import temperatureConvert from './module/temperature-convert'
import angleConvert from './module/angle-convert'
import bmi from './module/bmi'
import nes from './module/nes'
import snes from './module/snes'
import gba from './module/gba'
import emulator from './module/emulator'
import shakeTest from './module/shake-test'
import tomatoTimer from './module/tomato-timer'

export default {
  global,
  layout,
  404: {
    notFound: '页面不存在……',
    home: '回首页',
  },
  home,
  nav,
  font,
  wordCount,
  dict: {
    title: '云词典',
    keywords: '在线词典，中英文词典',
    desc: '在线查词，包含中文、英文、日文，自带 coca 单词表。还可以导出 epub 词书。',
  },
  minesweeper: {
    title: '扫雷',
    keywords: '扫雷游戏，小游戏',
    desc: '包含初级、中级、高级的扫雷游戏。',
  },
  svgEditor: {
    title: 'SVG编辑器',
    keywords: 'SVG编辑器，图片处理',
    desc: '在线编辑SVG图片，满足轻量需求。',
  },
  snowmanAttack: {
    title: '雪人攻击',
    keywords: '雪人攻击, 小游戏',
    desc: '保护企鹅蛋，击退雪人吧。',
  },
  reader: {
    title: '享阅·阅读器',
    keywords: 'TXT 阅读器',
    desc: '一个简单的阅读器，支持 UTF8 编码的 TXT 文本。阅读进度保存在浏览器本地。',
  },
  gif: {
    title: 'Spark GIF',
    keywords: 'GIF 编辑器，精灵图转 GIF',
    desc: '支持图片合成 GIF、精灵图和 GIF 互转。',
  },
  digest,
  counter,
  qrcode,
  favicon,
  areaCode,
  poem,
  mIcons,
  idiom,
  utf8,
  time,
  baseConvert,
  periodicTableOfElements,
  temperatureConvert,
  angleConvert,
  bmi,
  nes,
  snes,
  gba,
  emulator,
  shakeTest,
  tomatoTimer,
}
