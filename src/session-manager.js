import d from 'debug';
import { Expirable } from './utils';

const debug = d('LC:SessionManager');

export default class SessionManager {
  constructor({ refresh, onBeforeGetSessionToken } = {}) {
    this.refresh = refresh;
    this._onBeforeGetSessionToken = onBeforeGetSessionToken;
    this.setSessionToken(null, 0);
  }

  setSessionToken(token, ttl) {
    debug('set session token', token, ttl);
    const sessionToken = new Expirable(token, ttl * 1000);
    this._sessionToken = sessionToken;
    delete this._pendingSessionTokenPromise;
    return sessionToken;
  }

  async setSessionTokenAsync(promise) {
    const currentSessionToken = this._sessionToken;
    this._pendingSessionTokenPromise = promise.catch(error => {
      // revert, otherwise the following getSessionToken calls
      // will all be rejected
      this._sessionToken = currentSessionToken;
      throw error;
    });
    return this.setSessionToken(...(await this._pendingSessionTokenPromise));
  }

  async getSessionToken({ autoRefresh = true } = {}) {
    debug('get session token');
    if (this._onBeforeGetSessionToken) {
      this._onBeforeGetSessionToken(this);
    }
    const { value, originalValue } =
      this._sessionToken || (await this._pendingSessionTokenPromise);
    if (value === Expirable.EXPIRED && autoRefresh && this.refresh) {
      debug('refresh expired session token');
      const { value: newValue } = await this.setSessionTokenAsync(
        this.refresh(this, originalValue)
      );
      debug('session token', newValue);
      return newValue;
    }
    debug('session token', value);
    return value;
  }

  revoke() {
    if (this._sessionToken) this._sessionToken.expiredAt = -1;
  }
}
