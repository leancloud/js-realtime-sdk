import json from 'rollup-plugin-json';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import {
  createRollupPluginsOptions,
  babelConfig,
  withMinified,
} from './shared-configs';

const pkg = require('../package.json');

const INPUT_FILE = 'src/im-adapted.js';
const OUTPUT_DIR = process.env.BABEL_ENV === 'es5' ? 'dist' : 'dist/es-latest';

const node = {
  input: INPUT_FILE,
  output: {
    file: `${OUTPUT_DIR}/im-node.js`,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    json(),
    babel({
      ...babelConfig,
      exclude: 'node_modules/**',
    }),
    commonjs({
      include: ['proto/**'],
    }),
  ],
};

const core = {
  ...node,
  input: 'src/core.js',
  output: {
    ...node.output,
    file: `${OUTPUT_DIR}/core.js`,
  },
};

export const browser = {
  input: INPUT_FILE,
  output: {
    file: `${OUTPUT_DIR}/im-browser.js`,
    format: 'umd',
    name: 'AV',
    extend: true,
    amd: {
      id: 'leancloud-realtime',
    },
    sourcemap: true,
  },
  plugins: createRollupPluginsOptions(
    {
      entries: pkg.browser,
    },
    {
      browser: true,
    }
  ),
};

const im = {
  ...browser,
  input: 'src/im.js',
  output: {
    ...browser.output,
    file: `${OUTPUT_DIR}/im.js`,
  },
};

export const weapp = {
  input: INPUT_FILE,
  output: {
    file: `${OUTPUT_DIR}/im-weapp.js`,
    format: 'umd',
    name: 'AV',
    extend: true,
    amd: {
      id: 'leancloud-realtime',
    },
    sourcemap: true,
  },
  plugins: [
    ...createRollupPluginsOptions(
      {
        entries: pkg.weapp,
      },
      {
        browser: true,
      }
    ),
  ],
};

export default [
  core,
  withMinified(im),
  node,
  withMinified(browser),
  withMinified(weapp),
];
