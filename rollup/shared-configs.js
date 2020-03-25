import nodeResolve from '@leeyeh/rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const env = () => ({
  intro() {
    return `
var process = (typeof window !== 'undefined' && window.process) || {};
process.env = process.env || {};`;
  },
});

const commonjsGlobal = () => ({
  intro() {
    return `
var define = undefined;
var require = require || function(id) {throw new Error('Unexpected required ' + id)};
`;
  },
});

export const babelConfigs = {
  plugins: [
    ['@babel/plugin-transform-runtime', { corejs: 2 }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      '@babel/plugin-transform-classes',
      {
        loose: true,
      },
    ],
  ],
  presets: [['@babel/preset-env', { modules: false, debug: true }]],
  babelrc: false,
  runtimeHelpers: true,
};

export const createRollupPluginsOptions = resolveOptions => [
  json(),
  nodeResolve(
    Object.assign(
      {
        main: true,
      },
      resolveOptions
    )
  ),
  commonjsGlobal(),
  commonjs({
    include: ['node_modules/**', 'proto/**'],
  }),
  babel(
    Object.assign({}, babelConfigs, {
      include: [
        'src/**',
        'test/**',
        'proto/**',
        '**/superagent/**',
        '**/event-target-shim/**',
        'node_modules/sinon/**',
      ],
    })
  ),
  env(),
];

const INPUT_FILE = 'src/im-adapted.js';

export const node = {
  input: INPUT_FILE,
  output: {
    file: 'dist/im-node.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    json(),
    babel(
      Object.assign({}, babelConfigs, {
        exclude: 'node_modules/**',
      })
    ),
    commonjs({
      include: ['proto/**'],
    }),
  ],
};

export const browser = {
  input: INPUT_FILE,
  output: {
    file: 'dist/im-browser.js',
    format: 'umd',
    name: 'AV',
    extend: true,
    amd: {
      id: 'leancloud-realtime',
    },
    sourcemap: true,
  },
  plugins: createRollupPluginsOptions({
    browser: true,
  }),
};

const weappRuntimeReset = () => ({
  intro() {
    return 'global.Object=Object;function Function(){return function(){}};';
  },
});

export const weapp = {
  input: INPUT_FILE,
  output: {
    file: 'dist/im-weapp.js',
    format: 'umd',
    name: 'AV',
    extend: true,
    amd: {
      id: 'leancloud-realtime',
    },
    sourcemap: true,
  },
  plugins: [
    ...createRollupPluginsOptions({
      browser: true,
      customResolveOptions: {
        aliasFields: ['weapp', 'browser'],
      },
    }),
    weappRuntimeReset(),
  ],
};

export const withMinified = config => ({
  ...config,
  output: [
    config.output,
    {
      ...config.output,
      file: config.output.file.replace(/\.js$/, '.min.js'),
      plugins: [uglify()],
    },
  ],
});
