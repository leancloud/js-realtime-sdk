import PersistentConversation from './persistent-conversation';

/**
 * 普通对话
 *
 * 无法直接实例化，请使用 {@link IMClient#createConversation} 创建新的普通对话。
 * @extends PersistentConversation
 * @public
 */
class Conversation extends PersistentConversation {}

export default Conversation;
