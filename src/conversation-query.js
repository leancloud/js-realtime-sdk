import d from 'debug';

const debug = d('LC:ConversationQuery');

export default class ConversationQuery {
  static _encode(value) {
    if (value instanceof Date) {
      return { __type: 'Date', iso: value.toJSON() };
    }
    if (value instanceof RegExp) {
      return value.source;
    }
    return value;
  }

  static _quote(s) {
    return `\\Q${s.replace('\\E', '\\E\\\\E\\Q')}\\E`;
  }

  static _calculateFlag(options) {
    return [
      'withLastMessagesRefreshed',
      'compact',
    ].reduce(
      // eslint-disable-next-line no-bitwise
      (prev, key) => (prev << 1) + (Boolean)(options[key]),
      0
    );
  }

  /**
   * Create a ConversationQuery
   * @param  {IMClient} client
   */
  constructor(client) {
    this._client = client;
    this._where = {};
    this._extraOptions = {};
  }

  _addCondition(key, condition, value) {
    // Check if we already have a condition
    if (!this._where[key]) {
      this._where[key] = {};
    }
    this._where[key][condition] = this.constructor._encode(value);
    return this;
  }

  toJSON() {
    const json = {
      where: this._where,
      flag: this.constructor._calculateFlag(this._extraOptions),
    };
    if (typeof this._skip !== 'undefined') json.skip = this._skip;
    if (typeof this._limit !== 'undefined') json.limit = this._limit;
    if (typeof this._order !== 'undefined') json.sort = this._order;
    debug(json);
    return json;
  }

  /**
   * 增加查询条件，指定聊天室的组员包含某些成员即可返回
   * @param {string[]} peerIds - 成员 ID 列表
   * @return {ConversationQuery} self
   */
  containsMembers(peerIds) {
    return this.containsAll('m', peerIds);
  }

