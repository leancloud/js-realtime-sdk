import _ from 'lodash';
import replace from 'rollup-plugin-replace';
import { browser } from './shared-configs';

const envify = () =>
  replace(
    _(process.env)
      .mapKeys((value, key) => `process.env.${key}`)
      .mapValues(JSON.stringify)
      .value()
  );

export default Object.assign({}, browser, {
  input: 'test/index.js',
  output: Object.assign({}, browser.output, {
    file: 'test/browser/index.js',
  }),
  plugins: browser.plugins.concat(envify()),
});
