(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leancloud-realtime')) :
    typeof define === 'function' && define.amd ? define('webrtc', ['exports', 'leancloud-realtime'], factory) :
    (factory((global.AV = global.AV || {}),global.AV));
}(this, function (exports,leancloudRealtime) { 'use strict';

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

    function interopDefault(ex) {
    	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var _addToUnscopables = createCommonjsModule(function (module) {
    module.exports = function(){ /* empty */ };
    });

    var _addToUnscopables$1 = interopDefault(_addToUnscopables);


    var require$$4 = Object.freeze({
    	default: _addToUnscopables$1
    });

    var _iterStep = createCommonjsModule(function (module) {
    module.exports = function(done, value){
      return {value: value, done: !!done};
    };
    });

    var _iterStep$1 = interopDefault(_iterStep);


    var require$$3 = Object.freeze({
      default: _iterStep$1
    });

    var _iterators = createCommonjsModule(function (module) {
    module.exports = {};
    });

    var _iterators$1 = interopDefault(_iterators);


    var require$$1$1 = Object.freeze({
    	default: _iterators$1
    });

    var _cof = createCommonjsModule(function (module) {
    var toString = {}.toString;

    module.exports = function(it){
      return toString.call(it).slice(8, -1);
    };
    });

    var _cof$1 = interopDefault(_cof);


    var require$$0$1 = Object.freeze({
      default: _cof$1
    });

    var _iobject = createCommonjsModule(function (module) {
    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    var cof = interopDefault(require$$0$1);
    module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
      return cof(it) == 'String' ? it.split('') : Object(it);
    };
    });

    var _iobject$1 = interopDefault(_iobject);


    var require$$1$2 = Object.freeze({
      default: _iobject$1
    });

    var _defined = createCommonjsModule(function (module) {
    // 7.2.1 RequireObjectCoercible(argument)
    module.exports = function(it){
      if(it == undefined)throw TypeError("Can't call method on  " + it);
      return it;
    };
    });

    var _defined$1 = interopDefault(_defined);


    var require$$0$2 = Object.freeze({
      default: _defined$1
    });

    var _toIobject = createCommonjsModule(function (module) {
    // to indexed object, toObject with fallback for non-array-like ES3 strings
    var IObject = interopDefault(require$$1$2)
      , defined = interopDefault(require$$0$2);
    module.exports = function(it){
      return IObject(defined(it));
    };
    });

    var _toIobject$1 = interopDefault(_toIobject);


    var require$$4$1 = Object.freeze({
      default: _toIobject$1
    });

    var _library = createCommonjsModule(function (module) {
    module.exports = true;
    });

    var _library$1 = interopDefault(_library);


    var require$$2 = Object.freeze({
    	default: _library$1
    });

    var _global = createCommonjsModule(function (module) {
    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global = module.exports = typeof window != 'undefined' && window.Math == Math
      ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
    if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
    });

    var _global$1 = interopDefault(_global);


    var require$$4$2 = Object.freeze({
      default: _global$1
    });

    var _core = createCommonjsModule(function (module) {
    var core = module.exports = {version: '2.4.0'};
    if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
    });

    var _core$1 = interopDefault(_core);
    var version = _core.version;

var require$$0$4 = Object.freeze({
    	default: _core$1,
    	version: version
    });

    var _aFunction = createCommonjsModule(function (module) {
    module.exports = function(it){
      if(typeof it != 'function')throw TypeError(it + ' is not a function!');
      return it;
    };
    });

    var _aFunction$1 = interopDefault(_aFunction);


    var require$$1$4 = Object.freeze({
      default: _aFunction$1
    });

    var _ctx = createCommonjsModule(function (module) {
    // optional / simple context binding
    var aFunction = interopDefault(require$$1$4);
    module.exports = function(fn, that, length){
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
    });

    var _ctx$1 = interopDefault(_ctx);


    var require$$1$3 = Object.freeze({
      default: _ctx$1
    });

    var _isObject = createCommonjsModule(function (module) {
    module.exports = function(it){
      return typeof it === 'object' ? it !== null : typeof it === 'function';
    };
    });

    var _isObject$1 = interopDefault(_isObject);


    var require$$3$1 = Object.freeze({
      default: _isObject$1
    });

    var _anObject = createCommonjsModule(function (module) {
    var isObject = interopDefault(require$$3$1);
    module.exports = function(it){
      if(!isObject(it))throw TypeError(it + ' is not an object!');
      return it;
    };
    });

    var _anObject$1 = interopDefault(_anObject);


    var require$$2$2 = Object.freeze({
      default: _anObject$1
    });

    var _fails = createCommonjsModule(function (module) {
    module.exports = function(exec){
      try {
        return !!exec();
      } catch(e){
        return true;
      }
    };
    });

    var _fails$1 = interopDefault(_fails);


    var require$$0$7 = Object.freeze({
      default: _fails$1
    });

    var _descriptors = createCommonjsModule(function (module) {
    // Thank's IE8 for his funny defineProperty
    module.exports = !interopDefault(require$$0$7)(function(){
      return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
    });
    });

    var _descriptors$1 = interopDefault(_descriptors);


    var require$$1$6 = Object.freeze({
      default: _descriptors$1
    });

    var _domCreate = createCommonjsModule(function (module) {
    var isObject = interopDefault(require$$3$1)
      , document = interopDefault(require$$4$2).document
      // in old IE typeof document.createElement is 'object'
      , is = isObject(document) && isObject(document.createElement);
    module.exports = function(it){
      return is ? document.createElement(it) : {};
    };
    });

    var _domCreate$1 = interopDefault(_domCreate);


    var require$$2$3 = Object.freeze({
      default: _domCreate$1
    });

    var _ie8DomDefine = createCommonjsModule(function (module) {
    module.exports = !interopDefault(require$$1$6) && !interopDefault(require$$0$7)(function(){
      return Object.defineProperty(interopDefault(require$$2$3)('div'), 'a', {get: function(){ return 7; }}).a != 7;
    });
    });

    var _ie8DomDefine$1 = interopDefault(_ie8DomDefine);


    var require$$1$5 = Object.freeze({
      default: _ie8DomDefine$1
    });

    var _toPrimitive = createCommonjsModule(function (module) {
    // 7.1.1 ToPrimitive(input [, PreferredType])
    var isObject = interopDefault(require$$3$1);
    // instead of the ES6 spec version, we didn't implement @@toPrimitive case
    // and the second argument - flag - preferred type is a string
    module.exports = function(it, S){
      if(!isObject(it))return it;
      var fn, val;
      if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
      if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
      if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
      throw TypeError("Can't convert object to primitive value");
    };
    });

    var _toPrimitive$1 = interopDefault(_toPrimitive);


    var require$$3$2 = Object.freeze({
      default: _toPrimitive$1
    });

    var _objectDp = createCommonjsModule(function (module, exports) {
    var anObject       = interopDefault(require$$2$2)
      , IE8_DOM_DEFINE = interopDefault(require$$1$5)
      , toPrimitive    = interopDefault(require$$3$2)
      , dP             = Object.defineProperty;

    exports.f = interopDefault(require$$1$6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
      anObject(O);
      P = toPrimitive(P, true);
      anObject(Attributes);
      if(IE8_DOM_DEFINE)try {
        return dP(O, P, Attributes);
      } catch(e){ /* empty */ }
      if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
      if('value' in Attributes)O[P] = Attributes.value;
      return O;
    };
    });

    var _objectDp$1 = interopDefault(_objectDp);
    var f = _objectDp.f;

var require$$0$6 = Object.freeze({
      default: _objectDp$1,
      f: f
    });

    var _propertyDesc = createCommonjsModule(function (module) {
    module.exports = function(bitmap, value){
      return {
        enumerable  : !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable    : !(bitmap & 4),
        value       : value
      };
    };
    });

    var _propertyDesc$1 = interopDefault(_propertyDesc);


    var require$$5 = Object.freeze({
      default: _propertyDesc$1
    });

    var _hide = createCommonjsModule(function (module) {
    var dP         = interopDefault(require$$0$6)
      , createDesc = interopDefault(require$$5);
    module.exports = interopDefault(require$$1$6) ? function(object, key, value){
      return dP.f(object, key, createDesc(1, value));
    } : function(object, key, value){
      object[key] = value;
      return object;
    };
    });

    var _hide$1 = interopDefault(_hide);


    var require$$0$5 = Object.freeze({
      default: _hide$1
    });

    var _export = createCommonjsModule(function (module) {
    var global    = interopDefault(require$$4$2)
      , core      = interopDefault(require$$0$4)
      , ctx       = interopDefault(require$$1$3)
      , hide      = interopDefault(require$$0$5)
      , PROTOTYPE = 'prototype';

    var $export = function(type, name, source){
      var IS_FORCED = type & $export.F
        , IS_GLOBAL = type & $export.G
        , IS_STATIC = type & $export.S
        , IS_PROTO  = type & $export.P
        , IS_BIND   = type & $export.B
        , IS_WRAP   = type & $export.W
        , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
        , expProto  = exports[PROTOTYPE]
        , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
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
        : IS_BIND && own ? ctx(out, global)
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
          if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
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
    module.exports = $export;
    });

    var _export$1 = interopDefault(_export);


    var require$$2$1 = Object.freeze({
      default: _export$1
    });

    var _redefine = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$0$5);
    });

    var _redefine$1 = interopDefault(_redefine);


    var require$$25 = Object.freeze({
    	default: _redefine$1
    });

    var _has = createCommonjsModule(function (module) {
    var hasOwnProperty = {}.hasOwnProperty;
    module.exports = function(it, key){
      return hasOwnProperty.call(it, key);
    };
    });

    var _has$1 = interopDefault(_has);


    var require$$2$4 = Object.freeze({
      default: _has$1
    });

    var _toInteger = createCommonjsModule(function (module) {
    // 7.1.4 ToInteger
    var ceil  = Math.ceil
      , floor = Math.floor;
    module.exports = function(it){
      return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };
    });

    var _toInteger$1 = interopDefault(_toInteger);


    var require$$1$10 = Object.freeze({
      default: _toInteger$1
    });

    var _toLength = createCommonjsModule(function (module) {
    // 7.1.15 ToLength
    var toInteger = interopDefault(require$$1$10)
      , min       = Math.min;
    module.exports = function(it){
      return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
    };
    });

    var _toLength$1 = interopDefault(_toLength);


    var require$$1$9 = Object.freeze({
      default: _toLength$1
    });

    var _toIndex = createCommonjsModule(function (module) {
    var toInteger = interopDefault(require$$1$10)
      , max       = Math.max
      , min       = Math.min;
    module.exports = function(index, length){
      index = toInteger(index);
      return index < 0 ? max(index + length, 0) : min(index, length);
    };
    });

    var _toIndex$1 = interopDefault(_toIndex);


    var require$$0$9 = Object.freeze({
      default: _toIndex$1
    });

    var _arrayIncludes = createCommonjsModule(function (module) {
    // false -> Array#indexOf
    // true  -> Array#includes
    var toIObject = interopDefault(require$$4$1)
      , toLength  = interopDefault(require$$1$9)
      , toIndex   = interopDefault(require$$0$9);
    module.exports = function(IS_INCLUDES){
      return function($this, el, fromIndex){
        var O      = toIObject($this)
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
    });

    var _arrayIncludes$1 = interopDefault(_arrayIncludes);


    var require$$1$8 = Object.freeze({
      default: _arrayIncludes$1
    });

    var _shared = createCommonjsModule(function (module) {
    var global = interopDefault(require$$4$2)
      , SHARED = '__core-js_shared__'
      , store  = global[SHARED] || (global[SHARED] = {});
    module.exports = function(key){
      return store[key] || (store[key] = {});
    };
    });

    var _shared$1 = interopDefault(_shared);


    var require$$22 = Object.freeze({
      default: _shared$1
    });

    var _uid = createCommonjsModule(function (module) {
    var id = 0
      , px = Math.random();
    module.exports = function(key){
      return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
    };
    });

    var _uid$1 = interopDefault(_uid);


    var require$$4$4 = Object.freeze({
      default: _uid$1
    });

    var _sharedKey = createCommonjsModule(function (module) {
    var shared = interopDefault(require$$22)('keys')
      , uid    = interopDefault(require$$4$4);
    module.exports = function(key){
      return shared[key] || (shared[key] = uid(key));
    };
    });

    var _sharedKey$1 = interopDefault(_sharedKey);


    var require$$0$10 = Object.freeze({
      default: _sharedKey$1
    });

    var _objectKeysInternal = createCommonjsModule(function (module) {
    var has          = interopDefault(require$$2$4)
      , toIObject    = interopDefault(require$$4$1)
      , arrayIndexOf = interopDefault(require$$1$8)(false)
      , IE_PROTO     = interopDefault(require$$0$10)('IE_PROTO');

    module.exports = function(object, names){
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
    });

    var _objectKeysInternal$1 = interopDefault(_objectKeysInternal);


    var require$$1$7 = Object.freeze({
      default: _objectKeysInternal$1
    });

    var _enumBugKeys = createCommonjsModule(function (module) {
    // IE 8- don't enum bug keys
    module.exports = (
      'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
    ).split(',');
    });

    var _enumBugKeys$1 = interopDefault(_enumBugKeys);


    var require$$0$11 = Object.freeze({
      default: _enumBugKeys$1
    });

    var _objectKeys = createCommonjsModule(function (module) {
    // 19.1.2.14 / 15.2.3.14 Object.keys(O)
    var $keys       = interopDefault(require$$1$7)
      , enumBugKeys = interopDefault(require$$0$11);

    module.exports = Object.keys || function keys(O){
      return $keys(O, enumBugKeys);
    };
    });

    var _objectKeys$1 = interopDefault(_objectKeys);


    var require$$2$5 = Object.freeze({
      default: _objectKeys$1
    });

    var _objectDps = createCommonjsModule(function (module) {
    var dP       = interopDefault(require$$0$6)
      , anObject = interopDefault(require$$2$2)
      , getKeys  = interopDefault(require$$2$5);

    module.exports = interopDefault(require$$1$6) ? Object.defineProperties : function defineProperties(O, Properties){
      anObject(O);
      var keys   = getKeys(Properties)
        , length = keys.length
        , i = 0
        , P;
      while(length > i)dP.f(O, P = keys[i++], Properties[P]);
      return O;
    };
    });

    var _objectDps$1 = interopDefault(_objectDps);


    var require$$4$3 = Object.freeze({
      default: _objectDps$1
    });

    var _html = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$4$2).document && document.documentElement;
    });

    var _html$1 = interopDefault(_html);


    var require$$3$4 = Object.freeze({
    	default: _html$1
    });

    var _objectCreate = createCommonjsModule(function (module) {
    // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
    var anObject    = interopDefault(require$$2$2)
      , dPs         = interopDefault(require$$4$3)
      , enumBugKeys = interopDefault(require$$0$11)
      , IE_PROTO    = interopDefault(require$$0$10)('IE_PROTO')
      , Empty       = function(){ /* empty */ }
      , PROTOTYPE   = 'prototype';

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    var createDict = function(){
      // Thrash, waste and sodomy: IE GC bug
      var iframe = interopDefault(require$$2$3)('iframe')
        , i      = enumBugKeys.length
        , lt     = '<'
        , gt     = '>'
        , iframeDocument;
      iframe.style.display = 'none';
      interopDefault(require$$3$4).appendChild(iframe);
      iframe.src = 'javascript:'; // eslint-disable-line no-script-url
      // createDict = iframe.contentWindow.Object;
      // html.removeChild(iframe);
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
      iframeDocument.close();
      createDict = iframeDocument.F;
      while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
      return createDict();
    };

    module.exports = Object.create || function create(O, Properties){
      var result;
      if(O !== null){
        Empty[PROTOTYPE] = anObject(O);
        result = new Empty;
        Empty[PROTOTYPE] = null;
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO] = O;
      } else result = createDict();
      return Properties === undefined ? result : dPs(result, Properties);
    };
    });

    var _objectCreate$1 = interopDefault(_objectCreate);


    var require$$0$8 = Object.freeze({
      default: _objectCreate$1
    });

    var _wks = createCommonjsModule(function (module) {
    var store      = interopDefault(require$$22)('wks')
      , uid        = interopDefault(require$$4$4)
      , Symbol     = interopDefault(require$$4$2).Symbol
      , USE_SYMBOL = typeof Symbol == 'function';

    var $exports = module.exports = function(name){
      return store[name] || (store[name] =
        USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
    };

    $exports.store = store;
    });

    var _wks$1 = interopDefault(_wks);


    var require$$19 = Object.freeze({
      default: _wks$1
    });

    var _setToStringTag = createCommonjsModule(function (module) {
    var def = interopDefault(require$$0$6).f
      , has = interopDefault(require$$2$4)
      , TAG = interopDefault(require$$19)('toStringTag');

    module.exports = function(it, tag, stat){
      if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
    };
    });

    var _setToStringTag$1 = interopDefault(_setToStringTag);


    var require$$21 = Object.freeze({
      default: _setToStringTag$1
    });

    var _iterCreate = createCommonjsModule(function (module) {
    'use strict';
    var create         = interopDefault(require$$0$8)
      , descriptor     = interopDefault(require$$5)
      , setToStringTag = interopDefault(require$$21)
      , IteratorPrototype = {};

    // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
    interopDefault(require$$0$5)(IteratorPrototype, interopDefault(require$$19)('iterator'), function(){ return this; });

    module.exports = function(Constructor, NAME, next){
      Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
      setToStringTag(Constructor, NAME + ' Iterator');
    };
    });

    var _iterCreate$1 = interopDefault(_iterCreate);


    var require$$3$3 = Object.freeze({
      default: _iterCreate$1
    });

    var _toObject = createCommonjsModule(function (module) {
    // 7.1.13 ToObject(argument)
    var defined = interopDefault(require$$0$2);
    module.exports = function(it){
      return Object(defined(it));
    };
    });

    var _toObject$1 = interopDefault(_toObject);


    var require$$2$6 = Object.freeze({
      default: _toObject$1
    });

    var _objectGpo = createCommonjsModule(function (module) {
    // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
    var has         = interopDefault(require$$2$4)
      , toObject    = interopDefault(require$$2$6)
      , IE_PROTO    = interopDefault(require$$0$10)('IE_PROTO')
      , ObjectProto = Object.prototype;

    module.exports = Object.getPrototypeOf || function(O){
      O = toObject(O);
      if(has(O, IE_PROTO))return O[IE_PROTO];
      if(typeof O.constructor == 'function' && O instanceof O.constructor){
        return O.constructor.prototype;
      } return O instanceof Object ? ObjectProto : null;
    };
    });

    var _objectGpo$1 = interopDefault(_objectGpo);


    var require$$1$11 = Object.freeze({
      default: _objectGpo$1
    });

    var _iterDefine = createCommonjsModule(function (module) {
    'use strict';
    var LIBRARY        = interopDefault(require$$2)
      , $export        = interopDefault(require$$2$1)
      , redefine       = interopDefault(require$$25)
      , hide           = interopDefault(require$$0$5)
      , has            = interopDefault(require$$2$4)
      , Iterators      = interopDefault(require$$1$1)
      , $iterCreate    = interopDefault(require$$3$3)
      , setToStringTag = interopDefault(require$$21)
      , getPrototypeOf = interopDefault(require$$1$11)
      , ITERATOR       = interopDefault(require$$19)('iterator')
      , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
      , FF_ITERATOR    = '@@iterator'
      , KEYS           = 'keys'
      , VALUES         = 'values';

    var returnThis = function(){ return this; };

    module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
      $iterCreate(Constructor, NAME, next);
      var getMethod = function(kind){
        if(!BUGGY && kind in proto)return proto[kind];
        switch(kind){
          case KEYS: return function keys(){ return new Constructor(this, kind); };
          case VALUES: return function values(){ return new Constructor(this, kind); };
        } return function entries(){ return new Constructor(this, kind); };
      };
      var TAG        = NAME + ' Iterator'
        , DEF_VALUES = DEFAULT == VALUES
        , VALUES_BUG = false
        , proto      = Base.prototype
        , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
        , $default   = $native || getMethod(DEFAULT)
        , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
        , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
        , methods, key, IteratorPrototype;
      // Fix native
      if($anyNative){
        IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
        if(IteratorPrototype !== Object.prototype){
          // Set @@toStringTag to native iterators
          setToStringTag(IteratorPrototype, TAG, true);
          // fix for some old engines
          if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
        }
      }
      // fix Array#{values, @@iterator}.name in V8 / FF
      if(DEF_VALUES && $native && $native.name !== VALUES){
        VALUES_BUG = true;
        $default = function values(){ return $native.call(this); };
      }
      // Define iterator
      if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
        hide(proto, ITERATOR, $default);
      }
      // Plug for library
      Iterators[NAME] = $default;
      Iterators[TAG]  = returnThis;
      if(DEFAULT){
        methods = {
          values:  DEF_VALUES ? $default : getMethod(VALUES),
          keys:    IS_SET     ? $default : getMethod(KEYS),
          entries: $entries
        };
        if(FORCED)for(key in methods){
          if(!(key in proto))redefine(proto, key, methods[key]);
        } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
      }
      return methods;
    };
    });

    var _iterDefine$1 = interopDefault(_iterDefine);


    var require$$0$3 = Object.freeze({
      default: _iterDefine$1
    });

    var es6_array_iterator = createCommonjsModule(function (module) {
    'use strict';
    var addToUnscopables = interopDefault(require$$4)
      , step             = interopDefault(require$$3)
      , Iterators        = interopDefault(require$$1$1)
      , toIObject        = interopDefault(require$$4$1);

    // 22.1.3.4 Array.prototype.entries()
    // 22.1.3.13 Array.prototype.keys()
    // 22.1.3.29 Array.prototype.values()
    // 22.1.3.30 Array.prototype[@@iterator]()
    module.exports = interopDefault(require$$0$3)(Array, 'Array', function(iterated, kind){
      this._t = toIObject(iterated); // target
      this._i = 0;                   // next index
      this._k = kind;                // kind
    // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
    }, function(){
      var O     = this._t
        , kind  = this._k
        , index = this._i++;
      if(!O || index >= O.length){
        this._t = undefined;
        return step(1);
      }
      if(kind == 'keys'  )return step(0, index);
      if(kind == 'values')return step(0, O[index]);
      return step(0, [index, O[index]]);
    }, 'values');

    // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
    Iterators.Arguments = Iterators.Array;

    addToUnscopables('keys');
    addToUnscopables('values');
    addToUnscopables('entries');
    });

    interopDefault(es6_array_iterator);

    var web_dom_iterable = createCommonjsModule(function (module) {
    var global        = interopDefault(require$$4$2)
      , hide          = interopDefault(require$$0$5)
      , Iterators     = interopDefault(require$$1$1)
      , TO_STRING_TAG = interopDefault(require$$19)('toStringTag');

    for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
      var NAME       = collections[i]
        , Collection = global[NAME]
        , proto      = Collection && Collection.prototype;
      if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
      Iterators[NAME] = Iterators.Array;
    }
    });

    interopDefault(web_dom_iterable);

    var _stringAt = createCommonjsModule(function (module) {
    var toInteger = interopDefault(require$$1$10)
      , defined   = interopDefault(require$$0$2);
    // true  -> String#at
    // false -> String#codePointAt
    module.exports = function(TO_STRING){
      return function(that, pos){
        var s = String(defined(that))
          , i = toInteger(pos)
          , l = s.length
          , a, b;
        if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
        a = s.charCodeAt(i);
        return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
          ? TO_STRING ? s.charAt(i) : a
          : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
      };
    };
    });

    var _stringAt$1 = interopDefault(_stringAt);


    var require$$1$12 = Object.freeze({
      default: _stringAt$1
    });

    var es6_string_iterator = createCommonjsModule(function (module) {
    'use strict';
    var $at  = interopDefault(require$$1$12)(true);

    // 21.1.3.27 String.prototype[@@iterator]()
    interopDefault(require$$0$3)(String, 'String', function(iterated){
      this._t = String(iterated); // target
      this._i = 0;                // next index
    // 21.1.5.2.1 %StringIteratorPrototype%.next()
    }, function(){
      var O     = this._t
        , index = this._i
        , point;
      if(index >= O.length)return {value: undefined, done: true};
      point = $at(O, index);
      this._i += point.length;
      return {value: point, done: false};
    });
    });

    interopDefault(es6_string_iterator);

    var _classof = createCommonjsModule(function (module) {
    // getting tag from 19.1.3.6 Object.prototype.toString()
    var cof = interopDefault(require$$0$1)
      , TAG = interopDefault(require$$19)('toStringTag')
      // ES3 wrong here
      , ARG = cof(function(){ return arguments; }()) == 'Arguments';

    // fallback for IE11 Script Access Denied error
    var tryGet = function(it, key){
      try {
        return it[key];
      } catch(e){ /* empty */ }
    };

    module.exports = function(it){
      var O, T, B;
      return it === undefined ? 'Undefined' : it === null ? 'Null'
        // @@toStringTag case
        : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
        // builtinTag case
        : ARG ? cof(O)
        // ES3 arguments fallback
        : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
    };
    });

    var _classof$1 = interopDefault(_classof);


    var require$$14 = Object.freeze({
      default: _classof$1
    });

    var core_isIterable = createCommonjsModule(function (module) {
    var classof   = interopDefault(require$$14)
      , ITERATOR  = interopDefault(require$$19)('iterator')
      , Iterators = interopDefault(require$$1$1);
    module.exports = interopDefault(require$$0$4).isIterable = function(it){
      var O = Object(it);
      return O[ITERATOR] !== undefined
        || '@@iterator' in O
        || Iterators.hasOwnProperty(classof(O));
    };
    });

    var core_isIterable$1 = interopDefault(core_isIterable);


    var require$$0$12 = Object.freeze({
      default: core_isIterable$1
    });

    var isIterable$2 = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$0$12);
    });

    var isIterable$3 = interopDefault(isIterable$2);


    var require$$0 = Object.freeze({
    	default: isIterable$3
    });

    var isIterable = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0), __esModule: true };
    });

    var isIterable$1 = interopDefault(isIterable);


    var require$$1 = Object.freeze({
    	default: isIterable$1
    });

    var core_getIteratorMethod = createCommonjsModule(function (module) {
    var classof   = interopDefault(require$$14)
      , ITERATOR  = interopDefault(require$$19)('iterator')
      , Iterators = interopDefault(require$$1$1);
    module.exports = interopDefault(require$$0$4).getIteratorMethod = function(it){
      if(it != undefined)return it[ITERATOR]
        || it['@@iterator']
        || Iterators[classof(it)];
    };
    });

    var core_getIteratorMethod$1 = interopDefault(core_getIteratorMethod);


    var require$$0$16 = Object.freeze({
      default: core_getIteratorMethod$1
    });

    var core_getIterator = createCommonjsModule(function (module) {
    var anObject = interopDefault(require$$2$2)
      , get      = interopDefault(require$$0$16);
    module.exports = interopDefault(require$$0$4).getIterator = function(it){
      var iterFn = get(it);
      if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
      return anObject(iterFn.call(it));
    };
    });

    var core_getIterator$1 = interopDefault(core_getIterator);


    var require$$0$15 = Object.freeze({
      default: core_getIterator$1
    });

    var getIterator$2 = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$0$15);
    });

    var getIterator$3 = interopDefault(getIterator$2);


    var require$$0$14 = Object.freeze({
    	default: getIterator$3
    });

    var getIterator = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0$14), __esModule: true };
    });

    var getIterator$1 = interopDefault(getIterator);


    var require$$0$13 = Object.freeze({
    	default: getIterator$1
    });

    var slicedToArray = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _isIterable2 = interopDefault(require$$1);

    var _isIterable3 = _interopRequireDefault(_isIterable2);

    var _getIterator2 = interopDefault(require$$0$13);

    var _getIterator3 = _interopRequireDefault(_getIterator2);

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

    var _slicedToArray = interopDefault(slicedToArray);

    var _anInstance = createCommonjsModule(function (module) {
    module.exports = function(it, Constructor, name, forbiddenField){
      if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
        throw TypeError(name + ': incorrect invocation!');
      } return it;
    };
    });

    var _anInstance$1 = interopDefault(_anInstance);


    var require$$10 = Object.freeze({
      default: _anInstance$1
    });

    var _iterCall = createCommonjsModule(function (module) {
    // call something on iterator step with safe closing on error
    var anObject = interopDefault(require$$2$2);
    module.exports = function(iterator, fn, value, entries){
      try {
        return entries ? fn(anObject(value)[0], value[1]) : fn(value);
      // 7.4.6 IteratorClose(iterator, completion)
      } catch(e){
        var ret = iterator['return'];
        if(ret !== undefined)anObject(ret.call(iterator));
        throw e;
      }
    };
    });

    var _iterCall$1 = interopDefault(_iterCall);


    var require$$4$5 = Object.freeze({
      default: _iterCall$1
    });

    var _isArrayIter = createCommonjsModule(function (module) {
    // check on default Array iterator
    var Iterators  = interopDefault(require$$1$1)
      , ITERATOR   = interopDefault(require$$19)('iterator')
      , ArrayProto = Array.prototype;

    module.exports = function(it){
      return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
    };
    });

    var _isArrayIter$1 = interopDefault(_isArrayIter);


    var require$$3$5 = Object.freeze({
      default: _isArrayIter$1
    });

    var _forOf = createCommonjsModule(function (module) {
    var ctx         = interopDefault(require$$1$3)
      , call        = interopDefault(require$$4$5)
      , isArrayIter = interopDefault(require$$3$5)
      , anObject    = interopDefault(require$$2$2)
      , toLength    = interopDefault(require$$1$9)
      , getIterFn   = interopDefault(require$$0$16)
      , BREAK       = {}
      , RETURN      = {};
    var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
      var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
        , f      = ctx(fn, that, entries ? 2 : 1)
        , index  = 0
        , length, step, iterator, result;
      if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
      // fast case for arrays with default iterator
      if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
        result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
        if(result === BREAK || result === RETURN)return result;
      } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
        result = call(iterator, f, step.value, entries);
        if(result === BREAK || result === RETURN)return result;
      }
    };
    exports.BREAK  = BREAK;
    exports.RETURN = RETURN;
    });

    var _forOf$1 = interopDefault(_forOf);


    var require$$9 = Object.freeze({
      default: _forOf$1
    });

    var _speciesConstructor = createCommonjsModule(function (module) {
    // 7.3.20 SpeciesConstructor(O, defaultConstructor)
    var anObject  = interopDefault(require$$2$2)
      , aFunction = interopDefault(require$$1$4)
      , SPECIES   = interopDefault(require$$19)('species');
    module.exports = function(O, D){
      var C = anObject(O).constructor, S;
      return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
    };
    });

    var _speciesConstructor$1 = interopDefault(_speciesConstructor);


    var require$$8 = Object.freeze({
      default: _speciesConstructor$1
    });

    var _invoke = createCommonjsModule(function (module) {
    // fast apply, http://jsperf.lnkit.com/fast-apply/5
    module.exports = function(fn, args, that){
      var un = that === undefined;
      switch(args.length){
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
      } return              fn.apply(that, args);
    };
    });

    var _invoke$1 = interopDefault(_invoke);


    var require$$4$6 = Object.freeze({
      default: _invoke$1
    });

    var _task = createCommonjsModule(function (module) {
    var ctx                = interopDefault(require$$1$3)
      , invoke             = interopDefault(require$$4$6)
      , html               = interopDefault(require$$3$4)
      , cel                = interopDefault(require$$2$3)
      , global             = interopDefault(require$$4$2)
      , process            = global.process
      , setTask            = global.setImmediate
      , clearTask          = global.clearImmediate
      , MessageChannel     = global.MessageChannel
      , counter            = 0
      , queue              = {}
      , ONREADYSTATECHANGE = 'onreadystatechange'
      , defer, channel, port;
    var run = function(){
      var id = +this;
      if(queue.hasOwnProperty(id)){
        var fn = queue[id];
        delete queue[id];
        fn();
      }
    };
    var listener = function(event){
      run.call(event.data);
    };
    // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
    if(!setTask || !clearTask){
      setTask = function setImmediate(fn){
        var args = [], i = 1;
        while(arguments.length > i)args.push(arguments[i++]);
        queue[++counter] = function(){
          invoke(typeof fn == 'function' ? fn : Function(fn), args);
        };
        defer(counter);
        return counter;
      };
      clearTask = function clearImmediate(id){
        delete queue[id];
      };
      // Node.js 0.8-
      if(interopDefault(require$$0$1)(process) == 'process'){
        defer = function(id){
          process.nextTick(ctx(run, id, 1));
        };
      // Browsers with MessageChannel, includes WebWorkers
      } else if(MessageChannel){
        channel = new MessageChannel;
        port    = channel.port2;
        channel.port1.onmessage = listener;
        defer = ctx(port.postMessage, port, 1);
      // Browsers with postMessage, skip WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
      } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
        defer = function(id){
          global.postMessage(id + '', '*');
        };
        global.addEventListener('message', listener, false);
      // IE8-
      } else if(ONREADYSTATECHANGE in cel('script')){
        defer = function(id){
          html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
            html.removeChild(this);
            run.call(id);
          };
        };
      // Rest old browsers
      } else {
        defer = function(id){
          setTimeout(ctx(run, id, 1), 0);
        };
      }
    }
    module.exports = {
      set:   setTask,
      clear: clearTask
    };
    });

    var _task$1 = interopDefault(_task);
    var set = _task.set;
    var clear = _task.clear;

