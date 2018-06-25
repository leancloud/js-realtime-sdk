import PersistentConversation from './persistent-conversation';
import ConversationMemberInfo, {
  ConversationMemberRole,
} from '../conversation-member-info';
import { internal, union, difference } from '../utils';
import {
  GenericCommand,
  ConvCommand,
  ConvMemberInfo,
  OpType,
} from '../../proto/message';
import { createError, ErrorCode } from '../error';

/**
 * 普通对话
 *
 * 无法直接实例化，请使用 {@link IMClient#createConversation} 创建新的普通对话。
 * @extends PersistentConversation
 * @public
 */
class Conversation extends PersistentConversation {
  _addMembers(members) {
    super._addMembers(members);
    this.members = union(this.members, members);
    const { memberInfoMap } = internal(this);
    if (!memberInfoMap) return;
    members.forEach(memberId => {
      memberInfoMap[memberId] =
        memberInfoMap[memberId] ||
        new ConversationMemberInfo({
          conversation: this,
          memberId,
          role: ConversationMemberRole.MEMBER,
        });
    });
  }

  _removeMembers(members) {
    super._removeMembers(members);
    this.members = difference(this.members, members);
    const { memberInfoMap } = internal(this);
    if (!memberInfoMap) return;
    members.forEach(memberId => {
      delete memberInfoMap[memberId];
    });
  }

  async _fetchAllMemberInfo() {
    const response = await this._client._requestWithSessionToken({
      method: 'GET',
      path: '/classes/_ConversationMemberInfo',
      query: {
        where: { cid: this.id },
      },
    });
    const memberInfos = response.results.map(
      info =>
        new ConversationMemberInfo({
          conversation: this,
          memberId: info.clientId,
          role: info.role,
        })
    );
    const memberInfoMap = {};
    memberInfos.forEach(memberInfo => {
      memberInfoMap[memberInfo.memberId] = memberInfo;
    });
    this.members.forEach(memberId => {
      memberInfoMap[memberId] =
        memberInfoMap[memberId] ||
        new ConversationMemberInfo({
          conversation: this,
          memberId,
          role: ConversationMemberRole.MEMBER,
        });
    });
    internal(this).memberInfoMap = memberInfoMap;
    return memberInfoMap;
  }

  /**
   * 获取所有成员的对话属性
   * @since 4.0.0
   * @return {Promise.<ConversationMemberInfo[]>} 所有成员的对话属性列表
   */
  async getAllMemberInfo({ noCache = false } = {}) {
    let { memberInfoMap } = internal(this);
    if (!memberInfoMap || noCache) {
      memberInfoMap = await this._fetchAllMemberInfo();
    }
    return this.members.map(memberId => memberInfoMap[memberId]);
  }

  /**
   * 获取指定成员的对话属性
   * @since 4.0.0
   * @param {String} memberId 成员 Id
   * @return {Promise.<ConversationMemberInfo>} 指定成员的对话属性
   */
  async getMemberInfo(memberId) {
    if (this.members.indexOf(memberId) === -1)
      throw new Error(
        `${memberId} is not the mumber of conversation[${this.id}]`
      );
    const { memberInfoMap } = internal(this);
    if (!(memberInfoMap && memberInfoMap[memberId]))
      await this.getAllMemberInfo();
    return internal(this).memberInfoMap[memberId];
  }

  /**
   * 更新指定用户的角色
   * @since 4.0.0
   * @param {String} memberId 成员 Id
   * @param {module:leancloud-realtime.ConversationMemberRole | String} role 角色
   * @return {Promise.<this>} self
   */
  async updateMemberRole(memberId, role) {
    this._debug('update member role');
    if (role === ConversationMemberRole.OWNER)
      throw createError({
        code: ErrorCode.OWNER_PROMOTION_NOT_ALLOWED,
      });
    await this._send(
      new GenericCommand({
        op: OpType.member_info_update,
        convMessage: new ConvCommand({
          targetClientId: memberId,
          info: new ConvMemberInfo({
            pid: memberId,
            role,
          }),
        }),
      })
    );
    const { memberInfos } = internal(this);
    if (memberInfos && memberInfos[memberId]) {
      internal(memberInfos[memberId]).role = role;
    }
    return this;
  }
}

export default Conversation;
