(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.AV = global.AV || {}, global.AV.realtime = factory());
}(this, function () { 'use strict';

	var babelHelpers_typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};



	var global = typeof window !== 'undefined' ? window :
	             typeof global !== 'undefined' ? global :
	             this;


	var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
	function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

	var version = "2.3.5";

	function noop() {}

	// 检查是否是 JSON 格式的字符串
	function isJSONString(obj) {
	  return (/^\{.*\}$/.test(obj)
	  );
	}

	// 获取当前时间的时间戳
	function now() {
	  return new Date().getTime();
	}

	// HTML 转义
	function encodeHTML(source) {
	  var encodeHTML = function encodeHTML(str) {
	    if (typeof str === 'string') {
	      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	      // 考虑到其中有可能是 JSON，所以不做 HTML 强过滤，仅对标签过滤
	      // .replace(/\\/g,'&#92;')
	      // .replace(/"/g,'&quot;')
	      // .replace(/'/g,'&#39;');
	    } else {
	        // 数字
	        return str;
	      }
	  };

	  // 对象类型
	  if ((typeof source === 'undefined' ? 'undefined' : babelHelpers_typeof(source)) === 'object') {
	    for (var key in source) {
	      source[key] = tool.encodeHTML(source[key]);
	    }
	    return source;
	  } else {
	    // 非对象类型
	    return encodeHTML(source);
	  }
	}

var tool$1 = Object.freeze({
	  noop: noop,
	  isJSONString: isJSONString,
	  now: now,
	  encodeHTML: encodeHTML
	});

	var XMLHttpRequest_browser = __commonjs(function (module, exports) {
	"use strict";

	exports.XMLHttpRequest = window.XMLHttpRequest || window.XDomainRequest;
	});

	var XMLHttpRequest = XMLHttpRequest_browser.XMLHttpRequest;

	var ajax = function ajax(options, callback) {
	  if (typeof options === 'string') {
	    options = {
	      url: options
	    };
	  }
	  var url = options.url;
	  var method = options.method || 'get';
	  var xhr = new XMLHttpRequest();

	  xhr.open(method, url);

	  xhr.onload = function (data) {
	    if (xhr.status >= 200 && xhr.status < 300) {
	      callback(null, JSON.parse(xhr.responseText));
	    } else {
	      callback(JSON.parse(xhr.responseText));
	    }
	  };

	  xhr.onerror = function (data) {
	    callback(data || {});
	    throw new Error('Network error.');
	  };

	  // IE9 中需要设置所有的 xhr 事件回调，不然可能会无法执行后续操作
	  xhr.onprogress = function () {};
	  xhr.ontimeout = function () {};
	  xhr.timeout = 0;

	  var body = JSON.stringify(options.data);

	  xhr.send(body);
	};

	var eventCenter = function eventCenter() {
	  var eventList = {};
	  var eventOnceList = {};

	  var _on = function _on(eventName, fun, options) {
	    if (!eventName) {
	      throw new Error('No event name.');
	    } else if (!fun) {
	      throw new Error('No callback function.');
	    }
	    var list = eventName.split(/\s+/);
	    var tempList;
	    var isOnce;
	    var isSingle;
	    if (options) {
	      isOnce = options.once;
	      isSingle = options.single;
	    }

	    if (!isOnce) {
	      tempList = eventList;
	    } else {
	      tempList = eventOnceList;
	    }
	    for (var i = 0, l = list.length; i < l; i++) {
	      if (list[i]) {
	        var itemEventList = tempList[list[i]];

	        if (!itemEventList) {
	          itemEventList = [];

	          // 将新指针指向原链表
	          tempList[list[i]] = itemEventList;
	        }

	        if (isSingle) {

	          // 标记是否存在重复的方法，如果有则为 true
	          var flag = false;
	          for (var m = 0, n = itemEventList.length; m < n; m++) {
	            if (itemEventList[m].toString() === fun.toString()) {
	              flag = true;
	              break;
	            }
	          }

	          if (!flag) {
	            itemEventList.push(fun);
	          }
	        } else {
	          itemEventList.push(fun);
	        }
	      }
	    }
	  };

	  var _off = function _off(eventName, fun, options) {
	    var tempList;
	    var isOnce;
	    if (options) {
	      isOnce = options.once;
	    }
	    if (!isOnce) {
	      tempList = eventList;
	    } else {
	      tempList = eventOnceList;
	    }
	    if (tempList[eventName]) {
	      var i = 0;
	      var l = tempList[eventName].length;
	      for (; i < l; i++) {
	        if (tempList[eventName][i] === fun) {
	          tempList[eventName][i] = null;
	          // 每次只清除一个相同事件绑定
	          break;
	        }
	      }
	    }
	  };

	  function cleanNull(list) {
	    var tempList = [];
	    var i = 0;
	    var l = list.length;
	    if (l) {
	      for (; i < l; i++) {
	        if (list[i]) {
	          tempList.push(list[i]);
	        }
	      }
	      return tempList;
	    } else {
	      return null;
	    }
	  }

	  return {
	    on: function on(eventName, fun) {
	      _on(eventName, fun);
	      return this;
	    },

	    // 方法绑定以后只会运行一次
	    once: function once(eventName, fun) {
	      _on(eventName, fun, {
	        once: true
	      });
	      return this;
	    },

	    // 同一个方法只会被绑定一次
	    _one: function _one(eventName, fun) {
	      _on(eventName, fun, {
	        single: true
	      });
	    },
	    emit: function emit(eventName, data) {
	      if (!eventName) {
	        throw new Error('No emit event name.');
	      }
	      var i = 0;
	      var l = 0;
	      if (eventList[eventName]) {
	        i = 0;
	        l = eventList[eventName].length;
	        for (; i < l; i++) {
	          if (eventList[eventName][i]) {
	            eventList[eventName][i].call(this, data);
	          }
	        }
	        eventList[eventName] = cleanNull(eventList[eventName]);
	      }
	      if (eventOnceList[eventName]) {
	        i = 0;
	        l = eventOnceList[eventName].length;
	        for (; i < l; i++) {
	          if (eventOnceList[eventName][i]) {
	            eventOnceList[eventName][i].call(this, data);
	            _off(eventName, eventOnceList[eventName][i], {
	              once: true
	            });
	          }
	        }
	        eventOnceList[eventName] = cleanNull(eventOnceList[eventName]);
	      }
	      return this;
	    },
	    off: function off(eventName, fun) {
	      _off(eventName, fun);
	      return this;
	    }
	  };
	};

	var rsvp = __commonjs(function (module, exports, global) {
	/*!
	 * @overview RSVP - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
	 * @version   3.1.0
	 */

	(function () {
	  "use strict";

	  function lib$rsvp$utils$$objectOrFunction(x) {
	    return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : babelHelpers_typeof(x)) === 'object' && x !== null;
	  }

	  function lib$rsvp$utils$$isFunction(x) {
	    return typeof x === 'function';
	  }

	  function lib$rsvp$utils$$isMaybeThenable(x) {
	    return (typeof x === 'undefined' ? 'undefined' : babelHelpers_typeof(x)) === 'object' && x !== null;
	  }

	  var lib$rsvp$utils$$_isArray;
	  if (!Array.isArray) {
	    lib$rsvp$utils$$_isArray = function lib$rsvp$utils$$_isArray(x) {
	      return Object.prototype.toString.call(x) === '[object Array]';
	    };
	  } else {
	    lib$rsvp$utils$$_isArray = Array.isArray;
	  }

	  var lib$rsvp$utils$$isArray = lib$rsvp$utils$$_isArray;

	  var lib$rsvp$utils$$now = Date.now || function () {
	    return new Date().getTime();
	  };

	  function lib$rsvp$utils$$F() {}

	  var lib$rsvp$utils$$o_create = Object.create || function (o) {
	    if (arguments.length > 1) {
	      throw new Error('Second argument not supported');
	    }
	    if ((typeof o === 'undefined' ? 'undefined' : babelHelpers_typeof(o)) !== 'object') {
	      throw new TypeError('Argument must be an object');
	    }
	    lib$rsvp$utils$$F.prototype = o;
	    return new lib$rsvp$utils$$F();
	  };
	  function lib$rsvp$events$$indexOf(callbacks, callback) {
	    for (var i = 0, l = callbacks.length; i < l; i++) {
	      if (callbacks[i] === callback) {
	        return i;
	      }
	    }

	    return -1;
	  }

	  function lib$rsvp$events$$callbacksFor(object) {
	    var callbacks = object._promiseCallbacks;

	    if (!callbacks) {
	      callbacks = object._promiseCallbacks = {};
	    }

	    return callbacks;
	  }

	  var lib$rsvp$events$$default = {

	    /**
	      `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
	      Example:
	       ```javascript
	      var object = {};
	       RSVP.EventTarget.mixin(object);
	       object.on('finished', function(event) {
	        // handle event
	      });
	       object.trigger('finished', { detail: value });
	      ```
	       `EventTarget.mixin` also works with prototypes:
	       ```javascript
	      var Person = function() {};
	      RSVP.EventTarget.mixin(Person.prototype);
	       var yehuda = new Person();
	      var tom = new Person();
	       yehuda.on('poke', function(event) {
	        console.log('Yehuda says OW');
	      });
	       tom.on('poke', function(event) {
	        console.log('Tom says OW');
	      });
	       yehuda.trigger('poke');
	      tom.trigger('poke');
	      ```
	       @method mixin
	      @for RSVP.EventTarget
	      @private
	      @param {Object} object object to extend with EventTarget methods
	    */
	    'mixin': function mixin(object) {
	      object['on'] = this['on'];
	      object['off'] = this['off'];
	      object['trigger'] = this['trigger'];
	      object._promiseCallbacks = undefined;
	      return object;
	    },

	    /**
	      Registers a callback to be executed when `eventName` is triggered
	       ```javascript
	      object.on('event', function(eventInfo){
	        // handle the event
	      });
	       object.trigger('event');
	      ```
	       @method on
	      @for RSVP.EventTarget
	      @private
	      @param {String} eventName name of the event to listen for
	      @param {Function} callback function to be called when the event is triggered.
	    */
	    'on': function on(eventName, callback) {
	      if (typeof callback !== 'function') {
	        throw new TypeError('Callback must be a function');
	      }

	      var allCallbacks = lib$rsvp$events$$callbacksFor(this),
	          callbacks;

	      callbacks = allCallbacks[eventName];

	      if (!callbacks) {
	        callbacks = allCallbacks[eventName] = [];
	      }

	      if (lib$rsvp$events$$indexOf(callbacks, callback) === -1) {
	        callbacks.push(callback);
	      }
	    },

	    /**
	      You can use `off` to stop firing a particular callback for an event:
	       ```javascript
	      function doStuff() { // do stuff! }
	      object.on('stuff', doStuff);
	       object.trigger('stuff'); // doStuff will be called
	       // Unregister ONLY the doStuff callback
	      object.off('stuff', doStuff);
	      object.trigger('stuff'); // doStuff will NOT be called
	      ```
	       If you don't pass a `callback` argument to `off`, ALL callbacks for the
	      event will not be executed when the event fires. For example:
	       ```javascript
	      var callback1 = function(){};
	      var callback2 = function(){};
	       object.on('stuff', callback1);
	      object.on('stuff', callback2);
	       object.trigger('stuff'); // callback1 and callback2 will be executed.
	       object.off('stuff');
	      object.trigger('stuff'); // callback1 and callback2 will not be executed!
	      ```
	       @method off
	      @for RSVP.EventTarget
	      @private
	      @param {String} eventName event to stop listening to
	      @param {Function} callback optional argument. If given, only the function
	      given will be removed from the event's callback queue. If no `callback`
	      argument is given, all callbacks will be removed from the event's callback
	      queue.
	    */
	    'off': function off(eventName, callback) {
	      var allCallbacks = lib$rsvp$events$$callbacksFor(this),
	          callbacks,
	          index;

	      if (!callback) {
	        allCallbacks[eventName] = [];
	        return;
	      }

	      callbacks = allCallbacks[eventName];

	      index = lib$rsvp$events$$indexOf(callbacks, callback);

	      if (index !== -1) {
	        callbacks.splice(index, 1);
	      }
	    },

	    /**
	      Use `trigger` to fire custom events. For example:
	       ```javascript
	      object.on('foo', function(){
	        console.log('foo event happened!');
	      });
	      object.trigger('foo');
	      // 'foo event happened!' logged to the console
	      ```
	       You can also pass a value as a second argument to `trigger` that will be
	      passed as an argument to all event listeners for the event:
	       ```javascript
	      object.on('foo', function(value){
	        console.log(value.name);
	      });
	       object.trigger('foo', { name: 'bar' });
	      // 'bar' logged to the console
	      ```
	       @method trigger
	      @for RSVP.EventTarget
	      @private
	      @param {String} eventName name of the event to be triggered
	      @param {*} options optional value to be passed to any event handlers for
	      the given `eventName`
	    */
	    'trigger': function trigger(eventName, options, label) {
	      var allCallbacks = lib$rsvp$events$$callbacksFor(this),
	          callbacks,
	          callback;

	      if (callbacks = allCallbacks[eventName]) {
	        // Don't cache the callbacks.length since it may grow
	        for (var i = 0; i < callbacks.length; i++) {
	          callback = callbacks[i];

	          callback(options, label);
	        }
	      }
	    }
	  };

	  var lib$rsvp$config$$config = {
	    instrument: false
	  };

	  lib$rsvp$events$$default['mixin'](lib$rsvp$config$$config);

	  function lib$rsvp$config$$configure(name, value) {
	    if (name === 'onerror') {
	      // handle for legacy users that expect the actual
	      // error to be passed to their function added via
	      // `RSVP.configure('onerror', someFunctionHere);`
	      lib$rsvp$config$$config['on']('error', value);
	      return;
	    }

	    if (arguments.length === 2) {
	      lib$rsvp$config$$config[name] = value;
	    } else {
	      return lib$rsvp$config$$config[name];
	    }
	  }

	  var lib$rsvp$instrument$$queue = [];

	  function lib$rsvp$instrument$$scheduleFlush() {
	    setTimeout(function () {
	      var entry;
	      for (var i = 0; i < lib$rsvp$instrument$$queue.length; i++) {
	        entry = lib$rsvp$instrument$$queue[i];

	        var payload = entry.payload;

	        payload.guid = payload.key + payload.id;
	        payload.childGuid = payload.key + payload.childId;
	        if (payload.error) {
	          payload.stack = payload.error.stack;
	        }

	        lib$rsvp$config$$config['trigger'](entry.name, entry.payload);
	      }
	      lib$rsvp$instrument$$queue.length = 0;
	    }, 50);
	  }

	  function lib$rsvp$instrument$$instrument(eventName, promise, child) {
	    if (1 === lib$rsvp$instrument$$queue.push({
	      name: eventName,
	      payload: {
	        key: promise._guidKey,
	        id: promise._id,
	        eventName: eventName,
	        detail: promise._result,
	        childId: child && child._id,
	        label: promise._label,
	        timeStamp: lib$rsvp$utils$$now(),
	        error: lib$rsvp$config$$config["instrument-with-stack"] ? new Error(promise._label) : null
	      } })) {
	      lib$rsvp$instrument$$scheduleFlush();
	    }
	  }
	  var lib$rsvp$instrument$$default = lib$rsvp$instrument$$instrument;

	  function lib$rsvp$$internal$$withOwnPromise() {
	    return new TypeError('A promises callback cannot return that same promise.');
	  }

	  function lib$rsvp$$internal$$noop() {}

	  var lib$rsvp$$internal$$PENDING = void 0;
	  var lib$rsvp$$internal$$FULFILLED = 1;
	  var lib$rsvp$$internal$$REJECTED = 2;

	  var lib$rsvp$$internal$$GET_THEN_ERROR = new lib$rsvp$$internal$$ErrorObject();

	  function lib$rsvp$$internal$$getThen(promise) {
	    try {
	      return promise.then;
	    } catch (error) {
	      lib$rsvp$$internal$$GET_THEN_ERROR.error = error;
	      return lib$rsvp$$internal$$GET_THEN_ERROR;
	    }
	  }

	  function lib$rsvp$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	    try {
	      then.call(value, fulfillmentHandler, rejectionHandler);
	    } catch (e) {
	      return e;
	    }
	  }

	  function lib$rsvp$$internal$$handleForeignThenable(promise, thenable, then) {
	    lib$rsvp$config$$config.async(function (promise) {
	      var sealed = false;
	      var error = lib$rsvp$$internal$$tryThen(then, thenable, function (value) {
	        if (sealed) {
	          return;
	        }
	        sealed = true;
	        if (thenable !== value) {
	          lib$rsvp$$internal$$resolve(promise, value);
	        } else {
	          lib$rsvp$$internal$$fulfill(promise, value);
	        }
	      }, function (reason) {
	        if (sealed) {
	          return;
	        }
	        sealed = true;

	        lib$rsvp$$internal$$reject(promise, reason);
	      }, 'Settle: ' + (promise._label || ' unknown promise'));

	      if (!sealed && error) {
	        sealed = true;
	        lib$rsvp$$internal$$reject(promise, error);
	      }
	    }, promise);
	  }

	  function lib$rsvp$$internal$$handleOwnThenable(promise, thenable) {
	    if (thenable._state === lib$rsvp$$internal$$FULFILLED) {
	      lib$rsvp$$internal$$fulfill(promise, thenable._result);
	    } else if (thenable._state === lib$rsvp$$internal$$REJECTED) {
	      thenable._onError = null;
	      lib$rsvp$$internal$$reject(promise, thenable._result);
	    } else {
	      lib$rsvp$$internal$$subscribe(thenable, undefined, function (value) {
	        if (thenable !== value) {
	          lib$rsvp$$internal$$resolve(promise, value);
	        } else {
	          lib$rsvp$$internal$$fulfill(promise, value);
	        }
	      }, function (reason) {
	        lib$rsvp$$internal$$reject(promise, reason);
	      });
	    }
	  }

	  function lib$rsvp$$internal$$handleMaybeThenable(promise, maybeThenable) {
	    if (maybeThenable.constructor === promise.constructor) {
	      lib$rsvp$$internal$$handleOwnThenable(promise, maybeThenable);
	    } else {
	      var then = lib$rsvp$$internal$$getThen(maybeThenable);

	      if (then === lib$rsvp$$internal$$GET_THEN_ERROR) {
	        lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$GET_THEN_ERROR.error);
	      } else if (then === undefined) {
	        lib$rsvp$$internal$$fulfill(promise, maybeThenable);
	      } else if (lib$rsvp$utils$$isFunction(then)) {
	        lib$rsvp$$internal$$handleForeignThenable(promise, maybeThenable, then);
	      } else {
	        lib$rsvp$$internal$$fulfill(promise, maybeThenable);
	      }
	    }
	  }

	  function lib$rsvp$$internal$$resolve(promise, value) {
	    if (promise === value) {
	      lib$rsvp$$internal$$fulfill(promise, value);
	    } else if (lib$rsvp$utils$$objectOrFunction(value)) {
	      lib$rsvp$$internal$$handleMaybeThenable(promise, value);
	    } else {
	      lib$rsvp$$internal$$fulfill(promise, value);
	    }
	  }

	  function lib$rsvp$$internal$$publishRejection(promise) {
	    if (promise._onError) {
	      promise._onError(promise._result);
	    }

	    lib$rsvp$$internal$$publish(promise);
	  }

	  function lib$rsvp$$internal$$fulfill(promise, value) {
	    if (promise._state !== lib$rsvp$$internal$$PENDING) {
	      return;
	    }

	    promise._result = value;
	    promise._state = lib$rsvp$$internal$$FULFILLED;

	    if (promise._subscribers.length === 0) {
	      if (lib$rsvp$config$$config.instrument) {
	        lib$rsvp$instrument$$default('fulfilled', promise);
	      }
	    } else {
	      lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, promise);
	    }
	  }

	  function lib$rsvp$$internal$$reject(promise, reason) {
	    if (promise._state !== lib$rsvp$$internal$$PENDING) {
	      return;
	    }
	    promise._state = lib$rsvp$$internal$$REJECTED;
	    promise._result = reason;
	    lib$rsvp$config$$config.async(lib$rsvp$$internal$$publishRejection, promise);
	  }

	  function lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	    var subscribers = parent._subscribers;
	    var length = subscribers.length;

	    parent._onError = null;

	    subscribers[length] = child;
	    subscribers[length + lib$rsvp$$internal$$FULFILLED] = onFulfillment;
	    subscribers[length + lib$rsvp$$internal$$REJECTED] = onRejection;

	    if (length === 0 && parent._state) {
	      lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, parent);
	    }
	  }

	  function lib$rsvp$$internal$$publish(promise) {
	    var subscribers = promise._subscribers;
	    var settled = promise._state;

	    if (lib$rsvp$config$$config.instrument) {
	      lib$rsvp$instrument$$default(settled === lib$rsvp$$internal$$FULFILLED ? 'fulfilled' : 'rejected', promise);
	    }

	    if (subscribers.length === 0) {
	      return;
	    }

	    var child,
	        callback,
	        detail = promise._result;

	    for (var i = 0; i < subscribers.length; i += 3) {
	      child = subscribers[i];
	      callback = subscribers[i + settled];

	      if (child) {
	        lib$rsvp$$internal$$invokeCallback(settled, child, callback, detail);
	      } else {
	        callback(detail);
	      }
	    }

	    promise._subscribers.length = 0;
	  }

	  function lib$rsvp$$internal$$ErrorObject() {
	    this.error = null;
	  }

	  var lib$rsvp$$internal$$TRY_CATCH_ERROR = new lib$rsvp$$internal$$ErrorObject();

	  function lib$rsvp$$internal$$tryCatch(callback, detail) {
	    try {
	      return callback(detail);
	    } catch (e) {
	      lib$rsvp$$internal$$TRY_CATCH_ERROR.error = e;
	      return lib$rsvp$$internal$$TRY_CATCH_ERROR;
	    }
	  }

	  function lib$rsvp$$internal$$invokeCallback(settled, promise, callback, detail) {
	    var hasCallback = lib$rsvp$utils$$isFunction(callback),
	        value,
	        error,
	        succeeded,
	        failed;

	    if (hasCallback) {
	      value = lib$rsvp$$internal$$tryCatch(callback, detail);

	      if (value === lib$rsvp$$internal$$TRY_CATCH_ERROR) {
	        failed = true;
	        error = value.error;
	        value = null;
	      } else {
	        succeeded = true;
	      }

	      if (promise === value) {
	        lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$withOwnPromise());
	        return;
	      }
	    } else {
	      value = detail;
	      succeeded = true;
	    }

	    if (promise._state !== lib$rsvp$$internal$$PENDING) {
	      // noop
	    } else if (hasCallback && succeeded) {
	        lib$rsvp$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$rsvp$$internal$$reject(promise, error);
	      } else if (settled === lib$rsvp$$internal$$FULFILLED) {
	        lib$rsvp$$internal$$fulfill(promise, value);
	      } else if (settled === lib$rsvp$$internal$$REJECTED) {
	        lib$rsvp$$internal$$reject(promise, value);
	      }
	  }

	  function lib$rsvp$$internal$$initializePromise(promise, resolver) {
	    var resolved = false;
	    try {
	      resolver(function resolvePromise(value) {
	        if (resolved) {
	          return;
	        }
	        resolved = true;
	        lib$rsvp$$internal$$resolve(promise, value);
	      }, function rejectPromise(reason) {
	        if (resolved) {
	          return;
	        }
	        resolved = true;
	        lib$rsvp$$internal$$reject(promise, reason);
	      });
	    } catch (e) {
	      lib$rsvp$$internal$$reject(promise, e);
	    }
	  }

	  function lib$rsvp$enumerator$$makeSettledResult(state, position, value) {
	    if (state === lib$rsvp$$internal$$FULFILLED) {
	      return {
	        state: 'fulfilled',
	        value: value
	      };
	    } else {
	      return {
	        state: 'rejected',
	        reason: value
	      };
	    }
	  }

	  function lib$rsvp$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
	    var enumerator = this;

	    enumerator._instanceConstructor = Constructor;
	    enumerator.promise = new Constructor(lib$rsvp$$internal$$noop, label);
	    enumerator._abortOnReject = abortOnReject;

	    if (enumerator._validateInput(input)) {
	      enumerator._input = input;
	      enumerator.length = input.length;
	      enumerator._remaining = input.length;

	      enumerator._init();

	      if (enumerator.length === 0) {
	        lib$rsvp$$internal$$fulfill(enumerator.promise, enumerator._result);
	      } else {
	        enumerator.length = enumerator.length || 0;
	        enumerator._enumerate();
	        if (enumerator._remaining === 0) {
	          lib$rsvp$$internal$$fulfill(enumerator.promise, enumerator._result);
	        }
	      }
	    } else {
	      lib$rsvp$$internal$$reject(enumerator.promise, enumerator._validationError());
	    }
	  }

	  var lib$rsvp$enumerator$$default = lib$rsvp$enumerator$$Enumerator;

	  lib$rsvp$enumerator$$Enumerator.prototype._validateInput = function (input) {
	    return lib$rsvp$utils$$isArray(input);
	  };

	  lib$rsvp$enumerator$$Enumerator.prototype._validationError = function () {
	    return new Error('Array Methods must be provided an Array');
	  };

	  lib$rsvp$enumerator$$Enumerator.prototype._init = function () {
	    this._result = new Array(this.length);
	  };

	  lib$rsvp$enumerator$$Enumerator.prototype._enumerate = function () {
	    var enumerator = this;
	    var length = enumerator.length;
	    var promise = enumerator.promise;
	    var input = enumerator._input;

	    for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
	      enumerator._eachEntry(input[i], i);
	    }
	  };

	  lib$rsvp$enumerator$$Enumerator.prototype._eachEntry = function (entry, i) {
	    var enumerator = this;
	    var c = enumerator._instanceConstructor;
	    if (lib$rsvp$utils$$isMaybeThenable(entry)) {
	      if (entry.constructor === c && entry._state !== lib$rsvp$$internal$$PENDING) {
	        entry._onError = null;
	        enumerator._settledAt(entry._state, i, entry._result);
	      } else {
	        enumerator._willSettleAt(c.resolve(entry), i);
	      }
	    } else {
	      enumerator._remaining--;
	      enumerator._result[i] = enumerator._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
	    }
	  };

	  lib$rsvp$enumerator$$Enumerator.prototype._settledAt = function (state, i, value) {
	    var enumerator = this;
	    var promise = enumerator.promise;

	    if (promise._state === lib$rsvp$$internal$$PENDING) {
	      enumerator._remaining--;

	      if (enumerator._abortOnReject && state === lib$rsvp$$internal$$REJECTED) {
	        lib$rsvp$$internal$$reject(promise, value);
	      } else {
	        enumerator._result[i] = enumerator._makeResult(state, i, value);
	      }
	    }

	    if (enumerator._remaining === 0) {
	      lib$rsvp$$internal$$fulfill(promise, enumerator._result);
	    }
	  };

	  lib$rsvp$enumerator$$Enumerator.prototype._makeResult = function (state, i, value) {
	    return value;
	  };

	  lib$rsvp$enumerator$$Enumerator.prototype._willSettleAt = function (promise, i) {
	    var enumerator = this;

	    lib$rsvp$$internal$$subscribe(promise, undefined, function (value) {
	      enumerator._settledAt(lib$rsvp$$internal$$FULFILLED, i, value);
	    }, function (reason) {
	      enumerator._settledAt(lib$rsvp$$internal$$REJECTED, i, reason);
	    });
	  };
	  function lib$rsvp$promise$all$$all(entries, label) {
	    return new lib$rsvp$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
	  }
	  var lib$rsvp$promise$all$$default = lib$rsvp$promise$all$$all;
	  function lib$rsvp$promise$race$$race(entries, label) {
	    /*jshint validthis:true */
	    var Constructor = this;

	    var promise = new Constructor(lib$rsvp$$internal$$noop, label);

	    if (!lib$rsvp$utils$$isArray(entries)) {
	      lib$rsvp$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	      return promise;
	    }

	    var length = entries.length;

	    function onFulfillment(value) {
	      lib$rsvp$$internal$$resolve(promise, value);
	    }

	    function onRejection(reason) {
	      lib$rsvp$$internal$$reject(promise, reason);
	    }

	    for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
	      lib$rsvp$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	    }

	    return promise;
	  }
	  var lib$rsvp$promise$race$$default = lib$rsvp$promise$race$$race;
	  function lib$rsvp$promise$resolve$$resolve(object, label) {
	    /*jshint validthis:true */
	    var Constructor = this;

	    if (object && (typeof object === 'undefined' ? 'undefined' : babelHelpers_typeof(object)) === 'object' && object.constructor === Constructor) {
	      return object;
	    }

	    var promise = new Constructor(lib$rsvp$$internal$$noop, label);
	    lib$rsvp$$internal$$resolve(promise, object);
	    return promise;
	  }
	  var lib$rsvp$promise$resolve$$default = lib$rsvp$promise$resolve$$resolve;
	  function lib$rsvp$promise$reject$$reject(reason, label) {
	    /*jshint validthis:true */
	    var Constructor = this;
	    var promise = new Constructor(lib$rsvp$$internal$$noop, label);
	    lib$rsvp$$internal$$reject(promise, reason);
	    return promise;
	  }
	  var lib$rsvp$promise$reject$$default = lib$rsvp$promise$reject$$reject;

	  var lib$rsvp$promise$$guidKey = 'rsvp_' + lib$rsvp$utils$$now() + '-';
	  var lib$rsvp$promise$$counter = 0;

	  function lib$rsvp$promise$$needsResolver() {
	    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	  }

	  function lib$rsvp$promise$$needsNew() {
	    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	  }

	  function lib$rsvp$promise$$Promise(resolver, label) {
	    var promise = this;

	    promise._id = lib$rsvp$promise$$counter++;
	    promise._label = label;
	    promise._state = undefined;
	    promise._result = undefined;
	    promise._subscribers = [];

	    if (lib$rsvp$config$$config.instrument) {
	      lib$rsvp$instrument$$default('created', promise);
	    }

	    if (lib$rsvp$$internal$$noop !== resolver) {
	      if (!lib$rsvp$utils$$isFunction(resolver)) {
	        lib$rsvp$promise$$needsResolver();
	      }

	      if (!(promise instanceof lib$rsvp$promise$$Promise)) {
	        lib$rsvp$promise$$needsNew();
	      }

	      lib$rsvp$$internal$$initializePromise(promise, resolver);
	    }
	  }

	  var lib$rsvp$promise$$default = lib$rsvp$promise$$Promise;

	  // deprecated
	  lib$rsvp$promise$$Promise.cast = lib$rsvp$promise$resolve$$default;
	  lib$rsvp$promise$$Promise.all = lib$rsvp$promise$all$$default;
	  lib$rsvp$promise$$Promise.race = lib$rsvp$promise$race$$default;
	  lib$rsvp$promise$$Promise.resolve = lib$rsvp$promise$resolve$$default;
	  lib$rsvp$promise$$Promise.reject = lib$rsvp$promise$reject$$default;

	  lib$rsvp$promise$$Promise.prototype = {
	    constructor: lib$rsvp$promise$$Promise,

	    _guidKey: lib$rsvp$promise$$guidKey,

	    _onError: function _onError(reason) {
	      var promise = this;
	      lib$rsvp$config$$config.after(function () {
	        if (promise._onError) {
	          lib$rsvp$config$$config['trigger']('error', reason, promise._label);
	        }
	      });
	    },

	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.
	       ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```
	       Chaining
	      --------
	       The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.
	       ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });
	       findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	       ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```
	       Assimilation
	      ------------
	       Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.
	       ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```
	       If the assimliated promise rejects, then the downstream promise will also reject.
	       ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```
	       Simple Example
	      --------------
	       Synchronous Example
	       ```javascript
	      var result;
	       try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	       Errback Example
	       ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```
	       Promise Example;
	       ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```
	       Advanced Example
	      --------------
	       Synchronous Example
	       ```javascript
	      var author, books;
	       try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	       Errback Example
	       ```js
	       function foundBooks(books) {
	       }
	       function failure(reason) {
	       }
	       findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```
	       Promise Example;
	       ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```
	       @method then
	      @param {Function} onFulfillment
	      @param {Function} onRejection
	      @param {String} label optional string for labeling the promise.
	      Useful for tooling.
	      @return {Promise}
	    */
	    then: function then(onFulfillment, onRejection, label) {
	      var parent = this;
	      var state = parent._state;

	      if (state === lib$rsvp$$internal$$FULFILLED && !onFulfillment || state === lib$rsvp$$internal$$REJECTED && !onRejection) {
	        if (lib$rsvp$config$$config.instrument) {
	          lib$rsvp$instrument$$default('chained', parent, parent);
	        }
	        return parent;
	      }

	      parent._onError = null;

	      var child = new parent.constructor(lib$rsvp$$internal$$noop, label);
	      var result = parent._result;

	      if (lib$rsvp$config$$config.instrument) {
	        lib$rsvp$instrument$$default('chained', parent, child);
	      }

	      if (state) {
	        var callback = arguments[state - 1];
	        lib$rsvp$config$$config.async(function () {
	          lib$rsvp$$internal$$invokeCallback(state, child, callback, result);
	        });
	      } else {
	        lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	      }

	      return child;
	    },

	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.
	       ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }
	       // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }
	       // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```
	       @method catch
	      @param {Function} onRejection
	      @param {String} label optional string for labeling the promise.
	      Useful for tooling.
	      @return {Promise}
	    */
	    'catch': function _catch(onRejection, label) {
	      return this.then(undefined, onRejection, label);
	    },

	    /**
	      `finally` will be invoked regardless of the promise's fate just as native
	      try/catch/finally behaves
	       Synchronous example:
	       ```js
	      findAuthor() {
	        if (Math.random() > 0.5) {
	          throw new Error();
	        }
	        return new Author();
	      }
	       try {
	        return findAuthor(); // succeed or fail
	      } catch(error) {
	        return findOtherAuther();
	      } finally {
	        // always runs
	        // doesn't affect the return value
	      }
	      ```
	       Asynchronous example:
	       ```js
	      findAuthor().catch(function(reason){
	        return findOtherAuther();
	      }).finally(function(){
	        // author was either found, or not
	      });
	      ```
	       @method finally
	      @param {Function} callback
	      @param {String} label optional string for labeling the promise.
	      Useful for tooling.
	      @return {Promise}
	    */
	    'finally': function _finally(callback, label) {
	      var promise = this;
	      var constructor = promise.constructor;

	      return promise.then(function (value) {
	        return constructor.resolve(callback()).then(function () {
	          return value;
	        });
	      }, function (reason) {
	        return constructor.resolve(callback()).then(function () {
	          throw reason;
	        });
	      }, label);
	    }
	  };

	  function lib$rsvp$all$settled$$AllSettled(Constructor, entries, label) {
	    this._superConstructor(Constructor, entries, false /* don't abort on reject */, label);
	  }

	  lib$rsvp$all$settled$$AllSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
	  lib$rsvp$all$settled$$AllSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
	  lib$rsvp$all$settled$$AllSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;
	  lib$rsvp$all$settled$$AllSettled.prototype._validationError = function () {
	    return new Error('allSettled must be called with an array');
	  };

	  function lib$rsvp$all$settled$$allSettled(entries, label) {
	    return new lib$rsvp$all$settled$$AllSettled(lib$rsvp$promise$$default, entries, label).promise;
	  }
	  var lib$rsvp$all$settled$$default = lib$rsvp$all$settled$$allSettled;
	  function lib$rsvp$all$$all(array, label) {
	    return lib$rsvp$promise$$default.all(array, label);
	  }
	  var lib$rsvp$all$$default = lib$rsvp$all$$all;
	  var lib$rsvp$asap$$len = 0;
	  var lib$rsvp$asap$$toString = {}.toString;
	  var lib$rsvp$asap$$vertxNext;
	  function lib$rsvp$asap$$asap(callback, arg) {
	    lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
	    lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
	    lib$rsvp$asap$$len += 2;
	    if (lib$rsvp$asap$$len === 2) {
	      // If len is 1, that means that we need to schedule an async flush.
	      // If additional callbacks are queued before the queue is flushed, they
	      // will be processed by this flush that we are scheduling.
	      lib$rsvp$asap$$scheduleFlush();
	    }
	  }

	  var lib$rsvp$asap$$default = lib$rsvp$asap$$asap;

	  var lib$rsvp$asap$$browserWindow = typeof window !== 'undefined' ? window : undefined;
	  var lib$rsvp$asap$$browserGlobal = lib$rsvp$asap$$browserWindow || {};
	  var lib$rsvp$asap$$BrowserMutationObserver = lib$rsvp$asap$$browserGlobal.MutationObserver || lib$rsvp$asap$$browserGlobal.WebKitMutationObserver;
	  var lib$rsvp$asap$$isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	  // test for web worker but not in IE10
	  var lib$rsvp$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

	  // node
	  function lib$rsvp$asap$$useNextTick() {
	    var nextTick = process.nextTick;
	    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	    // setImmediate should be used instead instead
	    var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
	    if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
	      nextTick = setImmediate;
	    }
	    return function () {
	      nextTick(lib$rsvp$asap$$flush);
	    };
	  }

	  // vertx
	  function lib$rsvp$asap$$useVertxTimer() {
	    return function () {
	      lib$rsvp$asap$$vertxNext(lib$rsvp$asap$$flush);
	    };
	  }

	  function lib$rsvp$asap$$useMutationObserver() {
	    var iterations = 0;
	    var observer = new lib$rsvp$asap$$BrowserMutationObserver(lib$rsvp$asap$$flush);
	    var node = document.createTextNode('');
	    observer.observe(node, { characterData: true });

	    return function () {
	      node.data = iterations = ++iterations % 2;
	    };
	  }

	  // web worker
	  function lib$rsvp$asap$$useMessageChannel() {
	    var channel = new MessageChannel();
	    channel.port1.onmessage = lib$rsvp$asap$$flush;
	    return function () {
	      channel.port2.postMessage(0);
	    };
	  }

	  function lib$rsvp$asap$$useSetTimeout() {
	    return function () {
	      setTimeout(lib$rsvp$asap$$flush, 1);
	    };
	  }

	  var lib$rsvp$asap$$queue = new Array(1000);
	  function lib$rsvp$asap$$flush() {
	    for (var i = 0; i < lib$rsvp$asap$$len; i += 2) {
	      var callback = lib$rsvp$asap$$queue[i];
	      var arg = lib$rsvp$asap$$queue[i + 1];

	      callback(arg);

	      lib$rsvp$asap$$queue[i] = undefined;
	      lib$rsvp$asap$$queue[i + 1] = undefined;
	    }

	    lib$rsvp$asap$$len = 0;
	  }

	  function lib$rsvp$asap$$attemptVertex() {
	    try {
	      var r = require;
	      var vertx = r('vertx');
	      lib$rsvp$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	      return lib$rsvp$asap$$useVertxTimer();
	    } catch (e) {
	      return lib$rsvp$asap$$useSetTimeout();
	    }
	  }

	  var lib$rsvp$asap$$scheduleFlush;
	  // Decide what async method to use to triggering processing of queued callbacks:
	  if (lib$rsvp$asap$$isNode) {
	    lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useNextTick();
	  } else if (lib$rsvp$asap$$BrowserMutationObserver) {
	    lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMutationObserver();
	  } else if (lib$rsvp$asap$$isWorker) {
	    lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMessageChannel();
	  } else if (lib$rsvp$asap$$browserWindow === undefined && typeof require === 'function') {
	    lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$attemptVertex();
	  } else {
	    lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useSetTimeout();
	  }
	  function lib$rsvp$defer$$defer(label) {
	    var deferred = {};

	    deferred['promise'] = new lib$rsvp$promise$$default(function (resolve, reject) {
	      deferred['resolve'] = resolve;
	      deferred['reject'] = reject;
	    }, label);

	    return deferred;
	  }
	  var lib$rsvp$defer$$default = lib$rsvp$defer$$defer;
	  function lib$rsvp$filter$$filter(promises, filterFn, label) {
	    return lib$rsvp$promise$$default.all(promises, label).then(function (values) {
	      if (!lib$rsvp$utils$$isFunction(filterFn)) {
	        throw new TypeError("You must pass a function as filter's second argument.");
	      }

	      var length = values.length;
	      var filtered = new Array(length);

	      for (var i = 0; i < length; i++) {
	        filtered[i] = filterFn(values[i]);
	      }

	      return lib$rsvp$promise$$default.all(filtered, label).then(function (filtered) {
	        var results = new Array(length);
	        var newLength = 0;

	        for (var i = 0; i < length; i++) {
	          if (filtered[i]) {
	            results[newLength] = values[i];
	            newLength++;
	          }
	        }

	        results.length = newLength;

	        return results;
	      });
	    });
	  }
	  var lib$rsvp$filter$$default = lib$rsvp$filter$$filter;

	  function lib$rsvp$promise$hash$$PromiseHash(Constructor, object, label) {
	    this._superConstructor(Constructor, object, true, label);
	  }

	  var lib$rsvp$promise$hash$$default = lib$rsvp$promise$hash$$PromiseHash;

	  lib$rsvp$promise$hash$$PromiseHash.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
	  lib$rsvp$promise$hash$$PromiseHash.prototype._superConstructor = lib$rsvp$enumerator$$default;
	  lib$rsvp$promise$hash$$PromiseHash.prototype._init = function () {
	    this._result = {};
	  };

	  lib$rsvp$promise$hash$$PromiseHash.prototype._validateInput = function (input) {
	    return input && (typeof input === 'undefined' ? 'undefined' : babelHelpers_typeof(input)) === 'object';
	  };

	  lib$rsvp$promise$hash$$PromiseHash.prototype._validationError = function () {
	    return new Error('Promise.hash must be called with an object');
	  };

	  lib$rsvp$promise$hash$$PromiseHash.prototype._enumerate = function () {
	    var enumerator = this;
	    var promise = enumerator.promise;
	    var input = enumerator._input;
	    var results = [];

	    for (var key in input) {
	      if (promise._state === lib$rsvp$$internal$$PENDING && Object.prototype.hasOwnProperty.call(input, key)) {
	        results.push({
	          position: key,
	          entry: input[key]
	        });
	      }
	    }

	    var length = results.length;
	    enumerator._remaining = length;
	    var result;

	    for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
	      result = results[i];
	      enumerator._eachEntry(result.entry, result.position);
	    }
	  };

	  function lib$rsvp$hash$settled$$HashSettled(Constructor, object, label) {
	    this._superConstructor(Constructor, object, false, label);
	  }

	  lib$rsvp$hash$settled$$HashSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$promise$hash$$default.prototype);
	  lib$rsvp$hash$settled$$HashSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
	  lib$rsvp$hash$settled$$HashSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;

	  lib$rsvp$hash$settled$$HashSettled.prototype._validationError = function () {
	    return new Error('hashSettled must be called with an object');
	  };

	  function lib$rsvp$hash$settled$$hashSettled(object, label) {
	    return new lib$rsvp$hash$settled$$HashSettled(lib$rsvp$promise$$default, object, label).promise;
	  }
	  var lib$rsvp$hash$settled$$default = lib$rsvp$hash$settled$$hashSettled;
	  function lib$rsvp$hash$$hash(object, label) {
	    return new lib$rsvp$promise$hash$$default(lib$rsvp$promise$$default, object, label).promise;
	  }
	  var lib$rsvp$hash$$default = lib$rsvp$hash$$hash;
	  function lib$rsvp$map$$map(promises, mapFn, label) {
	    return lib$rsvp$promise$$default.all(promises, label).then(function (values) {
	      if (!lib$rsvp$utils$$isFunction(mapFn)) {
	        throw new TypeError("You must pass a function as map's second argument.");
	      }

	      var length = values.length;
	      var results = new Array(length);

	      for (var i = 0; i < length; i++) {
	        results[i] = mapFn(values[i]);
	      }

	      return lib$rsvp$promise$$default.all(results, label);
	    });
	  }
	  var lib$rsvp$map$$default = lib$rsvp$map$$map;

	  function lib$rsvp$node$$Result() {
	    this.value = undefined;
	  }

	  var lib$rsvp$node$$ERROR = new lib$rsvp$node$$Result();
	  var lib$rsvp$node$$GET_THEN_ERROR = new lib$rsvp$node$$Result();

	  function lib$rsvp$node$$getThen(obj) {
	    try {
	      return obj.then;
	    } catch (error) {
	      lib$rsvp$node$$ERROR.value = error;
	      return lib$rsvp$node$$ERROR;
	    }
	  }

	  function lib$rsvp$node$$tryApply(f, s, a) {
	    try {
	      f.apply(s, a);
	    } catch (error) {
	      lib$rsvp$node$$ERROR.value = error;
	      return lib$rsvp$node$$ERROR;
	    }
	  }

	  function lib$rsvp$node$$makeObject(_, argumentNames) {
	    var obj = {};
	    var name;
	    var i;
	    var length = _.length;
	    var args = new Array(length);

	    for (var x = 0; x < length; x++) {
	      args[x] = _[x];
	    }

	    for (i = 0; i < argumentNames.length; i++) {
	      name = argumentNames[i];
	      obj[name] = args[i + 1];
	    }

	    return obj;
	  }

	  function lib$rsvp$node$$arrayResult(_) {
	    var length = _.length;
	    var args = new Array(length - 1);

	    for (var i = 1; i < length; i++) {
	      args[i - 1] = _[i];
	    }

	    return args;
	  }

	  function lib$rsvp$node$$wrapThenable(_then, promise) {
	    return {
	      then: function then(onFulFillment, onRejection) {
	        return _then.call(promise, onFulFillment, onRejection);
	      }
	    };
	  }

	  function lib$rsvp$node$$denodeify(nodeFunc, options) {
	    var fn = function fn() {
	      var self = this;
	      var l = arguments.length;
	      var args = new Array(l + 1);
	      var arg;
	      var promiseInput = false;

	      for (var i = 0; i < l; ++i) {
	        arg = arguments[i];

	        if (!promiseInput) {
	          // TODO: clean this up
	          promiseInput = lib$rsvp$node$$needsPromiseInput(arg);
	          if (promiseInput === lib$rsvp$node$$GET_THEN_ERROR) {
	            var p = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);
	            lib$rsvp$$internal$$reject(p, lib$rsvp$node$$GET_THEN_ERROR.value);
	            return p;
	          } else if (promiseInput && promiseInput !== true) {
	            arg = lib$rsvp$node$$wrapThenable(promiseInput, arg);
	          }
	        }
	        args[i] = arg;
	      }

	      var promise = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);

	      args[l] = function (err, val) {
	        if (err) lib$rsvp$$internal$$reject(promise, err);else if (options === undefined) lib$rsvp$$internal$$resolve(promise, val);else if (options === true) lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$arrayResult(arguments));else if (lib$rsvp$utils$$isArray(options)) lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$makeObject(arguments, options));else lib$rsvp$$internal$$resolve(promise, val);
	      };

	      if (promiseInput) {
	        return lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self);
	      } else {
	        return lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self);
	      }
	    };

	    fn.__proto__ = nodeFunc;

	    return fn;
	  }

	  var lib$rsvp$node$$default = lib$rsvp$node$$denodeify;

	  function lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self) {
	    var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
	    if (result === lib$rsvp$node$$ERROR) {
	      lib$rsvp$$internal$$reject(promise, result.value);
	    }
	    return promise;
	  }

	  function lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self) {
	    return lib$rsvp$promise$$default.all(args).then(function (args) {
	      var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
	      if (result === lib$rsvp$node$$ERROR) {
	        lib$rsvp$$internal$$reject(promise, result.value);
	      }
	      return promise;
	    });
	  }

	  function lib$rsvp$node$$needsPromiseInput(arg) {
	    if (arg && (typeof arg === 'undefined' ? 'undefined' : babelHelpers_typeof(arg)) === 'object') {
	      if (arg.constructor === lib$rsvp$promise$$default) {
	        return true;
	      } else {
	        return lib$rsvp$node$$getThen(arg);
	      }
	    } else {
	      return false;
	    }
	  }
	  var lib$rsvp$platform$$platform;

	  /* global self */
	  if ((typeof self === 'undefined' ? 'undefined' : babelHelpers_typeof(self)) === 'object') {
	    lib$rsvp$platform$$platform = self;

	    /* global global */
	  } else if ((typeof global === 'undefined' ? 'undefined' : babelHelpers_typeof(global)) === 'object') {
	      lib$rsvp$platform$$platform = global;
	    } else {
	      throw new Error('no global: `self` or `global` found');
	    }

	  var lib$rsvp$platform$$default = lib$rsvp$platform$$platform;
	  function lib$rsvp$race$$race(array, label) {
	    return lib$rsvp$promise$$default.race(array, label);
	  }
	  var lib$rsvp$race$$default = lib$rsvp$race$$race;
	  function lib$rsvp$reject$$reject(reason, label) {
	    return lib$rsvp$promise$$default.reject(reason, label);
	  }
	  var lib$rsvp$reject$$default = lib$rsvp$reject$$reject;
	  function lib$rsvp$resolve$$resolve(value, label) {
	    return lib$rsvp$promise$$default.resolve(value, label);
	  }
	  var lib$rsvp$resolve$$default = lib$rsvp$resolve$$resolve;
	  function lib$rsvp$rethrow$$rethrow(reason) {
	    setTimeout(function () {
	      throw reason;
	    });
	    throw reason;
	  }
	  var lib$rsvp$rethrow$$default = lib$rsvp$rethrow$$rethrow;

	  // defaults
	  lib$rsvp$config$$config.async = lib$rsvp$asap$$default;
	  lib$rsvp$config$$config.after = function (cb) {
	    setTimeout(cb, 0);
	  };
	  var lib$rsvp$$cast = lib$rsvp$resolve$$default;
	  function lib$rsvp$$async(callback, arg) {
	    lib$rsvp$config$$config.async(callback, arg);
	  }

	  function lib$rsvp$$on() {
	    lib$rsvp$config$$config['on'].apply(lib$rsvp$config$$config, arguments);
	  }

	  function lib$rsvp$$off() {
	    lib$rsvp$config$$config['off'].apply(lib$rsvp$config$$config, arguments);
	  }

	  // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
	  if (typeof window !== 'undefined' && babelHelpers_typeof(window['__PROMISE_INSTRUMENTATION__']) === 'object') {
	    var lib$rsvp$$callbacks = window['__PROMISE_INSTRUMENTATION__'];
	    lib$rsvp$config$$configure('instrument', true);
	    for (var lib$rsvp$$eventName in lib$rsvp$$callbacks) {
	      if (lib$rsvp$$callbacks.hasOwnProperty(lib$rsvp$$eventName)) {
	        lib$rsvp$$on(lib$rsvp$$eventName, lib$rsvp$$callbacks[lib$rsvp$$eventName]);
	      }
	    }
	  }

	  var lib$rsvp$umd$$RSVP = {
	    'race': lib$rsvp$race$$default,
	    'Promise': lib$rsvp$promise$$default,
	    'allSettled': lib$rsvp$all$settled$$default,
	    'hash': lib$rsvp$hash$$default,
	    'hashSettled': lib$rsvp$hash$settled$$default,
	    'denodeify': lib$rsvp$node$$default,
	    'on': lib$rsvp$$on,
	    'off': lib$rsvp$$off,
	    'map': lib$rsvp$map$$default,
	    'filter': lib$rsvp$filter$$default,
	    'resolve': lib$rsvp$resolve$$default,
	    'reject': lib$rsvp$reject$$default,
	    'all': lib$rsvp$all$$default,
	    'rethrow': lib$rsvp$rethrow$$default,
	    'defer': lib$rsvp$defer$$default,
	    'EventTarget': lib$rsvp$events$$default,
	    'configure': lib$rsvp$config$$configure,
	    'async': lib$rsvp$$async
	  };

	  /* global define:true module:true window: true */
	  if (typeof define === 'function' && define['amd']) {
	    define(function () {
	      return lib$rsvp$umd$$RSVP;
	    });
	  } else if (typeof module !== 'undefined' && module['exports']) {
	    module['exports'] = lib$rsvp$umd$$RSVP;
	  } else if (typeof lib$rsvp$platform$$default !== 'undefined') {
	    lib$rsvp$platform$$default['RSVP'] = lib$rsvp$umd$$RSVP;
	  }
	}).call(this);
	});

	var extend = Object.assign;

	// 配置项
	var config = {
	  // 心跳时间（一分钟）
	  heartbeatsTime: 60 * 1000,
	  WebSocket: global.WebSocket || global.MozWebSocket || require('ws')
	};

	// 命名空间，挂载私有方法
	var engine = {};

	// realtime 对象内，会被派发的全部事件名
	var eNameIndex = {
	  // session 连接建立完毕
	  open: 'open',
	  // 断开重连
	  reuse: 'reuse',
	  // websocket 连接关闭
	  close: 'close',
	  // 新建一个 conversation 时派发
	  create: 'create',
	  // conversation 新增加成员
	  // deprecated
	  join: 'join',
	  // conversation 成员离开
	  // deprecated
	  left: 'left',
	  // 当前用户被加入会话
	  invited: 'invited',
	  // 当前用户被踢出会话
	  kicked: 'kicked',
	  // 用户加入会话
	  membersjoined: 'membersjoined',
	  // 用户离开会话
	  membersleft: 'membersleft',
	  // conversation 内发送的数据
	  message: 'message',
	  // conversation 消息回执
	  receipt: 'receipt',
	  // conversation 更新
	  update: 'update',
	  // 各种错误
	  error: 'error'
	};

	// 生成 conversation 对象，挂载所有 conversation 相关方法，每次调用实例化
	var newConvObject = function newConvObject(cache) {

	  var addOrRemove = function addOrRemove(cid, argument, callback, cmd) {
	    var members = [];
	    var options;
	    var _fun;
	    var eventName;

	    // 传入 userId
	    if (typeof argument === 'string') {
	      members.push(argument);
	    } else {
	      // 传入多个 userId
	      members = argument;
	    }
	    options = {
	      cid: cid,
	      members: members,
	      serialId: engine.getSerialId(cache)
	    };
	    switch (cmd) {
	      case 'add':
	        eventName = 'conv-added';
	        engine.convAdd(cache, options);
	        break;
	      case 'remove':
	        eventName = 'conv-removed';
	        engine.convRemove(cache, options);
	        break;
	    }
	    _fun = function fun(data) {
	      if (data.i === options.serialId) {
	        if (callback) {
	          callback(data);
	        }
	        cache.ec.off(eventName, _fun);
	      }
	    };
	    cache.ec.on(eventName, _fun);
	    return this;
	  };

	  return {
	    // cid 即 conversation id
	    id: '',
	    // 创建 Conversation 时的默认属性
	    attr: {},
	    add: function add(argument, callback) {
	      addOrRemove(this.id, argument, callback, 'add');
	      return this;
	    },
	    remove: function remove(argument, callback) {
	      addOrRemove(this.id, argument, callback, 'remove');
	      return this;
	    },
	    // 自己加入
	    join: function join(callback) {
	      this.add(cache.options.peerId, callback);
	      return this;
	    },
	    // 自己离开
	    leave: function leave(callback) {
	      this.remove(cache.options.peerId, callback);
	      return this;
	    },
	    send: function send(data, argument1, argument2) {
	      var callback;
	      var options = {};
	      var me = this;
	      switch (arguments.length) {
	        // 只有两个参数时，第二个是回调函数
	        case 2:
	          callback = argument1;
	          break;
	        // 三个参数时，第二个参数是配置项，第三个参数是回调
	        case 3:
	          options = argument1;
	          callback = argument2;
	          break;
	      }
	      options.cid = me.id;
	      options.serialId = engine.getSerialId(cache);

	      // 如果 type 存在，则发送多媒体格式
	      if (options.type) {
	        options.data = engine.setMediaMsg(cache, options.type, data);
	      } else {
	        if (typeof data === 'string') {
	          options.data = data;
	        } else {
	          // 协议中只接收 string 类型
	          options.data = JSON.stringify(data);
	        }
	      }

	      // 是否需要消息回执
	      if (options.receipt) {
	        options.receipt = 1;
	      }

	      // 如果是暂态消息，则不需回调，服务器也不会返回回调
	      if (!options.transient) {
	        var fun = function fun(data) {
	          if (data.i === options.serialId) {
	            if (callback) {
	              callback(data);
	            }
	            cache.ec.off('ack', fun);
	          }
	        };
	        cache.ec.on('ack', fun);
	      }
	      engine.send(cache, options, callback);
	      return this;
	    },
	    log: function log(argument, callback) {
	      var options = {};
	      switch (arguments.length) {
	        // 如果只有一个参数，那么是 callback
	        case 1:
	          callback = argument;
	          break;
	        case 2:
	          options = argument;
	          break;
	      }
	      options.cid = options.cid || this.id;
	      options.serialId = options.serialId || engine.getSerialId(cache);
	      var fun = function fun(data) {
	        if (data.i === options.serialId) {
	          if (callback) {
	            // 对查出的类型进行过滤，兼容多端通信
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	              for (var _iterator = data.logs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var log = _step.value;

	                log.data = engine.getMediaMsg(cache, log.data);
	                // 增加字段，兼容接收消息的字段
	                log.fromPeerId = log.from;
	                log.msg = log.data;
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

	            callback(data.logs);
	          }
	          cache.ec.off('logs', fun);
	        }
	      };
	      cache.ec.on('logs', fun);

	      // 注：立刻获取消息历史有可能取不到
	      engine.convLog(cache, options);
	      return this;
	    },
	    receive: function receive(callback) {
	      var id = this.id;
	      cache.ec.on(eNameIndex.message, function (data) {
	        // 是否是当前 room 的信息
	        if (id === data.cid) {
	          callback(data);
	        }
	      });
	      return this;
	    },
	    // 获取信息回执
	    receipt: function receipt(callback) {
	      var id = this.id;
	      cache.ec.on(eNameIndex.receipt, function (data) {
	        // 是否是当前 room 的信息
	        if (id === data.cid) {
	          callback(data);
	        }
	      });
	      return this;
	    },
	    list: function list(callback) {
	      var options = {};
	      var id = this.id;
	      options.where = {
	        objectId: id
	      };
	      options.serialId = engine.getSerialId(cache);
	      var fun = function fun(data) {
	        if (data.i === options.serialId) {
	          if (callback) {
	            if (data.results.length) {
	              // 因为是查询固定的 cid，所以结果只有一个。
	              callback(data.results[0].m);
	            } else {
	              callback([]);
	            }
	          }
	          cache.ec.off('conv-results', fun);
	        }
	      };
	      cache.ec.on('conv-results', fun);
	      engine.convQuery(cache, options);
	      return this;
	    },
	    count: function count(callback) {
	      var id = this.id;
	      var options = {
	        cid: id,
	        serialId: engine.getSerialId(cache)
	      };
	      var fun = function fun(data) {
	        if (data.i === options.serialId) {
	          if (callback) {
	            callback(data.count);
	          }
	          cache.ec.off('conv-result', fun);
	        }
	      };
	      cache.ec.on('conv-result', fun);
	      engine.convCount(cache, options);
	      return this;
	    },
	    update: function update(data, callback) {
	      var id = this.id;
	      var options = {
	        cid: id,
	        data: data,
	        serialId: engine.getSerialId(cache)
	      };
	      var fun = function fun(data) {
	        if (data.i === options.serialId) {
	          if (callback) {
	            callback(data);
	          }
	          cache.ec.off('conv-updated', fun);
	        }
	      };
	      cache.ec.on('conv-updated', fun);
	      engine.convUpdate(cache, options);
	      return this;
	    }
	  };
	};

	// 创建一个新的 realtime 对象，挂载所有 realtime 中的方法，每次调用实例化一个实例，支持单页多实例。
	var newRealtimeObject = function newRealtimeObject() {

	  // 缓存一些已经实例化的变量
	  var cache = {
	    // 基础配置，包括 appId，peerId 等
	    options: undefined,
	    // WebSocket 实例
	    ws: undefined,
	    // 事件中心
	    ec: undefined,
	    // 所有已生成的 conversation 对象
	    conv: {},
	    // 是否已经 open 完毕，主要在 close 方法中检测
	    openFlag: false,
	    // 是否是用户关闭，如果不是将会断开重连
	    closeFlag: false,
	    // reuse 事件的重试 timer
	    reuseTimer: undefined,
	    // resuse 状态，如果为 true 表示内部已经在重试中
	    reuseFlag: false,
	    // 当前的 serialId
	    serialId: 2015
	  };

	  return {
	    clientId: '',
	    cache: cache,
	    open: function open(callback) {
	      var me = this;
	      var cache = this.cache;
	      cache.closeFlag = false;
	      engine.getServer(cache, cache.options, function (data) {
	        if (data) {
	          engine.connect(cache, {
	            server: cache.server
	          });
	        }
	      });
	      if (callback) {
	        cache.ec.once(eNameIndex.open, callback);
	      }
	      // 断开重连
	      cache.ec.once(eNameIndex.reuse, function () {
	        if (cache.reuseTimer) {
	          clearTimeout(cache.reuseTimer);
	        }
	        cache.reuseTimer = setTimeout(function () {
	          me.open();
	        }, 5000);
	      });
	      return this;
	    },
	    // 表示关闭当前的 session 连接和 WebSocket 连接，并且回收内存
	    close: function close() {
	      var cache = this.cache;
	      if (!cache.openFlag) {
	        throw new Error('Must call after open() has successed.');
	      }
	      cache.closeFlag = true;
	      engine.closeSession(cache);
	      cache.ws.close();
	      return this;
	    },
	    on: function on(eventName, callback) {
	      this.cache.ec.on(eventName, callback);
	      return this;
	    },
	    once: function once(eventName, callback) {
	      this.cache.ec.once(eventName, callback);
	      return this;
	    },
	    emit: function emit(eventName, data) {
	      this.cache.ec.emit(eventName, data);
	      return this;
	    },
	    off: function off(eventName, callback) {
	      this.cache.ec.off(eventName, callback);
	      return this;
	    },
	    room: function room(argument, callback) {
	      var cache = this.cache;
	      if (!cache.openFlag) {
	        throw new Error('Must call after open() has successed.');
	      }

	      var convObject;

	      // 传入 convId
	      if (typeof argument === 'string') {
	        var convId = argument;

	        // 优先使用 cache 中的 conv
	        if (cache.conv[convId]) {
	          convObject = cache.conv[convId];
	        } else {
	          convObject = newConvObject(cache);
	        }

	        // 去服务器端判断下当前 room id 是否存在
	        this.query({
	          where: {
	            objectId: convId
	          }
	        }, function (data) {

	          // 如果服务器端有这个 id
	          if (data.length) {
	            convObject.id = convId;
	            convObject.name = data[0].name;
	            // 获取初始化时的属性
	            convObject.attr = data[0].attr;
	            // 将 conv 写入 cache
	            cache.conv[convId] = convObject;
	          }

	          if (callback) {
	            // 如果服务器端存在就直接返回 roomObject
	            if (data.length) {
	              callback(convObject);
	            } else {
	              // 如果服务器端不存在这个 room id
	              callback(null);
	            }
	          }
	        });
	      } else {
	        // 传入 options
	        // 如果没有传入参数，则给一个错误提示
	        if (!argument) {
	          throw new Error('Createing room must have a callback function.');
	        }

	        var options;

	        // 只传入 callback
	        if (typeof argument === 'function') {
	          callback = argument;
	        } else {
	          // 传入参数
	          options = argument;
	        }

	        options = {
	          // Room 的名字
	          name: options.name || '',
	          // 人员的 id list
	          members: options.members || [],
	          // 默认的数据，可以放 Conversation 名字等
	          attr: options.attr || {},
	          transient: options.transient || false,
	          unique: options.unique || false,
	          serialId: engine.getSerialId(cache)
	        };

	        convObject = newConvObject(cache);

	        engine.startConv(cache, options, callback);

	        // 服务器端确认收到对话创建，并创建成功
	        var fun = function fun(data) {
	          if (data.i === options.serialId) {
	            convObject.id = data.cid;
	            convObject.name = options.name;
	            convObject.attr = options.attr;
	            // 将 conv 写入 cache
	            cache.conv[convObject.id] = convObject;
	            if (callback) {
	              callback(convObject);
	            }
	            cache.ec.emit(eNameIndex.create, data);
	            cache.ec.off('conv-started', fun);
	          }
	        };
	        cache.ec.on('conv-started', fun);
	      }
	      return convObject;
	    },
	    // conv 就是 room 的别名
	    conv: function conv() {
	      return this.room.apply(this, arguments);
	    },
	    // 相关查询，包括用户列表查询，房间查询等
	    query: function query(argument, callback) {
	      var cache = this.cache;
	      if (!cache.openFlag) {
	        throw new Error('Must call after open() has successed.');
	      }
	      var options = {};
	      switch (arguments.length) {
	        // 如果只有一个参数，那么是 callback
	        case 1:
	          callback = argument;
	          break;
	        case 2:
	          options = argument;
	          break;
	      }
	      options.serialId = engine.getSerialId(cache);
	      var fun = function fun(data) {
	        if (data.i === options.serialId) {
	          if (callback) {
	            callback(data.results);
	          }
	          cache.ec.off('conv-results', fun);
	        }
	      };
	      cache.ec.on('conv-results', fun);
	      if (!options.where) {
	        options.where = {};
	        // 默认查找的当前用户所在的 conv
	        options.where.m = cache.options.peerId;
	      }
	      engine.convQuery(cache, options);
	      return this;
	    },
	    // 判断用户是否在线
	    ping: function ping(argument, callback) {
	      var cache = this.cache;
	      if (!cache.openFlag) {
	        throw new Error('Must call after open() has successed.');
	      }
	      if (!callback) {
	        throw new Error('Ping must have callback.');
	      }
	      var peerIdList = [];
	      // 传入一个 id
	      if (typeof argument === 'string') {
	        peerIdList.push(argument);
	      } else {
	        // 传入的是数组
	        peerIdList = argument;
	      }
	      var options = {
	        serialId: engine.getSerialId(cache),
	        peerIdList: peerIdList
	      };
	      var fun = function fun(data) {
	        if (data.i === options.serialId) {
	          callback(data.onlineSessionPeerIds);
	          cache.ec.off('session-query-result', fun);
	        }
	      };
	      cache.ec.on('session-query-result', fun);
	      engine.querySession(cache, options);
	      return this;
	    }
	  };
	};

	// 主函数，启动通信并获得 realtimeObject
	var realtime = function realtime(options, callback) {
	  if ((typeof options === 'undefined' ? 'undefined' : babelHelpers_typeof(options)) !== 'object') {
	    throw new Error('realtime need a argument at least.');
	  } else if (!options.appId) {
	    throw new Error('Options must have appId.');
	  } else if (!config.WebSocket) {
	    console.error('Browser must support WebSocket, please read LeanCloud doc and use plugin.');
	  } else {

	    // 通过判断插件库中的对象是否存在来检测是否需要关掉安全链接，在需要兼容 flash 的时候需要关掉，默认开启。
	    var secure = config.WebSocket.loadFlashPolicyFile ? false : true;

	    options = {
	      // LeanCloud 中唯一的服务 id
	      appId: options.appId,
	      // clientId 对应的就是 peerId，如果不传入服务器会自动生成，客户端没有持久化该数据。
	      peerId: options.clientId,
	      // 是否开启 HTML 转义，防止 XSS 攻击，默认关闭
	      encodeHTML: options.encodeHTML || false,
	      // 是否开启服务器端认证，传入认证函数
	      auth: options.auth,
	      // 是否关闭 WebSocket 的安全链接，即由 wss 协议转为 ws 协议，关闭 SSL 保护。默认开启。
	      secure: typeof options.secure === 'undefined' ? secure : options.secure,
	      // 服务器地区选项，默认为中国大陆
	      region: options.region || 'cn'
	    };

	    var realtimeObj = newRealtimeObject();
	    realtimeObj.clientId = options.peerId;
	    realtimeObj.cache.options = options;
	    realtimeObj.cache.ec = eventCenter();
	    realtimeObj.cache.authFun = options.auth;
	    realtimeObj.open(callback);

	    return realtimeObj;
	  }
	};

	// 赋值版本号
	realtime.version = version;

	// 挂载私有方法
	realtime._tool = tool$1;
	realtime._engine = engine;

	realtime.config = function (newConfig) {
	  extend(config, newConfig);
	};

	// WebSocket Open
	engine.wsOpen = function (cache) {
	  engine.bindEvent(cache);
	  engine.openSession(cache, {
	    serialId: engine.getSerialId(cache)
	  });
	  // 启动心跳
	  engine.heartbeats(cache);
	  // 启动守护进程
	  engine.guard(cache);
	};

	// WebSocket Close
	engine.wsClose = function (cache, event) {
	  // 派发全局 close 事件，表示 realtime 已经关闭
	  cache.ec.emit(eNameIndex.close, event);
	};

	// WebSocket Message
	engine.wsMessage = function (cache, msg) {
	  var data = JSON.parse(msg.data);

	  // 对服务端返回的数据进行逻辑包装
	  if (data.cmd) {
	    var eventName = data.cmd;
	    if (data.op) {
	      eventName += '-' + data.op;
	    }
	    cache.ec.emit(eventName, data);
	  }
	};

	engine.wsError = function (cache, data) {
	  cache.ec.emit(eNameIndex.error, data);
	  throw data;
	};

	// WebSocket send message
	engine.wsSend = function (cache, data) {
	  if (!cache.closeFlag) {
	    if (!cache.ws) {
	      throw new Error('The realtimeObject must opened first. Please listen to the "open" event.');
	    } else {
	      data.peerId = cache.options.peerId;
	      cache.ws.send(JSON.stringify(data));
	    }
	  }
	};

	engine.createSocket = function (cache, server) {
	  if (cache.ws) {
	    cache.ws.close();
	  }
	  var ws = new config.WebSocket(server);
	  cache.ws = ws;
	  ws.addEventListener('open', function () {
	    engine.wsOpen(cache);
	  });
	  ws.addEventListener('close', function (event) {
	    engine.wsClose(cache, event);
	  });
	  ws.addEventListener('message', function (msg) {
	    engine.wsMessage(cache, msg);
	  });
	  ws.addEventListener('error', function (data) {
	    engine.wsError(cache, data);
	  });
	};

	// 心跳程序
	engine.heartbeats = function (cache) {

	  // 当前 RealtimeObject 已经启动心跳程序
	  if (cache.openFlag) {
	    return;
	  }

	  var timer;
	  cache.ws.addEventListener('message', function () {
	    if (timer) {
	      clearTimeout(timer);
	    }
	    timer = setTimeout(function () {
	      cache.ws.send('{}');
	    }, config.heartbeatsTime);
	  });
	};

	// 守护进程，会派发 reuse 重连事件
	engine.guard = function (cache) {

	  // 当前 RealtimeObject 已经启动守护进程
	  if (cache.openFlag) {
	    return;
	  }

	  // 超时是三分钟
	  var timeLength = 3 * 60 * 1000;
	  var timer;

	  // 结合心跳事件，如果长时间没有收到服务器的心跳，也要触发重连机制
	  cache.ws.addEventListener('message', function () {
	    if (timer) {
	      clearTimeout(timer);
	    }
	    timer = setTimeout(function () {
	      if (!cache.closeFlag && !cache.reuseFlag) {
	        cache.reuseFlag = true;
	        // 超时则派发重试事件
	        cache.ec.emit(eNameIndex.reuse);
	      }
	    }, timeLength);
	  });

	  // 监测断开事件
	  cache.ec.on(eNameIndex.close + ' ' + 'session-closed', function () {
	    if (!cache.closeFlag && !cache.reuseFlag) {
	      cache.reuseFlag = true;
	      cache.ec.emit(eNameIndex.reuse);
	    }
	  });
	};

	engine.connect = function (cache, options) {
	  var server = options.server;
	  // 判断获取出缓存的时间是否是比较新的
	  if (server && now() <= server.expires) {
	    engine.createSocket(cache, server.server);
	  } else {
	    cache.ec.emit(eNameIndex.error);
	    throw new Error('WebSocket connet failed.');
	  }
	};

	engine.getServer = function (cache, options, callback) {
	  var appId = options.appId;
	  // 是否获取 wss 的安全链接
	  var secure = options.secure;
	  var url = '';
	  var protocol = '//';
	  if (secure) {
	    protocol = 'https://';
	  }
	  var node = '';
	  switch (options.region) {
	    case 'cn':
	      node = 'g0';
	      break;
	    case 'us':
	      node = 'a0';
	      break;
	    default:
	      throw new Error('There is no this region.');
	  }
	  url = protocol + 'router-' + node + '-push.leancloud.cn/v1/route';
	  url += '?_t=' + now() + '&appId=' + appId;
	  if (secure) {
	    url += '&secure=1';
	  }
	  ajax(url, function (error, data) {
	    if (data) {
	      data.expires = now() + data.ttl * 1000;
	      cache.server = data;
	      callback(data);
	    } else {
	      cache.ec.emit(eNameIndex.error);
	    }
	  });
	};

	// 打开 session
	engine.openSession = function (cache, options) {
	  var cmd = {
	    cmd: 'session',
	    op: 'open',
	    appId: cache.options.appId,
	    ua: 'js/' + version,
	    i: options.serialId
	  };
	  if (cache.authFun) {
	    cache.authFun({
	      clientId: cache.options.peerId
	    }, function (authResult) {
	      if (authResult && authResult.signature) {
	        cmd.n = authResult.nonce;
	        cmd.t = authResult.timestamp;
	        cmd.s = authResult.signature;
	        engine.wsSend(cache, cmd);
	      } else {
	        throw new Error('Session open denied by application: ' + authResult);
	      }
	    });
	  } else {
	    engine.wsSend(cache, cmd);
	  }
	};

	engine.closeSession = function (cache) {
	  engine.wsSend(cache, cache, {
	    cmd: 'session',
	    op: 'close'
	  });
	};

	engine.startConv = function (cache, options) {
	  var cmd = {
	    cmd: 'conv',
	    op: 'start',
	    // m [] 初始的对话用户id列表，服务器默认会把自己加入
	    m: options.members,
	    // attr json对象，对话的任意初始属性
	    attr: {
	      name: options.name || '',
	      attr: options.attr || {}
	    },
	    i: options.serialId,
	    unique: options.unique || false,
	    // 是否是开放聊天室，无人数限制
	    transient: options.transient || false
	  };
	  if (cache.authFun) {
	    cache.authFun({
	      clientId: cache.options.peerId,
	      members: options.members
	    }, function (authResult) {
	      if (authResult && authResult.signature) {
	        cmd.n = authResult.nonce;
	        cmd.t = authResult.timestamp;
	        cmd.s = authResult.signature;
	        engine.wsSend(cache, cmd);
	      } else {
	        throw new Error('Conversation creation denied by application: ' + authResult);
	      }
	    });
	  } else {
	    engine.wsSend(cache, cmd);
	  }
	};

	engine.convAdd = function (cache, options) {
	  var cmd = {
	    cmd: 'conv',
	    op: 'add',
	    cid: options.cid,
	    m: options.members,
	    i: options.serialId
	  };
	  if (cache.authFun) {
	    cache.authFun({
	      clientId: cache.options.peerId,
	      members: options.members,
	      convId: options.cid,
	      action: 'invite'
	    }, function (authResult) {
	      if (authResult && authResult.signature) {
	        cmd.n = authResult.nonce;
	        cmd.t = authResult.timestamp;
	        cmd.s = authResult.signature;
	        engine.wsSend(cache, cmd);
	      } else {
	        throw new Error('Adding members to conversation denied by application: ' + authResult);
	      }
	    });
	  } else {
	    engine.wsSend(cache, cmd);
	  }
	};

	engine.convRemove = function (cache, options) {
	  var cmd = {
	    cmd: 'conv',
	    op: 'remove',
	    cid: options.cid,
	    m: options.members,
	    i: options.serialId
	  };
	  if (cache.authFun && (options.members.length > 1 || options.members[0] != cache.options.peerId)) {
	    cache.authFun({
	      clientId: cache.options.peerId,
	      members: options.members,
	      convId: options.cid,
	      action: 'kick'
	    }, function (authResult) {
	      if (authResult && authResult.signature) {
	        cmd.n = authResult.nonce;
	        cmd.t = authResult.timestamp;
	        cmd.s = authResult.signature;
	        engine.wsSend(cache, cmd);
	      } else {
	        throw new Error('Removing members from conversation denied by application: ' + authResult);
	      }
	    });
	  } else {
	    engine.wsSend(cache, cmd);
	  }
	};

	engine.send = function (cache, options) {
	  engine.wsSend(cache, {
	    cmd: 'direct',
	    cid: options.cid,
	    msg: options.data,
	    i: options.serialId,
	    // r 是否需要回执需要则1，否则不传
	    r: options.receipt || false,
	    // transient 是否暂态消息（暂态消息不返回 ack，不保留离线消息，不触发离 线推送），否则不传
	    transient: options.transient || false
	  });
	};

	engine.convQuery = function (cache, options) {
	  options = options || {};
	  var where = options.where || {};

	  // 同时查找含有数组中 id 的用户所在的 conversation
	  if (where.m && typeof where.m !== 'string') {
	    where.m = {
	      $all: where.m
	    };
	  }

	  // 批量查找 room 信息
	  if (where.roomIds || where.convIds) {
	    where.objectId = {
	      $in: where.roomIds || where.convIds
	    };
	    // 避免对查询项产生干扰
	    delete where.roomIds;
	    delete where.convIds;
	  }

	  engine.wsSend(cache, {
	    cmd: 'conv',
	    op: 'query',
	    // where 可选，对象，默认为包含自己的查询 {"m": peerId}
	    where: where,
	    // sort 可选，字符串，默认为 -lm，最近对话反序
	    sort: options.sort || '-lm',
	    // limit 可选，数字，默认10
	    limit: options.limit || 10,
	    // skip 可选，数字，默认0
	    skip: options.skip || 0,
	    // i serial-id
	    i: options.serialId
	  });
	};

	// 查询 session 在线情况
	engine.querySession = function (cache, options) {
	  engine.wsSend(cache, {
	    cmd: 'session',
	    op: 'query',
	    i: options.serialId,
	    sessionPeerIds: options.peerIdList
	  });
	};

	// 查询 conversation 的聊天记录
	engine.convLog = function (cache, options) {
	  engine.wsSend(cache, {
	    cmd: 'logs',
	    cid: options.cid,
	    // t 时间戳，从 t 开始向前查询
	    t: options.t || undefined,
	    // mid 消息 id，从消息 id 开始向前查询（和 t 共同使用，为防止某毫秒时刻有重复消息）
	    mid: options.mid || undefined,
	    limit: options.limit || 20,
	    // i serial-id
	    i: options.serialId
	  });
	};

	engine.convUpdate = function (cache, options) {
	  engine.wsSend(cache, {
	    cmd: 'conv',
	    op: 'update',
	    cid: options.cid,
	    // attr 要修改的内容
	    attr: options.data,
	    i: options.serialId
	  });
	};

	engine.convAck = function (cache, options) {
	  engine.wsSend(cache, {
	    cmd: 'ack',
	    cid: options.cid,
	    mid: options.mid
	  });
	};

	engine.convCount = function (cache, options) {
	  engine.wsSend(cache, {
	    cmd: 'conv',
	    op: 'count',
	    i: options.serialId,
	    cid: options.cid
	  });
	};

	// 取出多媒体类型的格式（内置 HTML 转义逻辑）
	engine.getMediaMsg = function (cache, msg) {

	  // 检查是否是 JSON 格式的一个 String 类型
	  if (!isJSONString(msg)) {

	    // 是否对消息中的 HTML 进行转义
	    if (cache.options.encodeHTML) {
	      msg = encodeHTML(msg);
	    }
	    return msg;
	  }

	  msg = JSON.parse(msg);

	  // 检查是否是多媒体类型
	  if (!msg.hasOwnProperty('_lctype')) {
	    return msg;
	  }

	  var obj = {
	    text: msg._lctext,
	    attr: msg._lcattrs
	  };

	  // 是否对消息中的 HTML 进行转义，对媒体格式仅对 text 转义
	  if (cache.options.encodeHTML) {
	    obj.text = encodeHTML(msg._lctext);
	  }

	  if (msg._lcfile && msg._lcfile.url) {
	    obj.url = msg._lcfile.url;
	  }
	  if (msg._lcfile && msg._lcfile.metaData) {
	    obj.metaData = msg._lcfile.metaData;
	  }

	  // 多媒体类型
	  switch (msg._lctype) {
	    case -1:
	      obj.type = 'text';
	      break;
	    case -2:
	      obj.type = 'image';
	      break;
	    case -3:
	      obj.type = 'audio';
	      break;
	    case -4:
	      obj.type = 'video';
	      break;
	    case -5:
	      obj.type = 'location';
	      if (msg._lcloc) {
	        obj.location = msg._lcloc;
	      }
	      break;
	    case -6:
	      obj.type = 'file';
	      break;
	    // 自定义类型，返回全部自定义数据
	    default:
	      obj = msg;
	      break;
	  }
	  return obj;
	};

	// 生成多媒体特定格式的数据
	engine.setMediaMsg = function (cache, type, data) {
	  var obj;
	  if (type !== 'text' && !data.metaData) {
	    throw new Error('Media Data must have metaData attribute.');
	  }
	  switch (type) {
	    case 'text':
	      obj = {
	        _lctype: -1,
	        _lctext: data.text,
	        // _lcattrs 是用来存储用户自定义的一些键值对
	        _lcattrs: data.attr
	      };
	      break;
	    case 'image':
	      obj = {
	        _lctype: -2,
	        _lctext: data.text,
	        // _lcattrs 是用来存储用户自定义的一些键值对
	        _lcattrs: data.attr,
	        _lcfile: {
	          url: data.url,
	          objId: data.objectId,
	          metaData: {
	            name: data.metaData.name,
	            // 格式
	            format: data.metaData.format,
	            //单位：像素
	            height: data.metaData.height,
	            //单位：像素
	            width: data.metaData.width,
	            //单位：b
	            size: data.metaData.size
	          }
	        }
	      };
	      break;
	    case 'audio':
	      obj = {
	        _lctype: -3,
	        _lctext: data.text,
	        // _lcattrs 是用来存储用户自定义的一些键值对
	        _lcattrs: data.attr,
	        _lcfile: {
	          url: data.url,
	          objId: data.objectId,
	          metaData: {
	            name: data.metaData.name,
	            // 媒体格式
	            format: data.metaData.format,
	            //单位：秒
	            duration: data.metaData.duration,
	            //单位：b
	            size: data.metaData.size
	          }
	        }
	      };
	      break;
	    case 'video':
	      obj = {
	        _lctype: -4,
	        _lctext: data.text,
	        // _lcattrs 是用来存储用户自定义的一些键值对
	        _lcattrs: data.attr,
	        _lcfile: {
	          url: data.url,
	          objId: data.objectId,
	          metaData: {
	            name: data.metaData.name,
	            // 媒体格式
	            format: data.metaData.format,
	            // 单位：秒
	            duration: data.metaData.duration,
	            //单位：b
	            size: data.metaData.size
	          }
	        }
	      };
	      break;
	    case 'location':
	      obj = {
	        _lctype: -5,
	        _lctext: data.text,
	        // _lcattrs 是用来存储用户自定义的一些键值对
	        _lcattrs: data.attr,
	        _lcloc: {
	          // 经度
	          longitude: data.metaData.longitude,
	          // 维度
	          latitude: data.metaData.latitude
	        }
	      };
	      break;
	    case 'file':
	      obj = {
	        _lctype: -6,
	        _lctext: data.text,
	        // _lcattrs 是用来存储用户自定义的一些键值对
	        _lcattrs: data.attr,
	        _lcfile: {
	          name: data.metaData.name,
	          // 单位：b
	          size: data.metaData.size
	        }
	      };
	      break;
	  }
	  obj = JSON.stringify(obj);
	  return obj;
	};

	// 取自增的 number 类型
	engine.getSerialId = function (cache) {
	  cache.serialId++;
	  if (cache.serialId > 999999) {
	    cache.serialId = 2015;
	  }
	  return cache.serialId;
	};

	// 绑定所有服务返回事件
	engine.bindEvent = function (cache) {

	  // RealtimeObject 已经初始化过，不再重复绑定事件
	  if (cache.openFlag) {
	    return;
	  }

	  cache.ec.on('session-opened', function (data) {
	    // 标记重试状态为 false，表示没有在重试
	    cache.reuseFlag = false;
	    // 标记开启状态，已经开启
	    cache.openFlag = true;
	    // 派发全局 open 事件，表示 realtime 已经启动
	    cache.ec.emit(eNameIndex.open, data);
	  });

	  // cache.ec.on('session-closed', function() {
	  // session 被关闭，则关闭当前 websocket 连接
	  // });

	  // 查询 session 在线情况
	  // cache.ec.on('session-query-result', function() {});

	  cache.ec.on('session-error', function (data) {
	    cache.ec.emit(eNameIndex.error, data);
	  });

	  // 服务器端确认收到 conversation 创建，并创建成功
	  // 在创建时已经做绑定，所以注释掉
	  // cache.ec.on('conv-started', function(data) {});

	  // 服务器端发给客户端，表示当前用户加入了某个对话。包括创建对话、或加入对话
	  cache.ec.on('conv-joined', function (data) {
	    // 不是当前用户自己加入
	    // join 事件已废弃
	    // 这里把当前用户主动操作的情况过滤掉了，为了兼容保持原样。
	    if (data.peerId !== data.initBy) {
	      cache.ec.emit(eNameIndex.join, data);
	    }
	    cache.ec.emit(eNameIndex.invited, data);
	  });

	  // 服务器端发给客户端，表示当前用户离开了某个对话，不再能收到对话的消息
	  cache.ec.on('conv-left', function (data) {
	    cache.ec.emit(eNameIndex.left, data);
	    cache.ec.emit(eNameIndex.kicked, data);
	  });

	  // 服务器端发给客户端，表示当前对话有新人加入
	  cache.ec.on('conv-members-joined', function (data) {
	    cache.ec.emit(eNameIndex.join, data);
	    cache.ec.emit(eNameIndex.membersjoined, data);
	  });

	  // 服务器端发给客户端，表示当前对话有新人离开
	  cache.ec.on('conv-members-left', function (data) {
	    cache.ec.emit(eNameIndex.left, data);
	    cache.ec.emit(eNameIndex.membersleft, data);
	  });

	  // 服务器端回复。表示 add 操作完成
	  // 因为 added 之后也会触发 members-joined，所以注释掉
	  // cache.ec.on('conv-added', function(data) {});

	  // 服务器端确认删除成功
	  // 因为 removed 之后也会触发 members-removed，所以注释掉
	  // cache.ec.on('conv-removed', function() {});

	  cache.ec.on('conv-error', function (data) {
	    cache.ec.emit(eNameIndex.error, data);
	    throw data.code + ':' + data.reason;
	  });

	  // 查询对话的结果
	  // cache.ec.on('conv-results', function(data) {});

	  // cache.ec.on('conv-updated', function(data) {});

	  cache.ec.on('direct', function (data) {

	    // 增加多媒体消息的数据格式化
	    data.msg = engine.getMediaMsg(cache, data.msg);

	    // 暂态消息无需回复
	    if (!data.transient) {
	      engine.convAck(cache, {
	        cid: data.cid,
	        mid: data.id
	      });
	    }

	    cache.ec.emit(eNameIndex.message, data);
	  });

	  // 对要求回执的消息，服务器端会在对方客户端发送ack后发送回执
	  cache.ec.on('rcp', function (data) {
	    cache.ec.emit(eNameIndex.receipt, data);
	  });

	  // cache.ec.on('ack', function(data) {});

	  // 用户可以获取自己所在对话的历史记录
	  // cache.ec.on('logs', function(data) {});
	};

	return realtime;

}));
//# sourceMappingURL=bundle.browser.js.map