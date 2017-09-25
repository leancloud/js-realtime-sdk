(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leancloud-realtime')) :
    typeof define === 'function' && define.amd ? define('webrtc', ['exports', 'leancloud-realtime'], factory) :
    (factory((global.AV = global.AV || {}),global.AV));
}(this, (function (exports,leancloudRealtime) { 'use strict';

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



    function unwrapExports (x) {
    	return x && x.__esModule ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var _addToUnscopables = function () { /* empty */ };

    var _iterStep = function (done, value) {
      return { value: value, done: !!done };
    };

    var _iterators = {};

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

    var _library = true;

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

    var document$1 = _global.document;
    // typeof document.createElement is 'object' in old IE
    var is = _isObject(document$1) && _isObject(document$1.createElement);
    var _domCreate = function (it) {
      return is ? document$1.createElement(it) : {};
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

    var _redefine = _hide;

    var hasOwnProperty = {}.hasOwnProperty;
    var _has = function (it, key) {
      return hasOwnProperty.call(it, key);
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
    var IE_PROTO$1 = _sharedKey('IE_PROTO');

    var _objectKeysInternal = function (object, names) {
      var O = _toIobject(object);
      var i = 0;
      var result = [];
      var key;
      for (key in O) if (key != IE_PROTO$1) _has(O, key) && result.push(key);
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

    var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
      _anObject(O);
      var keys = _objectKeys(Properties);
      var length = keys.length;
      var i = 0;
      var P;
      while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
      return O;
    };

    var document$2 = _global.document;
    var _html = document$2 && document$2.documentElement;

    // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



    var IE_PROTO = _sharedKey('IE_PROTO');
    var Empty = function () { /* empty */ };
    var PROTOTYPE$1 = 'prototype';

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    var createDict = function () {
      // Thrash, waste and sodomy: IE GC bug
      var iframe = _domCreate('iframe');
      var i = _enumBugKeys.length;
      var lt = '<';
      var gt = '>';
      var iframeDocument;
      iframe.style.display = 'none';
      _html.appendChild(iframe);
      iframe.src = 'javascript:'; // eslint-disable-line no-script-url
      // createDict = iframe.contentWindow.Object;
      // html.removeChild(iframe);
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
      iframeDocument.close();
      createDict = iframeDocument.F;
      while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
      return createDict();
    };

    var _objectCreate = Object.create || function create(O, Properties) {
      var result;
      if (O !== null) {
        Empty[PROTOTYPE$1] = _anObject(O);
        result = new Empty();
        Empty[PROTOTYPE$1] = null;
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO] = O;
      } else result = createDict();
      return Properties === undefined ? result : _objectDps(result, Properties);
    };

    var _wks = createCommonjsModule(function (module) {
    var store = _shared('wks');

    var Symbol = _global.Symbol;
    var USE_SYMBOL = typeof Symbol == 'function';

    var $exports = module.exports = function (name) {
      return store[name] || (store[name] =
        USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
    };

    $exports.store = store;
    });

    var def = _objectDp.f;

    var TAG = _wks('toStringTag');

    var _setToStringTag = function (it, tag, stat) {
      if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
    };

    var IteratorPrototype = {};

    // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
    _hide(IteratorPrototype, _wks('iterator'), function () { return this; });

    var _iterCreate = function (Constructor, NAME, next) {
      Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
      _setToStringTag(Constructor, NAME + ' Iterator');
    };

    // 7.1.13 ToObject(argument)

    var _toObject = function (it) {
      return Object(_defined(it));
    };

    // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


    var IE_PROTO$2 = _sharedKey('IE_PROTO');
    var ObjectProto = Object.prototype;

    var _objectGpo = Object.getPrototypeOf || function (O) {
      O = _toObject(O);
      if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
      if (typeof O.constructor == 'function' && O instanceof O.constructor) {
        return O.constructor.prototype;
      } return O instanceof Object ? ObjectProto : null;
    };

    var ITERATOR = _wks('iterator');
    var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
    var FF_ITERATOR = '@@iterator';
    var KEYS = 'keys';
    var VALUES = 'values';

    var returnThis = function () { return this; };

    var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
      _iterCreate(Constructor, NAME, next);
      var getMethod = function (kind) {
        if (!BUGGY && kind in proto) return proto[kind];
        switch (kind) {
          case KEYS: return function keys() { return new Constructor(this, kind); };
          case VALUES: return function values() { return new Constructor(this, kind); };
        } return function entries() { return new Constructor(this, kind); };
      };
      var TAG = NAME + ' Iterator';
      var DEF_VALUES = DEFAULT == VALUES;
      var VALUES_BUG = false;
      var proto = Base.prototype;
      var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
      var $default = $native || getMethod(DEFAULT);
      var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
      var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
      var methods, key, IteratorPrototype;
      // Fix native
      if ($anyNative) {
        IteratorPrototype = _objectGpo($anyNative.call(new Base()));
        if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
          // Set @@toStringTag to native iterators
          _setToStringTag(IteratorPrototype, TAG, true);
          // fix for some old engines
          if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);
        }
      }
      // fix Array#{values, @@iterator}.name in V8 / FF
      if (DEF_VALUES && $native && $native.name !== VALUES) {
        VALUES_BUG = true;
        $default = function values() { return $native.call(this); };
      }
      // Define iterator
      if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
        _hide(proto, ITERATOR, $default);
      }
      // Plug for library
      _iterators[NAME] = $default;
      _iterators[TAG] = returnThis;
      if (DEFAULT) {
        methods = {
          values: DEF_VALUES ? $default : getMethod(VALUES),
          keys: IS_SET ? $default : getMethod(KEYS),
          entries: $entries
        };
        if (FORCED) for (key in methods) {
          if (!(key in proto)) _redefine(proto, key, methods[key]);
        } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
      }
      return methods;
    };

    // 22.1.3.4 Array.prototype.entries()
    // 22.1.3.13 Array.prototype.keys()
    // 22.1.3.29 Array.prototype.values()
    // 22.1.3.30 Array.prototype[@@iterator]()
    var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
      this._t = _toIobject(iterated); // target
      this._i = 0;                   // next index
      this._k = kind;                // kind
    // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
    }, function () {
      var O = this._t;
      var kind = this._k;
      var index = this._i++;
      if (!O || index >= O.length) {
        this._t = undefined;
        return _iterStep(1);
      }
      if (kind == 'keys') return _iterStep(0, index);
      if (kind == 'values') return _iterStep(0, O[index]);
      return _iterStep(0, [index, O[index]]);
    }, 'values');

    // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
    _iterators.Arguments = _iterators.Array;

    _addToUnscopables('keys');
    _addToUnscopables('values');
    _addToUnscopables('entries');

    var TO_STRING_TAG = _wks('toStringTag');

    var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
      'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
      'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
      'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
      'TextTrackList,TouchList').split(',');

    for (var i = 0; i < DOMIterables.length; i++) {
      var NAME = DOMIterables[i];
      var Collection = _global[NAME];
      var proto = Collection && Collection.prototype;
      if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
      _iterators[NAME] = _iterators.Array;
    }

    // true  -> String#at
    // false -> String#codePointAt
    var _stringAt = function (TO_STRING) {
      return function (that, pos) {
        var s = String(_defined(that));
        var i = _toInteger(pos);
        var l = s.length;
        var a, b;
        if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
        a = s.charCodeAt(i);
        return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
          ? TO_STRING ? s.charAt(i) : a
          : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
      };
    };

    var $at = _stringAt(true);

    // 21.1.3.27 String.prototype[@@iterator]()
    _iterDefine(String, 'String', function (iterated) {
      this._t = String(iterated); // target
      this._i = 0;                // next index
    // 21.1.5.2.1 %StringIteratorPrototype%.next()
    }, function () {
      var O = this._t;
      var index = this._i;
      var point;
      if (index >= O.length) return { value: undefined, done: true };
      point = $at(O, index);
      this._i += point.length;
      return { value: point, done: false };
    });

    // getting tag from 19.1.3.6 Object.prototype.toString()

    var TAG$1 = _wks('toStringTag');
    // ES3 wrong here
    var ARG = _cof(function () { return arguments; }()) == 'Arguments';

    // fallback for IE11 Script Access Denied error
    var tryGet = function (it, key) {
      try {
        return it[key];
      } catch (e) { /* empty */ }
    };

    var _classof = function (it) {
      var O, T, B;
      return it === undefined ? 'Undefined' : it === null ? 'Null'
        // @@toStringTag case
        : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
        // builtinTag case
        : ARG ? _cof(O)
        // ES3 arguments fallback
        : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
    };

    var ITERATOR$1 = _wks('iterator');

    var core_isIterable = _core.isIterable = function (it) {
      var O = Object(it);
      return O[ITERATOR$1] !== undefined
        || '@@iterator' in O
        // eslint-disable-next-line no-prototype-builtins
        || _iterators.hasOwnProperty(_classof(O));
    };

    var isIterable$2 = core_isIterable;

    var isIterable = createCommonjsModule(function (module) {
    module.exports = { "default": isIterable$2, __esModule: true };
    });

    var ITERATOR$2 = _wks('iterator');

    var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
      if (it != undefined) return it[ITERATOR$2]
        || it['@@iterator']
        || _iterators[_classof(it)];
    };

    var core_getIterator = _core.getIterator = function (it) {
      var iterFn = core_getIteratorMethod(it);
      if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
      return _anObject(iterFn.call(it));
    };

    var getIterator$2 = core_getIterator;

    var getIterator = createCommonjsModule(function (module) {
    module.exports = { "default": getIterator$2, __esModule: true };
    });

    var slicedToArray = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;



    var _isIterable3 = _interopRequireDefault(isIterable);



    var _getIterator3 = _interopRequireDefault(getIterator);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if ((0, _isIterable3.default)(Object(arr))) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();
    });

    var _slicedToArray = unwrapExports(slicedToArray);

    var _anInstance = function (it, Constructor, name, forbiddenField) {
      if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
        throw TypeError(name + ': incorrect invocation!');
      } return it;
    };

    // call something on iterator step with safe closing on error

    var _iterCall = function (iterator, fn, value, entries) {
      try {
        return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
      // 7.4.6 IteratorClose(iterator, completion)
      } catch (e) {
        var ret = iterator['return'];
        if (ret !== undefined) _anObject(ret.call(iterator));
        throw e;
      }
    };

    // check on default Array iterator

    var ITERATOR$3 = _wks('iterator');
    var ArrayProto = Array.prototype;

    var _isArrayIter = function (it) {
      return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$3] === it);
    };

    var _forOf = createCommonjsModule(function (module) {
    var BREAK = {};
    var RETURN = {};
    var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
      var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
      var f = _ctx(fn, that, entries ? 2 : 1);
      var index = 0;
      var length, step, iterator, result;
      if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
      // fast case for arrays with default iterator
      if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
        result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
        if (result === BREAK || result === RETURN) return result;
      } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
        result = _iterCall(iterator, f, step.value, entries);
        if (result === BREAK || result === RETURN) return result;
      }
    };
    exports.BREAK = BREAK;
    exports.RETURN = RETURN;
    });

    // 7.3.20 SpeciesConstructor(O, defaultConstructor)


    var SPECIES = _wks('species');
    var _speciesConstructor = function (O, D) {
      var C = _anObject(O).constructor;
      var S;
      return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
    };

    // fast apply, http://jsperf.lnkit.com/fast-apply/5
    var _invoke = function (fn, args, that) {
      var un = that === undefined;
      switch (args.length) {
        case 0: return un ? fn()
                          : fn.call(that);
        case 1: return un ? fn(args[0])
                          : fn.call(that, args[0]);
        case 2: return un ? fn(args[0], args[1])
                          : fn.call(that, args[0], args[1]);
        case 3: return un ? fn(args[0], args[1], args[2])
                          : fn.call(that, args[0], args[1], args[2]);
        case 4: return un ? fn(args[0], args[1], args[2], args[3])
                          : fn.call(that, args[0], args[1], args[2], args[3]);
      } return fn.apply(that, args);
    };

    var process$1 = _global.process;
    var setTask = _global.setImmediate;
    var clearTask = _global.clearImmediate;
    var MessageChannel = _global.MessageChannel;
    var Dispatch = _global.Dispatch;
    var counter = 0;
    var queue = {};
    var ONREADYSTATECHANGE = 'onreadystatechange';
    var defer;
    var channel;
    var port;
    var run = function () {
      var id = +this;
      // eslint-disable-next-line no-prototype-builtins
      if (queue.hasOwnProperty(id)) {
        var fn = queue[id];
        delete queue[id];
        fn();
      }
    };
    var listener = function (event) {
      run.call(event.data);
    };
    // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
    if (!setTask || !clearTask) {
      setTask = function setImmediate(fn) {
        var args = [];
        var i = 1;
        while (arguments.length > i) args.push(arguments[i++]);
        queue[++counter] = function () {
          // eslint-disable-next-line no-new-func
          _invoke(typeof fn == 'function' ? fn : Function(fn), args);
        };
        defer(counter);
        return counter;
      };
      clearTask = function clearImmediate(id) {
        delete queue[id];
      };
      // Node.js 0.8-
      if (_cof(process$1) == 'process') {
        defer = function (id) {
          process$1.nextTick(_ctx(run, id, 1));
        };
      // Sphere (JS game engine) Dispatch API
      } else if (Dispatch && Dispatch.now) {
        defer = function (id) {
          Dispatch.now(_ctx(run, id, 1));
        };
      // Browsers with MessageChannel, includes WebWorkers
      } else if (MessageChannel) {
        channel = new MessageChannel();
        port = channel.port2;
        channel.port1.onmessage = listener;
        defer = _ctx(port.postMessage, port, 1);
      // Browsers with postMessage, skip WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
      } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
        defer = function (id) {
          _global.postMessage(id + '', '*');
        };
        _global.addEventListener('message', listener, false);
      // IE8-
      } else if (ONREADYSTATECHANGE in _domCreate('script')) {
        defer = function (id) {
          _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
            _html.removeChild(this);
            run.call(id);
          };
        };
      // Rest old browsers
      } else {
        defer = function (id) {
          setTimeout(_ctx(run, id, 1), 0);
        };
      }
    }
    var _task = {
      set: setTask,
      clear: clearTask
    };

    var macrotask = _task.set;
    var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
    var process$2 = _global.process;
    var Promise = _global.Promise;
    var isNode$1 = _cof(process$2) == 'process';

    var _microtask = function () {
      var head, last, notify;

      var flush = function () {
        var parent, fn;
        if (isNode$1 && (parent = process$2.domain)) parent.exit();
        while (head) {
          fn = head.fn;
          head = head.next;
          try {
            fn();
          } catch (e) {
            if (head) notify();
            else last = undefined;
            throw e;
          }
        } last = undefined;
        if (parent) parent.enter();
      };

      // Node.js
      if (isNode$1) {
        notify = function () {
          process$2.nextTick(flush);
        };
      // browsers with MutationObserver
      } else if (Observer) {
        var toggle = true;
        var node = document.createTextNode('');
        new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
        notify = function () {
          node.data = toggle = !toggle;
        };
      // environments with maybe non-completely correct, but existent Promise
      } else if (Promise && Promise.resolve) {
        var promise = Promise.resolve();
        notify = function () {
          promise.then(flush);
        };
      // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessag
      // - onreadystatechange
      // - setTimeout
      } else {
        notify = function () {
          // strange IE + webpack dev server bug - use .call(global)
          macrotask.call(_global, flush);
        };
      }

      return function (fn) {
        var task = { fn: fn, next: undefined };
        if (last) last.next = task;
        if (!head) {
          head = task;
          notify();
        } last = task;
      };
    };

    // 25.4.1.5 NewPromiseCapability(C)


    function PromiseCapability(C) {
      var resolve, reject;
      this.promise = new C(function ($$resolve, $$reject) {
        if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
        resolve = $$resolve;
        reject = $$reject;
      });
      this.resolve = _aFunction(resolve);
      this.reject = _aFunction(reject);
    }

    var f$1 = function (C) {
      return new PromiseCapability(C);
    };

    var _newPromiseCapability = {
    	f: f$1
    };

    var _perform = function (exec) {
      try {
        return { e: false, v: exec() };
      } catch (e) {
        return { e: true, v: e };
      }
    };

    var _promiseResolve = function (C, x) {
      _anObject(C);
      if (_isObject(x) && x.constructor === C) return x;
      var promiseCapability = _newPromiseCapability.f(C);
      var resolve = promiseCapability.resolve;
      resolve(x);
      return promiseCapability.promise;
    };

    var _redefineAll = function (target, src, safe) {
      for (var key in src) {
        if (safe && target[key]) target[key] = src[key];
        else _hide(target, key, src[key]);
      } return target;
    };

    var SPECIES$1 = _wks('species');

    var _setSpecies = function (KEY) {
      var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
      if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
        configurable: true,
        get: function () { return this; }
      });
    };

    var ITERATOR$4 = _wks('iterator');
    var SAFE_CLOSING = false;

    try {
      var riter = [7][ITERATOR$4]();
      riter['return'] = function () { SAFE_CLOSING = true; };
      // eslint-disable-next-line no-throw-literal
      Array.from(riter, function () { throw 2; });
    } catch (e) { /* empty */ }

    var _iterDetect = function (exec, skipClosing) {
      if (!skipClosing && !SAFE_CLOSING) return false;
      var safe = false;
      try {
        var arr = [7];
        var iter = arr[ITERATOR$4]();
        iter.next = function () { return { done: safe = true }; };
        arr[ITERATOR$4] = function () { return iter; };
        exec(arr);
      } catch (e) { /* empty */ }
      return safe;
    };

    var task = _task.set;
    var microtask = _microtask();



    var PROMISE = 'Promise';
    var TypeError$1 = _global.TypeError;
    var process = _global.process;
    var $Promise = _global[PROMISE];
    var isNode = _classof(process) == 'process';
    var empty = function () { /* empty */ };
    var Internal;
    var newGenericPromiseCapability;
    var OwnPromiseCapability;
    var Wrapper;
    var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

    var USE_NATIVE = !!function () {
      try {
        // correct subclassing with @@species support
        var promise = $Promise.resolve(1);
        var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
          exec(empty, empty);
        };
        // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
        return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
      } catch (e) { /* empty */ }
    }();

    // helpers
    var isThenable = function (it) {
      var then;
      return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
    };
    var notify = function (promise, isReject) {
      if (promise._n) return;
      promise._n = true;
      var chain = promise._c;
      microtask(function () {
        var value = promise._v;
        var ok = promise._s == 1;
        var i = 0;
        var run = function (reaction) {
          var handler = ok ? reaction.ok : reaction.fail;
          var resolve = reaction.resolve;
          var reject = reaction.reject;
          var domain = reaction.domain;
          var result, then;
          try {
            if (handler) {
              if (!ok) {
                if (promise._h == 2) onHandleUnhandled(promise);
                promise._h = 1;
              }
              if (handler === true) result = value;
              else {
                if (domain) domain.enter();
                result = handler(value);
                if (domain) domain.exit();
              }
              if (result === reaction.promise) {
                reject(TypeError$1('Promise-chain cycle'));
              } else if (then = isThenable(result)) {
                then.call(result, resolve, reject);
              } else resolve(result);
            } else reject(value);
          } catch (e) {
            reject(e);
          }
        };
        while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
        promise._c = [];
        promise._n = false;
        if (isReject && !promise._h) onUnhandled(promise);
      });
    };
    var onUnhandled = function (promise) {
      task.call(_global, function () {
        var value = promise._v;
        var unhandled = isUnhandled(promise);
        var result, handler, console;
        if (unhandled) {
          result = _perform(function () {
            if (isNode) {
              process.emit('unhandledRejection', value, promise);
            } else if (handler = _global.onunhandledrejection) {
              handler({ promise: promise, reason: value });
            } else if ((console = _global.console) && console.error) {
              console.error('Unhandled promise rejection', value);
            }
          });
          // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
          promise._h = isNode || isUnhandled(promise) ? 2 : 1;
        } promise._a = undefined;
        if (unhandled && result.e) throw result.v;
      });
    };
    var isUnhandled = function (promise) {
      if (promise._h == 1) return false;
      var chain = promise._a || promise._c;
      var i = 0;
      var reaction;
      while (chain.length > i) {
        reaction = chain[i++];
        if (reaction.fail || !isUnhandled(reaction.promise)) return false;
      } return true;
    };
    var onHandleUnhandled = function (promise) {
      task.call(_global, function () {
        var handler;
        if (isNode) {
          process.emit('rejectionHandled', promise);
        } else if (handler = _global.onrejectionhandled) {
          handler({ promise: promise, reason: promise._v });
        }
      });
    };
    var $reject = function (value) {
      var promise = this;
      if (promise._d) return;
      promise._d = true;
      promise = promise._w || promise; // unwrap
      promise._v = value;
      promise._s = 2;
      if (!promise._a) promise._a = promise._c.slice();
      notify(promise, true);
    };
    var $resolve = function (value) {
      var promise = this;
      var then;
      if (promise._d) return;
      promise._d = true;
      promise = promise._w || promise; // unwrap
      try {
        if (promise === value) throw TypeError$1("Promise can't be resolved itself");
        if (then = isThenable(value)) {
          microtask(function () {
            var wrapper = { _w: promise, _d: false }; // wrap
            try {
              then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
            } catch (e) {
              $reject.call(wrapper, e);
            }
          });
        } else {
          promise._v = value;
          promise._s = 1;
          notify(promise, false);
        }
      } catch (e) {
        $reject.call({ _w: promise, _d: false }, e); // wrap
      }
    };

    // constructor polyfill
    if (!USE_NATIVE) {
      // 25.4.3.1 Promise(executor)
      $Promise = function Promise(executor) {
        _anInstance(this, $Promise, PROMISE, '_h');
        _aFunction(executor);
        Internal.call(this);
        try {
          executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
        } catch (err) {
          $reject.call(this, err);
        }
      };
      // eslint-disable-next-line no-unused-vars
      Internal = function Promise(executor) {
        this._c = [];             // <- awaiting reactions
        this._a = undefined;      // <- checked in isUnhandled reactions
        this._s = 0;              // <- state
        this._d = false;          // <- done
        this._v = undefined;      // <- value
        this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
        this._n = false;          // <- notify
      };
      Internal.prototype = _redefineAll($Promise.prototype, {
        // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
        then: function then(onFulfilled, onRejected) {
          var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
          reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
          reaction.fail = typeof onRejected == 'function' && onRejected;
          reaction.domain = isNode ? process.domain : undefined;
          this._c.push(reaction);
          if (this._a) this._a.push(reaction);
          if (this._s) notify(this, false);
          return reaction.promise;
        },
        // 25.4.5.1 Promise.prototype.catch(onRejected)
        'catch': function (onRejected) {
          return this.then(undefined, onRejected);
        }
      });
      OwnPromiseCapability = function () {
        var promise = new Internal();
        this.promise = promise;
        this.resolve = _ctx($resolve, promise, 1);
        this.reject = _ctx($reject, promise, 1);
      };
      _newPromiseCapability.f = newPromiseCapability = function (C) {
        return C === $Promise || C === Wrapper
          ? new OwnPromiseCapability(C)
          : newGenericPromiseCapability(C);
      };
    }

    _export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
    _setToStringTag($Promise, PROMISE);
    _setSpecies(PROMISE);
    Wrapper = _core[PROMISE];

    // statics
    _export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
      // 25.4.4.5 Promise.reject(r)
      reject: function reject(r) {
        var capability = newPromiseCapability(this);
        var $$reject = capability.reject;
        $$reject(r);
        return capability.promise;
      }
    });
    _export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
      // 25.4.4.6 Promise.resolve(x)
      resolve: function resolve(x) {
        return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
      }
    });
    _export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
      $Promise.all(iter)['catch'](empty);
    })), PROMISE, {
      // 25.4.4.1 Promise.all(iterable)
      all: function all(iterable) {
        var C = this;
        var capability = newPromiseCapability(C);
        var resolve = capability.resolve;
        var reject = capability.reject;
        var result = _perform(function () {
          var values = [];
          var index = 0;
          var remaining = 1;
          _forOf(iterable, false, function (promise) {
            var $index = index++;
            var alreadyCalled = false;
            values.push(undefined);
            remaining++;
            C.resolve(promise).then(function (value) {
              if (alreadyCalled) return;
              alreadyCalled = true;
              values[$index] = value;
              --remaining || resolve(values);
            }, reject);
          });
          --remaining || resolve(values);
        });
        if (result.e) reject(result.v);
        return capability.promise;
      },
      // 25.4.4.4 Promise.race(iterable)
      race: function race(iterable) {
        var C = this;
        var capability = newPromiseCapability(C);
        var reject = capability.reject;
        var result = _perform(function () {
          _forOf(iterable, false, function (promise) {
            C.resolve(promise).then(capability.resolve, reject);
          });
        });
        if (result.e) reject(result.v);
        return capability.promise;
      }
    });

    _export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
      var C = _speciesConstructor(this, _core.Promise || _global.Promise);
      var isFunction = typeof onFinally == 'function';
      return this.then(
        isFunction ? function (x) {
          return _promiseResolve(C, onFinally()).then(function () { return x; });
        } : onFinally,
        isFunction ? function (e) {
          return _promiseResolve(C, onFinally()).then(function () { throw e; });
        } : onFinally
      );
    } });

    // https://github.com/tc39/proposal-promise-try




    _export(_export.S, 'Promise', { 'try': function (callbackfn) {
      var promiseCapability = _newPromiseCapability.f(this);
      var result = _perform(callbackfn);
      (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
      return promiseCapability.promise;
    } });

    var promise$1 = _core.Promise;

    var promise = createCommonjsModule(function (module) {
    module.exports = { "default": promise$1, __esModule: true };
    });

    var _Promise = unwrapExports(promise);

    var f$2 = Object.getOwnPropertySymbols;

    var _objectGops = {
    	f: f$2
    };

    var f$3 = {}.propertyIsEnumerable;

    var _objectPie = {
    	f: f$3
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

    var classCallCheck = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    exports.default = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    });

    var _classCallCheck = unwrapExports(classCallCheck);

    var f$4 = _wks;

    var _wksExt = {
    	f: f$4
    };

    var iterator$2 = _wksExt.f('iterator');

    var iterator = createCommonjsModule(function (module) {
    module.exports = { "default": iterator$2, __esModule: true };
    });

    var _meta = createCommonjsModule(function (module) {
    var META = _uid('meta');


    var setDesc = _objectDp.f;
    var id = 0;
    var isExtensible = Object.isExtensible || function () {
      return true;
    };
    var FREEZE = !_fails(function () {
      return isExtensible(Object.preventExtensions({}));
    });
    var setMeta = function (it) {
      setDesc(it, META, { value: {
        i: 'O' + ++id, // object ID
        w: {}          // weak collections IDs
      } });
    };
    var fastKey = function (it, create) {
      // return primitive with prefix
      if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
      if (!_has(it, META)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return 'F';
        // not necessary to add metadata
        if (!create) return 'E';
        // add missing metadata
        setMeta(it);
      // return object ID
      } return it[META].i;
    };
    var getWeak = function (it, create) {
      if (!_has(it, META)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return true;
        // not necessary to add metadata
        if (!create) return false;
        // add missing metadata
        setMeta(it);
      // return hash weak collections IDs
      } return it[META].w;
    };
    // add metadata on freeze-family methods calling
    var onFreeze = function (it) {
      if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
      return it;
    };
    var meta = module.exports = {
      KEY: META,
      NEED: false,
      fastKey: fastKey,
      getWeak: getWeak,
      onFreeze: onFreeze
    };
    });

    var defineProperty = _objectDp.f;
    var _wksDefine = function (name) {
      var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
      if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
    };

    // all enumerable object keys, includes symbols



    var _enumKeys = function (it) {
      var result = _objectKeys(it);
      var getSymbols = _objectGops.f;
      if (getSymbols) {
        var symbols = getSymbols(it);
        var isEnum = _objectPie.f;
        var i = 0;
        var key;
        while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
      } return result;
    };

    // 7.2.2 IsArray(argument)

    var _isArray = Array.isArray || function isArray(arg) {
      return _cof(arg) == 'Array';
    };

    // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

    var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

    var f$6 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
      return _objectKeysInternal(O, hiddenKeys);
    };

    var _objectGopn = {
    	f: f$6
    };

    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

    var gOPN$1 = _objectGopn.f;
    var toString$1 = {}.toString;

    var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window) : [];

    var getWindowNames = function (it) {
      try {
        return gOPN$1(it);
      } catch (e) {
        return windowNames.slice();
      }
    };

    var f$5 = function getOwnPropertyNames(it) {
      return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
    };

    var _objectGopnExt = {
    	f: f$5
    };

    var gOPD$1 = Object.getOwnPropertyDescriptor;

    var f$7 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
      O = _toIobject(O);
      P = _toPrimitive(P, true);
      if (_ie8DomDefine) try {
        return gOPD$1(O, P);
      } catch (e) { /* empty */ }
      if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
    };

    var _objectGopd = {
    	f: f$7
    };

    // ECMAScript 6 symbols shim





    var META = _meta.KEY;


















    var gOPD = _objectGopd.f;
    var dP$1 = _objectDp.f;
    var gOPN = _objectGopnExt.f;
    var $Symbol = _global.Symbol;
    var $JSON = _global.JSON;
    var _stringify = $JSON && $JSON.stringify;
    var PROTOTYPE$2 = 'prototype';
    var HIDDEN = _wks('_hidden');
    var TO_PRIMITIVE = _wks('toPrimitive');
    var isEnum = {}.propertyIsEnumerable;
    var SymbolRegistry = _shared('symbol-registry');
    var AllSymbols = _shared('symbols');
    var OPSymbols = _shared('op-symbols');
    var ObjectProto$1 = Object[PROTOTYPE$2];
    var USE_NATIVE$1 = typeof $Symbol == 'function';
    var QObject = _global.QObject;
    // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
    var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

    // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
    var setSymbolDesc = _descriptors && _fails(function () {
      return _objectCreate(dP$1({}, 'a', {
        get: function () { return dP$1(this, 'a', { value: 7 }).a; }
      })).a != 7;
    }) ? function (it, key, D) {
      var protoDesc = gOPD(ObjectProto$1, key);
      if (protoDesc) delete ObjectProto$1[key];
      dP$1(it, key, D);
      if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
    } : dP$1;

    var wrap = function (tag) {
      var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
      sym._k = tag;
      return sym;
    };

    var isSymbol = USE_NATIVE$1 && typeof $Symbol.iterator == 'symbol' ? function (it) {
      return typeof it == 'symbol';
    } : function (it) {
      return it instanceof $Symbol;
    };

    var $defineProperty = function defineProperty(it, key, D) {
      if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
      _anObject(it);
      key = _toPrimitive(key, true);
      _anObject(D);
      if (_has(AllSymbols, key)) {
        if (!D.enumerable) {
          if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
          it[HIDDEN][key] = true;
        } else {
          if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
          D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
        } return setSymbolDesc(it, key, D);
      } return dP$1(it, key, D);
    };
    var $defineProperties = function defineProperties(it, P) {
      _anObject(it);
      var keys = _enumKeys(P = _toIobject(P));
      var i = 0;
      var l = keys.length;
      var key;
      while (l > i) $defineProperty(it, key = keys[i++], P[key]);
      return it;
    };
    var $create = function create(it, P) {
      return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
    };
    var $propertyIsEnumerable = function propertyIsEnumerable(key) {
      var E = isEnum.call(this, key = _toPrimitive(key, true));
      if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
      return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
    };
    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
      it = _toIobject(it);
      key = _toPrimitive(key, true);
      if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
      var D = gOPD(it, key);
      if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
      return D;
    };
    var $getOwnPropertyNames = function getOwnPropertyNames(it) {
      var names = gOPN(_toIobject(it));
      var result = [];
      var i = 0;
      var key;
      while (names.length > i) {
        if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
      } return result;
    };
    var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
      var IS_OP = it === ObjectProto$1;
      var names = gOPN(IS_OP ? OPSymbols : _toIobject(it));
      var result = [];
      var i = 0;
      var key;
      while (names.length > i) {
        if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
      } return result;
    };

    // 19.4.1.1 Symbol([description])
    if (!USE_NATIVE$1) {
      $Symbol = function Symbol() {
        if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
        var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
        var $set = function (value) {
          if (this === ObjectProto$1) $set.call(OPSymbols, value);
          if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
          setSymbolDesc(this, tag, _propertyDesc(1, value));
        };
        if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
        return wrap(tag);
      };
      _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
        return this._k;
      });

      _objectGopd.f = $getOwnPropertyDescriptor;
      _objectDp.f = $defineProperty;
      _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
      _objectPie.f = $propertyIsEnumerable;
      _objectGops.f = $getOwnPropertySymbols;

      if (_descriptors && !_library) {
        _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
      }

      _wksExt.f = function (name) {
        return wrap(_wks(name));
      };
    }

    _export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Symbol: $Symbol });

    for (var es6Symbols = (
      // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
      'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
    ).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

    for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

    _export(_export.S + _export.F * !USE_NATIVE$1, 'Symbol', {
      // 19.4.2.1 Symbol.for(key)
      'for': function (key) {
        return _has(SymbolRegistry, key += '')
          ? SymbolRegistry[key]
          : SymbolRegistry[key] = $Symbol(key);
      },
      // 19.4.2.5 Symbol.keyFor(sym)
      keyFor: function keyFor(sym) {
        if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
        for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
      },
      useSetter: function () { setter = true; },
      useSimple: function () { setter = false; }
    });

    _export(_export.S + _export.F * !USE_NATIVE$1, 'Object', {
      // 19.1.2.2 Object.create(O [, Properties])
      create: $create,
      // 19.1.2.4 Object.defineProperty(O, P, Attributes)
      defineProperty: $defineProperty,
      // 19.1.2.3 Object.defineProperties(O, Properties)
      defineProperties: $defineProperties,
      // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
      // 19.1.2.7 Object.getOwnPropertyNames(O)
      getOwnPropertyNames: $getOwnPropertyNames,
      // 19.1.2.8 Object.getOwnPropertySymbols(O)
      getOwnPropertySymbols: $getOwnPropertySymbols
    });

    // 24.3.2 JSON.stringify(value [, replacer [, space]])
    $JSON && _export(_export.S + _export.F * (!USE_NATIVE$1 || _fails(function () {
      var S = $Symbol();
      // MS Edge converts symbol values to JSON as {}
      // WebKit converts symbol values to JSON as null
      // V8 throws on boxed symbols
      return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
    })), 'JSON', {
      stringify: function stringify(it) {
        if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
        var args = [it];
        var i = 1;
        var replacer, $replacer;
        while (arguments.length > i) args.push(arguments[i++]);
        replacer = args[1];
        if (typeof replacer == 'function') $replacer = replacer;
        if ($replacer || !_isArray(replacer)) replacer = function (key, value) {
          if ($replacer) value = $replacer.call(this, key, value);
          if (!isSymbol(value)) return value;
        };
        args[1] = replacer;
        return _stringify.apply($JSON, args);
      }
    });

    // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
    $Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
    // 19.4.3.5 Symbol.prototype[@@toStringTag]
    _setToStringTag($Symbol, 'Symbol');
    // 20.2.1.9 Math[@@toStringTag]
    _setToStringTag(Math, 'Math', true);
    // 24.3.3 JSON[@@toStringTag]
    _setToStringTag(_global.JSON, 'JSON', true);

    _wksDefine('asyncIterator');

    _wksDefine('observable');

    var symbol$2 = _core.Symbol;

    var symbol = createCommonjsModule(function (module) {
    module.exports = { "default": symbol$2, __esModule: true };
    });

    var _typeof_1 = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;



    var _iterator2 = _interopRequireDefault(iterator);



    var _symbol2 = _interopRequireDefault(symbol);

    var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
      return typeof obj === "undefined" ? "undefined" : _typeof(obj);
    } : function (obj) {
      return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
    };
    });

    var possibleConstructorReturn = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;



    var _typeof3 = _interopRequireDefault(_typeof_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
    };
    });

    var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

    // Works with __proto__ only. Old v8 can't work with null proto objects.
    /* eslint-disable no-proto */


    var check = function (O, proto) {
      _anObject(O);
      if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
    };
    var _setProto = {
      set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
        function (test, buggy, set) {
          try {
            set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
            set(test, []);
            buggy = !(test instanceof Array);
          } catch (e) { buggy = true; }
          return function setPrototypeOf(O, proto) {
            check(O, proto);
            if (buggy) O.__proto__ = proto;
            else set(O, proto);
            return O;
          };
        }({}, false) : undefined),
      check: check
    };

    // 19.1.3.19 Object.setPrototypeOf(O, proto)

    _export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

    var setPrototypeOf$2 = _core.Object.setPrototypeOf;

    var setPrototypeOf = createCommonjsModule(function (module) {
    module.exports = { "default": setPrototypeOf$2, __esModule: true };
    });

    // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
    _export(_export.S, 'Object', { create: _objectCreate });

    var $Object = _core.Object;
    var create$2 = function create(P, D) {
      return $Object.create(P, D);
    };

    var create = createCommonjsModule(function (module) {
    module.exports = { "default": create$2, __esModule: true };
    });

    var inherits = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;



    var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf);



    var _create2 = _interopRequireDefault(create);



    var _typeof3 = _interopRequireDefault(_typeof_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
      }

      subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
    };
    });

    var _inherits = unwrapExports(inherits);

    var eventemitter3 = createCommonjsModule(function (module) {
    'use strict';

    var has = Object.prototype.hasOwnProperty
      , prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @api private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {Mixed} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @api private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @api public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @api public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = []
        , events
        , name;

      if (this._eventsCount === 0) return names;

      for (name in (events = this._events)) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {String|Symbol} event The event name.
     * @param {Boolean} exists Only check if there are listeners.
     * @returns {Array|Boolean}
     * @api public
     */
    EventEmitter.prototype.listeners = function listeners(event, exists) {
      var evt = prefix ? prefix + event : event
        , available = this._events[evt];

      if (exists) return !!available;
      if (!available) return [];
      if (available.fn) return [available.fn];

      for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
        ee[i] = available[i].fn;
      }

      return ee;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {String|Symbol} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @api public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1: return listeners.fn.call(listeners.context), true;
          case 2: return listeners.fn.call(listeners.context, a1), true;
          case 3: return listeners.fn.call(listeners.context, a1, a2), true;
          case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length
          , j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1: listeners[i].fn.call(listeners[i].context); break;
            case 2: listeners[i].fn.call(listeners[i].context, a1); break;
            case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
            case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
            default:
              if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {String|Symbol} event The event name.
     * @param {Function} fn The listener function.
     * @param {Mixed} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @api public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      var listener = new EE(fn, context || this)
        , evt = prefix ? prefix + event : event;

      if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
      else if (!this._events[evt].fn) this._events[evt].push(listener);
      else this._events[evt] = [this._events[evt], listener];

      return this;
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {String|Symbol} event The event name.
     * @param {Function} fn The listener function.
     * @param {Mixed} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @api public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      var listener = new EE(fn, context || this, true)
        , evt = prefix ? prefix + event : event;

      if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
      else if (!this._events[evt].fn) this._events[evt].push(listener);
      else this._events[evt] = [this._events[evt], listener];

      return this;
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {String|Symbol} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {Mixed} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @api public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        if (--this._eventsCount === 0) this._events = new Events();
        else delete this._events[evt];
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (
             listeners.fn === fn
          && (!once || listeners.once)
          && (!context || listeners.context === context)
        ) {
          if (--this._eventsCount === 0) this._events = new Events();
          else delete this._events[evt];
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (
               listeners[i].fn !== fn
            || (once && !listeners[i].once)
            || (context && listeners[i].context !== context)
          ) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else if (--this._eventsCount === 0) this._events = new Events();
        else delete this._events[evt];
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {String|Symbol} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @api public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) {
          if (--this._eventsCount === 0) this._events = new Events();
          else delete this._events[evt];
        }
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // This function doesn't apply anymore.
    //
    EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
      return this;
    };

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    //
    // Expose the module.
    //
    {
      module.exports = EventEmitter;
    }
    });

    // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
    _export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

    var $Object$1 = _core.Object;
    var defineProperty$3 = function defineProperty(it, key, desc) {
      return $Object$1.defineProperty(it, key, desc);
    };

    var defineProperty$1 = createCommonjsModule(function (module) {
    module.exports = { "default": defineProperty$3, __esModule: true };
    });

    var createClass = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;



    var _defineProperty2 = _interopRequireDefault(defineProperty$1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          (0, _defineProperty2.default)(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    });

    var _createClass = unwrapExports(createClass);

    var stateMachine = createCommonjsModule(function (module, exports) {
    /*

      Javascript State Machine Library - https://github.com/jakesgordon/javascript-state-machine

      Copyright (c) 2012, 2013, 2014, 2015, Jake Gordon and contributors
      Released under the MIT license - https://github.com/jakesgordon/javascript-state-machine/blob/master/LICENSE

    */

    (function () {

      var StateMachine = {

        //---------------------------------------------------------------------------

        VERSION: "2.4.0",

        //---------------------------------------------------------------------------

        Result: {
          SUCCEEDED:    1, // the event transitioned successfully from one state to another
          NOTRANSITION: 2, // the event was successfull but no state transition was necessary
          CANCELLED:    3, // the event was cancelled by the caller in a beforeEvent callback
          PENDING:      4  // the event is asynchronous and the caller is in control of when the transition occurs
        },

        Error: {
          INVALID_TRANSITION: 100, // caller tried to fire an event that was innapropriate in the current state
          PENDING_TRANSITION: 200, // caller tried to fire an event while an async transition was still pending
          INVALID_CALLBACK:   300 // caller provided callback function threw an exception
        },

        WILDCARD: '*',
        ASYNC: 'async',

        //---------------------------------------------------------------------------

        create: function(cfg, target) {

          var initial      = (typeof cfg.initial == 'string') ? { state: cfg.initial } : cfg.initial; // allow for a simple string, or an object with { state: 'foo', event: 'setup', defer: true|false }
          var terminal     = cfg.terminal || cfg['final'];
          var fsm          = target || cfg.target  || {};
          var events       = cfg.events || [];
          var callbacks    = cfg.callbacks || {};
          var map          = {}; // track state transitions allowed for an event { event: { from: [ to ] } }
          var transitions  = {}; // track events allowed from a state            { state: [ event ] }

          var add = function(e) {
            var from = Array.isArray(e.from) ? e.from : (e.from ? [e.from] : [StateMachine.WILDCARD]); // allow 'wildcard' transition if 'from' is not specified
            map[e.name] = map[e.name] || {};
            for (var n = 0 ; n < from.length ; n++) {
              transitions[from[n]] = transitions[from[n]] || [];
              transitions[from[n]].push(e.name);

              map[e.name][from[n]] = e.to || from[n]; // allow no-op transition if 'to' is not specified
            }
            if (e.to)
              transitions[e.to] = transitions[e.to] || [];
          };

          if (initial) {
            initial.event = initial.event || 'startup';
            add({ name: initial.event, from: 'none', to: initial.state });
          }

          for(var n = 0 ; n < events.length ; n++)
            add(events[n]);

          for(var name in map) {
            if (map.hasOwnProperty(name))
              fsm[name] = StateMachine.buildEvent(name, map[name]);
          }

          for(var name in callbacks) {
            if (callbacks.hasOwnProperty(name))
              fsm[name] = callbacks[name];
          }

          fsm.current     = 'none';
          fsm.is          = function(state) { return Array.isArray(state) ? (state.indexOf(this.current) >= 0) : (this.current === state); };
          fsm.can         = function(event) { return !this.transition && (map[event] !== undefined) && (map[event].hasOwnProperty(this.current) || map[event].hasOwnProperty(StateMachine.WILDCARD)); };
          fsm.cannot      = function(event) { return !this.can(event); };
          fsm.transitions = function()      { return (transitions[this.current] || []).concat(transitions[StateMachine.WILDCARD] || []); };
          fsm.isFinished  = function()      { return this.is(terminal); };
          fsm.error       = cfg.error || function(name, from, to, args, error, msg, e) { throw e || msg; }; // default behavior when something unexpected happens is to throw an exception, but caller can override this behavior if desired (see github issue #3 and #17)
          fsm.states      = function() { return Object.keys(transitions).sort() };

          if (initial && !initial.defer)
            fsm[initial.event]();

          return fsm;

        },

        //===========================================================================

        doCallback: function(fsm, func, name, from, to, args) {
          if (func) {
            try {
              return func.apply(fsm, [name, from, to].concat(args));
            }
            catch(e) {
              return fsm.error(name, from, to, args, StateMachine.Error.INVALID_CALLBACK, "an exception occurred in a caller-provided callback function", e);
            }
          }
        },

        beforeAnyEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbeforeevent'],                       name, from, to, args); },
        afterAnyEvent:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafterevent'] || fsm['onevent'],      name, from, to, args); },
        leaveAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleavestate'],                        name, from, to, args); },
        enterAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenterstate'] || fsm['onstate'],      name, from, to, args); },
        changeState:     function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onchangestate'],                       name, from, to, args); },

        beforeThisEvent: function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbefore' + name],                     name, from, to, args); },
        afterThisEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafter'  + name] || fsm['on' + name], name, from, to, args); },
        leaveThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleave'  + from],                     name, from, to, args); },
        enterThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenter'  + to]   || fsm['on' + to],   name, from, to, args); },

        beforeEvent: function(fsm, name, from, to, args) {
          if ((false === StateMachine.beforeThisEvent(fsm, name, from, to, args)) ||
              (false === StateMachine.beforeAnyEvent( fsm, name, from, to, args)))
            return false;
        },

        afterEvent: function(fsm, name, from, to, args) {
          StateMachine.afterThisEvent(fsm, name, from, to, args);
          StateMachine.afterAnyEvent( fsm, name, from, to, args);
        },

        leaveState: function(fsm, name, from, to, args) {
          var specific = StateMachine.leaveThisState(fsm, name, from, to, args),
              general  = StateMachine.leaveAnyState( fsm, name, from, to, args);
          if ((false === specific) || (false === general))
            return false;
          else if ((StateMachine.ASYNC === specific) || (StateMachine.ASYNC === general))
            return StateMachine.ASYNC;
        },

        enterState: function(fsm, name, from, to, args) {
          StateMachine.enterThisState(fsm, name, from, to, args);
          StateMachine.enterAnyState( fsm, name, from, to, args);
        },

        //===========================================================================

        buildEvent: function(name, map) {
          return function() {

            var from  = this.current;
            var to    = map[from] || (map[StateMachine.WILDCARD] != StateMachine.WILDCARD ? map[StateMachine.WILDCARD] : from) || from;
            var args  = Array.prototype.slice.call(arguments); // turn arguments into pure array

            if (this.transition)
              return this.error(name, from, to, args, StateMachine.Error.PENDING_TRANSITION, "event " + name + " inappropriate because previous transition did not complete");

            if (this.cannot(name))
              return this.error(name, from, to, args, StateMachine.Error.INVALID_TRANSITION, "event " + name + " inappropriate in current state " + this.current);

            if (false === StateMachine.beforeEvent(this, name, from, to, args))
              return StateMachine.Result.CANCELLED;

            if (from === to) {
              StateMachine.afterEvent(this, name, from, to, args);
              return StateMachine.Result.NOTRANSITION;
            }

            // prepare a transition method for use EITHER lower down, or by caller if they want an async transition (indicated by an ASYNC return value from leaveState)
            var fsm = this;
            this.transition = function() {
              fsm.transition = null; // this method should only ever be called once
              fsm.current = to;
              StateMachine.enterState( fsm, name, from, to, args);
              StateMachine.changeState(fsm, name, from, to, args);
              StateMachine.afterEvent( fsm, name, from, to, args);
              return StateMachine.Result.SUCCEEDED;
            };
            this.transition.cancel = function() { // provide a way for caller to cancel async transition if desired (issue #22)
              fsm.transition = null;
              StateMachine.afterEvent(fsm, name, from, to, args);
            };

            var leave = StateMachine.leaveState(this, name, from, to, args);
            if (false === leave) {
              this.transition = null;
              return StateMachine.Result.CANCELLED;
            }
            else if (StateMachine.ASYNC === leave) {
              return StateMachine.Result.PENDING;
            }
            else {
              if (this.transition) // need to check in case user manually called transition() but forgot to return StateMachine.ASYNC
                return this.transition();
            }

          };
        }

      }; // StateMachine

      //===========================================================================

      //======
      // NODE
      //======
      {
        if ('object' !== 'undefined' && module.exports) {
          exports = module.exports = StateMachine;
        }
        exports.StateMachine = StateMachine;
      }

    }());
    });

    var createCallStateMachine = (function () {
      return stateMachine.create({
        initial: 'calling',
        events: [{
          name: 'connect',
          from: 'calling',
          to: 'connected'
        }, {
          name: 'close',
          from: 'connected',
          to: 'closed'
        }, {
          name: 'cancel',
          from: 'calling',
          to: 'canceled'
        }, {
          name: 'refuse',
          from: 'calling',
          to: 'refused'
        }]
      });
    });

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

    // use dynamic class inherit helper instead of ES class syntex
    // to prevent TypedMessage from being included in the bundler
    var Signaling = inherit(leancloudRealtime.TypedMessage, {
      __constructor: function __constructor(payload) {
        this.__base();
        this.payload = payload;
        this.setTransient(true);
      }
    });

    leancloudRealtime.messageField('payload')(Signaling);

    var _dec;
    var _class;

    var Answer = (_dec = leancloudRealtime.messageType(-102), _dec(_class = function (_Signaling) {
      _inherits(Answer, _Signaling);

      function Answer() {
        _classCallCheck(this, Answer);

        return _possibleConstructorReturn(this, _Signaling.apply(this, arguments));
      }

      return Answer;
    }(Signaling)) || _class);

    var _dec$1;
    var _class$1;

    var ICECandidate = (_dec$1 = leancloudRealtime.messageType(-103), _dec$1(_class$1 = function (_Signaling) {
      _inherits(ICECandidate, _Signaling);

      function ICECandidate() {
        _classCallCheck(this, ICECandidate);

        return _possibleConstructorReturn(this, _Signaling.apply(this, arguments));
      }

      return ICECandidate;
    }(Signaling)) || _class$1);

    var _dec$2;
    var _class$2;

    var Refusal = (_dec$2 = leancloudRealtime.messageType(-104), _dec$2(_class$2 = function (_Signaling) {
      _inherits(Refusal, _Signaling);

      function Refusal() {
        _classCallCheck(this, Refusal);

        return _possibleConstructorReturn(this, _Signaling.apply(this, arguments));
      }

      return Refusal;
    }(Signaling)) || _class$2);

    var _dec$3;
    var _class$3;

    var Cancelation = (_dec$3 = leancloudRealtime.messageType(-105), _dec$3(_class$3 = function (_Signaling) {
      _inherits(Cancelation, _Signaling);

      function Cancelation() {
        _classCallCheck(this, Cancelation);

        return _possibleConstructorReturn(this, _Signaling.apply(this, arguments));
      }

      return Cancelation;
    }(Signaling)) || _class$3);

    var Call = function (_EventEmitter) {
      _inherits(Call, _EventEmitter);

      /**
       * {@link IncomingCall} 与 {@link OutgoingCall} 的基类
       * @abstract
       */
      function Call(conversation, RTCConfiguration) {
        _classCallCheck(this, Call);

        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        _this._setConversation(conversation);
        _this._peerConnection = _this._createPeerConnection(RTCConfiguration);
        _this._call = createCallStateMachine();
        _this._promises = {};
        var streamReady = new _Promise(function (resolve) {
          _this._promises.resolveStreamReady = resolve;
        });
        var accept = new _Promise(function (resolve) {
          _this._promises.resolveAccept = resolve;
        });
        _Promise.all([streamReady, accept]).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 1),
              stream = _ref2[0];

          if (_this._call.can('connect')) {
            _this._call.connect();
            /**
             * 通话连接成功
             * @event Call#connect
             * @param {MediaStream} stram 对方的媒体流
             */
            _this.emit('connect', stream);
          }
        });
        return _this;
      }

      /**
       * 当前通话状态
       * （<code>calling</code>, <code>connected</code>, <code>closed</code>,
       * <code>refused</code>, <code>canceled</code>）
       * @type {string}
       * @readonly
       */


      /**
       * 结束通话
       * @return {Promise}
       */
      Call.prototype.close = function close() {
        var _this2 = this;

        return _Promise.resolve().then(function () {
          _this2._call.close();
          _this2._destroyPeerConnection();
          _this2._peerConnection.close();
          _this2._destroy();
        });
      };

      Call.prototype._handleCloseEvent = function _handleCloseEvent() {
        if (this._call.can('close')) {
          this.close();
          /**
           * 通话结束，可能是对方挂断或网络中断
           * @event Call#close
           */
          this.emit('close');
        }
      };

      Call.prototype._setConversation = function _setConversation(conversation) {
        if (this._conversation) {
          this._conversation.off('message');
        }
        if (conversation) {
          this._conversation = conversation;
          conversation.on('message', this._handleMessage.bind(this));
        }
      };

      Call.prototype._destroy = function _destroy() {
        this._conversation.off('message');
      };

      Call.prototype._createPeerConnection = function _createPeerConnection(RTCConfiguration) {
        var connection = new RTCPeerConnection(RTCConfiguration);
        connection.onicecandidate = this._handleICECandidateEvent.bind(this);
        connection.onaddstream = this._handleAddStreamEvent.bind(this);
        connection.onnremovestream = this._handleRemoveStreamEvent.bind(this);
        connection.oniceconnectionstatechange = this._handleICEConnectionStateChangeEvent.bind(this);
        connection.onsignalingstatechange = this._handleSignalingStateChangeEvent.bind(this);
        return connection;
      };

      Call.prototype._destroyPeerConnection = function _destroyPeerConnection() {
        var connection = this._peerConnection;
        delete connection.onaddstream;
        delete connection.onremovestream;
        delete connection.onnicecandidate;
        delete connection.oniceconnectionstatechange;
        delete connection.onsignalingstatechange;
      };

      Call.prototype._handleMessage = function _handleMessage(message) {
        if (message instanceof Answer) {
          return this._handleAnswer(message);
        }
        if (message instanceof Refusal) {
          return this._handleRefusal();
        }
        if (message instanceof Cancelation) {
          return this._handleCancelation();
        }
        if (message instanceof ICECandidate) {
          return this._handleICECandidate(message);
        }
        return false;
      };

      Call.prototype._handleICECandidate = function _handleICECandidate(message) {
        var candidate = new RTCIceCandidate(message.payload);
        if (this._peerConnection) {
          this._peerConnection.addIceCandidate(candidate).catch(console.error.bind(console));
        }
      };

      Call.prototype._handleICECandidateEvent = function _handleICECandidateEvent(event) {
        if (event.candidate && this._conversation) {
          return this._conversation.send(new ICECandidate(event.candidate)).catch(console.error.bind(console));
        }
        return false;
      };

      Call.prototype._handleAddStreamEvent = function _handleAddStreamEvent(event) {
        this._promises.resolveStreamReady(event.stream);
      };

      Call.prototype._handleRemoveStreamEvent = function _handleRemoveStreamEvent() {
        this._handleCloseEvent();
      };

      Call.prototype._handleICEConnectionStateChangeEvent = function _handleICEConnectionStateChangeEvent() {
        switch (this._peerConnection.iceConnectionState) {
          case 'closed':
          case 'failed':
          case 'disconnected':
            this._handleCloseEvent();
            break;
          default:
        }
      };

      Call.prototype._handleSignalingStateChangeEvent = function _handleSignalingStateChangeEvent() {
        switch (this._peerConnection.signalingState) {
          case 'closed':
            this._handleCloseEvent();
            break;
          default:
        }
      };
      /* eslint-disable class-methods-use-this */


      Call.prototype._handleAnswer = function _handleAnswer() {
        throw new Error('not implemented');
      };

      Call.prototype._handleRefusal = function _handleRefusal() {
        throw new Error('not implemented');
      };

      Call.prototype._handleCancelation = function _handleCancelation() {
        throw new Error('not implemented');
      };
      /* eslint-enable class-methods-use-this */


      _createClass(Call, [{
        key: 'state',
        get: function get() {
          return this._call.current;
        }
      }]);

      return Call;
    }(eventemitter3);

    var OutgoingCall = function (_Call) {
      _inherits(OutgoingCall, _Call);

      /**
       * 呼出的通话
       * @extends Call
       */
      function OutgoingCall(to, conversation, RTCConfiguration) {
        _classCallCheck(this, OutgoingCall);

        /**
         * 呼叫目标 id
         * @type {string}
         */
        var _this = _possibleConstructorReturn(this, _Call.call(this, conversation, RTCConfiguration));

        _this.to = to;
        return _this;
      }

      OutgoingCall.prototype._handleAnswer = function _handleAnswer(answer) {
        var desc = new RTCSessionDescription(answer.payload);
        this._peerConnection.setRemoteDescription(desc);
        this._promises.resolveAccept();
      };

      OutgoingCall.prototype._handleRefusal = function _handleRefusal() {
        this._destroyPeerConnection();
        this._call.refuse();
        /**
         * 呼叫被对方拒绝
         * @event OutgoingCall#refuse
         */
        this.emit('refuse');
        this._destroy();
      };

      /**
       * 取消该次呼叫
       * @return {Promise}
       */


      OutgoingCall.prototype.cancel = function cancel() {
        var _this2 = this;

        this._call.cancel();
        return this._conversation.send(new Cancelation()).then(function () {
          return _this2._destroy();
        });
      };

      /**
       * 结束通话，如果在 <code>calling</code> 状态，则取消该次呼叫
       * @return {Promise}
       */


      OutgoingCall.prototype.close = function close() {
        if (this._call.can('cancel')) {
          return this.cancel();
        }
        return _Call.prototype.close.call(this);
      };

      return OutgoingCall;
    }(Call);

    var IncomingCall = function (_Call) {
      _inherits(IncomingCall, _Call);

      /**
       * 呼入的通话
       * @extends Call
       */
      function IncomingCall(offer, conversation, RTCConfiguration) {
        _classCallCheck(this, IncomingCall);

        /**
         * 呼叫者 id
         * @type {string}
         */
        var _this = _possibleConstructorReturn(this, _Call.call(this, conversation, RTCConfiguration));

        _this.from = offer.from;
        var desc = new RTCSessionDescription(offer.payload);
        _this._handleOfferPromise = _this._peerConnection.setRemoteDescription(desc);
        return _this;
      }

      /**
       * 接受该呼入通话
       * @param  {MediaStream} stream 本地流媒体，参见 {@link https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API MediaStream}
       * @return {Promise}
       */


      IncomingCall.prototype.accept = function accept(stream) {
        var _this2 = this;

        if (!stream) {
          throw new TypeError('a MediaStream instance is required to accept a call');
        }
        return this._handleOfferPromise.then(function () {
          return _this2._peerConnection.addStream(stream);
        }).then(function () {
          return _this2._peerConnection.createAnswer();
        }).then(function (answer) {
          return _this2._peerConnection.setLocalDescription(answer);
        }).then(function () {
          return _this2._conversation.send(new Answer(_this2._peerConnection.localDescription));
        }).then(function () {
          return _this2._promises.resolveAccept();
        });
      };
      /**
       * 拒绝该呼入通话
       * @return {Promise}
       */


      IncomingCall.prototype.refuse = function refuse() {
        var _this3 = this;

        return this._conversation.send(new Refusal()).then(function () {
          _this3._call.refuse();
          _this3._destroy();
        });
      };

      IncomingCall.prototype._handleCancelation = function _handleCancelation() {
        this._call.cancel();
        /**
         * 呼叫被对方取消
         * @event IncomingCall#cancel
         */
        this.emit('cancel');
        this._destroy();
      };

      return IncomingCall;
    }(Call);

    var _dec$4;
    var _class$4;

    var Offer = (_dec$4 = leancloudRealtime.messageType(-101), _dec$4(_class$4 = function (_Signaling) {
      _inherits(Offer, _Signaling);

      function Offer() {
        _classCallCheck(this, Offer);

        return _possibleConstructorReturn(this, _Signaling.apply(this, arguments));
      }

      return Offer;
    }(Signaling)) || _class$4);

    var DEFAULT_RTCCONF = {
      iceServers: [{
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302', 'stun:stun.ekiga.net', 'stun:stun.ideasip.com', 'stun:stun.rixtelecom.se', 'stun:stun.schlund.de', 'stun:stun.stunprotocol.org:3478', 'stun:stun.voiparound.com', 'stun:stun.voipbuster.com', 'stun:stun.voipstunt.com', 'stun:stun.voxgratia.org']
      }]
    };

    var WebRTCClient = function (_EventEmitter) {
      _inherits(WebRTCClient, _EventEmitter);

      /**
       * 无法直接实例化，请使用 {@link createWebRTCClient Realtime#createWebRTCClient} 创建新的 WebRTCClient
       */
      function WebRTCClient(id, options) {
        _classCallCheck(this, WebRTCClient);

        if (typeof id !== 'string') {
          throw new TypeError('id is not a string');
        }

        /** @type {string} */
        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        _this.id = id;
        _this.options = _Object$assign({
          RTCConfiguration: DEFAULT_RTCCONF
        }, options);
        return _this;
      }

      WebRTCClient.prototype._open = function _open(realtime, clientOptions) {
        var _this2 = this;

        return realtime.createIMClient(this.id, clientOptions, 'webrtc').then(function (imClient) {
          _this2._imClient = imClient;
          _this2.id = imClient.id;
          imClient.on('message', function (message, conversation) {
            if (message instanceof Offer) {
              return _this2._handleOffer(message, conversation);
            }
            return false;
          });
          /**
           * 用户在其他客户端登录，当前客户端被服务端强行下线。详见文档「单点登录」章节。
           * @event WebRTCClient#conflict
           */
          imClient.on('conflict', function () {
            for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
              payload[_key] = arguments[_key];
            }

            return _this2.emit.apply(_this2, ['conflict'].concat(payload));
          });
          return _this2;
        });
      };

      /**
       * 关闭客户端
       * @return {Promise}
       */


      WebRTCClient.prototype.close = function close() {
        return this._imClient.close();
      };

      /**
       * 呼叫另一个用户
       * @param  {string} targetId 用户 ID
       * @param  {MediaStream} stream 本地流媒体，参见 {@link https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API MediaStream}
       * @return {Promise.<OutgoingCall>} 呼出通话
       */


      WebRTCClient.prototype.call = function call(targetId, stream) {
        var _this3 = this;

        if (typeof targetId !== 'string') {
          throw new TypeError('target id is not a string');
        }
        if (!stream) {
          throw new TypeError('a MediaStream instance is required to make a call');
        }
        return this._imClient.ping([targetId]).then(function (onlineClients) {
          if (!onlineClients.length) {
            throw new Error('Call failed as ' + targetId + ' is not online');
          }
          var outgoingCall = new OutgoingCall(targetId, null, _this3.options.RTCConfiguration);
          var promise$$1 = new _Promise(function (resolve) {
            outgoingCall._peerConnection.onnegotiationneeded = resolve;
          });
          outgoingCall._peerConnection.addStream(stream);
          return promise$$1.then(function () {
            return _Promise.all([_this3._imClient.createConversation({
              members: [targetId],
              unique: true
            }), outgoingCall._peerConnection.createOffer().then(function (localDescription) {
              outgoingCall._peerConnection.setLocalDescription(localDescription);
            })]);
          }).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 1),
                conversation = _ref2[0];

            outgoingCall._setConversation(conversation);
            return conversation.send(new Offer(outgoingCall._peerConnection.localDescription));
          }).then(function () {
            return outgoingCall;
          });
        });
      };

      WebRTCClient.prototype._handleOffer = function _handleOffer(offer, conversation) {
        var incomingCall = new IncomingCall(offer, conversation, this.options.RTCConfiguration);
        /**
         * 收到其他用户的呼叫
         * @event WebRTCClient#call
         * @param {incomingCall} incomingCall 呼入通话
         */
        this.emit('call', incomingCall);
      };

      return WebRTCClient;
    }(eventemitter3);

    var name = "leancloud-realtime-plugin-webrtc";

    /* eslint-disable import/prefer-default-export */
    /** @module leancloud-realtime-plugin-webrtc */
    var messageClasses = [Offer, Answer, ICECandidate, Refusal, Cancelation];

    var onRealtimeCreate = function onRealtimeCreate(realtime) {
      /**
       * 创建一个 WebRTC 客户端，多次创建相同 id 的客户端会返回同一个实例。应用 WebRTC 插件后，Realtime 类会增加该实例方法。
       * WebRTC 客户端是单点登录的，既在同一时刻，同一个 id 只允许一个客户端在线，后登录的客户端会将原来在线上的客户端踢下线。
       * @function createWebRTCClient
       * @global
       * @param  {String} id 客户端 id
       * @param  {Object} [clientOptions] 详细参数 @see {@link IMClient}
       * @param  {Object} [clientOptions.RTCConfiguration] @see {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCConfiguration RTCConfiguration}
       * @return {Promise.<WebRTCClient>}
       */
      // eslint-disable-next-line no-param-reassign
      realtime.createWebRTCClient = function (id, clientOptions) {
        return new WebRTCClient(id)._open(realtime, clientOptions);
      };
    };

    /**
     * WebRTC 插件，使用后可通过 {@link createWebRTCClient Realtime#createWebRTCClient}
     * 创建 {@link WebRTCClient} 实现音视频通话
     * @example
     * var realtime = new Realtime({
     *   appId: appId,
     *   plugins: WebRTCPlugin,
     * });
     * realtime.createWebRTCClient(id);
     */
    var WebRTCPlugin = {
      name: name,
      messageClasses: messageClasses,
      onRealtimeCreate: onRealtimeCreate
    };

    /**
     * 当前浏览器是否支持 WebRTC 的标记
     * @type {Boolean}
     */
    var isWebRTCSupported = !!(window.RTCPeerConnection && window.RTCSessionDescription && window.RTCIceCandidate);

    exports.WebRTCPlugin = WebRTCPlugin;
    exports.isWebRTCSupported = isWebRTCSupported;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=webrtc.js.map