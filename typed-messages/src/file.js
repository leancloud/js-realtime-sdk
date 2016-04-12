/* global AV */
let File;
if (typeof AV === 'object' && AV.File) {
  File = AV.File;
} else if (typeof require === 'function') {
  try {
    File = require('avoscloud-sdk').File;
  } catch (e) {
    throw new Error('peerDependency \'avoscloud-sdk\' not found, install it first');
  }
} else {
  throw new Error('detect AV.File failed, import LeanCloud Storage SDK first');
}

export default File;
