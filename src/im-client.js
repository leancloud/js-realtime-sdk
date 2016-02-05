import Client from './client';
import { GenericCommand, SessionCommand } from '../proto/message';
import { default as d } from 'debug';
import { version as VERSION } from '../package.json';

const debug = d('LC:IMClient');

export default class IMClient extends Client {
  constructor(...args) {
    super(...args);
  }

  _openSession(appId, isReconnect = false) {
    debug('open sessoin');
    const command = new GenericCommand({
      cmd: 'session',
      op: 'open',
      appId,
      peerId: this.id,
      sessionMessage: new SessionCommand({
        ua: 'js/' + VERSION,
        r: isReconnect,
      }),
    });
    debug(command);
    return this._connection.send(command);
  }
}
