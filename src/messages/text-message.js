import TypedMessage from './typed-message';

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

  /**
   * 向输出的 json 中添加标记类型的 _lctype 字段
   * @override
   * @inner
   */
  _getExtras() {
    return {
      _lctype: -1,
    };
  }

  /**
   * 判断给定的内容是否是有效的 TextMessage
   * @returns {Boolean}
   * @implements AVMessage.validate
   */
  static validate(json) {
    return json._lctype === -1;
  }

  // https://phabricator.babeljs.io/T116
  static parse(...args) {
    return super.parse(...args);
  }
}