var require$$1$13 = Object.freeze({
      default: _task$1,
      set: set,
      clear: clear
    });

    var _microtask = createCommonjsModule(function (module) {
    var global    = interopDefault(require$$4$2)
      , macrotask = interopDefault(require$$1$13).set
      , Observer  = global.MutationObserver || global.WebKitMutationObserver
      , process   = global.process
      , Promise   = global.Promise
      , isNode    = interopDefault(require$$0$1)(process) == 'process';

    module.exports = function(){
      var head, last, notify;

      var flush = function(){
        var parent, fn;
        if(isNode && (parent = process.domain))parent.exit();
        while(head){
          fn   = head.fn;
          head = head.next;
          try {
            fn();
          } catch(e){
            if(head)notify();
            else last = undefined;
            throw e;
          }
        } last = undefined;
        if(parent)parent.enter();
      };

      // Node.js
      if(isNode){
        notify = function(){
          process.nextTick(flush);
        };
      // browsers with MutationObserver
      } else if(Observer){
        var toggle = true
          , node   = document.createTextNode('');
        new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
        notify = function(){
          node.data = toggle = !toggle;
        };
      // environments with maybe non-completely correct, but existent Promise
      } else if(Promise && Promise.resolve){
        var promise = Promise.resolve();
        notify = function(){
          promise.then(flush);
        };
      // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessag
      // - onreadystatechange
      // - setTimeout
      } else {
        notify = function(){
          // strange IE + webpack dev server bug - use .call(global)
          macrotask.call(global, flush);
        };
      }

      return function(fn){
        var task = {fn: fn, next: undefined};
        if(last)last.next = task;
        if(!head){
          head = task;
          notify();
        } last = task;
      };
    };
    });

    var _microtask$1 = interopDefault(_microtask);


    var require$$6 = Object.freeze({
      default: _microtask$1
    });

    var _redefineAll = createCommonjsModule(function (module) {
    var hide = interopDefault(require$$0$5);
    module.exports = function(target, src, safe){
      for(var key in src){
        if(safe && target[key])target[key] = src[key];
        else hide(target, key, src[key]);
      } return target;
    };
    });

    var _redefineAll$1 = interopDefault(_redefineAll);


    var require$$4$7 = Object.freeze({
      default: _redefineAll$1
    });

    var _setSpecies = createCommonjsModule(function (module) {
    'use strict';
    var global      = interopDefault(require$$4$2)
      , core        = interopDefault(require$$0$4)
      , dP          = interopDefault(require$$0$6)
      , DESCRIPTORS = interopDefault(require$$1$6)
      , SPECIES     = interopDefault(require$$19)('species');

    module.exports = function(KEY){
      var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
      if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
        configurable: true,
        get: function(){ return this; }
      });
    };
    });

    var _setSpecies$1 = interopDefault(_setSpecies);


    var require$$2$7 = Object.freeze({
      default: _setSpecies$1
    });

    var _iterDetect = createCommonjsModule(function (module) {
    var ITERATOR     = interopDefault(require$$19)('iterator')
      , SAFE_CLOSING = false;

    try {
      var riter = [7][ITERATOR]();
      riter['return'] = function(){ SAFE_CLOSING = true; };
      Array.from(riter, function(){ throw 2; });
    } catch(e){ /* empty */ }

    module.exports = function(exec, skipClosing){
      if(!skipClosing && !SAFE_CLOSING)return false;
      var safe = false;
      try {
        var arr  = [7]
          , iter = arr[ITERATOR]();
        iter.next = function(){ return {done: safe = true}; };
        arr[ITERATOR] = function(){ return iter; };
        exec(arr);
      } catch(e){ /* empty */ }
      return safe;
    };
    });

    var _iterDetect$1 = interopDefault(_iterDetect);


    var require$$0$18 = Object.freeze({
      default: _iterDetect$1
    });

    var es6_promise = createCommonjsModule(function (module) {
    'use strict';
    var LIBRARY            = interopDefault(require$$2)
      , global             = interopDefault(require$$4$2)
      , ctx                = interopDefault(require$$1$3)
      , classof            = interopDefault(require$$14)
      , $export            = interopDefault(require$$2$1)
      , isObject           = interopDefault(require$$3$1)
      , aFunction          = interopDefault(require$$1$4)
      , anInstance         = interopDefault(require$$10)
      , forOf              = interopDefault(require$$9)
      , speciesConstructor = interopDefault(require$$8)
      , task               = interopDefault(require$$1$13).set
      , microtask          = interopDefault(require$$6)()
      , PROMISE            = 'Promise'
      , TypeError          = global.TypeError
      , process            = global.process
      , $Promise           = global[PROMISE]
      , process            = global.process
      , isNode             = classof(process) == 'process'
      , empty              = function(){ /* empty */ }
      , Internal, GenericPromiseCapability, Wrapper;

    var USE_NATIVE = !!function(){
      try {
        // correct subclassing with @@species support
        var promise     = $Promise.resolve(1)
          , FakePromise = (promise.constructor = {})[interopDefault(require$$19)('species')] = function(exec){ exec(empty, empty); };
        // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
        return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
      } catch(e){ /* empty */ }
    }();

    // helpers
    var sameConstructor = function(a, b){
      // with library wrapper special case
      return a === b || a === $Promise && b === Wrapper;
    };
    var isThenable = function(it){
      var then;
      return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
    };
    var newPromiseCapability = function(C){
      return sameConstructor($Promise, C)
        ? new PromiseCapability(C)
        : new GenericPromiseCapability(C);
    };
    var PromiseCapability = GenericPromiseCapability = function(C){
      var resolve, reject;
      this.promise = new C(function($$resolve, $$reject){
        if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
        resolve = $$resolve;
        reject  = $$reject;
      });
      this.resolve = aFunction(resolve);
      this.reject  = aFunction(reject);
    };
    var perform = function(exec){
      try {
        exec();
      } catch(e){
        return {error: e};
      }
    };
    var notify = function(promise, isReject){
      if(promise._n)return;
      promise._n = true;
      var chain = promise._c;
      microtask(function(){
        var value = promise._v
          , ok    = promise._s == 1
          , i     = 0;
        var run = function(reaction){
          var handler = ok ? reaction.ok : reaction.fail
            , resolve = reaction.resolve
            , reject  = reaction.reject
            , domain  = reaction.domain
            , result, then;
          try {
            if(handler){
              if(!ok){
                if(promise._h == 2)onHandleUnhandled(promise);
                promise._h = 1;
              }
              if(handler === true)result = value;
              else {
                if(domain)domain.enter();
                result = handler(value);
                if(domain)domain.exit();
              }
              if(result === reaction.promise){
                reject(TypeError('Promise-chain cycle'));
              } else if(then = isThenable(result)){
                then.call(result, resolve, reject);
              } else resolve(result);
            } else reject(value);
          } catch(e){
            reject(e);
          }
        };
        while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
        promise._c = [];
        promise._n = false;
        if(isReject && !promise._h)onUnhandled(promise);
      });
    };
    var onUnhandled = function(promise){
      task.call(global, function(){
        var value = promise._v
          , abrupt, handler, console;
        if(isUnhandled(promise)){
          abrupt = perform(function(){
            if(isNode){
              process.emit('unhandledRejection', value, promise);
            } else if(handler = global.onunhandledrejection){
              handler({promise: promise, reason: value});
            } else if((console = global.console) && console.error){
              console.error('Unhandled promise rejection', value);
            }
          });
          // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
          promise._h = isNode || isUnhandled(promise) ? 2 : 1;
        } promise._a = undefined;
        if(abrupt)throw abrupt.error;
      });
    };
    var isUnhandled = function(promise){
      if(promise._h == 1)return false;
      var chain = promise._a || promise._c
        , i     = 0
        , reaction;
      while(chain.length > i){
        reaction = chain[i++];
        if(reaction.fail || !isUnhandled(reaction.promise))return false;
      } return true;
    };
    var onHandleUnhandled = function(promise){
      task.call(global, function(){
        var handler;
        if(isNode){
          process.emit('rejectionHandled', promise);
        } else if(handler = global.onrejectionhandled){
          handler({promise: promise, reason: promise._v});
        }
      });
    };
    var $reject = function(value){
      var promise = this;
      if(promise._d)return;
      promise._d = true;
      promise = promise._w || promise; // unwrap
      promise._v = value;
      promise._s = 2;
      if(!promise._a)promise._a = promise._c.slice();
      notify(promise, true);
    };
    var $resolve = function(value){
      var promise = this
        , then;
      if(promise._d)return;
      promise._d = true;
      promise = promise._w || promise; // unwrap
      try {
        if(promise === value)throw TypeError("Promise can't be resolved itself");
        if(then = isThenable(value)){
          microtask(function(){
            var wrapper = {_w: promise, _d: false}; // wrap
            try {
              then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
            } catch(e){
              $reject.call(wrapper, e);
            }
          });
        } else {
          promise._v = value;
          promise._s = 1;
          notify(promise, false);
        }
      } catch(e){
        $reject.call({_w: promise, _d: false}, e); // wrap
      }
    };

    // constructor polyfill
    if(!USE_NATIVE){
      // 25.4.3.1 Promise(executor)
      $Promise = function Promise(executor){
        anInstance(this, $Promise, PROMISE, '_h');
        aFunction(executor);
        Internal.call(this);
        try {
          executor(ctx($resolve, this, 1), ctx($reject, this, 1));
        } catch(err){
          $reject.call(this, err);
        }
      };
      Internal = function Promise(executor){
        this._c = [];             // <- awaiting reactions
        this._a = undefined;      // <- checked in isUnhandled reactions
        this._s = 0;              // <- state
        this._d = false;          // <- done
        this._v = undefined;      // <- value
        this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
        this._n = false;          // <- notify
      };
      Internal.prototype = interopDefault(require$$4$7)($Promise.prototype, {
        // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
        then: function then(onFulfilled, onRejected){
          var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
          reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
          reaction.fail   = typeof onRejected == 'function' && onRejected;
          reaction.domain = isNode ? process.domain : undefined;
          this._c.push(reaction);
          if(this._a)this._a.push(reaction);
          if(this._s)notify(this, false);
          return reaction.promise;
        },
        // 25.4.5.1 Promise.prototype.catch(onRejected)
        'catch': function(onRejected){
          return this.then(undefined, onRejected);
        }
      });
      PromiseCapability = function(){
        var promise  = new Internal;
        this.promise = promise;
        this.resolve = ctx($resolve, promise, 1);
        this.reject  = ctx($reject, promise, 1);
      };
    }

    $export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
    interopDefault(require$$21)($Promise, PROMISE);
    interopDefault(require$$2$7)(PROMISE);
    Wrapper = interopDefault(require$$0$4)[PROMISE];

    // statics
    $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
      // 25.4.4.5 Promise.reject(r)
      reject: function reject(r){
        var capability = newPromiseCapability(this)
          , $$reject   = capability.reject;
        $$reject(r);
        return capability.promise;
      }
    });
    $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
      // 25.4.4.6 Promise.resolve(x)
      resolve: function resolve(x){
        // instanceof instead of internal slot check because we should fix it without replacement native Promise core
        if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
        var capability = newPromiseCapability(this)
          , $$resolve  = capability.resolve;
        $$resolve(x);
        return capability.promise;
      }
    });
    $export($export.S + $export.F * !(USE_NATIVE && interopDefault(require$$0$18)(function(iter){
      $Promise.all(iter)['catch'](empty);
    })), PROMISE, {
      // 25.4.4.1 Promise.all(iterable)
      all: function all(iterable){
        var C          = this
          , capability = newPromiseCapability(C)
          , resolve    = capability.resolve
          , reject     = capability.reject;
        var abrupt = perform(function(){
          var values    = []
            , index     = 0
            , remaining = 1;
          forOf(iterable, false, function(promise){
            var $index        = index++
              , alreadyCalled = false;
            values.push(undefined);
            remaining++;
            C.resolve(promise).then(function(value){
              if(alreadyCalled)return;
              alreadyCalled  = true;
              values[$index] = value;
              --remaining || resolve(values);
            }, reject);
          });
          --remaining || resolve(values);
        });
        if(abrupt)reject(abrupt.error);
        return capability.promise;
      },
      // 25.4.4.4 Promise.race(iterable)
      race: function race(iterable){
        var C          = this
          , capability = newPromiseCapability(C)
          , reject     = capability.reject;
        var abrupt = perform(function(){
          forOf(iterable, false, function(promise){
            C.resolve(promise).then(capability.resolve, reject);
          });
        });
        if(abrupt)reject(abrupt.error);
        return capability.promise;
      }
    });
    });

    interopDefault(es6_promise);

    var promise$1 = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$0$4).Promise;
    });

    var promise$2 = interopDefault(promise$1);


    var require$$0$17 = Object.freeze({
    	default: promise$2
    });

    var promise = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0$17), __esModule: true };
    });

    var _Promise = interopDefault(promise);

    var _objectGops = createCommonjsModule(function (module, exports) {
    exports.f = Object.getOwnPropertySymbols;
    });

    var _objectGops$1 = interopDefault(_objectGops);
    var f$1 = _objectGops.f;

