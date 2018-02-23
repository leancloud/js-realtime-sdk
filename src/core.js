import './polyfills/polyfills';
import * as Protocals from '../proto/message';

export { Protocals };

export { default as EventEmitter } from 'eventemitter3';

export { Promise };

export {
  /**
   * @name Realtime
   * @memberof module:leancloud-realtime
   * @see Realtime
   */
  default as Realtime,
} from './realtime';
