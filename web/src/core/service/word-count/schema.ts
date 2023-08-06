import Schema from '../service-schema'

const schema = new Schema({
  code: 'WordCount',
  name: 'wordCount.title',
  desc: 'wordCount.desc',
  keywords: 'wordCount.keywords',
  categories: ['global.category.text'],
})

export default schema
