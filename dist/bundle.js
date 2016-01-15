'use strict';

var require$$1 = require('https');
require$$1 = 'default' in require$$1 ? require$$1['default'] : require$$1;
var require$$2 = require('http');
require$$2 = 'default' in require$$2 ? require$$2['default'] : require$$2;
var require$$3 = require('fs');
require$$3 = 'default' in require$$3 ? require$$3['default'] : require$$3;
var require$$4 = require('child_process');
require$$4 = 'default' in require$$4 ? require$$4['default'] : require$$4;
var require$$1$1 = require('tls');
require$$1$1 = 'default' in require$$1$1 ? require$$1$1['default'] : require$$1$1;
var require$$2$1 = require('net');
require$$2$1 = 'default' in require$$2$1 ? require$$2$1['default'] : require$$2$1;

var babelHelpers_typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};


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

var inherits$1 = __commonjs(function (module) {
module.exports = require$$0$1.inherits;
});

var require$$0$4 = (inherits$1 && typeof inherits$1 === 'object' && 'default' in inherits$1 ? inherits$1['default'] : inherits$1);

var isBuffer$1 = __commonjs(function (module) {
module.exports = function isBuffer(arg) {
  return arg instanceof Buffer;
};
});

var require$$1$4 = (isBuffer$1 && typeof isBuffer$1 === 'object' && 'default' in isBuffer$1 ? isBuffer$1['default'] : isBuffer$1);

var util = __commonjs(function (module, exports, global) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function (fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;
exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }
  return debugs[set];
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};

  array.forEach(function (val, idx) {
    hash[val] = true;
  });

  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) &&
  // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect &&
  // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : babelHelpers_typeof(arg)) === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : babelHelpers_typeof(arg)) === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : babelHelpers_typeof(arg)) === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require$$1$4;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require$$0$4;

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
});

var require$$0$1 = (util && typeof util === 'object' && 'default' in util ? util['default'] : util);

