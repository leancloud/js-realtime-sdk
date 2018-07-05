import EventEmitter from 'eventemitter3';
import { decode as decodeBase64 } from 'base64-arraybuffer';
import remove from 'lodash/remove';
import d from 'debug';
import {
  Conversation,
  ChatRoom,
  ServiceConversation,
  TemporaryConversation,
} from './conversations';
import ConversationBase from './conversations/conversation-base';
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
import * as Event from './events/im';
import { ErrorCode, createError } from './error';
import {
  Expirable,
  Cache,
  keyRemap,
  trim,
  internal,
  throttle,
  encode,
  decode,
  decodeDate,
  getTime,
} from './utils';
import { applyDecorators, applyDispatcher } from './plugin';
import SessionManager from './session-manager';
import runSignatureFactory from './signature-factory-runner';
import { MessageStatus } from './messages/message';
import { version as VERSION } from '../package.json';

const debug = d('LC:IMClient');

const {
  INVITED,
  KICKED,
  MEMBERS_JOINED,
  MEMBERS_LEFT,
  MEMBER_INFO_UPDATED,
  BLOCKED,
  UNBLOCKED,
  MEMBERS_BLOCKED,
  MEMBERS_UNBLOCKED,
  MUTED,
  UNMUTED,
  MEMBERS_MUTED,
  MEMBERS_UNMUTED,
  MESSAGE,
  UNREAD_MESSAGES_COUNT_UPDATE,
  CLOSE,
  CONFLICT,
  UNHANDLED_MESSAGE,
  CONVERSATION_INFO_UPDATED,
  MESSAGE_RECALL,
  MESSAGE_UPDATE,
  INFO_UPDATED,
} = Event;

const isTemporaryConversatrionId = id => /^_tmp:/.test(id);

/**
 * 1 patch-msg
 * 1 temp-conv-msg
 * 0 auto-bind-deviceid-and-installation
 * 1 transient-msg-ack
 * 1 keep-notification
 * 1 partial-failed-msg
 * @ignore
 */
const configBitmap = 0b111011;

