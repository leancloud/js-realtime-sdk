// WebSocket with auto reconnecting feature, backup endpoint and EventEmitter interface.

import d from 'debug';
import EventEmitter from 'eventemitter3';
import StateMachine from 'javascript-state-machine';

import WebSocket from 'ws';

import { ensureArray, tryAll, global } from './utils';

const debug = d('LC:WebSocketPlus');

export const OPEN = 'open';
export const DISCONNECT = 'disconnect';
export const RECONNECT = 'reconnect';
export const RETRY = 'retry';
export const SCHEDULE = 'schedule';
export const OFFLINE = 'offline';
export const ONLINE = 'online';
export const ERROR = 'error';
export const MESSAGE = 'message';

const HEARTBEAT_TIME = 180000;
const TIMEOUT_TIME = 380000;

const DEFAULT_RETRY_STRATEGY = attempt => Math.min(1000 * 2 ** attempt, 300000);

const requireConnected = (target, name, descriptor) =>
  Object.assign({}, descriptor, {
    value: function requireConnectedWrapper(...args) {
      this.checkConnectionAvailability(name);
      return descriptor.value.call(this, ...args);
    },
  });

class WebSocketPlus extends EventEmitter {
  constructor(getUrls, protocol) {
    if (typeof WebSocket === 'undefined') {
      throw new Error(
        'WebSocket is undefined. Polyfill is required in this runtime.'
      );
    }
    super();
    this.init();
    this._protocol = protocol;
    Promise.resolve(typeof getUrls === 'function' ? getUrls() : getUrls)
      .then(ensureArray)
      .then(urls => {
        this._urls = urls;
        return this._open();
      })
      .then(() => {
        this.__postponeTimeoutTimer = this._postponeTimeoutTimer.bind(this);
        if (global.addEventListener) {
          this.__pause = () => {
            if (this.can('pause')) this.pause();
          };
          this.__resume = () => {
            if (this.can('resume')) this.resume();
          };
          global.addEventListener('offline', this.__pause);
          global.addEventListener('online', this.__resume);
        }
        this.open();
      })
      .catch(this.throw.bind(this));
  }

  _open() {
    return this._createWs(this._urls, this._protocol).then(ws => {
      const [first, ...reset] = this._urls;
      this._urls = [...reset, first];
      return ws;
    });
  }

  _createWs(urls, protocol) {
    return tryAll(
      urls.map(url => (resolve, reject) => {
        debug(`connect [${url}] ${protocol}`);
        const ws = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
        ws.binaryType = this.binaryType || 'arraybuffer';
        ws.onopen = () => resolve(ws);
        ws.onclose = error => {
          if (error instanceof Error) {
            return reject(error);
          }
          // in browser, error event is useless
          return reject(new Error(`Failed to connect [${url}]`));
        };
        ws.onerror = ws.onclose;
      })
    ).then(ws => {
      this._ws = ws;
      this._ws.onclose = this._handleClose.bind(this);
      this._ws.onmessage = this._handleMessage.bind(this);
      return ws;
    });
  }

  _destroyWs() {
    const ws = this._ws;
    if (!ws) return;
    ws.onopen = null;
    ws.onclose = null;
    ws.onerror = null;
    ws.onmessage = null;
    this._ws = null;
    ws.close();
  }

  // eslint-disable-next-line class-methods-use-this
  onbeforeevent(event, from, to, ...payload) {
    debug(`${event}: ${from} -> ${to}`, ...payload);
  }

  onopen() {
    this.emit(OPEN);
  }

  onconnected() {
    this._startConnectionKeeper();
  }

  onleaveconnected(event, from, to) {
    this._stopConnectionKeeper();
    this._destroyWs();
    if (to === 'offline' || to === 'disconnected') {
      this.emit(DISCONNECT);
    }
  }

  onpause() {
    this.emit(OFFLINE);
  }

  onbeforeresume() {
    this.emit(ONLINE);
  }

  onreconnect() {
    this.emit(RECONNECT);
  }

