import EventEmitter from 'eventemitter3';

export default class Conversation extends EventEmitter {
  constructor(rawData) {
    super();
    this.id = rawData.objectId;
  }
}
