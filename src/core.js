import './polyfills/polyfills';
import * as Protocals from '../proto/message';

export { Protocals };

export { default as EventEmitter } from 'eventemitter3';

export { Promise };

export {
  /**
   * @see Realtime
   */
  default as Realtime,
} from './realtime';

export {
  /**
   * 错误码，详见 {@link https://leancloud.cn/docs/realtime_v2.html#云端错误码说明}
   * @enum {Number}
   * @since 3.3.0
   */
  ErrorCode,
} from './error';

