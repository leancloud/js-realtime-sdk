import throttle from 'lodash/throttle';
import EventEmitter from 'eventemitter3';
import { default as d } from 'debug';
import Client from './client';
import Conversation from './conversation';
import ConversationQuery from './conversation-query';
import {
  GenericCommand,
  SessionCommand,
  ConvCommand,
  AckCommand,
  JsonObjectMessage,
  ReadCommand,
  ReadTuple,
  CommandType,
  OpType,
} from '../proto/message';
import * as Errors from './errors';
import { tap, Expirable, Cache, keyRemap, union, difference, trim, internal } from './utils';
import { applyDecorators } from './plugin';
import runSignatureFactory from './signature-factory-runner';
import { MessageStatus } from './messages/message';
import { version as VERSION } from '../package.json';

const debug = d('LC:IMClient');

export default class IMClient extends Client {
  /**
   * 无法直接实例化，请使用 {@link Realtime#createIMClient} 创建新的 IMClient。
   *
   * @extends EventEmitter
   * @param  {String} [id] 客户端 id
   * @param  {Object} [options]
   * @param  {Function} [options.signatureFactory] open session 时的签名方法 // TODO need details
   * @param  {Function} [options.conversationSignatureFactory] 对话创建、增减成员操作时的签名方法
   */
  constructor(...args) {
    /**
     * @var id {String} 客户端 id
     * @memberof IMClient#
     */
    super(...args);
    if (!this._messageParser) {
      throw new Error('IMClient must be initialized with a MessageParser');
    }
    this._conversationCache = new Cache(`client:${this.id}`);
    this._ackMessageBuffer = {};
    internal(this)._eventemitter = new EventEmitter();
    [
      'invited',
      'kicked',
      'membersjoined',
      'membersleft',
      'message',
      'unreadmessages',
      'close',
      'conflict',
      'unhandledmessage',
    ].forEach(event => this.on(
      event,
      payload => this._debug(`${event} event emitted.`, payload)
    ));
    // onIMClientCreate hook
    applyDecorators(this._plugins.onIMClientCreate, this);
  }

  _debug(...params) {
    debug(...params, `[${this.id}]`);
  }

  /**
   * @override
   * @private
   */
  _dispatchMessage(message) {
    this._debug(trim(message), 'received');
    switch (message.cmd) {
      case CommandType.conv:
        return this._dispatchConvMessage(message);
      case CommandType.direct:
        return this._dispatchDirectMessage(message);
      case CommandType.session:
        return this._dispatchSessionMessage(message);
      case CommandType.unread:
        return this._dispatchUnreadMessage(message);
      case CommandType.rcp:
        return this._dispatchRcpMessage(message);
      default:
        this.emit('unhandledmessage', message);
        return Promise.resolve();
    }
  }

  _dispatchSessionMessage(message) {
    const {
      sessionMessage: {
        code, reason,
      },
    } = message;
    switch (message.op) {
      case OpType.closed: {
        if (code === Errors.SESSION_CONFLICT.code) {
          /**
           * 用户在其他客户端登录，当前客户端被服务端强行下线。详见文档「单点登录」章节。
           * @event IMClient#conflict
           */
          return this.emit('conflict', {
            reason,
          });
        }
        /**
         * 当前客户端被服务端强行下线
         * @event IMClient#close
         * @param {Object} payload
         * @param {Number} payload.code 错误码
         * @param {String} payload.reason 原因
         */
        return this.emit('close', {
          code, reason,
        });
      }
      default:
        this.emit('unhandledmessage', message);
        return Promise.reject(new Error('Unrecognized session command'));
    }
  }

  _dispatchUnreadMessage(message) {
    const convs = message.unreadMessage.convs;
    return Promise.all(convs.map(
      conv => this
        .getConversation(conv.cid)
        .then(conversation => {
          let timestamp;
          if (conv.timestamp) {
            timestamp = new Date(conv.timestamp.toNumber());
            conversation.lastMessageAt = timestamp; // eslint-disable-line no-param-reassign
          }
          conversation.unreadMessagesCount = conv.unread; // eslint-disable-line no-param-reassign
          /**
           * 未读消息数目更新
           * @event IMClient#unreadmessages
           * @param {Object} payload
           * @param {Number} payload.count 未读消息数
           * @param {String} [payload.lastMessageId] 最新一条未读消息 id
           * @param {Date} [payload.lastMessageTimestamp] 最新一条未读消息时间戳
           * @param {Conversation} conversation 未读消息数目有更新的对话
           */
          this.emit('unreadmessages', {
            count: conv.unread,
            lastMessageId: conv.mid,
            lastMessageTimestamp: timestamp,
          }, conversation);
        })
    ));
  }

