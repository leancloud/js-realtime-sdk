import resolve from '@rollup/plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

import { withMinified, babelConfig } from './shared-configs';

const createConfig = ({ input, output, id, name = 'AV' }) => ({
  input,
  external: [
    'leancloud-realtime',
    'leancloud-realtime/core',
    'leancloud-storage',
  ],
  output: {
    file: output,
    format: 'umd',
    name,
    extend: true,
    amd: {
      id,
    },
    sourcemap: true,
    globals: {
      'leancloud-realtime': 'AV',
      'leancloud-realtime/core': 'AV',
      'leancloud-storage': 'AV',
    },
  },
  plugins: [
    json(),
    babel({
      ...babelConfig,
      exclude: 'node_modules/**',
    }),
    resolve({
      main: true,
    }),
    commonjs({
      include: ['node_modules/**'],
    }),
  ],
});

const typedMessages = createConfig({
  input: 'plugins/typed-messages/src/index.js',
  output: 'plugins/typed-messages/dist/typed-messages.js',
  id: 'typed-messages',
  name: 'AV.initTypedMessages',
});
const webrtc = createConfig({
  input: 'plugins/webrtc/src/index.js',
  output: 'plugins/webrtc/dist/webrtc.js',
  id: 'webrtc',
});
const GroupChatReceipts = createConfig({
  input: 'plugins/groupchat-receipts/src/index.js',
  output: 'plugins/groupchat-receipts/dist/groupchat-receipts.js',
  id: 'groupchat-receipts',
});
const liveQuery = createConfig({
  input: 'plugins/live-query/src/index.js',
  output: 'plugins/live-query/dist/live-query.js',
  id: 'live-query',
});

export default [
  withMinified(typedMessages),
  withMinified(webrtc),
  withMinified(GroupChatReceipts),
  withMinified(liveQuery),
];
