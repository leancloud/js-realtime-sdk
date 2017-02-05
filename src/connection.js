import { default as d } from 'debug';
import protobuf from 'protobufjs/dist/light/protobuf';
import WebSocketPlus from './websocket-plus';
import { createError } from './error';
import { GenericCommand, CommandType } from '../proto/message';
import { trim, isWeapp, global } from './utils';

const { base64 } = protobuf.util;
const debug = d('LC:Connection');

const COMMAND_TIMEOUT = 20000;

export default class Connection extends WebSocketPlus {
  constructor(getUrl, { format, version }) {
    debug('initializing Connection');
    const protocolString = `lc.${format}.${version}`;
    if (!isWeapp) {
      super(getUrl, protocolString);
    } else {
      super(getUrl().then(urls => urls.map(url =>
        `${url}${url.indexOf('?') === -1 ? '?' : '&'}subprotocol=${encodeURIComponent(protocolString)}`
      )));
    }
    this._protocalFormat = format;
    this._commands = {};
    this._serialId = 0;
  }

  send(command, waitingForRespond = true) {
    let serialId;
    if (waitingForRespond) {
      this._serialId += 1;
      serialId = this._serialId;
      command.i = serialId; // eslint-disable-line no-param-reassign
    }
    debug('↑', trim(command), 'sent');

    let message;
    if (!GenericCommand.encode) throw new TypeError(`${command} is not a GenericCommand`);
    message = GenericCommand.encode(command).finish();
    if (this._protocalFormat === 'protobase64') {
      if (global.Buffer && message instanceof global.Buffer) {
        message = message.toString('base64');
      } else {
        message = base64.encode(message, 0, message.length);
      }
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
    let buffer;
    let message;
    try {
      if (this._protocalFormat === 'protobase64') {
        if (global.Buffer) {
          buffer = new Buffer(msg, 'base64');
        } else {
          buffer = new Uint8Array(base64.length(msg));
          base64.decode(msg, buffer, 0);
        }
      } else if (global.Buffer) {
        buffer = msg;
      } else {
        buffer = new Uint8Array(msg);
      }
      message = GenericCommand.decode(buffer);
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
    return this.send(GenericCommand.create({
      cmd: CommandType.echo,
    })).catch(error => debug('ping failed:', error));
  }
}