  _dispatchRcpMessage(message) {
    const {
      rcpMessage,
    } = message;
    const conversationId = rcpMessage.cid;
    const messageId = rcpMessage.id;
    const deliveredAt = new Date(rcpMessage.t.toNumber());
    const conversation = this._conversationCache.get(conversationId);
    // conversation not cached means the client does not send the message
    // during this session
    if (!conversation) return;
    conversation._handleReceipt({ messageId, deliveredAt });
  }

  _dispatchConvMessage(message) {
    const {
      convMessage,
      convMessage: {
        initBy, m,
      },
    } = message;
    switch (message.op) {
      case OpType.joined: {
        return this.getConversation(convMessage.cid).then(conversation => {
          if (!conversation.transient) {
            // eslint-disable-next-line no-param-reassign
            conversation.members = union(conversation.members, [this.id]);
          }
          const payload = {
            invitedBy: initBy,
          };
          /**
           * 当前用户被添加至某个对话
           * @event IMClient#invited
           * @param {Object} payload
           * @param {String} payload.invitedBy 邀请者 id
           * @param {Conversation} conversation
           */
          this.emit('invited', payload, conversation);
          /**
           * 当前用户被添加至当前对话
           * @event Conversation#invited
           * @param {Object} payload
           * @param {String} payload.invitedBy 该移除操作的发起者 id
           */
          conversation.emit('invited', payload);
        });
      }
      case OpType.left: {
        return this.getConversation(convMessage.cid).then(conversation => {
          if (!conversation.transient) {
            // eslint-disable-next-line no-param-reassign
            conversation.members = difference(conversation.members, [this.id]);
          }
          const payload = {
            kickedBy: initBy,
          };
          /**
           * 当前用户被从某个对话中移除
           * @event IMClient#kicked
           * @param {Object} payload
           * @param {String} payload.kickedBy 该移除操作的发起者 id
           * @param {Conversation} conversation
           */
          this.emit('kicked', payload, conversation);
          /**
           * 当前用户被从当前对话中移除
           * @event Conversation#kicked
           * @param {Object} payload
           * @param {String} payload.kickedBy 该移除操作的发起者 id
           */
          conversation.emit('kicked', payload);
        });
      }
      case OpType.members_joined: {
        return this.getConversation(convMessage.cid).then(conversation => {
          if (!conversation.transient) {
            // eslint-disable-next-line no-param-reassign
            conversation.members = union(conversation.members, convMessage.m);
          }
          const payload = {
            invitedBy: initBy,
            members: m,
          };
          /**
           * 有用户被添加至某个对话
           * @event IMClient#membersjoined
           * @param {Object} payload
           * @param {String[]} payload.members 被添加的用户 id 列表
           * @param {String} payload.invitedBy 邀请者 id
           * @param {Conversation} conversation
           */
          this.emit('membersjoined', payload, conversation);
          /**
           * 有成员被添加至当前对话
           * @event Conversation#membersjoined
           * @param {Object} payload
           * @param {String[]} payload.members 被添加的成员 id 列表
           * @param {String} payload.invitedBy 邀请者 id
           */
          conversation.emit('membersjoined', payload);
        });
      }
      case OpType.members_left: {
        return this.getConversation(convMessage.cid).then(conversation => {
          if (!conversation.transient) {
            // eslint-disable-next-line no-param-reassign
            conversation.members = difference(conversation.members, convMessage.m);
          }
          const payload = {
            kickedBy: initBy,
            members: m,
          };
          /**
           * 有成员被从某个对话中移除
           * @event IMClient#membersleft
           * @param {Object} payload
           * @param {String[]} payload.members 被移除的成员 id 列表
           * @param {String} payload.kickedBy 该移除操作的发起者 id
           * @param {Conversation} conversation
           */
          this.emit('membersleft', payload, conversation);
          /**
           * 有成员被从当前对话中移除
           * @event Conversation#membersleft
           * @param {Object} payload
           * @param {String[]} payload.members 被移除的成员 id 列表
           * @param {String} payload.kickedBy 该移除操作的发起者 id
           */
          conversation.emit('membersleft', payload);
        });
      }
      default:
        this.emit('unhandledmessage', message);
        return Promise.reject(new Error('Unrecognized conversation command'));
    }
  }

