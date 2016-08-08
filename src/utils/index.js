import isPlainObject from 'lodash/isPlainObject';

export const tryAll = promiseConstructors => {
  const promise = new Promise(promiseConstructors[0]);
  if (promiseConstructors.length === 1) {
    return promise;
  }
  return promise.catch(() => tryAll(promiseConstructors.slice(1)));
};

export const tap = interceptor => value => ((interceptor(value), value));

export { default as Expirable } from './expirable';
export { default as Cache } from './cache';

export const decodeDate = date => {
  if (!date) return date;
  if (typeof date === 'string') {
    return new Date(date);
  }
  if (date.__type === 'Date' && date.iso) {
    return new Date(date.iso);
  }
  return date;
};

export const keyRemap = (keymap, obj) =>
  Object.keys(obj).reduce((newObj, key) => {
    const newKey = keymap[key] || key;
    return Object.assign(newObj, {
      [newKey]: obj[key],
    });
  }, {});

export const isIE10 = (
  global.navigator &&
  global.navigator.userAgent &&
  global.navigator.userAgent.indexOf('MSIE 10.') !== -1
);

/* eslint-disable no-proto */
export const getStaticProperty = (klass, property) =>
  (klass[property] || (klass.__proto__ ? getStaticProperty(klass.__proto__, property) : undefined));
/* eslint-enable no-proto */

export const union = (a, b) => Array.from(new Set([...a, ...b]));
export const difference = (a, b) => Array.from(
  (bSet => new Set(a.filter(x => !bSet.has(x))))(new Set(b))
);

const map = new WeakMap();

// protected property helper
export const internal = (object) => {
  if (!map.has(object)) {
    map.set(object, {});
  }
  return map.get(object);
};

// debug utility
const removeNull = obj => {
  if (!isPlainObject(obj)) return obj;
  const object = Object.assign({}, obj);
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in object) {
    if ({}.hasOwnProperty.call(object, prop)) {
      const value = object[prop];
      if (value === null) {
        delete object[prop];
      } else {
        object[prop] = removeNull(value);
      }
    }
  }
  return object;
};
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
