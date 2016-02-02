import EventEmitter from 'eventemitter3';

export default class Client extends EventEmitter {
  constructor(id, connection) {
    super();
    Object.assign(this, {
      id,
      _connection: connection,
    });
  }
}
