import EventEmitter from 'eventemitter3';
import { Promise } from 'rsvp';
import { decodeDate, keyRemap } from './utils';
import IMClient from './im-client';
import {
  GenericCommand,
  ConvCommand,
  JsonObjectMessage,
} from '../proto/message';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import { default as d } from 'debug';

const debug = d('LC:Conversation');

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
      _attributes: {},
      isTransient: false,
      muted: false,
    }, keyRemap({
      attributes: '_attributes',
      name: '_name',
    }, data));
    // this.createdAt = decodeDate(this.createdAt);
    // this.updatedAt = decodeDate(this.updatedAt);
    // this.lastMessageAt = decodeDate(this.lastMessageAt);
    this.members = Array.from(new Set(this.members));
    if (client instanceof IMClient) {
      this._client = client;
    } else {
      throw new TypeError('Conversation must be initialized with a client');
    }
  }

  set createdAt(value) {
    this._createdAt = decodeDate(value);
  }
  get createdAt() {
    return this._createdAt;
  }
  set updatedAt(value) {
    this._updatedAt = decodeDate(value);
  }
  get updatedAt() {
    return this._updatedAt;
  }
  set lastMessageAt(value) {
    this._lastMessageAt = decodeDate(value);
  }
  get lastMessageAt() {
    return this._lastMessageAt;
  }

  get attributes() {
    if (typeof this._pendingAttributes !== 'undefined') {
      return this._pendingAttributes;
    }
    return this._attributes;
  }
  set attributes(value) {
    this.setAttributes(value);
  }
  setAttributes(map, assign = false) {
    this._debug(`set attributes: value=${JSON.stringify(map)}, assign=${assign}`);
    if (!isPlainObject(map)) {
      throw new TypeError('attributes must be a plain object');
    }
    if (!assign) {
      this._pendingAttributes = map;
    } else {
      this._pendingAttributes = Object.assign({}, this.attributes, map);
    }
  }
  setAttribute(key, value) {
    if (typeof this._pendingAttributes === 'undefined') {
      this._pendingAttributes = {};
    }
    this._pendingAttributes[key] = value;
  }

  get name() {
    if (typeof this._pendingName !== 'undefined') {
      return this._pendingName;
    }
    return this._name;
  }
  set name(value) {
    this.setName(value);
  }
  setName(value) {
    this._debug(`set name: ${value}`);
    this._pendingName = value;
  }

  _debug(...params) {
    debug(...params, `[${this.id}]`);
  }

  save() {
    this._debug('save');
    const attr = {};
    if (typeof this._pendingAttributes !== 'undefined') {
      attr.attr = this._pendingAttributes;
    }
    if (typeof this._pendingNamed !== 'undefined') {
      attr.name = this._pendingName;
    }
    if (isEmpty(attr)) {
      this._debug('nothing touched, resolve with self');
      return Promise.resolve(this);
    }
    this._debug(`attr: ${JSON.stringify(attr)}`);
    const convMessage = new ConvCommand({
      cid: this.id,
      attr: new JsonObjectMessage({
        data: JSON.stringify(attr),
      }),
    });
    return this
      ._client
      ._send(new GenericCommand({
        cmd: 'conv',
        op: 'update',
        convMessage,
      }))
      .then(resCommand => {
        this.updatedAt = resCommand.convMessage.udate;
        if (typeof this._pendingAttributes !== 'undefined') {
          this._attributes = this._pendingAttributes;
          delete this._pendingAttributes;
        }
        if (typeof this._pendingNamed !== 'undefined') {
          this._name = this._pendingName;
          delete this._pendingName;
        }
        return this;
      });
  }
}
