import { Protocals, _Promise, EventEmitter } from './realtime';

const {
  CommandType,
  GenericCommand,
  AckCommand,
 } = Protocals;

const warn = error => console.warn(error.message);

export default class LiveQueryClient extends EventEmitter {
  constructor(appId, subscriptionId, connection) {
    super();
    this._appId = appId;
    this.id = subscriptionId;
    this._connection = connection;
    this._eventemitter = new EventEmitter();
    this._querys = new Set();
  }
  _send(cmd, ...args) {
    return this._connection.send(Object.assign(cmd, {
      appId: this._appId,
      installationId: this.id,
      service: 1,
    }), ...args);
  }
  _open() {
    return this._send(new GenericCommand({
      cmd: CommandType.login,
    }));
  }
  close() {
    return this._send(new GenericCommand({
      cmd: CommandType.logout,
    })).then(() => this._eventemitter.emit('close'));
  }
  register(liveQuery) {
    this._querys.add(liveQuery);
  }
  deregister(liveQuery) {
    this._querys.delete(liveQuery);
    if (!this._querys.size) this.close().catch(warn);
  }
  _dispatchCommand(command) {
    if (command.cmd !== CommandType.data) {
      this.emit('unhandledmessage', command);
      return _Promise.resolve();
    }
    return this._dispatchDataCommand(command);
  }
  _dispatchDataCommand({
    dataMessage: {
      ids, msg,
    },
  }) {
    this.emit('message', msg.map(({ data }) => JSON.parse(data)));
    // send ack
    const command = new GenericCommand({
      cmd: CommandType.ack,
      ackMessage: new AckCommand({
        ids,
      }),
    });
    return this._send(command, false).catch(warn);
  }
}
