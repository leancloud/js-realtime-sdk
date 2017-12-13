import d from 'debug';

const EXPIRED = Symbol('expired');
const debug = d('LC:Expirable');
export default class Expirable {
  constructor(value, ttl) {
    this.originalValue = value;
    if (typeof ttl === 'number') {
      this.expiredAt = Date.now() + ttl;
    }
  }

  get value() {
    const expired = this.expiredAt && this.expiredAt <= Date.now();
    if (expired) debug(`expired: ${this.originalValue}`);
    return expired ? EXPIRED : this.originalValue;
  }
}
Expirable.EXPIRED = EXPIRED;
