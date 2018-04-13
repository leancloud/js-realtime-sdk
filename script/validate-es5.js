#!/usr/bin/env node

const fs = require('fs');
const espree = require('espree');

[
  './plugins/typed-messages/dist/typed-messages.js',
  './plugins/webrtc/dist/webrtc.js',
  './plugins/groupchat-receipts/dist/groupchat-receipts.js',
  './plugins/live-query/dist/live-query.js',
  './dist/realtime.browser.js',
  './dist/realtime.weapp.js',
].forEach(file => {
  process.stdout.write(`validate ${file}`);
  const code = fs.readFileSync(file);
  espree.parse(code, {
    ecmaVersion: 5,
  });
  console.log(' OK');
});
