import { boot } from 'quasar/wrappers';
import { Quasar } from 'quasar';

const langList = import.meta.glob(
  '../../node_modules/quasar/lang/(en-US|zh-CN).mjs'
);

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ ssrContext, urlPath }) => {
  // something to do
  let langIso = urlPath.split('/')[0];
  if (!['en-US', 'zh-CN'].includes(langIso)) {
    langIso = 'zh-CN';
  }
  try {
    langList[`../../node_modules/quasar/lang/${langIso}.mjs`]().then((lang) => {
      Quasar.lang.set(lang.default, ssrContext);
    });
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }
});
