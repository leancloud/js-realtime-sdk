// WebSocket with auto reconnecting feature, backup endpoint and EventEmitter interface.

import { Promise } from 'rsvp';
import { tryAll } from './utils';

import { default as d } from 'debug';
import EventEmitter from 'eventemitter3';
import StateMachine from 'javascript-state-machine';

const debug = d('LC:WebSocketPlus');

const WebSocket = global.WebSocket || global.MozWebSocket || require('ws');
const HEARTBEAT_TIME = 60000;
const TIMEOUT_TIME = 180000;

class WebSocketPlus extends EventEmitter {
  constructor(getUrls, protocol) {
    debug(`initializing connection`);
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
        this._ws.onmessage = this.handleMessage.bind(this);
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
    setTimeout(() => {
      if (this.is('disconnected')) {
        this._createWs(this._getUrls, this._protocol).then(
          () => this.reconnect(),
          () => this.retry()
        );
        debug(`retry [${this._retryCount}]`);
        this.emit('retry', this._retryCount);
      }
    }, this._retryCount * 3000);
    this._retryCount++;
  }
  onclose() {
    debug('close');
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
    this._ws.addEventListener('message', this._postponeTimers.bind(this));
    this._postponeTimers();
  }
  _stopConnectionKeeper() {
    debug('stop connection keeper');
    // websockets/ws#489
    const removeListener = this._ws.removeEventListener || this._ws.removeListener;
    removeListener.call(this._ws, 'message', this._postponeTimers);
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

  handleMessage(event) {
    debug('message', event.data);
    this.emit('message', event.data);
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
    to: 'disconnected',
  }, {
    name: 'retry',
    from: 'disconnected',
    to: 'disconnected',
  }, {
    name: 'reconnect',
    from: 'disconnected',
    to: 'connected',
  }, {
    name: 'close',
    from: ['connected', 'disconnected'],
    to: 'closed',
  }, {
    name: 'throw',
    from: '*',
    to: 'error',
  }],
});

export default WebSocketPlus;
