/** @module leancloud-realtime */
import { Realtime } from './core';
import { IMPlugin, defineConversationProperty } from './plugin-im';

Realtime.defineConversationProperty = defineConversationProperty;
Realtime.__preRegisteredPlugins = [IMPlugin];

export * from './core';

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
  MessagePriority,
  MessageStatus,
} from './plugin-im';