export default class IMClient extends EventEmitter {
  /**
   * 无法直接实例化，请使用 {@link Realtime#createIMClient} 创建新的 IMClient。
   *
   * @extends EventEmitter
   */
  constructor(id, options = {}, props) {
    if (!(id === undefined || typeof id === 'string')) {
      throw new TypeError(`Client id [${id}] is not a String`);
    }
    super();
    Object.assign(
      this,
      {
        /**
         * @var id {String} 客户端 id
         * @memberof IMClient#
         */
        id,
        options,
      },
      props
    );

    if (!this._messageParser) {
      throw new Error('IMClient must be initialized with a MessageParser');
    }
    this._conversationCache = new Cache(`client:${this.id}`);
    this._ackMessageBuffer = {};
    internal(this).lastPatchTime = Date.now();
    internal(this).lastNotificationTime = undefined;
    internal(this)._eventemitter = new EventEmitter();
    if (debug.enabled) {
      Object.values(Event).forEach(event =>
        this.on(event, (...payload) =>
          this._debug(`${event} event emitted. %o`, payload)
        )
      );
    }
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
  async _dispatchCommand(command) {
    this._debug(trim(command), 'received');
    if (command.serverTs) {
      internal(this).lastNotificationTime = getTime(
        decodeDate(command.serverTs)
      );
    }
    switch (command.cmd) {
      case CommandType.conv:
        return this._dispatchConvMessage(command);
      case CommandType.direct:
        return this._dispatchDirectMessage(command);
      case CommandType.session:
        return this._dispatchSessionMessage(command);
      case CommandType.unread:
        return this._dispatchUnreadMessage(command);
      case CommandType.rcp:
        return this._dispatchRcpMessage(command);
      case CommandType.patch:
        return this._dispatchPatchMessage(command);
      default:
        return this.emit(UNHANDLED_MESSAGE, command);
    }
  }

  async _dispatchSessionMessage(message) {
    const {
      sessionMessage: { code, reason },
    } = message;
    switch (message.op) {
      case OpType.closed: {
        internal(this)._eventemitter.emit('close');
        if (code === ErrorCode.SESSION_CONFLICT) {
          /**
           * 用户在其他客户端登录，当前客户端被服务端强行下线。详见文档「单点登录」章节。
           * @event IMClient#CONFLICT
           * @param {Object} payload
           * @param {string} payload.reason 原因
           */
          return this.emit(CONFLICT, {
            reason,
          });
        }
        /**
         * 当前客户端被服务端强行下线
         * @event IMClient#CLOSE
         * @param {Object} payload
         * @param {Number} payload.code 错误码
         * @param {String} payload.reason 原因
         */
        return this.emit(CLOSE, {
          code,
          reason,
        });
      }
      default:
        this.emit(UNHANDLED_MESSAGE, message);
        throw new Error('Unrecognized session command');
    }
  }

  _dispatchUnreadMessage({ unreadMessage: { convs, notifTime } }) {
    internal(this).lastUnreadNotifTime = notifTime;
    // ensure all converstions are cached
    return this.getConversations(convs.map(conv => conv.cid))
      .then(() =>
        // update conversations data
        Promise.all(
          convs.map(
            ({
              cid,
              unread,
              mid,
              timestamp: ts,
              from,
              data,
              binaryMsg,
              patchTimestamp,
              mentioned,
            }) => {
              const conversation = this._conversationCache.get(cid);
              // deleted conversation
              if (!conversation) return null;
              let timestamp;
              if (ts) {
                timestamp = decodeDate(ts);
                conversation.lastMessageAt = timestamp; // eslint-disable-line no-param-reassign
              }
              return (mid
                ? this._messageParser.parse(binaryMsg || data).then(message => {
                    const messageProps = {
                      id: mid,
                      cid,
                      timestamp,
                      updatedAt: patchTimestamp,
                      from,
                    };
                    Object.assign(message, messageProps);
                    conversation.lastMessage = message; // eslint-disable-line no-param-reassign
                  })
                : Promise.resolve()
              ).then(() => {
                conversation._setUnreadMessagesMentioned(mentioned);
                const countNotUpdated =
                  unread === internal(conversation).unreadMessagesCount;
                if (countNotUpdated) return null; // to be filtered
                // manipulate internal property directly to skip unreadmessagescountupdate event
                internal(conversation).unreadMessagesCount = unread;
                return conversation;
              });
              // filter conversations without unread count update
            }
          )
        ).then(conversations =>
          conversations.filter(conversation => conversation)
        )
      )
      .then(conversations => {
        if (conversations.length) {
          /**
           * 未读消息数目更新
           * @event IMClient#UNREAD_MESSAGES_COUNT_UPDATE
           * @since 3.4.0
           * @param {Conversation[]} conversations 未读消息数目有更新的对话列表
           */
          this.emit(UNREAD_MESSAGES_COUNT_UPDATE, conversations);
        }
      });
  }

  async _dispatchRcpMessage(message) {
    const {
      rcpMessage,
      rcpMessage: { read },
    } = message;
    const conversationId = rcpMessage.cid;
    const messageId = rcpMessage.id;
    const timestamp = decodeDate(rcpMessage.t);
    const conversation = this._conversationCache.get(conversationId);
    // conversation not cached means the client does not send the message
    // during this session
    if (!conversation) return;
    conversation._handleReceipt({ messageId, timestamp, read });
  }

  _dispatchPatchMessage({ patchMessage: { patches } }) {
    // ensure all converstions are cached
    return this.getConversations(patches.map(patch => patch.cid)).then(() =>
      Promise.all(
        patches.map(
          ({
            cid,
            mid,
            timestamp,
            recall,
            data,
            patchTimestamp,
            from,
            binaryMsg,
            mentionAll,
            mentionPids,
          }) => {
            const conversation = this._conversationCache.get(cid);
            // deleted conversation
            if (!conversation) return null;
            return this._messageParser
              .parse(binaryMsg || data)
              .then(message => {
                const patchTime = getTime(decodeDate(patchTimestamp));
                const messageProps = {
                  id: mid,
                  cid,
                  timestamp,
                  updatedAt: patchTime,
                  from,
                  mentionList: mentionPids,
                  mentionedAll: mentionAll,
                };
                Object.assign(message, messageProps);
                message._setStatus(MessageStatus.SENT);
                message._updateMentioned(this.id);
                if (internal(this).lastPatchTime < patchTime) {
                  internal(this).lastPatchTime = patchTime;
                }
                // update conversation lastMessage
                if (
                  conversation.lastMessage &&
                  conversation.lastMessage.id === mid
                ) {
                  conversation.lastMessage = message; // eslint-disable-line no-param-reassign
                }
                if (recall) {
                  /**
                   * 消息被撤回
                   * @event IMClient#MESSAGE_RECALL
                   * @param {AVMessage} message 被撤回的消息
                   * @param {ConversationBase} conversation 消息所在的会话
                   */
                  this.emit(MESSAGE_RECALL, message, conversation);
                  /**
                   * 消息被撤回
                   * @event ConversationBase#MESSAGE_RECALL
                   * @param {AVMessage} message 被撤回的消息
                   */
                  conversation.emit(MESSAGE_RECALL, message);
                } else {
                  /**
                   * 消息被修改
                   * @event IMClient#MESSAGE_UPDATE
                   * @param {AVMessage} message 被修改的消息
                   * @param {ConversationBase} conversation 消息所在的会话
                   */
                  this.emit(MESSAGE_UPDATE, message, conversation);
                  /**
                   * 消息被修改
                   * @event ConversationBase#MESSAGE_UPDATE
                   * @param {AVMessage} message 被修改的消息
                   */
                  conversation.emit(MESSAGE_UPDATE, message);
                }
              });
          }
        )
      )
    );
  }

  async _dispatchConvMessage(message) {
    const {
      convMessage,
      convMessage: { initBy, m, info, attr },
    } = message;
    const conversation = await this.getConversation(convMessage.cid);
    switch (message.op) {
      case OpType.joined: {
        conversation._addMembers([this.id]);
        const payload = {
          invitedBy: initBy,
        };
        /**
         * 当前用户被添加至某个对话
         * @event IMClient#INVITED
         * @param {Object} payload
         * @param {String} payload.invitedBy 邀请者 id
         * @param {ConversationBase} conversation
         */
        this.emit(INVITED, payload, conversation);
        /**
         * 当前用户被添加至当前对话
         * @event ConversationBase#INVITED
         * @param {Object} payload
         * @param {String} payload.invitedBy 该移除操作的发起者 id
         */
        conversation.emit(INVITED, payload);
        return;
      }
      case OpType.left: {
        conversation._removeMembers([this.id]);
        const payload = {
          kickedBy: initBy,
        };
        /**
         * 当前用户被从某个对话中移除
         * @event IMClient#KICKED
         * @param {Object} payload
         * @param {String} payload.kickedBy 该移除操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(KICKED, payload, conversation);
        /**
         * 当前用户被从当前对话中移除
         * @event ConversationBase#KICKED
         * @param {Object} payload
         * @param {String} payload.kickedBy 该移除操作的发起者 id
         */
        conversation.emit(KICKED, payload);
        return;
      }
      case OpType.members_joined: {
        conversation._addMembers(m);
        const payload = {
          invitedBy: initBy,
          members: m,
        };
        /**
         * 有用户被添加至某个对话
         * @event IMClient#MEMBERS_JOINED
         * @param {Object} payload
         * @param {String[]} payload.members 被添加的用户 id 列表
         * @param {String} payload.invitedBy 邀请者 id
         * @param {ConversationBase} conversation
         */
        this.emit(MEMBERS_JOINED, payload, conversation);
        /**
         * 有成员被添加至当前对话
         * @event ConversationBase#MEMBERS_JOINED
         * @param {Object} payload
         * @param {String[]} payload.members 被添加的成员 id 列表
         * @param {String} payload.invitedBy 邀请者 id
         */
        conversation.emit(MEMBERS_JOINED, payload);
        return;
      }
      case OpType.members_left: {
        conversation._removeMembers(m);
        const payload = {
          kickedBy: initBy,
          members: m,
        };
        /**
         * 有成员被从某个对话中移除
         * @event IMClient#MEMBERS_LEFT
         * @param {Object} payload
         * @param {String[]} payload.members 被移除的成员 id 列表
         * @param {String} payload.kickedBy 该移除操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(MEMBERS_LEFT, payload, conversation);
        /**
         * 有成员被从当前对话中移除
         * @event ConversationBase#MEMBERS_LEFT
         * @param {Object} payload
         * @param {String[]} payload.members 被移除的成员 id 列表
         * @param {String} payload.kickedBy 该移除操作的发起者 id
         */
        conversation.emit(MEMBERS_LEFT, payload);
        return;
      }
      case OpType.members_blocked: {
        const payload = {
          blockedBy: initBy,
          members: m,
        };
        /**
         * 有成员被加入某个对话的黑名单
         * @event IMClient#MEMBERS_BLOCKED
         * @param {Object} payload
         * @param {String[]} payload.members 成员 id 列表
         * @param {String} payload.blockedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(MEMBERS_BLOCKED, payload, conversation);
        /**
         * 有成员被加入当前对话的黑名单
         * @event ConversationBase#MEMBERS_BLOCKED
         * @param {Object} payload
         * @param {String[]} payload.members 成员 id 列表
         * @param {String} payload.blockedBy 该操作的发起者 id
         */
        conversation.emit(MEMBERS_BLOCKED, payload);
        return;
      }
      case OpType.members_unblocked: {
        const payload = {
          unblockedBy: initBy,
          members: m,
        };
        /**
         * 有成员被移出某个对话的黑名单
         * @event IMClient#MEMBERS_UNBLOCKED
         * @param {Object} payload
         * @param {String[]} payload.members 成员 id 列表
         * @param {String} payload.unblockedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(MEMBERS_UNBLOCKED, payload, conversation);
        /**
         * 有成员被移出当前对话的黑名单
         * @event ConversationBase#MEMBERS_UNBLOCKED
         * @param {Object} payload
         * @param {String[]} payload.members 成员 id 列表
         * @param {String} payload.unblockedBy 该操作的发起者 id
         */
        conversation.emit(MEMBERS_UNBLOCKED, payload);
        return;
      }
      case OpType.blocked: {
        const payload = {
          blockedBy: initBy,
        };
        /**
         * 当前用户被加入某个对话的黑名单
         * @event IMClient#BLOCKED
         * @param {Object} payload
         * @param {String} payload.blockedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(BLOCKED, payload, conversation);
        /**
         * 当前用户被加入当前对话的黑名单
         * @event ConversationBase#BLOCKED
         * @param {Object} payload
         * @param {String} payload.blockedBy 该操作的发起者 id
         */
        conversation.emit(BLOCKED, payload);
        return;
      }
      case OpType.unblocked: {
        const payload = {
          unblockedBy: initBy,
        };
        /**
         * 当前用户被移出某个对话的黑名单
         * @event IMClient#UNBLOCKED
         * @param {Object} payload
         * @param {String} payload.unblockedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(UNBLOCKED, payload, conversation);
        /**
         * 当前用户被移出当前对话的黑名单
         * @event ConversationBase#UNBLOCKED
         * @param {Object} payload
         * @param {String} payload.unblockedBy 该操作的发起者 id
         */
        conversation.emit(UNBLOCKED, payload);
        return;
      }
      case OpType.members_shutuped: {
        const payload = {
          mutedBy: initBy,
          members: m,
        };
        /**
         * 有成员在某个对话中被禁言
         * @event IMClient#MEMBERS_MUTED
         * @param {Object} payload
         * @param {String[]} payload.members 成员 id 列表
         * @param {String} payload.mutedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(MEMBERS_MUTED, payload, conversation);
        /**
         * 有成员在当前对话中被禁言
         * @event ConversationBase#MEMBERS_MUTED
         * @param {Object} payload
         * @param {String[]} payload.members 成员 id 列表
         * @param {String} payload.mutedBy 该操作的发起者 id
         */
        conversation.emit(MEMBERS_MUTED, payload);
        return;
      }
      case OpType.members_unshutuped: {
        const payload = {
          unmutedBy: initBy,
          members: m,
        };
        /**
         * 有成员在某个对话中被解除禁言
         * @event IMClient#MEMBERS_UNMUTED
         * @param {Object} payload
         * @param {String[]} payload.members 成员 id 列表
         * @param {String} payload.unmutedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(MEMBERS_UNMUTED, payload, conversation);
        /**
         * 有成员在当前对话中被解除禁言
         * @event ConversationBase#MEMBERS_UNMUTED
         * @param {Object} payload
         * @param {String[]} payload.members 成员 id 列表
         * @param {String} payload.unmutedBy 该操作的发起者 id
         */
        conversation.emit(MEMBERS_UNMUTED, payload);
        return;
      }
      case OpType.shutuped: {
        const payload = {
          mutedBy: initBy,
        };
        /**
         * 有成员在某个对话中被禁言
         * @event IMClient#MUTED
         * @param {Object} payload
         * @param {String} payload.mutedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(MUTED, payload, conversation);
        /**
         * 有成员在当前对话中被禁言
         * @event ConversationBase#MUTED
         * @param {Object} payload
         * @param {String} payload.mutedBy 该操作的发起者 id
         */
        conversation.emit(MUTED, payload);
        return;
      }
      case OpType.unshutuped: {
        const payload = {
          unmutedBy: initBy,
        };
        /**
         * 有成员在某个对话中被解除禁言
         * @event IMClient#UNMUTED
         * @param {Object} payload
         * @param {String} payload.unmutedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(UNMUTED, payload, conversation);
        /**
         * 有成员在当前对话中被解除禁言
         * @event ConversationBase#UNMUTED
         * @param {Object} payload
         * @param {String} payload.unmutedBy 该操作的发起者 id
         */
        conversation.emit(UNMUTED, payload);
        return;
      }
      case OpType.member_info_changed: {
        const { pid, role } = info;
        const { memberInfoMap } = internal(conversation);
        // 如果不存在缓存，且不是 role 的更新，则不通知
        if (!memberInfoMap && !role) return;
        const memberInfo = await conversation.getMemberInfo(pid);
        internal(memberInfo).role = role;
        const payload = {
          member: pid,
          memberInfo,
          updatedBy: initBy,
        };
        /**
         * 有成员的对话信息被更新
         * @event IMClient#MEMBER_INFO_UPDATED
         * @param {Object} payload
         * @param {String} payload.member 被更新对话信息的成员 id
         * @param {ConversationMumberInfo} payload.memberInfo 被更新的成员对话信息
         * @param {String} payload.updatedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(MEMBER_INFO_UPDATED, payload, conversation);
        /**
         * 有成员的对话信息被更新
         * @event ConversationBase#MEMBER_INFO_UPDATED
         * @param {Object} payload
         * @param {String} payload.member 被更新对话信息的成员 id
         * @param {ConversationMumberInfo} payload.memberInfo 被更新的成员对话信息
         * @param {String} payload.updatedBy 该操作的发起者 id
         */
        conversation.emit(MEMBER_INFO_UPDATED, payload);
        return;
      }
      case OpType.updated: {
        const attributes = decode(JSON.parse(attr.data));
        conversation._updateServerAttributes(attributes);
        const payload = {
          attributes,
          updatedBy: initBy,
        };
        /**
         * 该对话信息被更新
         * @event IMClient#CONVERSATION_INFO_UPDATED
         * @param {Object} payload
         * @param {Object} payload.attributes 被更新的属性
         * @param {String} payload.updatedBy 该操作的发起者 id
         * @param {ConversationBase} conversation
         */
        this.emit(CONVERSATION_INFO_UPDATED, payload, conversation);
        /**
         * 有对话信息被更新
         * @event ConversationBase#INFO_UPDATED
         * @param {Object} payload
         * @param {Object} payload.attributes 被更新的属性
         * @param {String} payload.updatedBy 该操作的发起者 id
         */
        conversation.emit(INFO_UPDATED, payload);
        return;
      }
      default:
        this.emit(UNHANDLED_MESSAGE, message);
        throw new Error('Unrecognized conversation command');
    }
  }

  _dispatchDirectMessage(originalMessage) {
    const {
      directMessage,
      directMessage: {
        id,
        cid,
        fromPeerId,
        timestamp,
        transient,
        patchTimestamp,
        mentionPids,
        mentionAll,
        binaryMsg,
        msg,
      },
    } = originalMessage;
    const content = binaryMsg ? binaryMsg.toArrayBuffer() : msg;
    return Promise.all([
      this.getConversation(directMessage.cid),
      this._messageParser.parse(content),
    ]).then(([conversation, message]) => {
      // deleted conversation
      if (!conversation) return undefined;
      const messageProps = {
        id,
        cid,
        timestamp,
        updatedAt: patchTimestamp,
        from: fromPeerId,
        mentionList: mentionPids,
        mentionedAll: mentionAll,
      };
      Object.assign(message, messageProps);
      message._updateMentioned(this.id);
      message._setStatus(MessageStatus.SENT);
      // filter outgoing message sent from another device
      if (message.from !== this.id) {
        if (!(transient || conversation.transient)) {
          this._sendAck(message);
        }
      }
      return this._dispatchParsedMessage(message, conversation);
    });
  }

  _dispatchParsedMessage(message, conversation) {
    // beforeMessageDispatch hook
    return applyDispatcher(this._plugins.beforeMessageDispatch, [
      message,
      conversation,
    ]).then(shouldDispatch => {
      if (shouldDispatch === false) return;
      conversation.lastMessage = message; // eslint-disable-line no-param-reassign
      conversation.lastMessageAt = message.timestamp; // eslint-disable-line no-param-reassign
      // filter outgoing message sent from another device
      if (message.from !== this.id) {
        conversation.unreadMessagesCount += 1; // eslint-disable-line no-param-reassign
        if (message.mentioned) conversation._setUnreadMessagesMentioned(true);
      }
      /**
       * 当前用户收到消息
       * @event IMClient#MESSAGE
       * @param {Message} message
       * @param {ConversationBase} conversation 收到消息的对话
       */
      this.emit(MESSAGE, message, conversation);
      /**
       * 当前对话收到消息
       * @event ConversationBase#MESSAGE
       * @param {Message} message
       */
      conversation.emit(MESSAGE, message);
    });
  }

  _sendAck(message) {
    this._debug('send ack for %O', message);
    const { cid } = message;
    if (!cid) {
      throw new Error('missing cid');
    }
    if (!this._ackMessageBuffer[cid]) {
      this._ackMessageBuffer[cid] = [];
    }
    this._ackMessageBuffer[cid].push(message);
    return this._doSendAck();
  }

  // jsdoc-ignore-start
  @throttle(1000)
  // jsdoc-ignore-end
  _doSendAck() {
    // if not connected, just skip everything
    if (!this._connection.is('connected')) return;
    this._debug('do send ack %O', this._ackMessageBuffer);
    Promise.all(
      Object.keys(this._ackMessageBuffer).map(cid => {
        const convAckMessages = this._ackMessageBuffer[cid];
        const timestamps = convAckMessages.map(message => message.timestamp);
        const command = new GenericCommand({
          cmd: 'ack',
          peerId: this.id,
          ackMessage: new AckCommand({
            cid,
            fromts: Math.min.apply(null, timestamps),
            tots: Math.max.apply(null, timestamps),
          }),
        });
        delete this._ackMessageBuffer[cid];
        return this._send(command, false).catch(error => {
          this._debug('send ack failed: %O', error);
          this._ackMessageBuffer[cid] = convAckMessages;
        });
      })
    );
  }

  _omitPeerId(value) {
    internal(this).peerIdOmittable = value;
  }

  _send(cmd, ...args) {
    const command = cmd;
    if (!internal(this).peerIdOmittable && this.id) {
      command.peerId = this.id;
    }
    return this._connection.send(command, ...args);
  }

  async _open(appId, tag, deviceId, isReconnect = false) {
    this._debug('open session');
    const { lastUnreadNotifTime, lastPatchTime } = internal(this);
    const command = new GenericCommand({
      cmd: 'session',
      op: 'open',
      appId,
      peerId: this.id,
      sessionMessage: new SessionCommand({
        ua: `js/${VERSION}`,
        r: isReconnect,
        lastUnreadNotifTime,
        lastPatchTime,
        configBitmap,
      }),
    });
    if (!isReconnect) {
      Object.assign(
        command.sessionMessage,
        trim({
          tag,
          deviceId,
        })
      );
      if (this.options.signatureFactory) {
        const signatureResult = await runSignatureFactory(
          this.options.signatureFactory,
          [this._identity]
        );
        Object.assign(
          command.sessionMessage,
          keyRemap(
            {
              signature: 's',
              timestamp: 't',
              nonce: 'n',
            },
            signatureResult
          )
        );
      }
    } else {
      const sessionToken = await this._sessionManager.getSessionToken({
        autoRefresh: false,
      });
      if (sessionToken && sessionToken !== Expirable.EXPIRED) {
        Object.assign(command.sessionMessage, {
          st: sessionToken,
        });
      }
    }
    let resCommand;
    try {
      resCommand = await this._send(command);
    } catch (error) {
      if (error.code === ErrorCode.SESSION_TOKEN_EXPIRED) {
        if (!this._sessionManager) {
          // let it fail if sessoinToken not cached but command rejected as token expired
          // to prevent session openning flood
          throw new Error('Unexpected session expiration');
        }
        debug('Session token expired, reopening');
        this._sessionManager.revoke();
        return this._open(appId, tag, deviceId, isReconnect);
      }
      throw error;
    }
    const {
      peerId,
      sessionMessage,
      sessionMessage: { st: token, stTtl: tokenTTL, code },
    } = resCommand;
    if (code) {
      throw createError(sessionMessage);
    }
    if (peerId) {
      this.id = peerId;
      if (!this._identity) this._identity = peerId;
      if (token) {
        this._sessionManager =
          this._sessionManager || this._createSessionManager();
        this._sessionManager.setSessionToken(token, tokenTTL);
      }
      if (internal(this).lastNotificationTime) {
        // Do not await for it as this is failable
        this._syncNotifications(internal(this).lastNotificationTime).catch(
          error => console.warn('Syncing notifications failed:', error)
        );
      } else {
        // Set timestamp to now for next reconnection
        internal(this).lastNotificationTime = Date.now();
      }
    } else {
      console.warn('Unexpected session opened without peerId.');
    }
    return undefined;
  }

  async _syncNotifications(timestamp) {
    const { hasMore, notifications } = await this._fetchNotifications(
      timestamp
    );
    notifications.forEach(notification => {
      const { cmd, op, serverTs, ...payload } = notification;
      this._dispatchCommand({
        cmd: CommandType[cmd],
        op: OpType[op],
        serverTs,
        [`${cmd}Message`]: payload,
      });
    });
    if (hasMore) {
      return this._syncNotifications(internal(this).lastNotificationTime);
    }
    return undefined;
  }

  async _fetchNotifications(timestamp) {
    return this._requestWithSessionToken({
      method: 'GET',
      path: '/rtm/notifications',
      query: {
        start_ts: timestamp,
        notification_type: 'permanent',
      },
    });
  }

  _createSessionManager() {
    debug('create SessionManager');
    return new SessionManager({
      onBeforeGetSessionToken: this._connection.checkConnectionAvailability.bind(
        this._connection
      ),
      refresh: (manager, expiredSessionToken) =>
        manager.setSessionTokenAsync(
          Promise.resolve(
            new GenericCommand({
              cmd: 'session',
              op: 'refresh',
              sessionMessage: new SessionCommand({
                ua: `js/${VERSION}`,
                st: expiredSessionToken,
              }),
            })
          )
            .then(async command => {
              if (this.options.signatureFactory) {
                const signatureResult = await runSignatureFactory(
                  this.options.signatureFactory,
                  [this._identity]
                );
                Object.assign(
                  command.sessionMessage,
                  keyRemap(
                    {
                      signature: 's',
                      timestamp: 't',
                      nonce: 'n',
                    },
                    signatureResult
                  )
                );
              }
              return command;
            })
            .then(this._send.bind(this))
            .then(({ sessionMessage: { st: token, stTtl: ttl } }) => [
              token,
              ttl,
            ])
        ),
    });
  }

  async _requestWithSessionToken({ headers, query, ...params }) {
    const sessionToken = await this._sessionManager.getSessionToken();
    return this._request({
      headers: {
        'X-LC-IM-Session-Token': sessionToken,
        ...headers,
      },
      query: {
        client_id: this.id,
        ...query,
      },
      ...params,
    });
  }

  /**
   * 关闭客户端
   * @return {Promise}
   */
  async close() {
    this._debug('close session');
    const _ee = internal(this)._eventemitter;
    _ee.emit('beforeclose');
    if (this._connection.is('connected')) {
      const command = new GenericCommand({
        cmd: 'session',
        op: 'close',
      });
      await this._send(command);
    }
    _ee.emit('close');
    this.emit(CLOSE, {
      code: 0,
    });
  }

  /**
   * 获取 client 列表中在线的 client，每次查询最多 20 个 clientId，超出部分会被忽略
   * @param  {String[]} clientIds 要查询的 client ids
   * @return {Primse.<String[]>} 在线的 client ids
   */
  async ping(clientIds) {
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
    const resCommand = await this._send(command);
    return resCommand.sessionMessage.onlineSessionPeerIds;
  }

  /**
   * 获取某个特定的对话
   * @param  {String} id 对话 id，对应 _Conversation 表中的 objectId
   * @param  {Boolean} [noCache=false] 强制不从缓存中获取
   * @return {Promise.<ConversationBase>} 如果 id 对应的对话不存在则返回 null
   */
  async getConversation(id, noCache = false) {
    if (typeof id !== 'string') {
      throw new TypeError(`${id} is not a String`);
    }
    if (!noCache) {
      const cachedConversation = this._conversationCache.get(id);
      if (cachedConversation) {
        return cachedConversation;
      }
    }
    if (isTemporaryConversatrionId(id)) {
      return (await this._getTemporaryConversations([id]))[0] || null;
    }
    return this.getQuery()
      .equalTo('objectId', id)
      .find()
      .then(conversations => conversations[0] || null);
  }

  /**
   * 通过 id 批量获取某个特定的对话
   * @since 3.4.0
   * @param  {String[]} ids 对话 id 列表，对应 _Conversation 表中的 objectId
   * @param  {Boolean} [noCache=false] 强制不从缓存中获取
   * @return {Promise.<ConversationBase[]>} 如果 id 对应的对话不存在则返回 null
   */
  async getConversations(ids, noCache = false) {
    const remoteConversationIds = noCache
      ? ids
      : ids.filter(id => this._conversationCache.get(id) === null);
    if (remoteConversationIds.length) {
      const remoteTemporaryConversationIds = remove(
        remoteConversationIds,
        isTemporaryConversatrionId
      );
      const query = [];
      if (remoteConversationIds.length) {
        query.push(
          this.getQuery()
            .containedIn('objectId', remoteConversationIds)
            .limit(999)
            .find()
        );
      }
      if (remoteTemporaryConversationIds.length) {
        const remoteTemporaryConversationsPromise = remoteTemporaryConversationIds.map(
          this._getTemporaryConversations.bind(this)
        );
        query.push(...remoteTemporaryConversationsPromise);
      }
      await Promise.all(query);
    }
    return ids.map(id => this._conversationCache.get(id));
  }

  async _getTemporaryConversations(ids) {
    const command = new GenericCommand({
      cmd: 'conv',
      op: 'query',
      convMessage: new ConvCommand({
        tempConvIds: ids,
      }),
    });
    const resCommand = await this._send(command);
    return this._handleQueryResults(resCommand);
  }

  /**
   * 构造一个 ConversationQuery 来查询对话
   * @return {ConversationQuery.<PersistentConversation>}
   */
  getQuery() {
    return new ConversationQuery(this);
  }

  /**
   * 构造一个 ConversationQuery 来查询聊天室
   * @return {ConversationQuery.<ChatRoom>}
   */
  getChatRoomQuery() {
    return this.getQuery().equalTo('tr', true);
  }

  /**
   * 构造一个 ConversationQuery 来查询服务号
   * @return {ConversationQuery.<ServiceConversation>}
   */
  getServiceConversationQuery() {
    return this.getQuery().equalTo('sys', true);
  }

  async _executeQuery(query) {
    const queryJSON = query.toJSON();
    queryJSON.where = new JsonObjectMessage({
      data: JSON.stringify(encode(queryJSON.where)),
    });
    const command = new GenericCommand({
      cmd: 'conv',
      op: 'query',
      convMessage: new ConvCommand(queryJSON),
    });
    const resCommand = await this._send(command);
    return this._handleQueryResults(resCommand);
  }

  async _handleQueryResults(resCommand) {
    let conversations;
    try {
      conversations = decode(JSON.parse(resCommand.convMessage.results.data));
    } catch (error) {
      const commandString = JSON.stringify(trim(resCommand));
      throw new Error(
        `Parse query result failed: ${error.message}. Command: ${commandString}`
      );
    }
    conversations = await Promise.all(
      conversations.map(this._parseConversationFromRawData.bind(this))
    );
    return conversations.map(this._upsertConversationToCache.bind(this));
  }

  _upsertConversationToCache(fetchedConversation) {
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
      if (conversation._reset) conversation._reset();
    }
    return conversation;
  }

