import ServiceSchema from './service-schema'
import FontSchema from './font/schema'
import WordCountSchema from './word-count/schema'
import DictSchema from './dict/schema'
import MinesweeperSchema from './minesweeper/schema'

export default {
  FontSchema,
  WordCountSchema,
  DictSchema,
  MinesweeperSchema,
} as {
  [x: string]: ServiceSchema
}
