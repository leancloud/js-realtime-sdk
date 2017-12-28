import PersistentConversation from './persistent-conversation';

/**
 * 服务号。
 *
 * 服务号不支持在客户端创建。
 * @since 4.0.0
 * @extends PersistentConversation
 * @public
 */
class ServiceConversation extends PersistentConversation {}

export default ServiceConversation;
