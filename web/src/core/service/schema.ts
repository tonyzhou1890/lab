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

export default {
  FontSchema,
  WordCountSchema,
  DigestSchema,
  DictSchema,
  MinesweeperSchema,
  SvgEditorSchema,
  SnowmanAttackSchema,
} as {
  [x: string]: ServiceSchema
}
