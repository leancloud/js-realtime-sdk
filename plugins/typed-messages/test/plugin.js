import AV from 'leancloud-storage';
import * as realtime from 'leancloud-realtime';

import initPlugin from '../src';

const {
  TypedMessagesPlugin,
  FileMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  LocationMessage,
} = initPlugin({ AV, realtime });

export {
  TypedMessagesPlugin,
  FileMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  LocationMessage,
};
