/** @module leancloud-realtime-plugin-typed-messages */

import FileMessage from './file-message';
import ImageMessage from './image-message';
import AudioMessage from './audio-message';
import VideoMessage from './video-message';
import LocationMessage from './location-message';
import { name } from '../package.json';

/**
 * TypedMessages 插件，使用后可支持接收 LeanCloud 提供的富媒体类型的消息
 * @example
 * var realtime = new Realtime({
 *   appId: appId,
 *   plugins: TypedMessagesPlugin,
 * });
 */
export const TypedMessagesPlugin = {
  name,
  messageClasses: [
    FileMessage,
    ImageMessage,
    AudioMessage,
    VideoMessage,
    LocationMessage,
  ],
};

export {
  /**
   * @see FileMessage
   */
  FileMessage,
  /**
   * @see ImageMessage
   */
  ImageMessage,
  /**
   * @see AudioMessage
   */
  AudioMessage,
  /**
   * @see VideoMessage
   */
  VideoMessage,
  /**
   * @see LocationMessage
   */
  LocationMessage,
};
