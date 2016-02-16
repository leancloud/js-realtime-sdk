import Client from './client';
import {
  GenericCommand,
  SessionCommand,
} from '../proto/message';
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
    const command = new GenericCommand({
      cmd: 'session',
      op: 'open',
      appId,
      sessionMessage: new SessionCommand({
        ua: `js/${VERSION}`,
        r: isReconnect,
      }),
    });
    return this._send(command).then(resCommand => {
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
      op: 'query',
    });
    return this._send(command).then(
      () => {
        this.emit('close');
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
