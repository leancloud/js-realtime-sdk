/* eslint-disable import/no-unresolved */
import {
  Protocols as _Protocols,
  Protocals,
  Promise as _Promise,
} from 'leancloud-realtime/core';

const Protocols = _Protocols || Protocals;
if (!Protocols) {
  throw new Error('LeanCloud Realtime SDK not installed');
}
export { _Promise, Protocols };

export { EventEmitter } from 'leancloud-realtime/core';