  /**
   * 增加查询条件，指定聊天室的组员条件满足条件的才返回
   *
   * @param {string[]} - 成员 ID 列表
   * @param {Boolean} includeSelf - 是否包含自己
   * @return {ConversationQuery} self
   */
  withMembers(peerIds, includeSelf) {
    const peerIdsSet = new Set(peerIds);
    if (includeSelf) {
      peerIdsSet.add(this._client.id);
    }
    this.sizeEqualTo('m', peerIdsSet.size);
    return this.containsMembers(Array.from(peerIdsSet));
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */
  equalTo(key, value) {
    this._where[key] = this.constructor._encode(value);
    return this;
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足小于条件时即可返回
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */
  lessThan(key, value) {
    return this._addCondition(key, '$lt', value);
  }


  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足小于等于条件时即可返回

   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */
  lessThanOrEqualTo(key, value) {
    return this._addCondition(key, '$lte', value);
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足大于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */

  greaterThan(key, value) {
    return this._addCondition(key, '$gt', value);
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足大于等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */

  greaterThanOrEqualTo(key, value) {
    return this._addCondition(key, '$gte', value);
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足不等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */
  notEqualTo(key, value) {
    return this._addCondition(key, '$ne', value);
  }

  /**
   * 增加查询条件，当 conversation 存在指定的字段时即可返回
   *
   * @since 3.5.0
   * @param {string} key
   * @return {ConversationQuery} self
   */
  exists(key) {
    return this._addCondition(key, '$exists', true);
  }

  /**
   * 增加查询条件，当 conversation 不存在指定的字段时即可返回
   *
   * @since 3.5.0
   * @param {string} key
   * @return {ConversationQuery} self
   */
  doesNotExist(key) {
    return this._addCondition(key, '$exists', false);
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值包含在指定值中时即可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */
  containedIn(key, values) {
    return this._addCondition(key, '$in', values);
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值不包含在指定值中时即可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */
  notContainsIn(key, values) {
    return this._addCondition(key, '$nin', values);
  }
  /**
   * 增加查询条件，当conversation的属性中对应的字段中的元素包含所有的值才可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */
  containsAll(key, values) {
    return this._addCondition(key, '$all', values);
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值包含此字符串即可返回
   *
   * @param {string} key
   * @param {string} subString
   * @return {ConversationQuery} self
   */
  contains(key, subString) {
    return this._addCondition(key, '$regex', ConversationQuery._quote(subString));
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值以此字符串起始即可返回
   *
   * @param {string} key
   * @param {string} prefix
   * @return {ConversationQuery} self
   */
  startsWith(key, prefix) {
    return this._addCondition(key, '$regex', `^${ConversationQuery._quote(prefix)}`);
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值以此字符串结束即可返回
   *
   * @param {string} key
   * @param {string} suffix
   * @return {ConversationQuery} self
   */
  endsWith(key, suffix) {
    return this._addCondition(key, '$regex', `${ConversationQuery._quote(suffix)}$`);
  }

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值满足提供的正则表达式即可返回
   *
   * @param {string} key
   * @param {RegExp} regex
   * @return {ConversationQuery} self
   */
  matches(key, regex) {
    this._addCondition(key, '$regex', regex);
    // Javascript regex options support mig as inline options but store them
    // as properties of the object. We support mi & should migrate them to
    // modifiers
    let _modifiers = '';
    if (regex.ignoreCase) { _modifiers += 'i'; }
    if (regex.multiline) { _modifiers += 'm'; }

    if (_modifiers && _modifiers.length) {
      this._addCondition(key, '$options', _modifiers);
    }
    return this;
  }

  /**
   * 添加查询约束条件，查找 key 类型是数组，该数组的长度匹配提供的数值
   *
   * @param {string} key
   * @param {Number} length
   * @return {ConversationQuery} self
   */
  sizeEqualTo(key, length) {
    return this._addCondition(key, '$size', length);
  }

  /**
   * 设置返回集合的大小上限
   *
   * @param {Number} limit - 上限
   * @return {ConversationQuery} self
   */
  limit(limit) {
    this._limit = limit;
    return this;
  }

  /**
   * 设置返回集合的起始位置，一般用于分页
   *
   * @param {Number} skip - 起始位置跳过几个对象
   * @return {ConversationQuery} self
   */
  skip(skip) {
    this._skip = skip;
    return this;
  }

  /**
   * 设置返回集合按照指定key进行增序排列
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */
  ascending(key) {
    this._order = key;
    return this;
  }

  /**
   * 设置返回集合按照指定key进行增序排列，如果已设置其他排序，原排序的优先级较高
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */
  addAscending(key) {
    if (this._order) {
      this._order += `,${key}`;
    } else {
      this._order = key;
    }
    return this;
  }

  /**
   * 设置返回集合按照指定 key 进行降序排列
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */
  descending(key) {
    this._order = `-${key}`;
    return this;
  }

  /**
   * 设置返回集合按照指定 key 进行降序排列，如果已设置其他排序，原排序的优先级较高
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */
  addDescending(key) {
    if (this._order) {
      this._order += `,-${key}`;
    } else {
      this._order = `-${key}`;
    }
    return this;
  }

  /**
   * 设置返回的 conversations 刷新最后一条消息
   * @param  {Boolean} [enabled=true]
   * @return {ConversationQuery} self
   */
  withLastMessagesRefreshed(enabled = true) {
    this._extraOptions.withLastMessagesRefreshed = enabled;
    return this;
  }

  /**
   * @deprecated 请替换为 {@link ConversationQuery#withLastMessagesRefreshed}
   * @param  {Boolean} [enabled=true]
   * @return {ConversationQuery} self
   */
  withLastMessages(enabled) {
    console.warn('DEPRECATION ConversationQuery#withLastMessages: ' +
      'Use ConversationQuery#withLastMessagesRefreshed instead.');
    return this.withLastMessagesRefreshed(enabled);
  }

  /**
   * 设置返回的 conversations 为精简模式，即不含成员列表
   * @param  {Boolean} [enabled=true]
   * @return {ConversationQuery} self
   */
  compact(enabled = true) {
    this._extraOptions.compact = enabled;
    return this;
  }

  /**
   * 执行查询
   * @return {Promise.<Conversation[]>}
   */
  find() {
    return this._client._executeQuery(this);
  }
}
