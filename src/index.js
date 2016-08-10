/** @module leancloud-realtime */
import { default as Realtime } from './realtime';
import Message, { MessageStatus } from './messages/message';
import { default as TypedMessage } from './messages/typed-message';
import { default as TextMessage } from './messages/text-message';
import {
  messageType,
  messageField,
  IE10Compatible,
} from './messages/helpers';

export {
  /**
   * @see Realtime
   */
  Realtime,
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
  MessageStatus,
};
