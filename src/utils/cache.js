import d from 'debug';
import Expirable from './expirable';

const debug = d('LC:Cache');
export default class Cache {
  constructor(name = 'anonymous') {
    this.name = name;
    this._map = {};
  }

  get(key) {
    const cache = this._map[key];
    if (cache) {
      const { value } = cache;
      if (value !== Expirable.EXPIRED) {
        debug('[%s] hit: %s', this.name, key);
        return value;
      }
      delete this._map[key];
    }
    debug(`[${this.name}] missed: ${key}`);
    return null;
  }

  set(key, value, ttl) {
    debug('[%s] set: %s %o %d', this.name, key, value, ttl);
    this._map[key] = new Expirable(value, ttl);
  }
}
