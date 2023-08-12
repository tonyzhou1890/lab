// 类型--类
import ServiceSchema from './service-schema'
// 服务
import FontSchema from './font/schema'
import WordCountSchema from './word-count/schema'
import DigestSchema from './digest/schema'
// 外链服务
import DictSchema from './dict/schema'
import MinesweeperSchema from './minesweeper/schema'
import SvgEditorSchema from './svg-editor/schema'
import SnowmanAttackSchema from './snowman-attack/schema'
import ReaderSchama from './reader/schema'
import GifSchema from './gif/schema'

export default {
  FontSchema,
  WordCountSchema,
  DigestSchema,
  DictSchema,
  MinesweeperSchema,
  SvgEditorSchema,
  SnowmanAttackSchema,
  ReaderSchama,
  GifSchema,
} as {
  [x: string]: ServiceSchema
}
