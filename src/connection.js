import { Promise } from 'rsvp';
import * as Errors from './errors';

const debug = require('debug')('LC:Connection');
const EventEmitter = require('eventemitter3');
const StateMachine = require('javascript-state-machine');

const WebSocket = global.WebSocket || global.MozWebSocket || require('ws');
const HEARTBEAT_TIME = 60000;
const TIMEOUT_TIME = 180000;


class Connection extends EventEmitter {
  constructor(url, options) {
    debug(`initializing connection [${url}]`);
    super();
    this._url = url;
    this._options = Object.assign({
      pushUnread: true,
    }, options);
    this.init();
    this._createWs(url, this._options).then(
      () => this.open(),
      error => this.throw(error)
    );
  }

  _createWs(url, options) {
    let protocolsVersion = 1;
    if (options.pushUnread) {
      // 不推送离线消息，而是发送对话的未读通知
      protocolsVersion = 3;
    }
    const ws = this._ws = new WebSocket(
      url,
      `lc.protobuf.${protocolsVersion}`
    );
    ws.onclose = event => {
      debug(`ws closed [${event.code}] ${event.reason}`);
      // socket closed manully, ignore close event.
      if (this.isFinished()) return;
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
    ws.onmessage = event => this.handleMessage(event.data);
    return new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });
  }
  _destroyWs() {
    const ws = this._ws;
    if (!ws) return;
    ws.onopen = ws.onclose = ws.onerror = ws.onmessage = null;
    this._ws = null;
    ws.close();
  }

  onopen() {
    debug('open');
    this.emit('open');
  }
  onopened() {
    this._startConnectionKeeper();
  }
  onleaveopened() {
    this._stopConnectionKeeper();
  }
  onbeforedisconnect() {
    this._retryCount = 1;
  }
  ondisconnect() {
    debug('disconnect');
    this._destroyWs();
  }
  onretry() {
    debug(`retry [${this._retryCount}]`);
  }
  onbeforeretryfail() {
    this._retryCount++;
  }
  onretryfail() {
    debug('retry fail');
  }
  onreconnect() {
    debug('reconnect');
  }
  ondisconnected() {
    setTimeout(() => {
      if (this.is('disconnected')) {
        this.retry();
      }
    }, (this._retryCount - 1) * 3000);
  }
  onreconnecting() {
    this._createWs(this._url, this._options).then(
      () => this.reconnect(),
      error => this.retryfail(error)
    );
  }
  onclose() {
    this._ws.close();
  }
  onerror(event, from, to, error) {
    debug('error', error);
    this.emit('error', error);
  }

  _postponeTimers() {
    this._clearTimers();
    this._heartbeatTimer = setInterval(() => {
      debug('ping');
      this._ws.send('{}');
    }, HEARTBEAT_TIME);
    this._timeoutTimer = setTimeout(() => {
      this.disconnect();
    }, TIMEOUT_TIME);
  }
  _clearTimers() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
    }
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer);
    }
  }
  _startConnectionKeeper() {
    debug('start connection keeper');
    this._ws.addEventListener('message', this._postponeTimers);
    this._postponeTimers();
  }
  _stopConnectionKeeper() {
    debug('stop connection keeper');
    // websockets/ws#489
    const removeListener = this._ws.removeEventListener || this._ws.removeListener;
    removeListener.call(this._ws, 'message', this._postponeTimers);
    this._clearTimers();
  }

  handleMessage(data) {
    debug('message', data);
  }
}

StateMachine.create({
  target: Connection.prototype,
  initial: {
    state: 'initialized',
    event: 'init',
    defer: true,
  },
  terminal: 'closed',
  events: [{
    name: 'open',
    from: 'initialized',
    to: 'opened',
  }, {
    name: 'disconnect',
    from: 'opened',
    to: 'disconnected',
  }, {
    name: 'retry',
    from: 'disconnected',
    to: 'reconnecting',
  }, {
    name: 'reconnect',
    from: 'reconnecting',
    to: 'opened',
  }, {
    name: 'retryfail',
    from: 'reconnecting',
    to: 'disconnected',
  }, {
    name: 'close',
    from: ['opened', 'disconnected', 'reconnecting'],
    to: 'closed',
  }, {
    name: 'throw',
    from: '*',
    to: 'error',
  }],
});

export default Connection;
