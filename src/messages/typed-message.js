import Message from './message';

export default class TypedMessage extends Message {
  /**
   * 所有内置的富媒体消息均继承自本类
   * @extends Message
   */
  constructor() {
    super({});
  }

  /** @type {String} */
  set text(text) {
    return this.setText(text);
  }
  get text() {
    return this.getText();
  }

  /** @type {Object} */
  set attributes(attributes) {
    return this.setAttributes(attributes);
  }
  get attributes() {
    return this.getAttributes();
  }

  /**
   * @param {String} text
   * @return {TypedMessage} self
   */
  setText(text) {
    this.content.text = text;
    return this;
  }
  /**
   * @return {String}
   */
  getText() {
    return this.content.text;
  }

  /**
   * @param {Object} attributes
   * @return {TypedMessage} self
   */
  setAttributes(attributes) {
    this.content.attrs = attributes;
    return this;
  }
  /**
   * @return {Object}
   */
  getAttributes() {
    return this.content.attrs;
  }

  /**
   * 获得额外信息，向输出的 json 中添加字段。
   *
   * @abstract
   * @return {Object} key-value
   * @example
   * export default class CustomMessage extends TypedMessage {
   *   // 子类无须重载 {@link TypedMessage#toJSON} 即可向输出的 json 中添加标记类型的字段
   *   _getExtras() {
   *     return {
   *       _lctype: 1,
   *       customField: this.customField,
   *     };
   *   }
   *   static validate(json) {
   *     return json._lctype === 1;
   *   }
   * }
   */
  _getExtras() {
    return {
      _lctype: 0,
    };
  }

  toJSON() {
    return Object.assign({
      _lctext: this.getText(),
      _lcattrs: this.getAttributes(),
    }, this._getExtras());
  }

  /**
   * 解析处理消息内容
   * <pre>
   * 为给定的 message 设置 text 与 attributes 属性，返回该 message
   * 如果子类没有提供 message，new this()
   * @param  {Object}  json    json 格式的消息内容
   * @param  {Message} message 子类提供的 message
   * @return {Message}
   * @implements AVMessage.parse
   */
  static parse(json, message = new this()) {
    message
      .setText(json._lctext)
      .setAttributes(json._lcattrs);
    return super.parse(json, message);
  }
}
