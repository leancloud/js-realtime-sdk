import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import ConversationBase from './conversation-base';
import {
  decodeDate,
  getTime,
  encode,
  keyRemap,
  union,
  difference,
  internal,
  setValue,
  ensureArray,
} from '../utils';
import {
  GenericCommand,
  ConvCommand,
  JsonObjectMessage,
  BlacklistCommand,
  OpType,
} from '../../proto/message';
import runSignatureFactory from '../signature-factory-runner';
import { createError } from '../error';

/**
 * 部分失败异常
 * @typedef OperationFailureError
 * @type {Error}
 * @property {string} message 异常信息
 * @property {string[]} clientIds 因为该原因失败的 client id 列表
 * @property {number} [code] 错误码
 * @property {string} [detail] 详细信息
 */

/**
 * 部分成功的结果
 * @typedef PartiallySuccess
 * @type {Object}
 * @property {string[]} successfulClientIds 成功的 client id 列表
 * @property {OperationFailureError[]} failures 失败的异常列表
 */

/**
 * 分页查询结果
 * @typedef PagedResults
 * @type {Object}
 * @property {T[]} results 查询结果
 * @property {string} [next] 存在表示还有更多结果，在下次查询中带上可实现翻页。
 */

const createPartiallySuccess = ({ allowedPids, failedPids }) => ({
  successfulClientIds: allowedPids,
  failures: failedPids.map(({ pids, ...error }) =>
    Object.assign(createError(error), { clientIds: pids })
  ),
});

/**
 * @extends ConversationBase
 * @private
 * @abstract
 */
class PersistentConversation extends ConversationBase {
  constructor(
    data,
    {
      creator,
      createdAt,
      updatedAt,
      transient = false,
      system = false,
      muted = false,
      mutedMembers = [],
      ...attributes
    },
    client
  ) {
    super(
      {
        ...data,
        /**
         * 对话创建者
         * @memberof PersistentConversation#
         * @type {String}
         */
        creator,
        /**
         * 对话创建时间
         * @memberof PersistentConversation#
         * @type {Date}
         */
        createdAt,
        /**
         * 对话更新时间
         * @memberof PersistentConversation#
         * @type {Date}
         */
        updatedAt,
        /**
         * 对该对话设置了静音的用户列表
         * @memberof PersistentConversation#
         * @type {?String[]}
         */
        mutedMembers,
        /**
         * 暂态对话标记
         * @memberof PersistentConversation#
         * @type {Boolean}
         */
        transient,
        /**
         * 系统对话标记
         * @memberof PersistentConversation#
         * @type {Boolean}
         * @since 3.3.0
         */
        system,
        /**
         * 当前用户静音该对话标记
         * @memberof PersistentConversation#
         * @type {Boolean}
         */
        muted,
        _attributes: attributes,
      },
      client
    );
    this._reset();
  }

  set createdAt(value) {
    this._createdAt = decodeDate(value);
  }

  get createdAt() {
    return this._createdAt;
  }

  set updatedAt(value) {
    this._updatedAt = decodeDate(value);
  }

  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * 对话名字，对应 _Conversation 表中的 name
   * @type {String}
   */
  get name() {
    return this.get('name');
  }

  set name(value) {
    this.set('name', value);
  }

  /**
   * 获取对话的自定义属性
   * @since 3.2.0
   * @param  {String} key key 属性的键名，'x' 对应 Conversation 表中的 x 列
   * @return {Any} 属性的值
   */
  get(key) {
    return internal(this).currentAttributes[key];
  }

