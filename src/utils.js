import { Promise } from 'rsvp';

export const tryAll = promiseConstructors => {
  const promise = new Promise(promiseConstructors[0]);
  if (promiseConstructors.length === 1) {
    return promise;
  }
  return promise.catch(() => tryAll(promiseConstructors.slice(1)));
};

export const tap = interceptor => value => (interceptor(value), value);

export class Cache {
  constructor() {
    this._map = {};
  }

  get(key) {
    const cache = this._map[key];
    if (cache) {
      const expired = cache.expiredAt && cache.expiredAt < Date.now();
      if (!expired) {
        return cache.value;
      }
    }
    return null;
  }

  set(key, value, ttl) {
    const cache = this._map[key] = {
      value,
    };
    if (typeof ttl === 'number') {
      cache.expiredAt = Date.now() + ttl;
    }
  }
}
