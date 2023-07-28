import { loadSvg } from '@/icons';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  /** */
  loadSvg(app);
});