  /**
   * 设置对话的自定义属性
   * @since 3.2.0
   * @param {String} key 属性的键名，'x' 对应 Conversation 表中的 x 列，支持使用 'x.y.z' 来修改对象的部分字段。
   * @param {Any} value 属性的值
   * @return {this} self
   * @example
   *
   * // 设置对话的 color 属性
   * conversation.set('color', {
   *   text: '#000',
   *   background: '#DDD',
   * });
   * // 设置对话的 color.text 属性
   * conversation.set('color.text', '#333');
   */
  set(key, value) {
    this._debug(`set [${key}]: ${value}`);
    const { pendingAttributes } = internal(this);
    const pendingKeys = Object.keys(pendingAttributes);
    // suppose pendingAttributes = { 'a.b': {} }
    // set 'a' or 'a.b': delete 'a.b'
    const re = new RegExp(`^${key}`);
    const childKeys = pendingKeys.filter(re.test.bind(re));
    childKeys.forEach(k => {
      delete pendingAttributes[k];
    });
    if (childKeys.length) {
      pendingAttributes[key] = value;
    } else {
      // set 'a.c': nothing to do
      // set 'a.b.c.d': assign c: { d: {} } to 'a.b'
      // CAUTION: non-standard API, provided by core-js
      const parentKey = Array.find(pendingKeys, k => key.indexOf(k) === 0); // 'a.b'
      if (parentKey) {
        setValue(
          pendingAttributes[parentKey],
          key.slice(parentKey.length + 1),
          value
        );
      } else {
        pendingAttributes[key] = value;
      }
    }
    this._buildCurrentAttributes();
    return this;
  }

  _buildCurrentAttributes() {
    const { pendingAttributes } = internal(this);
    internal(this).currentAttributes = Object.keys(pendingAttributes).reduce(
      (target, k) => setValue(target, k, pendingAttributes[k]),
      cloneDeep(this._attributes)
    );
  }

  _updateServerAttributes(attributes) {
    Object.keys(attributes).forEach(key =>
      setValue(this._attributes, key, attributes[key])
    );
    this._buildCurrentAttributes();
  }

  _reset() {
    Object.assign(internal(this), {
      pendingAttributes: {},
      currentAttributes: this._attributes,
    });
  }

  /**
   * 保存当前对话的属性至服务器
   * @return {Promise.<this>} self
   */
  async save() {
    this._debug('save');
    const attr = internal(this).pendingAttributes;
    if (isEmpty(attr)) {
      this._debug('nothing touched, resolve with self');
      return this;
    }
    this._debug('attr: %O', attr);
    const convMessage = new ConvCommand({
      attr: new JsonObjectMessage({
        data: JSON.stringify(encode(attr)),
      }),
    });
    const resCommand = await this._send(
      new GenericCommand({
        op: 'update',
        convMessage,
      })
    );
    this.updatedAt = resCommand.convMessage.udate;
    this._attributes = internal(this).currentAttributes;
    internal(this).pendingAttributes = {};
    return this;
  }

  /**
   * 从服务器更新对话的属性
   * @return {Promise.<this>} self
   */
  async fetch() {
    const query = this._client.getQuery().equalTo('objectId', this.id);
    await query.find();
    return this;
  }

  /**
   * 静音，客户端拒绝收到服务器端的离线推送通知
   * @return {Promise.<this>} self
   */
  async mute() {
    this._debug('mute');
    await this._send(
      new GenericCommand({
        op: 'mute',
      })
    );
    if (!this.transient) {
      this.muted = true;
      this.mutedMembers = union(this.mutedMembers, [this._client.id]);
    }
    return this;
  }

  /**
   * 取消静音
   * @return {Promise.<this>} self
   */
  async unmute() {
    this._debug('unmute');
    await this._send(
      new GenericCommand({
        op: 'unmute',
      })
    );
    if (!this.transient) {
      this.muted = false;
      this.mutedMembers = difference(this.mutedMembers, [this._client.id]);
    }
    return this;
  }

  async _appendConversationSignature(command, action, clientIds) {
    if (this._client.options.conversationSignatureFactory) {
      const params = [this.id, this._client.id, clientIds.sort(), action];
      const signatureResult = await runSignatureFactory(
        this._client.options.conversationSignatureFactory,
        params
      );
      Object.assign(
        command.convMessage,
        keyRemap(
          {
            signature: 's',
            timestamp: 't',
            nonce: 'n',
          },
          signatureResult
        )
      );
    }
  }

