import _ from 'lodash';
import replace from 'rollup-plugin-replace';
import { browser } from './rollup.config.realtime';

const envify = () =>
  replace(
    _(process.env)
      .mapKeys((value, key) => `process.env.${key}`)
      .mapValues(JSON.stringify)
      .value()
  );

let input = 'test/index.js';
if (process.env.LC_TEST_TARGET === 'browser') {
  input = 'test/index-browser.js';
}
export default Object.assign({}, browser, {
  input,
  output: Object.assign({}, browser.output, {
    file: 'test/browser/index.js',
  }),
  plugins: browser.plugins.concat(envify()),
});
