(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leancloud-storage'), require('leancloud-realtime')) :
    typeof define === 'function' && define.amd ? define('typed-messages', ['exports', 'leancloud-storage', 'leancloud-realtime'], factory) :
    (factory((global.AV = global.AV || {}),global.AV,global.AV));
}(this, (function (exports,leancloudStorage,leancloudRealtime) { 'use strict';

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
      ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
    if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
    });

    var _core = createCommonjsModule(function (module) {
    var core = module.exports = {version: '2.4.0'};
    if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
    });

    var _aFunction = function(it){
      if(typeof it != 'function')throw TypeError(it + ' is not a function!');
      return it;
    };

    // optional / simple context binding
    var aFunction = _aFunction;
    var _ctx = function(fn, that, length){
      aFunction(fn);
      if(that === undefined)return fn;
      switch(length){
        case 1: return function(a){
          return fn.call(that, a);
        };
        case 2: return function(a, b){
          return fn.call(that, a, b);
        };
        case 3: return function(a, b, c){
          return fn.call(that, a, b, c);
        };
      }
      return function(/* ...args */){
        return fn.apply(that, arguments);
      };
    };

    var _isObject = function(it){
      return typeof it === 'object' ? it !== null : typeof it === 'function';
    };

    var isObject = _isObject;
    var _anObject = function(it){
      if(!isObject(it))throw TypeError(it + ' is not an object!');
      return it;
    };

    var _fails = function(exec){
      try {
        return !!exec();
      } catch(e){
        return true;
      }
    };

    // Thank's IE8 for his funny defineProperty
    var _descriptors = !_fails(function(){
      return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
    });

    var isObject$1 = _isObject;
    var document = _global.document;
    var is = isObject$1(document) && isObject$1(document.createElement);
    var _domCreate = function(it){
      return is ? document.createElement(it) : {};
    };

    var _ie8DomDefine = !_descriptors && !_fails(function(){
      return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
    });

    // 7.1.1 ToPrimitive(input [, PreferredType])
    var isObject$2 = _isObject;
    // instead of the ES6 spec version, we didn't implement @@toPrimitive case
    // and the second argument - flag - preferred type is a string
    var _toPrimitive = function(it, S){
      if(!isObject$2(it))return it;
      var fn, val;
      if(S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
      if(typeof (fn = it.valueOf) == 'function' && !isObject$2(val = fn.call(it)))return val;
      if(!S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
      throw TypeError("Can't convert object to primitive value");
    };

    var anObject       = _anObject;
    var IE8_DOM_DEFINE = _ie8DomDefine;
    var toPrimitive    = _toPrimitive;
    var dP$1             = Object.defineProperty;

    var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
      anObject(O);
      P = toPrimitive(P, true);
      anObject(Attributes);
      if(IE8_DOM_DEFINE)try {
        return dP$1(O, P, Attributes);
      } catch(e){ /* empty */ }
      if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
      if('value' in Attributes)O[P] = Attributes.value;
      return O;
    };

    var _objectDp = {
    	f: f
    };

    var _propertyDesc = function(bitmap, value){
      return {
        enumerable  : !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable    : !(bitmap & 4),
        value       : value
      };
    };

    var dP         = _objectDp;
    var createDesc = _propertyDesc;
    var _hide = _descriptors ? function(object, key, value){
      return dP.f(object, key, createDesc(1, value));
    } : function(object, key, value){
      object[key] = value;
      return object;
    };

    var global$1    = _global;
    var core      = _core;
    var ctx       = _ctx;
    var hide      = _hide;
    var PROTOTYPE = 'prototype';

    var $export$1 = function(type, name, source){
      var IS_FORCED = type & $export$1.F
        , IS_GLOBAL = type & $export$1.G
        , IS_STATIC = type & $export$1.S
        , IS_PROTO  = type & $export$1.P
        , IS_BIND   = type & $export$1.B
        , IS_WRAP   = type & $export$1.W
        , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
        , expProto  = exports[PROTOTYPE]
        , target    = IS_GLOBAL ? global$1 : IS_STATIC ? global$1[name] : (global$1[name] || {})[PROTOTYPE]
        , key, own, out;
      if(IS_GLOBAL)source = name;
      for(key in source){
        // contains in native
        own = !IS_FORCED && target && target[key] !== undefined;
        if(own && key in exports)continue;
        // export native or passed
        out = own ? target[key] : source[key];
        // prevent global pollution for namespaces
        exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
        // bind timers to global for call from export context
        : IS_BIND && own ? ctx(out, global$1)
        // wrap global constructors for prevent change them in library
        : IS_WRAP && target[key] == out ? (function(C){
          var F = function(a, b, c){
            if(this instanceof C){
              switch(arguments.length){
                case 0: return new C;
                case 1: return new C(a);
                case 2: return new C(a, b);
              } return new C(a, b, c);
            } return C.apply(this, arguments);
          };
          F[PROTOTYPE] = C[PROTOTYPE];
          return F;
        // make static versions for prototype methods
        })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
        // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
        if(IS_PROTO){
          (exports.virtual || (exports.virtual = {}))[key] = out;
          // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
          if(type & $export$1.R && expProto && !expProto[key])hide(expProto, key, out);
        }
      }
    };
    // type bitmap
    $export$1.F = 1;   // forced
    $export$1.G = 2;   // global
    $export$1.S = 4;   // static
    $export$1.P = 8;   // proto
    $export$1.B = 16;  // bind
    $export$1.W = 32;  // wrap
    $export$1.U = 64;  // safe
    $export$1.R = 128; // real proto method for `library` 
    var _export = $export$1;

    var hasOwnProperty = {}.hasOwnProperty;
    var _has = function(it, key){
      return hasOwnProperty.call(it, key);
    };

    var toString = {}.toString;

    var _cof = function(it){
      return toString.call(it).slice(8, -1);
    };

    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    var cof = _cof;
    var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
      return cof(it) == 'String' ? it.split('') : Object(it);
    };

    // 7.2.1 RequireObjectCoercible(argument)
    var _defined = function(it){
      if(it == undefined)throw TypeError("Can't call method on  " + it);
      return it;
    };

    // to indexed object, toObject with fallback for non-array-like ES3 strings
    var IObject$1 = _iobject;
    var defined = _defined;
    var _toIobject = function(it){
      return IObject$1(defined(it));
    };

    // 7.1.4 ToInteger
    var ceil  = Math.ceil;
    var floor = Math.floor;
    var _toInteger = function(it){
      return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };

    // 7.1.15 ToLength
    var toInteger = _toInteger;
    var min       = Math.min;
    var _toLength = function(it){
      return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
    };

    var toInteger$1 = _toInteger;
    var max       = Math.max;
    var min$1       = Math.min;
    var _toIndex = function(index, length){
      index = toInteger$1(index);
      return index < 0 ? max(index + length, 0) : min$1(index, length);
    };

    // false -> Array#indexOf
    // true  -> Array#includes
    var toIObject$1 = _toIobject;
    var toLength  = _toLength;
    var toIndex   = _toIndex;
    var _arrayIncludes = function(IS_INCLUDES){
      return function($this, el, fromIndex){
        var O      = toIObject$1($this)
          , length = toLength(O.length)
          , index  = toIndex(fromIndex, length)
          , value;
        // Array#includes uses SameValueZero equality algorithm
        if(IS_INCLUDES && el != el)while(length > index){
          value = O[index++];
          if(value != value)return true;
        // Array#toIndex ignores holes, Array#includes - not
        } else for(;length > index; index++)if(IS_INCLUDES || index in O){
          if(O[index] === el)return IS_INCLUDES || index || 0;
        } return !IS_INCLUDES && -1;
      };
    };

    var global$2 = _global;
    var SHARED = '__core-js_shared__';
    var store  = global$2[SHARED] || (global$2[SHARED] = {});
    var _shared = function(key){
      return store[key] || (store[key] = {});
    };

    var id = 0;
    var px = Math.random();
    var _uid = function(key){
      return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
    };

    var shared = _shared('keys');
    var uid    = _uid;
    var _sharedKey = function(key){
      return shared[key] || (shared[key] = uid(key));
    };

    var has          = _has;
    var toIObject    = _toIobject;
    var arrayIndexOf = _arrayIncludes(false);
    var IE_PROTO     = _sharedKey('IE_PROTO');

    var _objectKeysInternal = function(object, names){
      var O      = toIObject(object)
        , i      = 0
        , result = []
        , key;
      for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
      // Don't enum bug & hidden keys
      while(names.length > i)if(has(O, key = names[i++])){
        ~arrayIndexOf(result, key) || result.push(key);
      }
      return result;
    };

    // IE 8- don't enum bug keys
    var _enumBugKeys = (
      'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
    ).split(',');

    // 19.1.2.14 / 15.2.3.14 Object.keys(O)
    var $keys       = _objectKeysInternal;
    var enumBugKeys = _enumBugKeys;

    var _objectKeys = Object.keys || function keys(O){
      return $keys(O, enumBugKeys);
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
    var defined$1 = _defined;
    var _toObject = function(it){
      return Object(defined$1(it));
    };

    // 19.1.2.1 Object.assign(target, source, ...)
    var getKeys  = _objectKeys;
    var gOPS     = _objectGops;
    var pIE      = _objectPie;
    var toObject = _toObject;
    var IObject  = _iobject;
    var $assign  = Object.assign;

    // should work with symbols and should have deterministic property order (V8 bug)
    var _objectAssign = !$assign || _fails(function(){
      var A = {}
        , B = {}
        , S = Symbol()
        , K = 'abcdefghijklmnopqrst';
      A[S] = 7;
      K.split('').forEach(function(k){ B[k] = k; });
      return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
    }) ? function assign(target, source){ // eslint-disable-line no-unused-vars
      var T     = toObject(target)
        , aLen  = arguments.length
        , index = 1
        , getSymbols = gOPS.f
        , isEnum     = pIE.f;
      while(aLen > index){
        var S      = IObject(arguments[index++])
          , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
          , length = keys.length
          , j      = 0
          , key;
        while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
      } return T;
    } : $assign;

    // 19.1.3.1 Object.assign(target, source)
    var $export = _export;

    $export($export.S + $export.F, 'Object', {assign: _objectAssign});

    var assign$1 = _core.Object.assign;

    var assign = createCommonjsModule(function (module) {
    module.exports = { "default": assign$1, __esModule: true };
    });

    var _Object$assign = unwrapExports(assign);

    var inherit$1 = createCommonjsModule(function (module, exports) {
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

    var index$1 = inherit$1;

    /* eslint-disable import/no-unresolved */
    if (!leancloudStorage.File) {
      throw new Error('LeanCloud Storage SDK not installed');
    }

    /* eslint-disable import/no-unresolved */
    if (!leancloudRealtime.TypedMessage) {
      throw new Error('LeanCloud Realtime SDK not installed');
    }

    var FileMessage = index$1(leancloudRealtime.TypedMessage, /** @lends FileMessage.prototype */{
      /**
       * @constructs
       * @extends TypedMessage
       * @param  {AV.File} file LeanCloud 存储 SDK 中的 AV.File 实例，且必须是已经保存到服务端上的 File 实例
       * （如果是刚刚创建的，必须 save 后才能用于创建 FileMessage）
       */
      __constructor: function __constructor(file) {
        if (!(file instanceof leancloudStorage.File)) {
          throw new TypeError('file must be an AV.File');
        }
        if (typeof file.id !== 'string') {
          throw new Error('file must be saved before used to create a Message');
        }
        this.__base();
        this._file = file;
        this._lcfile = {
          objId: file.id,
          url: file.url(),
          metaData: _Object$assign(file.metaData() || {}, {
            name: file.name()
          })
        };
      },

      /**
       * 获得 file 对象
       * @return {AV.File}
       */
      getFile: function getFile() {
        return this._file;
      }
    }, {
      _parseFileFromRawData: function _parseFileFromRawData(data) {
        if (!(data && data._lcfile)) {
          throw new Error('malformed FileMessage content');
        }
        var id = data._lcfile.objId;
        if (typeof id !== 'string') {
          id = '';
        }
        var file = leancloudStorage.File.createWithoutData(id);
        file.attributes = file.attributes || {};
        file._url = file.attributes.url = data._lcfile.url;
        file._metaData = file.attributes.metaData = data._lcfile.metaData || {};
        if (data._lcfile.metaData) {
          file._name = file.attributes.name = data._lcfile.metaData.name;
        }
        return file;
      },
      parse: function parse(json, message) {
        var file = this._parseFileFromRawData(json);
        return this.__base(json, message || new this(file));
      }
    });

    /**
     * @name TYPE
     * @memberof FileMessage
     * @type Number
     * @static
     * @const
     */
    leancloudRealtime.messageType(-6)(FileMessage);
    leancloudRealtime.messageField('_lcfile')(FileMessage);

    /**
     * 构造方法参数同 {@link FileMessage}
     * @class
     * @extends FileMessage
     */
    var ImageMessage = index$1(FileMessage);

    /**
     * @name TYPE
     * @memberof ImageMessage
     * @type Number
     * @static
     * @const
     */
    leancloudRealtime.messageType(-2)(ImageMessage);

    /**
     * 构造方法参数同 {@link FileMessage}
     * @class
     * @extends FileMessage
     */
    var AudioMessage = index$1(FileMessage);

    /**
     * @name TYPE
     * @memberof AudioMessage
     * @type Number
     * @static
     * @const
     */
    leancloudRealtime.messageType(-3)(AudioMessage);

    /**
     * 构造方法参数同 {@link FileMessage}
     * @class
     * @extends FileMessage
     */
    var VideoMessage = index$1(FileMessage);

    /**
     * @name TYPE
     * @memberof VideoMessage
     * @type Number
     * @static
     * @const
     */
    leancloudRealtime.messageType(-4)(VideoMessage);

    var LocationMessage = index$1(leancloudRealtime.TypedMessage, /** @lends LocationMessage.prototype */{
      /**
       * @constructs
       * @extends TypedMessage
       * @param  {AV.GeoPoint} geoPoint LeanCloud 存储 SDK 中的 AV.GeoPoint 实例
       */
      __constructor: function __constructor(geoPoint) {
        if (!(geoPoint instanceof leancloudStorage.GeoPoint)) {
          throw new TypeError('geoPoint must be an AV.GeoPoint');
        }
        this.__base();
        this._geoPoint = geoPoint;
        var latitude = geoPoint.latitude,
            longitude = geoPoint.longitude;

        this._lcloc = { latitude: latitude, longitude: longitude };
      },

      /**
       * 获得 geoPoint 对象
       * @return {AV.GeoPoint}
       */
      getLocation: function getLocation() {
        return this._geoPoint;
      }
    }, {
      parse: function parse(json, message) {
        var _json$_lcloc = json._lcloc,
            latitude = _json$_lcloc.latitude,
            longitude = _json$_lcloc.longitude;

        var geoPoint = new leancloudStorage.GeoPoint({ latitude: latitude, longitude: longitude });
        return this.__base(json, message || new this(geoPoint));
      }
    });

    /**
     * @name TYPE
     * @memberof LocationMessage
     * @type Number
     * @static
     * @const
     */
    leancloudRealtime.messageType(-5)(LocationMessage);
    leancloudRealtime.messageField('_lcloc')(LocationMessage);

    var name = "leancloud-realtime-plugin-typed-messages";

    /** @module leancloud-realtime-plugin-typed-messages */

    /**
     * TypedMessages 插件，使用后可支持接收 LeanCloud 提供的富媒体类型的消息
     * @example
     * var realtime = new Realtime({
     *   appId: appId,
     *   plugins: TypedMessagesPlugin,
     * });
     */
    var TypedMessagesPlugin = {
      name: name,
      messageClasses: [FileMessage, ImageMessage, AudioMessage, VideoMessage, LocationMessage]
    };

    exports.TypedMessagesPlugin = TypedMessagesPlugin;
    exports.FileMessage = FileMessage;
    exports.ImageMessage = ImageMessage;
    exports.AudioMessage = AudioMessage;
    exports.VideoMessage = VideoMessage;
    exports.LocationMessage = LocationMessage;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=typed-messages.js.map