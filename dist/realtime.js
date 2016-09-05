'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Object$defineProperty = _interopDefault(require('babel-runtime/core-js/object/define-property'));
var _Object$getOwnPropertyNames = _interopDefault(require('babel-runtime/core-js/object/get-own-property-names'));
var _Array$find = _interopDefault(require('babel-runtime/core-js/array/find'));
var _Object$values = _interopDefault(require('babel-runtime/core-js/object/values'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var d = _interopDefault(require('debug'));
var EventEmitter = _interopDefault(require('eventemitter3'));
var axios = _interopDefault(require('axios'));
var uuid = _interopDefault(require('uuid'));
var _Object$getOwnPropertyDescriptor = _interopDefault(require('babel-runtime/core-js/object/get-own-property-descriptor'));
var StateMachine = _interopDefault(require('javascript-state-machine'));
var WebSocket = _interopDefault(require('ws'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _WeakMap = _interopDefault(require('babel-runtime/core-js/weak-map'));
var _toConsumableArray = _interopDefault(require('babel-runtime/helpers/toConsumableArray'));
var _Set = _interopDefault(require('babel-runtime/core-js/set'));
var _Array$from = _interopDefault(require('babel-runtime/core-js/array/from'));
var _defineProperty = _interopDefault(require('babel-runtime/helpers/defineProperty'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var isPlainObject = _interopDefault(require('lodash/isPlainObject'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _Symbol = _interopDefault(require('babel-runtime/core-js/symbol'));
var protobufLight = _interopDefault(require('protobufjs/dist/protobuf-light'));
var _getIterator = _interopDefault(require('babel-runtime/core-js/get-iterator'));
var _objectWithoutProperties = _interopDefault(require('babel-runtime/helpers/objectWithoutProperties'));
var isEmpty = _interopDefault(require('lodash/isEmpty'));
var cloneDeep = _interopDefault(require('lodash/cloneDeep'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _slicedToArray = _interopDefault(require('babel-runtime/helpers/slicedToArray'));
var throttle = _interopDefault(require('lodash/throttle'));
var _Object$freeze = _interopDefault(require('babel-runtime/core-js/object/freeze'));

var EXPIRED = _Symbol('expired');
var debug$3 = d('LC:Expirable');

var Expirable = function () {
  function Expirable(value, ttl) {
    _classCallCheck(this, Expirable);

    this._value = value;
    if (typeof ttl === 'number') {
      this.expiredAt = Date.now() + ttl;
    }
  }

  _createClass(Expirable, [{
    key: 'value',
    get: function get() {
      var expired = this.expiredAt && this.expiredAt < Date.now();
      if (expired) debug$3('expired: ' + this._value);
      return expired ? EXPIRED : this._value;
    }
  }]);

  return Expirable;
}();

Expirable.EXPIRED = EXPIRED;

var debug$4 = d('LC:Cache');

var Cache = function () {
  function Cache() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'anonymous' : arguments[0];

    _classCallCheck(this, Cache);

    this.name = name;
    this._map = {};
  }

  Cache.prototype.get = function get(key) {
    var cache = this._map[key];
    if (cache) {
      var value = cache.value;
      if (value !== Expirable.EXPIRED) {
        debug$4('[' + this.name + '] hit: ' + key + ' ' + cache.value);
        return cache.value;
      }
      delete this._map[key];
    }
    debug$4('[' + this.name + '] missed: ' + key);
    return null;
  };

  Cache.prototype.set = function set(key, value, ttl) {
    debug$4('[' + this.name + '] set: ' + key + ' ' + value + ' ' + ttl);
    this._map[key] = new Expirable(value, ttl);
  };

  return Cache;
}();

var tryAll = function tryAll(promiseConstructors) {
  var promise = new _Promise(promiseConstructors[0]);
  if (promiseConstructors.length === 1) {
    return promise;
  }
  return promise.catch(function () {
    return tryAll(promiseConstructors.slice(1));
  });
};

var tap = function tap(interceptor) {
  return function (value) {
    return interceptor(value), value;
  };
};

var decodeDate = function decodeDate(date) {
  if (!date) return date;
  if (typeof date === 'string') {
    return new Date(date);
  }
  if (date.__type === 'Date' && date.iso) {
    return new Date(date.iso);
  }
  return date;
};

var keyRemap = function keyRemap(keymap, obj) {
  return _Object$keys(obj).reduce(function (newObj, key) {
    var newKey = keymap[key] || key;
    return _Object$assign(newObj, _defineProperty({}, newKey, obj[key]));
  }, {});
};

var isIE10 = global.navigator && global.navigator.userAgent && global.navigator.userAgent.indexOf('MSIE 10.') !== -1;

/* eslint-disable no-proto */
var getStaticProperty = function getStaticProperty(klass, property) {
  return klass[property] || (klass.__proto__ ? getStaticProperty(klass.__proto__, property) : undefined);
};
/* eslint-enable no-proto */

var union = function union(a, b) {
  return _Array$from(new _Set([].concat(_toConsumableArray(a), _toConsumableArray(b))));
};
var difference = function difference(a, b) {
  return _Array$from(function (bSet) {
    return new _Set(a.filter(function (x) {
      return !bSet.has(x);
    }));
  }(new _Set(b)));
};

var map = new _WeakMap();

// protected property helper
var internal = function internal(object) {
  if (!map.has(object)) {
    map.set(object, {});
  }
  return map.get(object);
};

// debug utility
var removeNull = function removeNull(obj) {
  if (!isPlainObject(obj)) return obj;
  var object = _Object$assign({}, obj);
  // eslint-disable-next-line no-restricted-syntax
  for (var prop in object) {
    if ({}.hasOwnProperty.call(object, prop)) {
      var value = object[prop];
      if (value === null) {
        delete object[prop];
      } else {
        object[prop] = removeNull(value);
      }
    }
  }
  return object;
};
var trim = function trim(message) {
  return removeNull(JSON.parse(_JSON$stringify(message)));
};

var ensureArray = function ensureArray(target) {
  if (Array.isArray(target)) {
    return target;
  }
  if (target === undefined || target === null) {
    return [];
  }
  return [target];
};

var setValue = function setValue(target, key, value) {
  // '.' is not allowed in Class keys, escaping is not in concern now.
  var segs = key.split('.');
  var lastSeg = segs.pop();
  var currentTarget = target;
  segs.forEach(function (seg) {
    if (currentTarget[seg] === undefined) currentTarget[seg] = {};
    currentTarget = currentTarget[seg];
  });
  currentTarget[lastSeg] = value;
  return target;
};

var _class;
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

// WebSocket with auto reconnecting feature, backup endpoint and EventEmitter interface.

var debug$2 = d('LC:WebSocketPlus');

var HEARTBEAT_TIME = 60000;
var TIMEOUT_TIME = 180000;

var DEFAULT_RETRY_STRATEGY = function DEFAULT_RETRY_STRATEGY(attempt) {
  return Math.min(1000 << attempt, 300000);
};

var requireConnected = function requireConnected(target, name, descriptor) {
  return _Object$assign({}, descriptor, {
    value: function requireConnectedWrapper() {
      var _descriptor$value;

      if (!this.is('connected')) {
        var currentState = this.current;
        console.warn(name + ' should not be called when the connection is ' + currentState);
        if (this.is('offline') || this.is('reconnecting')) {
          console.warn('disconnect and reconnect event should be handled to avoid such calls.');
        }
        throw new Error('Connection unavailable');
      }

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_descriptor$value = descriptor.value).call.apply(_descriptor$value, [this].concat(args));
    }
  });
};

var WebSocketPlus = (_class = function (_EventEmitter) {
  _inherits(WebSocketPlus, _EventEmitter);

  function WebSocketPlus(getUrls, protocol) {
    _classCallCheck(this, WebSocketPlus);

    debug$2('initializing WebSocketPlus');
    if (typeof WebSocket === 'undefined') {
      throw new Error('WebSocket is undefined. Polyfill is required in this runtime.');
    }

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    if (typeof getUrls !== 'function') {
      _this._getUrls = function () {
        return _Promise.resolve(getUrls);
      };
    } else {
      _this._getUrls = getUrls;
    }
    _this._protocol = protocol;
    _this.init();
    _this._createWs(_this._getUrls, _this._protocol).then(function () {
      return _this.open();
    }, function (error) {
      return _this.throw(error);
    }).catch(_this.throw.bind(_this));
    _this.__postponeTimers = _this._postponeTimers.bind(_this);
    return _this;
  }

  WebSocketPlus.prototype._createWs = function _createWs(getUrls, protocol) {
    var _this2 = this;

    return getUrls().then(function (wsUrls) {
      var urls = wsUrls;
      if (!(urls instanceof Array)) {
        urls = [urls];
      }
      return tryAll(urls.map(function (url) {
        return function (resolve, reject) {
          debug$2('connect [' + url + '] ' + protocol);
          var ws = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
          ws.binaryType = _this2.binaryType || 'arraybuffer';
          ws.onopen = function () {
            return resolve(ws);
          };
          ws.onerror = ws.onclose = function (error) {
            if (error instanceof Error) {
              return reject(error);
            }
            // in browser, error event is useless
            return reject(new Error('Failed to connect [' + url + ']'));
          };
        };
      })).then(function (ws) {
        _this2._ws = ws;
        _this2._ws.onclose = _this2._handleClose.bind(_this2);
        _this2._ws.onmessage = _this2._handleMessage.bind(_this2);
        return ws;
      });
    });
  };

  WebSocketPlus.prototype._destroyWs = function _destroyWs() {
    var ws = this._ws;
    if (!ws) return;
    ws.onopen = ws.onclose = ws.onerror = ws.onmessage = null;
    this._ws = null;
    ws.close();
  };

  WebSocketPlus.prototype.onopen = function onopen() {
    debug$2('open');
    this.emit('open');
  };

  WebSocketPlus.prototype.onconnected = function onconnected() {
    this._startConnectionKeeper();
  };

  WebSocketPlus.prototype.onleaveconnected = function onleaveconnected() {
    this._stopConnectionKeeper();
  };

  WebSocketPlus.prototype.onbeforedisconnect = function onbeforedisconnect() {
    debug$2('disconnect');
    this.emit('disconnect');
  };

  WebSocketPlus.prototype.ondisconnect = function ondisconnect() {
    this._destroyWs();
  };

  WebSocketPlus.prototype.onreconnect = function onreconnect() {
    debug$2('reconnect');
    this.emit('reconnect');
  };

  WebSocketPlus.prototype.onoffline = function onoffline(event, from, to) {
    var _this3 = this;

    var attempt = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    var delay = DEFAULT_RETRY_STRATEGY.call(null, attempt);
    debug$2('schedule attempt=' + attempt + ' delay=' + delay);
    this.emit('schedule', attempt, delay);
    if (this.__scheduledRetry) {
      clearTimeout(this.__scheduledRetry);
    }
    this.__scheduledRetry = setTimeout(function () {
      if (_this3.is('offline')) {
        _this3.retry(attempt);
      }
    }, delay);
  };

  WebSocketPlus.prototype.onretry = function onretry(event, from, to) {
    var _this4 = this;

    var attempt = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    debug$2('retry attempt=' + attempt);
    this.emit('retry', attempt);
    this._createWs(this._getUrls, this._protocol).then(function () {
      return _this4.reconnect();
    }, function () {
      return _this4.fail(attempt + 1);
    });
  };

  WebSocketPlus.prototype.onclose = function onclose() {
    debug$2('close');
    if (this._ws) {
      this._ws.close();
    }
  };

  WebSocketPlus.prototype.onerror = function onerror(event, from, to, error) {
    debug$2('error', error);
    this.emit('error', error);
  };

  // jsdoc-ignore-start


  // jsdoc-ignore-end
  WebSocketPlus.prototype._ping = function _ping() {
    debug$2('ping');
    try {
      this.ping();
    } catch (error) {
      console.warn('websocket ping error: ' + error.message);
    }
  };

  WebSocketPlus.prototype.ping = function ping() {
    if (this._ws.ping) {
      this._ws.ping();
    } else {
      console.warn('The WebSocket implement does not support sending ping frame.\n        Override ping method to use application defined ping/pong mechanism.');
    }
  };

  WebSocketPlus.prototype._postponeTimers = function _postponeTimers() {
    var _this5 = this;

    debug$2('_postponeTimers');
    this._clearTimers();
    this._heartbeatTimer = setInterval(this._ping.bind(this), HEARTBEAT_TIME);
    this._timeoutTimer = setTimeout(function () {
      debug$2('timeout');
      _this5.disconnect();
    }, TIMEOUT_TIME);
  };

  WebSocketPlus.prototype._clearTimers = function _clearTimers() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
    }
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer);
    }
  };

  WebSocketPlus.prototype._startConnectionKeeper = function _startConnectionKeeper() {
    debug$2('start connection keeper');
    var addListener = this._ws.addListener || this._ws.addEventListener;
    addListener.call(this._ws, 'message', this.__postponeTimers);
    this._postponeTimers();
  };

  WebSocketPlus.prototype._stopConnectionKeeper = function _stopConnectionKeeper() {
    debug$2('stop connection keeper');
    // websockets/ws#489
    var removeListener = this._ws.removeListener || this._ws.removeEventListener;
    removeListener.call(this._ws, 'message', this.__postponeTimers);
    this._clearTimers();
  };

  WebSocketPlus.prototype._handleClose = function _handleClose(event) {
    debug$2('ws closed [' + event.code + '] ' + event.reason);
    // socket closed manually, ignore close event.
    if (this.isFinished()) return;
    this.handleClose(event);
  };

  WebSocketPlus.prototype.handleClose = function handleClose() {
    // reconnect
    this.disconnect();
  };

  // jsdoc-ignore-start


  // jsdoc-ignore-end
  WebSocketPlus.prototype.send = function send(data) {
    debug$2('send', data);
    this._ws.send(data);
  };

  WebSocketPlus.prototype._handleMessage = function _handleMessage(event) {
    debug$2('message', event.data);
    this.handleMessage(event.data);
  };

  WebSocketPlus.prototype.handleMessage = function handleMessage(message) {
    this.emit('message', message);
  };

  return WebSocketPlus;
}(EventEmitter), (_applyDecoratedDescriptor(_class.prototype, '_ping', [requireConnected], _Object$getOwnPropertyDescriptor(_class.prototype, '_ping'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'send', [requireConnected], _Object$getOwnPropertyDescriptor(_class.prototype, 'send'), _class.prototype)), _class);


StateMachine.create({
  target: WebSocketPlus.prototype,
  initial: {
    state: 'initialized',
    event: 'init',
    defer: true
  },
  terminal: 'closed',
  events: [{
    name: 'open',
    from: 'initialized',
    to: 'connected'
  }, {
    name: 'disconnect',
    from: 'connected',
    to: 'offline'
  }, {
    name: 'retry',
    from: 'offline',
    to: 'reconnecting'
  }, {
    name: 'fail',
    from: 'reconnecting',
    to: 'offline'
  }, {
    name: 'reconnect',
    from: 'reconnecting',
    to: 'connected'
  }, {
    name: 'close',
    from: ['connected', 'offline', 'reconnecting'],
    to: 'closed'
  }, {
    name: 'throw',
    from: '*',
    to: 'error'
  }]
});

var APP_NOT_AVAILABLE = {
  code: 4100,
  message: 'App not exists or realtime message service is disabled.'
};
var INVALID_LOGIN = {
  code: 4103,
  message: 'Malformed clientId.'
};
var INVALID_ORIGIN = {
  code: 4110,
  message: 'Access denied by domain whitelist.'
};
var SESSION_CONFLICT = {
  code: 4111
};
var SESSION_TOKEN_EXPIRED = {
  code: 4112
};
var createError = function createError(errorMessage) {
  var code = errorMessage.code;
  var reason = errorMessage.reason;
  var appCode = errorMessage.appCode;
  var detail = errorMessage.detail;

  var error = new Error(reason || detail);
  return _Object$assign(error, {
    code: code, appCode: appCode, detail: detail
  });
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var messageCompiled = createCommonjsModule(function (module) {
module.exports = protobufLight.newBuilder({})['import']({
    "package": "push_server.messages",
    "options": {
        "objc_class_prefix": "AVIM"
    },
    "messages": [{
        "name": "JsonObjectMessage",
        "fields": [{
            "rule": "required",
            "type": "string",
            "name": "data",
            "id": 1
        }]
    }, {
        "name": "UnreadTuple",
        "fields": [{
            "rule": "required",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "required",
            "type": "int32",
            "name": "unread",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 3
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 4
        }]
    }, {
        "name": "LogItem",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "from",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "data",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "msgId",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "ackAt",
            "id": 5
        }]
    }, {
        "name": "LoginCommand",
        "fields": []
    }, {
        "name": "DataCommand",
        "fields": [{
            "rule": "repeated",
            "type": "string",
            "name": "ids",
            "id": 1
        }, {
            "rule": "repeated",
            "type": "JsonObjectMessage",
            "name": "msg",
            "id": 2
        }]
    }, {
        "name": "SessionCommand",
        "fields": [{
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "n",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "s",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "ua",
            "id": 4
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "r",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "tag",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "deviceId",
            "id": 7
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "sessionPeerIds",
            "id": 8
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "onlineSessionPeerIds",
            "id": 9
        }, {
            "rule": "optional",
            "type": "string",
            "name": "st",
            "id": 10
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "stTtl",
            "id": 11
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "code",
            "id": 12
        }, {
            "rule": "optional",
            "type": "string",
            "name": "reason",
            "id": 13
        }, {
            "rule": "optional",
            "type": "string",
            "name": "deviceToken",
            "id": 14
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "sp",
            "id": 15
        }]
    }, {
        "name": "ErrorCommand",
        "fields": [{
            "rule": "required",
            "type": "int32",
            "name": "code",
            "id": 1
        }, {
            "rule": "required",
            "type": "string",
            "name": "reason",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "appCode",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "detail",
            "id": 4
        }]
    }, {
        "name": "DirectCommand",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "msg",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "uid",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "fromPeerId",
            "id": 3
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 4
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "offline",
            "id": 5
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "hasMore",
            "id": 6
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "toPeerIds",
            "id": 7
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "r",
            "id": 10
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 11
        }, {
            "rule": "optional",
            "type": "string",
            "name": "id",
            "id": 12
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "transient",
            "id": 13
        }, {
            "rule": "optional",
            "type": "string",
            "name": "dt",
            "id": 14
        }, {
            "rule": "optional",
            "type": "string",
            "name": "roomId",
            "id": 15
        }]
    }, {
        "name": "AckCommand",
        "fields": [{
            "rule": "optional",
            "type": "int32",
            "name": "code",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "reason",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "uid",
            "id": 6
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "fromts",
            "id": 7
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "tots",
            "id": 8
        }, {
            "rule": "optional",
            "type": "string",
            "name": "type",
            "id": 9
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "ids",
            "id": 10
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "appCode",
            "id": 11
        }]
    }, {
        "name": "UnreadCommand",
        "fields": [{
            "rule": "repeated",
            "type": "UnreadTuple",
            "name": "convs",
            "id": 1
        }]
    }, {
        "name": "ConvCommand",
        "fields": [{
            "rule": "repeated",
            "type": "string",
            "name": "m",
            "id": 1
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "transient",
            "id": 2
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "unique",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 4
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cdate",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "initBy",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "sort",
            "id": 7
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "limit",
            "id": 8
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "skip",
            "id": 9
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "flag",
            "id": 10
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "count",
            "id": 11
        }, {
            "rule": "optional",
            "type": "string",
            "name": "udate",
            "id": 12
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 13
        }, {
            "rule": "optional",
            "type": "string",
            "name": "n",
            "id": 14
        }, {
            "rule": "optional",
            "type": "string",
            "name": "s",
            "id": 15
        }, {
            "rule": "optional",
            "type": "JsonObjectMessage",
            "name": "results",
            "id": 100
        }, {
            "rule": "optional",
            "type": "JsonObjectMessage",
            "name": "where",
            "id": 101
        }, {
            "rule": "optional",
            "type": "JsonObjectMessage",
            "name": "attr",
            "id": 103
        }]
    }, {
        "name": "RoomCommand",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "roomId",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "s",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "n",
            "id": 4
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "transient",
            "id": 5
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "roomPeerIds",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "byPeerId",
            "id": 7
        }]
    }, {
        "name": "LogsCommand",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "l",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "limit",
            "id": 3
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "tt",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "tmid",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 7
        }, {
            "rule": "optional",
            "type": "string",
            "name": "checksum",
            "id": 8
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "stored",
            "id": 9
        }, {
            "rule": "repeated",
            "type": "LogItem",
            "name": "logs",
            "id": 105
        }]
    }, {
        "name": "RcpCommand",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "id",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 3
        }]
    }, {
        "name": "ReadTuple",
        "fields": [{
            "rule": "required",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 3
        }]
    }, {
        "name": "ReadCommand",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "cids",
            "id": 2
        }, {
            "rule": "repeated",
            "type": "ReadTuple",
            "name": "convs",
            "id": 3
        }]
    }, {
        "name": "PresenceCommand",
        "fields": [{
            "rule": "optional",
            "type": "StatusType",
            "name": "status",
            "id": 1
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "sessionPeerIds",
            "id": 2
        }]
    }, {
        "name": "ReportCommand",
        "fields": [{
            "rule": "optional",
            "type": "bool",
            "name": "initiative",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "type",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "data",
            "id": 3
        }]
    }, {
        "name": "GenericCommand",
        "fields": [{
            "rule": "required",
            "type": "CommandType",
            "name": "cmd",
            "id": 1
        }, {
            "rule": "optional",
            "type": "OpType",
            "name": "op",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "appId",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "peerId",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "i",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "installationId",
            "id": 6
        }, {
            "rule": "optional",
            "type": "LoginCommand",
            "name": "loginMessage",
            "id": 100
        }, {
            "rule": "optional",
            "type": "DataCommand",
            "name": "dataMessage",
            "id": 101
        }, {
            "rule": "optional",
            "type": "SessionCommand",
            "name": "sessionMessage",
            "id": 102
        }, {
            "rule": "optional",
            "type": "ErrorCommand",
            "name": "errorMessage",
            "id": 103
        }, {
            "rule": "optional",
            "type": "DirectCommand",
            "name": "directMessage",
            "id": 104
        }, {
            "rule": "optional",
            "type": "AckCommand",
            "name": "ackMessage",
            "id": 105
        }, {
            "rule": "optional",
            "type": "UnreadCommand",
            "name": "unreadMessage",
            "id": 106
        }, {
            "rule": "optional",
            "type": "ReadCommand",
            "name": "readMessage",
            "id": 107
        }, {
            "rule": "optional",
            "type": "RcpCommand",
            "name": "rcpMessage",
            "id": 108
        }, {
            "rule": "optional",
            "type": "LogsCommand",
            "name": "logsMessage",
            "id": 109
        }, {
            "rule": "optional",
            "type": "ConvCommand",
            "name": "convMessage",
            "id": 110
        }, {
            "rule": "optional",
            "type": "RoomCommand",
            "name": "roomMessage",
            "id": 111
        }, {
            "rule": "optional",
            "type": "PresenceCommand",
            "name": "presenceMessage",
            "id": 112
        }, {
            "rule": "optional",
            "type": "ReportCommand",
            "name": "reportMessage",
            "id": 113
        }]
    }],
    "enums": [{
        "name": "CommandType",
        "values": [{
            "name": "session",
            "id": 0
        }, {
            "name": "conv",
            "id": 1
        }, {
            "name": "direct",
            "id": 2
        }, {
            "name": "ack",
            "id": 3
        }, {
            "name": "rcp",
            "id": 4
        }, {
            "name": "unread",
            "id": 5
        }, {
            "name": "logs",
            "id": 6
        }, {
            "name": "error",
            "id": 7
        }, {
            "name": "login",
            "id": 8
        }, {
            "name": "data",
            "id": 9
        }, {
            "name": "room",
            "id": 10
        }, {
            "name": "read",
            "id": 11
        }, {
            "name": "presence",
            "id": 12
        }, {
            "name": "report",
            "id": 13
        }, {
            "name": "echo",
            "id": 14
        }]
    }, {
        "name": "OpType",
        "values": [{
            "name": "open",
            "id": 1
        }, {
            "name": "add",
            "id": 2
        }, {
            "name": "remove",
            "id": 3
        }, {
            "name": "close",
            "id": 4
        }, {
            "name": "opened",
            "id": 5
        }, {
            "name": "closed",
            "id": 6
        }, {
            "name": "query",
            "id": 7
        }, {
            "name": "query_result",
            "id": 8
        }, {
            "name": "conflict",
            "id": 9
        }, {
            "name": "added",
            "id": 10
        }, {
            "name": "removed",
            "id": 11
        }, {
            "name": "start",
            "id": 30
        }, {
            "name": "started",
            "id": 31
        }, {
            "name": "joined",
            "id": 32
        }, {
            "name": "members_joined",
            "id": 33
        }, {
            "name": "left",
            "id": 39
        }, {
            "name": "members_left",
            "id": 40
        }, {
            "name": "results",
            "id": 42
        }, {
            "name": "count",
            "id": 43
        }, {
            "name": "result",
            "id": 44
        }, {
            "name": "update",
            "id": 45
        }, {
            "name": "updated",
            "id": 46
        }, {
            "name": "mute",
            "id": 47
        }, {
            "name": "unmute",
            "id": 48
        }, {
            "name": "join",
            "id": 80
        }, {
            "name": "invite",
            "id": 81
        }, {
            "name": "leave",
            "id": 82
        }, {
            "name": "kick",
            "id": 83
        }, {
            "name": "reject",
            "id": 84
        }, {
            "name": "invited",
            "id": 85
        }, {
            "name": "kicked",
            "id": 86
        }, {
            "name": "upload",
            "id": 100
        }, {
            "name": "uploaded",
            "id": 101
        }]
    }, {
        "name": "StatusType",
        "values": [{
            "name": "on",
            "id": 1
        }, {
            "name": "off",
            "id": 2
        }]
    }]
}).build();
});