var require$$1$14 = Object.freeze({
    	default: _objectGops$1,
    	f: f$1
    });

    var _objectPie = createCommonjsModule(function (module, exports) {
    exports.f = {}.propertyIsEnumerable;
    });

    var _objectPie$1 = interopDefault(_objectPie);
    var f$2 = _objectPie.f;

var require$$6$1 = Object.freeze({
    	default: _objectPie$1,
    	f: f$2
    });

    var _objectAssign = createCommonjsModule(function (module) {
    'use strict';
    // 19.1.2.1 Object.assign(target, source, ...)
    var getKeys  = interopDefault(require$$2$5)
      , gOPS     = interopDefault(require$$1$14)
      , pIE      = interopDefault(require$$6$1)
      , toObject = interopDefault(require$$2$6)
      , IObject  = interopDefault(require$$1$2)
      , $assign  = Object.assign;

    // should work with symbols and should have deterministic property order (V8 bug)
    module.exports = !$assign || interopDefault(require$$0$7)(function(){
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
    });

    var _objectAssign$1 = interopDefault(_objectAssign);


    var require$$0$20 = Object.freeze({
      default: _objectAssign$1
    });

    var es6_object_assign = createCommonjsModule(function (module) {
    // 19.1.3.1 Object.assign(target, source)
    var $export = interopDefault(require$$2$1);

    $export($export.S + $export.F, 'Object', {assign: interopDefault(require$$0$20)});
    });

    interopDefault(es6_object_assign);

    var assign$1 = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$0$4).Object.assign;
    });

    var assign$2 = interopDefault(assign$1);


    var require$$0$19 = Object.freeze({
    	default: assign$2
    });

    var assign = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0$19), __esModule: true };
    });

    var _Object$assign = interopDefault(assign);

    var classCallCheck = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    exports.default = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    });

    var _classCallCheck = interopDefault(classCallCheck);

    var _wksExt = createCommonjsModule(function (module, exports) {
    exports.f = interopDefault(require$$19);
    });

    var _wksExt$1 = interopDefault(_wksExt);
    var f$3 = _wksExt.f;

