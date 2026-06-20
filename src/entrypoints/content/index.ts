import { run } from '../../interfaces/content/run';

// Content script registrado SOMENTE no LinkedIn (AC-4) — sem <all_urls>.
// `defineContentScript` é auto-importado pelo WXT.
export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  main() {
    run();
  },
});
