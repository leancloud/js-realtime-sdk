import nodeResolve from '@leeyeh/rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

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

const plugins = [['@babel/plugin-proposal-decorators', { legacy: true }]];
export const babelConfig = {
  plugins,
  babelrc: false,
  configFile: false,
  runtimeHelpers: true,
  env: {
    es5: {
      plugins: [
        ...plugins,
        ['@babel/plugin-transform-runtime', { corejs: 2 }],
        [
          '@babel/plugin-transform-classes',
          {
            loose: true,
          },
        ],
      ],
      presets: [['@babel/preset-env', { modules: false, debug: true }]],
    },
  },
};

export const createRollupPluginsOptions = resolveOptions => [
  json(),
  nodeResolve({
    main: true,
    ...resolveOptions,
  }),
  commonjsGlobal(),
  commonjs({
    include: ['node_modules/**', 'proto/**'],
  }),
  babel({
    ...babelConfig,
    include: [
      'src/**',
      'test/**',
      'proto/**',
      '**/superagent/**',
      '**/event-target-shim/**',
      '**/promise-timeout/**',
      'node_modules/sinon/**',
    ],
  }),
  env(),
];

export const withMinified = config => ({
  ...config,
  output: [
    config.output,
    {
      ...config.output,
      file: config.output.file.replace(/\.js$/, '.min.js'),
      plugins: [terser()],
    },
  ],
});