var _messages$push_server = messageCompiled.push_server.messages;
var JsonObjectMessage = _messages$push_server.JsonObjectMessage;
var UnreadTuple = _messages$push_server.UnreadTuple;
var LogItem = _messages$push_server.LogItem;
var LoginCommand = _messages$push_server.LoginCommand;
var DataCommand = _messages$push_server.DataCommand;
var SessionCommand = _messages$push_server.SessionCommand;
var ErrorCommand = _messages$push_server.ErrorCommand;
var DirectCommand = _messages$push_server.DirectCommand;
var AckCommand = _messages$push_server.AckCommand;
var UnreadCommand = _messages$push_server.UnreadCommand;
var ConvCommand = _messages$push_server.ConvCommand;
var RoomCommand = _messages$push_server.RoomCommand;
var LogsCommand = _messages$push_server.LogsCommand;
var RcpCommand = _messages$push_server.RcpCommand;
var ReadTuple = _messages$push_server.ReadTuple;
var ReadCommand = _messages$push_server.ReadCommand;
var PresenceCommand = _messages$push_server.PresenceCommand;
var ReportCommand = _messages$push_server.ReportCommand;
var GenericCommand = _messages$push_server.GenericCommand;
var CommandType = _messages$push_server.CommandType;
var OpType = _messages$push_server.OpType;
var StatusType = _messages$push_server.StatusType;

