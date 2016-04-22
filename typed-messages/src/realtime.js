/* global AV */
let Realtime;
if (typeof AV === 'object' && AV.TypedMessage) {
  Realtime = AV;
} else if (typeof require === 'function') {
  try {
    Realtime = require('leancloud-realtime'); // eslint-disable-line
  } catch (e) {
    throw new Error('peerDependency \'leancloud-realtime\' not found, install it first');
  }
} else {
  throw new Error('AV.Realtime not exists, import LeanCloud Realtime SDK first');
}

export const TypedMessage = Realtime.TypedMessage;
export const messageType = Realtime.messageType;
export const messageField = Realtime.messageField;