  /**
   * 反序列化消息，与 {@link Message#toFullJSON} 相对。
   * @param {Object}
   * @return {AVMessage} 解析后的消息
   * @since 4.0.0
   */
  async parseMessage({ data, bin = false, ...properties }) {
    const content = bin ? decodeBase64(data) : data;
    const message = await this._messageParser.parse(content);
    Object.assign(message, properties);
    message._updateMentioned(this.id);
    return message;
  }

  /**
   * 反序列化对话，与 {@link Conversation#toFullJSON} 相对。
   * @param {Object}
   * @return {ConversationBase} 解析后的对话
   * @since 4.0.0
   */
  async parseConversation({
    id,
    lastMessageAt,
    lastMessage,
    lastDeliveredAt,
    lastReadAt,
    unreadMessagesCount,
    members,
    mentioned,
    ...properties
  }) {
    const conversationData = {
      id,
      lastMessageAt,
      lastMessage,
      lastDeliveredAt,
      lastReadAt,
      unreadMessagesCount,
      members,
      mentioned,
    };
    if (lastMessage) {
      conversationData.lastMessage = await this.parseMessage(lastMessage);
      conversationData.lastMessage._setStatus(MessageStatus.SENT);
    }
    const { transient, system, expiredAt } = properties;
    if (transient) return new ChatRoom(conversationData, properties, this);
    if (system)
      return new ServiceConversation(conversationData, properties, this);
    if (expiredAt || isTemporaryConversatrionId(id)) {
      return new TemporaryConversation(conversationData, { expiredAt }, this);
    }
    return new Conversation(conversationData, properties, this);
  }

