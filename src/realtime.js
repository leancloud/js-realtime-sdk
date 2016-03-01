import Connection from './connection';
import * as Errors from './errors';
import { Promise } from 'rsvp';
import { default as d } from 'debug';
import EventEmitter from 'eventemitter3';
import { default as superagentPromise } from 'superagent-promise';
import superagent from 'superagent';
import { tap, Cache, trim } from './utils';
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
      throw new TypeError('appKey is not a string');
    }
    this._options = Object.assign({
      appId: undefined,
      appKey: undefined,
      region: 'cn',
      pushUnread: true,
      ssl: true,
    }, options);
    this._cache = new Cache('endpoints');
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
      connection.on('message', this._dispatchMessage.bind(this));
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

  _getEndpoints(options) {
    return Promise.resolve(
      this._cache.get('endpoints') ||
      this
        .constructor
        ._fetchEndpointsInfo(options)
        .then(
          tap(info => this._cache.set('endpoints', info, info.ttl))
        )
    )
    .then(info => {
      debug('endpoint info:', info);
      return [info.server, info.secondary];
    });
  }

  static _fetchEndpointsInfo(options) {
    debug('fetch endpoint info');
    const {
      appId,
      region,
      ssl,
      _debug,
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
        debug: _debug,
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
      throw new Error('Client must have an id to be registered');
    }
    this._clients[client.id] = client;
  }

  _deregister(client) {
    if (!(client instanceof Client)) {
      throw new TypeError(`${client} is not a Client`);
    }
    if (!client.id) {
      throw new Error('Client must have an id to be deregistered');
    }
    delete this._clients[client.id];
    if (Object.getOwnPropertyNames(this._clients).length === 0) {
      this._disconnect();
    }
  }

  _dispatchMessage(message) {
    if (message.peerId !== null) {
      const client = this._clients[message.peerId];
      if (client) {
        return client._dispatchMessage(message);
      }
      return debug(
        '[WARN] Unexpected message received without any live client match',
        trim(message)
      );
    }
    return debug('[WARN] Unexpected message received without peerId', trim(message));
  }

  createIMClient(id, options) {
    if (id) {
      if (this._clients[id] !== undefined) {
        return Promise.reject(new Error(`IMClient[${id}] is already created`));
      }
      this._clients[id] = null;
    }
    return this._connect().then(connection => {
      const client = new IMClient(id, connection, options);
      connection.on('reconnect', () => client._open(this._options.appId, true));
      client.on('close', () => this._deregister(client), this);
      return client._open(this._options.appId)
        .then(() => {
          this._register(client);
          return client;
        });
    });
  }

  createPushClient() {
    return this._connect();
  }
}
