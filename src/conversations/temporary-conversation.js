import ConversationBase from './conversation-base';
import { createError, ErrorCode } from '../error';
import { decodeDate } from '../utils';

const transformNotFoundError = error => (
  error.code === ErrorCode.CONVERSATION_NOT_FOUND
    ? createError({ code: ErrorCode.CONVERSATION_EXPIRED })
    : error
);

/**
 * @since 4.0.0
 * @extends ConversationBase
 * @public
 */
class TemporaryConversation extends ConversationBase {
  constructor(data, {
    expiredAt,
  }, client) {
    super({
      ...data,
      expiredAt,
    }, client);
  }

  /**
   * 对话失效时间
   * @type {Date}
   */
  set expiredAt(value) {
    this._expiredAt = decodeDate(value);
  }
  get expiredAt() {
    return this._expiredAt;
  }

  /**
   * 对话是否已失效
   * @type {Boolean}
   */
  get expired() {
    return this.expiredAt < new Date();
  }

  async _send(...args) {
    if (this.expired) throw createError({ code: ErrorCode.CONVERSATION_EXPIRED });
    try {
      return await super._send(...args);
    } catch (error) {
      throw transformNotFoundError(error);
    }
  }

  async send(...args) {
    try {
      return await super.send(...args);
    } catch (error) {
      throw transformNotFoundError(error);
    }
  }

  toFullJSON() {
    const {
      expiredAt,
    } = this;
    return {
      ...super.toFullJSON(),
      expiredAt,
    };
  }

  toJSON() {
    const {
      expiredAt,
      expired,
    } = this;
    return {
      ...super.toJSON(),
      expiredAt,
      expired,
    };
  }
}

export default TemporaryConversation;
