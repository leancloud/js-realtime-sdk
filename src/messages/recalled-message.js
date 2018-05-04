import TypedMessage from './typed-message';
import { messageType, IE10Compatible } from './helpers';

// jsdoc-ignore-start
@messageType(-127)
@IE10Compatible
// jsdoc-ignore-end
/**
 * 已撤回类型消息，当消息被撤回时，SDK 会使用该类型的消息替代原始消息
 * @extends TypedMessage
 */
class RecalledMessage extends TypedMessage {
  /**
   * 在客户端需要以文本形式展示该消息时显示的文案，值为 <code>[该消息已撤回]</code>
   * @type {String}
   * @readonly
   */
  // eslint-disable-next-line class-methods-use-this
  get summary() {
    return '[该消息已撤回]';
  }
}
export default RecalledMessage;
