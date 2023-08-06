import ServiceSchema from './service-schema'
import FontSchema from './font/schema'
import WordCountSchema from './word-count/schema'
import DictSchema from './dict/schema'
import MinesweeperSchema from './minesweeper/schema'
import SvgEditor from './svg-editor/schema'
import SnowmanAttack from './snowman-attack/schema'

export default {
  FontSchema,
  WordCountSchema,
  DictSchema,
  MinesweeperSchema,
  SvgEditor,
  SnowmanAttack,
} as {
  [x: string]: ServiceSchema
}
