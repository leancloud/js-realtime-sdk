import './polyfills/polyfills';
import * as Protocals from '../proto/message';

export { Protocals };

export { default as EventEmitter } from 'eventemitter3';

const polyfilledPromise = Promise;
export { polyfilledPromise as Promise };

export {
  /**
   * @name Realtime
   * @memberof module:leancloud-realtime
   * @see Realtime
   */
  default as Realtime,
} from './realtime';

export { debug } from './utils';
