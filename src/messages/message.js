import uuid from 'uuid';

export default class Message {
  /**
   * @implements AVMessage
   * @param  {Object|String} content 消息内容
   */
  constructor(content) {
    Object.assign(this, { content }, {
      /**
       * @type {String}
       * @memberof Message#
       */
      id: uuid.v4(),
      /**
       * 消息所在的 conversation id
       * @memberof Message#
       * @type {String?}
       */
      cid: null,
      /**
       * 时间戳
       * @memberof Message#
       * @type {Date}
       */
      timestamp: new Date(),
      /**
       * 消息发送者
       * @memberof Message#
       * @type {String}
       */
      from: undefined,
      /**
       * 标记需要回执
       * @memberof Message#
       * @type {Boolean}
       */
      needReceipt: false,
      /**
       * 标记暂态消息
       * @memberof Message#
       * @type {Boolean}
       */
      transient: false,
    });
  }

  /**
   * 设置是否需要回执
   * @param {Boolean} needReceipt
   * @return {Message} self
   */
  setNeedReceipt(needReceipt) {
    this.needReceipt = needReceipt;
    return this;
  }

  /**
   * 设置是否是暂态消息
   * @param {Boolean} transient
   * @return {Message} self
   */
  setTransient(transient) {
    this.transient = transient;
    return this;
  }

  /**
   * 将当前消息序列化为 JSON 对象
   * @protected
   * @return {Object}
   */
  toJSON() {
    return this.content;
  }

  /**
   * 判断给定的内容是否是有效的 Message，
   * 该方法始终返回 true
   * @protected
   * @returns {Boolean}
   * @implements AVMessage.validate
   */
  static validate() {
    return true;
  }

  /**
   * 解析处理消息内容
   * <pre>
   * 如果子类提供了 message，返回该 message
   * 如果没有提供，将 json 作为 content 实例化一个 Message
   * @protected
   * @param  {Object}  json    json 格式的消息内容
   * @param  {Message} message 子类提供的 message
   * @return {Message}
   * @implements AVMessage.parse
   */
  static parse(json, message) {
    return message || new this(json);
  }
}
