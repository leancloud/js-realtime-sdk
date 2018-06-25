import Message from './message';
import { messageField } from './helpers';
import { getStaticProperty, isIE10, compact } from '../utils';

// jsdoc-ignore-start
@messageField(['_lctext', '_lcattrs'])
// jsdoc-ignore-end
/**
 * 所有内置的富媒体消息均继承自本类
 * @extends Message
 */
class TypedMessage extends Message {
  /**
   * @type {Number}
   * @readonly
   */
  get type() {
    return this.constructor.TYPE;
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
   * 在客户端需要以文本形式展示该消息时显示的文案，
   * 如 <code>[红包] 新春快乐</code>。
   * 默认值为消息的 text。
   * @type {String}
   * @readonly
   */
  get summary() {
    return this.text;
  }

  /**
   * @param {String} text
   * @return {this} self
   */
  setText(text) {
    this._lctext = text;
    return this;
  }

  /**
   * @return {String}
   */
  getText() {
    return this._lctext;
  }

  /**
   * @param {Object} attributes
   * @return {this} self
   */
  setAttributes(attributes) {
    this._lcattrs = attributes;
    return this;
  }

  /**
   * @return {Object}
   */
  getAttributes() {
    return this._lcattrs;
  }

  _getCustomFields() {
    const fields = Array.isArray(this.constructor._customFields)
      ? this.constructor._customFields
      : [];
    return fields.reduce((result, field) => {
      if (typeof field !== 'string') return result;
      result[field] = this[field]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
  }

  /* eslint-disable class-methods-use-this */
  _getType() {
    throw new Error('not implemented');
  }
  /* eslint-enable class-methods-use-this */

  getPayload() {
    return compact(
      Object.assign(
        {
          _lctext: this.getText(),
          _lcattrs: this.getAttributes(),
        },
        this._getCustomFields(),
        this._getType()
      )
    );
  }

  toJSON() {
    const { type, text, attributes, summary } = this;
    return {
      ...super._toJSON(),
      type,
      text,
      attributes,
      summary,
    };
  }

  toFullJSON() {
    return {
      ...super.toFullJSON(),
      data: this.getPayload(),
    };
  }

  /**
   * 解析处理消息内容
   * <pre>
   * 为给定的 message 设置 text 与 attributes 属性，返回该 message
   * 如果子类没有提供 message，new this()
   * @protected
   * @param  {Object}  json    json 格式的消息内容
   * @param  {TypedMessage} message 子类提供的 message
   * @return {TypedMessage}
   * @implements AVMessage.parse
   */
  static parse(json, message = new this()) {
    message.content = json; // eslint-disable-line no-param-reassign
    const customFields = isIE10
      ? getStaticProperty(message.constructor, '_customFields')
      : message.constructor._customFields;
    let fields = Array.isArray(customFields) ? customFields : [];
    fields = fields.reduce((result, field) => {
      if (typeof field !== 'string') return result;
      result[field] = json[field]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
    Object.assign(message, fields);
    return super.parse(json, message);
  }
}

export default TypedMessage;
