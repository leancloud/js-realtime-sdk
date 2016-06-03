/* eslint-disable no-param-reassign */
import { getStaticProperty, isIE10 } from '../utils';

/**
 * @namespace MessageHelper
 * @example
 * // 这是一个虚拟的 namespace，以下所有 members 请直接 import from 'leancloud-realtime'
import { messageType } from 'leancloud-realtime';
 */

/**
 * decorator，定义消息类的类型常量
 * @function
 * @memberof MessageHelper
 * @param {Number} type 自定义类型请使用正整数
 * @example @messageType(1)
 * class CustomMessage extends TypedMessage {}
 *
 * // 不支持 decorator 的情况下可以这样使用
 * class CustomMessage extends TypedMessage {
 *   //...
 * }
 * messageType(1)(CustomMessage);
 */
export const messageType = type => {
  if (typeof type !== 'number') {
    throw new TypeError(`${type} is not a Number`);
  }
  return target => {
    target.TYPE = type;
    target.validate = json => (json._lctype === type);
    target.prototype._getType = () => ({ _lctype: type });
  };
};

/**
 * decorator，定义消息类的自定义字段
 * @function
 * @memberof MessageHelper
 * @param {String[]} fields 自定义字段
 * @example @messageField(['foo'])
 * class CustomMessage extends TypedMessage {
 *   constructor(foo) {
 *     super();
 *     this.foo = foo;
 *   }
 * }
 *
 * // 不支持 decorator 的情况下可以这样使用
 * class CustomMessage extends TypedMessage {
 *   constructor(foo) {
 *     super();
 *     this.foo = foo;
 *   }
 *   //...
 * }
 * messageField(['foo'])(CustomMessage);
 */
export const messageField = fields => {
  if (typeof fields !== 'string') {
    if (!Array.isArray(fields)) {
      throw new TypeError(`${fields} is not an Array`);
    } else {
      if (fields.some(value => typeof value !== 'string')) {
        throw new TypeError('fields contains non-string typed member');
      }
    }
  }
  return target => {
    // IE10 Hack:
    // static properties in IE10 will not be inherited from super
    // search for parse method and assign it manually
    let originalCustomFields = isIE10
      ? getStaticProperty(target, '_customFields')
      : target._customFields;
    originalCustomFields = Array.isArray(originalCustomFields)
      ? originalCustomFields : [];
    target._customFields = originalCustomFields.concat(fields);
  };
};

// IE10 Hack:
// static properties in IE10 will not be inherited from super
// search for parse method and assign it manually

export const IE10Compatible = target => {
  if (isIE10) {
    target.parse = getStaticProperty(target, 'parse');
  }
};
