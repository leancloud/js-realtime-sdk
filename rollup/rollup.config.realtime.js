import { node, browser, weapp, minify } from './shared-configs';

const CORE_INPUT_FILE = 'src/core.js';

const core = config =>
  Object.assign({}, config, {
    input: CORE_INPUT_FILE,
    output: Object.assign({}, config.output, {
      file: config.output.file.replace(/\/realtime/, '/realtime-core'),
    }),
  });

export default [
  node,
  core(node),
  browser,
  minify(browser),
  core(browser),
  weapp,
  minify(weapp),
  core(weapp),
];