var require$$1$16 = Object.freeze({
    	default: _wksExt$1,
    	f: f$3
    });

    var iterator$2 = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$1$16).f('iterator');
    });

    var iterator$3 = interopDefault(iterator$2);


    var require$$0$22 = Object.freeze({
    	default: iterator$3
    });

    var iterator = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0$22), __esModule: true };
    });

    var iterator$1 = interopDefault(iterator);


    var require$$1$15 = Object.freeze({
    	default: iterator$1
    });

    var _meta = createCommonjsModule(function (module) {
    var META     = interopDefault(require$$4$4)('meta')
      , isObject = interopDefault(require$$3$1)
      , has      = interopDefault(require$$2$4)
      , setDesc  = interopDefault(require$$0$6).f
      , id       = 0;
    var isExtensible = Object.isExtensible || function(){
      return true;
    };
    var FREEZE = !interopDefault(require$$0$7)(function(){
      return isExtensible(Object.preventExtensions({}));
    });
    var setMeta = function(it){
      setDesc(it, META, {value: {
        i: 'O' + ++id, // object ID
        w: {}          // weak collections IDs
      }});
    };
    var fastKey = function(it, create){
      // return primitive with prefix
      if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
      if(!has(it, META)){
        // can't set metadata to uncaught frozen object
        if(!isExtensible(it))return 'F';
        // not necessary to add metadata
        if(!create)return 'E';
        // add missing metadata
        setMeta(it);
      // return object ID
      } return it[META].i;
    };
    var getWeak = function(it, create){
      if(!has(it, META)){
        // can't set metadata to uncaught frozen object
        if(!isExtensible(it))return true;
        // not necessary to add metadata
        if(!create)return false;
        // add missing metadata
        setMeta(it);
      // return hash weak collections IDs
      } return it[META].w;
    };
    // add metadata on freeze-family methods calling
    var onFreeze = function(it){
      if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
      return it;
    };
    var meta = module.exports = {
      KEY:      META,
      NEED:     false,
      fastKey:  fastKey,
      getWeak:  getWeak,
      onFreeze: onFreeze
    };
    });

    var _meta$1 = interopDefault(_meta);
    var KEY = _meta.KEY;
    var NEED = _meta.NEED;
    var fastKey = _meta.fastKey;
    var getWeak = _meta.getWeak;
    var onFreeze = _meta.onFreeze;

