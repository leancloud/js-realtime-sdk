import TypedMessage from './typed-message';
import { messageType, IE10Compatible } from './helpers';

// jsdoc-ignore-start
@messageType(-1)
@IE10Compatible
// jsdoc-ignore-end
export default class TextMessage extends TypedMessage {
  /**
   * 文类类型消息
   * @extends TypedMessage
   * @param  {String} [text='']
   * @throws {TypeError} text 不是 String 类型
   */
  constructor(text = '') {
    if (typeof text !== 'string') {
      throw new TypeError(`${text} is not a string`);
    }
    super();
    this.setText(text);
  }
}

/**
 * @name TYPE
 * @memberof TextMessage
 * @type Number
 * @static
 * @const
 */
