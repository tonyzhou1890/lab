import wordCount from './module/word-count'
import nav from './module/nav'

export default {
  global: {
    failed: '操作失败',
    success: '操作成功',
    title: '飞雪工具箱',
    keywords: '在线工具箱',
    desc: '飞雪工具箱，一个在线工具箱，包含字体、文本、开发、图片、音视频等相关工具以及小游戏',
    noOption: '无选项',
    // 应用类别
    category: {
      default: '未分类',
      text: '文本',
      dev: '开发',
      font: '字体',
      image: '图片',
      audio: '音频',
      video: '视频',
      game: '小游戏',
    },
  },
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
}