var require$$24 = Object.freeze({
      default: _meta$1,
      KEY: KEY,
      NEED: NEED,
      fastKey: fastKey,
      getWeak: getWeak,
      onFreeze: onFreeze
    });

    var _wksDefine = createCommonjsModule(function (module) {
    var global         = interopDefault(require$$4$2)
      , core           = interopDefault(require$$0$4)
      , LIBRARY        = interopDefault(require$$2)
      , wksExt         = interopDefault(require$$1$16)
      , defineProperty = interopDefault(require$$0$6).f;
    module.exports = function(name){
      var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
      if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
    };
    });

    var _wksDefine$1 = interopDefault(_wksDefine);


    var require$$0$25 = Object.freeze({
      default: _wksDefine$1
    });

    var _keyof = createCommonjsModule(function (module) {
    var getKeys   = interopDefault(require$$2$5)
      , toIObject = interopDefault(require$$4$1);
    module.exports = function(object, el){
      var O      = toIObject(object)
        , keys   = getKeys(O)
        , length = keys.length
        , index  = 0
        , key;
      while(length > index)if(O[key = keys[index++]] === el)return key;
    };
    });

    var _keyof$1 = interopDefault(_keyof);


    var require$$16 = Object.freeze({
      default: _keyof$1
    });

    var _enumKeys = createCommonjsModule(function (module) {
    // all enumerable object keys, includes symbols
    var getKeys = interopDefault(require$$2$5)
      , gOPS    = interopDefault(require$$1$14)
      , pIE     = interopDefault(require$$6$1);
    module.exports = function(it){
      var result     = getKeys(it)
        , getSymbols = gOPS.f;
      if(getSymbols){
        var symbols = getSymbols(it)
          , isEnum  = pIE.f
          , i       = 0
          , key;
        while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
      } return result;
    };
    });

    var _enumKeys$1 = interopDefault(_enumKeys);


    var require$$15 = Object.freeze({
      default: _enumKeys$1
    });

    var _isArray = createCommonjsModule(function (module) {
    // 7.2.2 IsArray(argument)
    var cof = interopDefault(require$$0$1);
    module.exports = Array.isArray || function isArray(arg){
      return cof(arg) == 'Array';
    };
    });

    var _isArray$1 = interopDefault(_isArray);


    var require$$14$1 = Object.freeze({
      default: _isArray$1
    });

    var _objectGopn = createCommonjsModule(function (module, exports) {
    // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
    var $keys      = interopDefault(require$$1$7)
      , hiddenKeys = interopDefault(require$$0$11).concat('length', 'prototype');

    exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
      return $keys(O, hiddenKeys);
    };
    });

    var _objectGopn$1 = interopDefault(_objectGopn);
    var f$5 = _objectGopn.f;