var debug$1 = d('LC:Connection');

var COMMAND_TIMEOUT = 20000;

var Connection = function (_WebSocketPlus) {
  _inherits(Connection, _WebSocketPlus);

  function Connection(getUrl, _ref) {
    var format = _ref.format;
    var version = _ref.version;

    _classCallCheck(this, Connection);

    debug$1('initializing Connection');
    var protocolString = 'lc.' + format + '.' + version;

    var _this = _possibleConstructorReturn(this, _WebSocketPlus.call(this, getUrl, protocolString));

    _this._protocalFormat = format;
    _this._commands = {};
    _this._serialId = 0;
    return _this;
  }

  Connection.prototype.send = function send(command) {
    var _this2 = this;

    var waitingForRespond = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    var serialId = void 0;
    if (waitingForRespond) {
      serialId = ++this._serialId;
      command.i = serialId; // eslint-disable-line no-param-reassign
    }
    debug$1('↑', trim(command), 'sent');

    var message = void 0;
    if (this._protocalFormat === 'protobase64') {
      message = command.toBase64();
    } else if (command.toBuffer) {
      message = command.toBuffer();
    } else if (command.toArrayBuffer) {
      message = command.toArrayBuffer();
    }
    if (!message) {
      throw new TypeError(command + ' is not a GenericCommand');
    }

    _WebSocketPlus.prototype.send.call(this, message);

    if (!waitingForRespond) {
      return _Promise.resolve();
    }
    return new _Promise(function (resolve, reject) {
      _this2._commands[serialId] = {
        resolve: resolve,
        reject: reject
      };
      setTimeout(function () {
        if (_this2._commands[serialId]) {
          debug$1('✗', trim(command), 'timeout');
          reject(new Error('Command Timeout.'));
          delete _this2._commands[serialId];
        }
      }, COMMAND_TIMEOUT);
    });
  };

  Connection.prototype.handleMessage = function handleMessage(msg) {
    var message = void 0;
    try {
      message = GenericCommand.decode(msg);
      debug$1('↓', trim(message), 'received');
    } catch (e) {
      console.warn('Decode message failed', msg);
    }
    this.emit('allmessage', message);
    var serialId = message.i;
    if (serialId) {
      if (this._commands[serialId]) {
        if (message.cmd === CommandType.error) {
          this._commands[serialId].reject(createError(message.errorMessage));
        } else {
          this._commands[serialId].resolve(message);
        }
        delete this._commands[serialId];
      } else {
        console.warn('Unexpected command received with serialId [' + serialId + '],\n         which have timed out or never been requested.');
      }
    } else if (message.cmd === CommandType.error) {
      this.emit('error', createError(message.errorMessage));
    } else {
      this.emit('message', message);
    }
  };

  Connection.prototype.ping = function ping() {
    return this.send(new GenericCommand({
      cmd: 'echo'
    })).catch(function (error) {
      return console.warn('ping failed:', error);
    });
  };

  return Connection;
}(WebSocketPlus);

/* eslint-disable max-len */

/**
 * 插件接口
 *
 * 插件是由一个或多个扩展点的 Decorator 或 Middleware 组成的字典。SDK 的扩展点可以分为两类：
 * <p>
 * 第一类扩展点是类实例化之后的回调，包括 <code>Realtime</code>、<code>IMClient</code> 与 <code>Conversation</code>。这些扩展点可以通过一个同步的 Decorator 进行扩展。Decorator 接受一个对应的实例并对其进行一些操作。
 * 特别的，由于注册自定义消息类这个需求特别的常用，额外定义一个 messageClasses 扩展点来做这件事情。
 * <p>
 * 第二类扩展点是在某些事件处理前、后可以注入逻辑的点。目前可扩展的点有 <code>beforeMessageParse</code>，<code>afterMessageParse</code>。这些扩展点可以通过一个异步的 Middleware 进行扩展。Middleware 接受一个对象，返回一个同类型对象或同类型对象的 Promise。
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
 * @name Plugin.beforeMessageParse
 * @type Function
 */

var checkType = function checkType(middleware) {
  return function (param) {
    var constructor = param.constructor;

    return _Promise.resolve(param).then(middleware).then(tap(function (result) {
      if (result === undefined || result === null) {
        // eslint-disable-next-line max-len
        return console.warn('Middleware[' + (middleware._pluginName || 'anonymous plugin') + ':' + (middleware.name || 'anonymous middleware') + '] param/return types not match. It returns ' + result + ' while a ' + param.constructor.name + ' expected.');
      }
      if (!(result instanceof constructor)) {
        // eslint-disable-next-line max-len
        return console.warn('Middleware[' + (middleware._pluginName || 'anonymous plugin') + ':' + (middleware.name || 'anonymous middleware') + '] param/return types not match. It returns a ' + result.constructor.name + ' while a ' + param.constructor.name + ' expected.');
      }
      return 0;
    }));
  };
};

var applyDecorators = function applyDecorators(decorators, target) {
  if (decorators) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(decorators), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var decorator = _step.value;

        try {
          decorator(target);
        } catch (error) {
          if (decorator._pluginName) {
            error.message += '[' + decorator._pluginName + ']';
          }
          throw error;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
};

var applyMiddlewares = function applyMiddlewares(middlewares) {
  return function (target) {
    return ensureArray(middlewares).reduce(function (previousPromise, middleware) {
      return previousPromise.then(checkType(middleware)).catch(function (error) {
        if (middleware._pluginName) {
          // eslint-disable-next-line no-param-reassign
          error.message += '[' + middleware._pluginName + ']';
        }
        throw error;
      });
    }, _Promise.resolve(target));
  };
};

var Client = function (_EventEmitter) {
  _inherits(Client, _EventEmitter);

  function Client(id) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var connection = arguments[2];
    var props = arguments[3];

    _classCallCheck(this, Client);

    if (!(id === undefined || typeof id === 'string')) {
      throw new TypeError('Client id [' + id + '] is not a String');
    }

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    _Object$assign(_this, {
      id: id,
      _connection: connection,
      options: options
    }, props);
    return _this;
  }

  /**
   * @abstract
   */


  Client.prototype._dispatchMessage = function _dispatchMessage(message) {
    this.emit('message', message);
  };

  return Client;
}(EventEmitter);

var debug$7 = d('LC:ConversationQuery');