  _dispatchDirectMessage(originalMessage) {
    const {
      directMessage,
      directMessage: {
        id, cid, fromPeerId, timestamp, transient,
      },
    } = originalMessage;
    return Promise.all([
      this.getConversation(directMessage.cid),
      this._messageParser.parse(directMessage.msg),
    ]).then(([conversation, message]) => {
      const messageProps = {
        id,
        cid,
        timestamp: new Date(timestamp.toNumber()),
        from: fromPeerId,
        transient,
      };
      Object.assign(message, messageProps);
      message._setStatus(MessageStatus.SENT);
      conversation.lastMessage = message; // eslint-disable-line no-param-reassign
      conversation.lastMessageAt = message.timestamp; // eslint-disable-line no-param-reassign
      conversation.unreadMessagesCount++; // eslint-disable-line no-param-reassign
      /**
       * 当前用户收到消息
       * @event IMClient#message
       * @param {Message} message
       * @param {Conversation} conversation 收到消息的对话
       */
      this.emit('message', message, conversation);
      /**
       * 当前对话收到消息
       * @event Conversation#message
       * @param {Message} message
       */
      conversation.emit('message', message);
      if (!(transient || conversation.transient)) {
        this._sendAck(message);
      }
    });
  }

  _sendAck(message) {
    this._debug('send ack for', message);
    const { cid } = message;
    if (!cid) {
      return Promise.reject(new Error('missing cid'));
    }
    if (!this._ackMessageBuffer[cid]) {
      this._ackMessageBuffer[cid] = [];
    }
    this._ackMessageBuffer[cid].push(message);
    if (!this._doSendAckThrottled) {
      this._doSendAckThrottled = throttle(this._doSendAck.bind(this), 1000);
    }
    return this._doSendAckThrottled();
  }

  _doSendAck() {
    if (!this._connection.is('connected')) {
      // if not connected, just skip everything
      return Promise.resolve();
    }
    debug('do send ack', this._ackMessageBuffer);
    return Promise.all(Object.keys(this._ackMessageBuffer).map(cid => {
      const convAckMessages = this._ackMessageBuffer[cid];
      const timestamps = convAckMessages.map(message => message.timestamp);
      const command = new GenericCommand({
        cmd: 'ack',
        ackMessage: new AckCommand({
          cid,
          fromts: Math.min.apply(null, timestamps),
          tots: Math.max.apply(null, timestamps),
        }),
      });
      return this._send(command, false)
        .then(() => delete this._ackMessageBuffer[cid])
        .catch(error => console.warn('send ack failed:', error));
    }));
  }

  _send(cmd, ...args) {
    const command = cmd;
    if (this.id) {
      command.peerId = this.id;
    }
    return this._connection.send(command, ...args);
  }

  _open(appId, tag, deviceId, isReconnect = false) {
    this._debug('open session');
    return Promise
      .resolve(new GenericCommand({
        cmd: 'session',
        op: 'open',
        appId,
        sessionMessage: new SessionCommand({
          ua: `js/${VERSION}`,
          r: isReconnect,
        }),
      }))
      .then(command => {
        if (isReconnect) {
          // if sessionToken is not expired, skip signature/tag/deviceId
          const sessionToken = internal(this).sessionToken;
          if (sessionToken) {
            const value = sessionToken.value;
            if (value && value !== Expirable.EXPIRED) {
              Object.assign(command.sessionMessage, {
                st: value,
              });
              return command;
            }
          }
        }
        Object.assign(command.sessionMessage, trim({
          tag,
          deviceId,
        }));
        if (this.options.signatureFactory) {
          return runSignatureFactory(this.options.signatureFactory, [this.id])
            .then(signatureResult => {
              Object.assign(command.sessionMessage, keyRemap({
                signature: 's',
                timestamp: 't',
                nonce: 'n',
              }, signatureResult));
              return command;
            });
        }
        return command;
      })
      .then(this._send.bind(this))
      .then(resCommand => {
        const {
          peerId,
          sessionMessage: {
            st: token,
            stTtl: tokenTTL,
          },
        } = resCommand;
        if (!peerId) {
          console.warn('Unexpected session opened without peerId.');
          return;
        }
        this.id = peerId;
        if (token) {
          internal(this).sessionToken = new Expirable(token, tokenTTL * 1000);
        }
      }, error => {
        if (error.code === Errors.SESSION_TOKEN_EXPIRED.code) {
          if (internal(this).sessionToken === undefined) {
            // let it fail if sessoinToken not cached but command rejected as token expired
            // to prevent session openning flood
            throw new Error('Unexpected session expiration');
          }
          debug('Session token expired, reopening');
          delete internal(this).sessionToken;
          return this._open(appId, tag, deviceId, isReconnect);
        }
        throw error;
      });
  }

