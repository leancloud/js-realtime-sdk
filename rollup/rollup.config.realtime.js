import { node, browser, weapp, minify } from './shared-configs';

const core = {
  ...node,
  input: 'src/core.js',
  output: {
    ...node.output,
    file: 'dist/core.js',
  },
};

const im = {
  ...node,
  input: 'src/im.js',
  output: {
    ...node.output,
    file: 'dist/im.js',
  },
};

export default [core, im, node, browser, minify(browser), weapp, minify(weapp)];
