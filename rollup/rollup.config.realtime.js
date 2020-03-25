import { node, browser, weapp, withMinified } from './shared-configs';

const core = {
  ...node,
  input: 'src/core.js',
  output: {
    ...node.output,
    file: 'dist/core.js',
  },
};

const im = {
  ...browser,
  input: 'src/im.js',
  output: {
    ...browser.output,
    file: 'dist/im.js',
  },
};

export default [
  core,
  withMinified(im),
  node,
  withMinified(browser),
  withMinified(weapp),
];
