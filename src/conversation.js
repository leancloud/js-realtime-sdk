import EventEmitter from 'eventemitter3';
import { decodeDate, keyRemap } from './utils';

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
    this.members = Array.from(new Set(this.members));
    this._pendingAttributes = {};
  }

  static _parseFromRawJSON(rawJson) {
    const json = keyRemap({
      objectId: 'id',
      lm: 'lastMessageAt',
      m: 'members',
      attr: 'attributes',
      tr: 'isTransient',
      c: 'creator',
    }, rawJson);
    return new this(json);
  }
}