  /**
   * 关闭客户端
   * @return {Promise}
   */
  close() {
    this._debug('close session');
    const command = new GenericCommand({
      cmd: 'session',
      op: 'close',
    });
    return this._send(command).then(
      () => {
        internal(this)._eventemitter.emit('close', {
          code: 0,
        });
        this.emit('close', {
          code: 0,
        });
      }
    );
  }
  /**
   * 获取 client 列表中在线的 client，每次查询最多 20 个 clientId，超出部分会被忽略
   * @param  {String[]} clientIds 要查询的 client ids
   * @return {Primse.<String[]>} 在线的 client ids
   */
  ping(clientIds) {
    this._debug('ping');
    if (!(clientIds instanceof Array)) {
      throw new TypeError(`clientIds ${clientIds} is not an Array`);
    }
    if (!clientIds.length) {
      return Promise.resolve([]);
    }
    const command = new GenericCommand({
      cmd: 'session',
      op: 'query',
      sessionMessage: new SessionCommand({
        sessionPeerIds: clientIds,
      }),
    });
    return this._send(command)
      .then(resCommand => resCommand.sessionMessage.onlineSessionPeerIds);
  }

  /**
   * 获取某个特定的 conversation
   * @param  {String} id 对话 id，对应 _Conversation 表中的 objectId
   * @param  {Boolean} [noCache=false] 强制不从缓存中获取
   * @return {Promise.<Conversation>}
   */
  getConversation(id, noCache = false) {
    if (typeof id !== 'string') {
      throw new TypeError(`${id} is not a String`);
    }
    if (!noCache) {
      const cachedConversation = this._conversationCache.get(id);
      if (cachedConversation) {
        return Promise.resolve(cachedConversation);
      }
    }
    return this
      .getQuery()
      .equalTo('objectId', id)
      .find()
      .then(conversations => conversations[0] || null);
  }

  /**
   * 构造一个 ConversationQuery 来查询对话
   * @return {ConversationQuery}
   */
  getQuery() {
    return new ConversationQuery(this);
  }

  _executeQuery(query) {
    const queryJSON = query.toJSON();
    queryJSON.where = new JsonObjectMessage({
      data: JSON.stringify(queryJSON.where),
    });
    const command = new GenericCommand({
      cmd: 'conv',
      op: 'query',
      convMessage: new ConvCommand(queryJSON),
    });
    return this
      ._send(command)
      .then(resCommand => {
        try {
          return JSON.parse(resCommand.convMessage.results.data);
        } catch (error) {
          const commandString = JSON.stringify(trim(resCommand));
          throw new Error(`Parse query result failed: ${error.message}. Command: ${commandString}`);
        }
      })
      .then(conversations => Promise.all(conversations.map(
        this._parseConversationFromRawData.bind(this)
      )))
      .then(conversations => conversations.map(fetchedConversation => {
        let conversation = this._conversationCache.get(fetchedConversation.id);
        if (!conversation) {
          conversation = fetchedConversation;
          this._debug('no match, set cache');
          this._conversationCache.set(fetchedConversation.id, fetchedConversation);
        } else {
          this._debug('update cached conversation');
          [
            'creator',
            'createdAt',
            'updatedAt',
            'lastMessageAt',
            'lastMessage',
            'mutedMembers',
            'members',
            '_attributes',
            'transient',
            'muted',
          ].forEach(key => {
            const value = fetchedConversation[key];
            if (value !== undefined) conversation[key] = value;
          });
          conversation._reset();
        }
        return conversation;
      }));
  }

