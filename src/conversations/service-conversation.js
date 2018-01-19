import PersistentConversation from './persistent-conversation';

/**
 * 服务号。
 *
 * 服务号不支持在客户端创建。
 * @since 4.0.0
 * @extends PersistentConversation
 * @public
 */
class ServiceConversation extends PersistentConversation {
  /**
   * 订阅该服务号
   * @return {Promise.<this>} self
   */
  async subscribe() {
    return this.join();
  }

  /**
   * 退订该服务号
   * @return {Promise.<this>} self
   */
  async unsubscribe() {
    return this.quit();
  }
}

export default ServiceConversation;
