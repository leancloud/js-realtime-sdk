import EventEmitter from 'eventemitter3';

export default class Client extends EventEmitter {
  constructor(id, options = {}, connection, props) {
    if (!(id === undefined || typeof id === 'string')) {
      throw new TypeError(`Client id [${id}] is not a String`);
    }
    super();
    Object.assign(this, {
      id,
      _connection: connection,
      options,
    }, props);
  }

  /**
   * @abstract
   */
  _dispatchMessage(message) {
    this.emit('message', message);
  }
}
