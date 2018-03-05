/* eslint-disable no-param-reassign */
import { getStaticProperty, isIE10 } from '../utils';

// documented in ../index.js
export const messageType = type => {
  if (typeof type !== 'number') {
    throw new TypeError(`${type} is not a Number`);
  }
  return target => {
    target.TYPE = type;
    target.validate = json => json._lctype === type;
    target.prototype._getType = () => ({ _lctype: type });
  };
};

// documented in ../index.js
export const messageField = fields => {
  if (typeof fields !== 'string') {
    if (!Array.isArray(fields)) {
      throw new TypeError(`${fields} is not an Array`);
    } else if (fields.some(value => typeof value !== 'string')) {
      throw new TypeError('fields contains non-string typed member');
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
      ? originalCustomFields
      : [];
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
