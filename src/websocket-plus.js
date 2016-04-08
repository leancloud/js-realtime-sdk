// WebSocket with auto reconnecting feature, backup endpoint and EventEmitter interface.

import { tryAll } from './utils';

import { default as d } from 'debug';
import EventEmitter from 'eventemitter3';
import StateMachine from 'javascript-state-machine';

import WebSocket from 'ws';

const debug = d('LC:WebSocketPlus');

const HEARTBEAT_TIME = 60000;
const TIMEOUT_TIME = 180000;

class WebSocketPlus extends EventEmitter {
  constructor(getUrls, protocol) {
    debug('initializing WebSocketPlus');
    if (typeof WebSocket === 'undefined') {
      throw new Error('WebSocket is undefined. Polyfill is required in this runtime.');
    }
    super();
    if (typeof getUrls !== 'function') {
      this._getUrls = () => Promise.resolve(getUrls);
    } else {
      this._getUrls = getUrls;
    }
    this._protocol = protocol;
    this.init();
    this._createWs(this._getUrls, this._protocol).then(
      () => this.open(),
      error => this.throw(error)
    );
    this.__postponeTimers = this._postponeTimers.bind(this);
  }

  _createWs(getUrls, protocol) {
    return getUrls().then(wsUrls => {
      let urls = wsUrls;
      if (!(urls instanceof Array)) {
        urls = [urls];
      }
      return tryAll(
        urls.map(url => (resolve, reject) => {
          debug(`connect [${url}] ${protocol}`);
          const ws = protocol ? new WebSocket(
            url, protocol
          ) : new WebSocket(url);
          ws.binaryType = this.binaryType || 'blob';
          ws.onopen = () => resolve(ws);
          ws.onerror = error => {
            if (error instanceof Error) {
              return reject(error);
            }
            // in browser, error event is useless
            return reject(new Error(`Failed to connect [${url}]`));
          };
        })
      ).then(ws => {
        this._ws = ws;
        this._ws.onclose = this._handleClose.bind(this);
        this._ws.onmessage = this._handleMessage.bind(this);
        return ws;
      });
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
  onconnected() {
    this._startConnectionKeeper();
  }
  onleaveconnected() {
    this._stopConnectionKeeper();
  }
  ondisconnect() {
    debug('disconnect');
    this._destroyWs();
    this._retryCount = 0;
    this.emit('disconnect');
    this.retry();
  }
  onreconnect() {
    debug('reconnect');
    this.emit('reconnect');
  }
  onretry() {
    this._retryCount++;
    setTimeout(() => {
      if (this.is('offline')) {
        this._createWs(this._getUrls, this._protocol).then(
          () => this.reconnect(),
          () => this.retry()
        );
        debug(`retry [${this._retryCount}]`);
        this.emit('retry', this._retryCount);
      }
    }, this._retryCount * 3000);
  }
  onclose() {
    debug('close');
    this._ws.close();
  }
  onerror(event, from, to, error) {
    debug('error', error);
    this.emit('error', error);
  }

  ping() {
    if (this._ws.ping) {
      this._ws.ping();
    } else {
      console.warn(`The WebSocket implement does not support sending ping frame.
        Override ping method to use application defined ping/pong mechanism.`);
    }
  }

  _postponeTimers() {
    debug('_postponeTimers');
    this._clearTimers();
    this._heartbeatTimer = setInterval(() => {
      debug('ping');
      this.ping();
    }, HEARTBEAT_TIME);
    this._timeoutTimer = setTimeout(() => {
      debug('timeout');
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
    const addListener = this._ws.addListener || this._ws.addEventListener;
    addListener.call(this._ws, 'message', this.__postponeTimers);
    this._postponeTimers();
  }
  _stopConnectionKeeper() {
    debug('stop connection keeper');
    // websockets/ws#489
    const removeListener = this._ws.removeListener || this._ws.removeEventListener;
    removeListener.call(this._ws, 'message', this.__postponeTimers);
    this._clearTimers();
  }

  _handleClose(event) {
    debug(`ws closed [${event.code}] ${event.reason}`);
    // socket closed manually, ignore close event.
    if (this.isFinished()) return;
    this.handleClose(event);
  }
  handleClose() {
    // reconnect
    this.disconnect();
  }

  send(data) {
    debug('send', data);
    this._ws.send(data);
  }

  _handleMessage(event) {
    debug('message', event.data);
    this.handleMessage(event.data);
  }
  handleMessage(message) {
    this.emit('message', message);
  }
}

StateMachine.create({
  target: WebSocketPlus.prototype,
  initial: {
    state: 'initialized',
    event: 'init',
    defer: true,
  },
  terminal: 'closed',
  events: [{
    name: 'open',
    from: 'initialized',
    to: 'connected',
  }, {
    name: 'disconnect',
    from: 'connected',
    to: 'offline',
  }, {
    name: 'retry',
    from: 'offline',
    to: 'offline',
  }, {
    name: 'reconnect',
    from: 'offline',
    to: 'connected',
  }, {
    name: 'close',
    from: ['connected', 'offline'],
    to: 'closed',
  }, {
    name: 'throw',
    from: '*',
    to: 'error',
  }],
});

export default WebSocketPlus;
