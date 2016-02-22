import { default as d } from 'debug';
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
      'withLastMessages',
      'compact',
    ].reduce(
      (prev, key) => (prev << 1) + (Boolean)(options[key]),
      0
    );
  }

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
    debug(json);
    return json;
  }

  /**
   * 增加查询条件，指定聊天室的组员包含某些成员即可返回
   *
   * @param peerIds
   * @return
   */
  containsMembers(peerIds) {
    return this.containsAll('m', peerIds);
  }

  /**
   * 增加查询条件，指定聊天室的组员条件满足条件的才返回
   *
   * @param peerIds
   * @param includeSelf 是否包含自己
   * @return
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
   * 增加查询条件，当conversation的属性中对应的字段满足等于条件时即可返回
   *
   * @param key
   * @param value
   * @return
   */
  equalTo(key, value) {
    this._where[key] = this.constructor._encode(value);
    return this;
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段满足小于条件时即可返回*
   * @param key
   * @param value
   * @return
   */
  lessThan(key, value) {
    return this._addCondition(key, '$lt', value);
  }


  /**
   * 增加查询条件，当conversation的属性中对应的字段满足小于等于条件时即可返回

   * @param key
   * @param value
   * @return
   */
  lessThanOrEqualTo(key, value) {
    return this._addCondition(key, '$lte', value);
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段满足大于条件时即可返回
   *
   * @param key
   * @param value
   * @return
   */

  greaterThan(key, value) {
    return this._addCondition(key, '$gt', value);
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段满足大于等于条件时即可返回
   *
   * @param key
   * @param value
   * @return
   */

  greaterThanOrEqualTo(key, value) {
    return this._addCondition(key, '$gte', value);
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段满足不等于条件时即可返回
   *
   * @param key
   * @param value
   * @return
   */
  notEqualTo(key, value) {
    return this._addCondition(key, '$ne', value);
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段对应的值包含在指定值中时即可返回
   *
   * @param key
   * @param values
   * @return
   */
  containedIn(key, values) {
    return this._addCondition(key, '$in', values);
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段对应的值不包含在指定值中时即可返回
   *
   * @param key
   * @param values
   * @return
   */
  notContainsIn(key, values) {
    return this._addCondition(key, '$nin', values);
  }
  /**
   * 增加查询条件，当conversation的属性中对应的字段中的元素包含所有的值才可返回
   *
   * @param key
   * @param values
   * @return
   */
  containsAll(key, values) {
    return this._addCondition(key, '$all', values);
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段对应的值包含此字符串即可返回
   *
   * @param key
   * @param subString
   * @return
   */
  contains(key, subString) {
    return this._addCondition(key, '$regex', ConversationQuery._quote(subString));
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段对应的值以此字符串起始即可返回
   *
   * @param key
   * @param prefix
   * @return
   */
  startsWith(key, prefix) {
    return this._addCondition(key, '$regex', `^${ConversationQuery._quote(prefix)}`);
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段对应的值以此字符串结束即可返回
   *
   * @param key
   * @param suffix
   * @return
   */
  endsWith(key, suffix) {
    return this._addCondition(key, '$regex', `${ConversationQuery._quote(suffix)}$`);
  }

  /**
   * 增加查询条件，当conversation的属性中对应的字段对应的值满足提供的正则表达式即可返回
   *
   * @param key
   * @param regex
   * @param modifiers 正则表达式的匹配模式，比如'-i'表示忽视大小写区分等
   * @return
   */
  matches(key, regex, modifiers = '') {
    this._addCondition(key, '$regex', regex);
    // Javascript regex options support mig as inline options but store them
    // as properties of the object. We support mi & should migrate them to
    // modifiers
    let _modifiers = modifiers;
    if (regex.ignoreCase) { _modifiers += 'i'; }
    if (regex.multiline) { _modifiers += 'm'; }

    if (_modifiers && _modifiers.length) {
      this._addCondition(key, '$options', _modifiers);
    }
    return this;
  }

  /**
   * 添加查询约束条件，查找key类型是数组，该数组的长度匹配提供的数值
   *
   * @param key
   * @param value
   * @return
   */
  sizeEqualTo(key, value) {
    return this._addCondition(key, '$size', value);
  }

  /**
   * 设置返回集合的大小上限
   *
   * @param limit 上限
   * @return
   */
  limit(limit) {
    this._limit = limit;
    return this;
  }

  /**
   * 设置返回集合的起始位置，一般用于分页
   *
   * @param skip 起始位置跳过几个对象
   * @return
   */
  skip(skip) {
    this._skip = skip;
    return this;
  }

  /**
   * 设置返回集合按照指定key进行增序排列
   *
   * @param key
   * @return
   */
  ascending(key) {
    this._order = key;
    return this;
  }

  /**
   * 设置返回集合按照指定key进行增序排列，如果已设置其他排序，原排序的优先级较高
   *
   * @param key
   * @return
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
   * @param key
   * @return
   */
  descending(key) {
    this._order = `-${key}`;
    return this;
  }

  /**
   * 设置返回集合按照指定key进行降序排列，如果已设置其他排序，原排序的优先级较高
   *
   * @param key
   * @return
   */
  addDescending(key) {
    if (this._order) {
      this._order += `,-${key}`;
    } else {
      this._order = `-${key}`;
    }
    return key;
  }

  withLastMessages(enabled) {
    this._extraOptions.withLastMessages = enabled;
    return this;
  }

  compact(enabled) {
    this._extraOptions.compact = enabled;
    return this;
  }

  find() {
    return this._client._executeQuery(this);
  }
}
