import EventEmitter from 'eventemitter3';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { decode as decodeBase64 } from 'base64-arraybuffer';
import d from 'debug';
import { decodeDate, keyRemap, union, difference, internal, setValue } from './utils';
import { applyDecorators } from './plugin';
import IMClient from './im-client';
import {
  GenericCommand,
  ConvCommand,
  JsonObjectMessage,
  DirectCommand,
  LogsCommand,
  PatchCommand,
  PatchItem,
  CommandType,
  OpType,
} from '../proto/message';
import runSignatureFactory from './signature-factory-runner';
import { createError } from './error';
import Message, { MessageStatus } from './messages/message';
import RecalledMessage from './messages/recalled-message';

const debug = d('LC:Conversation');

const serializeMessage = (message) => {
  const content = message.toJSON();
  let msg;
  let binaryMsg;
  if (content instanceof ArrayBuffer) {
    binaryMsg = content;
  } else if (typeof content !== 'string') {
    msg = JSON.stringify(content);
  } else {
    msg = content;
  }
  return { msg, binaryMsg };
};

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
    system = false,
    muted = false,
    mentioned = false,
    // jsdoc-ignore-start
    ...attributes
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
       * @type {?Date}
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
       * 系统对话标记
       * @memberof Conversation#
       * @type {Boolean}
       * @since 3.3.0
       */
      system,
      /**
       * 当前用户静音该对话标记
       * @memberof Conversation#
       * @type {Boolean}
       */
      muted,
    });
    this._attributes = attributes;
    this._reset();
    this.members = Array.from(new Set(this.members));
    Object.assign(internal(this), {
      messagesWaitingForReceipt: {},
      lastDeliveredAt: null,
      lastReadAt: null,
      unreadMessagesCount: 0,
      mentioned,
    });
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
      'receipt',
      'lastdeliveredatupdate',
      'lastreadatupdate',
      'messagerecall',
      'messageupdate',
    ].forEach(event => this.on(
      event,
      (...payload) => this._debug(`${event} event emitted. %O`, payload),
    ));
    // onConversationCreate hook
    applyDecorators(this._client._plugins.onConversationCreate, this);
  }

  /**
   * 当前用户是否在该对话中被提及
   * @type {Boolean}
   * @since 4.0.0
   */
  get mentioned() {
    return internal(this).mentioned;
  }
  _setMentioned(value) {
    internal(this).mentioned = Boolean(value);
  }

  set unreadMessagesCount(value) {
    if (value !== this.unreadMessagesCount) {
      internal(this).unreadMessagesCount = value;
      this._client.emit('unreadmessagescountupdate', [this]);
    }
  }
  /**
   * 当前用户在该对话的未读消息数
   * @type {Number}
   */
  get unreadMessagesCount() {
    return internal(this).unreadMessagesCount;
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
    const time = decodeDate(value);
    if (time <= this._lastMessageAt) return;
    this._lastMessageAt = time;
  }
  get lastMessageAt() {
    return this._lastMessageAt;
  }
  /**
   * 最后消息送达时间，常用来实现消息的「已送达」标记，可通过 {@link Conversation#fetchReceiptTimestamps} 获取或更新该属性
   * @type {?Date}
   * @since 3.4.0
   */
  get lastDeliveredAt() {
    if (this.members.length !== 2) return null;
    return internal(this).lastDeliveredAt;
  }
  _setLastDeliveredAt(value) {
    const date = decodeDate(value);
    if (!(date < internal(this).lastDeliveredAt)) {
      internal(this).lastDeliveredAt = date;
      /**
       * 最后消息送达时间更新
       * @event Conversation#lastdeliveredatupdate
       * @since 3.4.0
       */
      this.emit('lastdeliveredatupdate');
    }
  }
  /**
   * 最后消息被阅读时间，常用来实现发送消息的「已读」标记，可通过 {@link Conversation#fetchReceiptTimestamps} 获取或更新该属性
   * @type {?Date}
   * @since 3.4.0
   */
  get lastReadAt() {
    if (this.members.length !== 2) return null;
    return internal(this).lastReadAt;
  }
  _setLastReadAt(value) {
    const date = decodeDate(value);
    if (!(date < internal(this).lastReadAt)) {
      internal(this).lastReadAt = date;
      /**
       * 最后消息被阅读时间更新
       * @event Conversation#lastreadatupdate
       * @since 3.4.0
       */
      this.emit('lastreadatupdate');
    }
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
    childKeys.forEach((k) => {
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
        cloneDeep(this._attributes),
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
  async save() {
    this._debug('save');
    const attr = internal(this).pendingAttributes;
    if (isEmpty(attr)) {
      this._debug('nothing touched, resolve with self');
      return this;
    }
    this._debug('attr: %O', attr);
    const convMessage = new ConvCommand({
      attr: new JsonObjectMessage({
        data: JSON.stringify(attr),
      }),
    });
    const resCommand = await this._send(new GenericCommand({
      op: 'update',
      convMessage,
    }));
    this.updatedAt = resCommand.convMessage.udate;
    this._attributes = internal(this).currentAttributes;
    internal(this).pendingAttributes = {};
    return this;
  }

  /**
   * 从服务器更新对话的属性
   * @return {Promise.<Conversation>} self
   */
  async fetch() {
    const query = this._client.getQuery().equalTo('objectId', this.id);
    await query.find();
    return this;
  }

  /**
   * 静音，客户端拒绝收到服务器端的离线推送通知
   * @return {Promise.<Conversation>} self
   */
  async mute() {
    this._debug('mute');
    await this._send(new GenericCommand({
      op: 'mute',
    }));
    if (!this.transient) {
      this.muted = true;
      this.mutedMembers = union(this.mutedMembers, [this._client.id]);
    }
    return this;
  }

  /**
   * 取消静音
   * @return {Promise.<Conversation>} self
   */
  async unmute() {
    this._debug('unmute');
    await this._send(new GenericCommand({
      op: 'unmute',
    }));
    if (!this.transient) {
      this.muted = false;
      this.mutedMembers = difference(this.mutedMembers, [this._client.id]);
    }
    return this;
  }

  /**
   * 获取对话人数，或暂态对话的在线人数
   * @return {Promise.<Number>}
   */
  async count() {
    this._debug('unmute');
    const resCommand = await this._send(new GenericCommand({
      op: 'count',
    }));
    return resCommand.convMessage.count;
  }

  /**
   * 增加成员
   * @param {String|String[]} clientIds 新增成员 client id
   * @return {Promise.<Conversation>} self
   */
  async add(clientIds) {
    this._debug('add', clientIds);
    if (typeof clientIds === 'string') {
      clientIds = [clientIds]; // eslint-disable-line no-param-reassign
    }
    const convMessage = new ConvCommand({
      m: clientIds,
    });
    const command = new GenericCommand({
      op: 'add',
      convMessage,
    });
    if (this._client.options.conversationSignatureFactory) {
      const params = [this.id, this._client.id, clientIds.sort(), 'add'];
      const signatureResult = await runSignatureFactory(
        this._client.options.conversationSignatureFactory, params,
      );
      Object.assign(command.convMessage, keyRemap({
        signature: 's',
        timestamp: 't',
        nonce: 'n',
      }, signatureResult));
    }
    await this._send(command);
    if (!this.transient && !this.system) {
      this.members = union(this.members, clientIds);
    }
    return this;
  }

  /**
   * 剔除成员
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<Conversation>} self
   */
  async remove(clientIds) {
    this._debug('remove', clientIds);
    if (typeof clientIds === 'string') {
      clientIds = [clientIds]; // eslint-disable-line no-param-reassign
    }
    const convMessage = new ConvCommand({
      m: clientIds,
    });
    const command = new GenericCommand({
      op: 'remove',
      convMessage,
    });
    if (this._client.options.conversationSignatureFactory) {
      const params = [this.id, this._client.id, clientIds.sort(), 'remove'];
      const signatureResult = await runSignatureFactory(
        this._client.options.conversationSignatureFactory, params,
      );
      Object.assign(command.convMessage, keyRemap({
        signature: 's',
        timestamp: 't',
        nonce: 'n',
      }, signatureResult));
    }
    await this._send(command);
    if (!this.transient && !this.system) {
      this.members = difference(this.members, clientIds);
    }
    return this;
  }

  /**
   * （当前用户）加入该对话
   * @return {Promise.<Conversation>} self
   */
  async join() {
    this._debug('join');
    return this.add(this._client.id);
  }

  /**
   * （当前用户）退出该对话
   * @return {Promise.<Conversation>} self
   */
  async quit() {
    this._debug('quit');
    return this.remove(this._client.id);
  }

  /**
   * 发送消息
   * @param  {Message} message 消息，Message 及其子类的实例
   * @param {Object} [options] since v3.3.0，发送选项
   * @param {Boolean} [options.transient] since v3.3.1，是否作为暂态消息发送
   * @param {Boolean} [options.receipt] 是否需要回执，仅在普通对话中有效
   * @param {Boolean} [options.will] since v3.4.0，是否指定该消息作为「掉线消息」发送，
   * 「掉线消息」会延迟到当前用户掉线后发送，常用来实现「下线通知」功能
   * @param {MessagePriority} [options.priority] 消息优先级，仅在暂态对话中有效，
   * see: {@link module:leancloud-realtime.MessagePriority MessagePriority}
   * @param {Object} [options.pushData] 消息对应的离线推送内容，如果消息接收方不在线，会推送指定的内容。其结构说明参见: {@link https://url.leanapp.cn/pushData 推送消息内容}
   * @return {Promise.<Message>} 发送的消息
   */
  async send(message, options) {
    this._debug(message, 'send');
    if (!(message instanceof Message)) {
      throw new TypeError(`${message} is not a Message`);
    }
    const {
      transient,
      receipt,
      priority,
      pushData,
      will,
    } = Object.assign(
      {},
      // support Message static property: sendOptions
      message.constructor.sendOptions,
      // support Message static property: getSendOptions
      typeof message.constructor.getSendOptions === 'function' ? message.constructor.getSendOptions(message) : {},
      options,
    );
    if (receipt) {
      if (this.transient) {
        console.warn('receipt option is ignored as the conversation is transient.');
      } else if (transient) {
        console.warn('receipt option is ignored as the message is sent transiently.');
      } else if (this.members.length > 2) {
        console.warn('receipt option is recommended to be used in one-on-one conversation.'); // eslint-disable-line max-len
      }
    }
    if (priority && !this.transient) {
      console.warn('priority option is ignored as the conversation is not transient.');
    }
    Object.assign(message, {
      cid: this.id,
      from: this._client.id,
    });
    message._setStatus(MessageStatus.SENDING);
    const { msg, binaryMsg } = serializeMessage(message);
    const command = new GenericCommand({
      cmd: 'direct',
      directMessage: new DirectCommand({
        msg,
        binaryMsg,
        cid: this.id,
        r: receipt,
        transient,
        dt: message.id,
        pushData: JSON.stringify(pushData),
        will,
        mentionPids: message.mentionList,
        mentionAll: message.mentionedAll,
      }),
      priority,
    });
    try {
      const resCommand = await this._send(command, !transient);
      if (!transient) {
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
      }
      message._setStatus(MessageStatus.SENT);
      if (receipt) {
        internal(this).messagesWaitingForReceipt[message.id] = message;
      }
      return message;
    } catch (error) {
      message._setStatus(MessageStatus.FAILED);
      throw error;
    }
  }

  async _update(message, newMessage, recall) {
    this._debug('patch %O %O %O', message, newMessage, recall);
    if (message instanceof Message) {
      if (message.from !== this._client.id) {
        throw new Error('Updating message from others is not allowed');
      }
      if (message.status !== MessageStatus.SENT && message.status !== MessageStatus.DELIVERED) {
        throw new Error('Message is not sent');
      }
    } else if (!(message.id && message.timestamp)) {
      throw new TypeError(`${message} is not a Message`);
    }
    let msg;
    let binaryMsg;
    if (!recall) {
      const content = serializeMessage(newMessage);
      msg = content.msg;
      binaryMsg = content.binaryMsg;
    }
    await this._send(new GenericCommand({
      cmd: CommandType.patch,
      op: OpType.modify,
      patchMessage: new PatchCommand({
        patches: [new PatchItem({
          cid: this.id,
          mid: message.id,
          timestamp: Number(message.timestamp),
          recall,
          data: msg,
          binaryMsg,
          mentionPids: newMessage.mentionList,
          mentionAll: newMessage.mentionedAll,
        })],
        lastPatchTime: this._client._lastPatchTime,
      }),
    }));
    const {
      id, cid, timestamp, from, _status,
    } = message;
    Object.assign(newMessage, {
      id, cid, timestamp, from, _status,
    });
    if (this.lastMessage.id === newMessage.id) {
      this.lastMessage = newMessage;
    }
    return newMessage;
  }

  /**
   * 修改已发送的消息
   * @param {AVMessage} message 要修改的消息，该消息必须是由当前用户发送的。也可以提供一个包含消息 {id, timestamp} 的对象
   * @param {AVMessage} newMessage 新的消息
   */
  async update(message, newMessage) {
    if (!(newMessage instanceof Message)) {
      throw new TypeError(`${newMessage} is not a Message`);
    }
    return this._update(message, newMessage, false);
  }

  /**
   * 撤回已发送的消息
   * @param {AVMessage} message 要撤回的消息，该消息必须是由当前用户发送的。也可以提供一个包含消息 {id, timestamp} 的对象
   */
  async recall(message) {
    return this._update(message, new RecalledMessage(), true);
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
  async queryMessages(options = {}) {
    this._debug('query messages %O', options);
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
    const resCommand = await this._send(new GenericCommand({
      cmd: 'logs',
      logsMessage: new LogsCommand(
        Object.assign(conditions, {
          cid: this.id,
        }),
      ),
    }));
    return Promise.all(resCommand.logsMessage.logs.map(async ({
      msgId,
      timestamp,
      patchTimestamp,
      from,
      ackAt,
      readAt,
      data,
      mentionAll,
      mentionPids,
      bin,
    }) => {
      const content = bin ? decodeBase64(data) : data;
      const message = await this._client._messageParser.parse(content);
      const messageProps = {
        id: msgId,
        cid: this.id,
        timestamp: new Date(timestamp.toNumber()),
        from,
        deliveredAt: ackAt,
        mentionList: mentionPids,
        mentionedAll: mentionAll,
      };
      if (patchTimestamp) {
        messageProps.updatedAt = new Date(patchTimestamp.toNumber());
      }
      Object.assign(message, messageProps);
      message._updateMentioned(this._client.id);
      let status = MessageStatus.SENT;
      if (this.members.length === 2) {
        if (ackAt) status = MessageStatus.DELIVERED;
        if (ackAt) this._setLastDeliveredAt(ackAt);
        if (readAt) this._setLastReadAt(readAt);
      }
      message._setStatus(status);
      return message;
    }));
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
          promise = promise.then((prevMessages) => {
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
  async read() {
    this.unreadMessagesCount = 0;
    this._setMentioned(false);
    // 跳过暂态会话
    if (this.transient) return this;
    const client = this._client;
    if (!internal(client).readConversationsBuffer) {
      internal(client).readConversationsBuffer = new Set();
    }
    internal(client).readConversationsBuffer.add(this);
    client._doSendRead();
    return this;
  }

  _handleReceipt({ messageId, timestamp, read }) {
    if (read) {
      this._setLastReadAt(timestamp);
    } else {
      this._setLastDeliveredAt(timestamp);
    }
    const { messagesWaitingForReceipt } = internal(this);
    const message = messagesWaitingForReceipt[messageId];
    if (!message) return;
    message._setStatus(MessageStatus.DELIVERED);
    message.deliveredAt = timestamp;
    delete messagesWaitingForReceipt[messageId];
  }

  /**
   * 更新对话的最新回执时间戳（lastDeliveredAt、lastReadAt）
   * @since 3.4.0
   * @return {Promise.<Conversation>} this
   */
  async fetchReceiptTimestamps() {
    const {
      convMessage: {
        maxReadTimestamp,
        maxAckTimestamp,
      },
    } = await this._send(new GenericCommand({
      op: 'max_read',
    }));
    this._setLastDeliveredAt(maxAckTimestamp);
    this._setLastReadAt(maxReadTimestamp);
    return this;
  }

  _fetchAllReceiptTimestamps() {
    const convMessage = new ConvCommand({
      queryAllMembers: true,
    });
    return this._send(new GenericCommand({
      op: 'max_read',
      convMessage,
    })).then(({
      convMessage: {
        maxReadTuples,
      },
    }) => maxReadTuples
      .filter(maxReadTuple => maxReadTuple.maxAckTimestamp || maxReadTuple.maxReadTimestamp)
      .map(({ pid, maxAckTimestamp, maxReadTimestamp }) => ({
        pid,
        lastDeliveredAt: decodeDate(maxAckTimestamp),
        lastReadAt: decodeDate(maxReadTimestamp),
      })));
  }
}