  _parseConversationFromRawData(rawData) {
    const data = keyRemap({
      objectId: 'id',
      lm: 'lastMessageAt',
      msg: 'lastMessage',
      msg_from: 'lastMessageFrom',
      msg_mid: 'lastMessageId',
      msg_timestamp: 'lastMessageTimestamp',
      m: 'members',
      tr: 'transient',
      c: 'creator',
      mu: 'mutedMembers',
    }, rawData);
    return Promise.resolve().then(() => {
      if (data.lastMessage) {
        return this._messageParser.parse(data.lastMessage).then(
          message => {
            data.lastMessage = message;
            data.lastMessage.from = data.lastMessageFrom;
            data.lastMessage.id = data.lastMessageId;
            data.lastMessage.timestamp = new Date(data.lastMessageTimestamp);
            data.lastMessage._setStatus(MessageStatus.SENT);
            delete data.lastMessageFrom;
            delete data.lastMessageId;
            delete data.lastMessageTimestamp;
          }
        );
      }
      return Promise.resolve();
    }).then(() => new Conversation(data, this));
  }

  /**
   * 创建一个 conversation
   * @param {Object} options 除了下列字段外的其他字段将被视为对话的自定义属性
   * @param {String[]} options.members 对话的初始成员列表，默认包含当前 client
   * @param {String} [options.name] 对话的名字
   * @param {Object} [options.attributes] DEPRECATED: 额外属性，对应 _Conversation 表的 attr 列
   * @param {Boolean} [options.transient=false] 暂态会话
   * @param {Boolean} [options.unique=false] 唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话
   * @return {Promise.<Conversation>}
   */
  createConversation(options = {}) {
    const {
      members: m,
      name,
      attributes,
      transient,
      unique,
      ...properties,
    } = options;
    if (!(transient || Array.isArray(m))) {
      throw new TypeError(`conversation members ${m} is not an array`);
    }
    let members = new Set(m);
    members.add(this.id);
    members = Array.from(members).sort();
    let attr = properties || {};
    if (name) {
      if (typeof name !== 'string') {
        throw new TypeError(`conversation name ${name} is not a string`);
      }
      attr.name = name;
    }
    if (attributes) {
      console.warn('DEPRECATION createConversation options.attributes param: Use options[propertyName] instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
      attr.attr = attributes;
    }
    attr = new JsonObjectMessage({
      data: JSON.stringify(attr),
    });

    const startCommandJson = {
      m: members,
      attr,
      transient,
      unique,
    };

    return Promise.resolve(
        new GenericCommand({
          cmd: 'conv',
          op: 'start',
          convMessage: new ConvCommand(startCommandJson),
        })
      )
      .then(command => {
        if (this.options.conversationSignatureFactory) {
          const params = [null, this.id, members, 'create'];
          return runSignatureFactory(this.options.conversationSignatureFactory, params)
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
      })
      .then(this._send.bind(this))
      .then(resCommand => new Conversation({
        name,
        attr: attributes,
        transient,
        unique,
        id: resCommand.convMessage.cid,
        createdAt: resCommand.convMessage.cdate,
        updatedAt: resCommand.convMessage.cdate,
        lastMessageAt: null,
        creator: this.id,
        members: transient ? [] : members,
        ...properties,
      }, this))
      .then(tap(conversation =>
        this._conversationCache.set(conversation.id, conversation)
      ));
  }

  /**
   * 将指定的所有会话标记为已读
   *
   * @param {Conversation[]} conversations 指定的会话列表
   * @return {Promise.<Conversation[]>} conversations 返回输入的会话列表
   */
  markAllAsRead(conversations) {
    if (!Array.isArray(conversations)) {
      throw new TypeError(`${conversations} is not an Array`);
    }
    const ids = conversations.map(conversation => {
      if (!(conversation instanceof Conversation)) {
        throw new TypeError(`${conversation} is not a Conversation`);
      }
      return conversation.id;
    });
    this._debug(`mark [${ids}] as read`);
    if (!conversations.length) {
      return Promise.resolve([]);
    }
    return this._send(new GenericCommand({
      cmd: 'read',
      readMessage: new ReadCommand({
        convs: conversations.map(conversation => new ReadTuple({
          cid: conversation.id,
          timestamp: (conversation.lastMessageAt || new Date()).getTime(),
        })),
      }),
    }), false).then(() => {
      // eslint-disable-next-line no-param-reassign
      conversations.forEach(conversation => (conversation.unreadMessagesCount = 0));
      return conversations;
    });
  }
}
