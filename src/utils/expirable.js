import { default as d } from 'debug';

const EXPIRED = Symbol('expired');
const debug = d('LC:Expirable');
export default class Expirable {
  constructor(value, ttl) {
    this._value = value;
    if (typeof ttl === 'number') {
      this.expiredAt = Date.now() + ttl;
    }
  }

  get value() {
    const expired = this.expiredAt && this.expiredAt < Date.now();
    if (expired) debug(`expired: ${this._value}`);
    return expired ? EXPIRED : this._value;
  }
}
Expirable.EXPIRED = EXPIRED;
