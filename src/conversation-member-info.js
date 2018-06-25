import { internal } from './utils';

/**
 * 对话成员角色枚举
 * @enum {String}
 * @since 4.0.0
 * @memberof module:leancloud-realtime
 */
const ConversationMemberRole = {
  /** 所有者 */
  OWNER: 'Owner',
  /** 管理员 */
  MANAGER: 'Manager',
  /** 成员 */
  MEMBER: 'Member',
};
Object.freeze(ConversationMemberRole);
export { ConversationMemberRole };

export default class ConversationMemberInfo {
  /**
   * 对话成员属性，保存了成员与某个对话相关的属性，对应 _ConversationMemberInfo 表
   * @since 4.0.0
   */
  constructor({ conversation, memberId, role }) {
    if (!conversation) throw new Error('conversation requried');
    if (!memberId) throw new Error('memberId requried');
    Object.assign(internal(this), {
      conversation,
      memberId,
      role,
    });
  }

  /**
   * 对话 Id
   * @type {String}
   * @readonly
   */
  get conversationId() {
    return internal(this).conversation.id;
  }

  /**
   * 成员 Id
   * @type {String}
   * @readonly
   */
  get memberId() {
    return internal(this).memberId;
  }

  /**
   * 角色
   * @type {module:leancloud-realtime.ConversationMemberRole | String}
   * @readonly
   */
  get role() {
    if (this.isOwner) return ConversationMemberRole.OWNER;
    return internal(this).role;
  }

  /**
   * 是否是管理员
   * @type {Boolean}
   * @readonly
   */
  get isOwner() {
    return this.memberId === internal(this).conversation.creator;
  }

  toJSON() {
    const { conversationId, memberId, role, isOwner } = this;
    return {
      conversationId,
      memberId,
      role,
      isOwner,
    };
  }
}
