import nodeResolve from '@leeyeh/rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

import { minify, babelConfigs } from './shared-configs';

const createConfig = ({ input, output, id }) => ({
  input,
  external: [
    'leancloud-realtime',
    'leancloud-realtime/core',
    'leancloud-storage',
  ],
  output: {
    file: output,
    format: 'umd',
    name: 'AV',
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
    babel(
      Object.assign({}, babelConfigs, {
        exclude: 'node_modules/**',
      })
    ),
    nodeResolve({
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
  typedMessages,
  minify(typedMessages),
  webrtc,
  minify(webrtc),
  GroupChatReceipts,
  minify(GroupChatReceipts),
  liveQuery,
  minify(liveQuery),
];
