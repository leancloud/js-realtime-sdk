import WebSocketPlus from './websocket-plus';
import { GenericCommand, CommandType } from '../proto/message';
import { Promise } from 'rsvp';
import { default as d } from 'debug';
import { trim } from './utils';

const debug = d('LC:Connection');

const COMMAND_TIMEOUT = 20000;

export default class Connection extends WebSocketPlus {
  constructor(...args) {
    debug('initializing Connection');
    super(...args);
    this._commands = {};
    this._serialId = 0;
  }

  send(command, waitingForRespond = true) {
    const serialId = ++ this._serialId;
    command.i = serialId; // eslint-disable-line no-param-reassign
    debug(trim(command), 'sent');

    let message;
    if (command.toBuffer) {
      message = command.toBuffer();
    } else if (command.toArrayBuffer) {
      message = command.toArrayBuffer();
    } else {
      throw new TypeError(`${command} is not a GenericCommand`);
    }

    super.send(message);

    if (!waitingForRespond) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this._commands[serialId] = {
        resolve,
        reject,
      };
      setTimeout(
        () => {
          if (this._commands[serialId]) {
            debug(trim(command), 'timeout');
            reject(new Error('Command Timeout.'));
            delete this._commands[serialId];
          }
        },
        COMMAND_TIMEOUT
      );
    });
  }

  static _createError(message) {
    const {
      code, reason, appCode, detail,
      } = message.errorMessage;
    const error = new Error(reason || detail);
    return Object.assign(error, {
      code, appCode, detail,
    });
  }

  handleMessage(msg) {
    let message;
    try {
      message = GenericCommand.decode(msg);
      debug(trim(message), 'received');
    } catch (e) {
      console.warn('Decode message failed', msg);
    }
    this.emit('allmessage', message);
    const serialId = message.i;
    if (serialId) {
      if (this._commands[serialId]) {
        if (message.cmd === CommandType.error) {
          this
            ._commands[serialId]
            .reject(this.constructor._createError(message));
        } else {
          this
            ._commands[serialId]
            .resolve(message);
        }
        delete this._commands[serialId];
      } else {
        if (message.cmd === CommandType.error) {
          this.emit('error', this.constructor._createError(message));
        } else {
          this.emit('message', message);
        }
      }
    }
  }

  ping() {
    return this.send(new GenericCommand({
      cmd: 'echo',
    }));
  }
}
