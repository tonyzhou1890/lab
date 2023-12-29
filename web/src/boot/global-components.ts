import { loadSvg } from '@/icons'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  /** */
  loadSvg(app)
  app.component('ServiceBaseInfo', ServiceBaseInfo)
  app.component('SectionTitle', SectionTitle)
})
