import Connection from './connection';
import * as Errors from './errors';
import { Promise } from 'rsvp';
import { default as d } from 'debug';
import EventEmitter from 'eventemitter3';
import { default as superagentPromise } from 'superagent-promise';
import superagent from 'superagent';
import { tap } from './utils';
import Client from './client';
import IMClient from './im-client';

const agent = superagentPromise(superagent, Promise);
const debug = d('LC:Realtime');

export default class Realtime extends EventEmitter {
  constructor(options) {
    debug('initializing Realtime');
    super();
    if (typeof options.appId !== 'string') {
      throw new TypeError(`appId [${options.appId}] is not a string`);
    }
    if (typeof options.appKey !== 'string') {
      throw new TypeError(`appKey is not a string`);
    }
    this._options = Object.assign({
      appId: undefined,
      appKey: undefined,
      region: 'cn',
      pushUnread: true,
      ssl: true,
    }, options);
    this._cache = {};
    this._clients = {};
  }

  _connect() {
    if (this._connectPromise) return this._connectPromise;

    let protocolsVersion = 1;
    if (this._options.pushUnread) {
      // 不推送离线消息，而是发送对话的未读通知
      protocolsVersion = 3;
    }
    const protocol = `lc.protobuf.${protocolsVersion}`;

    this._connectPromise = new Promise((resolve, reject) => {
      debug('No connection established, create a new one.');
      const connection = new Connection(
        () => this._getEndpoints(this._options),
        protocol
      );
      connection.binaryType = 'arraybuffer';
      connection.on('open', () => resolve(connection));
      connection.on('error', reject);
      // override handleClose
      connection.handleClose = function handleClose(event) {
        const fatalError = Array.find([
          Errors.APP_NOT_AVAILABLE,
          Errors.INVALID_LOGIN,
          Errors.INVALID_ORIGIN,
        ], error => error.code === event.code);
        if (fatalError) {
          // in these cases, SDK should throw.
          const error = new Error(`${fatalError.message || event.reason}`);
          error.code = event.code;
          this.throw(error);
        } else {
          // reconnect
          this.disconnect();
        }
      };
    });

    return this._connectPromise;
  }

  _getCache(key) {
    const cache = this._cache[key];
    if (cache) {
      const expired = cache.expiredAt && cache.expiredAt < Date.now();
      if (!expired) {
        return cache.value;
      }
    }
    return null;
  }

  _setCache(key, value, expiredTime) {
    const cache = this._cache[key] = {
      value,
    };
    if (typeof expiredTime === 'number') {
      cache.expiredAt = Date.now() + expiredTime;
    }
  }

  _getEndpoints(options) {
    return Promise.resolve(
      this._getCache('endpoints')
      || this._fetchEndpointsInfo(options).then(
        tap(info => this._setCache('endpoints', info, info.ttl))
      )
    )
    .then(info => {
      debug(`endpoint info:`, info);
      return [info.server, info.secondary];
    });
  }

  _fetchEndpointsInfo(options) {
    debug('fetch endpoint info');
    const {
      appId,
      region,
      ssl,
    } = options;
    let router;
    switch (region) {
      case 'cn':
        router = 'router-g0-push.leancloud.cn/v1/route';
        break;
      case 'us':
        router = 'router-a0-push.leancloud.cn/v1/route';
        break;
      default:
        throw new Error(`Region [${region}] is not supported.`);
    }
    const protocol = global.location ? '//' : 'https://';

    return agent
      .get(`${protocol}${router}`)
      .query({
        appId,
        secure: ssl,
        _t: Date.now(),
      })
      .timeout(20000)
      .then(
        res => res.body
      );
  }

  _disconnect() {
    if (this._connectPromise) {
      this._connectPromise.then(connection => connection.close());
    }
    delete this._connectPromise;
  }

  _register(client) {
    if (!(client instanceof Client)) {
      throw new TypeError(`${client} is not a Client`);
    }
    if (!client.id) {
      throw new Error('Client must have id to be registerd');
    }
    this._clients[client.id] = client;
    client.on('destroy', this._deregister.bind(this));
  }

  _deregister(client) {
    if (!(client instanceof Client)) {
      throw new TypeError(`${client} is not a Client`);
    }
    if (!client.id) {
      throw new Error('Client must have id to be unregisterd');
    }
    delete this._clients[client.id];
    if (Object.getOwnPropertyNames(this._clients).length === 0) {
      this._disconnect();
    }
  }

  createIMClient(id) {
    return this._connect().then(connection => {
      const client = new IMClient(id, connection);
      connection.on('reconnect', () => client._openSession(this._options.appId));
      return client._openSession(this._options.appId)
        .then(command => {
          const peerId = command.peerId;
          if (!peerId) {
            console.warn(`Unexpected session opend without peerId.`);
            return;
          }
          client.id = peerId;
          this._register(client);
        })
        .then(() => client);
    });
  }

  createPushClient() {
    return this._connect();
  }
}
