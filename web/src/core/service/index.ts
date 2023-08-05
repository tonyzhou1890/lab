import FontSchema from './font/schema'
import ServiceSchema from './service-schema'
import WordCountSchema from './word-count/schema'

export default {
  FontSchema,
  WordCountSchema,
} as {
  [x: string]: ServiceSchema
}
