import { getNodeConfig, browser, weapp, withMinified } from './shared-configs';

const node = getNodeConfig();
const core = {
  ...getNodeConfig(false),
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
