import isPlainObject from 'lodash/isPlainObject';
import global from './global';

export { global };

export const tryAll = promiseConstructors => {
  const promise = new Promise(promiseConstructors[0]);
  if (promiseConstructors.length === 1) {
    return promise;
  }
  return promise.catch(() => tryAll(promiseConstructors.slice(1)));
};

// eslint-disable-next-line no-sequences
export const tap = interceptor => value => (interceptor(value), value);

export const finalize = callback => [
  // eslint-disable-next-line no-sequences
  value => (callback(), value),
  error => {
    callback();
    throw error;
  },
];

export { default as Expirable } from './expirable';
export { default as Cache } from './cache';

/**
 * 将对象转换为 Date，支持 string、number、ProtoBuf Long 以及 LeanCloud 的 Date 类型，
 * 其他情况下（包括对象为 falsy）返回原值。
 * @private
 */
export const decodeDate = date => {
  if (!date) return date;
  if (typeof date === 'string' || typeof date === 'number') {
    return new Date(date);
  }
  if (date.__type === 'Date' && date.iso) {
    return new Date(date.iso);
  }
  // Long
  if (typeof date.toNumber === 'function') {
    return new Date(date.toNumber());
  }
  return date;
};
/**
 * 获取 Date 的毫秒数，如果不是一个 Date 返回 undefined。
 * @private
 */
export const getTime = date =>
  date && date.getTime ? date.getTime() : undefined;

/**
 * 解码对象中的 LeanCloud 数据结构。
 * 目前仅会处理 Date 类型。
 * @private
 */
export const decode = value => {
  if (!value) return value;
  if (value.__type === 'Date' && value.iso) {
    return new Date(value.iso);
  }
  if (Array.isArray(value)) {
    return value.map(decode);
  }
  if (isPlainObject(value)) {
    return Object.keys(value).reduce(
      (result, key) => ({
        ...result,
        [key]: decode(value[key]),
      }),
      {}
    );
  }
  return value;
};
/**
 * 将对象中的特殊类型编码为 LeanCloud 数据结构。
 * 目前仅会处理 Date 类型。
 * @private
 */
export const encode = value => {
  if (value instanceof Date) return { __type: 'Date', iso: value.toJSON() };
  if (Array.isArray(value)) {
    return value.map(encode);
  }
  if (isPlainObject(value)) {
    return Object.keys(value).reduce(
      (result, key) => ({
        ...result,
        [key]: encode(value[key]),
      }),
      {}
    );
  }
  return value;
};

export const keyRemap = (keymap, obj) =>
  Object.keys(obj).reduce((newObj, key) => {
    const newKey = keymap[key] || key;
    return Object.assign(newObj, {
      [newKey]: obj[key],
    });
  }, {});

export const isIE10 =
  global.navigator &&
  global.navigator.userAgent &&
  global.navigator.userAgent.indexOf('MSIE 10.') !== -1;

/* eslint-disable no-proto */
export const getStaticProperty = (klass, property) =>
  klass[property] ||
  (klass.__proto__ ? getStaticProperty(klass.__proto__, property) : undefined);
/* eslint-enable no-proto */

export const union = (a, b) => Array.from(new Set([...a, ...b]));
export const difference = (a, b) =>
  Array.from((bSet => new Set(a.filter(x => !bSet.has(x))))(new Set(b)));

const map = new WeakMap();

// protected property helper
export const internal = object => {
  if (!map.has(object)) {
    map.set(object, {});
  }
  return map.get(object);
};

export const compact = (obj, filter) => {
  if (!isPlainObject(obj)) return obj;
  const object = Object.assign({}, obj);
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in object) {
    if ({}.hasOwnProperty.call(object, prop)) {
      const value = object[prop];
      if (value === filter) {
        delete object[prop];
      } else {
        object[prop] = compact(value, filter);
      }
    }
  }
  return object;
};

// debug utility
const removeNull = obj => compact(obj, null);
export const trim = message => removeNull(JSON.parse(JSON.stringify(message)));

export const ensureArray = target => {
  if (Array.isArray(target)) {
    return target;
  }
  if (target === undefined || target === null) {
    return [];
  }
  return [target];
};

export const setValue = (target, key, value) => {
  // '.' is not allowed in Class keys, escaping is not in concern now.
  const segs = key.split('.');
  const lastSeg = segs.pop();
  let currentTarget = target;
  segs.forEach(seg => {
    if (currentTarget[seg] === undefined) currentTarget[seg] = {};
    currentTarget = currentTarget[seg];
  });
  currentTarget[lastSeg] = value;
  return target;
};

export const isWeapp =
  // eslint-disable-next-line no-undef
  typeof wx === 'object' && typeof wx.connectSocket === 'function';

// throttle decorator
export const throttle = wait => (target, property, descriptor) => {
  const callback = descriptor.value;
  // very naive, internal use only
  if (callback.length) {
    throw new Error('throttled function should not accept any arguments');
  }
  return {
    ...descriptor,
    value() {
      let { throttleMeta } = internal(this);
      if (!throttleMeta) {
        throttleMeta = {};
        internal(this).throttleMeta = throttleMeta;
      }
      let { [property]: propertyMeta } = throttleMeta;
      if (!propertyMeta) {
        propertyMeta = {};
        throttleMeta[property] = propertyMeta;
      }
      const { previouseTimestamp = 0, timeout } = propertyMeta;
      const now = Date.now();
      const remainingTime = wait - (now - previouseTimestamp);
      if (remainingTime <= 0) {
        throttleMeta[property].previouseTimestamp = now;
        callback.apply(this);
      } else if (!timeout) {
        propertyMeta.timeout = setTimeout(() => {
          propertyMeta.previouseTimestamp = Date.now();
          delete propertyMeta.timeout;
          callback.apply(this);
        }, remainingTime);
      }
    },
  };
};
