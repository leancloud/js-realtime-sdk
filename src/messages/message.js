import uuid from 'uuid/v4';


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
  [MessageStatus.READ]: true,
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
      id: uuid(),
      /**
       * 消息所在的 conversation id
       * @memberof Message#
       * @type {String?}
       */
      cid: null,
      /**
       * 消息发送时间
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
       * @deprecated 指定是否需要送达回执请使用 {@link Conversation#send} 方法的 `options.receipt` 参数。
       */
      needReceipt: false,
      /**
       * 标记暂态消息
       * @memberof Message#
       * @type {Boolean}
       * @deprecated 指定是否作为暂态消息发送请使用 {@link Conversation#send} 方法的 `options.transient` 参数。
       * 请不要将是否为暂态作为区分某些消息的标记，请使用富媒体消息的属性（attributes）或使用自定义消息类型。
       * 该字段将在 v4.0 中移除。
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
   * @deprecated 请使用 {@link Conversation#send} 方法的 `options.receipt` 选项代替。
   */
  setNeedReceipt(needReceipt) {
    console.warn('DEPRECATION Message#setNeedReceipt: Use Conversation#send with sendOptions.receipt instead.');
    this.needReceipt = needReceipt;
    return this;
  }

  /**
   * 设置是否是暂态消息
   * @param {Boolean} transient
   * @return {Message} self
   * @deprecated 请使用 {@link Conversation#send} 方法的 `options.transient` 选项代替。
   */
  setTransient(transient) {
    console.warn('DEPRECATION Message#setTransient: Use Conversation#send with sendOptions.transient instead.');
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
   * 消息修改或撤回时间，可以通过比较其与消息的 timestamp 是否相等判断消息是否被修改过或撤回过。
   * @type {Date}
   * @since 3.5.0
   */
  get updatedAt() {
    return this._updatedAt || this.timestamp;
  }
  set updatedAt(value) {
    this._updatedAt = value;
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
