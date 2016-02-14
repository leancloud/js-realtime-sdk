import WebSocketPlus from './websocket-plus';
import { GenericCommand } from '../proto/message';
import { Promise } from 'rsvp';
import { default as d } from 'debug';

const debug = d('LC:Connection');

const COMMAND_TIMEOUT = 30000;

export default class Connection extends WebSocketPlus {
  constructor(...args) {
    debug(`initializing Connection`);
    super(...args);
    this._commands = {};
    this._serialId = 0;
  }

  send(msg, waitingForRespond = true) {
    let message = msg;
    this._serialId ++;
    message.i = this._serialId;
    debug(message, 'sent');

    if (message.toArrayBuffer) {
      message = message.toArrayBuffer();
    } else if (message.toBuffer) {
      message = message.toBuffer();
    } else {
      throw new TypeError(`${message} is not a GenericCommand`);
    }

    super.send(message);

    if (!waitingForRespond) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this._commands[this._serialId] = {
        resolve,
        reject,
      };
      setTimeout(
        () => {
          if (this._commands[this._serialId]) {
            reject(new Error('Command Timeout.'));
          }
        },
        COMMAND_TIMEOUT
      );
    });
  }

  handleMessage(msg) {
    if (msg === '{}') return;
    let message;
    try {
      message = GenericCommand.decode(msg);
      debug(message, 'recieved');
    } catch (e) {
      console.warn('Decode message failed', msg);
    }
    this.emit('allmessage', message);
    const serialId = message.i;
    if (serialId) {
      if (this._commands[serialId]) {
        this._commands[serialId].resolve(message);
        delete this._commands[serialId];
      } else {
        this.emit('message', message);
      }
    }
  }

  ping() {
    this.send(new GenericCommand({
      // cmd: 'echo',
      cmd: 'session',
      op: 'open',
    }));
  }
}