  async _parseConversationFromRawData(rawData) {
    const data = keyRemap(
      {
        objectId: 'id',
        lm: 'lastMessageAt',
        m: 'members',
        tr: 'transient',
        sys: 'system',
        c: 'creator',
        mu: 'mutedMembers',
      },
      rawData
    );
    if (data.msg) {
      data.lastMessage = {
        data: data.msg,
        bin: data.bin,
        from: data.msg_from,
        id: data.msg_mid,
        timestamp: data.msg_timestamp,
        updatedAt: data.patch_timestamp,
      };
      delete data.lastMessageFrom;
      delete data.lastMessageId;
      delete data.lastMessageTimestamp;
      delete data.lastMessagePatchTimestamp;
    }
    const { ttl } = data;
    if (ttl) data.expiredAt = Date.now() + ttl * 1000;
    return this.parseConversation(data);
  }

  /**
   * 创建一个对话
   * @param {Object} options 除了下列字段外的其他字段将被视为对话的自定义属性
   * @param {String[]} options.members 对话的初始成员列表，默认包含当前 client
   * @param {String} [options.name] 对话的名字
   * @param {Boolean} [options.unique=false] 唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话
   * @return {Promise.<Conversation>}
   */
  async createConversation({
    members: m,
    name,
    transient,
    unique,
    _tempConv: tempConv,
    _tempConvTTL: tempConvTTL,
    ...properties
  } = {}) {
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
    attr = new JsonObjectMessage({
      data: JSON.stringify(encode(attr)),
    });

    const startCommandJson = {
      m: members,
      attr,
      transient,
      unique,
      tempConv,
      tempConvTTL,
    };

    const command = new GenericCommand({
      cmd: 'conv',
      op: 'start',
      convMessage: new ConvCommand(startCommandJson),
    });

    if (this.options.conversationSignatureFactory) {
      const params = [null, this._identity, members, 'create'];
      const signatureResult = await runSignatureFactory(
        this.options.conversationSignatureFactory,
        params
      );
      Object.assign(
        command.convMessage,
        keyRemap(
          {
            signature: 's',
            timestamp: 't',
            nonce: 'n',
          },
          signatureResult
        )
      );
    }

    const {
      convMessage: { cid, cdate, tempConvTTL: ttl },
    } = await this._send(command);
    const data = {
      name,
      transient,
      unique,
      id: cid,
      createdAt: cdate,
      updatedAt: cdate,
      lastMessageAt: null,
      creator: this.id,
      members: transient ? [] : members,
      ...properties,
    };
    if (ttl) data.expiredAt = Date.now() + ttl * 1000;
    const conversation = await this.parseConversation(data);
    return this._upsertConversationToCache(conversation);
  }

