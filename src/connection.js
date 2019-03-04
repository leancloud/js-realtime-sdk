import d from 'debug';
import WebSocketPlus, {
  OPEN,
  DISCONNECT,
  RECONNECT,
  RETRY,
  SCHEDULE,
  OFFLINE,
  ONLINE,
  ERROR,
  MESSAGE,
} from './websocket-plus';
import { createError } from './error';
import { GenericCommand, CommandType } from '../proto/message';
import { trim, isWeapp } from './utils';

const debug = d('LC:Connection');

const COMMAND_TIMEOUT = 20000;

const EXPIRE = Symbol('expire');

export {
  OPEN,
  DISCONNECT,
  RECONNECT,
  RETRY,
  SCHEDULE,
  OFFLINE,
  ONLINE,
  ERROR,
  MESSAGE,
  EXPIRE,
};

export default class Connection extends WebSocketPlus {
  constructor(getUrl, { format, version }) {
    debug('initializing Connection');
    const protocolString = `lc.${format}.${version}`;
    if (!isWeapp) {
      super(getUrl, protocolString);
    } else {
      super(
        getUrl().then(urls =>
          urls.map(
            url =>
              `${url}${
                url.indexOf('?') === -1 ? '?' : '&'
              }subprotocol=${encodeURIComponent(protocolString)}`
          )
        )
      );
    }
    this._protocalFormat = format;
    this._commands = {};
    this._serialId = 0;
  }

  async send(command, waitingForRespond = true) {
    let serialId;
    if (waitingForRespond) {
      this._serialId += 1;
      serialId = this._serialId;
      command.i = serialId; // eslint-disable-line no-param-reassign
    }
    if (debug.enabled) debug('↑ %O sent', trim(command));

    let message;
    if (this._protocalFormat === 'proto2base64') {
      message = command.toBase64();
    } else if (command.toArrayBuffer) {
      message = command.toArrayBuffer();
    }
    if (!message) {
      throw new TypeError(`${command} is not a GenericCommand`);
    }

    super.send(message);

    if (!waitingForRespond) return undefined;
    return new Promise((resolve, reject) => {
      this._commands[serialId] = {
        resolve,
        reject,
        timeout: setTimeout(() => {
          if (this._commands[serialId]) {
            if (debug.enabled) debug('✗ %O timeout', trim(command));
            reject(
              createError({
                error: `Command Timeout [cmd:${command.cmd} op:${command.op}]`,
                name: 'COMMAND_TIMEOUT',
              })
            );
            delete this._commands[serialId];
          }
        }, COMMAND_TIMEOUT),
      };
    });
  }

  handleMessage(msg) {
    let message;
    try {
      message = GenericCommand.decode(msg);
      if (debug.enabled) debug('↓ %O received', trim(message));
    } catch (e) {
      console.warn('Decode message failed:', e.message, msg);
      return;
    }
    const serialId = message.i;
    if (serialId) {
      if (this._commands[serialId]) {
        clearTimeout(this._commands[serialId].timeout);
        if (message.cmd === CommandType.error) {
          this._commands[serialId].reject(createError(message.errorMessage));
        } else {
          this._commands[serialId].resolve(message);
        }
        delete this._commands[serialId];
      } else {
        console.warn(`Unexpected command received with serialId [${serialId}],
         which have timed out or never been requested.`);
      }
    } else {
      switch (message.cmd) {
        case CommandType.error: {
          this.emit(ERROR, createError(message.errorMessage));
          return;
        }
        case CommandType.goaway: {
          this.emit(EXPIRE);
          return;
        }
        default: {
          this.emit(MESSAGE, message);
        }
      }
    }
  }

  ping() {
    return this.send(
      new GenericCommand({
        cmd: CommandType.echo,
      })
    ).catch(error => debug('ping failed:', error));
  }
}
