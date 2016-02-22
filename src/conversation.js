import EventEmitter from 'eventemitter3';
import { decodeDate } from './utils';
import IMClient from './im-client';

export default class Conversation extends EventEmitter {
  constructor(data, client) {
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
    if (client instanceof IMClient) {
      this._client = client;
    } else {
      throw new TypeError('Conversation must be initialized with a client');
    }
  }

}
