/* global AV */
let Storage;
if (typeof AV === 'object' && AV.File) {
  Storage = AV;
} else if (typeof require === 'function') {
  try {
    Storage = require('avoscloud-sdk');
  } catch (e) {
    throw new Error('peerDependency \'avoscloud-sdk\' not found, install it first');
  }
} else {
  throw new Error('detect AV failed, import LeanCloud Storage SDK first');
}

export const File = Storage.File;
export const GeoPoint = Storage.GeoPoint;
