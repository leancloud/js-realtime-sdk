/** @module leancloud-realtime-plugin-typed-messages */

import createFileMessageClass from './file-message';
import createImageMessageClass from './image-message';
import createAudioMessageClass from './audio-message';
import createVideoMessageClass from './video-message';
import createLocationMessageClass from './location-message';
import { name } from '../package.json';

/**
 * 初始化 TypedMessages 插件，使用后可支持接收 LeanCloud 提供的富媒体类型的消息
 * @example
 * const { TypedMessagesPlugin } = initPlugin({ AV, realtime });
 * const realtime = new Realtime({
 *   appId: appId,
 *   appKey: appKey,
 *   server: server,
 *   plugins: TypedMessagesPlugin,
 * });
 */
export default function initPlugin({ AV, realtime }) {
  /**
   * @see FileMessage
   */
  const FileMessage = createFileMessageClass({ AV, realtime });
  /**
   * @see ImageMessage
   */
  const ImageMessage = createImageMessageClass({ FileMessage, realtime });
  /**
   * @see AudioMessage
   */
  const AudioMessage = createAudioMessageClass({ FileMessage, realtime });
  /**
   * @see VideoMessage
   */
  const VideoMessage = createVideoMessageClass({ FileMessage, realtime });
  /**
   * @see LocationMessage
   */
  const LocationMessage = createLocationMessageClass({ AV, realtime });

  const TypedMessagesPlugin = {
    name,
    messageClasses: [
      FileMessage,
      ImageMessage,
      AudioMessage,
      VideoMessage,
      LocationMessage,
    ],
  };

  return {
    TypedMessagesPlugin,
    FileMessage,
    ImageMessage,
    AudioMessage,
    VideoMessage,
    LocationMessage,
  };
}