  ondisconnected(event, from, to, attempt = 0) {
    const delay = DEFAULT_RETRY_STRATEGY.call(null, attempt);
    debug(`schedule attempt=${attempt} delay=${delay}`);
    this.emit(SCHEDULE, attempt, delay);
    if (this.__scheduledRetry) {
      clearTimeout(this.__scheduledRetry);
    }
    this.__scheduledRetry = setTimeout(() => {
      if (this.is('disconnected')) {
        this.retry(attempt);
      }
    }, delay);
  }

  onretry(event, from, to, attempt = 0) {
    this.emit(RETRY, attempt);
    this._open().then(
      () => (this.can('reconnect') ? this.reconnect() : this._destroyWs()),
      () => this.can('fail') && this.fail(attempt + 1)
    );
  }

  onerror(event, from, to, error) {
    this.emit(ERROR, error);
  }

  onclose() {
    if (global.removeEventListener) {
      if (this.__pause) global.removeEventListener('offline', this.__pause);
      if (this.__resume) global.removeEventListener('online', this.__resume);
    }
  }

  checkConnectionAvailability(name = 'API') {
    if (!this.is('connected')) {
      const currentState = this.current;
      console.warn(
        `${name} should not be called when the connection is ${currentState}`
      );
      if (this.is('disconnected') || this.is('reconnecting')) {
        console.warn(
          'disconnect and reconnect event should be handled to avoid such calls.'
        );
      }
      throw new Error('Connection unavailable');
    }
  }

  // jsdoc-ignore-start
  @requireConnected
  // jsdoc-ignore-end
  _ping() {
    debug('ping');
    try {
      this.ping();
    } catch (error) {
      console.warn(`websocket ping error: ${error.message}`);
    }
  }

  ping() {
    if (this._ws.ping) {
      this._ws.ping();
    } else {
      console.warn(`The WebSocket implement does not support sending ping frame.
        Override ping method to use application defined ping/pong mechanism.`);
    }
  }

  _postponeTimeoutTimer() {
    debug('_postponeTimeoutTimer');
    this._clearTimeoutTimers();
    this._timeoutTimer = setTimeout(() => {
      debug('timeout');
      this.disconnect();
    }, TIMEOUT_TIME);
  }

  _clearTimeoutTimers() {
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer);
    }
  }

  _startConnectionKeeper() {
    debug('start connection keeper');
    this._heartbeatTimer = setInterval(this._ping.bind(this), HEARTBEAT_TIME);
    const addListener = this._ws.addListener || this._ws.addEventListener;
    addListener.call(this._ws, 'message', this.__postponeTimeoutTimer);
    addListener.call(this._ws, 'pong', this.__postponeTimeoutTimer);
    this._postponeTimeoutTimer();
  }

  _stopConnectionKeeper() {
    debug('stop connection keeper');
    // websockets/ws#489
    const removeListener =
      this._ws.removeListener || this._ws.removeEventListener;
    removeListener.call(this._ws, 'message', this.__postponeTimeoutTimer);
    removeListener.call(this._ws, 'pong', this.__postponeTimeoutTimer);
    this._clearTimeoutTimers();
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
    }
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

  // jsdoc-ignore-start
  @requireConnected
  // jsdoc-ignore-end
  send(data) {
    debug('send', data);
    this._ws.send(data);
  }

  _handleMessage(event) {
    debug('message', event.data);
    this.handleMessage(event.data);
  }

  handleMessage(message) {
    this.emit(MESSAGE, message);
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
  events: [
    {
      name: 'open',
      from: 'initialized',
      to: 'connected',
    },
    {
      name: 'disconnect',
      from: 'connected',
      to: 'disconnected',
    },
    {
      name: 'retry',
      from: 'disconnected',
      to: 'reconnecting',
    },
    {
      name: 'fail',
      from: 'reconnecting',
      to: 'disconnected',
    },
    {
      name: 'reconnect',
      from: 'reconnecting',
      to: 'connected',
    },
    {
      name: 'pause',
      from: ['connected', 'disconnected', 'reconnecting'],
      to: 'offline',
    },
    {},
    {
      name: 'resume',
      from: 'offline',
      to: 'disconnected',
    },
    {
      name: 'close',
      from: ['connected', 'disconnected', 'reconnecting', 'offline'],
      to: 'closed',
    },
    {
      name: 'throw',
      from: '*',
      to: 'error',
    },
  ],
});

export default WebSocketPlus;