var require$$0$26 = Object.freeze({
      default: _objectGopn$1,
      f: f$5
    });

    var _objectGopnExt = createCommonjsModule(function (module) {
    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
    var toIObject = interopDefault(require$$4$1)
      , gOPN      = interopDefault(require$$0$26).f
      , toString  = {}.toString;

    var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window) : [];

    var getWindowNames = function(it){
      try {
        return gOPN(it);
      } catch(e){
        return windowNames.slice();
      }
    };

    module.exports.f = function getOwnPropertyNames(it){
      return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
    };
    });

    var _objectGopnExt$1 = interopDefault(_objectGopnExt);
    var f$4 = _objectGopnExt.f;

var require$$8$1 = Object.freeze({
      default: _objectGopnExt$1,
      f: f$4
    });

    var _objectGopd = createCommonjsModule(function (module, exports) {
    var pIE            = interopDefault(require$$6$1)
      , createDesc     = interopDefault(require$$5)
      , toIObject      = interopDefault(require$$4$1)
      , toPrimitive    = interopDefault(require$$3$2)
      , has            = interopDefault(require$$2$4)
      , IE8_DOM_DEFINE = interopDefault(require$$1$5)
      , gOPD           = Object.getOwnPropertyDescriptor;

    exports.f = interopDefault(require$$1$6) ? gOPD : function getOwnPropertyDescriptor(O, P){
      O = toIObject(O);
      P = toPrimitive(P, true);
      if(IE8_DOM_DEFINE)try {
        return gOPD(O, P);
      } catch(e){ /* empty */ }
      if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
    };
    });

    var _objectGopd$1 = interopDefault(_objectGopd);
    var f$6 = _objectGopd.f;

