import global from './module/global'
import wordCount from './module/word-count'
import nav from './module/nav'
import digest from './module/digest'
import counter from './module/counter'
import qrcode from './module/qrcode'

export default {
  global,
  layout: {
    pageNav: '页面导航',
    serviceNav: '应用导航',
    home: '首页',
  },
  404: {
    notFound: '页面不存在……',
    home: '回首页',
  },
  home: {
    title: '一个在线工具箱',
    searchPlaceholder: '搜索工具',
    desc: '集成众多在线工具，文本处理、图片修改、小游戏……让工作省心省力。',
    start: '开始使用',
  },
  nav,
  font: {
    title: '字体查看器',
    keywords: '字体查看器',
    desc: '可查看 ttf、otf、woff 格式字体信息，浏览字体内部字形。',
    fileLabel: '选择字体文件',
    fontInfo: '字体信息',
    fontFamily: '字族',
    copyright: '版权所有',
    license: '许可证',
    version: '版本',
    charNum: '字符数',
    glyphs: '字形信息',
  },
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
}