  async _appendBlacklistSignature(command, action, clientIds) {
    if (this._client.options.blacklistSignatureFactory) {
      const params = [this._client.id, this.id, clientIds.sort(), action];
      const signatureResult = await runSignatureFactory(
        this._client.options.blacklistSignatureFactory,
        params
      );
      Object.assign(
        command.blacklistMessage,
        keyRemap(
          {
            signature: 's',
            timestamp: 't',
            nonce: 'n',
          },
          signatureResult
        )
      );
    }
  }

  /**
   * 增加成员
   * @param {String|String[]} clientIds 新增成员 client id
   * @return {Promise.<PartiallySuccess>} 部分成功结果，包含了成功的 id 列表、失败原因与对应的 id 列表
   */
  async add(clientIds) {
    this._debug('add', clientIds);
    if (typeof clientIds === 'string') {
      clientIds = [clientIds]; // eslint-disable-line no-param-reassign
    }
    const command = new GenericCommand({
      op: 'add',
      convMessage: new ConvCommand({
        m: clientIds,
      }),
    });
    await this._appendConversationSignature(command, 'add', clientIds);
    const {
      convMessage,
      convMessage: { allowedPids },
    } = await this._send(command);
    this._addMembers(allowedPids);
    return createPartiallySuccess(convMessage);
  }

  /**
   * 剔除成员
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<PartiallySuccess>} 部分成功结果，包含了成功的 id 列表、失败原因与对应的 id 列表
   */
  async remove(clientIds) {
    this._debug('remove', clientIds);
    if (typeof clientIds === 'string') {
      clientIds = [clientIds]; // eslint-disable-line no-param-reassign
    }
    const command = new GenericCommand({
      op: 'remove',
      convMessage: new ConvCommand({
        m: clientIds,
      }),
    });
    await this._appendConversationSignature(command, 'remove', clientIds);
    const {
      convMessage,
      convMessage: { allowedPids },
    } = await this._send(command);
    this._removeMembers(allowedPids);
    return createPartiallySuccess(convMessage);
  }

  /**
   * （当前用户）加入该对话
   * @return {Promise.<this>} self
   */
  async join() {
    this._debug('join');
    return this.add(this._client.id).then(({ failures }) => {
      if (failures[0]) throw failures[0];
      return this;
    });
  }

  /**
   * （当前用户）退出该对话
   * @return {Promise.<this>} self
   */
  async quit() {
    this._debug('quit');
    return this.remove(this._client.id).then(({ failures }) => {
      if (failures[0]) throw failures[0];
      return this;
    });
  }

  /**
   * 在该对话中禁言成员
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<PartiallySuccess>} 部分成功结果，包含了成功的 id 列表、失败原因与对应的 id 列表
   */
  async muteMembers(clientIds) {
    this._debug('mute', clientIds);
    clientIds = ensureArray(clientIds); // eslint-disable-line no-param-reassign
    const command = new GenericCommand({
      op: OpType.add_shutup,
      convMessage: new ConvCommand({
        m: clientIds,
      }),
    });
    const { convMessage } = await this._send(command);
    return createPartiallySuccess(convMessage);
  }

  /**
   * 在该对话中解除成员禁言
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<PartiallySuccess>} 部分成功结果，包含了成功的 id 列表、失败原因与对应的 id 列表
   */
  async unmuteMembers(clientIds) {
    this._debug('unmute', clientIds);
    clientIds = ensureArray(clientIds); // eslint-disable-line no-param-reassign
    const command = new GenericCommand({
      op: OpType.remove_shutup,
      convMessage: new ConvCommand({
        m: clientIds,
      }),
    });
    const { convMessage } = await this._send(command);
    return createPartiallySuccess(convMessage);
  }