var require$$0$27 = Object.freeze({
      default: _objectGopd$1,
      f: f$6
    });

    var es6_symbol = createCommonjsModule(function (module) {
    'use strict';
    // ECMAScript 6 symbols shim
    var global         = interopDefault(require$$4$2)
      , has            = interopDefault(require$$2$4)
      , DESCRIPTORS    = interopDefault(require$$1$6)
      , $export        = interopDefault(require$$2$1)
      , redefine       = interopDefault(require$$25)
      , META           = interopDefault(require$$24).KEY
      , $fails         = interopDefault(require$$0$7)
      , shared         = interopDefault(require$$22)
      , setToStringTag = interopDefault(require$$21)
      , uid            = interopDefault(require$$4$4)
      , wks            = interopDefault(require$$19)
      , wksExt         = interopDefault(require$$1$16)
      , wksDefine      = interopDefault(require$$0$25)
      , keyOf          = interopDefault(require$$16)
      , enumKeys       = interopDefault(require$$15)
      , isArray        = interopDefault(require$$14$1)
      , anObject       = interopDefault(require$$2$2)
      , toIObject      = interopDefault(require$$4$1)
      , toPrimitive    = interopDefault(require$$3$2)
      , createDesc     = interopDefault(require$$5)
      , _create        = interopDefault(require$$0$8)
      , gOPNExt        = interopDefault(require$$8$1)
      , $GOPD          = interopDefault(require$$0$27)
      , $DP            = interopDefault(require$$0$6)
      , $keys          = interopDefault(require$$2$5)
      , gOPD           = $GOPD.f
      , dP             = $DP.f
      , gOPN           = gOPNExt.f
      , $Symbol        = global.Symbol
      , $JSON          = global.JSON
      , _stringify     = $JSON && $JSON.stringify
      , PROTOTYPE      = 'prototype'
      , HIDDEN         = wks('_hidden')
      , TO_PRIMITIVE   = wks('toPrimitive')
      , isEnum         = {}.propertyIsEnumerable
      , SymbolRegistry = shared('symbol-registry')
      , AllSymbols     = shared('symbols')
      , OPSymbols      = shared('op-symbols')
      , ObjectProto    = Object[PROTOTYPE]
      , USE_NATIVE     = typeof $Symbol == 'function'
      , QObject        = global.QObject;
    // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
    var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

    // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
    var setSymbolDesc = DESCRIPTORS && $fails(function(){
      return _create(dP({}, 'a', {
        get: function(){ return dP(this, 'a', {value: 7}).a; }
      })).a != 7;
    }) ? function(it, key, D){
      var protoDesc = gOPD(ObjectProto, key);
      if(protoDesc)delete ObjectProto[key];
      dP(it, key, D);
      if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
    } : dP;

    var wrap = function(tag){
      var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
      sym._k = tag;
      return sym;
    };

    var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
      return typeof it == 'symbol';
    } : function(it){
      return it instanceof $Symbol;
    };

    var $defineProperty = function defineProperty(it, key, D){
      if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
      anObject(it);
      key = toPrimitive(key, true);
      anObject(D);
      if(has(AllSymbols, key)){
        if(!D.enumerable){
          if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
          it[HIDDEN][key] = true;
        } else {
          if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
          D = _create(D, {enumerable: createDesc(0, false)});
        } return setSymbolDesc(it, key, D);
      } return dP(it, key, D);
    };
    var $defineProperties = function defineProperties(it, P){
      anObject(it);
      var keys = enumKeys(P = toIObject(P))
        , i    = 0
        , l = keys.length
        , key;
      while(l > i)$defineProperty(it, key = keys[i++], P[key]);
      return it;
    };
    var $create = function create(it, P){
      return P === undefined ? _create(it) : $defineProperties(_create(it), P);
    };
    var $propertyIsEnumerable = function propertyIsEnumerable(key){
      var E = isEnum.call(this, key = toPrimitive(key, true));
      if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
      return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
    };
    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
      it  = toIObject(it);
      key = toPrimitive(key, true);
      if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
      var D = gOPD(it, key);
      if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
      return D;
    };
    var $getOwnPropertyNames = function getOwnPropertyNames(it){
      var names  = gOPN(toIObject(it))
        , result = []
        , i      = 0
        , key;
      while(names.length > i){
        if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
      } return result;
    };
    var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
      var IS_OP  = it === ObjectProto
        , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
        , result = []
        , i      = 0
        , key;
      while(names.length > i){
        if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
      } return result;
    };

    // 19.4.1.1 Symbol([description])
    if(!USE_NATIVE){
      $Symbol = function Symbol(){
        if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
        var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
        var $set = function(value){
          if(this === ObjectProto)$set.call(OPSymbols, value);
          if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
          setSymbolDesc(this, tag, createDesc(1, value));
        };
        if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
        return wrap(tag);
      };
      redefine($Symbol[PROTOTYPE], 'toString', function toString(){
        return this._k;
      });

      $GOPD.f = $getOwnPropertyDescriptor;
      $DP.f   = $defineProperty;
      interopDefault(require$$0$26).f = gOPNExt.f = $getOwnPropertyNames;
      interopDefault(require$$6$1).f  = $propertyIsEnumerable;
      interopDefault(require$$1$14).f = $getOwnPropertySymbols;

      if(DESCRIPTORS && !interopDefault(require$$2)){
        redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
      }

      wksExt.f = function(name){
        return wrap(wks(name));
      }
    }

    $export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

    for(var symbols = (
      // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
      'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
    ).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

    for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

    $export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
      // 19.4.2.1 Symbol.for(key)
      'for': function(key){
        return has(SymbolRegistry, key += '')
          ? SymbolRegistry[key]
          : SymbolRegistry[key] = $Symbol(key);
      },
      // 19.4.2.5 Symbol.keyFor(sym)
      keyFor: function keyFor(key){
        if(isSymbol(key))return keyOf(SymbolRegistry, key);
        throw TypeError(key + ' is not a symbol!');
      },
      useSetter: function(){ setter = true; },
      useSimple: function(){ setter = false; }
    });

    $export($export.S + $export.F * !USE_NATIVE, 'Object', {
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
    $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
      var S = $Symbol();
      // MS Edge converts symbol values to JSON as {}
      // WebKit converts symbol values to JSON as null
      // V8 throws on boxed symbols
      return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
    })), 'JSON', {
      stringify: function stringify(it){
        if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
        var args = [it]
          , i    = 1
          , replacer, $replacer;
        while(arguments.length > i)args.push(arguments[i++]);
        replacer = args[1];
        if(typeof replacer == 'function')$replacer = replacer;
        if($replacer || !isArray(replacer))replacer = function(key, value){
          if($replacer)value = $replacer.call(this, key, value);
          if(!isSymbol(value))return value;
        };
        args[1] = replacer;
        return _stringify.apply($JSON, args);
      }
    });

    // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
    $Symbol[PROTOTYPE][TO_PRIMITIVE] || interopDefault(require$$0$5)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
    // 19.4.3.5 Symbol.prototype[@@toStringTag]
    setToStringTag($Symbol, 'Symbol');
    // 20.2.1.9 Math[@@toStringTag]
    setToStringTag(Math, 'Math', true);
    // 24.3.3 JSON[@@toStringTag]
    setToStringTag(global.JSON, 'JSON', true);
    });

    interopDefault(es6_symbol);

    var es7_symbol_asyncIterator = createCommonjsModule(function (module) {
    interopDefault(require$$0$25)('asyncIterator');
    });

    interopDefault(es7_symbol_asyncIterator);

    var es7_symbol_observable = createCommonjsModule(function (module) {
    interopDefault(require$$0$25)('observable');
    });

    interopDefault(es7_symbol_observable);

    var index = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$0$4).Symbol;
    });

    var index$1 = interopDefault(index);


    var require$$0$24 = Object.freeze({
    	default: index$1
    });

    var symbol = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0$24), __esModule: true };
    });

    var symbol$1 = interopDefault(symbol);


    var require$$0$23 = Object.freeze({
    	default: symbol$1
    });

    var _typeof = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _iterator = interopDefault(require$$1$15);

    var _iterator2 = _interopRequireDefault(_iterator);

    var _symbol = interopDefault(require$$0$23);

    var _symbol2 = _interopRequireDefault(_symbol);

    var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
      return typeof obj === "undefined" ? "undefined" : _typeof(obj);
    } : function (obj) {
      return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
    };
    });

    var _typeof$1 = interopDefault(_typeof);


    var require$$0$21 = Object.freeze({
      default: _typeof$1
    });

    var possibleConstructorReturn = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _typeof2 = interopDefault(require$$0$21);

    var _typeof3 = _interopRequireDefault(_typeof2);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
    };
    });

    var _possibleConstructorReturn = interopDefault(possibleConstructorReturn);

    var _setProto = createCommonjsModule(function (module) {
    // Works with __proto__ only. Old v8 can't work with null proto objects.
    /* eslint-disable no-proto */
    var isObject = interopDefault(require$$3$1)
      , anObject = interopDefault(require$$2$2);
    var check = function(O, proto){
      anObject(O);
      if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
    };
    module.exports = {
      set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
        function(test, buggy, set){
          try {
            set = interopDefault(require$$1$3)(Function.call, interopDefault(require$$0$27).f(Object.prototype, '__proto__').set, 2);
            set(test, []);
            buggy = !(test instanceof Array);
          } catch(e){ buggy = true; }
          return function setPrototypeOf(O, proto){
            check(O, proto);
            if(buggy)O.__proto__ = proto;
            else set(O, proto);
            return O;
          };
        }({}, false) : undefined),
      check: check
    };
    });

    var _setProto$1 = interopDefault(_setProto);
    var set$1 = _setProto.set;
    var check = _setProto.check;

