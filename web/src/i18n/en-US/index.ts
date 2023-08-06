import wordCount from './module/word-count'
import nav from './module/nav'

export default {
  global: {
    failed: 'Action failed',
    success: 'Action was successful',
    title: 'Snow Lab',
    keywords: 'online toolbox, contains many useful tools',
    desc: 'snow lab, an online toolbox with font, text, development, picture, audio, video, mini games, etc',
    noOption: 'No options',
    category: {
      default: 'Uncategorized',
      text: 'Text',
      dev: 'Development',
      font: 'Font',
      image: 'Image',
      audio: 'Audio',
      video: 'Video',
      game: 'Mini Game',
    },
  },
  layout: {
    pageNav: 'Page Nav',
    serviceNav: 'App Nav',
    home: 'home',
  },
  404: {
    notFound: 'Oops. Nothing here...',
    home: 'Go Home',
  },
  home: {
    title: 'an online toolbox',
    searchPlaceholder: 'search tools',
    desc: 'Integrate many online tools, text processing, image modification, mini games etc. so that the work is worry-free and labor-saving.',
    start: 'Start',
  },
  nav,
  font: {
    title: 'Font Viewer',
    keywords: 'font viewer',
    desc: '可查看 ttf、otf、woff 格式字体信息，浏览字体内部字形',
    fileLabel: 'select font file',
    fontInfo: 'Font Info',
    fontFamily: 'font family',
    copyright: 'copyright',
    license: 'license',
    version: 'version',
    charNum: 'character number',
    glyphs: 'glyphs',
  },
  wordCount,
  dict: {
    title: 'Cloud Dict',
    keywords: 'online dict',
    desc: '在线查词，包含中文、英文、日文，自带 coca 单词表。还可以导出 epub 词书。',
  },
  minesweeper: {
    title: 'Minesweeper',
    keywords: 'minesweeper, mini game',
    desc: 'Contains beginner, intermediate, and advanced minesweeper games.',
  },
  svgEditor: {
    title: 'SVG Editor',
    keywords: 'SVG editor, image processing',
    desc: 'Edit SVG images online to meet lightweight requirements.',
  },
  snowmanAttack: {
    title: 'Snowman Attack',
    keywords: 'Snowman Attack, mimi game',
    desc: 'Protect penguin eggs and fight off the snowman.',
  },
}