  /**
   * 创建一个聊天室
   * @since 4.0.0
   * @param {Object} options 除了下列字段外的其他字段将被视为对话的自定义属性
   * @param {String} [options.name] 对话的名字
   * @return {Promise.<ChatRoom>}
   */
  async createChatRoom(param) {
    return this.createConversation({
      ...param,
      transient: true,
      members: null,
      unique: false,
    });
  }

  /**
   * 创建一个临时对话
   * @since 4.0.0
   * @param {Object} options
   * @param {String[]} options.members 对话的初始成员列表，默认包含当前 client
   * @param {String} [options.ttl] 对话存在时间，单位为秒，最大值与默认值均为 86400（一天），过期后该对话不再可用。
   * @return {Promise.<TemporaryConversation>}
   */
  async createTemporaryConversation({ ttl: _tempConvTTL, ...param }) {
    return this.createConversation({
      ...param,
      transient: false,
      unique: false,
      _tempConv: true,
      _tempConvTTL,
    });
  }

  // jsdoc-ignore-start
  @throttle(1000)
  // jsdoc-ignore-end
  _doSendRead() {
    // if not connected, just skip everything
    if (!this._connection.is('connected')) return;
    const buffer = internal(this).readConversationsBuffer;
    const conversations = Array.from(buffer);
    if (!conversations.length) return;
    const ids = conversations.map(conversation => {
      if (!(conversation instanceof ConversationBase)) {
        throw new TypeError(`${conversation} is not a Conversation`);
      }
      return conversation.id;
    });
    this._debug(`mark [${ids}] as read`);
    buffer.clear();
    this._sendReadCommand(conversations).catch(error => {
      this._debug('send read failed: %O', error);
      conversations.forEach(buffer.add.bind(buffer));
    });
  }

  _sendReadCommand(conversations) {
    return this._send(
      new GenericCommand({
        cmd: 'read',
        readMessage: new ReadCommand({
          convs: conversations.map(
            conversation =>
              new ReadTuple({
                cid: conversation.id,
                mid:
                  conversation.lastMessage &&
                  conversation.lastMessage.from !== this.id
                    ? conversation.lastMessage.id
                    : undefined,
                timestamp: (conversation.lastMessageAt || new Date()).getTime(),
              })
          ),
        }),
      }),
      false
    );
  }
}
