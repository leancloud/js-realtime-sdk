import Message from './message';

export default class TypedMessage extends Message {
  constructor() {
    super({});
  }
  set text(text) {
    return this.setText(text);
  }
  get text() {
    return this.getText();
  }

  set attributes(attributes) {
    return this.setAttributes(attributes);
  }
  get attributes() {
    return this.getAttributes();
  }

  setText(text) {
    this.content.text = text;
    return this;
  }
  getText() {
    return this.content.text;
  }

  setAttributes(attributes) {
    this.content.attrs = attributes;
    return this;
  }
  getAttributes() {
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
      _lcattrs: this.getAttributes(),
    }, this._getExtras(), json));
  }

  static parse(json, message = new this()) {
    message
      .setText(json._lctext)
      .setAttributes(json._lcattrs);
    return super.parse(json, message);
  }
}
