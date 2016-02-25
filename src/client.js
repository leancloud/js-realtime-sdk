import EventEmitter from 'eventemitter3';

export default class Client extends EventEmitter {
  constructor(id, connection, options = {}) {
    super();
    Object.assign(this, {
      id,
      _connection: connection,
      options,
    });
  }

  _dispatchMessage(message) {
    this.emit('message', message);
  }
}
