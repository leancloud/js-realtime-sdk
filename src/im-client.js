import Client from './client';
import {
  GenericCommand,
  SessionCommand,
} from '../proto/message';
import { Promise } from 'rsvp';
import { tap } from './utils';
import { default as d } from 'debug';
import { version as VERSION } from '../package.json';

const debug = d('LC:IMClient');

export default class IMClient extends Client {
  _send(cmd) {
    const command = cmd;
    if (this.id) {
      command.peerId = this.id;
    }
    return this._connection.send(command);
  }

  _open(appId, isReconnect = false) {
    debug('open sessoin');
    return Promise.resolve(new GenericCommand({
      cmd: 'session',
      op: 'open',
      appId,
      sessionMessage: new SessionCommand({
        ua: `js/${VERSION}`,
        r: isReconnect,
      }),
    }))
    .then(cmd => {
      const command = cmd;
      if (this.options.signatureFactory) {
        debug(`call signatureFactory with [${this.id}]`);
        return Promise.resolve()
          .then(() => this.options.signatureFactory(this.id))
          .then(tap(signatureResult => debug('signatureResult', signatureResult)))
          .then((signatureResult = {}) => {
            const {
              signature,
              timestamp,
              nonce,
            } = signatureResult;
            if (typeof signature !== 'string'
                || typeof timestamp !== 'number'
                || typeof nonce !== 'string') {
              throw new Error('malformed signature');
            }
            Object.assign(command.sessionMessage, {
              s: signature,
              t: timestamp,
              n: nonce,
            });
            return command;
          }, error => {
            debug(error);
            throw new Error(`signitureFactory error: ${error.message}`);
          });
      }
      return command;
    })
    .then(this._send.bind(this))
    .then(resCommand => {
      const peerId = resCommand.peerId;
      if (!peerId) {
        console.warn(`Unexpected session opend without peerId.`);
        return;
      }
      this.id = peerId;
    });
  }

  close() {
    debug('close sessoin');
    const command = new GenericCommand({
      cmd: 'session',
      op: 'close',
    });
    return this._send(command).then(
      () => {
        this.emit('close', {
          code: 0,
        });
      }
    );
  }

  ping(ids) {
    debug('ping');
    if (!(ids instanceof Array)) {
      throw new TypeError(`ids ${ids} is not an Array`);
    }
    const command = new GenericCommand({
      cmd: 'session',
      op: 'query',
      sessionMessage: new SessionCommand({
        sessionPeerIds: ids,
      }),
    });
    return this._send(command)
      .then(resCommand => resCommand.sessionMessage.onlineSessionPeerIds);
  }
}
