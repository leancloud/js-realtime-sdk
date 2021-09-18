import AV from 'leancloud-storage';
import * as IM from 'leancloud-realtime';

import initPlugin from '../src';

const {
  TypedMessagesPlugin,
  FileMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  LocationMessage,
} = initPlugin(AV, IM);

export {
  TypedMessagesPlugin,
  FileMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  LocationMessage,
};
