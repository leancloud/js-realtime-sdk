import Message from './message';

export default class TypedMessage extends Message {
  constructor() {
    super({});
  }

  setText(text) {
    this.content.text = text;
    return this;
  }
  getText() {
    return this.content.text;
  }

  setAttrs(attrs) {
    this.content.attrs = attrs;
    return this;
  }
  getAttrs() {
    return this.content.attrs;
  }

  _getExtras() {
    return {
      _lctype: 0,
    };
  }

  toJSON(json) {
    return super.toJSON(Object.assign({
      _lctext: this.getText(),
      _lcattrs: this.getAttrs(),
    }, this._getExtras(), json));
  }

  static parse(json, message = new this()) {
    message
      .setText(json._lctext)
      .setAttrs(json._lcattrs);
    return super.parse(json, message);
  }
}