  /**
   * 查询该对话禁言成员列表
   * @param {Object} [options]
   * @param {Number} [options.limit] 返回的成员数量，服务器默认值 10
   * @param {String} [options.next] 从指定 next 开始查询，与 limit 一起使用可以完成翻页。
   * @return {PagedResults.<string>} 查询结果。其中的 cureser 存在表示还有更多结果。
   */
  async queryMutedMembers({ limit, next } = {}) {
    this._debug('query muted: limit %O, next: %O', limit, next);
    const command = new GenericCommand({
      op: OpType.query_shutup,
      convMessage: new ConvCommand({
        limit,
        next,
      }),
    });
    const {
      convMessage: { m, next: newNext },
    } = await this._send(command);
    return {
      results: m,
      next: newNext,
    };
  }

  /**
   * 将用户加入该对话黑名单
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<PartiallySuccess>} 部分成功结果，包含了成功的 id 列表、失败原因与对应的 id 列表
   */
  async blockMembers(clientIds) {
    this._debug('block', clientIds);
    clientIds = ensureArray(clientIds); // eslint-disable-line no-param-reassign
    const command = new GenericCommand({
      cmd: 'blacklist',
      op: OpType.block,
      blacklistMessage: new BlacklistCommand({
        srcCid: this.id,
        toPids: clientIds,
      }),
    });
    await this._appendBlacklistSignature(
      command,
      'conversation-block-clients',
      clientIds
    );
    const { blacklistMessage } = await this._send(command);
    return createPartiallySuccess(blacklistMessage);
  }

  /**
   * 将用户移出该对话黑名单
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<PartiallySuccess>} 部分成功结果，包含了成功的 id 列表、失败原因与对应的 id 列表
   */
  async unblockMembers(clientIds) {
    this._debug('unblock', clientIds);
    clientIds = ensureArray(clientIds); // eslint-disable-line no-param-reassign
    const command = new GenericCommand({
      cmd: 'blacklist',
      op: OpType.unblock,
      blacklistMessage: new BlacklistCommand({
        srcCid: this.id,
        toPids: clientIds,
      }),
    });
    await this._appendBlacklistSignature(
      command,
      'conversation-unblock-clients',
      clientIds
    );
    const { blacklistMessage } = await this._send(command);
    return createPartiallySuccess(blacklistMessage);
  }

  /**
   * 查询该对话黑名单
   * @param {Object} [options]
   * @param {Number} [options.limit] 返回的成员数量，服务器默认值 10
   * @param {String} [options.next] 从指定 next 开始查询，与 limit 一起使用可以完成翻页
   * @return {PagedResults.<string>} 查询结果。其中的 cureser 存在表示还有更多结果。
   */
  async queryBlockedMembers({ limit, next } = {}) {
    this._debug('query blocked: limit %O, next: %O', limit, next);
    const command = new GenericCommand({
      cmd: 'blacklist',
      op: OpType.query,
      blacklistMessage: new BlacklistCommand({
        srcCid: this.id,
        limit,
        next,
      }),
    });
    const {
      blacklistMessage: { blockedPids, next: newNext },
    } = await this._send(command);
    return {
      results: blockedPids,
      next: newNext,
    };
  }

  toFullJSON() {
    const {
      creator,
      system,
      transient,
      createdAt,
      updatedAt,
      _attributes,
    } = this;
    return {
      ...super.toFullJSON(),
      creator,
      system,
      transient,
      createdAt: getTime(createdAt),
      updatedAt: getTime(updatedAt),
      ..._attributes,
    };
  }

  toJSON() {
    const {
      creator,
      system,
      transient,
      muted,
      mutedMembers,
      createdAt,
      updatedAt,
      _attributes,
    } = this;
    return {
      ...super.toJSON(),
      creator,
      system,
      transient,
      muted,
      mutedMembers,
      createdAt,
      updatedAt,
      ..._attributes,
    };
  }
}

export default PersistentConversation;
