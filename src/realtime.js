import { default as d } from 'debug';
import EventEmitter from 'eventemitter3';
import axios from 'axios';
import uuid from 'uuid';
import Connection from './connection';
import * as Errors from './errors';
import { tap, Cache, trim, internal, ensureArray } from './utils';
import { applyDecorators } from './plugin';
import Conversation from './conversation';
import Client from './client';
import IMClient from './im-client';
import MessageParser from './message-parser';
import Message from './messages/message';
import TextMessage from './messages/text-message';

const debug = d('LC:Realtime');

const pushRouterCache = new Cache('push-router');

export default class Realtime extends EventEmitter {
  /**
   * @extends EventEmitter
   * @param  {Object} options
   * @param  {String} options.appId
   * @param  {String} [options.region='cn'] 节点 id
   * @param  {Boolean} [options.pushOfflineMessages=false] 启用推送离线消息模式（默认为发送未读消息通知模式）
   * @param  {Boolean} [options.noBinary=false] 设置 WebSocket 使用字符串格式收发消息（默认为二进制格式）。
   *                                            适用于 WebSocket 实现不支持二进制数据格式的情况（如 React Native）
   * @param  {Boolean} [options.ssl=true] 使用 wss 进行连接
   * @param  {Plugin[]} [options.plugins] 加载插件（since 3.1.0）
   */
  constructor(options) {
    debug('initializing Realtime');
    super();
    if (typeof options.appId !== 'string') {
      throw new TypeError(`appId [${options.appId}] is not a string`);
    }
    this._options = Object.assign({
      appId: undefined,
      region: 'cn',
      pushOfflineMessages: false,
      ssl: true,
    }, options);
    this._id = uuid.v4();
    this._cache = new Cache('endpoints');
    this._clients = {};
    this._plugins = ensureArray(options.plugins).reduce(
      (result, plugin) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const hook in plugin) {
          if ({}.hasOwnProperty.call(plugin, hook) && hook !== 'name') {
            if (plugin.name) {
              ensureArray(plugin[hook]).forEach(value => {
                // eslint-disable-next-line no-param-reassign
                value._pluginName = plugin.name;
              });
            }
            // eslint-disable-next-line no-param-reassign
            result[hook] = ensureArray(result[hook]).concat(plugin[hook]);
          }
        }
        return result;
      },
      {}
    );
    this._messageParser = new MessageParser(this._plugins);
    this.register([
      Message,
      TextMessage,
    ]);
    // onRealtimeCreate hook
    applyDecorators(this._plugins.onRealtimeCreate, this);
    // messageClasses alias
    this.register(ensureArray(this._plugins.messageClasses));
  }

  _open() {
    if (this._openPromise) return this._openPromise;

    let format = 'protobuf';
    if (this._options.noBinary) {
      // 不发送 binary data，fallback to base64 string
      format = 'protobase64';
    }
    let version = 3;
    if (this._options.pushOfflineMessages) {
      // 不推送离线消息，而是发送对话的未读通知
      version = 1;
    }
    const protocol = {
      format,
      version,
    };
    this._openPromise = new Promise((resolve, reject) => {
      debug('No connection established, create a new one.');
      const connection = new Connection(
        () => this._getEndpoints(this._options),
        protocol
      );
      connection.binaryType = 'arraybuffer';
      connection.on('open', () => resolve(connection));
      connection.on('error', reject);
      connection.on('message', this._dispatchMessage.bind(this));
      /**
       * 网络连接断开
       * @event Realtime#disconnect
       */
      /**
       * 计划在一段时间后尝试重新连接
       * @event Realtime#schedule
       * @param {Number} attempt 尝试重连的次数
       * @param {Number} delay 延迟的毫秒数
       */
      /**
       * 正在尝试重新连接
       * @event Realtime#retry
       * @param {Number} attempt 尝试重连的次数
       */
      /**
       * 网络连接恢复正常
       * @event Realtime#reconnect
       */

      /**
       * 客户端连接断开
       * @event IMClient#disconnect
       * @since 3.2.0
       */
      /**
       * 计划在一段时间后尝试重新连接
       * @event IMClient#schedule
       * @param {Number} attempt 尝试重连的次数
       * @param {Number} delay 延迟的毫秒数
       * @since 3.2.0
       */
      /**
       * 正在尝试重新连接
       * @event IMClient#retry
       * @param {Number} attempt 尝试重连的次数
       * @since 3.2.0
       */

      // event proxy
      ['disconnect', 'reconnect', 'retry', 'schedule'].forEach(
        event => connection.on(event, (...payload) => {
          debug(`${event} event emitted.`, ...payload);
          this.emit(event, ...payload);
          if (event !== 'reconnect') {
            Object.values(this._clients).forEach(client => {
              client.emit(event, ...payload);
            });
          }
        })
      );
      // override handleClose
      connection.handleClose = function handleClose(event) {
        // CAUTION: non-standard API, provided by core-js
        const fatalError = Array.find([
          Errors.APP_NOT_AVAILABLE,
          Errors.INVALID_LOGIN,
          Errors.INVALID_ORIGIN,
        ], error => error.code === event.code);
        if (fatalError) {
          // in these cases, SDK should throw.
          const error = new Error(`${fatalError.message || event.reason}`);
          error.code = event.code;
          this.throw(error);
        } else {
          // reconnect
          this.disconnect();
        }
      };
      internal(this).connection = connection;
    });

    return this._openPromise;
  }

  _getEndpoints(options) {
    return Promise.resolve(
      this._cache.get('endpoints') ||
      this
        .constructor
        ._fetchEndpointsInfo(options)
        .then(
          tap(info => this._cache.set('endpoints', info, info.ttl * 1000))
        )
    ).then(info => {
      debug('endpoint info:', info);
      return [info.server, info.secondary];
    });
  }

  static _fetchPushRouter({ appId, region }) {
    debug('fetch router');
    switch (region) {
      case 'cn': {
        const cachedPushRouter = pushRouterCache.get(appId);
        if (cachedPushRouter) {
          return Promise.resolve(cachedPushRouter);
        }
        return axios
          .get('https://app-router.leancloud.cn/1/route', {
            params: {
              appId,
            },
            timeout: 20000,
          })
          .then(
            res => res.data
          )
          .then(tap(debug))
          .then(
            route => {
              const pushRouter = route.push_router_server;
              if (!pushRouter) {
                throw new Error('push router not exists');
              }
              let ttl = route.ttl;
              if (typeof ttl !== 'number') {
                ttl = 3600;
              }
              pushRouterCache.set(appId, pushRouter, ttl * 1000);
              return pushRouter;
            }
          )
          .catch(() => 'router-g0-push.leancloud.cn');
      }
      case 'us':
        return Promise.resolve('router-a0-push.leancloud.cn');
      default:
        throw new Error(`Region [${region}] is not supported.`);
    }
  }

  static _fetchEndpointsInfo({ appId, region, ssl, server }) {
    debug('fetch endpoint info');
    return this._fetchPushRouter({ appId, region })
      .then(tap(debug))
      .then(router =>
        axios.get(`https://${router}/v1/route`, {
          params: {
            appId,
            secure: ssl,
            server,
            _t: Date.now(),
          },
          timeout: 20000,
        }).then(
          res => res.data
        ).then(tap(debug))
    );
  }

  _close() {
    if (this._openPromise) {
      this._openPromise.then(connection => connection.close());
    }
    delete this._openPromise;
  }

  /**
   * 手动进行重连。
   * SDK 在网络出现异常时会自动按照一定的时间间隔尝试重连，调用该方法会立即尝试重连并重置重连尝试计数器。
   * 只能在 `schedule` 事件之后，`retry` 事件之前调用，如果当前网络正常或者正在进行重连，调用该方法会抛异常。
   */
  retry() {
    const connection = internal(this).connection;
    if (!connection) {
      throw new Error('no connection established');
    }
    if (connection.cannot('retry')) {
      throw new Error(
        `retrying not allowed when not offline. the connection is now ${connection.current}`
      );
    }
    return connection.retry();
  }

  _register(client) {
    if (!(client instanceof Client)) {
      throw new TypeError(`${client} is not a Client`);
    }
    if (!client.id) {
      throw new Error('Client must have an id to be registered');
    }
    this._clients[client.id] = client;
  }

  _deregister(client) {
    if (!(client instanceof Client)) {
      throw new TypeError(`${client} is not a Client`);
    }
    if (!client.id) {
      throw new Error('Client must have an id to be deregistered');
    }
    delete this._clients[client.id];
    if (Object.getOwnPropertyNames(this._clients).length === 0) {
      this._close();
    }
  }

  _dispatchMessage(message) {
    if (message.peerId !== null) {
      const targetClient = this._clients[message.peerId];
      if (targetClient) {
        return Promise.resolve(targetClient)
          .then(client => client._dispatchMessage(message))
          .catch(debug);
      }
      return debug(
        '[WARN] Unexpected message received without any live client match',
        trim(message)
      );
    }
    return debug('[WARN] Unexpected message received without peerId', trim(message));
  }

  /**
   * 创建一个即时通讯客户端，多次创建相同 id 的客户端会返回同一个实例
   * @param  {String} [id] 客户端 id，如果不指定，服务端会随机生成一个
   * @param  {Object} [clientOptions] 详细参数 @see {@link IMClient}
   * @param  {String} [tag] 客户端类型标记，以支持单点登录功能
   * @return {Promise.<IMClient>}
   */
  createIMClient(id, clientOptions, tag) {
    const idIsString = typeof id === 'string';
    if (idIsString && this._clients[id] !== undefined) {
      return Promise.resolve(this._clients[id]);
    }
    const promise = this._open().then(connection => {
      const client = new IMClient(id, clientOptions, connection, {
        _messageParser: this._messageParser,
        _plugins: this._plugins,
      });
      connection.on('reconnect', () =>
        client._open(this._options.appId, tag, this._id, true)
          /**
           * 客户端连接恢复正常，该事件通常在 {@link Realtime#event:reconnect} 之后发生
           * @event IMClient#reconnect
           * @since 3.2.0
           */
          /**
           * 客户端重新登录发生错误（网络连接已恢复，但重新登录错误）
           * @event IMClient#reconnecterror
           * @since 3.2.0
           */
          .then(
            () => client.emit('reconnect'),
            error => client.emit('reconnecterror', error)
          )
      );
      internal(client)._eventemitter.on('close', () => this._deregister(client), this);
      return client._open(this._options.appId, tag, this._id)
        .then(() => {
          this._register(client);
          return client;
        });
    });
    if (idIsString) {
      this._clients[id] = promise;
    }
    return promise;
  }

  /**
   * 注册消息类
   *
   * 在接收消息、查询消息时，会按照消息类注册顺序的逆序依次尝试解析消息内容
   *
   * @param  {Function | Function[]} messageClass 消息类，需要实现 {@link AVMessage} 接口，
   *                     													建议继承自 {@link TypedMessage}
   * @throws {TypeError} 如果 messageClass 没有实现 {@link AVMessage} 接口则抛出异常
   */
  register(messageClass) {
    return ensureArray(messageClass).map(this._messageParser.register.bind(this._messageParser));
  }

  /**
   * 为 Conversation 定义一个新属性
   * @since 3.2.0
   * @static
   * @param {String} prop 属性名
   * @param {Object} [descriptor] 属性的描述符，参见 {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor#Description getOwnPropertyDescriptor#Description - MDN}，默认为该属性名对应的 Conversation 自定义属性的 getter/setter
   * @returns void
   * @example
   *
   * conversation.get('type');
   * conversation.set('type', 1);
   *
   * // equals to
   * Realtime.defineConversationProperty('type');
   * conversation.type;
   * conversation.type = 1;
   */
  static defineConversationProperty(prop, descriptor = {
    get() { return this.get(prop); },
    set(value) { this.set(prop, value); },
  }) {
    Object.defineProperty(Conversation.prototype, prop, descriptor);
  }
}
