import d from 'debug';
import isPlainObject from 'lodash/isPlainObject';
import { applyMiddlewares } from './plugin';
import { ensureArray } from './utils';

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
  /**
   * 消息解析器
   * @param {Object} plugins 插件，在解析时会应用 beforeMessageParse 与 afterMessageParse Middleware。
   */
  constructor(plugins = {}) {
    this._plugins = plugins;
    this._messageClasses = [];
  }

  /**
   * 注册消息类
   *
   * @param  {Function | Function[]} messageClass 消息类，需要实现 {@link AVMessage} 接口，
   * 建议继承自 {@link TypedMessage}，也可以传入一个消息类数组。
   * @throws {TypeError} 如果 messageClass 没有实现 {@link AVMessage} 接口则抛出异常
   */
  register(messageClasses) {
    ensureArray(messageClasses).map(klass => this._register(klass));
  }

  _register(messageClass) {
    if (
      messageClass &&
      messageClass.parse &&
      messageClass.prototype &&
      messageClass.prototype.getPayload
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
  /**
   * 解析消息内容
   * @param {Object | string | any} target 消息内容，如果是字符串会尝试 parse 为 JSON。
   * @return {AVMessage} 解析后的消息
   * @throws {Error} 如果不匹配任何注册的消息则抛出异常
   */
  parse(content) {
    debug('parsing message: %O', content);
    // eslint-disable-next-line no-restricted-syntax
    for (const Klass of this._messageClasses) {
      const contentCopy = isPlainObject(content)
        ? Object.assign({}, content)
        : content;
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
          debug('parse result: %O', result);
          return result;
        }
      }
    }
    throw new Error('No Message Class matched');
  }
}
