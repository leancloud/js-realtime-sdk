import d from 'debug';
import values from 'lodash/values';
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
import { GenericCommand, CommandType, OpType } from '../proto/message';
import { trim, equalBuffer } from './utils';

const debug = d('LC:Connection');

const COMMAND_TIMEOUT = 20000;

const EXPIRE = Symbol('expire');

const isIdempotentCommand = command =>
  !(
    command.cmd === CommandType.direct ||
    (command.cmd === CommandType.session && command.op === OpType.open) ||
    (command.cmd === CommandType.conv &&
      (command.op === OpType.start ||
        command.op === OpType.update ||
        command.op === OpType.members))
  );

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
    super(getUrl, protocolString);
    this._protocolFormat = format;
    this._commands = {};
    this._serialId = 0;
  }

  async send(command, waitingForRespond = true) {
    let buffer;
    let serialId;
    if (waitingForRespond) {
      if (isIdempotentCommand(command)) {
        buffer = command.toArrayBuffer();
        const duplicatedCommand = values(this._commands).find(
          ({ buffer: targetBuffer, command: targetCommand }) =>
            targetCommand.cmd === command.cmd &&
            targetCommand.op === command.op &&
            equalBuffer(targetBuffer, buffer)
        );
        if (duplicatedCommand) {
          console.warn(
            `Duplicated command [cmd:${command.cmd} op:${command.op}] is throttled.`
          );
          return duplicatedCommand.promise;
        }
      }

      this._serialId += 1;
      serialId = this._serialId;
      command.i = serialId; // eslint-disable-line no-param-reassign
    }
    if (debug.enabled) debug('↑ %O sent', trim(command));

    let message;
    if (this._protocolFormat === 'proto2base64') {
      message = command.toBase64();
    } else if (command.toArrayBuffer) {
      message = command.toArrayBuffer();
    }
    if (!message) {
      throw new TypeError(`${command} is not a GenericCommand`);
    }

    super.send(message);

    if (!waitingForRespond) return undefined;
    const promise = new Promise((resolve, reject) => {
      this._commands[serialId] = {
        command,
        buffer,
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
    this._commands[serialId].promise = promise;
    return promise;
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
