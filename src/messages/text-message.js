import TypedMessage from './typed-message';

export default class TextMessage extends TypedMessage {
  constructor(text = '') {
    if (typeof text !== 'string') {
      throw new TypeError(`${text} is not a string`);
    }
    super();
    this.setText(text);
  }

  _getExtras() {
    return {
      _lctype: -1,
    };
  }

  static validate(json) {
    return json._lctype === -1;
  }

}
