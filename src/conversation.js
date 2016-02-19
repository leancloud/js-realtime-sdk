import EventEmitter from 'eventemitter3';
import keyRemap from 'key-remap';
import { decodeDate } from './utils';

export default class Conversation extends EventEmitter {
  constructor(data) {
    super();
    Object.assign(this, {
      // id,
      // name,
      // creator,
      // createdAt,
      // updatedAt,
      // lastMessageAt,
      members: [],
      attributes: {},
      isTransient: false,
      muted: false,
    }, data);
    this.createdAt = decodeDate(this.createdAt);
    this.updatedAt = decodeDate(this.updatedAt);
    this.lastMessageAt = decodeDate(this.lastMessageAt);
    this._pendingAttributes = {};
  }

  static _parseFromRawJSON(rawJson) {
    const json = keyRemap({
      id: 'objectId',
      lastMessageAt: 'lm',
      members: 'm',
      attributes: 'attr',
      isTransient: 'tr',
      creator: 'c',
    }, rawJson);
    return new this(json);
  }
}
