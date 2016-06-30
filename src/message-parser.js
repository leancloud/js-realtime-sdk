import { default as d } from 'debug';
import isPlainObject from 'lodash/isPlainObject';
import { applyMiddlewares } from './plugin';

const debug = d('LC:MessageParser');

const tryParseJson = (target, key, descriptor) => {
  const fn = descriptor.value;
  // eslint-disable-next-line no-param-reassign
  descriptor.value = function wrapper(param) {
    let content;
    if (typeof param !== 'string') {
      content = param;
    } else {
      try {
        content = JSON.parse(param);
      } catch (error) {
        content = param;
      }
    }
    return fn.call(this, content);
  };
};

const applyPlugins = (target, key, descriptor) => {
  const fn = descriptor.value;
  // eslint-disable-next-line no-param-reassign
  descriptor.value = function wrapper(json) {
    return Promise.resolve(json)
      .then(applyMiddlewares(this._plugins.beforeMessageParse))
      .then(decoratedJson => fn.call(this, decoratedJson))
      .then(applyMiddlewares(this._plugins.afterMessageParse));
  };
};

export default class MessageParser {
  constructor(plugins = {}) {
    this._plugins = plugins;
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

  // jsdoc-ignore-start
  @tryParseJson
  @applyPlugins
  // jsdoc-ignore-end
  parse(content) {
    debug('parsing message:', content);
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
