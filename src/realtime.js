import WebSocketPlus from './websocket-plus';
import * as Errors from './errors';
import { Promise } from 'rsvp';
import { default as d } from 'debug';
import EventEmitter from 'eventemitter3';
import { default as superagentPromise } from 'superagent-promise';
import superagent from 'superagent';

const agent = superagentPromise(superagent, Promise);
const debug = d('LC:Realtime');

export default class Realtime extends EventEmitter {
  constructor(options) {
    debug('initializing Realtime');
    super();
    this._options = Object.assign({
      appId: undefined,
      appKey: undefined,
      region: 'cn',
      pushUnread: true,
      ssl: true,
    }, options);
    if (typeof this._options.appId !== 'string') {
      throw new TypeError(`appId [${this._options.appId}] is not a string`);
    }
    if (typeof this._options.appKey !== 'string') {
      throw new TypeError(`appKey is not a string`);
    }
  }

  _connect() {
    if (this._promise) return this._promise;

    let protocolsVersion = 1;
    if (this._options.pushUnread) {
      // 不推送离线消息，而是发送对话的未读通知
      protocolsVersion = 3;
    }
    const protocol = `lc.protobuf.${protocolsVersion}`;

    this._promise = new Promise((resolve, reject) => {
      const ws = new WebSocketPlus(
        () => this._getEndpoints(this._options),
        protocol
      );
      ws.on('open', () => resolve(this));
      ws.on('error', reject);
      // override handleClose
      ws.handleClose = function handleClose(event) {
        const fatalError = [
          Errors.APP_NOT_AVAILABLE,
          Errors.INVALID_LOGIN,
          Errors.INVALID_ORIGIN,
        ].find(error => error.code === event.code);
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

    return this._promise;
  }


  _getEndpoints(options) {
    // TODO: cache
    return this._fetchEndpointsInfo(options).then(info => {
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

    return agent.get(`${protocol}${router}`).query({
      appId,
      secure: ssl,
      _t: Date.now(),
    }).then(
      res => res.body
    );
  }

  createIMClient() {
    return this._connect();
  }

  createPushClient() {
    return this._connect();
  }
}
