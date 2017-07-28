import d from 'debug';
import EventEmitter from 'eventemitter3';
import axios from 'axios';
import Connection from './connection';
import { ErrorCode, createError } from './error';
import { tap, Cache, trim, internal, ensureArray, isWeapp } from './utils';
import { applyDecorators, applyDispatcher } from './plugin';

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
      noBinary: isWeapp,
      ssl: true,
      server: process.env.SERVER,
    }, options);
    this._cache = new Cache('endpoints');
    internal(this).clients = new Set();
    this._plugins = [
      ...ensureArray(Realtime.__preRegisteredPlugins),
      ...ensureArray(options.plugins),
    ].reduce(
      (result, plugin) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const hook in plugin) {
          if ({}.hasOwnProperty.call(plugin, hook) && hook !== 'name') {
            if (plugin.name) {
              ensureArray(plugin[hook]).forEach((value) => {
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
    // onRealtimeCreate hook
    applyDecorators(this._plugins.onRealtimeCreate, this);
  }

  _open() {
    if (this._openPromise) return this._openPromise;

    let format = 'protobuf2';
    if (this._options.noBinary) {
      // 不发送 binary data，fallback to base64 string
      format = 'proto2base64';
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
      connection.on('open', () => resolve(connection));
      connection.on('error', reject);
      connection.on('message', this._dispatchCommand.bind(this));
      /**
       * 连接断开。
       * 连接断开可能是因为 SDK 进入了离线状态（see {@link Realtime#event:offline}），或长时间没有收到服务器心跳。
       * 连接断开后所有的网络操作都会失败，请在连接断开后禁用相关的 UI 元素。
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
       * 连接恢复正常。
       * 请重新启用在 {@link Realtime#event:disconnect} 事件中禁用的相关 UI 元素
       * @event Realtime#reconnect
       */

      /**
       * 客户端连接断开
       * @event IMClient#disconnect
       * @see Realtime#event:disconnect
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

      /**
       * 客户端进入离线状态。
       * 这通常意味着网络已断开，或者 {@link Realtime#pause} 被调用
       * @event Realtime#offline
       * @since 3.4.0
       */
      /**
       * 客户端恢复在线状态
       * 这通常意味着网络已恢复，或者 {@link Realtime#resume} 被调用
       * @event Realtime#online
       * @since 3.4.0
       */
      /**
       * 进入离线状态。
       * 这通常意味着网络已断开，或者 {@link Realtime#pause} 被调用
       * @event IMClient#offline
       * @since 3.4.0
       */
      /**
       * 恢复在线状态
       * 这通常意味着网络已恢复，或者 {@link Realtime#resume} 被调用
       * @event IMClient#online
       * @since 3.4.0
       */

      // event proxy
      ['disconnect', 'reconnect', 'retry', 'schedule', 'offline', 'online'].forEach(
        event => connection.on(event, (...payload) => {
          debug(`${event} event emitted. %O`, payload);
          this.emit(event, ...payload);
          if (event !== 'reconnect') {
            internal(this).clients.forEach((client) => {
              client.emit(event, ...payload);
            });
          }
        })
      );
      // override handleClose
      connection.handleClose = function handleClose(event) {
        const isFatal = [
          ErrorCode.APP_NOT_AVAILABLE,
          ErrorCode.INVALID_LOGIN,
          ErrorCode.INVALID_ORIGIN,
        ].some(errorCode => errorCode === event.code);
        if (isFatal) {
          // in these cases, SDK should throw.
          this.throw(createError(event));
        } else {
          // reconnect
          this.disconnect();
        }
      };
      internal(this).connection = connection;
    }).catch((error) => {
      delete this._openPromise;
      throw error;
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
    ).then((info) => {
      debug('endpoint info: %O', info);
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
            (route) => {
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
            features: isWeapp ? 'wechat' : undefined,
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
        `retrying not allowed when not disconnected. the connection is now ${connection.current}`
      );
    }
    return connection.retry();
  }
  /**
   * 暂停，使 SDK 进入离线状态。
   * 你可以在网络断开、应用进入后台等时刻调用该方法让 SDK 进入离线状态，离线状态下不会尝试重连。
   * 在浏览器中 SDK 会自动监听网络变化，因此无需手动调用该方法。
   *
   * @since 3.4.0
   * @see Realtime#event:offline
   */
  pause() {
    // 这个方法常常在网络断开、进入后台时被调用，此时 connection 可能没有建立或者已经 close。
    // 因此不像 retry，这个方法应该尽可能 loose
    const connection = internal(this).connection;
    if (!connection) return;
    if (connection.can('pause')) connection.pause();
  }
  /**
   * 恢复在线状态。
   * 你可以在网络恢复、应用回到前台等时刻调用该方法让 SDK 恢复在线状态，恢复在线状态后 SDK 会开始尝试重连。
   *
   * @since 3.4.0
   * @see Realtime#event:online
   */
  resume() {
    // 与 pause 一样，这个方法应该尽可能 loose
    const connection = internal(this).connection;
    if (!connection) return;
    if (connection.can('resume')) connection.resume();
  }

  _register(client) {
    internal(this).clients.add(client);
  }

  _deregister(client) {
    internal(this).clients.delete(client);
    if (internal(this).clients.size === 0) {
      this._close();
    }
  }

  _dispatchCommand(command) {
    return applyDispatcher(this._plugins.beforeCommandDispatch, [command, this])
      .then((shouldDispatch) => {
        // no plugin handled this command
        if (shouldDispatch) return debug('[WARN] Unexpected message received: %O', trim(command));
        return false;
      });
  }
}
