import PersistentConversation from './persistent-conversation';

/**
 * 聊天室。
 *
 * 无法直接实例化，请使用 {@link IMClient#createChatRoom} 创建新的聊天室。
 * @since 4.0.0
 * @extends PersistentConversation
 * @public
 */
class ChatRoom extends PersistentConversation {}

export default ChatRoom;
