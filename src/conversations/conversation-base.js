/* eslint class-methods-use-this: ["error", { "exceptMethods": ["_addMembers", "_removeMembers"] }] */
import EventEmitter from 'eventemitter3';
import values from 'lodash/values';
import d from 'debug';
import { decodeDate, getTime, internal } from '../utils';
import { applyDecorators } from '../plugin';
import {
  GenericCommand,
  ConvCommand,
  DirectCommand,
  LogsCommand,
  PatchCommand,
  PatchItem,
  CommandType,
  OpType,
} from '../../proto/message';
import * as Event from '../events/im';
import { createError } from '../error';
import Message, { MessageStatus } from '../messages/message';
import RecalledMessage from '../messages/recalled-message';

const debug = d('LC:Conversation');

const serializeMessage = message => {
  const content = message.getPayload();
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

const { NEW, OLD } = LogsCommand.QueryDirection;

/**
 * 历史消息查询方向枚举
 * @enum {Number}
 * @since 4.0.0
 * @memberof module:leancloud-realtime
 */
const MessageQueryDirection = {
  /** 从后向前 */
  NEW_TO_OLD: OLD,
  /** 从前向后 */
  OLD_TO_NEW: NEW,
};
Object.freeze(MessageQueryDirection);

export { MessageQueryDirection };

export default class ConversationBase extends EventEmitter {
  /**
   * @extends EventEmitter
   * @private
   * @abstract
   */
  constructor(
    {
      id,
      lastMessageAt,
      lastMessage,
      lastDeliveredAt,
      lastReadAt,
      unreadMessagesCount = 0,
      members = [],
      mentioned = false,
      ...properties
    },
    client
  ) {
    super();
    Object.assign(this, {
      /**
       * 对话 id，对应 _Conversation 表中的 objectId
       * @memberof ConversationBase#
       * @type {String}
       */
      id,
      /**
       * 最后一条消息时间
       * @memberof ConversationBase#
       * @type {?Date}
       */
      lastMessageAt,
      /**
       * 最后一条消息
       * @memberof ConversationBase#
       * @type {?Message}
       */
      lastMessage,
      /**
       * 参与该对话的用户列表
       * @memberof ConversationBase#
       * @type {String[]}
       */
      members,
      // other properties provided by subclasses
      ...properties,
    });
    this.members = Array.from(new Set(this.members));
    Object.assign(internal(this), {
      messagesWaitingForReceipt: {},
      lastDeliveredAt,
      lastReadAt,
      unreadMessagesCount,
      mentioned,
    });
    this._client = client;
    if (debug.enabled) {
      values(Event).forEach(event =>
        this.on(event, (...payload) =>
          this._debug(`${event} event emitted. %o`, payload)
        )
      );
    }
    // onConversationCreate hook
    applyDecorators(this._client._plugins.onConversationCreate, this);
  }

  /**
   * 当前用户是否在该对话的未读消息中被提及
   * @type {Boolean}
   * @since 4.0.0
   */
  get unreadMessagesMentioned() {
    return internal(this).unreadMessagesMentioned;
  }

  _setUnreadMessagesMentioned(value) {
    internal(this).unreadMessagesMentioned = Boolean(value);
  }

  set unreadMessagesCount(value) {
    if (value !== this.unreadMessagesCount) {
      internal(this).unreadMessagesCount = value;
      this._client.emit(Event.UNREAD_MESSAGES_COUNT_UPDATE, [this]);
    }
  }

  /**
   * 当前用户在该对话的未读消息数
   * @type {Number}
   */
  get unreadMessagesCount() {
    return internal(this).unreadMessagesCount;
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
       * @event ConversationBase#LAST_DELIVERED_AT_UPDATE
       * @since 3.4.0
       */
      this.emit(Event.LAST_DELIVERED_AT_UPDATE);
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
       * @event ConversationBase#LAST_READ_AT_UPDATE
       * @since 3.4.0
       */
      this.emit(Event.LAST_READ_AT_UPDATE);
    }
  }

  /**
   * 返回 JSON 格式的对话，与 toJSON 不同的是，该对象包含了完整的信息，可以通过 {@link IMClient#parseConversation} 反序列化。
   * @return {Object} 返回值是一个 plain Object
   * @since 4.0.0
   */
  toFullJSON() {
    const {
      id,
      members,
      lastMessageAt,
      lastDeliveredAt,
      lastReadAt,
      lastMessage,
      unreadMessagesCount,
    } = this;
    return {
      id,
      members,
      lastMessageAt: getTime(lastMessageAt),
      lastDeliveredAt: getTime(lastDeliveredAt),
      lastReadAt: getTime(lastReadAt),
      lastMessage: lastMessage ? lastMessage.toFullJSON() : undefined,
      unreadMessagesCount,
    };
  }

  /**
   * 返回 JSON 格式的对话
   * @return {Object} 返回值是一个 plain Object
   * @since 4.0.0
   */
  toJSON() {
    const {
      id,
      members,
      lastMessageAt,
      lastDeliveredAt,
      lastReadAt,
      lastMessage,
      unreadMessagesCount,
      unreadMessagesMentioned,
    } = this;
    return {
      id,
      members,
      lastMessageAt,
      lastDeliveredAt,
      lastReadAt,
      lastMessage: lastMessage ? lastMessage.toJSON() : undefined,
      unreadMessagesCount,
      unreadMessagesMentioned,
    };
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
    const { transient, receipt, priority, pushData, will } = Object.assign(
      {},
      // support Message static property: sendOptions
      message.constructor.sendOptions,
      // support Message static property: getSendOptions
      typeof message.constructor.getSendOptions === 'function'
        ? message.constructor.getSendOptions(message)
        : {},
      options
    );
    if (receipt) {
      if (this.transient) {
        console.warn(
          'receipt option is ignored as the conversation is transient.'
        );
      } else if (transient) {
        console.warn(
          'receipt option is ignored as the message is sent transiently.'
        );
      } else if (this.members.length > 2) {
        console.warn(
          'receipt option is recommended to be used in one-on-one conversation.'
        ); // eslint-disable-line max-len
      }
    }
    if (priority && !this.transient) {
      console.warn(
        'priority option is ignored as the conversation is not transient.'
      );
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
      const resCommand = await this._send(command);
      const {
        ackMessage: { uid, t, code, reason, appCode },
      } = resCommand;
      if (code !== null) {
        throw createError({
          code,
          reason,
          appCode,
        });
      }
      Object.assign(message, {
        id: uid,
        timestamp: t,
      });
      if (!transient) {
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
      if (
        message.status !== MessageStatus.SENT &&
        message.status !== MessageStatus.DELIVERED
      ) {
        throw new Error('Message is not sent');
      }
    } else if (!(message.id && message.timestamp)) {
      throw new TypeError(`${message} is not a Message`);
    }
    let msg;
    let binaryMsg;
    if (!recall) {
      const content = serializeMessage(newMessage);
      ({ msg, binaryMsg } = content);
    }
    await this._send(
      new GenericCommand({
        cmd: CommandType.patch,
        op: OpType.modify,
        patchMessage: new PatchCommand({
          patches: [
            new PatchItem({
              cid: this.id,
              mid: message.id,
              timestamp: Number(message.timestamp),
              recall,
              data: msg,
              binaryMsg,
              mentionPids: newMessage.mentionList,
              mentionAll: newMessage.mentionedAll,
            }),
          ],
          lastPatchTime: this._client._lastPatchTime,
        }),
      })
    );
    const { id, cid, timestamp, from, _status } = message;
    Object.assign(newMessage, {
      id,
      cid,
      timestamp,
      from,
      _status,
    });
    if (this.lastMessage.id === newMessage.id) {
      this.lastMessage = newMessage;
    }
    return newMessage;
  }

  /**
   * 获取对话人数，或暂态对话的在线人数
   * @return {Promise.<Number>}
   */
  async count() {
    this._debug('count');
    const resCommand = await this._send(
      new GenericCommand({
        op: 'count',
      })
    );
    return resCommand.convMessage.count;
  }

  /**
   * 应用增加成员的操作，产生副作用
   * @param {string[]} members
   * @abstract
   * @private
   */
  _addMembers() {}

  /**
   * 应用减少成员的操作，产生副作用
   * @param {string[]} members
   * @abstract
   * @private
   */
  _removeMembers() {}

  /**
   * 修改已发送的消息
   * @param {AVMessage} message 要修改的消息，该消息必须是由当前用户发送的。也可以提供一个包含消息 {id, timestamp} 的对象
   * @param {AVMessage} newMessage 新的消息
   * @return {Promise.<AVMessage>} 更新后的消息
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
   * @return {Promise.<RecalledMessage>} 一条已撤回的消息
   */
  async recall(message) {
    return this._update(message, new RecalledMessage(), true);
  }

  /**
   * 查询消息记录
   * 如果仅需实现消息向前记录翻页查询需求，建议使用 {@link Conversation#createMessagesIterator}。
   * 不论何种方向，获得的消息都是按照时间升序排列的。
   * startClosed 与 endClosed 用于指定查询区间的开闭。
   *
   * @param  {Object} [options]
   * @param  {Number} [options.limit] 限制查询结果的数量，目前服务端默认为 20
   * @param  {Number}   [options.type] 指定查询的富媒体消息类型，不指定则查询所有消息。
   * @param  {MessageQueryDirection} [options.direction] 查询的方向。
   * 在不指定的情况下如果 startTime 大于 endTime，则为从新到旧查询，可以实现加载聊天记录等场景。
   * 如果 startTime 小于 endTime，则为从旧到新查询，可以实现弹幕等场景。
   * @param  {Date}   [options.startTime] 从该时间开始查询，不传则从当前时间开始查询
   * @param  {String} [options.startMessageId] 从该消息之前开始查询，需要与 startTime 同时使用，为防止某时刻有重复消息
   * @param  {Boolean}[options.startClosed] 指定查询范围是否包括开始的时间点，默认不包括
   * @param  {Date}   [options.endTime] 查询到该时间为止，不传则查询最早消息为止
   * @param  {String} [options.endMessageId] 查询到该消息为止，需要与 endTime 同时使用，为防止某时刻有重复消息
   * @param  {Boolean}[options.endClosed] 指定查询范围是否包括结束的时间点，默认不包括
   *
   * @param  {Date}   [options.beforeTime] DEPRECATED: 使用 startTime 代替。限制查询结果为小于该时间之前的消息，不传则为当前时间
   * @param  {String} [options.beforeMessageId] DEPRECATED: 使用 startMessageId 代替。
   * 限制查询结果为该消息之前的消息，需要与 beforeTime 同时使用，为防止某时刻有重复消息
   * @param  {Date}   [options.afterTime] DEPRECATED: 使用 endTime 代替。限制查询结果为大于该时间之前的消息
   * @param  {String} [options.afterMessageId] DEPRECATED: 使用 endMessageId 代替。
   * 限制查询结果为该消息之后的消息，需要与 afterTime 同时使用，为防止某时刻有重复消息
   * @return {Promise.<Message[]>} 消息列表
   */
  async queryMessages(options = {}) {
    this._debug('query messages %O', options);
    const {
      beforeTime,
      beforeMessageId,
      afterTime,
      afterMessageId,
      limit,
      direction,
      type,
      startTime,
      startMessageId,
      startClosed,
      endTime,
      endMessageId,
      endClosed,
    } = options;
    if (beforeMessageId || beforeTime || afterMessageId || afterTime) {
      console.warn(
        'DEPRECATION: queryMessages options beforeTime, beforeMessageId, afterTime and afterMessageId are deprecated in favor of startTime, startMessageId, endTime and endMessageId.'
      );
      return this.queryMessages({
        startTime: beforeTime,
        startMessageId: beforeMessageId,
        endTime: afterTime,
        endMessageId: afterMessageId,
        limit,
      });
    }
    if (startMessageId && !startTime) {
      throw new Error(
        'query option startMessageId must be used with option startTime'
      );
    }
    if (endMessageId && !endTime) {
      throw new Error(
        'query option endMessageId must be used with option endTime'
      );
    }
    const conditions = {
      t: startTime,
      mid: startMessageId,
      tIncluded: startClosed,
      tt: endTime,
      tmid: endMessageId,
      ttIncluded: endClosed,
      l: limit,
      lctype: type,
    };
    if (conditions.t instanceof Date) {
      conditions.t = conditions.t.getTime();
    }
    if (conditions.tt instanceof Date) {
      conditions.tt = conditions.tt.getTime();
    }
    if (direction !== undefined) {
      conditions.direction = direction;
    } else if (conditions.tt > conditions.t) {
      conditions.direction = MessageQueryDirection.OLD_TO_NEW;
    }
    const resCommand = await this._send(
      new GenericCommand({
        cmd: 'logs',
        logsMessage: new LogsCommand(
          Object.assign(conditions, {
            cid: this.id,
          })
        ),
      })
    );
    return Promise.all(
      resCommand.logsMessage.logs.map(
        async ({
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
          const messageData = {
            data,
            bin,
            id: msgId,
            cid: this.id,
            timestamp,
            from,
            deliveredAt: ackAt,
            updatedAt: patchTimestamp,
            mentionList: mentionPids,
            mentionedAll: mentionAll,
          };
          const message = await this._client.parseMessage(messageData);
          let status = MessageStatus.SENT;
          if (this.members.length === 2) {
            if (ackAt) status = MessageStatus.DELIVERED;
            if (ackAt) this._setLastDeliveredAt(ackAt);
            if (readAt) this._setLastReadAt(readAt);
          }
          message._setStatus(status);
          return message;
        }
      )
    );
  }

  /**
   * 获取消息翻页迭代器
   * @param  {Object} [options]
   * @param  {Date}   [options.beforeTime] 限制起始查询结果为小于该时间之前的消息，不传则为当前时间
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
            startTime: beforeTime,
            startMessageId: beforeMessageId,
          });
        } else {
          promise = promise.then(prevMessages => {
            if (prevMessages.length === 0 || prevMessages.length < limit) {
              // no more messages
              return [];
            }
            return this.queryMessages({
              startTime: prevMessages[0].timestamp,
              startMessageId: prevMessages[0].id,
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
   * @return {Promise.<this>} self
   */
  async read() {
    this.unreadMessagesCount = 0;
    this._setUnreadMessagesMentioned(false);
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
   * @return {Promise.<this>} this
   */
  async fetchReceiptTimestamps() {
    const {
      convMessage: { maxReadTimestamp, maxAckTimestamp },
    } = await this._send(
      new GenericCommand({
        op: 'max_read',
      })
    );
    this._setLastDeliveredAt(maxAckTimestamp);
    this._setLastReadAt(maxReadTimestamp);
    return this;
  }

  _fetchAllReceiptTimestamps() {
    const convMessage = new ConvCommand({
      queryAllMembers: true,
    });
    return this._send(
      new GenericCommand({
        op: 'max_read',
        convMessage,
      })
    ).then(({ convMessage: { maxReadTuples } }) =>
      maxReadTuples
        .filter(
          maxReadTuple =>
            maxReadTuple.maxAckTimestamp || maxReadTuple.maxReadTimestamp
        )
        .map(({ pid, maxAckTimestamp, maxReadTimestamp }) => ({
          pid,
          lastDeliveredAt: decodeDate(maxAckTimestamp),
          lastReadAt: decodeDate(maxReadTimestamp),
        }))
    );
  }
}
