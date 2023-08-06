import wordCount from './module/word-count'

export default {
  global: {
    failed: 'Action failed',
    success: 'Action was successful',
    title: 'snow lab',
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
  },
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
    keywords: 'minesweeper',
    desc: 'Contains beginner, intermediate, and advanced minesweeper games.',
  },
}
