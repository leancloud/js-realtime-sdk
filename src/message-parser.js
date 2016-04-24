import { default as d } from 'debug';
import isPlainObject from 'lodash/isPlainObject';

const debug = d('LC:MessageParser');

export default class MessageParser {
  constructor() {
    this._messageClasses = [];
  }

  register(messageClass) {
    if (
      messageClass &&
      messageClass.parse &&
      messageClass.prototype &&
      messageClass.prototype.toJSON
    ) {
      this._messageClasses.unshift(messageClass);
    } else {
      throw new TypeError('Invalid messageClass');
    }
  }

  parse(text) {
    debug('parsing message:', text);
    let content;
    try {
      content = JSON.parse(text);
    } catch (error) {
      content = text;
    }
    for (const Klass of this._messageClasses) {
      const contentCopy = isPlainObject(content) ? Object.assign({}, content) : content;
      let valid;
      let result;
      try {
        valid = Klass.validate(contentCopy);
      } catch (error) {
        // eslint-disable-line no-empty
      }
      if (valid) {
        try {
          result = Klass.parse(contentCopy);
        } catch (error) {
          console.warn('parsing a valid message content error', {
            error,
            Klass,
            content: contentCopy,
          });
        }
        if (result !== undefined) {
          debug('parse result:', result);
          return result;
        }
      }
    }
    throw new Error('No Message Class matched');
  }
}
