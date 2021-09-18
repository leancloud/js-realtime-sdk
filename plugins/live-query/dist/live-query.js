(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leancloud-realtime/core')) :
  typeof define === 'function' && define.amd ? define('live-query', ['exports', 'leancloud-realtime/core'], factory) :
  (global = global || self, factory(global.AV = global.AV || {}, global.AV));
}(this, (function (exports, core) { 'use strict';

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  /* eslint-disable import/no-unresolved */
  var Protocols = core.Protocols || core.Protocals;

  if (!Protocols) {
    throw new Error('LeanCloud Realtime SDK not installed');
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var inheritsLoose = _inheritsLoose;

  var CommandType = Protocols.CommandType,
      GenericCommand = Protocols.GenericCommand,
      AckCommand = Protocols.AckCommand;

  var warn = function warn(error) {
    return console.warn(error.message);
  };

  var LiveQueryClient = /*#__PURE__*/function (_EventEmitter) {
    inheritsLoose(LiveQueryClient, _EventEmitter);

    function LiveQueryClient(appId, subscriptionId, connection) {
      var _this;

      _this = _EventEmitter.call(this) || this;
      _this._appId = appId;
      _this.id = subscriptionId;
      _this._connection = connection;
      _this._eventemitter = new core.EventEmitter();
      _this._querys = new Set();
      return _this;
    }

    var _proto = LiveQueryClient.prototype;

    _proto._send = function _send(cmd) {
      var _this$_connection;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return (_this$_connection = this._connection).send.apply(_this$_connection, [Object.assign(cmd, {
        appId: this._appId,
        installationId: this.id,
        service: 1
      })].concat(args));
    };

    _proto._open = function _open() {
      return this._send(new GenericCommand({
        cmd: CommandType.login
      }));
    };

    _proto.close = function close() {
      var _ee = this._eventemitter;

      _ee.emit('beforeclose');

      return this._send(new GenericCommand({
        cmd: CommandType.logout
      })).then(function () {
        return _ee.emit('close');
      });
    };

    _proto.register = function register(liveQuery) {
      this._querys.add(liveQuery);
    };

    _proto.deregister = function deregister(liveQuery) {
      var _this2 = this;

      this._querys["delete"](liveQuery);

      setTimeout(function () {
        if (!_this2._querys.size) _this2.close()["catch"](warn);
      }, 0);
    };

    _proto._dispatchCommand = function _dispatchCommand(command) {
      if (command.cmd !== CommandType.data) {
        this.emit('unhandledmessage', command);
        return core.Promise.resolve();
      }

      return this._dispatchDataCommand(command);
    };

    _proto._dispatchDataCommand = function _dispatchDataCommand(_ref) {
      var _ref$dataMessage = _ref.dataMessage,
          ids = _ref$dataMessage.ids,
          msg = _ref$dataMessage.msg;
      this.emit('message', msg.map(function (_ref2) {
        var data = _ref2.data;
        return JSON.parse(data);
      })); // send ack

      var command = new GenericCommand({
        cmd: CommandType.ack,
        ackMessage: new AckCommand({
          ids: ids
        })
      });
      return this._send(command, false)["catch"](warn);
    };

    return LiveQueryClient;
  }(core.EventEmitter);

  var finalize = function finalize(callback) {
    return [// eslint-disable-next-line no-sequences
    function (value) {
      return callback(), value;
    }, function (error) {
      callback();
      throw error;
    }];
  };

  var onRealtimeCreate = function onRealtimeCreate(realtime) {
    /* eslint-disable no-param-reassign */
    realtime._liveQueryClients = {};

    realtime.createLiveQueryClient = function (subscriptionId) {
      var _realtime$_open$then;

      if (realtime._liveQueryClients[subscriptionId] !== undefined) {
        return core.Promise.resolve(realtime._liveQueryClients[subscriptionId]);
      }

      var promise = (_realtime$_open$then = realtime._open().then(function (connection) {
        var client = new LiveQueryClient(realtime._options.appId, subscriptionId, connection);
        connection.on('reconnect', function () {
          return client._open().then(function () {
            return client.emit('reconnect');
          }, function (error) {
            return client.emit('reconnecterror', error);
          });
        });

        client._eventemitter.on('beforeclose', function () {
          delete realtime._liveQueryClients[client.id];
        }, realtime);

        client._eventemitter.on('close', function () {
          realtime._deregister(client);
        }, realtime);

        return client._open().then(function () {
          realtime._liveQueryClients[client.id] = client;

          realtime._register(client);

          return client;
        });
      })).then.apply(_realtime$_open$then, toConsumableArray(finalize(function () {
        if (realtime._deregisterPending) realtime._deregisterPending(promise);
      })));

      realtime._liveQueryClients[subscriptionId] = promise;
      if (realtime._registerPending) realtime._registerPending(promise);
      return promise;
    };
    /* eslint-enable no-param-reassign */

  };

  var beforeCommandDispatch = function beforeCommandDispatch(command, realtime) {
    var isLiveQueryCommand = command.installationId && command.service === 1;
    if (!isLiveQueryCommand) return true;
    var targetClient = realtime._liveQueryClients[command.installationId];

    if (targetClient) {
      targetClient._dispatchCommand(command)["catch"](function (error) {
        return console.warn(error);
      });
    } else {
      console.warn('Unexpected message received without any live client match: %O', command);
    }

    return false;
  }; // eslint-disable-next-line import/prefer-default-export


  var LiveQueryPlugin = {
    name: 'leancloud-realtime-plugin-live-query',
    onRealtimeCreate: onRealtimeCreate,
    beforeCommandDispatch: beforeCommandDispatch
  };

  exports.LiveQueryPlugin = LiveQueryPlugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=live-query.js.map