var index = __commonjs(function (module) {
module.exports = ForeverAgent;
ForeverAgent.SSL = ForeverAgentSSL;

var util = require$$0$1,
    Agent = require$$2.Agent,
    net = require$$2$1,
    tls = require$$1$1,
    AgentSSL = require$$1.Agent;

function getConnectionName(host, port) {
  var name = '';
  if (typeof host === 'string') {
    name = host + ':' + port;
  } else {
    // For node.js v012.0 and iojs-v1.5.1, host is an object. And any existing localAddress is part of the connection name.
    name = host.host + ':' + host.port + ':' + (host.localAddress ? host.localAddress + ':' : ':');
  }
  return name;
}

function ForeverAgent(options) {
  var self = this;
  self.options = options || {};
  self.requests = {};
  self.sockets = {};
  self.freeSockets = {};
  self.maxSockets = self.options.maxSockets || Agent.defaultMaxSockets;
  self.minSockets = self.options.minSockets || ForeverAgent.defaultMinSockets;
  self.on('free', function (socket, host, port) {
    var name = getConnectionName(host, port);

    if (self.requests[name] && self.requests[name].length) {
      self.requests[name].shift().onSocket(socket);
    } else if (self.sockets[name].length < self.minSockets) {
      if (!self.freeSockets[name]) self.freeSockets[name] = [];
      self.freeSockets[name].push(socket);

      // if an error happens while we don't use the socket anyway, meh, throw the socket away
      var onIdleError = function onIdleError() {
        socket.destroy();
      };
      socket._onIdleError = onIdleError;
      socket.on('error', onIdleError);
    } else {
      // If there are no pending requests just destroy the
      // socket and it will get removed from the pool. This
      // gets us out of timeout issues and allows us to
      // default to Connection:keep-alive.
      socket.destroy();
    }
  });
}
util.inherits(ForeverAgent, Agent);

ForeverAgent.defaultMinSockets = 5;

ForeverAgent.prototype.createConnection = net.createConnection;
ForeverAgent.prototype.addRequestNoreuse = Agent.prototype.addRequest;
ForeverAgent.prototype.addRequest = function (req, host, port) {
  var name = getConnectionName(host, port);

  if (typeof host !== 'string') {
    var options = host;
    port = options.port;
    host = options.host;
  }

  if (this.freeSockets[name] && this.freeSockets[name].length > 0 && !req.useChunkedEncodingByDefault) {
    var idleSocket = this.freeSockets[name].pop();
    idleSocket.removeListener('error', idleSocket._onIdleError);
    delete idleSocket._onIdleError;
    req._reusedSocket = true;
    req.onSocket(idleSocket);
  } else {
    this.addRequestNoreuse(req, host, port);
  }
};

ForeverAgent.prototype.removeSocket = function (s, name, host, port) {
  if (this.sockets[name]) {
    var index = this.sockets[name].indexOf(s);
    if (index !== -1) {
      this.sockets[name].splice(index, 1);
    }
  } else if (this.sockets[name] && this.sockets[name].length === 0) {
    // don't leak
    delete this.sockets[name];
    delete this.requests[name];
  }

  if (this.freeSockets[name]) {
    var index = this.freeSockets[name].indexOf(s);
    if (index !== -1) {
      this.freeSockets[name].splice(index, 1);
      if (this.freeSockets[name].length === 0) {
        delete this.freeSockets[name];
      }
    }
  }

  if (this.requests[name] && this.requests[name].length) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(name, host, port).emit('free');
  }
};

function ForeverAgentSSL(options) {
  ForeverAgent.call(this, options);
}
util.inherits(ForeverAgentSSL, ForeverAgent);

ForeverAgentSSL.prototype.createConnection = createConnectionSSL;
ForeverAgentSSL.prototype.addRequestNoreuse = AgentSSL.prototype.addRequest;

function createConnectionSSL(port, host, options) {
  if ((typeof port === 'undefined' ? 'undefined' : babelHelpers_typeof(port)) === 'object') {
    options = port;
  } else if ((typeof host === 'undefined' ? 'undefined' : babelHelpers_typeof(host)) === 'object') {
    options = host;
  } else if ((typeof options === 'undefined' ? 'undefined' : babelHelpers_typeof(options)) === 'object') {
    options = options;
  } else {
    options = {};
  }

  if (typeof port === 'number') {
    options.port = port;
  }

  if (typeof host === 'string') {
    options.host = host;
  }

  return tls.connect(options);
}
});

var require$$0 = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

var encode$1 = __commonjs(function (module) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (typeof v === 'undefined' ? 'undefined' : babelHelpers_typeof(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : babelHelpers_typeof(obj)) === 'object') {
    return Object.keys(obj).map(function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};
});

var require$$0$3 = (encode$1 && typeof encode$1 === 'object' && 'default' in encode$1 ? encode$1['default'] : encode$1);

var decode$1 = __commonjs(function (module) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};
});

var require$$1$3 = (decode$1 && typeof decode$1 === 'object' && 'default' in decode$1 ? decode$1['default'] : decode$1);

var index$1 = __commonjs(function (module, exports) {
'use strict';

exports.decode = exports.parse = require$$1$3;
exports.encode = exports.stringify = require$$0$3;
});

var require$$0$2 = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

