import { loadSvg } from '@/icons';
import ScatterIconsBackground from '@/components/ScatterIconsBackground.vue';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  /** */
  loadSvg(app);
  app.component('ScatterIconsBackground', ScatterIconsBackground);
});
