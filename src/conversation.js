import EventEmitter from 'eventemitter3';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import cloneDeep from 'lodash/cloneDeep';
import { default as d } from 'debug';
import { decodeDate, keyRemap, union, difference, internal, setValue } from './utils';
import { applyDecorators } from './plugin';
import IMClient from './im-client';
import {
  GenericCommand,
  ConvCommand,
  JsonObjectMessage,
  DirectCommand,
  LogsCommand,
} from '../proto/message';
import runSignatureFactory from './signature-factory-runner';
import { createError } from './errors';
import Message, { MessageStatus } from './messages/message';

const debug = d('LC:Conversation');

export default class Conversation extends EventEmitter {
  /**
   * 无法直接实例化，请使用 {@link IMClient#createConversation} 创建新的对话
   * @extends EventEmitter
   */
  constructor({
    id,
    creator,
    createdAt,
    updatedAt,
    lastMessageAt,
    lastMessage,
    mutedMembers = [],
    members = [],
    transient = false,
    muted = false,
    // jsdoc-ignore-start
    ...attributes,
    // jsdoc-ignore-end
  }, client) {
    super();
    Object.assign(this, {
      /**
       * 对话 id，对应 _Conversation 表中的 objectId
       * @memberof Conversation#
       * @type {String}
       */
      id,
      /**
       * 对话创建者
       * @memberof Conversation#
       * @type {String}
       */
      creator,
      /**
       * 对话创建时间
       * @memberof Conversation#
       * @type {Date}
       */
      createdAt,
      /**
       * 对话更新时间
       * @memberof Conversation#
       * @type {Date}
       */
      updatedAt,
      /**
       * 最后一条消息时间
       * @memberof Conversation#
       * @type {Date}
       */
      lastMessageAt,
      /**
       * 最后一条消息
       * @memberof Conversation#
       * @type {?Message}
       */
      lastMessage,
      /**
       * 对该对话设置了静音的用户列表
       * @memberof Conversation#
       * @type {?String[]}
       */
      mutedMembers,
      /**
       * 参与该对话的用户列表
       * @memberof Conversation#
       * @type {String[]}
       */
      members,
      /**
       * 暂态对话标记
       * @memberof Conversation#
       * @type {Boolean}
       */
      transient,
      /**
       * 当前用户静音该对话标记
       * @memberof Conversation#
       * @type {Boolean}
       */
      muted,
    });
    this._attributes = attributes;
    this._reset();
    /**
     * 当前用户在该对话的未读消息数
     * @memberof Conversation#
     * @type {Number}
     */
    this.unreadMessagesCount = 0;
    this.members = Array.from(new Set(this.members));
    internal(this).messagesWaitingForReciept = {};
    if (client instanceof IMClient) {
      this._client = client;
    } else {
      throw new TypeError('Conversation must be initialized with a client');
    }
    [
      'kicked',
      'membersjoined',
      'membersleft',
      'message',
    ].forEach(event => this.on(
      event,
      payload => this._debug(`${event} event emitted.`, payload)
    ));
    // onConversationCreate hook
    applyDecorators(this._client._plugins.onConversationCreate, this);
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

  /**
   * 对话额外属性，对应 _Conversation 表中的 attr
   * @type {Object}
   * @deprecated Use {@link Conversation#get conversation.get('attr')},
   * {@link Conversation#set conversation.set('attr', value)} instead
   */
  get attributes() {
    console.warn('DEPRECATION Conversation.attributes: Use conversation.get(\'attr\') instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
    return this.get('attr');
  }
  set attributes(value) {
    console.warn('DEPRECATION Conversation.attributes: Use conversation.set(\'attr\', value) instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
    this.set('attr', value);
  }
  /**
   * 设置对话额外属性
   * @param {Object} map    key-value 对
   * @param {Boolean} [assign=false] 使用 Object.assign 更新属性，而不是替换整个 attributes
   * @return {Conversation} self
   * @deprecated Use {@link Conversation#set} instead. See {@link https://url.leanapp.cn/DeprecateAttributes} for more details.
   */
  setAttributes(map, assign = false) {
    console.warn('DEPRECATION Conversation#setAttributes: Use conversation.set() instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
    this._debug(`set attributes: value=${JSON.stringify(map)}, assign=${assign}`);
    if (!isPlainObject(map)) {
      throw new TypeError('attributes must be a plain object');
    }
    if (!assign) {
      this.set('attr', map);
    } else {
      Object.keys(map).forEach(key => this.setAttribute(key, map[key]));
    }
    return this;
  }
  /**
   * 设置对话额外属性
   * @param {String} key
   * @param {Any} value
   * @return {Conversation} self
   * @deprecated Use {@link Conversation#set conversation.set('attr.key', value)} instead
   */
  setAttribute(key, value) {
    console.warn('DEPRECATION Conversation#setAttribute: Use conversation.set(\'attr.key\', value) instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
    return this.set(`attr.${key}`, value);
  }
  /**
   * 对话名字，对应 _Conversation 表中的 name
   * @type {String}
   */
  get name() {
    return this.get('name');
  }
  set name(value) {
    this.set('name', value);
  }
  /**
   * 设置对话名字
   * @param {String} value
   * @return {Conversation} self
   * @deprecated Use {@link Conversation#set conversation.set('name', value)} instead
   */
  setName(value) {
    console.warn('DEPRECATION Conversation#setName: Use conversation.set(\'name\', value) instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
    return this.set('name', value);
  }

  /**
   * 获取对话的自定义属性
   * @since 3.2.0
   * @param  {String} key key 属性的键名，'x' 对应 Conversation 表中的 x 列
   * @return {Any} 属性的值
   */
  get(key) {
    return internal(this).currentAttributes[key];
  }

  /**
   * 设置对话的自定义属性
   * @since 3.2.0
   * @param {String} key 属性的键名，'x' 对应 Conversation 表中的 x 列，支持使用 'x.y.z' 来修改对象的部分字段。
   * @param {Any} value 属性的值
   * @return {Conversation} self
   * @example
   *
   * // 设置对话的 color 属性
   * conversation.set('color', {
   *   text: '#000',
   *   background: '#DDD',
   * });
   * // 设置对话的 color.text 属性
   * conversation.set('color.text', '#333');
   */
  set(key, value) {
    this._debug(`set [${key}]: ${value}`);
    const pendingAttributes = internal(this).pendingAttributes;
    const pendingKeys = Object.keys(pendingAttributes);
    // suppose pendingAttributes = { 'a.b': {} }
    // set 'a' or 'a.b': delete 'a.b'
    const re = new RegExp(`^${key}`);
    const childKeys = pendingKeys.filter(re.test.bind(re));
    childKeys.forEach(k => {
      delete pendingAttributes[k];
    });
    if (childKeys.length) {
      pendingAttributes[key] = value;
    } else {
      // set 'a.c': nothing to do
      // set 'a.b.c.d': assign c: { d: {} } to 'a.b'
      // CAUTION: non-standard API, provided by core-js
      const parentKey = Array.find(pendingKeys, k => key.indexOf(k) === 0); // 'a.b'
      if (parentKey) {
        setValue(pendingAttributes[parentKey], key.slice(parentKey.length + 1), value);
      } else {
        pendingAttributes[key] = value;
      }
    }
    // build currentAttributes
    internal(this).currentAttributes = Object.keys(pendingAttributes)
      .reduce(
        (target, k) => setValue(target, k, pendingAttributes[k]),
        cloneDeep(this._attributes)
      );
    return this;
  }

  _reset() {
    internal(this).pendingAttributes = {};
    internal(this).currentAttributes = this._attributes;
  }

  _debug(...params) {
    debug(...params, `[${this.id}]`);
  }

  _send(command, ...args) {
    /* eslint-disable no-param-reassign */
    if (command.cmd === null) {
      command.cmd = 'conv';
    }
    if (command.cmd === 'conv' && command.convMessage === null) {
      command.convMessage = new ConvCommand();
    }
    if (command.convMessage && command.convMessage.cid === null) {
      command.convMessage.cid = this.id;
    }
    /* eslint-enable no-param-reassign */
    return this._client._send(command, ...args);
  }
  /**
   * 保存当前对话的属性至服务器
   * @return {Promise.<Conversation>} self
   */
  save() {
    this._debug('save');
    const attr = internal(this).pendingAttributes;
    if (isEmpty(attr)) {
      this._debug('nothing touched, resolve with self');
      return Promise.resolve(this);
    }
    this._debug(`attr: ${JSON.stringify(attr)}`);
    const convMessage = new ConvCommand({
      attr: new JsonObjectMessage({
        data: JSON.stringify(attr),
      }),
    });
    return this
      ._send(new GenericCommand({
        op: 'update',
        convMessage,
      }))
      .then(resCommand => {
        this.updatedAt = resCommand.convMessage.udate;
        this._attributes = internal(this).currentAttributes;
        internal(this).pendingAttributes = {};
        return this;
      });
  }

  /**
   * 从服务器更新对话的属性
   * @return {Promise.<Conversation>} self
   */
  fetch() {
    return this
      ._client
      .getQuery()
      .equalTo('objectId', this.id)
      .find()
      .then(() => this);
  }

  /**
   * 静音，客户端拒绝收到服务器端的离线推送通知
   * @return {Promise.<Conversation>} self
   */
  mute() {
    this._debug('mute');
    return this._send(new GenericCommand({
      op: 'mute',
    })).then(() => {
      if (!this.transient) {
        this.muted = true;
        this.mutedMembers = union(this.mutedMembers, [this._client.id]);
      }
      return this;
    });
  }

  /**
   * 取消静音
   * @return {Promise.<Conversation>} self
   */
  unmute() {
    this._debug('unmute');
    return this._send(new GenericCommand({
      op: 'unmute',
    })).then(() => {
      if (!this.transient) {
        this.muted = false;
        this.mutedMembers = difference(this.mutedMembers, [this._client.id]);
      }
      return this;
    });
  }

  /**
   * 获取对话人数，或暂态对话的在线人数
   * @return {Promise.<Number>}
   */
  count() {
    this._debug('unmute');
    return this._send(new GenericCommand({
      op: 'count',
    })).then(resCommand => resCommand.convMessage.count);
  }

  /**
   * 增加成员
   * @param {String|String[]} clientIds 新增成员 client id
   * @return {Promise.<Conversation>} self
   */
  add(clientIds) {
    this._debug('add', clientIds);
    if (typeof clientIds === 'string') {
      clientIds = [clientIds]; // eslint-disable-line no-param-reassign
    }
    const convMessage = new ConvCommand({
      m: clientIds,
    });
    return Promise.resolve(
      new GenericCommand({
        op: 'add',
        convMessage,
      })
    ).then(command => {
      if (this._client.options.conversationSignatureFactory) {
        const params = [this.id, this._client.id, clientIds.sort(), 'add'];
        return runSignatureFactory(this._client.options.conversationSignatureFactory, params)
          .then(signatureResult => {
            Object.assign(command.convMessage, keyRemap({
              signature: 's',
              timestamp: 't',
              nonce: 'n',
            }, signatureResult));
            return command;
          });
      }
      return command;
    }).then(
      this._send.bind(this)
    ).then(() => {
      if (!this.transient) {
        this.members = union(this.members, clientIds);
      }
      return this;
    });
  }

  /**
   * 剔除成员
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<Conversation>} self
   */
  remove(clientIds) {
    this._debug('remove', clientIds);
    if (typeof clientIds === 'string') {
      clientIds = [clientIds]; // eslint-disable-line no-param-reassign
    }
    const convMessage = new ConvCommand({
      m: clientIds,
    });
    return Promise.resolve(
      new GenericCommand({
        op: 'remove',
        convMessage,
      })
    ).then(command => {
      if (this._client.options.conversationSignatureFactory) {
        const params = [this.id, this._client.id, clientIds.sort(), 'remove'];
        return runSignatureFactory(this._client.options.conversationSignatureFactory, params)
          .then(signatureResult => {
            Object.assign(command.convMessage, keyRemap({
              signature: 's',
              timestamp: 't',
              nonce: 'n',
            }, signatureResult));
            return command;
          });
      }
      return command;
    }).then(
      this._send.bind(this)
    ).then(() => {
      if (!this.transient) {
        this.members = difference(this.members, clientIds);
      }
      return this;
    });
  }

  /**
   * （当前用户）加入该对话
   * @return {Promise.<Conversation>} self
   */
  join() {
    this._debug('join');
    return this.add(this._client.id);
  }

  /**
   * （当前用户）退出该对话
   * @return {Promise.<Conversation>} self
   */
  quit() {
    this._debug('quit');
    return this.remove(this._client.id);
  }

  /**
   * 发送消息
   * @param  {Message} message 消息，Message 及其子类的实例
   * @return {Promise.<Message>} 发送的消息
   */
  send(message) {
    this._debug(message, 'send');
    if (!(message instanceof Message)) {
      throw new TypeError(`${message} is not a Message`);
    }
    if (message.needReceipt) {
      if (this.transient) {
        console.warn('message needReceipt option is ignored as the conversation is transient.');
      } else if (message.transient) {
        console.warn('message needReceipt option is ignored as the message is transient.');
      } else if (this.members.length > 2) {
        console.warn('message with needReceipt option is recommended to be sent in one-on-one conversation.'); // eslint-disable-line max-len
      }
    }
    Object.assign(message, {
      cid: this.id,
      from: this._client.id,
    });
    message._setStatus(MessageStatus.SENDING);
    let msg = message.toJSON();
    if (typeof msg !== 'string') {
      msg = JSON.stringify(msg);
    }
    let sendPromise = this._send(new GenericCommand({
      cmd: 'direct',
      directMessage: new DirectCommand({
        msg,
        cid: this.id,
        r: message.needReceipt,
        transient: message.transient,
        dt: message.id,
      }),
    }), !message.transient);
    if (!message.transient) {
      sendPromise = sendPromise.then(resCommand => {
        const {
          ackMessage: {
            uid,
            t,
            code,
            reason,
            appCode,
            },
          } = resCommand;
        if (code !== null) {
          throw createError({
            code, reason, appCode,
          });
        }
        Object.assign(message, {
          id: uid,
          timestamp: new Date(t.toNumber()),
        });
        this.lastMessage = message;
        this.lastMessageAt = message.timestamp;
      });
    }
    return sendPromise.then(() => {
      message._setStatus(MessageStatus.SENT);
      if (message.needReceipt) {
        internal(this).messagesWaitingForReciept[message.id] = message;
      }
      return message;
    }, error => {
      message._setStatus(MessageStatus.FAILED);
      throw error;
    });
  }

  /**
   * 查询消息记录
   * 如果仅需实现消息记录翻页查询需求，建议使用 {@link Conversation#createMessagesIterator}
   * @param  {Object} [options]
   * @param  {Date}   [options.beforeTime] 限制查询结果为小于这个该时间之前的消息，不传则为当前时间
   * @param  {String} [options.beforeMessageId] 限制查询结果为该消息之前的消息，需要与 beforeTime 同时使用，为防止某时刻有重复消息
   * @param  {Date}   [options.afterTime] 限制查询结果为大于这个该时间之前的消息
   * @param  {String} [options.afterMessageId] 限制查询结果为该消息之后的消息，需要与 afterTime 同时使用，为防止某时刻有重复消息
   * @param  {Number} [options.limit] 限制查询结果的数量，目前服务端默认为 20
   * @return {Promise.<Message[]>} 消息列表
   */
  queryMessages(options = {}) {
    this._debug('query messages', options);
    if (options.beforeMessageId && !options.beforeTime) {
      throw new Error('query option beforeMessageId must be used with option beforeTime');
    }
    if (options.afterMessageId && !options.afterTime) {
      throw new Error('query option afterMessageId must be used with option afterTime');
    }
    const conditions = keyRemap({
      beforeTime: 't',
      beforeMessageId: 'mid',
      afterTime: 'tt',
      afterMessageId: 'tmid',
      limit: 'l',
    }, options);
    if (conditions.t instanceof Date) {
      conditions.t = conditions.t.getTime();
    }
    if (conditions.tt instanceof Date) {
      conditions.tt = conditions.tt.getTime();
    }
    return this._send(new GenericCommand({
      cmd: 'logs',
      logsMessage: new LogsCommand(
        Object.assign(conditions, {
          cid: this.id,
        })
      ),
    })).then(resCommand =>
      Promise.all(resCommand.logsMessage.logs.map(log =>
        this._client._messageParser.parse(log.data).then(message => {
          const messageProps = {
            id: log.msgId,
            cid: this.id,
            timestamp: new Date(log.timestamp.toNumber()),
            from: log.from,
          };
          Object.assign(message, messageProps);
          message._setStatus(MessageStatus.SENT);
          return message;
        })
      ))
    );
  }

  /**
   * 获取消息翻页迭代器
   * @param  {Object} [options]
   * @param  {Date}   [options.beforeTime] 限制起始查询结果为小于这个该时间之前的消息，不传则为当前时间
   * @param  {String} [options.beforeMessageId] 限制起始查询结果为该消息之前的消息，需要与 beforeTime 同时使用，为防止某时刻有重复消息
   * @param  {Number} [options.limit] 限制每页查询结果的数量，目前服务端默认为 20
   * @return {AsyncIterater.<Promise.<IteratorResult<Message[]>>>} [AsyncIterator]{@link https://github.com/tc39/proposal-async-iteration}，调用其 next 方法返回获取下一页消息的 Promise
   * @example
   * var messageIterator = conversation.createMessagesIterator({ limit: 10 });
   * messageIterator.next().then(function(result) {
   *   // result: {
   *   //   value: [message1, ..., message10],
   *   //   done: false,
   *   // }
   * });
   * messageIterator.next().then(function(result) {
   *   // result: {
   *   //   value: [message11, ..., message20],
   *   //   done: false,
   *   // }
   * });
   * messageIterator.next().then(function(result) {
   *   // No more messages
   *   // result: { value: [], done: true }
   * });
   */
  createMessagesIterator({ beforeTime, beforeMessageId, limit } = {}) {
    let promise;
    return {
      next: () => {
        if (promise === undefined) {
          // first call
          promise = this.queryMessages({
            limit,
            beforeTime,
            beforeMessageId,
          });
        } else {
          promise = promise.then(prevMessages => {
            if (prevMessages.length === 0 || prevMessages.length < limit) {
              // no more messages
              return [];
            }
            return this.queryMessages({
              beforeTime: prevMessages[0].timestamp,
              beforeMessageId: prevMessages[0].id,
              limit,
            });
          });
        }
        return promise.then(value => ({
          value: Array.from(value),
          done: value.length === 0 || value.length < limit,
        }));
      },
    };
  }

  /**
   * 将该会话标记为已读
   * @return {Promise.<Conversation>} self
   */
  markAsRead() {
    return this._client.markAllAsRead([this]).then(() => this);
  }

  _handleReceipt({ messageId, deliveredAt }) {
    const { messagesWaitingForReciept } = internal(this);
    const message = messagesWaitingForReciept[messageId];
    delete messagesWaitingForReciept[messageId];
    if (!message) return;
    message._setStatus(MessageStatus.DELIVERED);
    message.deliveredAt = deliveredAt;
    /**
     * 消息已送达。只有在发送时设置了需要回执的情况下才会收到送达回执，该回执并不代表用户已读。
     * @event Conversation#receipt
     * @since 3.2.0
     * @param {Object} payload
     * @param {Message} payload.message 送达的消息
     */
    this.emit('receipt', { message });
  }
}