var punycode = __commonjs(function (module, exports, global) {
/*! https://mths.be/punycode v1.3.2 by @mathias */
;(function (root) {

	/** Detect free variables */
	var freeExports = (typeof exports === 'undefined' ? 'undefined' : babelHelpers_typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
	var freeModule = (typeof module === 'undefined' ? 'undefined' : babelHelpers_typeof(module)) == 'object' && module && !module.nodeType && module;
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : babelHelpers_typeof(global)) == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
		root = freeGlobal;
	}

	/**
  * The `punycode` object.
  * @name punycode
  * @type Object
  */
	var punycode,
	   

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647,
	    // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	    tMin = 1,
	    tMax = 26,
	    skew = 38,
	    damp = 700,
	    initialBias = 72,
	    initialN = 128,
	    // 0x80
	delimiter = '-',
	    // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	    regexNonASCII = /[^\x20-\x7E]/,
	    // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
	    // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},
	   

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	    floor = Math.floor,
	    stringFromCharCode = String.fromCharCode,
	   

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
  * A generic error utility function.
  * @private
  * @param {String} type The error type.
  * @returns {Error} Throws a `RangeError` with the applicable error message.
  */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
  * A generic `Array#map` utility function.
  * @private
  * @param {Array} array The array to iterate over.
  * @param {Function} callback The function that gets called for every array
  * item.
  * @returns {Array} A new array of values returned by the callback function.
  */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
  * A simple `Array#map`-like wrapper to work with domain name strings or email
  * addresses.
  * @private
  * @param {String} domain The domain name or email address.
  * @param {Function} callback The function that gets called for every
  * character.
  * @returns {Array} A new string of characters returned by the callback
  * function.
  */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
  * Creates an array containing the numeric code points of each Unicode
  * character in the string. While JavaScript uses UCS-2 internally,
  * this function will convert a pair of surrogate halves (each of which
  * UCS-2 exposes as separate characters) into a single code point,
  * matching UTF-16.
  * @see `punycode.ucs2.encode`
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode.ucs2
  * @name decode
  * @param {String} string The Unicode input string (UCS-2).
  * @returns {Array} The new array of code points.
  */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
  * Creates a string based on an array of numeric code points.
  * @see `punycode.ucs2.decode`
  * @memberOf punycode.ucs2
  * @name encode
  * @param {Array} codePoints The array of numeric code points.
  * @returns {String} The new Unicode string (UCS-2).
  */
	function ucs2encode(array) {
		return map(array, function (value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
  * Converts a basic code point into a digit/integer.
  * @see `digitToBasic()`
  * @private
  * @param {Number} codePoint The basic numeric code point value.
  * @returns {Number} The numeric value of a basic code point (for use in
  * representing integers) in the range `0` to `base - 1`, or `base` if
  * the code point does not represent a value.
  */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
  * Converts a digit/integer into a basic code point.
  * @see `basicToDigit()`
  * @private
  * @param {Number} digit The numeric value of a basic code point.
  * @returns {Number} The basic code point whose value (when used for
  * representing integers) is `digit`, which needs to be in the range
  * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  * used; else, the lowercase form is used. The behavior is undefined
  * if `flag` is non-zero and `digit` has no uppercase form.
  */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
  * Bias adaptation function as per section 3.4 of RFC 3492.
  * http://tools.ietf.org/html/rfc3492#section-3.4
  * @private
  */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
  * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  * symbols.
  * @memberOf punycode
  * @param {String} input The Punycode string of ASCII-only symbols.
  * @returns {String} The resulting string of Unicode symbols.
  */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		   
		/** Cached calculation results */
		baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;
			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);
		}

		return ucs2encode(output);
	}

	/**
  * Converts a string of Unicode symbols (e.g. a domain name label) to a
  * Punycode string of ASCII-only symbols.
  * @memberOf punycode
  * @param {String} input The string of Unicode symbols.
  * @returns {String} The resulting Punycode string of ASCII-only symbols.
  */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		   
		/** `inputLength` will hold the number of code points in `input`. */
		inputLength,
		   
		/** Cached calculation results */
		handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base;; /* no condition */k += base) {
						t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;
		}
		return output.join('');
	}

	/**
  * Converts a Punycode string representing a domain name or an email address
  * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
  * it doesn't matter if you call it on a string that has already been
  * converted to Unicode.
  * @memberOf punycode
  * @param {String} input The Punycoded domain name or email address to
  * convert to Unicode.
  * @returns {String} The Unicode representation of the given Punycode
  * string.
  */
	function toUnicode(input) {
		return mapDomain(input, function (string) {
			return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
		});
	}

	/**
  * Converts a Unicode string representing a domain name or an email address to
  * Punycode. Only the non-ASCII parts of the domain name will be converted,
  * i.e. it doesn't matter if you call it with a domain that's already in
  * ASCII.
  * @memberOf punycode
  * @param {String} input The domain name or email address to convert, as a
  * Unicode string.
  * @returns {String} The Punycode representation of the given domain name or
  * email address.
  */
	function toASCII(input) {
		return mapDomain(input, function (string) {
			return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
		'version': '1.3.2',
		/**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (typeof define == 'function' && babelHelpers_typeof(define.amd) == 'object' && define.amd) {
		define('punycode', function () {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}
})(this);
});

var require$$1$2 = (punycode && typeof punycode === 'object' && 'default' in punycode ? punycode['default'] : punycode);

var url = __commonjs(function (module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require$$1$2;

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

// RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

// RFC 2396: characters not allowed for various reasons.
unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

// Allowed by RFCs, but cause of XSS attacks.  Always escape these.
autoEscape = ['\''].concat(unwise),

// Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,

// protocols that can allow "unsafe" and "unwise" chars.
unsafeProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that never have a hostname.
hostlessProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that always contain a // bit.
slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
},
    querystring = require$$0$2;

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + (typeof url === 'undefined' ? 'undefined' : babelHelpers_typeof(url)));
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ? 'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query && isObject(this.query) && Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || query && '?' + query || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function (k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function (k) {
      if (k !== 'protocol') result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function (k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift())) {}
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
      // it's relative
      // throw away the existing file, and take the new path instead.
      if (!srcPath) srcPath = [];
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      result.search = relative.search;
      result.query = relative.query;
    } else if (!isNullOrUndefined(relative.search)) {
      // just pull out the search.
      // like href='?foo'.
      // Put this after the other two cases because it simplifies the booleans
      if (psychotic) {
        result.hostname = result.host = srcPath.shift();
        //occationaly the auth can get stuck only in host
        //this especialy happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      result.search = relative.search;
      result.query = relative.query;
      //to support http.request
      if (!isNull(result.pathname) || !isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
      }
      result.href = result.format();
      return result;
    }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host) && (last === '.' || last === '..') || last === '';

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : babelHelpers_typeof(arg)) === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return arg == null;
}
});

var require$$5 = (url && typeof url === 'object' && 'default' in url ? url['default'] : url);

var XMLHttpRequest = __commonjs(function (module, exports) {
/**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 */

var Url = require$$5;
var spawn = require$$4.spawn;
var fs = require$$3;
var http = require$$2;
var https = require$$1;
var ForeverAgent = require$$0;

var version = function () {
  var numbers = process.version.replace('v', '').split('.');
  return {
    major: parseInt(numbers[0], 10),
    minor: parseInt(numbers[1], 10),
    patch: parseInt(numbers[2], 10)
  };
}();

var httpForeverAgent, httpsForeverAgent;
// use ForeverAgent in node 0.10- only
if (version.major === 0 && version.minor <= 10) {
  httpForeverAgent = new ForeverAgent();
  httpsForeverAgent = new ForeverAgent.SSL();
} else {
  httpForeverAgent = new http.Agent({ keepAlive: true });
  httpsForeverAgent = new https.Agent({ keepAlive: true });
}

exports.XMLHttpRequest = function () {
  "use strict";

  /**
   * Private variables
   */

  var self = this;

  // Holds http.js objects
  var request;
  var response;

  // Request settings
  var settings = {};

  // Disable header blacklist.
  // Not part of XHR specs.
  var disableHeaderCheck = false;

  // Set some default headers
  var defaultHeaders = {
    "User-Agent": "node-XMLHttpRequest",
    "Accept": "*/*"
  };

  var headers = {};
  var headersCase = {};

  // These headers are not user setable.
  // The following are allowed but banned in the spec:
  // * user-agent
  var forbiddenRequestHeaders = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "content-transfer-encoding", "cookie", "cookie2", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "via"];

  // These request methods are not allowed
  var forbiddenRequestMethods = ["TRACE", "TRACK", "CONNECT"];

  // Send flag
  var sendFlag = false;
  // Error flag, used when errors occur or abort is called
  var errorFlag = false;

  // Event listeners
  var listeners = {};

  /**
   * Constants
   */

  this.UNSENT = 0;
  this.OPENED = 1;
  this.HEADERS_RECEIVED = 2;
  this.LOADING = 3;
  this.DONE = 4;

  /**
   * Public vars
   */

  // Current state
  this.readyState = this.UNSENT;

  // default ready state change handler in case one is not set or is set late
  this.onreadystatechange = null;

  // Result & response
  this.responseText = "";
  this.responseXML = "";
  this.status = null;
  this.statusText = null;

  // Whether cross-site Access-Control requests should be made using
  // credentials such as cookies or authorization headers
  this.withCredentials = false;

  /**
   * Private methods
   */

  /**
   * Check if the specified header is allowed.
   *
   * @param string header Header to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpHeader = function isAllowedHttpHeader(header) {
    return disableHeaderCheck || header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1;
  };

  /**
   * Check if the specified method is allowed.
   *
   * @param string method Request method to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpMethod = function isAllowedHttpMethod(method) {
    return method && forbiddenRequestMethods.indexOf(method) === -1;
  };

  /**
   * Public methods
   */

  /**
   * Open the connection. Currently supports local server requests.
   *
   * @param string method Connection method (eg GET, POST)
   * @param string url URL for the connection.
   * @param boolean async Asynchronous connection. Default is true.
   * @param string user Username for basic authentication (optional)
   * @param string password Password for basic authentication (optional)
   */
  this.open = function (method, url, async, user, password) {
    this.abort();
    errorFlag = false;

    // Check for valid request method
    if (!isAllowedHttpMethod(method)) {
      throw new Error("SecurityError: Request method not allowed");
    }

    settings = {
      "method": method,
      "url": url.toString(),
      "async": typeof async !== "boolean" ? true : async,
      "user": user || null,
      "password": password || null
    };

    setState(this.OPENED);
  };

  /**
   * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
   * This does not conform to the W3C spec.
   *
   * @param boolean state Enable or disable header checking.
   */
  this.setDisableHeaderCheck = function (state) {
    disableHeaderCheck = state;
  };

  /**
   * Sets a header for the request or appends the value if one is already set.
   *
   * @param string header Header name
   * @param string value Header value
   */
  this.setRequestHeader = function (header, value) {
    if (this.readyState !== this.OPENED) {
      throw new Error("INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN");
    }
    if (!isAllowedHttpHeader(header)) {
      console.warn("Refused to set unsafe header \"" + header + "\"");
      return;
    }
    if (sendFlag) {
      throw new Error("INVALID_STATE_ERR: send flag is true");
    }
    header = headersCase[header.toLowerCase()] || header;
    headersCase[header.toLowerCase()] = header;
    headers[header] = headers[header] ? headers[header] + ', ' + value : value;
  };

  /**
   * Gets a header from the server response.
   *
   * @param string header Name of header to get.
   * @return string Text of the header or null if it doesn't exist.
   */
  this.getResponseHeader = function (header) {
    if (typeof header === "string" && this.readyState > this.OPENED && response && response.headers && response.headers[header.toLowerCase()] && !errorFlag) {
      return response.headers[header.toLowerCase()];
    }

    return null;
  };

  /**
   * Gets all the response headers.
   *
   * @return string A string with all response headers separated by CR+LF
   */
  this.getAllResponseHeaders = function () {
    if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
      return "";
    }
    var result = "";

    for (var i in response.headers) {
      // Cookie headers are excluded
      if (i !== "set-cookie" && i !== "set-cookie2") {
        result += i + ": " + response.headers[i] + "\r\n";
      }
    }
    return result.substr(0, result.length - 2);
  };

  /**
   * Gets a request header
   *
   * @param string name Name of header to get
   * @return string Returns the request header or empty string if not set
   */
  this.getRequestHeader = function (name) {
    if (typeof name === "string" && headersCase[name.toLowerCase()]) {
      return headers[headersCase[name.toLowerCase()]];
    }

    return "";
  };

  /**
   * Sends the request to the server.
   *
   * @param string data Optional data to send as request body.
   */
  this.send = function (data) {
    if (this.readyState !== this.OPENED) {
      throw new Error("INVALID_STATE_ERR: connection must be opened before send() is called");
    }

    if (sendFlag) {
      throw new Error("INVALID_STATE_ERR: send has already been called");
    }

    var ssl = false,
        local = false,
        agent = false;
    var url = Url.parse(settings.url);
    var host;
    // Determine the server
    switch (url.protocol) {
      case "https:":
        ssl = true;
        host = url.hostname;
        agent = httpsForeverAgent;
        break;
      case "http:":
        host = url.hostname;
        agent = httpForeverAgent;
        break;

      case "file:":
        local = true;
        break;

      case undefined:
      case null:
      case "":
        host = "localhost";
        break;

      default:
        throw new Error("Protocol not supported.");
    }

    // Load files off the local filesystem (file://)
    if (local) {
      if (settings.method !== "GET") {
        throw new Error("XMLHttpRequest: Only GET method is supported");
      }

      if (settings.async) {
        fs.readFile(url.pathname, "utf8", function (error, data) {
          if (error) {
            self.handleError(error);
          } else {
            self.status = 200;
            self.responseText = data;
            setState(self.DONE);
          }
        });
      } else {
        try {
          this.responseText = fs.readFileSync(url.pathname, "utf8");
          this.status = 200;
          setState(self.DONE);
        } catch (e) {
          this.handleError(e);
        }
      }

      return;
    }

    // Default to port 80. If accessing localhost on another port be sure
    // to use http://localhost:port/path
    var port = url.port || (ssl ? 443 : 80);
    // Add query string if one is used
    var uri = url.pathname + (url.search ? url.search : "");

    // Set the defaults if they haven't been set
    for (var name in defaultHeaders) {
      if (!headersCase[name.toLowerCase()]) {
        headers[name] = defaultHeaders[name];
      }
    }

    // Set the Host header or the server may reject the request
    headers.Host = host;
    if (!(ssl && port === 443 || port === 80)) {
      headers.Host += ":" + url.port;
    }

    // Set Basic Auth if necessary
    if (settings.user) {
      if (typeof settings.password === "undefined") {
        settings.password = "";
      }
      var authBuf = new Buffer(settings.user + ":" + settings.password);
      headers.Authorization = "Basic " + authBuf.toString("base64");
    }

    // Set content length header
    if (settings.method === "GET" || settings.method === "HEAD") {
      data = null;
    } else if (data) {
      headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);

      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
    } else if (settings.method === "POST") {
      // For a post with no data set Content-Length: 0.
      // This is required by buggy servers that don't meet the specs.
      headers["Content-Length"] = 0;
    }

    var options = {
      host: host,
      port: port,
      path: uri,
      method: settings.method,
      headers: headers,
      agent: agent,
      withCredentials: self.withCredentials
    };

    // Reset error flag
    errorFlag = false;

    // Handle async requests
    if (settings.async) {
      // Use the proper protocol
      var doRequest = ssl ? https.request : http.request;

      // Request is being sent, set send flag
      sendFlag = true;

      // As per spec, this is called here for historical reasons.
      self.dispatchEvent("readystatechange");

      // Handler for the response
      var responseHandler = function responseHandler(resp) {
        // Set response var to the response we got back
        // This is so it remains accessable outside this scope
        response = resp;
        // Check for redirect
        // @TODO Prevent looped redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
          // Change URL to the redirect location
          settings.url = response.headers.location;
          var url = Url.parse(settings.url);
          // Set host var in case it's used later
          host = url.hostname;
          // Options for the new request
          var newOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: response.statusCode === 303 ? "GET" : settings.method,
            headers: headers,
            withCredentials: self.withCredentials
          };

          // Issue the new request
          request = doRequest(newOptions, responseHandler).on("error", errorHandler);
          request.end();
          // @TODO Check if an XHR event needs to be fired here
          return;
        }

        response.setEncoding("utf8");

        setState(self.HEADERS_RECEIVED);
        self.status = response.statusCode;

        response.on("data", function (chunk) {
          // Make sure there's some data
          if (chunk) {
            self.responseText += chunk;
          }
          // Don't emit state changes if the connection has been aborted.
          if (sendFlag) {
            setState(self.LOADING);
          }
        });

        response.on("end", function () {
          if (sendFlag) {
            // Discard the end event if the connection has been aborted
            setState(self.DONE);
            sendFlag = false;
          }
        });

        response.on("error", function (error) {
          self.handleError(error);
        });
      };

      // Error handler for the request
      var errorHandler = function errorHandler(error) {
        self.handleError(error);
      };

      // Create the request
      request = doRequest(options, responseHandler).on("error", errorHandler);

      // Node 0.4 and later won't accept empty data. Make sure it's needed.
      if (data) {
        request.write(data);
      }

      request.end();

      self.dispatchEvent("loadstart");
    } else {
      // Synchronous
      // Create a temporary file for communication with the other Node process
      var contentFile = ".node-xmlhttprequest-content-" + process.pid;
      var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
      fs.writeFileSync(syncFile, "", "utf8");
      // The async request the other Node process executes
      var execString = "var http = require('http'), https = require('https'), fs = require('fs');" + "var doRequest = http" + (ssl ? "s" : "") + ".request;" + "var options = " + JSON.stringify(options) + ";" + "var responseText = '';" + "var req = doRequest(options, function(response) {" + "response.setEncoding('utf8');" + "response.on('data', function(chunk) {" + "  responseText += chunk;" + "});" + "response.on('end', function() {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText}}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + "response.on('error', function(error) {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + "}).on('error', function(error) {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + (data ? "req.write('" + JSON.stringify(data).slice(1, -1).replace(/'/g, "\\'") + "');" : "") + "req.end();";
      // Start the other Node Process, executing this string
      var syncProc = spawn(process.argv[0], ["-e", execString]);
      while (fs.existsSync(syncFile)) {
        // Wait while the sync file is empty
      }
      var resp = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
      // Kill the child process once the file has data
      syncProc.stdin.end();
      // Remove the temporary file
      fs.unlinkSync(contentFile);

      if (resp.err) {
        self.handleError(resp.err);
      } else {
        response = resp.data;
        self.status = resp.data.statusCode;
        self.responseText = resp.data.text;
        setState(self.DONE);
      }
    }
  };

  /**
   * Called when an error is encountered to deal with it.
   */
  this.handleError = function (error) {
    this.status = 0;
    this.statusText = error;
    this.responseText = error.stack;
    errorFlag = true;
    setState(this.DONE);
    this.dispatchEvent('error');
  };

  /**
   * Aborts a request.
   */
  this.abort = function () {
    if (request) {
      request.abort();
      request = null;
    }

    headers = defaultHeaders;
    this.status = 0;
    this.responseText = "";
    this.responseXML = "";

    errorFlag = true;

    if (this.readyState !== this.UNSENT && (this.readyState !== this.OPENED || sendFlag) && this.readyState !== this.DONE) {
      sendFlag = false;
      setState(this.DONE);
    }
    this.readyState = this.UNSENT;
    this.dispatchEvent('abort');
  };

  /**
   * Adds an event listener. Preferred method of binding to events.
   */
  this.addEventListener = function (event, callback) {
    if (!(event in listeners)) {
      listeners[event] = [];
    }
    // Currently allows duplicate callbacks. Should it?
    listeners[event].push(callback);
  };

  /**
   * Remove an event callback that has already been bound.
   * Only works on the matching funciton, cannot be a copy.
   */
  this.removeEventListener = function (event, callback) {
    if (event in listeners) {
      // Filter will return a new array with the callback removed
      listeners[event] = listeners[event].filter(function (ev) {
        return ev !== callback;
      });
    }
  };

  /**
   * Dispatch any events, including both "on" methods and events attached using addEventListener.
   */
  this.dispatchEvent = function (event) {
    if (typeof self["on" + event] === "function") {
      self["on" + event]();
    }
    if (event in listeners) {
      for (var i = 0, len = listeners[event].length; i < len; i++) {
        listeners[event][i].call(self);
      }
    }
  };

  /**
   * Changes readyState and calls onreadystatechange.
   *
   * @param int state New state
   */
  var setState = function setState(state) {
    if (state == self.LOADING || self.readyState !== state) {
      self.readyState = state;

      if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
        self.dispatchEvent("readystatechange");
      }

      if (self.readyState === self.DONE && !errorFlag) {
        self.dispatchEvent("load");
        // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
        self.dispatchEvent("loadend");
      }
    }
  };
};
});

var XMLHttpRequest = XMLHttpRequest.XMLHttpRequest;

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

module.exports = realtime;
//# sourceMappingURL=bundle.js.map