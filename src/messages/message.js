import uuid from 'uuid';

export default class Message {
  constructor(content) {
    Object.assign(this, { content }, {
      id: uuid.v4(),
      cid: null,
      timestamp: Date.now(),
      from: undefined,
      needReceipt: false,
      transient: false,
    });
  }

  _setProps(props) {
    Object.assign(this, props);
    return this;
  }

  setNeedReceipt(needReceipt) {
    this.needReceipt = needReceipt;
  }

  setTransient(transient) {
    this.transient = transient;
  }

  toJSON(json = this.content) {
    return json;
  }

  static validate() {
    return true;
  }

  static parse(json, message) {
    return message || new this(json);
  }
}