var ConversationQuery = function () {
  ConversationQuery._encode = function _encode(value) {
    if (value instanceof Date) {
      return { __type: 'Date', iso: value.toJSON() };
    }
    if (value instanceof RegExp) {
      return value.source;
    }
    return value;
  };

  ConversationQuery._quote = function _quote(s) {
    return '\\Q' + s.replace('\\E', '\\E\\\\E\\Q') + '\\E';
  };

  ConversationQuery._calculateFlag = function _calculateFlag(options) {
    return ['withLastMessagesRefreshed', 'compact'].reduce(function (prev, key) {
      return (prev << 1) + Boolean(options[key]);
    }, 0);
  };

  /**
   * Create a ConversationQuery
   * @param  {IMClient} client
   */


  function ConversationQuery(client) {
    _classCallCheck(this, ConversationQuery);

    this._client = client;
    this._where = {};
    this._extraOptions = {};
  }

  ConversationQuery.prototype._addCondition = function _addCondition(key, condition, value) {
    // Check if we already have a condition
    if (!this._where[key]) {
      this._where[key] = {};
    }
    this._where[key][condition] = this.constructor._encode(value);
    return this;
  };

  ConversationQuery.prototype.toJSON = function toJSON() {
    var json = {
      where: this._where,
      flag: this.constructor._calculateFlag(this._extraOptions)
    };
    if (typeof this._skip !== 'undefined') json.skip = this._skip;
    if (typeof this._limit !== 'undefined') json.limit = this._limit;
    if (typeof this._order !== 'undefined') json.sort = this._order;
    debug$7(json);
    return json;
  };

  /**
   * 增加查询条件，指定聊天室的组员包含某些成员即可返回
   * @param {string[]} peerIds - 成员 ID 列表
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.containsMembers = function containsMembers(peerIds) {
    return this.containsAll('m', peerIds);
  };

  /**
   * 增加查询条件，指定聊天室的组员条件满足条件的才返回
   *
   * @param {string[]} - 成员 ID 列表
   * @param {Boolean} includeSelf - 是否包含自己
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.withMembers = function withMembers(peerIds, includeSelf) {
    var peerIdsSet = new _Set(peerIds);
    if (includeSelf) {
      peerIdsSet.add(this._client.id);
    }
    this.sizeEqualTo('m', peerIdsSet.size);
    return this.containsMembers(_Array$from(peerIdsSet));
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.equalTo = function equalTo(key, value) {
    this._where[key] = this.constructor._encode(value);
    return this;
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足小于条件时即可返回
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.lessThan = function lessThan(key, value) {
    return this._addCondition(key, '$lt', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足小于等于条件时即可返回
    * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.lessThanOrEqualTo = function lessThanOrEqualTo(key, value) {
    return this._addCondition(key, '$lte', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足大于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */

  ConversationQuery.prototype.greaterThan = function greaterThan(key, value) {
    return this._addCondition(key, '$gt', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足大于等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */

  ConversationQuery.prototype.greaterThanOrEqualTo = function greaterThanOrEqualTo(key, value) {
    return this._addCondition(key, '$gte', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足不等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.notEqualTo = function notEqualTo(key, value) {
    return this._addCondition(key, '$ne', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值包含在指定值中时即可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.containedIn = function containedIn(key, values) {
    return this._addCondition(key, '$in', values);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值不包含在指定值中时即可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.notContainsIn = function notContainsIn(key, values) {
    return this._addCondition(key, '$nin', values);
  };
  /**
   * 增加查询条件，当conversation的属性中对应的字段中的元素包含所有的值才可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.containsAll = function containsAll(key, values) {
    return this._addCondition(key, '$all', values);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值包含此字符串即可返回
   *
   * @param {string} key
   * @param {string} subString
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.contains = function contains(key, subString) {
    return this._addCondition(key, '$regex', ConversationQuery._quote(subString));
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值以此字符串起始即可返回
   *
   * @param {string} key
   * @param {string} prefix
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.startsWith = function startsWith(key, prefix) {
    return this._addCondition(key, '$regex', '^' + ConversationQuery._quote(prefix));
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值以此字符串结束即可返回
   *
   * @param {string} key
   * @param {string} suffix
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.endsWith = function endsWith(key, suffix) {
    return this._addCondition(key, '$regex', ConversationQuery._quote(suffix) + '$');
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值满足提供的正则表达式即可返回
   *
   * @param {string} key
   * @param {RegExp} regex
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.matches = function matches(key, regex) {
    this._addCondition(key, '$regex', regex);
    // Javascript regex options support mig as inline options but store them
    // as properties of the object. We support mi & should migrate them to
    // modifiers
    var _modifiers = '';
    if (regex.ignoreCase) {
      _modifiers += 'i';
    }
    if (regex.multiline) {
      _modifiers += 'm';
    }

    if (_modifiers && _modifiers.length) {
      this._addCondition(key, '$options', _modifiers);
    }
    return this;
  };

  /**
   * 添加查询约束条件，查找 key 类型是数组，该数组的长度匹配提供的数值
   *
   * @param {string} key
   * @param {Number} length
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.sizeEqualTo = function sizeEqualTo(key, length) {
    return this._addCondition(key, '$size', length);
  };

  /**
   * 设置返回集合的大小上限
   *
   * @param {Number} limit - 上限
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.limit = function limit(_limit) {
    this._limit = _limit;
    return this;
  };

  /**
   * 设置返回集合的起始位置，一般用于分页
   *
   * @param {Number} skip - 起始位置跳过几个对象
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.skip = function skip(_skip) {
    this._skip = _skip;
    return this;
  };

  /**
   * 设置返回集合按照指定key进行增序排列
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.ascending = function ascending(key) {
    this._order = key;
    return this;
  };

  /**
   * 设置返回集合按照指定key进行增序排列，如果已设置其他排序，原排序的优先级较高
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.addAscending = function addAscending(key) {
    if (this._order) {
      this._order += ',' + key;
    } else {
      this._order = key;
    }
    return this;
  };

  /**
   * 设置返回集合按照指定 key 进行降序排列
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.descending = function descending(key) {
    this._order = '-' + key;
    return this;
  };

  /**
   * 设置返回集合按照指定 key 进行降序排列，如果已设置其他排序，原排序的优先级较高
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.addDescending = function addDescending(key) {
    if (this._order) {
      this._order += ',-' + key;
    } else {
      this._order = '-' + key;
    }
    return this;
  };

  /**
   * 设置返回的 conversations 刷新最后一条消息
   * @param  {Boolean} [enabled=true]
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.withLastMessagesRefreshed = function withLastMessagesRefreshed() {
    var enabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    this._extraOptions.withLastMessagesRefreshed = enabled;
    return this;
  };

  /**
   * @deprecated 请替换为 {@link ConversationQuery#withLastMessagesRefreshed}
   * @param  {Boolean} [enabled=true]
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.withLastMessages = function withLastMessages(enabled) {
    console.warn('DEPRECATION ConversationQuery#withLastMessages: ' + 'Use ConversationQuery#withLastMessagesRefreshed instead.');
    return this.withLastMessagesRefreshed(enabled);
  };

  /**
   * 设置返回的 conversations 为精简模式，即不含成员列表
   * @param  {Boolean} [enabled=true]
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.compact = function compact() {
    var enabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    this._extraOptions.compact = enabled;
    return this;
  };

  /**
   * 执行查询
   * @return {Promise.<Conversation[]>}
   */


  ConversationQuery.prototype.find = function find() {
    return this._client._executeQuery(this);
  };

  return ConversationQuery;
}();

var debug$8 = d('LC:SignatureFactoryRunner');

function _validateSignature() {
  var signatureResult = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var signature = signatureResult.signature;
  var timestamp = signatureResult.timestamp;
  var nonce = signatureResult.nonce;

  if (typeof signature !== 'string' || typeof timestamp !== 'number' || typeof nonce !== 'string') {
    throw new Error('malformed signature');
  }
  return {
    signature: signature,
    timestamp: timestamp,
    nonce: nonce
  };
}

var runSignatureFactory = (function (signatureFactory, params) {
  return _Promise.resolve().then(function () {
    debug$8('call signatureFactory with ' + params);
    return signatureFactory.apply(undefined, _toConsumableArray(params));
  }).then(tap(function (signatureResult) {
    return debug$8('sign result', signatureResult);
  }), function (error) {
    // eslint-disable-next-line no-param-reassign
    error.message = 'sign error: ' + error.message;
    debug$8(error);
    throw error;
  }).then(_validateSignature);
});

var _rMessageStatus;

/**
 * 消息状态枚举
 * @enum {Symbol}
 * @since 3.2.0
 * @memberof module:leancloud-realtime
 */
var MessageStatus = {
  /** 初始状态、未知状态 */
  NONE: _Symbol('none'),
  /** 正在发送 */
  SENDING: _Symbol('sending'),
  /** 已发送 */
  SENT: _Symbol('sent'),
  /** 已送达 */
  DELIVERED: _Symbol('delivered'),
  /** 发送失败 */
  FAILED: _Symbol('failed')
};
_Object$freeze(MessageStatus);

var rMessageStatus = (_rMessageStatus = {}, _defineProperty(_rMessageStatus, MessageStatus.NONE, true), _defineProperty(_rMessageStatus, MessageStatus.SENDING, true), _defineProperty(_rMessageStatus, MessageStatus.SENT, true), _defineProperty(_rMessageStatus, MessageStatus.DELIVERED, true), _defineProperty(_rMessageStatus, MessageStatus.FAILED, true), _rMessageStatus);

var Message = function () {
  /**
   * @implements AVMessage
   * @param  {Object|String} content 消息内容
   */
  function Message(content) {
    _classCallCheck(this, Message);

    _Object$assign(this, { content: content }, {
      /**
       * @type {String}
       * @memberof Message#
       */
      id: uuid.v4(),
      /**
       * 消息所在的 conversation id
       * @memberof Message#
       * @type {String?}
       */
      cid: null,
      /**
       * 时间戳
       * @memberof Message#
       * @type {Date}
       */
      timestamp: new Date(),
      /**
       * 消息发送者
       * @memberof Message#
       * @type {String}
       */
      from: undefined,
      /**
       * 标记需要回执
       * @memberof Message#
       * @type {Boolean}
       */
      needReceipt: false,
      /**
       * 标记暂态消息
       * @memberof Message#
       * @type {Boolean}
       */
      transient: false
    });
    this._setStatus(MessageStatus.NONE);
  }

  /**
   * 设置是否需要送达回执
   * @param {Boolean} needReceipt
   * @return {Message} self
   */


  Message.prototype.setNeedReceipt = function setNeedReceipt(needReceipt) {
    this.needReceipt = needReceipt;
    return this;
  };

  /**
   * 设置是否是暂态消息
   * @param {Boolean} transient
   * @return {Message} self
   */


  Message.prototype.setTransient = function setTransient(transient) {
    this.transient = transient;
    return this;
  };

  /**
   * 将当前消息序列化为 JSON 对象
   * @protected
   * @return {Object}
   */


  Message.prototype.toJSON = function toJSON() {
    return this.content;
  };

  /**
   * 消息状态，值为 {@link module:leancloud-realtime.MessageStatus} 之一
   * @type {Symbol}
   * @readonly
   * @since 3.2.0
   */


  Message.prototype._setStatus = function _setStatus(status) {
    if (!rMessageStatus[status]) {
      throw new Error('Invalid message status');
    }
    this._status = status;
  };

  /**
   * 判断给定的内容是否是有效的 Message，
   * 该方法始终返回 true
   * @protected
   * @returns {Boolean}
   * @implements AVMessage.validate
   */


  Message.validate = function validate() {
    return true;
  };

  /**
   * 解析处理消息内容
   * <pre>
   * 如果子类提供了 message，返回该 message
   * 如果没有提供，将 json 作为 content 实例化一个 Message
   * @protected
   * @param  {Object}  json    json 格式的消息内容
   * @param  {Message} message 子类提供的 message
   * @return {Message}
   * @implements AVMessage.parse
   */


  Message.parse = function parse(json, message) {
    return message || new this(json);
  };

  _createClass(Message, [{
    key: 'status',
    get: function get() {
      return this._status;
    }
  }]);

  return Message;
}();

var version = "3.2.3";

var debug$6 = d('LC:IMClient');

var IMClient = function (_Client) {
  _inherits(IMClient, _Client);

  /**
   * 无法直接实例化，请使用 {@link Realtime#createIMClient} 创建新的 IMClient。
   *
   * @extends EventEmitter
   * @param  {String} [id] 客户端 id
   * @param  {Object} [options]
   * @param  {Function} [options.signatureFactory] open session 时的签名方法 // TODO need details
   * @param  {Function} [options.conversationSignatureFactory] 对话创建、增减成员操作时的签名方法
   */
  function IMClient() {
    _classCallCheck(this, IMClient);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _Client.call.apply(_Client, [this].concat(args)));
    /**
     * @var id {String} 客户端 id
     * @memberof IMClient#
     */


    if (!_this._messageParser) {
      throw new Error('IMClient must be initialized with a MessageParser');
    }
    _this._conversationCache = new Cache('client:' + _this.id);
    _this._ackMessageBuffer = {};
    internal(_this)._eventemitter = new EventEmitter();
    ['invited', 'kicked', 'membersjoined', 'membersleft', 'message', 'unreadmessages', 'close', 'conflict', 'unhandledmessage'].forEach(function (event) {
      return _this.on(event, function (payload) {
        return _this._debug(event + ' event emitted.', payload);
      });
    });
    // onIMClientCreate hook
    applyDecorators(_this._plugins.onIMClientCreate, _this);
    return _this;
  }

  IMClient.prototype._debug = function _debug() {
    for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      params[_key2] = arguments[_key2];
    }

    debug$6.apply(undefined, params.concat(['[' + this.id + ']']));
  };

  /**
   * @override
   * @private
   */


  IMClient.prototype._dispatchMessage = function _dispatchMessage(message) {
    this._debug(trim(message), 'received');
    switch (message.cmd) {
      case CommandType.conv:
        return this._dispatchConvMessage(message);
      case CommandType.direct:
        return this._dispatchDirectMessage(message);
      case CommandType.session:
        return this._dispatchSessionMessage(message);
      case CommandType.unread:
        return this._dispatchUnreadMessage(message);
      case CommandType.rcp:
        return this._dispatchRcpMessage(message);
      default:
        this.emit('unhandledmessage', message);
        return _Promise.resolve();
    }
  };

  IMClient.prototype._dispatchSessionMessage = function _dispatchSessionMessage(message) {
    var _message$sessionMessa = message.sessionMessage;
    var code = _message$sessionMessa.code;
    var reason = _message$sessionMessa.reason;

    switch (message.op) {
      case OpType.closed:
        {
          if (code === SESSION_CONFLICT.code) {
            /**
             * 用户在其他客户端登录，当前客户端被服务端强行下线。详见文档「单点登录」章节。
             * @event IMClient#conflict
             */
            return this.emit('conflict', {
              reason: reason
            });
          }
          /**
           * 当前客户端被服务端强行下线
           * @event IMClient#close
           * @param {Object} payload
           * @param {Number} payload.code 错误码
           * @param {String} payload.reason 原因
           */
          return this.emit('close', {
            code: code, reason: reason
          });
        }
      default:
        this.emit('unhandledmessage', message);
        return _Promise.reject(new Error('Unrecognized session command'));
    }
  };

  IMClient.prototype._dispatchUnreadMessage = function _dispatchUnreadMessage(message) {
    var _this2 = this;

    var convs = message.unreadMessage.convs;
    return _Promise.all(convs.map(function (conv) {
      return _this2.getConversation(conv.cid).then(function (conversation) {
        var timestamp = void 0;
        if (conv.timestamp) {
          timestamp = new Date(conv.timestamp.toNumber());
          conversation.lastMessageAt = timestamp; // eslint-disable-line no-param-reassign
        }
        conversation.unreadMessagesCount = conv.unread; // eslint-disable-line no-param-reassign
        /**
         * 未读消息数目更新
         * @event IMClient#unreadmessages
         * @param {Object} payload
         * @param {Number} payload.count 未读消息数
         * @param {String} [payload.lastMessageId] 最新一条未读消息 id
         * @param {Date} [payload.lastMessageTimestamp] 最新一条未读消息时间戳
         * @param {Conversation} conversation 未读消息数目有更新的对话
         */
        _this2.emit('unreadmessages', {
          count: conv.unread,
          lastMessageId: conv.mid,
          lastMessageTimestamp: timestamp
        }, conversation);
      });
    }));
  };

  IMClient.prototype._dispatchRcpMessage = function _dispatchRcpMessage(message) {
    var rcpMessage = message.rcpMessage;

    var conversationId = rcpMessage.cid;
    var messageId = rcpMessage.id;
    var deliveredAt = new Date(rcpMessage.t.toNumber());
    var conversation = this._conversationCache.get(conversationId);
    // conversation not cached means the client does not send the message
    // during this session
    if (!conversation) return;
    conversation._handleReceipt({ messageId: messageId, deliveredAt: deliveredAt });
  };

  IMClient.prototype._dispatchConvMessage = function _dispatchConvMessage(message) {
    var _this3 = this;

    var convMessage = message.convMessage;
    var _message$convMessage = message.convMessage;
    var initBy = _message$convMessage.initBy;
    var m = _message$convMessage.m;

    switch (message.op) {
      case OpType.joined:
        {
          return this.getConversation(convMessage.cid).then(function (conversation) {
            if (!conversation.transient) {
              // eslint-disable-next-line no-param-reassign
              conversation.members = union(conversation.members, [_this3.id]);
            }
            var payload = {
              invitedBy: initBy
            };
            /**
             * 当前用户被添加至某个对话
             * @event IMClient#invited
             * @param {Object} payload
             * @param {String} payload.invitedBy 邀请者 id
             * @param {Conversation} conversation
             */
            _this3.emit('invited', payload, conversation);
            /**
             * 当前用户被添加至当前对话
             * @event Conversation#invited
             * @param {Object} payload
             * @param {String} payload.invitedBy 该移除操作的发起者 id
             */
            conversation.emit('invited', payload);
          });
        }
      case OpType.left:
        {
          return this.getConversation(convMessage.cid).then(function (conversation) {
            if (!conversation.transient) {
              // eslint-disable-next-line no-param-reassign
              conversation.members = difference(conversation.members, [_this3.id]);
            }
            var payload = {
              kickedBy: initBy
            };
            /**
             * 当前用户被从某个对话中移除
             * @event IMClient#kicked
             * @param {Object} payload
             * @param {String} payload.kickedBy 该移除操作的发起者 id
             * @param {Conversation} conversation
             */
            _this3.emit('kicked', payload, conversation);
            /**
             * 当前用户被从当前对话中移除
             * @event Conversation#kicked
             * @param {Object} payload
             * @param {String} payload.kickedBy 该移除操作的发起者 id
             */
            conversation.emit('kicked', payload);
          });
        }
      case OpType.members_joined:
        {
          return this.getConversation(convMessage.cid).then(function (conversation) {
            if (!conversation.transient) {
              // eslint-disable-next-line no-param-reassign
              conversation.members = union(conversation.members, convMessage.m);
            }
            var payload = {
              invitedBy: initBy,
              members: m
            };
            /**
             * 有用户被添加至某个对话
             * @event IMClient#membersjoined
             * @param {Object} payload
             * @param {String[]} payload.members 被添加的用户 id 列表
             * @param {String} payload.invitedBy 邀请者 id
             * @param {Conversation} conversation
             */
            _this3.emit('membersjoined', payload, conversation);
            /**
             * 有成员被添加至当前对话
             * @event Conversation#membersjoined
             * @param {Object} payload
             * @param {String[]} payload.members 被添加的成员 id 列表
             * @param {String} payload.invitedBy 邀请者 id
             */
            conversation.emit('membersjoined', payload);
          });
        }
      case OpType.members_left:
        {
          return this.getConversation(convMessage.cid).then(function (conversation) {
            if (!conversation.transient) {
              // eslint-disable-next-line no-param-reassign
              conversation.members = difference(conversation.members, convMessage.m);
            }
            var payload = {
              kickedBy: initBy,
              members: m
            };
            /**
             * 有成员被从某个对话中移除
             * @event IMClient#membersleft
             * @param {Object} payload
             * @param {String[]} payload.members 被移除的成员 id 列表
             * @param {String} payload.kickedBy 该移除操作的发起者 id
             * @param {Conversation} conversation
             */
            _this3.emit('membersleft', payload, conversation);
            /**
             * 有成员被从当前对话中移除
             * @event Conversation#membersleft
             * @param {Object} payload
             * @param {String[]} payload.members 被移除的成员 id 列表
             * @param {String} payload.kickedBy 该移除操作的发起者 id
             */
            conversation.emit('membersleft', payload);
          });
        }
      default:
        this.emit('unhandledmessage', message);
        return _Promise.reject(new Error('Unrecognized conversation command'));
    }
  };

  IMClient.prototype._dispatchDirectMessage = function _dispatchDirectMessage(originalMessage) {
    var _this4 = this;

    var directMessage = originalMessage.directMessage;
    var _originalMessage$dire = originalMessage.directMessage;
    var id = _originalMessage$dire.id;
    var cid = _originalMessage$dire.cid;
    var fromPeerId = _originalMessage$dire.fromPeerId;
    var timestamp = _originalMessage$dire.timestamp;
    var transient = _originalMessage$dire.transient;

    return _Promise.all([this.getConversation(directMessage.cid), this._messageParser.parse(directMessage.msg)]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var conversation = _ref2[0];
      var message = _ref2[1];

      var messageProps = {
        id: id,
        cid: cid,
        timestamp: new Date(timestamp.toNumber()),
        from: fromPeerId,
        transient: transient
      };
      _Object$assign(message, messageProps);
      message._setStatus(MessageStatus.SENT);
      conversation.lastMessage = message; // eslint-disable-line no-param-reassign
      conversation.lastMessageAt = message.timestamp; // eslint-disable-line no-param-reassign
      conversation.unreadMessagesCount++; // eslint-disable-line no-param-reassign
      /**
       * 当前用户收到消息
       * @event IMClient#message
       * @param {Message} message
       * @param {Conversation} conversation 收到消息的对话
       */
      _this4.emit('message', message, conversation);
      /**
       * 当前对话收到消息
       * @event Conversation#message
       * @param {Message} message
       */
      conversation.emit('message', message);
      if (!(transient || conversation.transient)) {
        _this4._sendAck(message);
      }
    });
  };

  IMClient.prototype._sendAck = function _sendAck(message) {
    this._debug('send ack for', message);
    var cid = message.cid;

    if (!cid) {
      return _Promise.reject(new Error('missing cid'));
    }
    if (!this._ackMessageBuffer[cid]) {
      this._ackMessageBuffer[cid] = [];
    }
    this._ackMessageBuffer[cid].push(message);
    if (!this._doSendAckThrottled) {
      this._doSendAckThrottled = throttle(this._doSendAck.bind(this), 1000);
    }
    return this._doSendAckThrottled();
  };

  IMClient.prototype._doSendAck = function _doSendAck() {
    var _this5 = this;

    if (!this._connection.is('connected')) {
      // if not connected, just skip everything
      return _Promise.resolve();
    }
    debug$6('do send ack', this._ackMessageBuffer);
    return _Promise.all(_Object$keys(this._ackMessageBuffer).map(function (cid) {
      var convAckMessages = _this5._ackMessageBuffer[cid];
      var timestamps = convAckMessages.map(function (message) {
        return message.timestamp;
      });
      var command = new GenericCommand({
        cmd: 'ack',
        ackMessage: new AckCommand({
          cid: cid,
          fromts: Math.min.apply(null, timestamps),
          tots: Math.max.apply(null, timestamps)
        })
      });
      return _this5._send(command, false).then(function () {
        return delete _this5._ackMessageBuffer[cid];
      }).catch(function (error) {
        return console.warn('send ack failed:', error);
      });
    }));
  };

  IMClient.prototype._send = function _send(cmd) {
    var _connection;

    var command = cmd;
    if (this.id) {
      command.peerId = this.id;
    }

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return (_connection = this._connection).send.apply(_connection, [command].concat(args));
  };

  IMClient.prototype._open = function _open(appId, tag, deviceId) {
    var _this6 = this;

    var isReconnect = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    this._debug('open session');
    return _Promise.resolve(new GenericCommand({
      cmd: 'session',
      op: 'open',
      appId: appId,
      sessionMessage: new SessionCommand({
        ua: 'js/' + version,
        r: isReconnect
      })
    })).then(function (command) {
      if (isReconnect) {
        // if sessionToken is not expired, skip signature/tag/deviceId
        var sessionToken = internal(_this6).sessionToken;
        if (sessionToken) {
          var value = sessionToken.value;
          if (value && value !== Expirable.EXPIRED) {
            _Object$assign(command.sessionMessage, {
              st: value
            });
            return command;
          }
        }
      }
      _Object$assign(command.sessionMessage, trim({
        tag: tag,
        deviceId: deviceId
      }));
      if (_this6.options.signatureFactory) {
        return runSignatureFactory(_this6.options.signatureFactory, [_this6.id]).then(function (signatureResult) {
          _Object$assign(command.sessionMessage, keyRemap({
            signature: 's',
            timestamp: 't',
            nonce: 'n'
          }, signatureResult));
          return command;
        });
      }
      return command;
    }).then(this._send.bind(this)).then(function (resCommand) {
      var peerId = resCommand.peerId;
      var _resCommand$sessionMe = resCommand.sessionMessage;
      var token = _resCommand$sessionMe.st;
      var tokenTTL = _resCommand$sessionMe.stTtl;

      if (!peerId) {
        console.warn('Unexpected session opened without peerId.');
        return;
      }
      _this6.id = peerId;
      if (token) {
        internal(_this6).sessionToken = new Expirable(token, tokenTTL * 1000);
      }
    }, function (error) {
      if (error.code === SESSION_TOKEN_EXPIRED.code) {
        if (internal(_this6).sessionToken === undefined) {
          // let it fail if sessoinToken not cached but command rejected as token expired
          // to prevent session openning flood
          throw new Error('Unexpected session expiration');
        }
        debug$6('Session token expired, reopening');
        delete internal(_this6).sessionToken;
        return _this6._open(appId, tag, deviceId, isReconnect);
      }
      throw error;
    });
  };

  /**
   * 关闭客户端
   * @return {Promise}
   */


  IMClient.prototype.close = function close() {
    var _this7 = this;

    this._debug('close session');
    var command = new GenericCommand({
      cmd: 'session',
      op: 'close'
    });
    return this._send(command).then(function () {
      internal(_this7)._eventemitter.emit('close', {
        code: 0
      });
      _this7.emit('close', {
        code: 0
      });
    });
  };
  /**
   * 获取 client 列表中在线的 client，每次查询最多 20 个 clientId，超出部分会被忽略
   * @param  {String[]} clientIds 要查询的 client ids
   * @return {Primse.<String[]>} 在线的 client ids
   */


  IMClient.prototype.ping = function ping(clientIds) {
    this._debug('ping');
    if (!(clientIds instanceof Array)) {
      throw new TypeError('clientIds ' + clientIds + ' is not an Array');
    }
    if (!clientIds.length) {
      return _Promise.resolve([]);
    }
    var command = new GenericCommand({
      cmd: 'session',
      op: 'query',
      sessionMessage: new SessionCommand({
        sessionPeerIds: clientIds
      })
    });
    return this._send(command).then(function (resCommand) {
      return resCommand.sessionMessage.onlineSessionPeerIds;
    });
  };

  /**
   * 获取某个特定的 conversation
   * @param  {String} id 对话 id，对应 _Conversation 表中的 objectId
   * @param  {Boolean} [noCache=false] 强制不从缓存中获取
   * @return {Promise.<Conversation>}
   */


  IMClient.prototype.getConversation = function getConversation(id) {
    var noCache = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (typeof id !== 'string') {
      throw new TypeError(id + ' is not a String');
    }
    if (!noCache) {
      var cachedConversation = this._conversationCache.get(id);
      if (cachedConversation) {
        return _Promise.resolve(cachedConversation);
      }
    }
    return this.getQuery().equalTo('objectId', id).find().then(function (conversations) {
      return conversations[0] || null;
    });
  };

  /**
   * 构造一个 ConversationQuery 来查询对话
   * @return {ConversationQuery}
   */


  IMClient.prototype.getQuery = function getQuery() {
    return new ConversationQuery(this);
  };

  IMClient.prototype._executeQuery = function _executeQuery(query) {
    var _this8 = this;

    var queryJSON = query.toJSON();
    queryJSON.where = new JsonObjectMessage({
      data: _JSON$stringify(queryJSON.where)
    });
    var command = new GenericCommand({
      cmd: 'conv',
      op: 'query',
      convMessage: new ConvCommand(queryJSON)
    });
    return this._send(command).then(function (resCommand) {
      try {
        return JSON.parse(resCommand.convMessage.results.data);
      } catch (error) {
        var commandString = _JSON$stringify(trim(resCommand));
        throw new Error('Parse query result failed: ' + error.message + '. Command: ' + commandString);
      }
    }).then(function (conversations) {
      return _Promise.all(conversations.map(_this8._parseConversationFromRawData.bind(_this8)));
    }).then(function (conversations) {
      return conversations.map(function (fetchedConversation) {
        var conversation = _this8._conversationCache.get(fetchedConversation.id);
        if (!conversation) {
          conversation = fetchedConversation;
          _this8._debug('no match, set cache');
          _this8._conversationCache.set(fetchedConversation.id, fetchedConversation);
        } else {
          _this8._debug('update cached conversation');
          ['creator', 'createdAt', 'updatedAt', 'lastMessageAt', 'lastMessage', 'mutedMembers', 'members', '_attributes', 'transient', 'muted'].forEach(function (key) {
            var value = fetchedConversation[key];
            if (value !== undefined) conversation[key] = value;
          });
          conversation._reset();
        }
        return conversation;
      });
    });
  };

  IMClient.prototype._parseConversationFromRawData = function _parseConversationFromRawData(rawData) {
    var _this9 = this;

    var data = keyRemap({
      objectId: 'id',
      lm: 'lastMessageAt',
      msg: 'lastMessage',
      msg_from: 'lastMessageFrom',
      msg_mid: 'lastMessageId',
      msg_timestamp: 'lastMessageTimestamp',
      m: 'members',
      tr: 'transient',
      c: 'creator',
      mu: 'mutedMembers'
    }, rawData);
    return _Promise.resolve().then(function () {
      if (data.lastMessage) {
        return _this9._messageParser.parse(data.lastMessage).then(function (message) {
          data.lastMessage = message;
          data.lastMessage.from = data.lastMessageFrom;
          data.lastMessage.id = data.lastMessageId;
          data.lastMessage.timestamp = new Date(data.lastMessageTimestamp);
          data.lastMessage._setStatus(MessageStatus.SENT);
          delete data.lastMessageFrom;
          delete data.lastMessageId;
          delete data.lastMessageTimestamp;
        });
      }
      return _Promise.resolve();
    }).then(function () {
      return new Conversation(data, _this9);
    });
  };

  /**
   * 创建一个 conversation
   * @param {Object} options 除了下列字段外的其他字段将被视为对话的自定义属性
   * @param {String[]} options.members 对话的初始成员列表，默认包含当前 client
   * @param {String} [options.name] 对话的名字
   * @param {Object} [options.attributes] DEPRECATED: 额外属性，对应 _Conversation 表的 attr 列
   * @param {Boolean} [options.transient=false] 暂态会话
   * @param {Boolean} [options.unique=false] 唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话
   * @return {Promise.<Conversation>}
   */


  IMClient.prototype.createConversation = function createConversation() {
    var _this10 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var m = options.members;
    var name = options.name;
    var attributes = options.attributes;
    var transient = options.transient;
    var unique = options.unique;

    var properties = _objectWithoutProperties(options, ['members', 'name', 'attributes', 'transient', 'unique']);

    if (!(transient || Array.isArray(m))) {
      throw new TypeError('conversation members ' + m + ' is not an array');
    }
    var members = new _Set(m);
    members.add(this.id);
    members = _Array$from(members).sort();
    var attr = properties || {};
    if (name) {
      if (typeof name !== 'string') {
        throw new TypeError('conversation name ' + name + ' is not a string');
      }
      attr.name = name;
    }
    if (attributes) {
      console.warn('DEPRECATION createConversation options.attributes param: Use options[propertyName] instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
      attr.attr = attributes;
    }
    attr = new JsonObjectMessage({
      data: _JSON$stringify(attr)
    });

    var startCommandJson = {
      m: members,
      attr: attr,
      transient: transient,
      unique: unique
    };

    return _Promise.resolve(new GenericCommand({
      cmd: 'conv',
      op: 'start',
      convMessage: new ConvCommand(startCommandJson)
    })).then(function (command) {
      if (_this10.options.conversationSignatureFactory) {
        var _params = [null, _this10.id, members, 'create'];
        return runSignatureFactory(_this10.options.conversationSignatureFactory, _params).then(function (signatureResult) {
          _Object$assign(command.convMessage, keyRemap({
            signature: 's',
            timestamp: 't',
            nonce: 'n'
          }, signatureResult));
          return command;
        });
      }
      return command;
    }).then(this._send.bind(this)).then(function (resCommand) {
      return new Conversation(_extends({
        name: name,
        attr: attributes,
        transient: transient,
        unique: unique,
        id: resCommand.convMessage.cid,
        createdAt: resCommand.convMessage.cdate,
        updatedAt: resCommand.convMessage.cdate,
        lastMessageAt: null,
        creator: _this10.id,
        members: transient ? [] : members
      }, properties), _this10);
    }).then(tap(function (conversation) {
      return _this10._conversationCache.set(conversation.id, conversation);
    }));
  };

  /**
   * 将指定的所有会话标记为已读
   *
   * @param {Conversation[]} conversations 指定的会话列表
   * @return {Promise.<Conversation[]>} conversations 返回输入的会话列表
   */


  IMClient.prototype.markAllAsRead = function markAllAsRead(conversations) {
    if (!Array.isArray(conversations)) {
      throw new TypeError(conversations + ' is not an Array');
    }
    var ids = conversations.map(function (conversation) {
      if (!(conversation instanceof Conversation)) {
        throw new TypeError(conversation + ' is not a Conversation');
      }
      return conversation.id;
    });
    this._debug('mark [' + ids + '] as read');
    if (!conversations.length) {
      return _Promise.resolve([]);
    }
    return this._send(new GenericCommand({
      cmd: 'read',
      readMessage: new ReadCommand({
        convs: conversations.map(function (conversation) {
          return new ReadTuple({
            cid: conversation.id,
            timestamp: (conversation.lastMessageAt || new Date()).getTime()
          });
        })
      })
    }), false).then(function () {
      // eslint-disable-next-line no-param-reassign
      conversations.forEach(function (conversation) {
        return conversation.unreadMessagesCount = 0;
      });
      return conversations;
    });
  };

  return IMClient;
}(Client);

var debug$5 = d('LC:Conversation');

var Conversation = function (_EventEmitter) {
  _inherits(Conversation, _EventEmitter);

  /**
   * 无法直接实例化，请使用 {@link IMClient#createConversation} 创建新的对话
   * @extends EventEmitter
   */
  function Conversation(_ref, client) {
    var id = _ref.id;
    var creator = _ref.creator;
    var createdAt = _ref.createdAt;
    var updatedAt = _ref.updatedAt;
    var lastMessageAt = _ref.lastMessageAt;
    var lastMessage = _ref.lastMessage;
    var _ref$mutedMembers = _ref.mutedMembers;
    var mutedMembers = _ref$mutedMembers === undefined ? [] : _ref$mutedMembers;
    var _ref$members = _ref.members;
    var members = _ref$members === undefined ? [] : _ref$members;
    var _ref$transient = _ref.transient;
    var transient = _ref$transient === undefined ? false : _ref$transient;
    var _ref$muted = _ref.muted;
    var muted = _ref$muted === undefined ? false : _ref$muted;

    var attributes = _objectWithoutProperties(_ref, ['id', 'creator', 'createdAt', 'updatedAt', 'lastMessageAt', 'lastMessage', 'mutedMembers', 'members', 'transient', 'muted']);

    _classCallCheck(this, Conversation);

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    _Object$assign(_this, {
      /**
       * 对话 id，对应 _Conversation 表中的 objectId
       * @memberof Conversation#
       * @type {String}
       */
      id: id,
      /**
       * 对话创建者
       * @memberof Conversation#
       * @type {String}
       */
      creator: creator,
      /**
       * 对话创建时间
       * @memberof Conversation#
       * @type {Date}
       */
      createdAt: createdAt,
      /**
       * 对话更新时间
       * @memberof Conversation#
       * @type {Date}
       */
      updatedAt: updatedAt,
      /**
       * 最后一条消息时间
       * @memberof Conversation#
       * @type {Date}
       */
      lastMessageAt: lastMessageAt,
      /**
       * 最后一条消息
       * @memberof Conversation#
       * @type {?Message}
       */
      lastMessage: lastMessage,
      /**
       * 对该对话设置了静音的用户列表
       * @memberof Conversation#
       * @type {?String[]}
       */
      mutedMembers: mutedMembers,
      /**
       * 参与该对话的用户列表
       * @memberof Conversation#
       * @type {String[]}
       */
      members: members,
      /**
       * 暂态对话标记
       * @memberof Conversation#
       * @type {Boolean}
       */
      transient: transient,
      /**
       * 当前用户静音该对话标记
       * @memberof Conversation#
       * @type {Boolean}
       */
      muted: muted
    });
    _this._attributes = attributes;
    _this._reset();
    /**
     * 当前用户在该对话的未读消息数
     * @memberof Conversation#
     * @type {Number}
     */
    _this.unreadMessagesCount = 0;
    _this.members = _Array$from(new _Set(_this.members));
    internal(_this).messagesWaitingForReciept = {};
    if (client instanceof IMClient) {
      _this._client = client;
    } else {
      throw new TypeError('Conversation must be initialized with a client');
    }
    ['kicked', 'membersjoined', 'membersleft', 'message'].forEach(function (event) {
      return _this.on(event, function (payload) {
        return _this._debug(event + ' event emitted.', payload);
      });
    });
    // onConversationCreate hook
    applyDecorators(_this._client._plugins.onConversationCreate, _this);
    return _this;
  }

  /**
   * 设置对话额外属性
   * @param {Object} map    key-value 对
   * @param {Boolean} [assign=false] 使用 Object.assign 更新属性，而不是替换整个 attributes
   * @return {Conversation} self
   * @deprecated Use {@link Conversation#set} instead. See {@link https://url.leanapp.cn/DeprecateAttributes} for more details.
   */
  Conversation.prototype.setAttributes = function setAttributes(map) {
    var _this2 = this;

    var assign = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    console.warn('DEPRECATION Conversation#setAttributes: Use conversation.set() instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
    this._debug('set attributes: value=' + _JSON$stringify(map) + ', assign=' + assign);
    if (!isPlainObject(map)) {
      throw new TypeError('attributes must be a plain object');
    }
    if (!assign) {
      this.set('attr', map);
    } else {
      _Object$keys(map).forEach(function (key) {
        return _this2.setAttribute(key, map[key]);
      });
    }
    return this;
  };
  /**
   * 设置对话额外属性
   * @param {String} key
   * @param {Any} value
   * @return {Conversation} self
   * @deprecated Use {@link Conversation#set conversation.set('attr.key', value)} instead
   */


  Conversation.prototype.setAttribute = function setAttribute(key, value) {
    console.warn('DEPRECATION Conversation#setAttribute: Use conversation.set(\'attr.key\', value) instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
    return this.set('attr.' + key, value);
  };
  /**
   * 对话名字，对应 _Conversation 表中的 name
   * @type {String}
   */


  /**
   * 设置对话名字
   * @param {String} value
   * @return {Conversation} self
   * @deprecated Use {@link Conversation#set conversation.set('name', value)} instead
   */
  Conversation.prototype.setName = function setName(value) {
    console.warn('DEPRECATION Conversation#setName: Use conversation.set(\'name\', value) instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
    return this.set('name', value);
  };

  /**
   * 获取对话的自定义属性
   * @since 3.2.0
   * @param  {String} key key 属性的键名，'x' 对应 Conversation 表中的 x 列
   * @return {Any} 属性的值
   */


  Conversation.prototype.get = function get(key) {
    return internal(this).currentAttributes[key];
  };

  /**
   * 设置对话的自定义属性
   * @since 3.2.0
   * @param {String} key 属性的键名，'x' 对应 Conversation 表中的 x 列，支持使用 'x.y.z' 来修改对象的部分字段。
   * @param {Any} value 属性的值
   * @return {Conversation} self
   * @example
   *
   * // 设置对话的 color 属性
   * conversation.set('color', {
   *   text: '#000',
   *   background: '#DDD',
   * });
   * // 设置对话的 color.text 属性
   * conversation.set('color.text', '#333');
   */


  Conversation.prototype.set = function set(key, value) {
    this._debug('set [' + key + ']: ' + value);
    var pendingAttributes = internal(this).pendingAttributes;
    var pendingKeys = _Object$keys(pendingAttributes);
    // suppose pendingAttributes = { 'a.b': {} }
    // set 'a' or 'a.b': delete 'a.b'
    var re = new RegExp('^' + key);
    var childKeys = pendingKeys.filter(re.test.bind(re));
    childKeys.forEach(function (k) {
      delete pendingAttributes[k];
    });
    if (childKeys.length) {
      pendingAttributes[key] = value;
    } else {
      // set 'a.c': nothing to do
      // set 'a.b.c.d': assign c: { d: {} } to 'a.b'
      // CAUTION: non-standard API, provided by core-js
      var parentKey = _Array$find(pendingKeys, function (k) {
        return key.indexOf(k) === 0;
      }); // 'a.b'
      if (parentKey) {
        setValue(pendingAttributes[parentKey], key.slice(parentKey.length + 1), value);
      } else {
        pendingAttributes[key] = value;
      }
    }
    // build currentAttributes
    internal(this).currentAttributes = _Object$keys(pendingAttributes).reduce(function (target, k) {
      return setValue(target, k, pendingAttributes[k]);
    }, cloneDeep(this._attributes));
    return this;
  };

  Conversation.prototype._reset = function _reset() {
    internal(this).pendingAttributes = {};
    internal(this).currentAttributes = this._attributes;
  };

  Conversation.prototype._debug = function _debug() {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    debug$5.apply(undefined, params.concat(['[' + this.id + ']']));
  };

  Conversation.prototype._send = function _send(command) {
    var _client;

    /* eslint-disable no-param-reassign */
    if (command.cmd === null) {
      command.cmd = 'conv';
    }
    if (command.cmd === 'conv' && command.convMessage === null) {
      command.convMessage = new ConvCommand();
    }
    if (command.convMessage && command.convMessage.cid === null) {
      command.convMessage.cid = this.id;
    }
    /* eslint-enable no-param-reassign */

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return (_client = this._client)._send.apply(_client, [command].concat(args));
  };
  /**
   * 保存当前对话的属性至服务器
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.save = function save() {
    var _this3 = this;

    this._debug('save');
    var attr = internal(this).pendingAttributes;
    if (isEmpty(attr)) {
      this._debug('nothing touched, resolve with self');
      return _Promise.resolve(this);
    }
    this._debug('attr: ' + _JSON$stringify(attr));
    var convMessage = new ConvCommand({
      attr: new JsonObjectMessage({
        data: _JSON$stringify(attr)
      })
    });
    return this._send(new GenericCommand({
      op: 'update',
      convMessage: convMessage
    })).then(function (resCommand) {
      _this3.updatedAt = resCommand.convMessage.udate;
      _this3._attributes = internal(_this3).currentAttributes;
      internal(_this3).pendingAttributes = {};
      return _this3;
    });
  };

  /**
   * 从服务器更新对话的属性
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.fetch = function fetch() {
    var _this4 = this;

    return this._client.getQuery().equalTo('objectId', this.id).find().then(function () {
      return _this4;
    });
  };

  /**
   * 静音，客户端拒绝收到服务器端的离线推送通知
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.mute = function mute() {
    var _this5 = this;

    this._debug('mute');
    return this._send(new GenericCommand({
      op: 'mute'
    })).then(function () {
      if (!_this5.transient) {
        _this5.muted = true;
        _this5.mutedMembers = union(_this5.mutedMembers, [_this5._client.id]);
      }
      return _this5;
    });
  };

  /**
   * 取消静音
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.unmute = function unmute() {
    var _this6 = this;

    this._debug('unmute');
    return this._send(new GenericCommand({
      op: 'unmute'
    })).then(function () {
      if (!_this6.transient) {
        _this6.muted = false;
        _this6.mutedMembers = difference(_this6.mutedMembers, [_this6._client.id]);
      }
      return _this6;
    });
  };

  /**
   * 获取对话人数，或暂态对话的在线人数
   * @return {Promise.<Number>}
   */


  Conversation.prototype.count = function count() {
    this._debug('unmute');
    return this._send(new GenericCommand({
      op: 'count'
    })).then(function (resCommand) {
      return resCommand.convMessage.count;
    });
  };

  /**
   * 增加成员
   * @param {String|String[]} clientIds 新增成员 client id
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.add = function add(clientIds) {
    var _this7 = this;

    this._debug('add', clientIds);
    if (typeof clientIds === 'string') {
      clientIds = [clientIds]; // eslint-disable-line no-param-reassign
    }
    var convMessage = new ConvCommand({
      m: clientIds
    });
    return _Promise.resolve(new GenericCommand({
      op: 'add',
      convMessage: convMessage
    })).then(function (command) {
      if (_this7._client.options.conversationSignatureFactory) {
        var _params = [_this7.id, _this7._client.id, clientIds.sort(), 'add'];
        return runSignatureFactory(_this7._client.options.conversationSignatureFactory, _params).then(function (signatureResult) {
          _Object$assign(command.convMessage, keyRemap({
            signature: 's',
            timestamp: 't',
            nonce: 'n'
          }, signatureResult));
          return command;
        });
      }
      return command;
    }).then(this._send.bind(this)).then(function () {
      if (!_this7.transient) {
        _this7.members = union(_this7.members, clientIds);
      }
      return _this7;
    });
  };

  /**
   * 剔除成员
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.remove = function remove(clientIds) {
    var _this8 = this;

    this._debug('remove', clientIds);
    if (typeof clientIds === 'string') {
      clientIds = [clientIds]; // eslint-disable-line no-param-reassign
    }
    var convMessage = new ConvCommand({
      m: clientIds
    });
    return _Promise.resolve(new GenericCommand({
      op: 'remove',
      convMessage: convMessage
    })).then(function (command) {
      if (_this8._client.options.conversationSignatureFactory) {
        var _params2 = [_this8.id, _this8._client.id, clientIds.sort(), 'remove'];
        return runSignatureFactory(_this8._client.options.conversationSignatureFactory, _params2).then(function (signatureResult) {
          _Object$assign(command.convMessage, keyRemap({
            signature: 's',
            timestamp: 't',
            nonce: 'n'
          }, signatureResult));
          return command;
        });
      }
      return command;
    }).then(this._send.bind(this)).then(function () {
      if (!_this8.transient) {
        _this8.members = difference(_this8.members, clientIds);
      }
      return _this8;
    });
  };

  /**
   * （当前用户）加入该对话
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.join = function join() {
    this._debug('join');
    return this.add(this._client.id);
  };

  /**
   * （当前用户）退出该对话
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.quit = function quit() {
    this._debug('quit');
    return this.remove(this._client.id);
  };

  /**
   * 发送消息
   * @param  {Message} message 消息，Message 及其子类的实例
   * @return {Promise.<Message>} 发送的消息
   */


  Conversation.prototype.send = function send(message) {
    var _this9 = this;

    this._debug(message, 'send');
    if (!(message instanceof Message)) {
      throw new TypeError(message + ' is not a Message');
    }
    if (message.needReceipt) {
      if (this.transient) {
        console.warn('message needReceipt option is ignored as the conversation is transient.');
      } else if (message.transient) {
        console.warn('message needReceipt option is ignored as the message is transient.');
      } else if (this.members.length > 2) {
        console.warn('message with needReceipt option is recommended to be sent in one-on-one conversation.'); // eslint-disable-line max-len
      }
    }
    _Object$assign(message, {
      cid: this.id,
      from: this._client.id
    });
    message._setStatus(MessageStatus.SENDING);
    var msg = message.toJSON();
    if (typeof msg !== 'string') {
      msg = _JSON$stringify(msg);
    }
    var sendPromise = this._send(new GenericCommand({
      cmd: 'direct',
      directMessage: new DirectCommand({
        msg: msg,
        cid: this.id,
        r: message.needReceipt,
        transient: message.transient,
        dt: message.id
      })
    }), !message.transient);
    if (!message.transient) {
      sendPromise = sendPromise.then(function (resCommand) {
        var _resCommand$ackMessag = resCommand.ackMessage;
        var uid = _resCommand$ackMessag.uid;
        var t = _resCommand$ackMessag.t;
        var code = _resCommand$ackMessag.code;
        var reason = _resCommand$ackMessag.reason;
        var appCode = _resCommand$ackMessag.appCode;

        if (code !== null) {
          throw createError({
            code: code, reason: reason, appCode: appCode
          });
        }
        _Object$assign(message, {
          id: uid,
          timestamp: new Date(t.toNumber())
        });
        _this9.lastMessage = message;
        _this9.lastMessageAt = message.timestamp;
      });
    }
    return sendPromise.then(function () {
      message._setStatus(MessageStatus.SENT);
      if (message.needReceipt) {
        internal(_this9).messagesWaitingForReciept[message.id] = message;
      }
      return message;
    }, function (error) {
      message._setStatus(MessageStatus.FAILED);
      throw error;
    });
  };

  /**
   * 查询消息记录
   * 如果仅需实现消息记录翻页查询需求，建议使用 {@link Conversation#createMessagesIterator}
   * @param  {Object} [options]
   * @param  {Date}   [options.beforeTime] 限制查询结果为小于这个该时间之前的消息，不传则为当前时间
   * @param  {String} [options.beforeMessageId] 限制查询结果为该消息之前的消息，需要与 beforeTime 同时使用，为防止某时刻有重复消息
   * @param  {Date}   [options.afterTime] 限制查询结果为大于这个该时间之前的消息
   * @param  {String} [options.afterMessageId] 限制查询结果为该消息之后的消息，需要与 afterTime 同时使用，为防止某时刻有重复消息
   * @param  {Number} [options.limit] 限制查询结果的数量，目前服务端默认为 20
   * @return {Promise.<Message[]>} 消息列表
   */


  Conversation.prototype.queryMessages = function queryMessages() {
    var _this10 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this._debug('query messages', options);
    if (options.beforeMessageId && !options.beforeTime) {
      throw new Error('query option beforeMessageId must be used with option beforeTime');
    }
    if (options.afterMessageId && !options.afterTime) {
      throw new Error('query option afterMessageId must be used with option afterTime');
    }
    var conditions = keyRemap({
      beforeTime: 't',
      beforeMessageId: 'mid',
      afterTime: 'tt',
      afterMessageId: 'tmid',
      limit: 'l'
    }, options);
    if (conditions.t instanceof Date) {
      conditions.t = conditions.t.getTime();
    }
    if (conditions.tt instanceof Date) {
      conditions.tt = conditions.tt.getTime();
    }
    return this._send(new GenericCommand({
      cmd: 'logs',
      logsMessage: new LogsCommand(_Object$assign(conditions, {
        cid: this.id
      }))
    })).then(function (resCommand) {
      return _Promise.all(resCommand.logsMessage.logs.map(function (log) {
        return _this10._client._messageParser.parse(log.data).then(function (message) {
          var messageProps = {
            id: log.msgId,
            cid: _this10.id,
            timestamp: new Date(log.timestamp.toNumber()),
            from: log.from
          };
          _Object$assign(message, messageProps);
          message._setStatus(MessageStatus.SENT);
          return message;
        });
      }));
    });
  };

  /**
   * 获取消息翻页迭代器
   * @param  {Object} [options]
   * @param  {Date}   [options.beforeTime] 限制起始查询结果为小于这个该时间之前的消息，不传则为当前时间
   * @param  {String} [options.beforeMessageId] 限制起始查询结果为该消息之前的消息，需要与 beforeTime 同时使用，为防止某时刻有重复消息
   * @param  {Number} [options.limit] 限制每页查询结果的数量，目前服务端默认为 20
   * @return {AsyncIterater.<Promise.<IteratorResult<Message[]>>>} [AsyncIterator]{@link https://github.com/tc39/proposal-async-iteration}，调用其 next 方法返回获取下一页消息的 Promise
   * @example
   * var messageIterator = conversation.createMessagesIterator({ limit: 10 });
   * messageIterator.next().then(function(result) {
   *   // result: {
   *   //   value: [message1, ..., message10],
   *   //   done: false,
   *   // }
   * });
   * messageIterator.next().then(function(result) {
   *   // result: {
   *   //   value: [message11, ..., message20],
   *   //   done: false,
   *   // }
   * });
   * messageIterator.next().then(function(result) {
   *   // No more messages
   *   // result: { value: [], done: true }
   * });
   */


  Conversation.prototype.createMessagesIterator = function createMessagesIterator() {
    var _this11 = this;

    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var beforeTime = _ref2.beforeTime;
    var beforeMessageId = _ref2.beforeMessageId;
    var limit = _ref2.limit;

    var promise = void 0;
    return {
      next: function next() {
        if (promise === undefined) {
          // first call
          promise = _this11.queryMessages({
            limit: limit,
            beforeTime: beforeTime,
            beforeMessageId: beforeMessageId
          });
        } else {
          promise = promise.then(function (prevMessages) {
            if (prevMessages.length === 0 || prevMessages.length < limit) {
              // no more messages
              return [];
            }
            return _this11.queryMessages({
              beforeTime: prevMessages[0].timestamp,
              beforeMessageId: prevMessages[0].id,
              limit: limit
            });
          });
        }
        return promise.then(function (value) {
          return {
            value: _Array$from(value),
            done: value.length === 0 || value.length < limit
          };
        });
      }
    };
  };

  /**
   * 将该会话标记为已读
   * @return {Promise.<Conversation>} self
   */


  Conversation.prototype.markAsRead = function markAsRead() {
    var _this12 = this;

    return this._client.markAllAsRead([this]).then(function () {
      return _this12;
    });
  };

  Conversation.prototype._handleReceipt = function _handleReceipt(_ref3) {
    var messageId = _ref3.messageId;
    var deliveredAt = _ref3.deliveredAt;

    var _internal = internal(this);

    var messagesWaitingForReciept = _internal.messagesWaitingForReciept;

    var message = messagesWaitingForReciept[messageId];
    delete messagesWaitingForReciept[messageId];
    if (!message) return;
    message._setStatus(MessageStatus.DELIVERED);
    message.deliveredAt = deliveredAt;
    /**
     * 消息已送达。只有在发送时设置了需要回执的情况下才会收到送达回执，该回执并不代表用户已读。
     * @event Conversation#receipt
     * @since 3.2.0
     * @param {Object} payload
     * @param {Message} payload.message 送达的消息
     */
    this.emit('receipt', { message: message });
  };

  _createClass(Conversation, [{
    key: 'createdAt',
    set: function set(value) {
      this._createdAt = decodeDate(value);
    },
    get: function get() {
      return this._createdAt;
    }
  }, {
    key: 'updatedAt',
    set: function set(value) {
      this._updatedAt = decodeDate(value);
    },
    get: function get() {
      return this._updatedAt;
    }
  }, {
    key: 'lastMessageAt',
    set: function set(value) {
      this._lastMessageAt = decodeDate(value);
    },
    get: function get() {
      return this._lastMessageAt;
    }

    /**
     * 对话额外属性，对应 _Conversation 表中的 attr
     * @type {Object}
     * @deprecated Use {@link Conversation#get conversation.get('attr')},
     * {@link Conversation#set conversation.set('attr', value)} instead
     */

  }, {
    key: 'attributes',
    get: function get() {
      console.warn('DEPRECATION Conversation.attributes: Use conversation.get(\'attr\') instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
      return this.get('attr');
    },
    set: function set(value) {
      console.warn('DEPRECATION Conversation.attributes: Use conversation.set(\'attr\', value) instead. See https://url.leanapp.cn/DeprecateAttributes for more details.');
      this.set('attr', value);
    }
  }, {
    key: 'name',
    get: function get() {
      return this.get('name');
    },
    set: function set(value) {
      this.set('name', value);
    }
  }]);

  return Conversation;
}(EventEmitter);

var _class$1;
function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var debug$9 = d('LC:MessageParser');

var tryParseJson = function tryParseJson(target, key, descriptor) {
  var fn = descriptor.value;
  // eslint-disable-next-line no-param-reassign
  descriptor.value = function wrapper(param) {
    var content = void 0;
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

var applyPlugins = function applyPlugins(target, key, descriptor) {
  var fn = descriptor.value;
  // eslint-disable-next-line no-param-reassign
  descriptor.value = function wrapper(json) {
    var _this = this;

    return _Promise.resolve(json).then(applyMiddlewares(this._plugins.beforeMessageParse)).then(function (decoratedJson) {
      return fn.call(_this, decoratedJson);
    }).then(applyMiddlewares(this._plugins.afterMessageParse));
  };
};

var MessageParser = (_class$1 = function () {
  function MessageParser() {
    var plugins = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, MessageParser);

    this._plugins = plugins;
    this._messageClasses = [];
  }

  MessageParser.prototype.register = function register(messageClass) {
    if (messageClass && messageClass.parse && messageClass.prototype && messageClass.prototype.toJSON) {
      this._messageClasses.unshift(messageClass);
    } else {
      throw new TypeError('Invalid messageClass');
    }
  };

  // jsdoc-ignore-start


  // jsdoc-ignore-end
  MessageParser.prototype.parse = function parse(content) {
    debug$9('parsing message:', content);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(this._messageClasses), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var Klass = _step.value;

        var contentCopy = isPlainObject(content) ? _Object$assign({}, content) : content;
        var valid = void 0;
        var result = void 0;
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
              error: error,
              Klass: Klass,
              content: contentCopy
            });
          }
          if (result !== undefined) {
            debug$9('parse result:', result);
            return result;
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    throw new Error('No Message Class matched');
  };

  return MessageParser;
}(), (_applyDecoratedDescriptor$1(_class$1.prototype, 'parse', [tryParseJson, applyPlugins], _Object$getOwnPropertyDescriptor(_class$1.prototype, 'parse'), _class$1.prototype)), _class$1);

/* eslint-disable no-param-reassign */
// documented in ../index.js
var messageType = function messageType(type) {
  if (typeof type !== 'number') {
    throw new TypeError(type + ' is not a Number');
  }
  return function (target) {
    target.TYPE = type;
    target.validate = function (json) {
      return json._lctype === type;
    };
    target.prototype._getType = function () {
      return { _lctype: type };
    };
  };
};

// documented in ../index.js
var messageField = function messageField(fields) {
  if (typeof fields !== 'string') {
    if (!Array.isArray(fields)) {
      throw new TypeError(fields + ' is not an Array');
    } else if (fields.some(function (value) {
      return typeof value !== 'string';
    })) {
      throw new TypeError('fields contains non-string typed member');
    }
  }
  return function (target) {
    // IE10 Hack:
    // static properties in IE10 will not be inherited from super
    // search for parse method and assign it manually
    var originalCustomFields = isIE10 ? getStaticProperty(target, '_customFields') : target._customFields;
    originalCustomFields = Array.isArray(originalCustomFields) ? originalCustomFields : [];
    target._customFields = originalCustomFields.concat(fields);
  };
};

// IE10 Hack:
// static properties in IE10 will not be inherited from super
// search for parse method and assign it manually

var IE10Compatible = function IE10Compatible(target) {
  if (isIE10) {
    target.parse = getStaticProperty(target, 'parse');
  }
};

var _dec$1;
var _class$3;
// jsdoc-ignore-start

// jsdoc-ignore-end
var TypedMessage = (_dec$1 = messageField(['_lctext', '_lcattrs']), _dec$1(_class$3 = function (_Message) {
  _inherits(TypedMessage, _Message);

  /**
   * 所有内置的富媒体消息均继承自本类
   * @extends Message
   */
  function TypedMessage() {
    _classCallCheck(this, TypedMessage);

    var _this = _possibleConstructorReturn(this, _Message.call(this));

    _this._ = {};
    return _this;
  }

  /**
   * @type {Number}
   * @readonly
   */


  /**
   * @param {String} text
   * @return {TypedMessage} self
   */
  TypedMessage.prototype.setText = function setText(text) {
    this._lctext = text;
    return this;
  };
  /**
   * @return {String}
   */


  TypedMessage.prototype.getText = function getText() {
    return this._lctext;
  };

  /**
   * @param {Object} attributes
   * @return {TypedMessage} self
   */


  TypedMessage.prototype.setAttributes = function setAttributes(attributes) {
    this._lcattrs = attributes;
    return this;
  };
  /**
   * @return {Object}
   */


  TypedMessage.prototype.getAttributes = function getAttributes() {
    return this._lcattrs;
  };

  TypedMessage.prototype._getCustomFields = function _getCustomFields() {
    var _this2 = this;

    var fields = Array.isArray(this.constructor._customFields) ? this.constructor._customFields : [];
    return fields.reduce(function (result, field) {
      if (typeof field !== 'string') return result;
      result[field] = _this2[field]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
  };

  TypedMessage.prototype._getType = function _getType() {
    throw new Error('not implemented');
  };

  TypedMessage.prototype.toJSON = function toJSON() {
    return _Object$assign({
      _lctext: this.getText(),
      _lcattrs: this.getAttributes()
    }, this._getCustomFields(), this._getType());
  };

  /**
   * 解析处理消息内容
   * <pre>
   * 为给定的 message 设置 text 与 attributes 属性，返回该 message
   * 如果子类没有提供 message，new this()
   * @protected
   * @param  {Object}  json    json 格式的消息内容
   * @param  {TypedMessage} message 子类提供的 message
   * @return {TypedMessage}
   * @implements AVMessage.parse
   */


  TypedMessage.parse = function parse(json) {
    var message = arguments.length <= 1 || arguments[1] === undefined ? new this() : arguments[1];

    message.content = json; // eslint-disable-line no-param-reassign
    var customFields = isIE10 ? getStaticProperty(message.constructor, '_customFields') : message.constructor._customFields;
    var fields = Array.isArray(customFields) ? customFields : [];
    fields = fields.reduce(function (result, field) {
      if (typeof field !== 'string') return result;
      result[field] = json[field]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
    _Object$assign(message, fields);
    return _Message.parse.call(this, json, message);
  };

  _createClass(TypedMessage, [{
    key: 'type',
    get: function get() {
      return this.constructor.TYPE;
    }

    /** @type {String} */

  }, {
    key: 'text',
    set: function set(text) {
      return this.setText(text);
    },
    get: function get() {
      return this.getText();
    }

    /** @type {Object} */

  }, {
    key: 'attributes',
    set: function set(attributes) {
      return this.setAttributes(attributes);
    },
    get: function get() {
      return this.getAttributes();
    }
  }]);

  return TypedMessage;
}(Message)) || _class$3);

var _dec;
var _class$2;
// jsdoc-ignore-start

// jsdoc-ignore-end
var TextMessage = (_dec = messageType(-1), _dec(_class$2 = IE10Compatible(_class$2 = function (_TypedMessage) {
  _inherits(TextMessage, _TypedMessage);

  /**
   * 文类类型消息
   * @extends TypedMessage
   * @param  {String} [text='']
   * @throws {TypeError} text 不是 String 类型
   */
  function TextMessage() {
    var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    _classCallCheck(this, TextMessage);

    if (typeof text !== 'string') {
      throw new TypeError(text + ' is not a string');
    }

    var _this = _possibleConstructorReturn(this, _TypedMessage.call(this));

    _this.setText(text);
    return _this;
  }

  return TextMessage;
}(TypedMessage)) || _class$2) || _class$2);

var debug = d('LC:Realtime');

var pushRouterCache = new Cache('push-router');

var Realtime = function (_EventEmitter) {
  _inherits(Realtime, _EventEmitter);

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
  function Realtime(options) {
    _classCallCheck(this, Realtime);

    debug('initializing Realtime');

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    if (typeof options.appId !== 'string') {
      throw new TypeError('appId [' + options.appId + '] is not a string');
    }
    _this._options = _Object$assign({
      appId: undefined,
      region: 'cn',
      pushOfflineMessages: false,
      ssl: true
    }, options);
    _this._id = uuid.v4();
    _this._cache = new Cache('endpoints');
    _this._clients = {};
    _this._plugins = ensureArray(options.plugins).reduce(function (result, plugin) {
      // eslint-disable-next-line no-restricted-syntax
      for (var hook in plugin) {
        if ({}.hasOwnProperty.call(plugin, hook) && hook !== 'name') {
          if (plugin.name) {
            ensureArray(plugin[hook]).forEach(function (value) {
              // eslint-disable-next-line no-param-reassign
              value._pluginName = plugin.name;
            });
          }
          // eslint-disable-next-line no-param-reassign
          result[hook] = ensureArray(result[hook]).concat(plugin[hook]);
        }
      }
      return result;
    }, {});
    _this._messageParser = new MessageParser(_this._plugins);
    _this.register([Message, TextMessage]);
    // onRealtimeCreate hook
    applyDecorators(_this._plugins.onRealtimeCreate, _this);
    // messageClasses alias
    _this.register(ensureArray(_this._plugins.messageClasses));
    return _this;
  }

  Realtime.prototype._open = function _open() {
    var _this2 = this;

    if (this._openPromise) return this._openPromise;

    var format = 'protobuf';
    if (this._options.noBinary) {
      // 不发送 binary data，fallback to base64 string
      format = 'protobase64';
    }
    var version = 3;
    if (this._options.pushOfflineMessages) {
      // 不推送离线消息，而是发送对话的未读通知
      version = 1;
    }
    var protocol = {
      format: format,
      version: version
    };
    this._openPromise = new _Promise(function (resolve, reject) {
      debug('No connection established, create a new one.');
      var connection = new Connection(function () {
        return _this2._getEndpoints(_this2._options);
      }, protocol);
      connection.binaryType = 'arraybuffer';
      connection.on('open', function () {
        return resolve(connection);
      });
      connection.on('error', reject);
      connection.on('message', _this2._dispatchMessage.bind(_this2));
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
      ['disconnect', 'reconnect', 'retry', 'schedule'].forEach(function (event) {
        return connection.on(event, function () {
          for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
            payload[_key] = arguments[_key];
          }

          debug.apply(undefined, [event + ' event emitted.'].concat(payload));
          _this2.emit.apply(_this2, [event].concat(payload));
          if (event !== 'reconnect') {
            _Object$values(_this2._clients).forEach(function (client) {
              client.emit.apply(client, [event].concat(payload));
            });
          }
        });
      });
      // override handleClose
      connection.handleClose = function handleClose(event) {
        // CAUTION: non-standard API, provided by core-js
        var fatalError = _Array$find([APP_NOT_AVAILABLE, INVALID_LOGIN, INVALID_ORIGIN], function (error) {
          return error.code === event.code;
        });
        if (fatalError) {
          // in these cases, SDK should throw.
          var error = new Error('' + (fatalError.message || event.reason));
          error.code = event.code;
          this.throw(error);
        } else {
          // reconnect
          this.disconnect();
        }
      };
      internal(_this2).connection = connection;
    });

    return this._openPromise;
  };

  Realtime.prototype._getEndpoints = function _getEndpoints(options) {
    var _this3 = this;

    return _Promise.resolve(this._cache.get('endpoints') || this.constructor._fetchEndpointsInfo(options).then(tap(function (info) {
      return _this3._cache.set('endpoints', info, info.ttl * 1000);
    }))).then(function (info) {
      debug('endpoint info:', info);
      return [info.server, info.secondary];
    });
  };

  Realtime._fetchPushRouter = function _fetchPushRouter(_ref) {
    var appId = _ref.appId;
    var region = _ref.region;

    debug('fetch router');
    switch (region) {
      case 'cn':
        {
          var cachedPushRouter = pushRouterCache.get(appId);
          if (cachedPushRouter) {
            return _Promise.resolve(cachedPushRouter);
          }
          return axios.get('https://app-router.leancloud.cn/1/route', {
            params: {
              appId: appId
            },
            timeout: 20000
          }).then(function (res) {
            return res.data;
          }).then(tap(debug)).then(function (route) {
            var pushRouter = route.push_router_server;
            if (!pushRouter) {
              throw new Error('push router not exists');
            }
            var ttl = route.ttl;
            if (typeof ttl !== 'number') {
              ttl = 3600;
            }
            pushRouterCache.set(appId, pushRouter, ttl * 1000);
            return pushRouter;
          }).catch(function () {
            return 'router-g0-push.leancloud.cn';
          });
        }
      case 'us':
        return _Promise.resolve('router-a0-push.leancloud.cn');
      default:
        throw new Error('Region [' + region + '] is not supported.');
    }
  };

  Realtime._fetchEndpointsInfo = function _fetchEndpointsInfo(_ref2) {
    var appId = _ref2.appId;
    var region = _ref2.region;
    var ssl = _ref2.ssl;
    var server = _ref2.server;

    debug('fetch endpoint info');
    return this._fetchPushRouter({ appId: appId, region: region }).then(tap(debug)).then(function (router) {
      return axios.get('https://' + router + '/v1/route', {
        params: {
          appId: appId,
          secure: ssl,
          server: server,
          _t: Date.now()
        },
        timeout: 20000
      }).then(function (res) {
        return res.data;
      }).then(tap(debug));
    });
  };

  Realtime.prototype._close = function _close() {
    if (this._openPromise) {
      this._openPromise.then(function (connection) {
        return connection.close();
      });
    }
    delete this._openPromise;
  };

  /**
   * 手动进行重连。
   * SDK 在网络出现异常时会自动按照一定的时间间隔尝试重连，调用该方法会立即尝试重连并重置重连尝试计数器。
   * 只能在 `schedule` 事件之后，`retry` 事件之前调用，如果当前网络正常或者正在进行重连，调用该方法会抛异常。
   */


  Realtime.prototype.retry = function retry() {
    var connection = internal(this).connection;
    if (!connection) {
      throw new Error('no connection established');
    }
    if (connection.cannot('retry')) {
      throw new Error('retrying not allowed when not offline. the connection is now ' + connection.current);
    }
    return connection.retry();
  };

  Realtime.prototype._register = function _register(client) {
    if (!(client instanceof Client)) {
      throw new TypeError(client + ' is not a Client');
    }
    if (!client.id) {
      throw new Error('Client must have an id to be registered');
    }
    this._clients[client.id] = client;
  };

  Realtime.prototype._deregister = function _deregister(client) {
    if (!(client instanceof Client)) {
      throw new TypeError(client + ' is not a Client');
    }
    if (!client.id) {
      throw new Error('Client must have an id to be deregistered');
    }
    delete this._clients[client.id];
    if (_Object$getOwnPropertyNames(this._clients).length === 0) {
      this._close();
    }
  };

  Realtime.prototype._dispatchMessage = function _dispatchMessage(message) {
    if (message.peerId !== null) {
      var targetClient = this._clients[message.peerId];
      if (targetClient) {
        return _Promise.resolve(targetClient).then(function (client) {
          return client._dispatchMessage(message);
        }).catch(debug);
      }
      return debug('[WARN] Unexpected message received without any live client match', trim(message));
    }
    return debug('[WARN] Unexpected message received without peerId', trim(message));
  };

  /**
   * 创建一个即时通讯客户端，多次创建相同 id 的客户端会返回同一个实例
   * @param  {String} [id] 客户端 id，如果不指定，服务端会随机生成一个
   * @param  {Object} [clientOptions] 详细参数 @see {@link IMClient}
   * @param  {String} [tag] 客户端类型标记，以支持单点登录功能
   * @return {Promise.<IMClient>}
   */


  Realtime.prototype.createIMClient = function createIMClient(id, clientOptions, tag) {
    var _this4 = this;

    var idIsString = typeof id === 'string';
    if (idIsString && this._clients[id] !== undefined) {
      return _Promise.resolve(this._clients[id]);
    }
    var promise = this._open().then(function (connection) {
      var client = new IMClient(id, clientOptions, connection, {
        _messageParser: _this4._messageParser,
        _plugins: _this4._plugins
      });
      connection.on('reconnect', function () {
        return client._open(_this4._options.appId, tag, _this4._id, true)
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
        .then(function () {
          return client.emit('reconnect');
        }, function (error) {
          return client.emit('reconnecterror', error);
        });
      });
      internal(client)._eventemitter.on('close', function () {
        return _this4._deregister(client);
      }, _this4);
      return client._open(_this4._options.appId, tag, _this4._id).then(function () {
        _this4._register(client);
        return client;
      });
    });
    if (idIsString) {
      this._clients[id] = promise;
    }
    return promise;
  };

  /**
   * 注册消息类
   *
   * 在接收消息、查询消息时，会按照消息类注册顺序的逆序依次尝试解析消息内容
   *
   * @param  {Function | Function[]} messageClass 消息类，需要实现 {@link AVMessage} 接口，
   *                     													建议继承自 {@link TypedMessage}
   * @throws {TypeError} 如果 messageClass 没有实现 {@link AVMessage} 接口则抛出异常
   */


  Realtime.prototype.register = function register(messageClass) {
    return ensureArray(messageClass).map(this._messageParser.register.bind(this._messageParser));
  };

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


  Realtime.defineConversationProperty = function defineConversationProperty(prop) {
    var descriptor = arguments.length <= 1 || arguments[1] === undefined ? {
      get: function get() {
        return this.get(prop);
      },
      set: function set(value) {
        this.set(prop, value);
      }
    } : arguments[1];

    _Object$defineProperty(Conversation.prototype, prop, descriptor);
  };

  return Realtime;
}(EventEmitter);

/** @module leancloud-realtime */

exports.Realtime = Realtime;
exports.Message = Message;
exports.TypedMessage = TypedMessage;
exports.TextMessage = TextMessage;
exports.messageType = messageType;
exports.messageField = messageField;
exports.IE10Compatible = IE10Compatible;
exports.MessageStatus = MessageStatus;
//# sourceMappingURL=realtime.js.map