import uuid from 'uuid';

export default class Message {
  constructor(content, props) {
    Object.assign(this, { content }, {
      id: uuid.v4(),
      cid: null,
      timestamp: Date.now(),
      from: undefined,
      needReceipt: false,
      transient: false,
    });
    if (props) {
      this._setProps(props);
    }
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

  toJSON(content = this.content) {
    return content;
  }

  static validate() {
    return true;
  }

  static parse(content) {
    return new this(content);
  }
}
