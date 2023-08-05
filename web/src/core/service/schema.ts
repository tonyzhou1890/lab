import ServiceSchema from './service-schema'
import FontSchema from './font/schema'
import WordCountSchema from './word-count/schema'

export default {
  FontSchema,
  WordCountSchema,
} as {
  [x: string]: ServiceSchema
}
