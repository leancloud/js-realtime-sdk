import { default as d } from 'debug';
import WebSocketPlus from './websocket-plus';
import { createError } from './errors';
import { GenericCommand, CommandType } from '../proto/message';
import { trim } from './utils';

const debug = d('LC:Connection');

const COMMAND_TIMEOUT = 20000;

export default class Connection extends WebSocketPlus {
  constructor(getUrl, { format, version }) {
    debug('initializing Connection');
    const protocolString = `lc.${format}.${version}`;
    super(getUrl, protocolString);
    this._protocalFormat = format;
    this._commands = {};
    this._serialId = 0;
  }

  send(command, waitingForRespond = true) {
    let serialId;
    if (waitingForRespond) {
      serialId = ++this._serialId;
      command.i = serialId; // eslint-disable-line no-param-reassign
    }
    debug('↑', trim(command), 'sent');

    let message;
    if (this._protocalFormat === 'protobase64') {
      message = command.toBase64();
    } else if (command.toBuffer) {
      message = command.toBuffer();
    } else if (command.toArrayBuffer) {
      message = command.toArrayBuffer();
    }
    if (!message) {
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
            debug('✗', trim(command), 'timeout');
            reject(new Error('Command Timeout.'));
            delete this._commands[serialId];
          }
        },
        COMMAND_TIMEOUT
      );
    });
  }

  handleMessage(msg) {
    let message;
    try {
      message = GenericCommand.decode(msg);
      debug('↓', trim(message), 'received');
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
            .reject(createError(message.errorMessage));
        } else {
          this
            ._commands[serialId]
            .resolve(message);
        }
        delete this._commands[serialId];
      } else {
        console.warn(`Unexpected command received with serialId [${serialId}],
         which have timed out or never been requested.`);
      }
    } else if (message.cmd === CommandType.error) {
      this.emit('error', createError(message.errorMessage));
    } else {
      this.emit('message', message);
    }
  }

  ping() {
    return this.send(new GenericCommand({
      cmd: 'echo',
    })).catch(error => console.warn('ping failed:', error));
  }
}
