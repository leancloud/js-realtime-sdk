import EventEmitter from 'eventemitter3';

export default class Client extends EventEmitter {
  constructor(id, connection, options = {}) {
    if (!(id === undefined || typeof id === 'string')) {
      throw new TypeError(`Client id [${id}] is not a String`);
    }
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
