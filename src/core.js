import * as Protocols from '../proto/message';

export {
  Protocols,
  // misspelling
  Protocols as Protocals,
};

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

export * from './adaptor';

export { debug } from './utils';
