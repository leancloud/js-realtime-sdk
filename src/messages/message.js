import uuid from 'uuid';


/**
 * 消息状态枚举
 * @enum {Symbol}
 * @since 3.2.0
 * @memberof module:leancloud-realtime
 */
const MessageStatus = {
  /** 初始状态、未知状态 */
  NONE: Symbol('none'),
  /** 正在发送 */
  SENDING: Symbol('sending'),
  /** 已发送 */
  SENT: Symbol('sent'),
  /** 已送达 */
  DELIVERED: Symbol('delivered'),
  /** 发送失败 */
  FAILED: Symbol('failed'),
};
Object.freeze(MessageStatus);

const rMessageStatus = {
  [MessageStatus.NONE]: true,
  [MessageStatus.SENDING]: true,
  [MessageStatus.SENT]: true,
  [MessageStatus.DELIVERED]: true,
  [MessageStatus.FAILED]: true,
};

export { MessageStatus };
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
      /**
       * @var deliveredAt {?Date} 消息送达时间
       * @memberof Message#
       */
      // deliveredAt,
    });
    this._setStatus(MessageStatus.NONE);
  }

  /**
   * 设置是否需要送达回执
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
   * 消息状态，值为 {@link module:leancloud-realtime.MessageStatus} 之一
   * @type {Symbol}
   * @readonly
   * @since 3.2.0
   */
  get status() {
    return this._status;
  }

  _setStatus(status) {
    if (!rMessageStatus[status]) {
      throw new Error('Invalid message status');
    }
    this._status = status;
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
