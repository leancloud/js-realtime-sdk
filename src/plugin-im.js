/** @module leancloud-realtime */
import d from 'debug';
import uuid from 'uuid/v4';
import IMClient from './im-client';
import Conversation from './conversation';
import Message, { MessageStatus } from './messages/message';
import TextMessage from './messages/text-message';
import TypedMessage from './messages/typed-message';
import RecalledMessage from './messages/recalled-message';
import MessageParser from './message-parser';
import { trim, internal, ensureArray } from './utils';

const debug = d('LC:IMPlugin');

/**
 * 消息优先级枚举
 * @enum {Number}
 * @since 3.3.0
 */
const MessagePriority = {
  /** 高 */
  HIGH: 1,
  /** 普通 */
  NORMAL: 2,
  /** 低 */
  LOW: 3,
};
Object.freeze(MessagePriority);

/**
 * 为 Conversation 定义一个新属性
 * @param {String} prop 属性名
 * @param {Object} [descriptor] 属性的描述符，参见 {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor#Description getOwnPropertyDescriptor#Description - MDN}，默认为该属性名对应的 Conversation 自定义属性的 getter/setter
 * @returns void
 * @example
 *
 * conversation.get('type');
 * conversation.set('type', 1);
 *
 * // equals to
 * defineConversationProperty('type');
 * conversation.type;
 * conversation.type = 1;
 */
const defineConversationProperty = (prop, descriptor = {
  get() { return this.get(prop); },
  set(value) { this.set(prop, value); },
}) => {
  Object.defineProperty(Conversation.prototype, prop, descriptor);
};

export {
  /**
   * @see Message
   */
  Message,
  /**
   * @see TypedMessage
   */
  TypedMessage,
  /**
   * @see TextMessage
   */
  TextMessage,
  /**
   * @see RecalledMessage
   */
  RecalledMessage,
  MessagePriority,
  MessageStatus,
  defineConversationProperty,
};

export {
  /**
   * decorator，定义消息类的类型常量
   * @function
   * @param {Number} type 自定义类型请使用正整数
   * @example @messageType(1)
   * class CustomMessage extends TypedMessage {}
   *
   * // 不支持 decorator 的情况下可以这样使用
   * class CustomMessage extends TypedMessage {
   *   //...
   * }
   * messageType(1)(CustomMessage);
   */
  messageType,
  /**
   * decorator，定义消息类的自定义字段
   * @function
   * @param {String[]} fields 自定义字段
   * @example @messageField(['foo'])
   * class CustomMessage extends TypedMessage {
   *   constructor(foo) {
   *     super();
   *     this.foo = foo;
   *   }
   * }
   *
   * // 不支持 decorator 的情况下可以这样使用
   * class CustomMessage extends TypedMessage {
   *   constructor(foo) {
   *     super();
   *     this.foo = foo;
   *   }
   *   //...
   * }
   * messageField(['foo'])(CustomMessage);
   */
  messageField,
  IE10Compatible,
} from './messages/helpers';

const onRealtimeCreate = (realtime) => {
  /* eslint-disable no-param-reassign */
  const deviceId = uuid();
  realtime._IMClients = {};
  const messageParser = realtime._messageParser = new MessageParser(realtime._plugins);

  /**
   * 注册消息类
   *
   * 在接收消息、查询消息时，会按照消息类注册顺序的逆序依次尝试解析消息内容
   *
   * @function register
   * @memberof Realtime
   * @instance
   * @param  {Function | Function[]} messageClass 消息类，需要实现 {@link AVMessage} 接口，
   * 建议继承自 {@link TypedMessage}
   * @throws {TypeError} 如果 messageClass 没有实现 {@link AVMessage} 接口则抛出异常
   */
  realtime.register = messageClass =>
    ensureArray(messageClass).map(messageParser.register.bind(messageParser));
  realtime.register(ensureArray(realtime._plugins.messageClasses));
  /**
   * 创建一个即时通讯客户端，多次创建相同 id 的客户端会返回同一个实例
   * @function createIMClient
   * @memberof Realtime
   * @instance
   * @param  {String} [id] 客户端 id，如果不指定，服务端会随机生成一个
   * @param  {Object} [clientOptions] 详细参数 @see {@link IMClient}
   * @param  {String} [tag] 客户端类型标记，以支持单点登录功能
   * @return {Promise.<IMClient>}
   */
  realtime.createIMClient = (id, clientOptions, tag) => {
    const idIsString = typeof id === 'string';
    if (idIsString && realtime._IMClients[id] !== undefined) {
      return Promise.resolve(realtime._IMClients[id]);
    }
    const promise = realtime._open().then((connection) => {
      const client = new IMClient(id, clientOptions, connection, {
        _messageParser: messageParser,
        _plugins: realtime._plugins,
      });
      connection.on('reconnect', () =>
        client._open(realtime._options.appId, tag, deviceId, true)
          /**
           * 客户端连接恢复正常，该事件通常在 {@link Realtime#event:reconnect} 之后发生
           * @event IMClient#reconnect
           * @see Realtime#event:reconnect
           * @since 3.2.0
           */
          /**
           * 客户端重新登录发生错误（网络连接已恢复，但重新登录错误）
           * @event IMClient#reconnecterror
           * @since 3.2.0
           */
          .then(
            () => client.emit('reconnect'),
            error => client.emit('reconnecterror', error)
          )
      );
      internal(client)._eventemitter.on('close', () => {
        delete realtime._IMClients[client.id];
        realtime._deregister(client);
      }, realtime);
      return client._open(realtime._options.appId, tag, deviceId)
        .then(() => {
          realtime._IMClients[client.id] = client;
          realtime._register(client);
          return client;
        });
    }).catch((error) => {
      delete realtime._IMClients[id];
      throw error;
    });
    if (idIsString) {
      realtime._IMClients[id] = promise;
    }
    return promise;
  };
  /* eslint-enable no-param-reassign */
};

const beforeCommandDispatch = (command, realtime) => {
  if (command.peerId === null) return true;
  const targetClient = realtime._IMClients[command.peerId];
  if (targetClient) {
    Promise.resolve(targetClient._dispatchCommand(command)).catch(debug);
  } else {
    debug(
      '[WARN] Unexpected message received without any live client match: %O',
      trim(command)
    );
  }
  return false;
};

export const IMPlugin = {
  name: 'leancloud-realtime-plugin-im',
  onRealtimeCreate,
  beforeCommandDispatch,
  messageClasses: [
    Message,
    RecalledMessage,
    TextMessage,
  ],
};
