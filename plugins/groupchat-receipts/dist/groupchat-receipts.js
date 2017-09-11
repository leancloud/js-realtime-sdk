(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leancloud-realtime')) :
    typeof define === 'function' && define.amd ? define('groupchat-receipts', ['exports', 'leancloud-realtime'], factory) :
    (factory((global.AV = global.AV || {}),global.AV));
}(this, (function (exports,leancloudRealtime) { 'use strict';

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



    function unwrapExports (x) {
    	return x && x.__esModule ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var _global = createCommonjsModule(function (module) {
    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global = module.exports = typeof window != 'undefined' && window.Math == Math
      ? window : typeof self != 'undefined' && self.Math == Math ? self
      // eslint-disable-next-line no-new-func
      : Function('return this')();
    if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
    });

    var _core = createCommonjsModule(function (module) {
    var core = module.exports = { version: '2.5.1' };
    if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
    });

    var _aFunction = function (it) {
      if (typeof it != 'function') throw TypeError(it + ' is not a function!');
      return it;
    };

    // optional / simple context binding

    var _ctx = function (fn, that, length) {
      _aFunction(fn);
      if (that === undefined) return fn;
      switch (length) {
        case 1: return function (a) {
          return fn.call(that, a);
        };
        case 2: return function (a, b) {
          return fn.call(that, a, b);
        };
        case 3: return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
      }
      return function (/* ...args */) {
        return fn.apply(that, arguments);
      };
    };

    var _isObject = function (it) {
      return typeof it === 'object' ? it !== null : typeof it === 'function';
    };

    var _anObject = function (it) {
      if (!_isObject(it)) throw TypeError(it + ' is not an object!');
      return it;
    };

    var _fails = function (exec) {
      try {
        return !!exec();
      } catch (e) {
        return true;
      }
    };

    // Thank's IE8 for his funny defineProperty
    var _descriptors = !_fails(function () {
      return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
    });

    var document = _global.document;
    // typeof document.createElement is 'object' in old IE
    var is = _isObject(document) && _isObject(document.createElement);
    var _domCreate = function (it) {
      return is ? document.createElement(it) : {};
    };

    var _ie8DomDefine = !_descriptors && !_fails(function () {
      return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
    });

    // 7.1.1 ToPrimitive(input [, PreferredType])

    // instead of the ES6 spec version, we didn't implement @@toPrimitive case
    // and the second argument - flag - preferred type is a string
    var _toPrimitive = function (it, S) {
      if (!_isObject(it)) return it;
      var fn, val;
      if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
      if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
      if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
      throw TypeError("Can't convert object to primitive value");
    };

    var dP = Object.defineProperty;

    var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
      _anObject(O);
      P = _toPrimitive(P, true);
      _anObject(Attributes);
      if (_ie8DomDefine) try {
        return dP(O, P, Attributes);
      } catch (e) { /* empty */ }
      if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };

    var _objectDp = {
    	f: f
    };

    var _propertyDesc = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      };
    };

    var _hide = _descriptors ? function (object, key, value) {
      return _objectDp.f(object, key, _propertyDesc(1, value));
    } : function (object, key, value) {
      object[key] = value;
      return object;
    };

    var PROTOTYPE = 'prototype';

    var $export = function (type, name, source) {
      var IS_FORCED = type & $export.F;
      var IS_GLOBAL = type & $export.G;
      var IS_STATIC = type & $export.S;
      var IS_PROTO = type & $export.P;
      var IS_BIND = type & $export.B;
      var IS_WRAP = type & $export.W;
      var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
      var expProto = exports[PROTOTYPE];
      var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
      var key, own, out;
      if (IS_GLOBAL) source = name;
      for (key in source) {
        // contains in native
        own = !IS_FORCED && target && target[key] !== undefined;
        if (own && key in exports) continue;
        // export native or passed
        out = own ? target[key] : source[key];
        // prevent global pollution for namespaces
        exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
        // bind timers to global for call from export context
        : IS_BIND && own ? _ctx(out, _global)
        // wrap global constructors for prevent change them in library
        : IS_WRAP && target[key] == out ? (function (C) {
          var F = function (a, b, c) {
            if (this instanceof C) {
              switch (arguments.length) {
                case 0: return new C();
                case 1: return new C(a);
                case 2: return new C(a, b);
              } return new C(a, b, c);
            } return C.apply(this, arguments);
          };
          F[PROTOTYPE] = C[PROTOTYPE];
          return F;
        // make static versions for prototype methods
        })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
        // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
        if (IS_PROTO) {
          (exports.virtual || (exports.virtual = {}))[key] = out;
          // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
          if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
        }
      }
    };
    // type bitmap
    $export.F = 1;   // forced
    $export.G = 2;   // global
    $export.S = 4;   // static
    $export.P = 8;   // proto
    $export.B = 16;  // bind
    $export.W = 32;  // wrap
    $export.U = 64;  // safe
    $export.R = 128; // real proto method for `library`
    var _export = $export;

    // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
    _export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

    var $Object = _core.Object;
    var defineProperty$3 = function defineProperty(it, key, desc) {
      return $Object.defineProperty(it, key, desc);
    };

    var defineProperty$1 = createCommonjsModule(function (module) {
    module.exports = { "default": defineProperty$3, __esModule: true };
    });

    var defineProperty = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;



    var _defineProperty2 = _interopRequireDefault(defineProperty$1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function (obj, key, value) {
      if (key in obj) {
        (0, _defineProperty2.default)(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };
    });

    var _defineProperty = unwrapExports(defineProperty);

    var hasOwnProperty = {}.hasOwnProperty;
    var _has = function (it, key) {
      return hasOwnProperty.call(it, key);
    };

    var toString = {}.toString;

    var _cof = function (it) {
      return toString.call(it).slice(8, -1);
    };

    // fallback for non-array-like ES3 and non-enumerable old V8 strings

    // eslint-disable-next-line no-prototype-builtins
    var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
      return _cof(it) == 'String' ? it.split('') : Object(it);
    };

    // 7.2.1 RequireObjectCoercible(argument)
    var _defined = function (it) {
      if (it == undefined) throw TypeError("Can't call method on  " + it);
      return it;
    };

    // to indexed object, toObject with fallback for non-array-like ES3 strings


    var _toIobject = function (it) {
      return _iobject(_defined(it));
    };

    // 7.1.4 ToInteger
    var ceil = Math.ceil;
    var floor = Math.floor;
    var _toInteger = function (it) {
      return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };

    // 7.1.15 ToLength

    var min = Math.min;
    var _toLength = function (it) {
      return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
    };

    var max = Math.max;
    var min$1 = Math.min;
    var _toAbsoluteIndex = function (index, length) {
      index = _toInteger(index);
      return index < 0 ? max(index + length, 0) : min$1(index, length);
    };

    // false -> Array#indexOf
    // true  -> Array#includes



    var _arrayIncludes = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = _toIobject($this);
        var length = _toLength(O.length);
        var index = _toAbsoluteIndex(fromIndex, length);
        var value;
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare
        if (IS_INCLUDES && el != el) while (length > index) {
          value = O[index++];
          // eslint-disable-next-line no-self-compare
          if (value != value) return true;
        // Array#indexOf ignores holes, Array#includes - not
        } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
          if (O[index] === el) return IS_INCLUDES || index || 0;
        } return !IS_INCLUDES && -1;
      };
    };

    var SHARED = '__core-js_shared__';
    var store = _global[SHARED] || (_global[SHARED] = {});
    var _shared = function (key) {
      return store[key] || (store[key] = {});
    };

    var id = 0;
    var px = Math.random();
    var _uid = function (key) {
      return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
    };

    var shared = _shared('keys');

    var _sharedKey = function (key) {
      return shared[key] || (shared[key] = _uid(key));
    };

    var arrayIndexOf = _arrayIncludes(false);
    var IE_PROTO = _sharedKey('IE_PROTO');

    var _objectKeysInternal = function (object, names) {
      var O = _toIobject(object);
      var i = 0;
      var result = [];
      var key;
      for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
      // Don't enum bug & hidden keys
      while (names.length > i) if (_has(O, key = names[i++])) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
      return result;
    };

    // IE 8- don't enum bug keys
    var _enumBugKeys = (
      'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
    ).split(',');

    // 19.1.2.14 / 15.2.3.14 Object.keys(O)



    var _objectKeys = Object.keys || function keys(O) {
      return _objectKeysInternal(O, _enumBugKeys);
    };

    var f$1 = Object.getOwnPropertySymbols;

    var _objectGops = {
    	f: f$1
    };

    var f$2 = {}.propertyIsEnumerable;

    var _objectPie = {
    	f: f$2
    };

    // 7.1.13 ToObject(argument)

    var _toObject = function (it) {
      return Object(_defined(it));
    };

    // 19.1.2.1 Object.assign(target, source, ...)





    var $assign = Object.assign;

    // should work with symbols and should have deterministic property order (V8 bug)
    var _objectAssign = !$assign || _fails(function () {
      var A = {};
      var B = {};
      // eslint-disable-next-line no-undef
      var S = Symbol();
      var K = 'abcdefghijklmnopqrst';
      A[S] = 7;
      K.split('').forEach(function (k) { B[k] = k; });
      return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
    }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
      var T = _toObject(target);
      var aLen = arguments.length;
      var index = 1;
      var getSymbols = _objectGops.f;
      var isEnum = _objectPie.f;
      while (aLen > index) {
        var S = _iobject(arguments[index++]);
        var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
        var length = keys.length;
        var j = 0;
        var key;
        while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
      } return T;
    } : $assign;

    // 19.1.3.1 Object.assign(target, source)


    _export(_export.S + _export.F, 'Object', { assign: _objectAssign });

    var assign$1 = _core.Object.assign;

    var assign = createCommonjsModule(function (module) {
    module.exports = { "default": assign$1, __esModule: true };
    });

    var _Object$assign = unwrapExports(assign);

    var inherit$2 = createCommonjsModule(function (module, exports) {
    /**
     * @module inherit
     * @version 2.2.6
     * @author Filatov Dmitry <dfilatov@yandex-team.ru>
     * @description This module provides some syntax sugar for "class" declarations, constructors, mixins, "super" calls and static members.
     */

    (function(global) {

    var hasIntrospection = (function(){return '_';}).toString().indexOf('_') > -1,
        emptyBase = function() {},
        hasOwnProperty = Object.prototype.hasOwnProperty,
        objCreate = Object.create || function(ptp) {
            var inheritance = function() {};
            inheritance.prototype = ptp;
            return new inheritance();
        },
        objKeys = Object.keys || function(obj) {
            var res = [];
            for(var i in obj) {
                hasOwnProperty.call(obj, i) && res.push(i);
            }
            return res;
        },
        extend = function(o1, o2) {
            for(var i in o2) {
                hasOwnProperty.call(o2, i) && (o1[i] = o2[i]);
            }

            return o1;
        },
        toStr = Object.prototype.toString,
        isArray = Array.isArray || function(obj) {
            return toStr.call(obj) === '[object Array]';
        },
        isFunction = function(obj) {
            return toStr.call(obj) === '[object Function]';
        },
        noOp = function() {},
        needCheckProps = true,
        testPropObj = { toString : '' };

    for(var i in testPropObj) { // fucking ie hasn't toString, valueOf in for
        testPropObj.hasOwnProperty(i) && (needCheckProps = false);
    }

    var specProps = needCheckProps? ['toString', 'valueOf'] : null;

    function getPropList(obj) {
        var res = objKeys(obj);
        if(needCheckProps) {
            var specProp, i = 0;
            while(specProp = specProps[i++]) {
                obj.hasOwnProperty(specProp) && res.push(specProp);
            }
        }

        return res;
    }

    function override(base, res, add) {
        var addList = getPropList(add),
            j = 0, len = addList.length,
            name, prop;
        while(j < len) {
            if((name = addList[j++]) === '__self') {
                continue;
            }
            prop = add[name];
            if(isFunction(prop) &&
                    (!prop.prototype || !prop.prototype.__self) && // check to prevent wrapping of "class" functions
                    (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {
                res[name] = (function(name, prop) {
                    var baseMethod = base[name]?
                            base[name] :
                            name === '__constructor'? // case of inheritance from plain function
                                res.__self.__parent :
                                noOp,
                        result = function() {
                            var baseSaved = this.__base;

                            this.__base = result.__base;
                            var res = prop.apply(this, arguments);
                            this.__base = baseSaved;

                            return res;
                        };
                    result.__base = baseMethod;

                    return result;
                })(name, prop);
            } else {
                res[name] = prop;
            }
        }
    }

    function applyMixins(mixins, res) {
        var i = 1, mixin;
        while(mixin = mixins[i++]) {
            res?
                isFunction(mixin)?
                    inherit.self(res, mixin.prototype, mixin) :
                    inherit.self(res, mixin) :
                res = isFunction(mixin)?
                    inherit(mixins[0], mixin.prototype, mixin) :
                    inherit(mixins[0], mixin);
        }
        return res || mixins[0];
    }

    /**
    * Creates class
    * @exports
    * @param {Function|Array} [baseClass|baseClassAndMixins] class (or class and mixins) to inherit from
    * @param {Object} prototypeFields
    * @param {Object} [staticFields]
    * @returns {Function} class
    */
    function inherit() {
        var args = arguments,
            withMixins = isArray(args[0]),
            hasBase = withMixins || isFunction(args[0]),
            base = hasBase? withMixins? applyMixins(args[0]) : args[0] : emptyBase,
            props = args[hasBase? 1 : 0] || {},
            staticProps = args[hasBase? 2 : 1],
            res = props.__constructor || (hasBase && base.prototype && base.prototype.__constructor)?
                function() {
                    return this.__constructor.apply(this, arguments);
                } :
                hasBase?
                    function() {
                        return base.apply(this, arguments);
                    } :
                    function() {};

        if(!hasBase) {
            res.prototype = props;
            res.prototype.__self = res.prototype.constructor = res;
            return extend(res, staticProps);
        }

        extend(res, base);

        res.__parent = base;

        var basePtp = base.prototype,
            resPtp = res.prototype = objCreate(basePtp);

        resPtp.__self = resPtp.constructor = res;

        props && override(basePtp, resPtp, props);
        staticProps && override(base, res, staticProps);

        return res;
    }

    inherit.self = function() {
        var args = arguments,
            withMixins = isArray(args[0]),
            base = withMixins? applyMixins(args[0], args[0][0]) : args[0],
            props = args[1],
            staticProps = args[2],
            basePtp = base.prototype;

        props && override(basePtp, basePtp, props);
        staticProps && override(base, base, staticProps);

        return base;
    };

    var defineAsGlobal = true;
    {
        module.exports = inherit;
        defineAsGlobal = false;
    }

    if(typeof modules === 'object' && typeof modules.define === 'function') {
        modules.define('inherit', function(provide) {
            provide(inherit);
        });
        defineAsGlobal = false;
    }

    if(typeof undefined === 'function') {
        undefined(function(require, exports, module) {
            module.exports = inherit;
        });
        defineAsGlobal = false;
    }

    defineAsGlobal && (global.inherit = inherit);

    })(commonjsGlobal);
    });

    /*!
     * node-inherit
     * Copyright(c) 2011 Dmitry Filatov <dfilatov@yandex-team.ru>
     * MIT Licensed
     */

    var inherit = inherit$2;

    /* eslint-disable import/no-unresolved */
    if (!leancloudRealtime.TypedMessage) {
      throw new Error('LeanCloud Realtime SDK not installed');
    }

    var ReadReceipt = inherit(leancloudRealtime.TypedMessage, {
      __constructor: function __constructor(timestamp) {
        this.__base();
        this.timestamp = new Date(timestamp);
      }
    });
    leancloudRealtime.messageType(-101)(ReadReceipt);
    leancloudRealtime.messageField(['timestamp'])(ReadReceipt);
    ReadReceipt.sendOptions = {
      transient: true
    };

    var name = "leancloud-realtime-plugin-groupchat-receipts";

    /** @module leancloud-realtime-plugin-groupchat-receipts */

    /**
     * @typedef {Object.<String, Date>} GroupchatLastReadTimestamps 对话成员 ID - 最后已读消息时间
     */

    /**
     * 群聊已读状态插件。
     * 使用后多人 Conversation 会增加 lastReadTimestamps 属性，该属性是 对话成员 ID - 最后已读消息时间 的键值对。
     * 在首次查询该会话的消息记录后，lastReadTimestamps 将会得到初始值，
     * 之后在该属性有变化时 Conversation 会派发 lastreadtimestampsupdate 事件。
     * @example
     * var realtime = new Realtime({
     *   appId: appId,
     *   plugins: [GroupchatReceiptsPlugin],
     * });
     */
    var GroupchatReceiptsPlugin = {
      name: name,
      messageClasses: [ReadReceipt],
      onIMClientCreate: function onIMClientCreate(client) {
        var originalSendReadCommand = client._sendReadCommand;
        // eslint-disable-next-line no-param-reassign
        client._sendReadCommand = function (conversations) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          conversations.forEach(function (conversation) {
            if (!conversation.transient && conversation.members.length > 2) {
              conversation.send(new ReadReceipt(conversation.lastMessageAt || new Date())).catch(function (error) {
                return console.warn('Sending groupchat receipt fail: ' + error.message);
              });
            }
          });
          return originalSendReadCommand.call.apply(originalSendReadCommand, [client, conversations].concat(args));
        };
      },
      onConversationCreate: function onConversationCreate(conversation) {
        var originalQueryMessages = conversation.queryMessages;
        // eslint-disable-next-line no-param-reassign
        conversation.queryMessages = function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          if (!conversation.transient && conversation.members.length > 2 && !conversation.lastReadTimestamps) {
            conversation._fetchAllReceiptTimestamps().then(function (maxReadTuple) {
              // eslint-disable-next-line no-param-reassign
              conversation.lastReadTimestamps = maxReadTuple.reduce(function (result, _ref) {
                var pid = _ref.pid,
                    lastReadAt = _ref.lastReadAt;
                return _Object$assign(result, _defineProperty({}, pid, lastReadAt));
              }, {});
              conversation.emit('lastreadtimestampsupdate', conversation.lastReadTimestamps);
            }).catch(function (error) {
              return console.warn('Initialize group receipts fail: ' + error.message);
            });
          }
          return originalQueryMessages.call.apply(originalQueryMessages, [conversation].concat(args));
        };
      },
      beforeMessageDispatch: function beforeMessageDispatch(message, conversation) {
        if (message.type === ReadReceipt.TYPE) {
          if (conversation.lastReadTimestamps) {
            // eslint-disable-next-line no-param-reassign
            conversation.lastReadTimestamps[message.from] = message.timestamp;
            /**
             * 群聊的已读状态更新，由 Conversation 派发
             * @event lastreadtimestampsupdate
             * @param {GroupchatLastReadTimestamps} updatedTimestamps 有更新的成员的最后已读消息时间
             */
            conversation.emit('lastreadtimestampsupdate', _defineProperty({}, message.from, message.timestamp));
          }
          return false;
        }
        return true;
      }
    };

    exports.GroupchatReceiptsPlugin = GroupchatReceiptsPlugin;
    exports.ReadReceipt = ReadReceipt;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=groupchat-receipts.js.map