var require$$0$29 = Object.freeze({
      default: _setProto$1,
      set: set$1,
      check: check
    });

    var es6_object_setPrototypeOf = createCommonjsModule(function (module) {
    // 19.1.3.19 Object.setPrototypeOf(O, proto)
    var $export = interopDefault(require$$2$1);
    $export($export.S, 'Object', {setPrototypeOf: interopDefault(require$$0$29).set});
    });

    interopDefault(es6_object_setPrototypeOf);

    var setPrototypeOf$2 = createCommonjsModule(function (module) {
    module.exports = interopDefault(require$$0$4).Object.setPrototypeOf;
    });

    var setPrototypeOf$3 = interopDefault(setPrototypeOf$2);


    var require$$0$28 = Object.freeze({
    	default: setPrototypeOf$3
    });

    var setPrototypeOf = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0$28), __esModule: true };
    });

    var setPrototypeOf$1 = interopDefault(setPrototypeOf);


    var require$$2$8 = Object.freeze({
    	default: setPrototypeOf$1
    });

    var es6_object_create = createCommonjsModule(function (module) {
    var $export = interopDefault(require$$2$1)
    // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
    $export($export.S, 'Object', {create: interopDefault(require$$0$8)});
    });

    interopDefault(es6_object_create);

    var create$2 = createCommonjsModule(function (module) {
    var $Object = interopDefault(require$$0$4).Object;
    module.exports = function create(P, D){
      return $Object.create(P, D);
    };
    });

    var create$3 = interopDefault(create$2);


    var require$$0$30 = Object.freeze({
      default: create$3
    });

    var create = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0$30), __esModule: true };
    });

    var create$1 = interopDefault(create);


    var require$$1$17 = Object.freeze({
    	default: create$1
    });

    var inherits = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _setPrototypeOf = interopDefault(require$$2$8);

    var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

    var _create = interopDefault(require$$1$17);

    var _create2 = _interopRequireDefault(_create);

    var _typeof2 = interopDefault(require$$0$21);

    var _typeof3 = _interopRequireDefault(_typeof2);

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

    var _inherits = interopDefault(inherits);

    var index$2 = createCommonjsModule(function (module) {
    'use strict';

    var has = Object.prototype.hasOwnProperty;

    //
    // We store our EE objects in a plain object whose properties are event names.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // `~` to make sure that the built-in object properties are not overridden or
    // used as an attack vector.
    // We also assume that `Object.create(null)` is available when the event name
    // is an ES6 Symbol.
    //
    var prefix = typeof Object.create !== 'function' ? '~' : false;

    /**
     * Representation of a single EventEmitter function.
     *
     * @param {Function} fn Event handler to be called.
     * @param {Mixed} context Context for function execution.
     * @param {Boolean} [once=false] Only emit once
     * @api private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Minimal EventEmitter interface that is molded against the Node.js
     * EventEmitter interface.
     *
     * @constructor
     * @api public
     */
    function EventEmitter() { /* Nothing to set */ }

    /**
     * Hold the assigned EventEmitters by name.
     *
     * @type {Object}
     * @private
     */
    EventEmitter.prototype._events = undefined;

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @api public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var events = this._events
        , names = []
        , name;

      if (!events) return names;

      for (name in events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return a list of assigned event listeners.
     *
     * @param {String} event The events that should be listed.
     * @param {Boolean} exists We only need to know if there are listeners.
     * @returns {Array|Boolean}
     * @api public
     */
    EventEmitter.prototype.listeners = function listeners(event, exists) {
      var evt = prefix ? prefix + event : event
        , available = this._events && this._events[evt];

      if (exists) return !!available;
      if (!available) return [];
      if (available.fn) return [available.fn];

      for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
        ee[i] = available[i].fn;
      }

      return ee;
    };

    /**
     * Emit an event to all registered event listeners.
     *
     * @param {String} event The name of the event.
     * @returns {Boolean} Indication if we've emitted an event.
     * @api public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events || !this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if ('function' === typeof listeners.fn) {
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
     * Register a new EventListener for the given event.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {Mixed} [context=this] The context of the function.
     * @api public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      var listener = new EE(fn, context || this)
        , evt = prefix ? prefix + event : event;

      if (!this._events) this._events = prefix ? {} : Object.create(null);
      if (!this._events[evt]) this._events[evt] = listener;
      else {
        if (!this._events[evt].fn) this._events[evt].push(listener);
        else this._events[evt] = [
          this._events[evt], listener
        ];
      }

      return this;
    };

    /**
     * Add an EventListener that's only called once.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {Mixed} [context=this] The context of the function.
     * @api public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      var listener = new EE(fn, context || this, true)
        , evt = prefix ? prefix + event : event;

      if (!this._events) this._events = prefix ? {} : Object.create(null);
      if (!this._events[evt]) this._events[evt] = listener;
      else {
        if (!this._events[evt].fn) this._events[evt].push(listener);
        else this._events[evt] = [
          this._events[evt], listener
        ];
      }

      return this;
    };

    /**
     * Remove event listeners.
     *
     * @param {String} event The event we want to remove.
     * @param {Function} fn The listener that we need to find.
     * @param {Mixed} context Only remove listeners matching this context.
     * @param {Boolean} once Only remove once listeners.
     * @api public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events || !this._events[evt]) return this;

      var listeners = this._events[evt]
        , events = [];

      if (fn) {
        if (listeners.fn) {
          if (
               listeners.fn !== fn
            || (once && !listeners.once)
            || (context && listeners.context !== context)
          ) {
            events.push(listeners);
          }
        } else {
          for (var i = 0, length = listeners.length; i < length; i++) {
            if (
                 listeners[i].fn !== fn
              || (once && !listeners[i].once)
              || (context && listeners[i].context !== context)
            ) {
              events.push(listeners[i]);
            }
          }
        }
      }

      //
      // Reset the array, or remove it completely if we have no more listeners.
      //
      if (events.length) {
        this._events[evt] = events.length === 1 ? events[0] : events;
      } else {
        delete this._events[evt];
      }

      return this;
    };

    /**
     * Remove all listeners or only the listeners for the specified event.
     *
     * @param {String} event The event want to remove all listeners for.
     * @api public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      if (!this._events) return this;

      if (event) delete this._events[prefix ? prefix + event : event];
      else this._events = prefix ? {} : Object.create(null);

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
    // Expose the module.
    //
    if ('undefined' !== typeof module) {
      module.exports = EventEmitter;
    }
    });

    var EventEmitter = interopDefault(index$2);

    var es6_object_defineProperty = createCommonjsModule(function (module) {
    var $export = interopDefault(require$$2$1);
    // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
    $export($export.S + $export.F * !interopDefault(require$$1$6), 'Object', {defineProperty: interopDefault(require$$0$6).f});
    });

    interopDefault(es6_object_defineProperty);

    var defineProperty$2 = createCommonjsModule(function (module) {
    var $Object = interopDefault(require$$0$4).Object;
    module.exports = function defineProperty(it, key, desc){
      return $Object.defineProperty(it, key, desc);
    };
    });

    var defineProperty$3 = interopDefault(defineProperty$2);


    var require$$0$32 = Object.freeze({
      default: defineProperty$3
    });

    var defineProperty = createCommonjsModule(function (module) {
    module.exports = { "default": interopDefault(require$$0$32), __esModule: true };
    });

    var defineProperty$1 = interopDefault(defineProperty);


    var require$$0$31 = Object.freeze({
    	default: defineProperty$1
    });

    var createClass = createCommonjsModule(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _defineProperty = interopDefault(require$$0$31);

    var _defineProperty2 = _interopRequireDefault(_defineProperty);

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

    var _createClass = interopDefault(createClass);

    var stateMachine = createCommonjsModule(function (module, exports) {
    /*

      Javascript State Machine Library - https://github.com/jakesgordon/javascript-state-machine

      Copyright (c) 2012, 2013, 2014, 2015, Jake Gordon and contributors
      Released under the MIT license - https://github.com/jakesgordon/javascript-state-machine/blob/master/LICENSE

    */

    (function () {

      var StateMachine = {

        //---------------------------------------------------------------------------

        VERSION: "2.3.5",

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
            var from = (e.from instanceof Array) ? e.from : (e.from ? [e.from] : [StateMachine.WILDCARD]); // allow 'wildcard' transition if 'from' is not specified
            map[e.name] = map[e.name] || {};
            for (var n = 0 ; n < from.length ; n++) {
              transitions[from[n]] = transitions[from[n]] || [];
              transitions[from[n]].push(e.name);

              map[e.name][from[n]] = e.to || from[n]; // allow no-op transition if 'to' is not specified
            }
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
              fsm[name] = callbacks[name]
          }

          fsm.current     = 'none';
          fsm.is          = function(state) { return (state instanceof Array) ? (state.indexOf(this.current) >= 0) : (this.current === state); };
          fsm.can         = function(event) { return !this.transition && (map[event].hasOwnProperty(this.current) || map[event].hasOwnProperty(StateMachine.WILDCARD)); }
          fsm.cannot      = function(event) { return !this.can(event); };
          fsm.transitions = function()      { return transitions[this.current]; };
          fsm.isFinished  = function()      { return this.is(terminal); };
          fsm.error       = cfg.error || function(name, from, to, args, error, msg, e) { throw e || msg; }; // default behavior when something unexpected happens is to throw an exception, but caller can override this behavior if desired (see github issue #3 and #17)

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
            var to    = map[from] || map[StateMachine.WILDCARD] || from;
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
            }

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
      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = StateMachine;
        }
        exports.StateMachine = StateMachine;
      }
      //============
      // AMD/REQUIRE
      //============
      else if (typeof define === 'function' && define.amd) {
        define(function(require) { return StateMachine; });
      }
      //========
      // BROWSER
      //========
      else if (typeof window !== 'undefined') {
        window.StateMachine = StateMachine;
      }
      //===========
      // WEB WORKER
      //===========
      else if (typeof self !== 'undefined') {
        self.StateMachine = StateMachine;
      }

    }());
    });

    var StateMachine = interopDefault(stateMachine);

    var createCallStateMachine = (function () {
      return StateMachine.create({
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

    var inherit$1 = createCommonjsModule(function (module, exports) {
    /**
     * @module inherit
     * @version 2.2.4
     * @author Filatov Dmitry <dfilatov@yandex-team.ru>
     * @description This module provides some syntax sugar for "class" declarations, constructors, mixins, "super" calls and static members.
     */

    (function(global) {

    var hasIntrospection = (function(){'_';}).toString().indexOf('_') > -1,
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
            res = props.__constructor || (hasBase && base.prototype.__constructor)?
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
    if(typeof exports === 'object') {
        module.exports = inherit;
        defineAsGlobal = false;
    }

    if(typeof modules === 'object' && typeof modules.define === 'function') {
        modules.define('inherit', function(provide) {
            provide(inherit);
        });
        defineAsGlobal = false;
    }

    if(typeof define === 'function') {
        define(function(require, exports, module) {
            module.exports = inherit;
        });
        defineAsGlobal = false;
    }

    defineAsGlobal && (global.inherit = inherit);

    })(commonjsGlobal);
    });

    var inherit$2 = interopDefault(inherit$1);


    var require$$0$33 = Object.freeze({
        default: inherit$2
    });

    var index$3 = createCommonjsModule(function (module) {
    /*!
     * node-inherit
     * Copyright(c) 2011 Dmitry Filatov <dfilatov@yandex-team.ru>
     * MIT Licensed
     */

    module.exports = interopDefault(require$$0$33);
    });

    var inherit = interopDefault(index$3);

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

var     _dec$1;
var     _class$1;
    var ICECandidate = (_dec$1 = leancloudRealtime.messageType(-103), _dec$1(_class$1 = function (_Signaling) {
      _inherits(ICECandidate, _Signaling);

      function ICECandidate() {
        _classCallCheck(this, ICECandidate);

        return _possibleConstructorReturn(this, _Signaling.apply(this, arguments));
      }

      return ICECandidate;
    }(Signaling)) || _class$1);

var     _dec$2;
var     _class$2;
    var Refusal = (_dec$2 = leancloudRealtime.messageType(-104), _dec$2(_class$2 = function (_Signaling) {
      _inherits(Refusal, _Signaling);

      function Refusal() {
        _classCallCheck(this, Refusal);

        return _possibleConstructorReturn(this, _Signaling.apply(this, arguments));
      }

      return Refusal;
    }(Signaling)) || _class$2);

var     _dec$3;
var     _class$3;
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
          var _ref2 = _slicedToArray(_ref, 1);

          var stream = _ref2[0];

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

      Call.prototype._handleAnswer = function _handleAnswer() {
        throw new Error('not implemented');
      };

      Call.prototype._handleRefusal = function _handleRefusal() {
        throw new Error('not implemented');
      };

      Call.prototype._handleCancelation = function _handleCancelation() {
        throw new Error('not implemented');
      };

      _createClass(Call, [{
        key: 'state',
        get: function get() {
          return this._call.current;
        }
      }]);

      return Call;
    }(EventEmitter);

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

var     _dec$4;
var     _class$4;
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

        /** @type {string}*/
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
            throw new Error(targetId + ' is not online');
          }
          var outgoingCall = new OutgoingCall(targetId, null, _this3.options.RTCConfiguration);
          var promise = new _Promise(function (resolve) {
            outgoingCall._peerConnection.onnegotiationneeded = resolve;
          });
          outgoingCall._peerConnection.addStream(stream);
          return promise.then(function () {
            return _Promise.all([_this3._imClient.createConversation({
              members: [targetId],
              unique: true
            }), outgoingCall._peerConnection.createOffer().then(function (localDescription) {
              outgoingCall._peerConnection.setLocalDescription(localDescription);
            })]);
          }).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 1);

            var conversation = _ref2[0];

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
    }(EventEmitter);

    var name = "leancloud-realtime-plugin-webrtc";

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

    exports.WebRTCPlugin = WebRTCPlugin;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=webrtc.js.map