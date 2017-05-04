/* eslint-disable max-len */

/**
 * 插件接口
 *
 * <p>
 * 插件是由一个或多个扩展点组成的字典。SDK 的扩展点可以分为两类：
 * <p>
 * 第一类扩展点是类实例化之后的回调，包括 <code>Realtime</code>、<code>IMClient</code> 与 <code>Conversation</code>。这些扩展点可以通过一个同步的 Decorator 进行扩展。Decorator 接受一个对应的实例并对其进行一些操作。
 * 特别的，由于注册自定义消息类这个需求特别的常用，额外定义一个 messageClasses 扩展点来做这件事情。
 * <p>
 * 第二类扩展点是在某些事件处理前、后可以注入逻辑的点。
 * 其中 <code>beforeMessageParse</code>，<code>afterMessageParse</code> 可以通过一个异步的 Middleware 进行扩展。Middleware 接受一个对象，返回一个同类型对象或同类型对象的 Promise。
 * <code>beforeMessageDispatch</code> 可以通过返回一个 boolean 类型的 shouldDispatch 值来控制是否要继续派发收到的消息。
 * <p>
 * 如果使用了多个插件，这些 hook 会按照插件数组的顺序依次执行。前一个 Middleware 的返回值会作为参数传给后一个 Middleware。
 *
 * @interface Plugin
 * @since 3.1.0
 */

/* eslint-enable max-len */

/**
 * 插件名称，用于在日志中显示异常的插件
 *
 * @name Plugin.name
 * @type string
 */

/**
 * 插件注册的消息类型
 *
 * @name Plugin.messageClasses
 * @type AVMessage[]
 */

/**
 * 在 Realtime 实例化后对其进行修饰。
 * <p>
 * 接受一个参数为 Realtime 实例。
 *
 * @name Plugin.onRealtimeCreate
 * @type Function
 */

/**
 * 在 IMClient 实例化后对其进行修饰。
 * <p>
 * 接受一个参数为 IMClient 实例。
 *
 * @name Plugin.onIMClientCreate
 * @type Function
 */

/**
 * 在 Conversation 实例化后对其进行修饰。
 * <p>
 * 接受一个参数为 Conversation 实例。
 * 需要注意的是，该扩展点并不是在 <code>{@link IMClient#createConversation}</code> 方法创建成功后调用的 hook，
 * 而是所有的 Conversation 实例化的时候（包括但不限于 query 时）调用的 hook。
 *
 * @name Plugin.onConversationCreate
 * @type Function
 */

/**
 * 在对消息进行 parse 之前，对原始消息进行修改。
 * <p>
 * 接受一个参数为原始消息，是某个消息 JSON 化（<code>message.toJSON()</code>）的返回值，一般是一个 JSON 对象。
 * 该方法需要返回一个 JSON 对象。如果这个结果是异步得到的，也可以返回一个 Promise(fulfilled with a JSON)。
 *
 * @name Plugin.beforeMessageParse
 * @type Function
 */

/**
 * 在对消息进行 parse 之后，对消息实例进行修改。
 * <p>
 * 接受一个参数为消息实例，一般是一个已注册的 Message 类或其子类的实例。
 * 该方法需要返回一个同类型的消息实例。如果这个结果是异步得到的，也可以返回一个 Promise。
 *
 * @name Plugin.afterMessageParse
 * @type Function
 */

/**
 * 在收到消息之后，派发消息之前，控制是否派发这条消息。
 * <p>
 * 接受参数为 message 与 conversation。
 * 该方法需要返回 boolean 类型的值，如果返回 false 则 SDK 不再派发这条消息，后续的 beforeMessageDispatch 也不会执行。
 * 如果这个结果是异步得到的，也可以返回一个 Promise。
 *
 * @name Plugin.beforeMessageDispatch
 * @type Function
 * @since 3.4.0
 */

import { ensureArray, tap } from './utils';

const checkType = middleware => (param) => {
  const { constructor } = param;
  return Promise.resolve(param).then(middleware).then(tap((result) => {
    if (result === undefined || result === null) {
      // eslint-disable-next-line max-len
      return console.warn(`Middleware[${middleware._pluginName || 'anonymous plugin'}:${middleware.name || 'anonymous middleware'}] param/return types not match. It returns ${result} while a ${param.constructor.name} expected.`);
    }
    if (!(result instanceof constructor)) {
      // eslint-disable-next-line max-len
      return console.warn(`Middleware[${middleware._pluginName || 'anonymous plugin'}:${middleware.name || 'anonymous middleware'}] param/return types not match. It returns a ${result.constructor.name} while a ${param.constructor.name} expected.`);
    }
    return 0;
  }));
};

export const applyDecorators = (decorators, target) => {
  if (decorators) {
    decorators.forEach((decorator) => {
      try {
        decorator(target);
      } catch (error) {
        if (decorator._pluginName) {
          error.message += `[${decorator._pluginName}]`;
        }
        throw error;
      }
    });
  }
};

export const applyMiddlewares = middlewares => target =>
  ensureArray(middlewares).reduce(
    (previousPromise, middleware) => previousPromise
      .then(checkType(middleware))
      .catch((error) => {
        if (middleware._pluginName) {
          // eslint-disable-next-line no-param-reassign
          error.message += `[${middleware._pluginName}]`;
        }
        throw error;
      }),
    Promise.resolve(target)
  );

export const applyDispatcher = (dispatchers, payload) =>
  ensureArray(dispatchers).reduce(
    (resultPromise, dispatcher) => resultPromise.then(shouldDispatch =>
      (shouldDispatch === false ? false : dispatcher(...payload))
    ).catch((error) => {
      if (dispatcher._pluginName) {
        // eslint-disable-next-line no-param-reassign
        error.message += `[${dispatcher._pluginName}]`;
      }
      throw error;
    }), Promise.resolve(true)
  );
