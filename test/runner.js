'use strict';
var realtime = require('../src/realtime');
realtime.config({
  WebSocket: require('ws')
});
require('./specs')(realtime);
