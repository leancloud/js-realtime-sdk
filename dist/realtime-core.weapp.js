(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('leancloud-realtime', ['exports'], factory) :
	(factory((global.AV = global.AV || {})));
}(this, (function (exports) { 'use strict';

	var define = undefined;
	var require = require || function(id) {throw new Error('Unexpected required ' + id)};



	var process = (window && window.process) || {};
	process.env = process.env || {};

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function unwrapExports (x) {
		return x && x.__esModule ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	// 7.1.4 ToInteger
	var ceil  = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function(TO_STRING){
	  return function(that, pos){
	    var s = String(_defined(that))
	      , i = _toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _library = true;

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

	var _ctx = function(fn, that, length){
	  _aFunction(fn);
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

	var _anObject = function(it){
	  if(!_isObject(it))throw TypeError(it + ' is not an object!');
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

	var document$1 = _global.document;
	var is = _isObject(document$1) && _isObject(document$1.createElement);
	var _domCreate = function(it){
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function(){
	  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function(it, S){
	  if(!_isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP             = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if(_ie8DomDefine)try {
	    return dP(O, P, Attributes);
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

	var _hide = _descriptors ? function(object, key, value){
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

	var PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? _core : _core[name] || (_core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE]
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
	    : IS_BIND && own ? _ctx(out, _global)
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
	    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])_hide(expProto, key, out);
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
	var _has = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

	var _iterators = {};

	var toString = {}.toString;

	var _cof = function(it){
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings

	var _toIobject = function(it){
	  return _iobject(_defined(it));
	};

	// 7.1.15 ToLength
	var min       = Math.min;
	var _toLength = function(it){
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max       = Math.max;
	var min$1       = Math.min;
	var _toIndex = function(index, length){
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes

	var _arrayIncludes = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = _toIobject($this)
	      , length = _toLength(O.length)
	      , index  = _toIndex(fromIndex, length)
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

	var SHARED = '__core-js_shared__';
	var store  = _global[SHARED] || (_global[SHARED] = {});
	var _shared = function(key){
	  return store[key] || (store[key] = {});
	};

	var id = 0;
	var px = Math.random();
	var _uid = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var shared = _shared('keys');
	var _sharedKey = function(key){
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO$1     = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function(object, names){
	  var O      = _toIobject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO$1)_has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(_has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)


	var _objectKeys = Object.keys || function keys(O){
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
	  _anObject(O);
	  var keys   = _objectKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)_objectDp.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var _html = _global.document && document.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var IE_PROTO    = _sharedKey('IE_PROTO');
	var Empty       = function(){ /* empty */ };
	var PROTOTYPE$1   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe')
	    , i      = _enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
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
	  while(i--)delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	var _wks = createCommonjsModule(function (module) {
	var store      = _shared('wks')
	  , Symbol     = _global.Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
	};

	$exports.store = store;
	});

	var def = _objectDp.f;
	var TAG = _wks('toStringTag');

	var _setToStringTag = function(it, tag, stat){
	  if(it && !_has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

	var _iterCreate = function(Constructor, NAME, next){
	  Constructor.prototype = _objectCreate(IteratorPrototype, {next: _propertyDesc(1, next)});
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	// 7.1.13 ToObject(argument)

	var _toObject = function(it){
	  return Object(_defined(it));
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var IE_PROTO$2    = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function(O){
	  O = _toObject(O);
	  if(_has(O, IE_PROTO$2))return O[IE_PROTO$2];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var ITERATOR       = _wks('iterator');
	var BUGGY          = !([].keys && 'next' in [].keys());
	var FF_ITERATOR    = '@@iterator';
	var KEYS           = 'keys';
	var VALUES         = 'values';

	var returnThis = function(){ return this; };

	var _iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  _iterCreate(Constructor, NAME, next);
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
	    IteratorPrototype = _objectGpo($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!_library && !_has(IteratorPrototype, ITERATOR))_hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    _hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  _iterators[NAME] = $default;
	  _iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))_redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	var $at  = _stringAt(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	_iterDefine(String, 'String', function(iterated){
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

	var _addToUnscopables = function(){ /* empty */ };

	var _iterStep = function(done, value){
	  return {value: value, done: !!done};
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
	  this._t = _toIobject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return _iterStep(1);
	  }
	  if(kind == 'keys'  )return _iterStep(0, index);
	  if(kind == 'values')return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	_iterators.Arguments = _iterators.Array;

	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	var TO_STRING_TAG = _wks('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = _global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])_hide(proto, TO_STRING_TAG, NAME);
	  _iterators[NAME] = _iterators.Array;
	}

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var TAG$1 = _wks('toStringTag');
	var ARG = _cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	var _classof = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
	    // builtinTag case
	    : ARG ? _cof(O)
	    // ES3 arguments fallback
	    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var _anInstance = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

	// call something on iterator step with safe closing on error

	var _iterCall = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)_anObject(ret.call(iterator));
	    throw e;
	  }
	};

	// check on default Array iterator
	var ITERATOR$1   = _wks('iterator');
	var ArrayProto = Array.prototype;

	var _isArrayIter = function(it){
	  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
	};

	var ITERATOR$2  = _wks('iterator');
	var core_getIteratorMethod = _core.getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR$2]
	    || it['@@iterator']
	    || _iterators[_classof(it)];
	};

	var _forOf = createCommonjsModule(function (module) {
	var BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : core_getIteratorMethod(iterable)
	    , f      = _ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(_isArrayIter(iterFn))for(length = _toLength(iterable.length); length > index; index++){
	    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = _iterCall(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;
	});

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var SPECIES   = _wks('species');
	var _speciesConstructor = function(O, D){
	  var C = _anObject(O).constructor, S;
	  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
	};

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	var _invoke = function(fn, args, that){
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

	var process$2            = _global.process;
	var setTask            = _global.setImmediate;
	var clearTask          = _global.clearImmediate;
	var MessageChannel     = _global.MessageChannel;
	var counter            = 0;
	var queue              = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer;
	var channel;
	var port;
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
	      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(_cof(process$2) == 'process'){
	    defer = function(id){
	      process$2.nextTick(_ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = _ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts){
	    defer = function(id){
	      _global.postMessage(id + '', '*');
	    };
	    _global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in _domCreate('script')){
	    defer = function(id){
	      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function(){
	        _html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(_ctx(run, id, 1), 0);
	    };
	  }
	}
	var _task = {
	  set:   setTask,
	  clear: clearTask
	};

	var macrotask = _task.set;
	var Observer  = _global.MutationObserver || _global.WebKitMutationObserver;
	var process$3   = _global.process;
	var Promise   = _global.Promise;
	var isNode$1    = _cof(process$3) == 'process';

	var _microtask = function(){
	  var head, last, notify;

	  var flush = function(){
	    var parent, fn;
	    if(isNode$1 && (parent = process$3.domain))parent.exit();
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
	  if(isNode$1){
	    notify = function(){
	      process$3.nextTick(flush);
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
	      macrotask.call(_global, flush);
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

	var _redefineAll = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else _hide(target, key, src[key]);
	  } return target;
	};

	var SPECIES$1     = _wks('species');

	var _setSpecies = function(KEY){
	  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
	  if(_descriptors && C && !C[SPECIES$1])_objectDp.f(C, SPECIES$1, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

	var ITERATOR$3     = _wks('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$3]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	var _iterDetect = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR$3]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR$3] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

	var task               = _task.set;
	var microtask          = _microtask();
	var PROMISE            = 'Promise';
	var TypeError$1          = _global.TypeError;
	var process$1            = _global.process;
	var $Promise           = _global[PROMISE];
	var process$1            = _global.process;
	var isNode             = _classof(process$1) == 'process';
	var empty              = function(){ /* empty */ };
	var Internal;
	var GenericPromiseCapability;
	var Wrapper;

	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[_wks('species')] = function(exec){ exec(empty, empty); };
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
	  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError$1('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = _aFunction(resolve);
	  this.reject  = _aFunction(reject);
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
	            reject(TypeError$1('Promise-chain cycle'));
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
	  task.call(_global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process$1.emit('unhandledRejection', value, promise);
	        } else if(handler = _global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = _global.console) && console.error){
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
	  task.call(_global, function(){
	    var handler;
	    if(isNode){
	      process$1.emit('rejectionHandled', promise);
	    } else if(handler = _global.onrejectionhandled){
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
	    if(promise === value)throw TypeError$1("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
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
	    _anInstance(this, $Promise, PROMISE, '_h');
	    _aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
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
	  Internal.prototype = _redefineAll($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(_speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process$1.domain : undefined;
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
	    this.resolve = _ctx($resolve, promise, 1);
	    this.reject  = _ctx($reject, promise, 1);
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE, {Promise: $Promise});
	_setToStringTag($Promise, PROMISE);
	_setSpecies(PROMISE);
	Wrapper = _core[PROMISE];

	// statics
	_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
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
	_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function(iter){
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
	      _forOf(iterable, false, function(promise){
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
	      _forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

	var promise$1 = _core.Promise;

	var promise = createCommonjsModule(function (module) {
	module.exports = { "default": promise$1, __esModule: true };
	});

	var _Promise = unwrapExports(promise);

	var f$1 = _wks;

	var _wksExt = {
		f: f$1
	};

	var iterator$2 = _wksExt.f('iterator');

	var iterator = createCommonjsModule(function (module) {
	module.exports = { "default": iterator$2, __esModule: true };
	});

	var _meta = createCommonjsModule(function (module) {
	var META     = _uid('meta')
	  , setDesc  = _objectDp.f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !_fails(function(){
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
	  if(!_isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!_has(it, META)){
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
	  if(!_has(it, META)){
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
	  if(FREEZE && meta.NEED && isExtensible(it) && !_has(it, META))setMeta(it);
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

	var defineProperty = _objectDp.f;
	var _wksDefine = function(name){
	  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: _wksExt.f(name)});
	};

	var _keyof = function(object, el){
	  var O      = _toIobject(object)
	    , keys   = _objectKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

	var f$2 = Object.getOwnPropertySymbols;

	var _objectGops = {
		f: f$2
	};

	var f$3 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$3
	};

	// all enumerable object keys, includes symbols

	var _enumKeys = function(it){
	  var result     = _objectKeys(it)
	    , getSymbols = _objectGops.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = _objectPie.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg){
	  return _cof(arg) == 'Array';
	};

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$5
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var gOPN$1      = _objectGopn.f;
	var toString$1  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN$1(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	var f$4 = function getOwnPropertyNames(it){
	  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
	};

	var _objectGopnExt = {
		f: f$4
	};

	var gOPD$1           = Object.getOwnPropertyDescriptor;

	var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P){
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if(_ie8DomDefine)try {
	    return gOPD$1(O, P);
	  } catch(e){ /* empty */ }
	  if(_has(O, P))return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$6
	};

	// ECMAScript 6 symbols shim
	var META           = _meta.KEY;
	var gOPD           = _objectGopd.f;
	var dP$1             = _objectDp.f;
	var gOPN           = _objectGopnExt.f;
	var $Symbol        = _global.Symbol;
	var $JSON          = _global.JSON;
	var _stringify     = $JSON && $JSON.stringify;
	var PROTOTYPE$2      = 'prototype';
	var HIDDEN         = _wks('_hidden');
	var TO_PRIMITIVE   = _wks('toPrimitive');
	var isEnum         = {}.propertyIsEnumerable;
	var SymbolRegistry = _shared('symbol-registry');
	var AllSymbols     = _shared('symbols');
	var OPSymbols      = _shared('op-symbols');
	var ObjectProto$1    = Object[PROTOTYPE$2];
	var USE_NATIVE$1     = typeof $Symbol == 'function';
	var QObject        = _global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = _descriptors && _fails(function(){
	  return _objectCreate(dP$1({}, 'a', {
	    get: function(){ return dP$1(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto$1, key);
	  if(protoDesc)delete ObjectProto$1[key];
	  dP$1(it, key, D);
	  if(protoDesc && it !== ObjectProto$1)dP$1(ObjectProto$1, key, protoDesc);
	} : dP$1;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE$1 && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto$1)$defineProperty(OPSymbols, key, D);
	  _anObject(it);
	  key = _toPrimitive(key, true);
	  _anObject(D);
	  if(_has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!_has(it, HIDDEN))dP$1(it, HIDDEN, _propertyDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(_has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _objectCreate(D, {enumerable: _propertyDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP$1(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  _anObject(it);
	  var keys = _enumKeys(P = _toIobject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = _toPrimitive(key, true));
	  if(this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key))return false;
	  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = _toIobject(it);
	  key = _toPrimitive(key, true);
	  if(it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(_toIobject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto$1
	    , names  = gOPN(IS_OP ? OPSymbols : _toIobject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE$1){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto$1)$set.call(OPSymbols, value);
	      if(_has(this, HIDDEN) && _has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, _propertyDesc(1, value));
	    };
	    if(_descriptors && setter)setSymbolDesc(ObjectProto$1, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString(){
	    return this._k;
	  });

	  _objectGopd.f = $getOwnPropertyDescriptor;
	  _objectDp.f   = $defineProperty;
	  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
	  _objectPie.f  = $propertyIsEnumerable;
	  _objectGops.f = $getOwnPropertySymbols;

	  if(_descriptors && !_library){
	    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  _wksExt.f = function(name){
	    return wrap(_wks(name));
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i$1 = 0; symbols.length > i$1; )_wks(symbols[i$1++]);

	for(var symbols = _objectKeys(_wks.store), i$1 = 0; symbols.length > i$1; )_wksDefine(symbols[i$1++]);

	_export(_export.S + _export.F * !USE_NATIVE$1, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return _has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return _keyof(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
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
	$JSON && _export(_export.S + _export.F * (!USE_NATIVE$1 || _fails(function(){
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
	    if($replacer || !_isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
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

	var index$2 = _core.Symbol;

	var symbol = createCommonjsModule(function (module) {
	module.exports = { "default": index$2, __esModule: true };
	});

	var _Symbol = unwrapExports(symbol);

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

	var _typeof = unwrapExports(_typeof_1);

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

	var Storage = function () {
	  function Storage() {
	    _classCallCheck(this, Storage);
	  }

	  Storage.prototype.getItem = function getItem(key) {
	    return wx.getStorageSync(key);
	  };

	  Storage.prototype.setItem = function setItem(key, value) {
	    return wx.setStorageSync(key, value);
	  };

	  Storage.prototype.removeItem = function removeItem(key) {
	    return this.setItem(key, '');
	  };

	  Storage.prototype.clear = function clear() {
	    return wx.clearStorageSync();
	  };

	  return Storage;
	}();

	var localstorage = new Storage();

	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	_export(_export.S + _export.F * !_descriptors, 'Object', {defineProperty: _objectDp.f});

	var $Object = _core.Object;
	var defineProperty$4 = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

	var defineProperty$2 = createCommonjsModule(function (module) {
	module.exports = { "default": defineProperty$4, __esModule: true };
	});

	var defineProperty$1 = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _defineProperty2 = _interopRequireDefault(defineProperty$2);

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

	var _defineProperty = unwrapExports(defineProperty$1);

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

	var check = function(O, proto){
	  _anObject(O);
	  if(!_isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
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

	// 19.1.3.19 Object.setPrototypeOf(O, proto)

	_export(_export.S, 'Object', {setPrototypeOf: _setProto.set});

	var setPrototypeOf$2 = _core.Object.setPrototypeOf;

	var setPrototypeOf = createCommonjsModule(function (module) {
	module.exports = { "default": setPrototypeOf$2, __esModule: true };
	});

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	_export(_export.S, 'Object', {create: _objectCreate});

	var $Object$1 = _core.Object;
	var create$3 = function create(P, D){
	  return $Object$1.create(P, D);
	};

	var create$1 = createCommonjsModule(function (module) {
	module.exports = { "default": create$3, __esModule: true };
	});

	var inherits = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf);



	var _create2 = _interopRequireDefault(create$1);



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

	var $JSON$1 = _core.JSON || (_core.JSON = {stringify: JSON.stringify});
	var stringify$1 = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON$1.stringify.apply($JSON$1, arguments);
	};

	var stringify = createCommonjsModule(function (module) {
	module.exports = { "default": stringify$1, __esModule: true };
	});

	var _JSON$stringify = unwrapExports(stringify);

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject$1(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	var index$4 = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject$1(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty$1.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};

	var commons = createCommonjsModule(function (module, exports) {
	/**
	 * @author Toru Nagashima
	 * @copyright 2015 Toru Nagashima. All rights reserved.
	 * See LICENSE file in root directory for full license.
	 */

	"use strict";

	/**
	 * Creates a unique key.
	 *
	 * @param {string} name - A name to create.
	 * @returns {symbol|string}
	 * @private
	 */
	var createUniqueKey = exports.createUniqueKey = (typeof Symbol !== "undefined" ?
	    Symbol :
	    function createUniqueKey(name) {
	        return "[[" + name + "_" + Math.random().toFixed(8).slice(2) + "]]";
	    });

	/**
	 * The key of listeners.
	 *
	 * @type {symbol|string}
	 * @private
	 */
	exports.LISTENERS = createUniqueKey("listeners");

	/**
	 * A value of kind for listeners which are registered in the capturing phase.
	 *
	 * @type {number}
	 * @private
	 */
	exports.CAPTURE = 1;

	/**
	 * A value of kind for listeners which are registered in the bubbling phase.
	 *
	 * @type {number}
	 * @private
	 */
	exports.BUBBLE = 2;

	/**
	 * A value of kind for listeners which are registered as an attribute.
	 *
	 * @type {number}
	 * @private
	 */
	exports.ATTRIBUTE = 3;

	/**
	 * @typedef object ListenerNode
	 * @property {function} listener - A listener function.
	 * @property {number} kind - The kind of the listener.
	 * @property {ListenerNode|null} next - The next node.
	 *      If this node is the last, this is `null`.
	 */

	/**
	 * Creates a node of singly linked list for a list of listeners.
	 *
	 * @param {function} listener - A listener function.
	 * @param {number} kind - The kind of the listener.
	 * @returns {ListenerNode} The created listener node.
	 */
	exports.newNode = function newNode(listener, kind) {
	    return {listener: listener, kind: kind, next: null};
	};
	});

	//-----------------------------------------------------------------------------
	// Requirements
	//-----------------------------------------------------------------------------


	var LISTENERS = commons.LISTENERS;
	var ATTRIBUTE = commons.ATTRIBUTE;
	var newNode = commons.newNode;

	//-----------------------------------------------------------------------------
	// Helpers
	//-----------------------------------------------------------------------------

	/**
	 * Gets a specified attribute listener from a given EventTarget object.
	 *
	 * @param {EventTarget} eventTarget - An EventTarget object to get.
	 * @param {string} type - An event type to get.
	 * @returns {function|null} The found attribute listener.
	 */
	function getAttributeListener(eventTarget, type) {
	    var node = eventTarget[LISTENERS][type];
	    while (node != null) {
	        if (node.kind === ATTRIBUTE) {
	            return node.listener;
	        }
	        node = node.next;
	    }
	    return null;
	}

	/**
	 * Sets a specified attribute listener to a given EventTarget object.
	 *
	 * @param {EventTarget} eventTarget - An EventTarget object to set.
	 * @param {string} type - An event type to set.
	 * @param {function|null} listener - A listener to be set.
	 * @returns {void}
	 */
	function setAttributeListener(eventTarget, type, listener) {
	    if (typeof listener !== "function" && typeof listener !== "object") {
	        listener = null; // eslint-disable-line no-param-reassign
	    }

	    var prev = null;
	    var node = eventTarget[LISTENERS][type];
	    while (node != null) {
	        if (node.kind === ATTRIBUTE) {
	            // Remove old value.
	            if (prev == null) {
	                eventTarget[LISTENERS][type] = node.next;
	            }
	            else {
	                prev.next = node.next;
	            }
	        }
	        else {
	            prev = node;
	        }

	        node = node.next;
	    }

	    // Add new value.
	    if (listener != null) {
	        if (prev == null) {
	            eventTarget[LISTENERS][type] = newNode(listener, ATTRIBUTE);
	        }
	        else {
	            prev.next = newNode(listener, ATTRIBUTE);
	        }
	    }
	}

	//-----------------------------------------------------------------------------
	// Public Interface
	//-----------------------------------------------------------------------------

	/**
	 * Defines an `EventTarget` implementation which has `onfoobar` attributes.
	 *
	 * @param {EventTarget} EventTargetBase - A base implementation of EventTarget.
	 * @param {string[]} types - A list of event types which are defined as attribute listeners.
	 * @returns {EventTarget} The defined `EventTarget` implementation which has attribute listeners.
	 */
	var defineCustomEventTarget = function(EventTargetBase, types) {
	    function EventTarget() {
	        EventTargetBase.call(this);
	    }

	    var descripter = {
	        constructor: {
	            value: EventTarget,
	            configurable: true,
	            writable: true
	        }
	    };

	    types.forEach(function(type) {
	        descripter["on" + type] = {
	            get: function() { return getAttributeListener(this, type); },
	            set: function(listener) { setAttributeListener(this, type, listener); },
	            configurable: true,
	            enumerable: true
	        };
	    });

	    EventTarget.prototype = Object.create(EventTargetBase.prototype, descripter);

	    return EventTarget;
	};

	var customEventTarget = {
		defineCustomEventTarget: defineCustomEventTarget
	};

	//-----------------------------------------------------------------------------
	// Requirements
	//-----------------------------------------------------------------------------

	var createUniqueKey = commons.createUniqueKey;

	//-----------------------------------------------------------------------------
	// Constsnts
	//-----------------------------------------------------------------------------

	/**
	 * The key of the flag which is turned on by `stopImmediatePropagation` method.
	 *
	 * @type {symbol|string}
	 * @private
	 */
	var STOP_IMMEDIATE_PROPAGATION_FLAG =
	    createUniqueKey("stop_immediate_propagation_flag");

	/**
	 * The key of the flag which is turned on by `preventDefault` method.
	 *
	 * @type {symbol|string}
	 * @private
	 */
	var CANCELED_FLAG = createUniqueKey("canceled_flag");

	/**
	 * The key of the original event object.
	 *
	 * @type {symbol|string}
	 * @private
	 */
	var ORIGINAL_EVENT = createUniqueKey("original_event");

	/**
	 * Method definitions for the event wrapper.
	 *
	 * @type {object}
	 * @private
	 */
	var wrapperPrototypeDefinition = Object.freeze({
	    stopPropagation: Object.freeze({
	        value: function stopPropagation() {
	            var e = this[ORIGINAL_EVENT];
	            if (typeof e.stopPropagation === "function") {
	                e.stopPropagation();
	            }
	        },
	        writable: true,
	        configurable: true
	    }),

	    stopImmediatePropagation: Object.freeze({
	        value: function stopImmediatePropagation() {
	            this[STOP_IMMEDIATE_PROPAGATION_FLAG] = true;

	            var e = this[ORIGINAL_EVENT];
	            if (typeof e.stopImmediatePropagation === "function") {
	                e.stopImmediatePropagation();
	            }
	        },
	        writable: true,
	        configurable: true
	    }),

	    preventDefault: Object.freeze({
	        value: function preventDefault() {
	            if (this.cancelable === true) {
	                this[CANCELED_FLAG] = true;
	            }

	            var e = this[ORIGINAL_EVENT];
	            if (typeof e.preventDefault === "function") {
	                e.preventDefault();
	            }
	        },
	        writable: true,
	        configurable: true
	    }),

	    defaultPrevented: Object.freeze({
	        get: function defaultPrevented() { return this[CANCELED_FLAG]; },
	        enumerable: true,
	        configurable: true
	    })
	});

	//-----------------------------------------------------------------------------
	// Public Interface
	//-----------------------------------------------------------------------------

	var STOP_IMMEDIATE_PROPAGATION_FLAG_1 = STOP_IMMEDIATE_PROPAGATION_FLAG;

	/**
	 * Creates an event wrapper.
	 *
	 * We cannot modify several properties of `Event` object, so we need to create the wrapper.
	 * Plus, this wrapper supports non `Event` objects.
	 *
	 * @param {Event|{type: string}} event - An original event to create the wrapper.
	 * @param {EventTarget} eventTarget - The event target of the event.
	 * @returns {Event} The created wrapper. This object is implemented `Event` interface.
	 * @private
	 */
	var createEventWrapper = function createEventWrapper(event, eventTarget) {
	    var timeStamp = (
	        typeof event.timeStamp === "number" ? event.timeStamp : Date.now()
	    );
	    var propertyDefinition = {
	        type: {value: event.type, enumerable: true},
	        target: {value: eventTarget, enumerable: true},
	        currentTarget: {value: eventTarget, enumerable: true},
	        eventPhase: {value: 2, enumerable: true},
	        bubbles: {value: Boolean(event.bubbles), enumerable: true},
	        cancelable: {value: Boolean(event.cancelable), enumerable: true},
	        timeStamp: {value: timeStamp, enumerable: true},
	        isTrusted: {value: false, enumerable: true}
	    };
	    propertyDefinition[STOP_IMMEDIATE_PROPAGATION_FLAG] = {value: false, writable: true};
	    propertyDefinition[CANCELED_FLAG] = {value: false, writable: true};
	    propertyDefinition[ORIGINAL_EVENT] = {value: event};

	    // For CustomEvent.
	    if (typeof event.detail !== "undefined") {
	        propertyDefinition.detail = {value: event.detail, enumerable: true};
	    }

	    return Object.create(
	        Object.create(event, wrapperPrototypeDefinition),
	        propertyDefinition
	    );
	};

	var eventWrapper = {
		STOP_IMMEDIATE_PROPAGATION_FLAG: STOP_IMMEDIATE_PROPAGATION_FLAG_1,
		createEventWrapper: createEventWrapper
	};

	var eventTarget = createCommonjsModule(function (module) {
	/**
	 * @author Toru Nagashima
	 * @copyright 2015 Toru Nagashima. All rights reserved.
	 * See LICENSE file in root directory for full license.
	 */

	"use strict";

	//-----------------------------------------------------------------------------
	// Requirements
	//-----------------------------------------------------------------------------




	var LISTENERS = commons.LISTENERS;
	var CAPTURE = commons.CAPTURE;
	var BUBBLE = commons.BUBBLE;
	var ATTRIBUTE = commons.ATTRIBUTE;
	var newNode = commons.newNode;
	var defineCustomEventTarget = customEventTarget.defineCustomEventTarget;
	var createEventWrapper = eventWrapper.createEventWrapper;
	var STOP_IMMEDIATE_PROPAGATION_FLAG =
	    eventWrapper.STOP_IMMEDIATE_PROPAGATION_FLAG;

	//-----------------------------------------------------------------------------
	// Constants
	//-----------------------------------------------------------------------------

	/**
	 * A flag which shows there is the native `EventTarget` interface object.
	 *
	 * @type {boolean}
	 * @private
	 */
	var HAS_EVENTTARGET_INTERFACE = (
	    typeof window !== "undefined" &&
	    typeof window.EventTarget !== "undefined"
	);

	//-----------------------------------------------------------------------------
	// Public Interface
	//-----------------------------------------------------------------------------

	/**
	 * An implementation for `EventTarget` interface.
	 *
	 * @constructor
	 * @public
	 */
	var EventTarget = module.exports = function EventTarget() {
	    if (this instanceof EventTarget) {
	        // this[LISTENERS] is a Map.
	        // Its key is event type.
	        // Its value is ListenerNode object or null.
	        //
	        // interface ListenerNode {
	        //     var listener: Function
	        //     var kind: CAPTURE|BUBBLE|ATTRIBUTE
	        //     var next: ListenerNode|null
	        // }
	        Object.defineProperty(this, LISTENERS, {value: Object.create(null)});
	    }
	    else if (arguments.length === 1 && Array.isArray(arguments[0])) {
	        return defineCustomEventTarget(EventTarget, arguments[0]);
	    }
	    else if (arguments.length > 0) {
	        var types = Array(arguments.length);
	        for (var i = 0; i < arguments.length; ++i) {
	            types[i] = arguments[i];
	        }

	        // To use to extend with attribute listener properties.
	        // e.g.
	        //     class MyCustomObject extends EventTarget("message", "error") {
	        //         //...
	        //     }
	        return defineCustomEventTarget(EventTarget, types);
	    }
	    else {
	        throw new TypeError("Cannot call a class as a function");
	    }
	};

	EventTarget.prototype = Object.create(
	    (HAS_EVENTTARGET_INTERFACE ? window.EventTarget : Object).prototype,
	    {
	        constructor: {
	            value: EventTarget,
	            writable: true,
	            configurable: true
	        },

	        addEventListener: {
	            value: function addEventListener(type, listener, capture) {
	                if (listener == null) {
	                    return false;
	                }
	                if (typeof listener !== "function" && typeof listener !== "object") {
	                    throw new TypeError("\"listener\" is not an object.");
	                }

	                var kind = (capture ? CAPTURE : BUBBLE);
	                var node = this[LISTENERS][type];
	                if (node == null) {
	                    this[LISTENERS][type] = newNode(listener, kind);
	                    return true;
	                }

	                var prev = null;
	                while (node != null) {
	                    if (node.listener === listener && node.kind === kind) {
	                        // Should ignore a duplicated listener.
	                        return false;
	                    }
	                    prev = node;
	                    node = node.next;
	                }

	                prev.next = newNode(listener, kind);
	                return true;
	            },
	            configurable: true,
	            writable: true
	        },

	        removeEventListener: {
	            value: function removeEventListener(type, listener, capture) {
	                if (listener == null) {
	                    return false;
	                }

	                var kind = (capture ? CAPTURE : BUBBLE);
	                var prev = null;
	                var node = this[LISTENERS][type];
	                while (node != null) {
	                    if (node.listener === listener && node.kind === kind) {
	                        if (prev == null) {
	                            this[LISTENERS][type] = node.next;
	                        }
	                        else {
	                            prev.next = node.next;
	                        }
	                        return true;
	                    }

	                    prev = node;
	                    node = node.next;
	                }

	                return false;
	            },
	            configurable: true,
	            writable: true
	        },

	        dispatchEvent: {
	            value: function dispatchEvent(event) {
	                // If listeners aren't registered, terminate.
	                var node = this[LISTENERS][event.type];
	                if (node == null) {
	                    return true;
	                }

	                // Since we cannot rewrite several properties, so wrap object.
	                var wrapped = createEventWrapper(event, this);

	                // This doesn't process capturing phase and bubbling phase.
	                // This isn't participating in a tree.
	                while (node != null) {
	                    if (typeof node.listener === "function") {
	                        node.listener.call(this, wrapped);
	                    }
	                    else if (node.kind !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
	                        node.listener.handleEvent(wrapped);
	                    }

	                    if (wrapped[STOP_IMMEDIATE_PROPAGATION_FLAG]) {
	                        break;
	                    }
	                    node = node.next;
	                }

	                return !wrapped.defaultPrevented;
	            },
	            configurable: true,
	            writable: true
	        }
	    }
	);
	});

	var FormData$1 = function () {
	  function FormData() {
	    _classCallCheck(this, FormData);

	    this._entries = [];
	  }

	  FormData.prototype.append = function append(name, value) {
	    if (typeof name !== 'string') {
	      throw new TypeError('FormData name must be a string');
	    }
	    if (typeof value !== 'string') {
	      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || typeof value.uri !== 'string') {
	        throw new TypeError('FormData value must be a string or { uri: tempFilePath }');
	      }
	    }
	    this._entries.push([name, value]);
	  };

	  FormData.prototype.set = function set(name, value) {
	    var entry = this.get(name);
	    if (entry) {
	      entry[1] = value;
	    } else {
	      this.append(name, value);
	    }
	  };

	  FormData.prototype.delete = function _delete(name) {
	    this._entries = this._entries.filter(function (entry) {
	      return entry[0] !== name;
	    });
	  };

	  FormData.prototype.entries = function entries() {
	    return this._entries;
	  };

	  FormData.prototype.get = function get(name) {
	    return this._entries.find(function (entry) {
	      return entry[0] === name;
	    });
	  };

	  FormData.prototype.getAll = function getAll(name) {
	    return this._entries.filter(function (entry) {
	      return entry[0] === name;
	    });
	  };

	  FormData.prototype.has = function has(name) {
	    return this._entries.some(function (entry) {
	      return entry[0] === name;
	    });
	  };

	  FormData.prototype.keys = function keys() {
	    return this._entries.map(function (entry) {
	      return entry[0];
	    });
	  };

	  FormData.prototype.values = function values() {
	    return this._entries.map(function (entry) {
	      return entry[1];
	    });
	  };

	  return FormData;
	}();

	var formdata = FormData$1;

	var UNSENT = 0;
	var OPENED = 1;
	var HEADERS_RECEIVED = 2;
	var LOADING = 3;
	var DONE = 4;

	var REQUEST_EVENTS = ['abort', 'error', 'load', 'loadstart', 'progress', 'timeout', 'loadend', 'readystatechange'];

	function successCallback(response) {
	  this.status = response.statusCode;
	  this.statusText = response.statusCode;
	  var text = response.data;
	  if (typeof text !== 'string') {
	    text = _JSON$stringify(text);
	  }
	  this.responseText = this.response = text;
	  this.readyState = DONE;
	  this.dispatchEvent({ type: 'readystatechange' });
	}

	var XMLHttpRequest$1 = function (_EventTarget) {
	  _inherits(XMLHttpRequest, _EventTarget);

	  function XMLHttpRequest() {
	    _classCallCheck(this, XMLHttpRequest);

	    var _this = _possibleConstructorReturn(this, _EventTarget.call(this));

	    _this.readyState = UNSENT;
	    _this._headers = {};
	    return _this;
	  }

	  XMLHttpRequest.prototype.abort = function abort() {
	    throw new Error('not supported in weapp');
	  };

	  XMLHttpRequest.prototype.getAllResponseHeaders = function getAllResponseHeaders() {
	    console.warn('getAllResponseHeaders always returns \'\'');
	    return '';
	  };

	  XMLHttpRequest.prototype.getResponseHeader = function getResponseHeader(key) {
	    if (key === 'content-type') {
	      console.warn('get content-type always returns \'application/json\'');
	      return 'application/json';
	    }
	    console.warn('getResponseHeader always returns \'\'');
	    return '';
	  };

	  XMLHttpRequest.prototype.overrideMimeType = function overrideMimeType() {
	    throw new Error('not supported in weapp');
	  };

	  XMLHttpRequest.prototype.open = function open(method, url) {
	    var async = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	    if (this.readyState !== UNSENT) {
	      throw new Error('request is already opened');
	    }
	    if (!async) {
	      throw new Error('sync request is not supported');
	    }
	    this._method = method;
	    this._url = url;
	    this.readyState = OPENED;
	    this.dispatchEvent({ type: 'readystatechange' });
	  };

	  XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(header, value) {
	    if (this.readyState !== OPENED) {
	      throw new Error('request is not opened');
	    }
	    this._headers[header.toLowerCase()] = value;
	  };

	  XMLHttpRequest.prototype.send = function send(data) {
	    var _this2 = this;

	    if (this.readyState !== OPENED) {
	      throw new Error('request is not opened');
	    }
	    if (data instanceof formdata) {
	      var entries = data.entries();
	      var blobs = entries.filter(function (entry) {
	        return typeof entry[1] !== 'string';
	      });
	      if (blobs.length === 0) {
	        throw new Error('Must specify a Blob field in FormData');
	      }
	      if (blobs.length > 1) {
	        console.warn('Only the first Blob will be send in Weapp');
	      }
	      var restData = entries.filter(function (entry) {
	        return typeof entry[1] === 'string';
	      }).reduce(function (result, entry) {
	        return index$4(result, _defineProperty({}, entry[0], entry[1]));
	      }, {});
	      wx.uploadFile({
	        url: this._url,
	        name: blobs[0][0],
	        filePath: blobs[0][1].uri,
	        formData: restData,
	        header: this._headers,
	        success: successCallback.bind(this),
	        fail: function fail(error) {
	          _this2.status = 0;
	          _this2.readyState = DONE;
	          _this2.dispatchEvent({ type: 'readystatechange' });
	          _this2.dispatchEvent({ type: 'error' });
	        }
	      });
	    } else {
	      wx.request({
	        url: this._url,
	        data: data || '',
	        // method 的 value 居然必须为大写
	        method: this._method.toUpperCase(),
	        header: this._headers,
	        success: successCallback.bind(this),
	        fail: function fail(error) {
	          _this2.status = 0;
	          _this2.readyState = DONE;
	          _this2.dispatchEvent({ type: 'readystatechange' });
	          _this2.dispatchEvent({ type: 'error' });
	        }
	      });
	    }
	  };

	  return XMLHttpRequest;
	}(eventTarget(REQUEST_EVENTS));

	index$4(XMLHttpRequest$1, {
	  UNSENT: UNSENT,
	  OPENED: OPENED,
	  HEADERS_RECEIVED: HEADERS_RECEIVED,
	  LOADING: LOADING,
	  DONE: DONE
	});

	var xmlhttprequest = XMLHttpRequest$1;

	var createClass = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _defineProperty2 = _interopRequireDefault(defineProperty$2);

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

	var CONNECTING = 0;
	var OPEN = 1;
	var CLOSING = 2;
	var CLOSED = 3;

	var EVENTS = ['open', 'error', 'message', 'close'];

	var instance = void 0;

	function errorHandler(event) {
	  // 安卓小程序会诡异地触发 onSocketError 回调
	  // 通过比较 message 过滤掉
	  if (event.message === "") return;
	  if (instance) {
	    instance._readyState = CLOSED;
	    instance.dispatchEvent({
	      type: 'error',
	      message: event.errMsg
	    });
	  }
	}

	var WebSocket$1 = function (_EventTarget) {
	  _inherits(WebSocket, _EventTarget);

	  function WebSocket(url, protocal) {
	    _classCallCheck(this, WebSocket);

	    if (!url) {
	      throw new TypeError('Failed to construct \'WebSocket\': url required');
	    }
	    if (protocal) {
	      throw new Error('subprotocal not supported in weapp');
	    }

	    var _this = _possibleConstructorReturn(this, _EventTarget.call(this));

	    _this._url = url;
	    _this._protocal = ''; // default value according to specs
	    _this._readyState = CONNECTING;
	    if (instance) {
	      instance.dispatchEvent({
	        type: 'close'
	      });
	    }
	    instance = _this;

	    wx.onSocketOpen(function (event) {
	      if (instance) {
	        instance._readyState = OPEN;
	        instance.dispatchEvent({
	          type: 'open'
	        });
	      }
	    });
	    wx.onSocketError(errorHandler);
	    wx.onSocketMessage(function (event) {
	      if (instance) {
	        var data = event.data,
	            origin = event.origin,
	            ports = event.ports,
	            source = event.source;

	        instance.dispatchEvent({
	          data: data,
	          origin: origin,
	          ports: ports,
	          source: source,
	          type: 'message'
	        });
	      }
	    });
	    wx.onSocketClose(function (event) {
	      if (instance) {
	        instance._readyState = CLOSED;
	        var code = event.code,
	            reason = event.reason,
	            wasClean = event.wasClean;

	        instance.dispatchEvent({
	          code: code,
	          reason: reason,
	          wasClean: wasClean,
	          type: 'close'
	        });
	        instance = null;
	      }
	    });

	    wx.connectSocket({
	      url: url,
	      fail: function fail(error) {
	        return setTimeout(function () {
	          return errorHandler(error);
	        }, 0);
	      }
	    });
	    return _this;
	  }

	  WebSocket.prototype.close = function close() {
	    if (this.readyState === CONNECTING) {
	      console.warn('close WebSocket which is connecting might not work');
	    }
	    wx.closeSocket();
	  };

	  WebSocket.prototype.send = function send(data) {
	    if (this.readyState !== OPEN) {
	      throw new Error('INVALID_STATE_ERR');
	    }

	    if (typeof data !== 'string') {
	      throw new TypeError('only string typed data are supported');
	    }

	    wx.sendSocketMessage({
	      data: data
	    });
	  };

	  _createClass(WebSocket, [{
	    key: 'url',
	    get: function get() {
	      return this._url;
	    }
	  }, {
	    key: 'protocal',
	    get: function get() {
	      return this._protocal;
	    }
	  }, {
	    key: 'readyState',
	    get: function get() {
	      return this._readyState;
	    }
	  }]);

	  return WebSocket;
	}(eventTarget(EVENTS));

	index$4(WebSocket$1, {
	  CONNECTING: CONNECTING,
	  OPEN: OPEN,
	  CLOSING: CLOSING,
	  CLOSED: CLOSED
	});

	var websocket = WebSocket$1;

	var navigator$1 = {};

	var index = {
	  polyfill: function polyfill() {
	    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : commonjsGlobal || window;

	    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
	      throw new Error('polyfill target is not an Object');
	    }
	    var polyfills = {
	      localStorage: localstorage,
	      XMLHttpRequest: xmlhttprequest,
	      FormData: formdata,
	      WebSocket: websocket,
	      Object: Object,
	      navigator: navigator$1
	    };
	    for (var k in polyfills) {
	      if (!target[k]) target[k] = polyfills[k];
	    }
	  },

	  localStorage: localstorage,
	  XMLHttpRequest: xmlhttprequest,
	  FormData: formdata,
	  WebSocket: websocket
	};

	var polyfill = index.polyfill;
	window = window || {};
	polyfill();
	polyfill(window);
	try {
	  localStorage = localStorage || localstorage;
	} catch (e) {}
	try {
	  XMLHttpRequest = XMLHttpRequest || xmlhttprequest;
	} catch (e) {}
	try {
	  FormData = FormData || formdata;
	} catch (e) {}
	try {
	  WebSocket = WebSocket || websocket;
	} catch (e) {}
	try {
	  navigator = navigator || navigator$1;
	} catch (e) {}

	// eslint-disable-next-line import/no-extraneous-dependencies

	var long_1 = createCommonjsModule(function (module) {
	/*
	 Copyright 2013 Daniel Wirtz <dcode@dcode.io>
	 Copyright 2009 The Closure Library Authors. All Rights Reserved.

	 Licensed under the Apache License, Version 2.0 (the "License");
	 you may not use this file except in compliance with the License.
	 You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

	 Unless required by applicable law or agreed to in writing, software
	 distributed under the License is distributed on an "AS-IS" BASIS,
	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 See the License for the specific language governing permissions and
	 limitations under the License.
	 */

	/**
	 * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
	 * Released under the Apache License, Version 2.0
	 * see: https://github.com/dcodeIO/long.js for details
	 */
	(function(global, factory) {

	    /* AMD */ if (typeof undefined === 'function' && undefined["amd"])
	        undefined([], factory);
	    /* CommonJS */ else if (typeof commonjsRequire === 'function' && 'object' === "object" && module && module["exports"])
	        module["exports"] = factory();
	    /* Global */ else
	        (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();

	})(commonjsGlobal, function() {
	    "use strict";

	    /**
	     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
	     *  See the from* functions below for more convenient ways of constructing Longs.
	     * @exports Long
	     * @class A Long class for representing a 64 bit two's-complement integer value.
	     * @param {number} low The low (signed) 32 bits of the long
	     * @param {number} high The high (signed) 32 bits of the long
	     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @constructor
	     */
	    function Long(low, high, unsigned) {

	        /**
	         * The low 32 bits as a signed value.
	         * @type {number}
	         */
	        this.low = low | 0;

	        /**
	         * The high 32 bits as a signed value.
	         * @type {number}
	         */
	        this.high = high | 0;

	        /**
	         * Whether unsigned or not.
	         * @type {boolean}
	         */
	        this.unsigned = !!unsigned;
	    }

	    // The internal representation of a long is the two given signed, 32-bit values.
	    // We use 32-bit pieces because these are the size of integers on which
	    // Javascript performs bit-operations.  For operations like addition and
	    // multiplication, we split each number into 16 bit pieces, which can easily be
	    // multiplied within Javascript's floating-point representation without overflow
	    // or change in sign.
	    //
	    // In the algorithms below, we frequently reduce the negative case to the
	    // positive case by negating the input(s) and then post-processing the result.
	    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
	    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
	    // a positive number, it overflows back into a negative).  Not handling this
	    // case would often result in infinite recursion.
	    //
	    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
	    // methods on which they depend.

	    /**
	     * An indicator used to reliably determine if an object is a Long or not.
	     * @type {boolean}
	     * @const
	     * @private
	     */
	    Long.prototype.__isLong__;

	    Object.defineProperty(Long.prototype, "__isLong__", {
	        value: true,
	        enumerable: false,
	        configurable: false
	    });

	    /**
	     * @function
	     * @param {*} obj Object
	     * @returns {boolean}
	     * @inner
	     */
	    function isLong(obj) {
	        return (obj && obj["__isLong__"]) === true;
	    }

	    /**
	     * Tests if the specified object is a Long.
	     * @function
	     * @param {*} obj Object
	     * @returns {boolean}
	     */
	    Long.isLong = isLong;

	    /**
	     * A cache of the Long representations of small integer values.
	     * @type {!Object}
	     * @inner
	     */
	    var INT_CACHE = {};

	    /**
	     * A cache of the Long representations of small unsigned integer values.
	     * @type {!Object}
	     * @inner
	     */
	    var UINT_CACHE = {};

	    /**
	     * @param {number} value
	     * @param {boolean=} unsigned
	     * @returns {!Long}
	     * @inner
	     */
	    function fromInt(value, unsigned) {
	        var obj, cachedObj, cache;
	        if (unsigned) {
	            value >>>= 0;
	            if (cache = (0 <= value && value < 256)) {
	                cachedObj = UINT_CACHE[value];
	                if (cachedObj)
	                    return cachedObj;
	            }
	            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
	            if (cache)
	                UINT_CACHE[value] = obj;
	            return obj;
	        } else {
	            value |= 0;
	            if (cache = (-128 <= value && value < 128)) {
	                cachedObj = INT_CACHE[value];
	                if (cachedObj)
	                    return cachedObj;
	            }
	            obj = fromBits(value, value < 0 ? -1 : 0, false);
	            if (cache)
	                INT_CACHE[value] = obj;
	            return obj;
	        }
	    }

	    /**
	     * Returns a Long representing the given 32 bit integer value.
	     * @function
	     * @param {number} value The 32 bit integer in question
	     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @returns {!Long} The corresponding Long value
	     */
	    Long.fromInt = fromInt;

	    /**
	     * @param {number} value
	     * @param {boolean=} unsigned
	     * @returns {!Long}
	     * @inner
	     */
	    function fromNumber(value, unsigned) {
	        if (isNaN(value) || !isFinite(value))
	            return unsigned ? UZERO : ZERO;
	        if (unsigned) {
	            if (value < 0)
	                return UZERO;
	            if (value >= TWO_PWR_64_DBL)
	                return MAX_UNSIGNED_VALUE;
	        } else {
	            if (value <= -TWO_PWR_63_DBL)
	                return MIN_VALUE;
	            if (value + 1 >= TWO_PWR_63_DBL)
	                return MAX_VALUE;
	        }
	        if (value < 0)
	            return fromNumber(-value, unsigned).neg();
	        return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
	    }

	    /**
	     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
	     * @function
	     * @param {number} value The number in question
	     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @returns {!Long} The corresponding Long value
	     */
	    Long.fromNumber = fromNumber;

	    /**
	     * @param {number} lowBits
	     * @param {number} highBits
	     * @param {boolean=} unsigned
	     * @returns {!Long}
	     * @inner
	     */
	    function fromBits(lowBits, highBits, unsigned) {
	        return new Long(lowBits, highBits, unsigned);
	    }

	    /**
	     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
	     *  assumed to use 32 bits.
	     * @function
	     * @param {number} lowBits The low 32 bits
	     * @param {number} highBits The high 32 bits
	     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @returns {!Long} The corresponding Long value
	     */
	    Long.fromBits = fromBits;

	    /**
	     * @function
	     * @param {number} base
	     * @param {number} exponent
	     * @returns {number}
	     * @inner
	     */
	    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

	    /**
	     * @param {string} str
	     * @param {(boolean|number)=} unsigned
	     * @param {number=} radix
	     * @returns {!Long}
	     * @inner
	     */
	    function fromString(str, unsigned, radix) {
	        if (str.length === 0)
	            throw Error('empty string');
	        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
	            return ZERO;
	        if (typeof unsigned === 'number') {
	            // For goog.math.long compatibility
	            radix = unsigned,
	            unsigned = false;
	        } else {
	            unsigned = !! unsigned;
	        }
	        radix = radix || 10;
	        if (radix < 2 || 36 < radix)
	            throw RangeError('radix');

	        var p;
	        if ((p = str.indexOf('-')) > 0)
	            throw Error('interior hyphen');
	        else if (p === 0) {
	            return fromString(str.substring(1), unsigned, radix).neg();
	        }

	        // Do several (8) digits each time through the loop, so as to
	        // minimize the calls to the very expensive emulated div.
	        var radixToPower = fromNumber(pow_dbl(radix, 8));

	        var result = ZERO;
	        for (var i = 0; i < str.length; i += 8) {
	            var size = Math.min(8, str.length - i),
	                value = parseInt(str.substring(i, i + size), radix);
	            if (size < 8) {
	                var power = fromNumber(pow_dbl(radix, size));
	                result = result.mul(power).add(fromNumber(value));
	            } else {
	                result = result.mul(radixToPower);
	                result = result.add(fromNumber(value));
	            }
	        }
	        result.unsigned = unsigned;
	        return result;
	    }

	    /**
	     * Returns a Long representation of the given string, written using the specified radix.
	     * @function
	     * @param {string} str The textual representation of the Long
	     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
	     * @returns {!Long} The corresponding Long value
	     */
	    Long.fromString = fromString;

	    /**
	     * @function
	     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
	     * @returns {!Long}
	     * @inner
	     */
	    function fromValue(val) {
	        if (val /* is compatible */ instanceof Long)
	            return val;
	        if (typeof val === 'number')
	            return fromNumber(val);
	        if (typeof val === 'string')
	            return fromString(val);
	        // Throws for non-objects, converts non-instanceof Long:
	        return fromBits(val.low, val.high, val.unsigned);
	    }

	    /**
	     * Converts the specified value to a Long.
	     * @function
	     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
	     * @returns {!Long}
	     */
	    Long.fromValue = fromValue;

	    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
	    // no runtime penalty for these.

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_16_DBL = 1 << 16;

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_24_DBL = 1 << 24;

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

	    /**
	     * @type {!Long}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var ZERO = fromInt(0);

	    /**
	     * Signed zero.
	     * @type {!Long}
	     */
	    Long.ZERO = ZERO;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var UZERO = fromInt(0, true);

	    /**
	     * Unsigned zero.
	     * @type {!Long}
	     */
	    Long.UZERO = UZERO;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var ONE = fromInt(1);

	    /**
	     * Signed one.
	     * @type {!Long}
	     */
	    Long.ONE = ONE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var UONE = fromInt(1, true);

	    /**
	     * Unsigned one.
	     * @type {!Long}
	     */
	    Long.UONE = UONE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var NEG_ONE = fromInt(-1);

	    /**
	     * Signed negative one.
	     * @type {!Long}
	     */
	    Long.NEG_ONE = NEG_ONE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

	    /**
	     * Maximum signed value.
	     * @type {!Long}
	     */
	    Long.MAX_VALUE = MAX_VALUE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

	    /**
	     * Maximum unsigned value.
	     * @type {!Long}
	     */
	    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var MIN_VALUE = fromBits(0, 0x80000000|0, false);

	    /**
	     * Minimum signed value.
	     * @type {!Long}
	     */
	    Long.MIN_VALUE = MIN_VALUE;

	    /**
	     * @alias Long.prototype
	     * @inner
	     */
	    var LongPrototype = Long.prototype;

	    /**
	     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
	     * @returns {number}
	     */
	    LongPrototype.toInt = function toInt() {
	        return this.unsigned ? this.low >>> 0 : this.low;
	    };

	    /**
	     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
	     * @returns {number}
	     */
	    LongPrototype.toNumber = function toNumber() {
	        if (this.unsigned)
	            return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
	        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
	    };

	    /**
	     * Converts the Long to a string written in the specified radix.
	     * @param {number=} radix Radix (2-36), defaults to 10
	     * @returns {string}
	     * @override
	     * @throws {RangeError} If `radix` is out of range
	     */
	    LongPrototype.toString = function toString(radix) {
	        radix = radix || 10;
	        if (radix < 2 || 36 < radix)
	            throw RangeError('radix');
	        if (this.isZero())
	            return '0';
	        if (this.isNegative()) { // Unsigned Longs are never negative
	            if (this.eq(MIN_VALUE)) {
	                // We need to change the Long value before it can be negated, so we remove
	                // the bottom-most digit in this base and then recurse to do the rest.
	                var radixLong = fromNumber(radix),
	                    div = this.div(radixLong),
	                    rem1 = div.mul(radixLong).sub(this);
	                return div.toString(radix) + rem1.toInt().toString(radix);
	            } else
	                return '-' + this.neg().toString(radix);
	        }

	        // Do several (6) digits each time through the loop, so as to
	        // minimize the calls to the very expensive emulated div.
	        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
	            rem = this;
	        var result = '';
	        while (true) {
	            var remDiv = rem.div(radixToPower),
	                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
	                digits = intval.toString(radix);
	            rem = remDiv;
	            if (rem.isZero())
	                return digits + result;
	            else {
	                while (digits.length < 6)
	                    digits = '0' + digits;
	                result = '' + digits + result;
	            }
	        }
	    };

	    /**
	     * Gets the high 32 bits as a signed integer.
	     * @returns {number} Signed high bits
	     */
	    LongPrototype.getHighBits = function getHighBits() {
	        return this.high;
	    };

	    /**
	     * Gets the high 32 bits as an unsigned integer.
	     * @returns {number} Unsigned high bits
	     */
	    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
	        return this.high >>> 0;
	    };

	    /**
	     * Gets the low 32 bits as a signed integer.
	     * @returns {number} Signed low bits
	     */
	    LongPrototype.getLowBits = function getLowBits() {
	        return this.low;
	    };

	    /**
	     * Gets the low 32 bits as an unsigned integer.
	     * @returns {number} Unsigned low bits
	     */
	    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
	        return this.low >>> 0;
	    };

	    /**
	     * Gets the number of bits needed to represent the absolute value of this Long.
	     * @returns {number}
	     */
	    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
	        if (this.isNegative()) // Unsigned Longs are never negative
	            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
	        var val = this.high != 0 ? this.high : this.low;
	        for (var bit = 31; bit > 0; bit--)
	            if ((val & (1 << bit)) != 0)
	                break;
	        return this.high != 0 ? bit + 33 : bit + 1;
	    };

	    /**
	     * Tests if this Long's value equals zero.
	     * @returns {boolean}
	     */
	    LongPrototype.isZero = function isZero() {
	        return this.high === 0 && this.low === 0;
	    };

	    /**
	     * Tests if this Long's value is negative.
	     * @returns {boolean}
	     */
	    LongPrototype.isNegative = function isNegative() {
	        return !this.unsigned && this.high < 0;
	    };

	    /**
	     * Tests if this Long's value is positive.
	     * @returns {boolean}
	     */
	    LongPrototype.isPositive = function isPositive() {
	        return this.unsigned || this.high >= 0;
	    };

	    /**
	     * Tests if this Long's value is odd.
	     * @returns {boolean}
	     */
	    LongPrototype.isOdd = function isOdd() {
	        return (this.low & 1) === 1;
	    };

	    /**
	     * Tests if this Long's value is even.
	     * @returns {boolean}
	     */
	    LongPrototype.isEven = function isEven() {
	        return (this.low & 1) === 0;
	    };

	    /**
	     * Tests if this Long's value equals the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.equals = function equals(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
	            return false;
	        return this.high === other.high && this.low === other.low;
	    };

	    /**
	     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.eq = LongPrototype.equals;

	    /**
	     * Tests if this Long's value differs from the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.notEquals = function notEquals(other) {
	        return !this.eq(/* validates */ other);
	    };

	    /**
	     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.neq = LongPrototype.notEquals;

	    /**
	     * Tests if this Long's value is less than the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.lessThan = function lessThan(other) {
	        return this.comp(/* validates */ other) < 0;
	    };

	    /**
	     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.lt = LongPrototype.lessThan;

	    /**
	     * Tests if this Long's value is less than or equal the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
	        return this.comp(/* validates */ other) <= 0;
	    };

	    /**
	     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.lte = LongPrototype.lessThanOrEqual;

	    /**
	     * Tests if this Long's value is greater than the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.greaterThan = function greaterThan(other) {
	        return this.comp(/* validates */ other) > 0;
	    };

	    /**
	     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.gt = LongPrototype.greaterThan;

	    /**
	     * Tests if this Long's value is greater than or equal the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
	        return this.comp(/* validates */ other) >= 0;
	    };

	    /**
	     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

	    /**
	     * Compares this Long's value with the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
	     *  if the given one is greater
	     */
	    LongPrototype.compare = function compare(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        if (this.eq(other))
	            return 0;
	        var thisNeg = this.isNegative(),
	            otherNeg = other.isNegative();
	        if (thisNeg && !otherNeg)
	            return -1;
	        if (!thisNeg && otherNeg)
	            return 1;
	        // At this point the sign bits are the same
	        if (!this.unsigned)
	            return this.sub(other).isNegative() ? -1 : 1;
	        // Both are positive if at least one is unsigned
	        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
	    };

	    /**
	     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
	     *  if the given one is greater
	     */
	    LongPrototype.comp = LongPrototype.compare;

	    /**
	     * Negates this Long's value.
	     * @returns {!Long} Negated Long
	     */
	    LongPrototype.negate = function negate() {
	        if (!this.unsigned && this.eq(MIN_VALUE))
	            return MIN_VALUE;
	        return this.not().add(ONE);
	    };

	    /**
	     * Negates this Long's value. This is an alias of {@link Long#negate}.
	     * @function
	     * @returns {!Long} Negated Long
	     */
	    LongPrototype.neg = LongPrototype.negate;

	    /**
	     * Returns the sum of this and the specified Long.
	     * @param {!Long|number|string} addend Addend
	     * @returns {!Long} Sum
	     */
	    LongPrototype.add = function add(addend) {
	        if (!isLong(addend))
	            addend = fromValue(addend);

	        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

	        var a48 = this.high >>> 16;
	        var a32 = this.high & 0xFFFF;
	        var a16 = this.low >>> 16;
	        var a00 = this.low & 0xFFFF;

	        var b48 = addend.high >>> 16;
	        var b32 = addend.high & 0xFFFF;
	        var b16 = addend.low >>> 16;
	        var b00 = addend.low & 0xFFFF;

	        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
	        c00 += a00 + b00;
	        c16 += c00 >>> 16;
	        c00 &= 0xFFFF;
	        c16 += a16 + b16;
	        c32 += c16 >>> 16;
	        c16 &= 0xFFFF;
	        c32 += a32 + b32;
	        c48 += c32 >>> 16;
	        c32 &= 0xFFFF;
	        c48 += a48 + b48;
	        c48 &= 0xFFFF;
	        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
	    };

	    /**
	     * Returns the difference of this and the specified Long.
	     * @param {!Long|number|string} subtrahend Subtrahend
	     * @returns {!Long} Difference
	     */
	    LongPrototype.subtract = function subtract(subtrahend) {
	        if (!isLong(subtrahend))
	            subtrahend = fromValue(subtrahend);
	        return this.add(subtrahend.neg());
	    };

	    /**
	     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
	     * @function
	     * @param {!Long|number|string} subtrahend Subtrahend
	     * @returns {!Long} Difference
	     */
	    LongPrototype.sub = LongPrototype.subtract;

	    /**
	     * Returns the product of this and the specified Long.
	     * @param {!Long|number|string} multiplier Multiplier
	     * @returns {!Long} Product
	     */
	    LongPrototype.multiply = function multiply(multiplier) {
	        if (this.isZero())
	            return ZERO;
	        if (!isLong(multiplier))
	            multiplier = fromValue(multiplier);
	        if (multiplier.isZero())
	            return ZERO;
	        if (this.eq(MIN_VALUE))
	            return multiplier.isOdd() ? MIN_VALUE : ZERO;
	        if (multiplier.eq(MIN_VALUE))
	            return this.isOdd() ? MIN_VALUE : ZERO;

	        if (this.isNegative()) {
	            if (multiplier.isNegative())
	                return this.neg().mul(multiplier.neg());
	            else
	                return this.neg().mul(multiplier).neg();
	        } else if (multiplier.isNegative())
	            return this.mul(multiplier.neg()).neg();

	        // If both longs are small, use float multiplication
	        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
	            return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

	        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
	        // We can skip products that would overflow.

	        var a48 = this.high >>> 16;
	        var a32 = this.high & 0xFFFF;
	        var a16 = this.low >>> 16;
	        var a00 = this.low & 0xFFFF;

	        var b48 = multiplier.high >>> 16;
	        var b32 = multiplier.high & 0xFFFF;
	        var b16 = multiplier.low >>> 16;
	        var b00 = multiplier.low & 0xFFFF;

	        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
	        c00 += a00 * b00;
	        c16 += c00 >>> 16;
	        c00 &= 0xFFFF;
	        c16 += a16 * b00;
	        c32 += c16 >>> 16;
	        c16 &= 0xFFFF;
	        c16 += a00 * b16;
	        c32 += c16 >>> 16;
	        c16 &= 0xFFFF;
	        c32 += a32 * b00;
	        c48 += c32 >>> 16;
	        c32 &= 0xFFFF;
	        c32 += a16 * b16;
	        c48 += c32 >>> 16;
	        c32 &= 0xFFFF;
	        c32 += a00 * b32;
	        c48 += c32 >>> 16;
	        c32 &= 0xFFFF;
	        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
	        c48 &= 0xFFFF;
	        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
	    };

	    /**
	     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
	     * @function
	     * @param {!Long|number|string} multiplier Multiplier
	     * @returns {!Long} Product
	     */
	    LongPrototype.mul = LongPrototype.multiply;

	    /**
	     * Returns this Long divided by the specified. The result is signed if this Long is signed or
	     *  unsigned if this Long is unsigned.
	     * @param {!Long|number|string} divisor Divisor
	     * @returns {!Long} Quotient
	     */
	    LongPrototype.divide = function divide(divisor) {
	        if (!isLong(divisor))
	            divisor = fromValue(divisor);
	        if (divisor.isZero())
	            throw Error('division by zero');
	        if (this.isZero())
	            return this.unsigned ? UZERO : ZERO;
	        var approx, rem, res;
	        if (!this.unsigned) {
	            // This section is only relevant for signed longs and is derived from the
	            // closure library as a whole.
	            if (this.eq(MIN_VALUE)) {
	                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
	                    return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
	                else if (divisor.eq(MIN_VALUE))
	                    return ONE;
	                else {
	                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
	                    var halfThis = this.shr(1);
	                    approx = halfThis.div(divisor).shl(1);
	                    if (approx.eq(ZERO)) {
	                        return divisor.isNegative() ? ONE : NEG_ONE;
	                    } else {
	                        rem = this.sub(divisor.mul(approx));
	                        res = approx.add(rem.div(divisor));
	                        return res;
	                    }
	                }
	            } else if (divisor.eq(MIN_VALUE))
	                return this.unsigned ? UZERO : ZERO;
	            if (this.isNegative()) {
	                if (divisor.isNegative())
	                    return this.neg().div(divisor.neg());
	                return this.neg().div(divisor).neg();
	            } else if (divisor.isNegative())
	                return this.div(divisor.neg()).neg();
	            res = ZERO;
	        } else {
	            // The algorithm below has not been made for unsigned longs. It's therefore
	            // required to take special care of the MSB prior to running it.
	            if (!divisor.unsigned)
	                divisor = divisor.toUnsigned();
	            if (divisor.gt(this))
	                return UZERO;
	            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
	                return UONE;
	            res = UZERO;
	        }

	        // Repeat the following until the remainder is less than other:  find a
	        // floating-point that approximates remainder / other *from below*, add this
	        // into the result, and subtract it from the remainder.  It is critical that
	        // the approximate value is less than or equal to the real value so that the
	        // remainder never becomes negative.
	        rem = this;
	        while (rem.gte(divisor)) {
	            // Approximate the result of division. This may be a little greater or
	            // smaller than the actual value.
	            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

	            // We will tweak the approximate result by changing it in the 48-th digit or
	            // the smallest non-fractional digit, whichever is larger.
	            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
	                delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

	            // Decrease the approximation until it is smaller than the remainder.  Note
	            // that if it is too large, the product overflows and is negative.
	                approxRes = fromNumber(approx),
	                approxRem = approxRes.mul(divisor);
	            while (approxRem.isNegative() || approxRem.gt(rem)) {
	                approx -= delta;
	                approxRes = fromNumber(approx, this.unsigned);
	                approxRem = approxRes.mul(divisor);
	            }

	            // We know the answer can't be zero... and actually, zero would cause
	            // infinite recursion since we would make no progress.
	            if (approxRes.isZero())
	                approxRes = ONE;

	            res = res.add(approxRes);
	            rem = rem.sub(approxRem);
	        }
	        return res;
	    };

	    /**
	     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
	     * @function
	     * @param {!Long|number|string} divisor Divisor
	     * @returns {!Long} Quotient
	     */
	    LongPrototype.div = LongPrototype.divide;

	    /**
	     * Returns this Long modulo the specified.
	     * @param {!Long|number|string} divisor Divisor
	     * @returns {!Long} Remainder
	     */
	    LongPrototype.modulo = function modulo(divisor) {
	        if (!isLong(divisor))
	            divisor = fromValue(divisor);
	        return this.sub(this.div(divisor).mul(divisor));
	    };

	    /**
	     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
	     * @function
	     * @param {!Long|number|string} divisor Divisor
	     * @returns {!Long} Remainder
	     */
	    LongPrototype.mod = LongPrototype.modulo;

	    /**
	     * Returns the bitwise NOT of this Long.
	     * @returns {!Long}
	     */
	    LongPrototype.not = function not() {
	        return fromBits(~this.low, ~this.high, this.unsigned);
	    };

	    /**
	     * Returns the bitwise AND of this Long and the specified.
	     * @param {!Long|number|string} other Other Long
	     * @returns {!Long}
	     */
	    LongPrototype.and = function and(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
	    };

	    /**
	     * Returns the bitwise OR of this Long and the specified.
	     * @param {!Long|number|string} other Other Long
	     * @returns {!Long}
	     */
	    LongPrototype.or = function or(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
	    };

	    /**
	     * Returns the bitwise XOR of this Long and the given one.
	     * @param {!Long|number|string} other Other Long
	     * @returns {!Long}
	     */
	    LongPrototype.xor = function xor(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
	    };

	    /**
	     * Returns this Long with bits shifted to the left by the given amount.
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shiftLeft = function shiftLeft(numBits) {
	        if (isLong(numBits))
	            numBits = numBits.toInt();
	        if ((numBits &= 63) === 0)
	            return this;
	        else if (numBits < 32)
	            return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
	        else
	            return fromBits(0, this.low << (numBits - 32), this.unsigned);
	    };

	    /**
	     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
	     * @function
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shl = LongPrototype.shiftLeft;

	    /**
	     * Returns this Long with bits arithmetically shifted to the right by the given amount.
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shiftRight = function shiftRight(numBits) {
	        if (isLong(numBits))
	            numBits = numBits.toInt();
	        if ((numBits &= 63) === 0)
	            return this;
	        else if (numBits < 32)
	            return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
	        else
	            return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
	    };

	    /**
	     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
	     * @function
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shr = LongPrototype.shiftRight;

	    /**
	     * Returns this Long with bits logically shifted to the right by the given amount.
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
	        if (isLong(numBits))
	            numBits = numBits.toInt();
	        numBits &= 63;
	        if (numBits === 0)
	            return this;
	        else {
	            var high = this.high;
	            if (numBits < 32) {
	                var low = this.low;
	                return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
	            } else if (numBits === 32)
	                return fromBits(high, 0, this.unsigned);
	            else
	                return fromBits(high >>> (numBits - 32), 0, this.unsigned);
	        }
	    };

	    /**
	     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
	     * @function
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

	    /**
	     * Converts this Long to signed.
	     * @returns {!Long} Signed long
	     */
	    LongPrototype.toSigned = function toSigned() {
	        if (!this.unsigned)
	            return this;
	        return fromBits(this.low, this.high, false);
	    };

	    /**
	     * Converts this Long to unsigned.
	     * @returns {!Long} Unsigned long
	     */
	    LongPrototype.toUnsigned = function toUnsigned() {
	        if (this.unsigned)
	            return this;
	        return fromBits(this.low, this.high, true);
	    };

	    /**
	     * Converts this Long to its byte representation.
	     * @param {boolean=} le Whether little or big endian, defaults to big endian
	     * @returns {!Array.<number>} Byte representation
	     */
	    LongPrototype.toBytes = function(le) {
	        return le ? this.toBytesLE() : this.toBytesBE();
	    };

	    /**
	     * Converts this Long to its little endian byte representation.
	     * @returns {!Array.<number>} Little endian byte representation
	     */
	    LongPrototype.toBytesLE = function() {
	        var hi = this.high,
	            lo = this.low;
	        return [
	             lo         & 0xff,
	            (lo >>>  8) & 0xff,
	            (lo >>> 16) & 0xff,
	            (lo >>> 24) & 0xff,
	             hi         & 0xff,
	            (hi >>>  8) & 0xff,
	            (hi >>> 16) & 0xff,
	            (hi >>> 24) & 0xff
	        ];
	    };

	    /**
	     * Converts this Long to its big endian byte representation.
	     * @returns {!Array.<number>} Big endian byte representation
	     */
	    LongPrototype.toBytesBE = function() {
	        var hi = this.high,
	            lo = this.low;
	        return [
	            (hi >>> 24) & 0xff,
	            (hi >>> 16) & 0xff,
	            (hi >>>  8) & 0xff,
	             hi         & 0xff,
	            (lo >>> 24) & 0xff,
	            (lo >>> 16) & 0xff,
	            (lo >>>  8) & 0xff,
	             lo         & 0xff
	        ];
	    };

	    return Long;
	});
	});

	var bytebuffer = createCommonjsModule(function (module) {
	/*
	 Copyright 2013-2014 Daniel Wirtz <dcode@dcode.io>

	 Licensed under the Apache License, Version 2.0 (the "License");
	 you may not use this file except in compliance with the License.
	 You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

	 Unless required by applicable law or agreed to in writing, software
	 distributed under the License is distributed on an "AS IS" BASIS,
	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 See the License for the specific language governing permissions and
	 limitations under the License.
	 */

	/**
	 * @license bytebuffer.js (c) 2015 Daniel Wirtz <dcode@dcode.io>
	 * Backing buffer: ArrayBuffer, Accessor: Uint8Array
	 * Released under the Apache License, Version 2.0
	 * see: https://github.com/dcodeIO/bytebuffer.js for details
	 */
	(function(global, factory) {

	    /* AMD */ if (typeof undefined === 'function' && undefined["amd"])
	        undefined(["long"], factory);
	    /* CommonJS */ else if (typeof commonjsRequire === 'function' && 'object' === "object" && module && module["exports"])
	        module['exports'] = (function() {
	            var Long; try { Long = long_1; } catch (e) {}
	            return factory(Long);
	        })();
	    /* Global */ else
	        (global["dcodeIO"] = global["dcodeIO"] || {})["ByteBuffer"] = factory(global["dcodeIO"]["Long"]);

	})(commonjsGlobal, function(Long) {
	    "use strict";

	    /**
	     * Constructs a new ByteBuffer.
	     * @class The swiss army knife for binary data in JavaScript.
	     * @exports ByteBuffer
	     * @constructor
	     * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @expose
	     */
	    var ByteBuffer = function(capacity, littleEndian, noAssert) {
	        if (typeof capacity === 'undefined')
	            capacity = ByteBuffer.DEFAULT_CAPACITY;
	        if (typeof littleEndian === 'undefined')
	            littleEndian = ByteBuffer.DEFAULT_ENDIAN;
	        if (typeof noAssert === 'undefined')
	            noAssert = ByteBuffer.DEFAULT_NOASSERT;
	        if (!noAssert) {
	            capacity = capacity | 0;
	            if (capacity < 0)
	                throw RangeError("Illegal capacity");
	            littleEndian = !!littleEndian;
	            noAssert = !!noAssert;
	        }

	        /**
	         * Backing ArrayBuffer.
	         * @type {!ArrayBuffer}
	         * @expose
	         */
	        this.buffer = capacity === 0 ? EMPTY_BUFFER : new ArrayBuffer(capacity);

	        /**
	         * Uint8Array utilized to manipulate the backing buffer. Becomes `null` if the backing buffer has a capacity of `0`.
	         * @type {?Uint8Array}
	         * @expose
	         */
	        this.view = capacity === 0 ? null : new Uint8Array(this.buffer);

	        /**
	         * Absolute read/write offset.
	         * @type {number}
	         * @expose
	         * @see ByteBuffer#flip
	         * @see ByteBuffer#clear
	         */
	        this.offset = 0;

	        /**
	         * Marked offset.
	         * @type {number}
	         * @expose
	         * @see ByteBuffer#mark
	         * @see ByteBuffer#reset
	         */
	        this.markedOffset = -1;

	        /**
	         * Absolute limit of the contained data. Set to the backing buffer's capacity upon allocation.
	         * @type {number}
	         * @expose
	         * @see ByteBuffer#flip
	         * @see ByteBuffer#clear
	         */
	        this.limit = capacity;

	        /**
	         * Whether to use little endian byte order, defaults to `false` for big endian.
	         * @type {boolean}
	         * @expose
	         */
	        this.littleEndian = littleEndian;

	        /**
	         * Whether to skip assertions of offsets and values, defaults to `false`.
	         * @type {boolean}
	         * @expose
	         */
	        this.noAssert = noAssert;
	    };

	    /**
	     * ByteBuffer version.
	     * @type {string}
	     * @const
	     * @expose
	     */
	    ByteBuffer.VERSION = "5.0.1";

	    /**
	     * Little endian constant that can be used instead of its boolean value. Evaluates to `true`.
	     * @type {boolean}
	     * @const
	     * @expose
	     */
	    ByteBuffer.LITTLE_ENDIAN = true;

	    /**
	     * Big endian constant that can be used instead of its boolean value. Evaluates to `false`.
	     * @type {boolean}
	     * @const
	     * @expose
	     */
	    ByteBuffer.BIG_ENDIAN = false;

	    /**
	     * Default initial capacity of `16`.
	     * @type {number}
	     * @expose
	     */
	    ByteBuffer.DEFAULT_CAPACITY = 16;

	    /**
	     * Default endianess of `false` for big endian.
	     * @type {boolean}
	     * @expose
	     */
	    ByteBuffer.DEFAULT_ENDIAN = ByteBuffer.BIG_ENDIAN;

	    /**
	     * Default no assertions flag of `false`.
	     * @type {boolean}
	     * @expose
	     */
	    ByteBuffer.DEFAULT_NOASSERT = false;

	    /**
	     * A `Long` class for representing a 64-bit two's-complement integer value. May be `null` if Long.js has not been loaded
	     *  and int64 support is not available.
	     * @type {?Long}
	     * @const
	     * @see https://github.com/dcodeIO/long.js
	     * @expose
	     */
	    ByteBuffer.Long = Long || null;

	    /**
	     * @alias ByteBuffer.prototype
	     * @inner
	     */
	    var ByteBufferPrototype = ByteBuffer.prototype;

	    /**
	     * An indicator used to reliably determine if an object is a ByteBuffer or not.
	     * @type {boolean}
	     * @const
	     * @expose
	     * @private
	     */
	    ByteBufferPrototype.__isByteBuffer__;

	    Object.defineProperty(ByteBufferPrototype, "__isByteBuffer__", {
	        value: true,
	        enumerable: false,
	        configurable: false
	    });

	    // helpers

	    /**
	     * @type {!ArrayBuffer}
	     * @inner
	     */
	    var EMPTY_BUFFER = new ArrayBuffer(0);

	    /**
	     * String.fromCharCode reference for compile-time renaming.
	     * @type {function(...number):string}
	     * @inner
	     */
	    var stringFromCharCode = String.fromCharCode;

	    /**
	     * Creates a source function for a string.
	     * @param {string} s String to read from
	     * @returns {function():number|null} Source function returning the next char code respectively `null` if there are
	     *  no more characters left.
	     * @throws {TypeError} If the argument is invalid
	     * @inner
	     */
	    function stringSource(s) {
	        var i=0; return function() {
	            return i < s.length ? s.charCodeAt(i++) : null;
	        };
	    }

	    /**
	     * Creates a destination function for a string.
	     * @returns {function(number=):undefined|string} Destination function successively called with the next char code.
	     *  Returns the final string when called without arguments.
	     * @inner
	     */
	    function stringDestination() {
	        var cs = [], ps = []; return function() {
	            if (arguments.length === 0)
	                return ps.join('')+stringFromCharCode.apply(String, cs);
	            if (cs.length + arguments.length > 1024)
	                ps.push(stringFromCharCode.apply(String, cs)),
	                    cs.length = 0;
	            Array.prototype.push.apply(cs, arguments);
	        };
	    }

	    /**
	     * Gets the accessor type.
	     * @returns {Function} `Buffer` under node.js, `Uint8Array` respectively `DataView` in the browser (classes)
	     * @expose
	     */
	    ByteBuffer.accessor = function() {
	        return Uint8Array;
	    };
	    /**
	     * Allocates a new ByteBuffer backed by a buffer of the specified capacity.
	     * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer}
	     * @expose
	     */
	    ByteBuffer.allocate = function(capacity, littleEndian, noAssert) {
	        return new ByteBuffer(capacity, littleEndian, noAssert);
	    };

	    /**
	     * Concatenates multiple ByteBuffers into one.
	     * @param {!Array.<!ByteBuffer|!ArrayBuffer|!Uint8Array|string>} buffers Buffers to concatenate
	     * @param {(string|boolean)=} encoding String encoding if `buffers` contains a string ("base64", "hex", "binary",
	     *  defaults to "utf8")
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order for the resulting ByteBuffer. Defaults
	     *  to {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values for the resulting ByteBuffer. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} Concatenated ByteBuffer
	     * @expose
	     */
	    ByteBuffer.concat = function(buffers, encoding, littleEndian, noAssert) {
	        if (typeof encoding === 'boolean' || typeof encoding !== 'string') {
	            noAssert = littleEndian;
	            littleEndian = encoding;
	            encoding = undefined;
	        }
	        var capacity = 0;
	        for (var i=0, k=buffers.length, length; i<k; ++i) {
	            if (!ByteBuffer.isByteBuffer(buffers[i]))
	                buffers[i] = ByteBuffer.wrap(buffers[i], encoding);
	            length = buffers[i].limit - buffers[i].offset;
	            if (length > 0) capacity += length;
	        }
	        if (capacity === 0)
	            return new ByteBuffer(0, littleEndian, noAssert);
	        var bb = new ByteBuffer(capacity, littleEndian, noAssert),
	            bi;
	        i=0; while (i<k) {
	            bi = buffers[i++];
	            length = bi.limit - bi.offset;
	            if (length <= 0) continue;
	            bb.view.set(bi.view.subarray(bi.offset, bi.limit), bb.offset);
	            bb.offset += length;
	        }
	        bb.limit = bb.offset;
	        bb.offset = 0;
	        return bb;
	    };

	    /**
	     * Tests if the specified type is a ByteBuffer.
	     * @param {*} bb ByteBuffer to test
	     * @returns {boolean} `true` if it is a ByteBuffer, otherwise `false`
	     * @expose
	     */
	    ByteBuffer.isByteBuffer = function(bb) {
	        return (bb && bb["__isByteBuffer__"]) === true;
	    };
	    /**
	     * Gets the backing buffer type.
	     * @returns {Function} `Buffer` under node.js, `ArrayBuffer` in the browser (classes)
	     * @expose
	     */
	    ByteBuffer.type = function() {
	        return ArrayBuffer;
	    };
	    /**
	     * Wraps a buffer or a string. Sets the allocated ByteBuffer's {@link ByteBuffer#offset} to `0` and its
	     *  {@link ByteBuffer#limit} to the length of the wrapped data.
	     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string|!Array.<number>} buffer Anything that can be wrapped
	     * @param {(string|boolean)=} encoding String encoding if `buffer` is a string ("base64", "hex", "binary", defaults to
	     *  "utf8")
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} A ByteBuffer wrapping `buffer`
	     * @expose
	     */
	    ByteBuffer.wrap = function(buffer, encoding, littleEndian, noAssert) {
	        if (typeof encoding !== 'string') {
	            noAssert = littleEndian;
	            littleEndian = encoding;
	            encoding = undefined;
	        }
	        if (typeof buffer === 'string') {
	            if (typeof encoding === 'undefined')
	                encoding = "utf8";
	            switch (encoding) {
	                case "base64":
	                    return ByteBuffer.fromBase64(buffer, littleEndian);
	                case "hex":
	                    return ByteBuffer.fromHex(buffer, littleEndian);
	                case "binary":
	                    return ByteBuffer.fromBinary(buffer, littleEndian);
	                case "utf8":
	                    return ByteBuffer.fromUTF8(buffer, littleEndian);
	                case "debug":
	                    return ByteBuffer.fromDebug(buffer, littleEndian);
	                default:
	                    throw Error("Unsupported encoding: "+encoding);
	            }
	        }
	        if (buffer === null || typeof buffer !== 'object')
	            throw TypeError("Illegal buffer");
	        var bb;
	        if (ByteBuffer.isByteBuffer(buffer)) {
	            bb = ByteBufferPrototype.clone.call(buffer);
	            bb.markedOffset = -1;
	            return bb;
	        }
	        if (buffer instanceof Uint8Array) { // Extract ArrayBuffer from Uint8Array
	            bb = new ByteBuffer(0, littleEndian, noAssert);
	            if (buffer.length > 0) { // Avoid references to more than one EMPTY_BUFFER
	                bb.buffer = buffer.buffer;
	                bb.offset = buffer.byteOffset;
	                bb.limit = buffer.byteOffset + buffer.byteLength;
	                bb.view = new Uint8Array(buffer.buffer);
	            }
	        } else if (buffer instanceof ArrayBuffer) { // Reuse ArrayBuffer
	            bb = new ByteBuffer(0, littleEndian, noAssert);
	            if (buffer.byteLength > 0) {
	                bb.buffer = buffer;
	                bb.offset = 0;
	                bb.limit = buffer.byteLength;
	                bb.view = buffer.byteLength > 0 ? new Uint8Array(buffer) : null;
	            }
	        } else if (Object.prototype.toString.call(buffer) === "[object Array]") { // Create from octets
	            bb = new ByteBuffer(buffer.length, littleEndian, noAssert);
	            bb.limit = buffer.length;
	            for (var i=0; i<buffer.length; ++i)
	                bb.view[i] = buffer[i];
	        } else
	            throw TypeError("Illegal buffer"); // Otherwise fail
	        return bb;
	    };

	    /**
	     * Writes the array as a bitset.
	     * @param {Array<boolean>} value Array of booleans to write
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
	     * @returns {!ByteBuffer}
	     * @expose
	     */
	    ByteBufferPrototype.writeBitSet = function(value, offset) {
	      var relative = typeof offset === 'undefined';
	      if (relative) offset = this.offset;
	      if (!this.noAssert) {
	        if (!(value instanceof Array))
	          throw TypeError("Illegal BitSet: Not an array");
	        if (typeof offset !== 'number' || offset % 1 !== 0)
	            throw TypeError("Illegal offset: "+offset+" (not an integer)");
	        offset >>>= 0;
	        if (offset < 0 || offset + 0 > this.buffer.byteLength)
	            throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	      }

	      var start = offset,
	          bits = value.length,
	          bytes = (bits >> 3),
	          bit = 0,
	          k;

	      offset += this.writeVarint32(bits,offset);

	      while(bytes--) {
	        k = (!!value[bit++] & 1) |
	            ((!!value[bit++] & 1) << 1) |
	            ((!!value[bit++] & 1) << 2) |
	            ((!!value[bit++] & 1) << 3) |
	            ((!!value[bit++] & 1) << 4) |
	            ((!!value[bit++] & 1) << 5) |
	            ((!!value[bit++] & 1) << 6) |
	            ((!!value[bit++] & 1) << 7);
	        this.writeByte(k,offset++);
	      }

	      if(bit < bits) {
	        var m = 0; k = 0;
	        while(bit < bits) k = k | ((!!value[bit++] & 1) << (m++));
	        this.writeByte(k,offset++);
	      }

	      if (relative) {
	        this.offset = offset;
	        return this;
	      }
	      return offset - start;
	    };

	    /**
	     * Reads a BitSet as an array of booleans.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
	     * @returns {Array<boolean>
	     * @expose
	     */
	    ByteBufferPrototype.readBitSet = function(offset) {
	      var relative = typeof offset === 'undefined';
	      if (relative) offset = this.offset;

	      var ret = this.readVarint32(offset),
	          bits = ret.value,
	          bytes = (bits >> 3),
	          bit = 0,
	          value = [],
	          k;

	      offset += ret.length;

	      while(bytes--) {
	        k = this.readByte(offset++);
	        value[bit++] = !!(k & 0x01);
	        value[bit++] = !!(k & 0x02);
	        value[bit++] = !!(k & 0x04);
	        value[bit++] = !!(k & 0x08);
	        value[bit++] = !!(k & 0x10);
	        value[bit++] = !!(k & 0x20);
	        value[bit++] = !!(k & 0x40);
	        value[bit++] = !!(k & 0x80);
	      }

	      if(bit < bits) {
	        var m = 0;
	        k = this.readByte(offset++);
	        while(bit < bits) value[bit++] = !!((k >> (m++)) & 1);
	      }

	      if (relative) {
	        this.offset = offset;
	      }
	      return value;
	    };
	    /**
	     * Reads the specified number of bytes.
	     * @param {number} length Number of bytes to read
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
	     * @returns {!ByteBuffer}
	     * @expose
	     */
	    ByteBufferPrototype.readBytes = function(length, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + length > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+length+") <= "+this.buffer.byteLength);
	        }
	        var slice = this.slice(offset, offset + length);
	        if (relative) this.offset += length;
	        return slice;
	    };

	    /**
	     * Writes a payload of bytes. This is an alias of {@link ByteBuffer#append}.
	     * @function
	     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to write. If `source` is a ByteBuffer, its offsets
	     *  will be modified according to the performed read operation.
	     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeBytes = ByteBufferPrototype.append;

	    // types/ints/int8

	    /**
	     * Writes an 8bit signed integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeInt8 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 1;
	        var capacity0 = this.buffer.byteLength;
	        if (offset > capacity0)
	            this.resize((capacity0 *= 2) > offset ? capacity0 : offset);
	        offset -= 1;
	        this.view[offset] = value;
	        if (relative) this.offset += 1;
	        return this;
	    };

	    /**
	     * Writes an 8bit signed integer. This is an alias of {@link ByteBuffer#writeInt8}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeByte = ByteBufferPrototype.writeInt8;

	    /**
	     * Reads an 8bit signed integer.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readInt8 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var value = this.view[offset];
	        if ((value & 0x80) === 0x80) value = -(0xFF - value + 1); // Cast to signed
	        if (relative) this.offset += 1;
	        return value;
	    };

	    /**
	     * Reads an 8bit signed integer. This is an alias of {@link ByteBuffer#readInt8}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readByte = ByteBufferPrototype.readInt8;

	    /**
	     * Writes an 8bit unsigned integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeUint8 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value >>>= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 1;
	        var capacity1 = this.buffer.byteLength;
	        if (offset > capacity1)
	            this.resize((capacity1 *= 2) > offset ? capacity1 : offset);
	        offset -= 1;
	        this.view[offset] = value;
	        if (relative) this.offset += 1;
	        return this;
	    };

	    /**
	     * Writes an 8bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint8}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeUInt8 = ByteBufferPrototype.writeUint8;

	    /**
	     * Reads an 8bit unsigned integer.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readUint8 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var value = this.view[offset];
	        if (relative) this.offset += 1;
	        return value;
	    };

	    /**
	     * Reads an 8bit unsigned integer. This is an alias of {@link ByteBuffer#readUint8}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readUInt8 = ByteBufferPrototype.readUint8;

	    // types/ints/int16

	    /**
	     * Writes a 16bit signed integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @throws {TypeError} If `offset` or `value` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.writeInt16 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 2;
	        var capacity2 = this.buffer.byteLength;
	        if (offset > capacity2)
	            this.resize((capacity2 *= 2) > offset ? capacity2 : offset);
	        offset -= 2;
	        if (this.littleEndian) {
	            this.view[offset+1] = (value & 0xFF00) >>> 8;
	            this.view[offset  ] =  value & 0x00FF;
	        } else {
	            this.view[offset]   = (value & 0xFF00) >>> 8;
	            this.view[offset+1] =  value & 0x00FF;
	        }
	        if (relative) this.offset += 2;
	        return this;
	    };

	    /**
	     * Writes a 16bit signed integer. This is an alias of {@link ByteBuffer#writeInt16}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @throws {TypeError} If `offset` or `value` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.writeShort = ByteBufferPrototype.writeInt16;

	    /**
	     * Reads a 16bit signed integer.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @returns {number} Value read
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.readInt16 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 2 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+2+") <= "+this.buffer.byteLength);
	        }
	        var value = 0;
	        if (this.littleEndian) {
	            value  = this.view[offset  ];
	            value |= this.view[offset+1] << 8;
	        } else {
	            value  = this.view[offset  ] << 8;
	            value |= this.view[offset+1];
	        }
	        if ((value & 0x8000) === 0x8000) value = -(0xFFFF - value + 1); // Cast to signed
	        if (relative) this.offset += 2;
	        return value;
	    };

	    /**
	     * Reads a 16bit signed integer. This is an alias of {@link ByteBuffer#readInt16}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @returns {number} Value read
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.readShort = ByteBufferPrototype.readInt16;

	    /**
	     * Writes a 16bit unsigned integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @throws {TypeError} If `offset` or `value` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.writeUint16 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value >>>= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 2;
	        var capacity3 = this.buffer.byteLength;
	        if (offset > capacity3)
	            this.resize((capacity3 *= 2) > offset ? capacity3 : offset);
	        offset -= 2;
	        if (this.littleEndian) {
	            this.view[offset+1] = (value & 0xFF00) >>> 8;
	            this.view[offset  ] =  value & 0x00FF;
	        } else {
	            this.view[offset]   = (value & 0xFF00) >>> 8;
	            this.view[offset+1] =  value & 0x00FF;
	        }
	        if (relative) this.offset += 2;
	        return this;
	    };

	    /**
	     * Writes a 16bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint16}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @throws {TypeError} If `offset` or `value` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.writeUInt16 = ByteBufferPrototype.writeUint16;

	    /**
	     * Reads a 16bit unsigned integer.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @returns {number} Value read
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.readUint16 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 2 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+2+") <= "+this.buffer.byteLength);
	        }
	        var value = 0;
	        if (this.littleEndian) {
	            value  = this.view[offset  ];
	            value |= this.view[offset+1] << 8;
	        } else {
	            value  = this.view[offset  ] << 8;
	            value |= this.view[offset+1];
	        }
	        if (relative) this.offset += 2;
	        return value;
	    };

	    /**
	     * Reads a 16bit unsigned integer. This is an alias of {@link ByteBuffer#readUint16}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @returns {number} Value read
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.readUInt16 = ByteBufferPrototype.readUint16;

	    // types/ints/int32

	    /**
	     * Writes a 32bit signed integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @expose
	     */
	    ByteBufferPrototype.writeInt32 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 4;
	        var capacity4 = this.buffer.byteLength;
	        if (offset > capacity4)
	            this.resize((capacity4 *= 2) > offset ? capacity4 : offset);
	        offset -= 4;
	        if (this.littleEndian) {
	            this.view[offset+3] = (value >>> 24) & 0xFF;
	            this.view[offset+2] = (value >>> 16) & 0xFF;
	            this.view[offset+1] = (value >>>  8) & 0xFF;
	            this.view[offset  ] =  value         & 0xFF;
	        } else {
	            this.view[offset  ] = (value >>> 24) & 0xFF;
	            this.view[offset+1] = (value >>> 16) & 0xFF;
	            this.view[offset+2] = (value >>>  8) & 0xFF;
	            this.view[offset+3] =  value         & 0xFF;
	        }
	        if (relative) this.offset += 4;
	        return this;
	    };

	    /**
	     * Writes a 32bit signed integer. This is an alias of {@link ByteBuffer#writeInt32}.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @expose
	     */
	    ByteBufferPrototype.writeInt = ByteBufferPrototype.writeInt32;

	    /**
	     * Reads a 32bit signed integer.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readInt32 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 4 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
	        }
	        var value = 0;
	        if (this.littleEndian) {
	            value  = this.view[offset+2] << 16;
	            value |= this.view[offset+1] <<  8;
	            value |= this.view[offset  ];
	            value += this.view[offset+3] << 24 >>> 0;
	        } else {
	            value  = this.view[offset+1] << 16;
	            value |= this.view[offset+2] <<  8;
	            value |= this.view[offset+3];
	            value += this.view[offset  ] << 24 >>> 0;
	        }
	        value |= 0; // Cast to signed
	        if (relative) this.offset += 4;
	        return value;
	    };

	    /**
	     * Reads a 32bit signed integer. This is an alias of {@link ByteBuffer#readInt32}.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readInt = ByteBufferPrototype.readInt32;

	    /**
	     * Writes a 32bit unsigned integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @expose
	     */
	    ByteBufferPrototype.writeUint32 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value >>>= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 4;
	        var capacity5 = this.buffer.byteLength;
	        if (offset > capacity5)
	            this.resize((capacity5 *= 2) > offset ? capacity5 : offset);
	        offset -= 4;
	        if (this.littleEndian) {
	            this.view[offset+3] = (value >>> 24) & 0xFF;
	            this.view[offset+2] = (value >>> 16) & 0xFF;
	            this.view[offset+1] = (value >>>  8) & 0xFF;
	            this.view[offset  ] =  value         & 0xFF;
	        } else {
	            this.view[offset  ] = (value >>> 24) & 0xFF;
	            this.view[offset+1] = (value >>> 16) & 0xFF;
	            this.view[offset+2] = (value >>>  8) & 0xFF;
	            this.view[offset+3] =  value         & 0xFF;
	        }
	        if (relative) this.offset += 4;
	        return this;
	    };

	    /**
	     * Writes a 32bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint32}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @expose
	     */
	    ByteBufferPrototype.writeUInt32 = ByteBufferPrototype.writeUint32;

	    /**
	     * Reads a 32bit unsigned integer.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readUint32 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 4 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
	        }
	        var value = 0;
	        if (this.littleEndian) {
	            value  = this.view[offset+2] << 16;
	            value |= this.view[offset+1] <<  8;
	            value |= this.view[offset  ];
	            value += this.view[offset+3] << 24 >>> 0;
	        } else {
	            value  = this.view[offset+1] << 16;
	            value |= this.view[offset+2] <<  8;
	            value |= this.view[offset+3];
	            value += this.view[offset  ] << 24 >>> 0;
	        }
	        if (relative) this.offset += 4;
	        return value;
	    };

	    /**
	     * Reads a 32bit unsigned integer. This is an alias of {@link ByteBuffer#readUint32}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readUInt32 = ByteBufferPrototype.readUint32;

	    // types/ints/int64

	    if (Long) {

	        /**
	         * Writes a 64bit signed integer.
	         * @param {number|!Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!ByteBuffer} this
	         * @expose
	         */
	        ByteBufferPrototype.writeInt64 = function(value, offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof value === 'number')
	                    value = Long.fromNumber(value);
	                else if (typeof value === 'string')
	                    value = Long.fromString(value);
	                else if (!(value && value instanceof Long))
	                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	            }
	            if (typeof value === 'number')
	                value = Long.fromNumber(value);
	            else if (typeof value === 'string')
	                value = Long.fromString(value);
	            offset += 8;
	            var capacity6 = this.buffer.byteLength;
	            if (offset > capacity6)
	                this.resize((capacity6 *= 2) > offset ? capacity6 : offset);
	            offset -= 8;
	            var lo = value.low,
	                hi = value.high;
	            if (this.littleEndian) {
	                this.view[offset+3] = (lo >>> 24) & 0xFF;
	                this.view[offset+2] = (lo >>> 16) & 0xFF;
	                this.view[offset+1] = (lo >>>  8) & 0xFF;
	                this.view[offset  ] =  lo         & 0xFF;
	                offset += 4;
	                this.view[offset+3] = (hi >>> 24) & 0xFF;
	                this.view[offset+2] = (hi >>> 16) & 0xFF;
	                this.view[offset+1] = (hi >>>  8) & 0xFF;
	                this.view[offset  ] =  hi         & 0xFF;
	            } else {
	                this.view[offset  ] = (hi >>> 24) & 0xFF;
	                this.view[offset+1] = (hi >>> 16) & 0xFF;
	                this.view[offset+2] = (hi >>>  8) & 0xFF;
	                this.view[offset+3] =  hi         & 0xFF;
	                offset += 4;
	                this.view[offset  ] = (lo >>> 24) & 0xFF;
	                this.view[offset+1] = (lo >>> 16) & 0xFF;
	                this.view[offset+2] = (lo >>>  8) & 0xFF;
	                this.view[offset+3] =  lo         & 0xFF;
	            }
	            if (relative) this.offset += 8;
	            return this;
	        };

	        /**
	         * Writes a 64bit signed integer. This is an alias of {@link ByteBuffer#writeInt64}.
	         * @param {number|!Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!ByteBuffer} this
	         * @expose
	         */
	        ByteBufferPrototype.writeLong = ByteBufferPrototype.writeInt64;

	        /**
	         * Reads a 64bit signed integer.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!Long}
	         * @expose
	         */
	        ByteBufferPrototype.readInt64 = function(offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 8 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
	            }
	            var lo = 0,
	                hi = 0;
	            if (this.littleEndian) {
	                lo  = this.view[offset+2] << 16;
	                lo |= this.view[offset+1] <<  8;
	                lo |= this.view[offset  ];
	                lo += this.view[offset+3] << 24 >>> 0;
	                offset += 4;
	                hi  = this.view[offset+2] << 16;
	                hi |= this.view[offset+1] <<  8;
	                hi |= this.view[offset  ];
	                hi += this.view[offset+3] << 24 >>> 0;
	            } else {
	                hi  = this.view[offset+1] << 16;
	                hi |= this.view[offset+2] <<  8;
	                hi |= this.view[offset+3];
	                hi += this.view[offset  ] << 24 >>> 0;
	                offset += 4;
	                lo  = this.view[offset+1] << 16;
	                lo |= this.view[offset+2] <<  8;
	                lo |= this.view[offset+3];
	                lo += this.view[offset  ] << 24 >>> 0;
	            }
	            var value = new Long(lo, hi, false);
	            if (relative) this.offset += 8;
	            return value;
	        };

	        /**
	         * Reads a 64bit signed integer. This is an alias of {@link ByteBuffer#readInt64}.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!Long}
	         * @expose
	         */
	        ByteBufferPrototype.readLong = ByteBufferPrototype.readInt64;

	        /**
	         * Writes a 64bit unsigned integer.
	         * @param {number|!Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!ByteBuffer} this
	         * @expose
	         */
	        ByteBufferPrototype.writeUint64 = function(value, offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof value === 'number')
	                    value = Long.fromNumber(value);
	                else if (typeof value === 'string')
	                    value = Long.fromString(value);
	                else if (!(value && value instanceof Long))
	                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	            }
	            if (typeof value === 'number')
	                value = Long.fromNumber(value);
	            else if (typeof value === 'string')
	                value = Long.fromString(value);
	            offset += 8;
	            var capacity7 = this.buffer.byteLength;
	            if (offset > capacity7)
	                this.resize((capacity7 *= 2) > offset ? capacity7 : offset);
	            offset -= 8;
	            var lo = value.low,
	                hi = value.high;
	            if (this.littleEndian) {
	                this.view[offset+3] = (lo >>> 24) & 0xFF;
	                this.view[offset+2] = (lo >>> 16) & 0xFF;
	                this.view[offset+1] = (lo >>>  8) & 0xFF;
	                this.view[offset  ] =  lo         & 0xFF;
	                offset += 4;
	                this.view[offset+3] = (hi >>> 24) & 0xFF;
	                this.view[offset+2] = (hi >>> 16) & 0xFF;
	                this.view[offset+1] = (hi >>>  8) & 0xFF;
	                this.view[offset  ] =  hi         & 0xFF;
	            } else {
	                this.view[offset  ] = (hi >>> 24) & 0xFF;
	                this.view[offset+1] = (hi >>> 16) & 0xFF;
	                this.view[offset+2] = (hi >>>  8) & 0xFF;
	                this.view[offset+3] =  hi         & 0xFF;
	                offset += 4;
	                this.view[offset  ] = (lo >>> 24) & 0xFF;
	                this.view[offset+1] = (lo >>> 16) & 0xFF;
	                this.view[offset+2] = (lo >>>  8) & 0xFF;
	                this.view[offset+3] =  lo         & 0xFF;
	            }
	            if (relative) this.offset += 8;
	            return this;
	        };

	        /**
	         * Writes a 64bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint64}.
	         * @function
	         * @param {number|!Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!ByteBuffer} this
	         * @expose
	         */
	        ByteBufferPrototype.writeUInt64 = ByteBufferPrototype.writeUint64;

	        /**
	         * Reads a 64bit unsigned integer.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!Long}
	         * @expose
	         */
	        ByteBufferPrototype.readUint64 = function(offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 8 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
	            }
	            var lo = 0,
	                hi = 0;
	            if (this.littleEndian) {
	                lo  = this.view[offset+2] << 16;
	                lo |= this.view[offset+1] <<  8;
	                lo |= this.view[offset  ];
	                lo += this.view[offset+3] << 24 >>> 0;
	                offset += 4;
	                hi  = this.view[offset+2] << 16;
	                hi |= this.view[offset+1] <<  8;
	                hi |= this.view[offset  ];
	                hi += this.view[offset+3] << 24 >>> 0;
	            } else {
	                hi  = this.view[offset+1] << 16;
	                hi |= this.view[offset+2] <<  8;
	                hi |= this.view[offset+3];
	                hi += this.view[offset  ] << 24 >>> 0;
	                offset += 4;
	                lo  = this.view[offset+1] << 16;
	                lo |= this.view[offset+2] <<  8;
	                lo |= this.view[offset+3];
	                lo += this.view[offset  ] << 24 >>> 0;
	            }
	            var value = new Long(lo, hi, true);
	            if (relative) this.offset += 8;
	            return value;
	        };

	        /**
	         * Reads a 64bit unsigned integer. This is an alias of {@link ByteBuffer#readUint64}.
	         * @function
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!Long}
	         * @expose
	         */
	        ByteBufferPrototype.readUInt64 = ByteBufferPrototype.readUint64;

	    } // Long


	    // types/floats/float32

	    /*
	     ieee754 - https://github.com/feross/ieee754

	     The MIT License (MIT)

	     Copyright (c) Feross Aboukhadijeh

	     Permission is hereby granted, free of charge, to any person obtaining a copy
	     of this software and associated documentation files (the "Software"), to deal
	     in the Software without restriction, including without limitation the rights
	     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	     copies of the Software, and to permit persons to whom the Software is
	     furnished to do so, subject to the following conditions:

	     The above copyright notice and this permission notice shall be included in
	     all copies or substantial portions of the Software.

	     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	     THE SOFTWARE.
	    */

	    /**
	     * Reads an IEEE754 float from a byte array.
	     * @param {!Array} buffer
	     * @param {number} offset
	     * @param {boolean} isLE
	     * @param {number} mLen
	     * @param {number} nBytes
	     * @returns {number}
	     * @inner
	     */
	    function ieee754_read(buffer, offset, isLE, mLen, nBytes) {
	        var e, m,
	            eLen = nBytes * 8 - mLen - 1,
	            eMax = (1 << eLen) - 1,
	            eBias = eMax >> 1,
	            nBits = -7,
	            i = isLE ? (nBytes - 1) : 0,
	            d = isLE ? -1 : 1,
	            s = buffer[offset + i];

	        i += d;

	        e = s & ((1 << (-nBits)) - 1);
	        s >>= (-nBits);
	        nBits += eLen;
	        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	        m = e & ((1 << (-nBits)) - 1);
	        e >>= (-nBits);
	        nBits += mLen;
	        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	        if (e === 0) {
	            e = 1 - eBias;
	        } else if (e === eMax) {
	            return m ? NaN : ((s ? -1 : 1) * Infinity);
	        } else {
	            m = m + Math.pow(2, mLen);
	            e = e - eBias;
	        }
	        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	    }

	    /**
	     * Writes an IEEE754 float to a byte array.
	     * @param {!Array} buffer
	     * @param {number} value
	     * @param {number} offset
	     * @param {boolean} isLE
	     * @param {number} mLen
	     * @param {number} nBytes
	     * @inner
	     */
	    function ieee754_write(buffer, value, offset, isLE, mLen, nBytes) {
	        var e, m, c,
	            eLen = nBytes * 8 - mLen - 1,
	            eMax = (1 << eLen) - 1,
	            eBias = eMax >> 1,
	            rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	            i = isLE ? 0 : (nBytes - 1),
	            d = isLE ? 1 : -1,
	            s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	        value = Math.abs(value);

	        if (isNaN(value) || value === Infinity) {
	            m = isNaN(value) ? 1 : 0;
	            e = eMax;
	        } else {
	            e = Math.floor(Math.log(value) / Math.LN2);
	            if (value * (c = Math.pow(2, -e)) < 1) {
	                e--;
	                c *= 2;
	            }
	            if (e + eBias >= 1) {
	                value += rt / c;
	            } else {
	                value += rt * Math.pow(2, 1 - eBias);
	            }
	            if (value * c >= 2) {
	                e++;
	                c /= 2;
	            }

	            if (e + eBias >= eMax) {
	                m = 0;
	                e = eMax;
	            } else if (e + eBias >= 1) {
	                m = (value * c - 1) * Math.pow(2, mLen);
	                e = e + eBias;
	            } else {
	                m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	                e = 0;
	            }
	        }

	        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	        e = (e << mLen) | m;
	        eLen += mLen;
	        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	        buffer[offset + i - d] |= s * 128;
	    }

	    /**
	     * Writes a 32bit float.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeFloat32 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number')
	                throw TypeError("Illegal value: "+value+" (not a number)");
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 4;
	        var capacity8 = this.buffer.byteLength;
	        if (offset > capacity8)
	            this.resize((capacity8 *= 2) > offset ? capacity8 : offset);
	        offset -= 4;
	        ieee754_write(this.view, value, offset, this.littleEndian, 23, 4);
	        if (relative) this.offset += 4;
	        return this;
	    };

	    /**
	     * Writes a 32bit float. This is an alias of {@link ByteBuffer#writeFloat32}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeFloat = ByteBufferPrototype.writeFloat32;

	    /**
	     * Reads a 32bit float.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number}
	     * @expose
	     */
	    ByteBufferPrototype.readFloat32 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 4 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
	        }
	        var value = ieee754_read(this.view, offset, this.littleEndian, 23, 4);
	        if (relative) this.offset += 4;
	        return value;
	    };

	    /**
	     * Reads a 32bit float. This is an alias of {@link ByteBuffer#readFloat32}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number}
	     * @expose
	     */
	    ByteBufferPrototype.readFloat = ByteBufferPrototype.readFloat32;

	    // types/floats/float64

	    /**
	     * Writes a 64bit float.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeFloat64 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number')
	                throw TypeError("Illegal value: "+value+" (not a number)");
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 8;
	        var capacity9 = this.buffer.byteLength;
	        if (offset > capacity9)
	            this.resize((capacity9 *= 2) > offset ? capacity9 : offset);
	        offset -= 8;
	        ieee754_write(this.view, value, offset, this.littleEndian, 52, 8);
	        if (relative) this.offset += 8;
	        return this;
	    };

	    /**
	     * Writes a 64bit float. This is an alias of {@link ByteBuffer#writeFloat64}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeDouble = ByteBufferPrototype.writeFloat64;

	    /**
	     * Reads a 64bit float.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	     * @returns {number}
	     * @expose
	     */
	    ByteBufferPrototype.readFloat64 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 8 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
	        }
	        var value = ieee754_read(this.view, offset, this.littleEndian, 52, 8);
	        if (relative) this.offset += 8;
	        return value;
	    };

	    /**
	     * Reads a 64bit float. This is an alias of {@link ByteBuffer#readFloat64}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	     * @returns {number}
	     * @expose
	     */
	    ByteBufferPrototype.readDouble = ByteBufferPrototype.readFloat64;


	    // types/varints/varint32

	    /**
	     * Maximum number of bytes required to store a 32bit base 128 variable-length integer.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ByteBuffer.MAX_VARINT32_BYTES = 5;

	    /**
	     * Calculates the actual number of bytes required to store a 32bit base 128 variable-length integer.
	     * @param {number} value Value to encode
	     * @returns {number} Number of bytes required. Capped to {@link ByteBuffer.MAX_VARINT32_BYTES}
	     * @expose
	     */
	    ByteBuffer.calculateVarint32 = function(value) {
	        // ref: src/google/protobuf/io/coded_stream.cc
	        value = value >>> 0;
	             if (value < 1 << 7 ) return 1;
	        else if (value < 1 << 14) return 2;
	        else if (value < 1 << 21) return 3;
	        else if (value < 1 << 28) return 4;
	        else                      return 5;
	    };

	    /**
	     * Zigzag encodes a signed 32bit integer so that it can be effectively used with varint encoding.
	     * @param {number} n Signed 32bit integer
	     * @returns {number} Unsigned zigzag encoded 32bit integer
	     * @expose
	     */
	    ByteBuffer.zigZagEncode32 = function(n) {
	        return (((n |= 0) << 1) ^ (n >> 31)) >>> 0; // ref: src/google/protobuf/wire_format_lite.h
	    };

	    /**
	     * Decodes a zigzag encoded signed 32bit integer.
	     * @param {number} n Unsigned zigzag encoded 32bit integer
	     * @returns {number} Signed 32bit integer
	     * @expose
	     */
	    ByteBuffer.zigZagDecode32 = function(n) {
	        return ((n >>> 1) ^ -(n & 1)) | 0; // // ref: src/google/protobuf/wire_format_lite.h
	    };

	    /**
	     * Writes a 32bit base 128 variable-length integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer|number} this if `offset` is omitted, else the actual number of bytes written
	     * @expose
	     */
	    ByteBufferPrototype.writeVarint32 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var size = ByteBuffer.calculateVarint32(value),
	            b;
	        offset += size;
	        var capacity10 = this.buffer.byteLength;
	        if (offset > capacity10)
	            this.resize((capacity10 *= 2) > offset ? capacity10 : offset);
	        offset -= size;
	        value >>>= 0;
	        while (value >= 0x80) {
	            b = (value & 0x7f) | 0x80;
	            this.view[offset++] = b;
	            value >>>= 7;
	        }
	        this.view[offset++] = value;
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return size;
	    };

	    /**
	     * Writes a zig-zag encoded (signed) 32bit base 128 variable-length integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer|number} this if `offset` is omitted, else the actual number of bytes written
	     * @expose
	     */
	    ByteBufferPrototype.writeVarint32ZigZag = function(value, offset) {
	        return this.writeVarint32(ByteBuffer.zigZagEncode32(value), offset);
	    };

	    /**
	     * Reads a 32bit base 128 variable-length integer.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {number|!{value: number, length: number}} The value read if offset is omitted, else the value read
	     *  and the actual number of bytes read.
	     * @throws {Error} If it's not a valid varint. Has a property `truncated = true` if there is not enough data available
	     *  to fully decode the varint.
	     * @expose
	     */
	    ByteBufferPrototype.readVarint32 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var c = 0,
	            value = 0 >>> 0,
	            b;
	        do {
	            if (!this.noAssert && offset > this.limit) {
	                var err = Error("Truncated");
	                err['truncated'] = true;
	                throw err;
	            }
	            b = this.view[offset++];
	            if (c < 5)
	                value |= (b & 0x7f) << (7*c);
	            ++c;
	        } while ((b & 0x80) !== 0);
	        value |= 0;
	        if (relative) {
	            this.offset = offset;
	            return value;
	        }
	        return {
	            "value": value,
	            "length": c
	        };
	    };

	    /**
	     * Reads a zig-zag encoded (signed) 32bit base 128 variable-length integer.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {number|!{value: number, length: number}} The value read if offset is omitted, else the value read
	     *  and the actual number of bytes read.
	     * @throws {Error} If it's not a valid varint
	     * @expose
	     */
	    ByteBufferPrototype.readVarint32ZigZag = function(offset) {
	        var val = this.readVarint32(offset);
	        if (typeof val === 'object')
	            val["value"] = ByteBuffer.zigZagDecode32(val["value"]);
	        else
	            val = ByteBuffer.zigZagDecode32(val);
	        return val;
	    };

	    // types/varints/varint64

	    if (Long) {

	        /**
	         * Maximum number of bytes required to store a 64bit base 128 variable-length integer.
	         * @type {number}
	         * @const
	         * @expose
	         */
	        ByteBuffer.MAX_VARINT64_BYTES = 10;

	        /**
	         * Calculates the actual number of bytes required to store a 64bit base 128 variable-length integer.
	         * @param {number|!Long} value Value to encode
	         * @returns {number} Number of bytes required. Capped to {@link ByteBuffer.MAX_VARINT64_BYTES}
	         * @expose
	         */
	        ByteBuffer.calculateVarint64 = function(value) {
	            if (typeof value === 'number')
	                value = Long.fromNumber(value);
	            else if (typeof value === 'string')
	                value = Long.fromString(value);
	            // ref: src/google/protobuf/io/coded_stream.cc
	            var part0 = value.toInt() >>> 0,
	                part1 = value.shiftRightUnsigned(28).toInt() >>> 0,
	                part2 = value.shiftRightUnsigned(56).toInt() >>> 0;
	            if (part2 == 0) {
	                if (part1 == 0) {
	                    if (part0 < 1 << 14)
	                        return part0 < 1 << 7 ? 1 : 2;
	                    else
	                        return part0 < 1 << 21 ? 3 : 4;
	                } else {
	                    if (part1 < 1 << 14)
	                        return part1 < 1 << 7 ? 5 : 6;
	                    else
	                        return part1 < 1 << 21 ? 7 : 8;
	                }
	            } else
	                return part2 < 1 << 7 ? 9 : 10;
	        };

	        /**
	         * Zigzag encodes a signed 64bit integer so that it can be effectively used with varint encoding.
	         * @param {number|!Long} value Signed long
	         * @returns {!Long} Unsigned zigzag encoded long
	         * @expose
	         */
	        ByteBuffer.zigZagEncode64 = function(value) {
	            if (typeof value === 'number')
	                value = Long.fromNumber(value, false);
	            else if (typeof value === 'string')
	                value = Long.fromString(value, false);
	            else if (value.unsigned !== false) value = value.toSigned();
	            // ref: src/google/protobuf/wire_format_lite.h
	            return value.shiftLeft(1).xor(value.shiftRight(63)).toUnsigned();
	        };

	        /**
	         * Decodes a zigzag encoded signed 64bit integer.
	         * @param {!Long|number} value Unsigned zigzag encoded long or JavaScript number
	         * @returns {!Long} Signed long
	         * @expose
	         */
	        ByteBuffer.zigZagDecode64 = function(value) {
	            if (typeof value === 'number')
	                value = Long.fromNumber(value, false);
	            else if (typeof value === 'string')
	                value = Long.fromString(value, false);
	            else if (value.unsigned !== false) value = value.toSigned();
	            // ref: src/google/protobuf/wire_format_lite.h
	            return value.shiftRightUnsigned(1).xor(value.and(Long.ONE).toSigned().negate()).toSigned();
	        };

	        /**
	         * Writes a 64bit base 128 variable-length integer.
	         * @param {number|Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	         *  written if omitted.
	         * @returns {!ByteBuffer|number} `this` if offset is omitted, else the actual number of bytes written.
	         * @expose
	         */
	        ByteBufferPrototype.writeVarint64 = function(value, offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof value === 'number')
	                    value = Long.fromNumber(value);
	                else if (typeof value === 'string')
	                    value = Long.fromString(value);
	                else if (!(value && value instanceof Long))
	                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	            }
	            if (typeof value === 'number')
	                value = Long.fromNumber(value, false);
	            else if (typeof value === 'string')
	                value = Long.fromString(value, false);
	            else if (value.unsigned !== false) value = value.toSigned();
	            var size = ByteBuffer.calculateVarint64(value),
	                part0 = value.toInt() >>> 0,
	                part1 = value.shiftRightUnsigned(28).toInt() >>> 0,
	                part2 = value.shiftRightUnsigned(56).toInt() >>> 0;
	            offset += size;
	            var capacity11 = this.buffer.byteLength;
	            if (offset > capacity11)
	                this.resize((capacity11 *= 2) > offset ? capacity11 : offset);
	            offset -= size;
	            switch (size) {
	                case 10: this.view[offset+9] = (part2 >>>  7) & 0x01;
	                case 9 : this.view[offset+8] = size !== 9 ? (part2       ) | 0x80 : (part2       ) & 0x7F;
	                case 8 : this.view[offset+7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
	                case 7 : this.view[offset+6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
	                case 6 : this.view[offset+5] = size !== 6 ? (part1 >>>  7) | 0x80 : (part1 >>>  7) & 0x7F;
	                case 5 : this.view[offset+4] = size !== 5 ? (part1       ) | 0x80 : (part1       ) & 0x7F;
	                case 4 : this.view[offset+3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
	                case 3 : this.view[offset+2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
	                case 2 : this.view[offset+1] = size !== 2 ? (part0 >>>  7) | 0x80 : (part0 >>>  7) & 0x7F;
	                case 1 : this.view[offset  ] = size !== 1 ? (part0       ) | 0x80 : (part0       ) & 0x7F;
	            }
	            if (relative) {
	                this.offset += size;
	                return this;
	            } else {
	                return size;
	            }
	        };

	        /**
	         * Writes a zig-zag encoded 64bit base 128 variable-length integer.
	         * @param {number|Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	         *  written if omitted.
	         * @returns {!ByteBuffer|number} `this` if offset is omitted, else the actual number of bytes written.
	         * @expose
	         */
	        ByteBufferPrototype.writeVarint64ZigZag = function(value, offset) {
	            return this.writeVarint64(ByteBuffer.zigZagEncode64(value), offset);
	        };

	        /**
	         * Reads a 64bit base 128 variable-length integer. Requires Long.js.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	         *  read if omitted.
	         * @returns {!Long|!{value: Long, length: number}} The value read if offset is omitted, else the value read and
	         *  the actual number of bytes read.
	         * @throws {Error} If it's not a valid varint
	         * @expose
	         */
	        ByteBufferPrototype.readVarint64 = function(offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	            }
	            // ref: src/google/protobuf/io/coded_stream.cc
	            var start = offset,
	                part0 = 0,
	                part1 = 0,
	                part2 = 0,
	                b  = 0;
	            b = this.view[offset++]; part0  = (b & 0x7F)      ; if ( b & 0x80                                                   ) {
	            b = this.view[offset++]; part0 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part0 |= (b & 0x7F) << 14; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part0 |= (b & 0x7F) << 21; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part1  = (b & 0x7F)      ; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part1 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part1 |= (b & 0x7F) << 14; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part1 |= (b & 0x7F) << 21; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part2  = (b & 0x7F)      ; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part2 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            throw Error("Buffer overrun"); }}}}}}}}}}
	            var value = Long.fromBits(part0 | (part1 << 28), (part1 >>> 4) | (part2) << 24, false);
	            if (relative) {
	                this.offset = offset;
	                return value;
	            } else {
	                return {
	                    'value': value,
	                    'length': offset-start
	                };
	            }
	        };

	        /**
	         * Reads a zig-zag encoded 64bit base 128 variable-length integer. Requires Long.js.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	         *  read if omitted.
	         * @returns {!Long|!{value: Long, length: number}} The value read if offset is omitted, else the value read and
	         *  the actual number of bytes read.
	         * @throws {Error} If it's not a valid varint
	         * @expose
	         */
	        ByteBufferPrototype.readVarint64ZigZag = function(offset) {
	            var val = this.readVarint64(offset);
	            if (val && val['value'] instanceof Long)
	                val["value"] = ByteBuffer.zigZagDecode64(val["value"]);
	            else
	                val = ByteBuffer.zigZagDecode64(val);
	            return val;
	        };

	    } // Long


	    // types/strings/cstring

	    /**
	     * Writes a NULL-terminated UTF8 encoded string. For this to work the specified string must not contain any NULL
	     *  characters itself.
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  contained in `str` + 1 if omitted.
	     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written
	     * @expose
	     */
	    ByteBufferPrototype.writeCString = function(str, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        var i,
	            k = str.length;
	        if (!this.noAssert) {
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	            for (i=0; i<k; ++i) {
	                if (str.charCodeAt(i) === 0)
	                    throw RangeError("Illegal str: Contains NULL-characters");
	            }
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        // UTF8 strings do not contain zero bytes in between except for the zero character, so:
	        k = utfx.calculateUTF16asUTF8(stringSource(str))[1];
	        offset += k+1;
	        var capacity12 = this.buffer.byteLength;
	        if (offset > capacity12)
	            this.resize((capacity12 *= 2) > offset ? capacity12 : offset);
	        offset -= k+1;
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            this.view[offset++] = b;
	        }.bind(this));
	        this.view[offset++] = 0;
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return k;
	    };

	    /**
	     * Reads a NULL-terminated UTF8 encoded string. For this to work the string read must not contain any NULL characters
	     *  itself.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     */
	    ByteBufferPrototype.readCString = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var start = offset,
	            temp;
	        // UTF8 strings do not contain zero bytes in between except for the zero character itself, so:
	        var sd, b = -1;
	        utfx.decodeUTF8toUTF16(function() {
	            if (b === 0) return null;
	            if (offset >= this.limit)
	                throw RangeError("Illegal range: Truncated data, "+offset+" < "+this.limit);
	            b = this.view[offset++];
	            return b === 0 ? null : b;
	        }.bind(this), sd = stringDestination(), true);
	        if (relative) {
	            this.offset = offset;
	            return sd();
	        } else {
	            return {
	                "string": sd(),
	                "length": offset - start
	            };
	        }
	    };

	    // types/strings/istring

	    /**
	     * Writes a length as uint32 prefixed UTF8 encoded string.
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer|number} `this` if `offset` is omitted, else the actual number of bytes written
	     * @expose
	     * @see ByteBuffer#writeVarint32
	     */
	    ByteBufferPrototype.writeIString = function(str, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var start = offset,
	            k;
	        k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1];
	        offset += 4+k;
	        var capacity13 = this.buffer.byteLength;
	        if (offset > capacity13)
	            this.resize((capacity13 *= 2) > offset ? capacity13 : offset);
	        offset -= 4+k;
	        if (this.littleEndian) {
	            this.view[offset+3] = (k >>> 24) & 0xFF;
	            this.view[offset+2] = (k >>> 16) & 0xFF;
	            this.view[offset+1] = (k >>>  8) & 0xFF;
	            this.view[offset  ] =  k         & 0xFF;
	        } else {
	            this.view[offset  ] = (k >>> 24) & 0xFF;
	            this.view[offset+1] = (k >>> 16) & 0xFF;
	            this.view[offset+2] = (k >>>  8) & 0xFF;
	            this.view[offset+3] =  k         & 0xFF;
	        }
	        offset += 4;
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            this.view[offset++] = b;
	        }.bind(this));
	        if (offset !== start + 4 + k)
	            throw RangeError("Illegal range: Truncated data, "+offset+" == "+(offset+4+k));
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return offset - start;
	    };

	    /**
	     * Reads a length as uint32 prefixed UTF8 encoded string.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     * @see ByteBuffer#readVarint32
	     */
	    ByteBufferPrototype.readIString = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 4 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
	        }
	        var start = offset;
	        var len = this.readUint32(offset);
	        var str = this.readUTF8String(len, ByteBuffer.METRICS_BYTES, offset += 4);
	        offset += str['length'];
	        if (relative) {
	            this.offset = offset;
	            return str['string'];
	        } else {
	            return {
	                'string': str['string'],
	                'length': offset - start
	            };
	        }
	    };

	    // types/strings/utf8string

	    /**
	     * Metrics representing number of UTF8 characters. Evaluates to `c`.
	     * @type {string}
	     * @const
	     * @expose
	     */
	    ByteBuffer.METRICS_CHARS = 'c';

	    /**
	     * Metrics representing number of bytes. Evaluates to `b`.
	     * @type {string}
	     * @const
	     * @expose
	     */
	    ByteBuffer.METRICS_BYTES = 'b';

	    /**
	     * Writes an UTF8 encoded string.
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} if omitted.
	     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written.
	     * @expose
	     */
	    ByteBufferPrototype.writeUTF8String = function(str, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var k;
	        var start = offset;
	        k = utfx.calculateUTF16asUTF8(stringSource(str))[1];
	        offset += k;
	        var capacity14 = this.buffer.byteLength;
	        if (offset > capacity14)
	            this.resize((capacity14 *= 2) > offset ? capacity14 : offset);
	        offset -= k;
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            this.view[offset++] = b;
	        }.bind(this));
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return offset - start;
	    };

	    /**
	     * Writes an UTF8 encoded string. This is an alias of {@link ByteBuffer#writeUTF8String}.
	     * @function
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} if omitted.
	     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written.
	     * @expose
	     */
	    ByteBufferPrototype.writeString = ByteBufferPrototype.writeUTF8String;

	    /**
	     * Calculates the number of UTF8 characters of a string. JavaScript itself uses UTF-16, so that a string's
	     *  `length` property does not reflect its actual UTF8 size if it contains code points larger than 0xFFFF.
	     * @param {string} str String to calculate
	     * @returns {number} Number of UTF8 characters
	     * @expose
	     */
	    ByteBuffer.calculateUTF8Chars = function(str) {
	        return utfx.calculateUTF16asUTF8(stringSource(str))[0];
	    };

	    /**
	     * Calculates the number of UTF8 bytes of a string.
	     * @param {string} str String to calculate
	     * @returns {number} Number of UTF8 bytes
	     * @expose
	     */
	    ByteBuffer.calculateUTF8Bytes = function(str) {
	        return utfx.calculateUTF16asUTF8(stringSource(str))[1];
	    };

	    /**
	     * Calculates the number of UTF8 bytes of a string. This is an alias of {@link ByteBuffer.calculateUTF8Bytes}.
	     * @function
	     * @param {string} str String to calculate
	     * @returns {number} Number of UTF8 bytes
	     * @expose
	     */
	    ByteBuffer.calculateString = ByteBuffer.calculateUTF8Bytes;

	    /**
	     * Reads an UTF8 encoded string.
	     * @param {number} length Number of characters or bytes to read.
	     * @param {string=} metrics Metrics specifying what `length` is meant to count. Defaults to
	     *  {@link ByteBuffer.METRICS_CHARS}.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     */
	    ByteBufferPrototype.readUTF8String = function(length, metrics, offset) {
	        if (typeof metrics === 'number') {
	            offset = metrics;
	            metrics = undefined;
	        }
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (typeof metrics === 'undefined') metrics = ByteBuffer.METRICS_CHARS;
	        if (!this.noAssert) {
	            if (typeof length !== 'number' || length % 1 !== 0)
	                throw TypeError("Illegal length: "+length+" (not an integer)");
	            length |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var i = 0,
	            start = offset,
	            sd;
	        if (metrics === ByteBuffer.METRICS_CHARS) { // The same for node and the browser
	            sd = stringDestination();
	            utfx.decodeUTF8(function() {
	                return i < length && offset < this.limit ? this.view[offset++] : null;
	            }.bind(this), function(cp) {
	                ++i; utfx.UTF8toUTF16(cp, sd);
	            });
	            if (i !== length)
	                throw RangeError("Illegal range: Truncated data, "+i+" == "+length);
	            if (relative) {
	                this.offset = offset;
	                return sd();
	            } else {
	                return {
	                    "string": sd(),
	                    "length": offset - start
	                };
	            }
	        } else if (metrics === ByteBuffer.METRICS_BYTES) {
	            if (!this.noAssert) {
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + length > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+length+") <= "+this.buffer.byteLength);
	            }
	            var k = offset + length;
	            utfx.decodeUTF8toUTF16(function() {
	                return offset < k ? this.view[offset++] : null;
	            }.bind(this), sd = stringDestination(), this.noAssert);
	            if (offset !== k)
	                throw RangeError("Illegal range: Truncated data, "+offset+" == "+k);
	            if (relative) {
	                this.offset = offset;
	                return sd();
	            } else {
	                return {
	                    'string': sd(),
	                    'length': offset - start
	                };
	            }
	        } else
	            throw TypeError("Unsupported metrics: "+metrics);
	    };

	    /**
	     * Reads an UTF8 encoded string. This is an alias of {@link ByteBuffer#readUTF8String}.
	     * @function
	     * @param {number} length Number of characters or bytes to read
	     * @param {number=} metrics Metrics specifying what `n` is meant to count. Defaults to
	     *  {@link ByteBuffer.METRICS_CHARS}.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     */
	    ByteBufferPrototype.readString = ByteBufferPrototype.readUTF8String;

	    // types/strings/vstring

	    /**
	     * Writes a length as varint32 prefixed UTF8 encoded string.
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer|number} `this` if `offset` is omitted, else the actual number of bytes written
	     * @expose
	     * @see ByteBuffer#writeVarint32
	     */
	    ByteBufferPrototype.writeVString = function(str, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var start = offset,
	            k, l;
	        k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1];
	        l = ByteBuffer.calculateVarint32(k);
	        offset += l+k;
	        var capacity15 = this.buffer.byteLength;
	        if (offset > capacity15)
	            this.resize((capacity15 *= 2) > offset ? capacity15 : offset);
	        offset -= l+k;
	        offset += this.writeVarint32(k, offset);
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            this.view[offset++] = b;
	        }.bind(this));
	        if (offset !== start+k+l)
	            throw RangeError("Illegal range: Truncated data, "+offset+" == "+(offset+k+l));
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return offset - start;
	    };

	    /**
	     * Reads a length as varint32 prefixed UTF8 encoded string.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     * @see ByteBuffer#readVarint32
	     */
	    ByteBufferPrototype.readVString = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var start = offset;
	        var len = this.readVarint32(offset);
	        var str = this.readUTF8String(len['value'], ByteBuffer.METRICS_BYTES, offset += len['length']);
	        offset += str['length'];
	        if (relative) {
	            this.offset = offset;
	            return str['string'];
	        } else {
	            return {
	                'string': str['string'],
	                'length': offset - start
	            };
	        }
	    };


	    /**
	     * Appends some data to this ByteBuffer. This will overwrite any contents behind the specified offset up to the appended
	     *  data's length.
	     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to append. If `source` is a ByteBuffer, its offsets
	     *  will be modified according to the performed read operation.
	     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
	     * @param {number=} offset Offset to append at. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @example A relative `<01 02>03.append(<04 05>)` will result in `<01 02 04 05>, 04 05|`
	     * @example An absolute `<01 02>03.append(04 05>, 1)` will result in `<01 04>05, 04 05|`
	     */
	    ByteBufferPrototype.append = function(source, encoding, offset) {
	        if (typeof encoding === 'number' || typeof encoding !== 'string') {
	            offset = encoding;
	            encoding = undefined;
	        }
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        if (!(source instanceof ByteBuffer))
	            source = ByteBuffer.wrap(source, encoding);
	        var length = source.limit - source.offset;
	        if (length <= 0) return this; // Nothing to append
	        offset += length;
	        var capacity16 = this.buffer.byteLength;
	        if (offset > capacity16)
	            this.resize((capacity16 *= 2) > offset ? capacity16 : offset);
	        offset -= length;
	        this.view.set(source.view.subarray(source.offset, source.limit), offset);
	        source.offset += length;
	        if (relative) this.offset += length;
	        return this;
	    };

	    /**
	     * Appends this ByteBuffer's contents to another ByteBuffer. This will overwrite any contents at and after the
	        specified offset up to the length of this ByteBuffer's data.
	     * @param {!ByteBuffer} target Target ByteBuffer
	     * @param {number=} offset Offset to append to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @see ByteBuffer#append
	     */
	    ByteBufferPrototype.appendTo = function(target, offset) {
	        target.append(this, offset);
	        return this;
	    };

	    /**
	     * Enables or disables assertions of argument types and offsets. Assertions are enabled by default but you can opt to
	     *  disable them if your code already makes sure that everything is valid.
	     * @param {boolean} assert `true` to enable assertions, otherwise `false`
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.assert = function(assert) {
	        this.noAssert = !assert;
	        return this;
	    };

	    /**
	     * Gets the capacity of this ByteBuffer's backing buffer.
	     * @returns {number} Capacity of the backing buffer
	     * @expose
	     */
	    ByteBufferPrototype.capacity = function() {
	        return this.buffer.byteLength;
	    };
	    /**
	     * Clears this ByteBuffer's offsets by setting {@link ByteBuffer#offset} to `0` and {@link ByteBuffer#limit} to the
	     *  backing buffer's capacity. Discards {@link ByteBuffer#markedOffset}.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.clear = function() {
	        this.offset = 0;
	        this.limit = this.buffer.byteLength;
	        this.markedOffset = -1;
	        return this;
	    };

	    /**
	     * Creates a cloned instance of this ByteBuffer, preset with this ByteBuffer's values for {@link ByteBuffer#offset},
	     *  {@link ByteBuffer#markedOffset} and {@link ByteBuffer#limit}.
	     * @param {boolean=} copy Whether to copy the backing buffer or to return another view on the same, defaults to `false`
	     * @returns {!ByteBuffer} Cloned instance
	     * @expose
	     */
	    ByteBufferPrototype.clone = function(copy) {
	        var bb = new ByteBuffer(0, this.littleEndian, this.noAssert);
	        if (copy) {
	            bb.buffer = new ArrayBuffer(this.buffer.byteLength);
	            bb.view = new Uint8Array(bb.buffer);
	        } else {
	            bb.buffer = this.buffer;
	            bb.view = this.view;
	        }
	        bb.offset = this.offset;
	        bb.markedOffset = this.markedOffset;
	        bb.limit = this.limit;
	        return bb;
	    };

	    /**
	     * Compacts this ByteBuffer to be backed by a {@link ByteBuffer#buffer} of its contents' length. Contents are the bytes
	     *  between {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. Will set `offset = 0` and `limit = capacity` and
	     *  adapt {@link ByteBuffer#markedOffset} to the same relative position if set.
	     * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
	     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.compact = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        if (begin === 0 && end === this.buffer.byteLength)
	            return this; // Already compacted
	        var len = end - begin;
	        if (len === 0) {
	            this.buffer = EMPTY_BUFFER;
	            this.view = null;
	            if (this.markedOffset >= 0) this.markedOffset -= begin;
	            this.offset = 0;
	            this.limit = 0;
	            return this;
	        }
	        var buffer = new ArrayBuffer(len);
	        var view = new Uint8Array(buffer);
	        view.set(this.view.subarray(begin, end));
	        this.buffer = buffer;
	        this.view = view;
	        if (this.markedOffset >= 0) this.markedOffset -= begin;
	        this.offset = 0;
	        this.limit = len;
	        return this;
	    };

	    /**
	     * Creates a copy of this ByteBuffer's contents. Contents are the bytes between {@link ByteBuffer#offset} and
	     *  {@link ByteBuffer#limit}.
	     * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
	     * @returns {!ByteBuffer} Copy
	     * @expose
	     */
	    ByteBufferPrototype.copy = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        if (begin === end)
	            return new ByteBuffer(0, this.littleEndian, this.noAssert);
	        var capacity = end - begin,
	            bb = new ByteBuffer(capacity, this.littleEndian, this.noAssert);
	        bb.offset = 0;
	        bb.limit = capacity;
	        if (bb.markedOffset >= 0) bb.markedOffset -= begin;
	        this.copyTo(bb, 0, begin, end);
	        return bb;
	    };

	    /**
	     * Copies this ByteBuffer's contents to another ByteBuffer. Contents are the bytes between {@link ByteBuffer#offset} and
	     *  {@link ByteBuffer#limit}.
	     * @param {!ByteBuffer} target Target ByteBuffer
	     * @param {number=} targetOffset Offset to copy to. Will use and increase the target's {@link ByteBuffer#offset}
	     *  by the number of bytes copied if omitted.
	     * @param {number=} sourceOffset Offset to start copying from. Will use and increase {@link ByteBuffer#offset} by the
	     *  number of bytes copied if omitted.
	     * @param {number=} sourceLimit Offset to end copying from, defaults to {@link ByteBuffer#limit}
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.copyTo = function(target, targetOffset, sourceOffset, sourceLimit) {
	        var relative,
	            targetRelative;
	        if (!this.noAssert) {
	            if (!ByteBuffer.isByteBuffer(target))
	                throw TypeError("Illegal target: Not a ByteBuffer");
	        }
	        targetOffset = (targetRelative = typeof targetOffset === 'undefined') ? target.offset : targetOffset | 0;
	        sourceOffset = (relative = typeof sourceOffset === 'undefined') ? this.offset : sourceOffset | 0;
	        sourceLimit = typeof sourceLimit === 'undefined' ? this.limit : sourceLimit | 0;

	        if (targetOffset < 0 || targetOffset > target.buffer.byteLength)
	            throw RangeError("Illegal target range: 0 <= "+targetOffset+" <= "+target.buffer.byteLength);
	        if (sourceOffset < 0 || sourceLimit > this.buffer.byteLength)
	            throw RangeError("Illegal source range: 0 <= "+sourceOffset+" <= "+this.buffer.byteLength);

	        var len = sourceLimit - sourceOffset;
	        if (len === 0)
	            return target; // Nothing to copy

	        target.ensureCapacity(targetOffset + len);

	        target.view.set(this.view.subarray(sourceOffset, sourceLimit), targetOffset);

	        if (relative) this.offset += len;
	        if (targetRelative) target.offset += len;

	        return this;
	    };

	    /**
	     * Makes sure that this ByteBuffer is backed by a {@link ByteBuffer#buffer} of at least the specified capacity. If the
	     *  current capacity is exceeded, it will be doubled. If double the current capacity is less than the required capacity,
	     *  the required capacity will be used instead.
	     * @param {number} capacity Required capacity
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.ensureCapacity = function(capacity) {
	        var current = this.buffer.byteLength;
	        if (current < capacity)
	            return this.resize((current *= 2) > capacity ? current : capacity);
	        return this;
	    };

	    /**
	     * Overwrites this ByteBuffer's contents with the specified value. Contents are the bytes between
	     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
	     * @param {number|string} value Byte value to fill with. If given as a string, the first character is used.
	     * @param {number=} begin Begin offset. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted. defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @example `someByteBuffer.clear().fill(0)` fills the entire backing buffer with zeroes
	     */
	    ByteBufferPrototype.fill = function(value, begin, end) {
	        var relative = typeof begin === 'undefined';
	        if (relative) begin = this.offset;
	        if (typeof value === 'string' && value.length > 0)
	            value = value.charCodeAt(0);
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        if (begin >= end)
	            return this; // Nothing to fill
	        while (begin < end) this.view[begin++] = value;
	        if (relative) this.offset = begin;
	        return this;
	    };

	    /**
	     * Makes this ByteBuffer ready for a new sequence of write or relative read operations. Sets `limit = offset` and
	     *  `offset = 0`. Make sure always to flip a ByteBuffer when all relative read or write operations are complete.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.flip = function() {
	        this.limit = this.offset;
	        this.offset = 0;
	        return this;
	    };
	    /**
	     * Marks an offset on this ByteBuffer to be used later.
	     * @param {number=} offset Offset to mark. Defaults to {@link ByteBuffer#offset}.
	     * @returns {!ByteBuffer} this
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @see ByteBuffer#reset
	     * @expose
	     */
	    ByteBufferPrototype.mark = function(offset) {
	        offset = typeof offset === 'undefined' ? this.offset : offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        this.markedOffset = offset;
	        return this;
	    };
	    /**
	     * Sets the byte order.
	     * @param {boolean} littleEndian `true` for little endian byte order, `false` for big endian
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.order = function(littleEndian) {
	        if (!this.noAssert) {
	            if (typeof littleEndian !== 'boolean')
	                throw TypeError("Illegal littleEndian: Not a boolean");
	        }
	        this.littleEndian = !!littleEndian;
	        return this;
	    };

	    /**
	     * Switches (to) little endian byte order.
	     * @param {boolean=} littleEndian Defaults to `true`, otherwise uses big endian
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.LE = function(littleEndian) {
	        this.littleEndian = typeof littleEndian !== 'undefined' ? !!littleEndian : true;
	        return this;
	    };

	    /**
	     * Switches (to) big endian byte order.
	     * @param {boolean=} bigEndian Defaults to `true`, otherwise uses little endian
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.BE = function(bigEndian) {
	        this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false;
	        return this;
	    };
	    /**
	     * Prepends some data to this ByteBuffer. This will overwrite any contents before the specified offset up to the
	     *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer
	     *  will be resized and its contents moved accordingly.
	     * @param {!ByteBuffer|string|!ArrayBuffer} source Data to prepend. If `source` is a ByteBuffer, its offset will be
	     *  modified according to the performed read operation.
	     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
	     * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes
	     *  prepended if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @example A relative `00<01 02 03>.prepend(<04 05>)` results in `<04 05 01 02 03>, 04 05|`
	     * @example An absolute `00<01 02 03>.prepend(<04 05>, 2)` results in `04<05 02 03>, 04 05|`
	     */
	    ByteBufferPrototype.prepend = function(source, encoding, offset) {
	        if (typeof encoding === 'number' || typeof encoding !== 'string') {
	            offset = encoding;
	            encoding = undefined;
	        }
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        if (!(source instanceof ByteBuffer))
	            source = ByteBuffer.wrap(source, encoding);
	        var len = source.limit - source.offset;
	        if (len <= 0) return this; // Nothing to prepend
	        var diff = len - offset;
	        if (diff > 0) { // Not enough space before offset, so resize + move
	            var buffer = new ArrayBuffer(this.buffer.byteLength + diff);
	            var view = new Uint8Array(buffer);
	            view.set(this.view.subarray(offset, this.buffer.byteLength), len);
	            this.buffer = buffer;
	            this.view = view;
	            this.offset += diff;
	            if (this.markedOffset >= 0) this.markedOffset += diff;
	            this.limit += diff;
	            offset += diff;
	        } else {
	            var arrayView = new Uint8Array(this.buffer);
	        }
	        this.view.set(source.view.subarray(source.offset, source.limit), offset - len);

	        source.offset = source.limit;
	        if (relative)
	            this.offset -= len;
	        return this;
	    };

	    /**
	     * Prepends this ByteBuffer to another ByteBuffer. This will overwrite any contents before the specified offset up to the
	     *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer
	     *  will be resized and its contents moved accordingly.
	     * @param {!ByteBuffer} target Target ByteBuffer
	     * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes
	     *  prepended if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @see ByteBuffer#prepend
	     */
	    ByteBufferPrototype.prependTo = function(target, offset) {
	        target.prepend(this, offset);
	        return this;
	    };
	    /**
	     * Prints debug information about this ByteBuffer's contents.
	     * @param {function(string)=} out Output function to call, defaults to console.log
	     * @expose
	     */
	    ByteBufferPrototype.printDebug = function(out) {
	        if (typeof out !== 'function') out = console.log.bind(console);
	        out(
	            this.toString()+"\n"+
	            "-------------------------------------------------------------------\n"+
	            this.toDebug(/* columns */ true)
	        );
	    };

	    /**
	     * Gets the number of remaining readable bytes. Contents are the bytes between {@link ByteBuffer#offset} and
	     *  {@link ByteBuffer#limit}, so this returns `limit - offset`.
	     * @returns {number} Remaining readable bytes. May be negative if `offset > limit`.
	     * @expose
	     */
	    ByteBufferPrototype.remaining = function() {
	        return this.limit - this.offset;
	    };
	    /**
	     * Resets this ByteBuffer's {@link ByteBuffer#offset}. If an offset has been marked through {@link ByteBuffer#mark}
	     *  before, `offset` will be set to {@link ByteBuffer#markedOffset}, which will then be discarded. If no offset has been
	     *  marked, sets `offset = 0`.
	     * @returns {!ByteBuffer} this
	     * @see ByteBuffer#mark
	     * @expose
	     */
	    ByteBufferPrototype.reset = function() {
	        if (this.markedOffset >= 0) {
	            this.offset = this.markedOffset;
	            this.markedOffset = -1;
	        } else {
	            this.offset = 0;
	        }
	        return this;
	    };
	    /**
	     * Resizes this ByteBuffer to be backed by a buffer of at least the given capacity. Will do nothing if already that
	     *  large or larger.
	     * @param {number} capacity Capacity required
	     * @returns {!ByteBuffer} this
	     * @throws {TypeError} If `capacity` is not a number
	     * @throws {RangeError} If `capacity < 0`
	     * @expose
	     */
	    ByteBufferPrototype.resize = function(capacity) {
	        if (!this.noAssert) {
	            if (typeof capacity !== 'number' || capacity % 1 !== 0)
	                throw TypeError("Illegal capacity: "+capacity+" (not an integer)");
	            capacity |= 0;
	            if (capacity < 0)
	                throw RangeError("Illegal capacity: 0 <= "+capacity);
	        }
	        if (this.buffer.byteLength < capacity) {
	            var buffer = new ArrayBuffer(capacity);
	            var view = new Uint8Array(buffer);
	            view.set(this.view);
	            this.buffer = buffer;
	            this.view = view;
	        }
	        return this;
	    };
	    /**
	     * Reverses this ByteBuffer's contents.
	     * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
	     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.reverse = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        if (begin === end)
	            return this; // Nothing to reverse
	        Array.prototype.reverse.call(this.view.subarray(begin, end));
	        return this;
	    };
	    /**
	     * Skips the next `length` bytes. This will just advance
	     * @param {number} length Number of bytes to skip. May also be negative to move the offset back.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.skip = function(length) {
	        if (!this.noAssert) {
	            if (typeof length !== 'number' || length % 1 !== 0)
	                throw TypeError("Illegal length: "+length+" (not an integer)");
	            length |= 0;
	        }
	        var offset = this.offset + length;
	        if (!this.noAssert) {
	            if (offset < 0 || offset > this.buffer.byteLength)
	                throw RangeError("Illegal length: 0 <= "+this.offset+" + "+length+" <= "+this.buffer.byteLength);
	        }
	        this.offset = offset;
	        return this;
	    };

	    /**
	     * Slices this ByteBuffer by creating a cloned instance with `offset = begin` and `limit = end`.
	     * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
	     * @returns {!ByteBuffer} Clone of this ByteBuffer with slicing applied, backed by the same {@link ByteBuffer#buffer}
	     * @expose
	     */
	    ByteBufferPrototype.slice = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        var bb = this.clone();
	        bb.offset = begin;
	        bb.limit = end;
	        return bb;
	    };
	    /**
	     * Returns a copy of the backing buffer that contains this ByteBuffer's contents. Contents are the bytes between
	     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
	     * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory if
	     *  possible. Defaults to `false`
	     * @returns {!ArrayBuffer} Contents as an ArrayBuffer
	     * @expose
	     */
	    ByteBufferPrototype.toBuffer = function(forceCopy) {
	        var offset = this.offset,
	            limit = this.limit;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: Not an integer");
	            offset >>>= 0;
	            if (typeof limit !== 'number' || limit % 1 !== 0)
	                throw TypeError("Illegal limit: Not an integer");
	            limit >>>= 0;
	            if (offset < 0 || offset > limit || limit > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+offset+" <= "+limit+" <= "+this.buffer.byteLength);
	        }
	        // NOTE: It's not possible to have another ArrayBuffer reference the same memory as the backing buffer. This is
	        // possible with Uint8Array#subarray only, but we have to return an ArrayBuffer by contract. So:
	        if (!forceCopy && offset === 0 && limit === this.buffer.byteLength)
	            return this.buffer;
	        if (offset === limit)
	            return EMPTY_BUFFER;
	        var buffer = new ArrayBuffer(limit - offset);
	        new Uint8Array(buffer).set(new Uint8Array(this.buffer).subarray(offset, limit), 0);
	        return buffer;
	    };

	    /**
	     * Returns a raw buffer compacted to contain this ByteBuffer's contents. Contents are the bytes between
	     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. This is an alias of {@link ByteBuffer#toBuffer}.
	     * @function
	     * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory.
	     *  Defaults to `false`
	     * @returns {!ArrayBuffer} Contents as an ArrayBuffer
	     * @expose
	     */
	    ByteBufferPrototype.toArrayBuffer = ByteBufferPrototype.toBuffer;

	    /**
	     * Converts the ByteBuffer's contents to a string.
	     * @param {string=} encoding Output encoding. Returns an informative string representation if omitted but also allows
	     *  direct conversion to "utf8", "hex", "base64" and "binary" encoding. "debug" returns a hex representation with
	     *  highlighted offsets.
	     * @param {number=} begin Offset to begin at, defaults to {@link ByteBuffer#offset}
	     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
	     * @returns {string} String representation
	     * @throws {Error} If `encoding` is invalid
	     * @expose
	     */
	    ByteBufferPrototype.toString = function(encoding, begin, end) {
	        if (typeof encoding === 'undefined')
	            return "ByteBufferAB(offset="+this.offset+",markedOffset="+this.markedOffset+",limit="+this.limit+",capacity="+this.capacity()+")";
	        if (typeof encoding === 'number')
	            encoding = "utf8",
	            begin = encoding,
	            end = begin;
	        switch (encoding) {
	            case "utf8":
	                return this.toUTF8(begin, end);
	            case "base64":
	                return this.toBase64(begin, end);
	            case "hex":
	                return this.toHex(begin, end);
	            case "binary":
	                return this.toBinary(begin, end);
	            case "debug":
	                return this.toDebug();
	            case "columns":
	                return this.toColumns();
	            default:
	                throw Error("Unsupported encoding: "+encoding);
	        }
	    };

	    // lxiv-embeddable

	    /**
	     * lxiv-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
	     * Released under the Apache License, Version 2.0
	     * see: https://github.com/dcodeIO/lxiv for details
	     */
	    var lxiv = function() {
	        "use strict";

	        /**
	         * lxiv namespace.
	         * @type {!Object.<string,*>}
	         * @exports lxiv
	         */
	        var lxiv = {};

	        /**
	         * Character codes for output.
	         * @type {!Array.<number>}
	         * @inner
	         */
	        var aout = [
	            65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
	            81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102,
	            103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
	            119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47
	        ];

	        /**
	         * Character codes for input.
	         * @type {!Array.<number>}
	         * @inner
	         */
	        var ain = [];
	        for (var i=0, k=aout.length; i<k; ++i)
	            ain[aout[i]] = i;

	        /**
	         * Encodes bytes to base64 char codes.
	         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if
	         *  there are no more bytes left.
	         * @param {!function(number)} dst Characters destination as a function successively called with each encoded char
	         *  code.
	         */
	        lxiv.encode = function(src, dst) {
	            var b, t;
	            while ((b = src()) !== null) {
	                dst(aout[(b>>2)&0x3f]);
	                t = (b&0x3)<<4;
	                if ((b = src()) !== null) {
	                    t |= (b>>4)&0xf;
	                    dst(aout[(t|((b>>4)&0xf))&0x3f]);
	                    t = (b&0xf)<<2;
	                    if ((b = src()) !== null)
	                        dst(aout[(t|((b>>6)&0x3))&0x3f]),
	                        dst(aout[b&0x3f]);
	                    else
	                        dst(aout[t&0x3f]),
	                        dst(61);
	                } else
	                    dst(aout[t&0x3f]),
	                    dst(61),
	                    dst(61);
	            }
	        };

	        /**
	         * Decodes base64 char codes to bytes.
	         * @param {!function():number|null} src Characters source as a function returning the next char code respectively
	         *  `null` if there are no more characters left.
	         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
	         * @throws {Error} If a character code is invalid
	         */
	        lxiv.decode = function(src, dst) {
	            var c, t1, t2;
	            function fail(c) {
	                throw Error("Illegal character code: "+c);
	            }
	            while ((c = src()) !== null) {
	                t1 = ain[c];
	                if (typeof t1 === 'undefined') fail(c);
	                if ((c = src()) !== null) {
	                    t2 = ain[c];
	                    if (typeof t2 === 'undefined') fail(c);
	                    dst((t1<<2)>>>0|(t2&0x30)>>4);
	                    if ((c = src()) !== null) {
	                        t1 = ain[c];
	                        if (typeof t1 === 'undefined')
	                            if (c === 61) break; else fail(c);
	                        dst(((t2&0xf)<<4)>>>0|(t1&0x3c)>>2);
	                        if ((c = src()) !== null) {
	                            t2 = ain[c];
	                            if (typeof t2 === 'undefined')
	                                if (c === 61) break; else fail(c);
	                            dst(((t1&0x3)<<6)>>>0|t2);
	                        }
	                    }
	                }
	            }
	        };

	        /**
	         * Tests if a string is valid base64.
	         * @param {string} str String to test
	         * @returns {boolean} `true` if valid, otherwise `false`
	         */
	        lxiv.test = function(str) {
	            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
	        };

	        return lxiv;
	    }();

	    // encodings/base64

	    /**
	     * Encodes this ByteBuffer's contents to a base64 encoded string.
	     * @param {number=} begin Offset to begin at, defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}.
	     * @returns {string} Base64 encoded string
	     * @throws {RangeError} If `begin` or `end` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.toBase64 = function(begin, end) {
	        if (typeof begin === 'undefined')
	            begin = this.offset;
	        if (typeof end === 'undefined')
	            end = this.limit;
	        begin = begin | 0; end = end | 0;
	        if (begin < 0 || end > this.capacity || begin > end)
	            throw RangeError("begin, end");
	        var sd; lxiv.encode(function() {
	            return begin < end ? this.view[begin++] : null;
	        }.bind(this), sd = stringDestination());
	        return sd();
	    };

	    /**
	     * Decodes a base64 encoded string to a ByteBuffer.
	     * @param {string} str String to decode
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     */
	    ByteBuffer.fromBase64 = function(str, littleEndian) {
	        if (typeof str !== 'string')
	            throw TypeError("str");
	        var bb = new ByteBuffer(str.length/4*3, littleEndian),
	            i = 0;
	        lxiv.decode(stringSource(str), function(b) {
	            bb.view[i++] = b;
	        });
	        bb.limit = i;
	        return bb;
	    };

	    /**
	     * Encodes a binary string to base64 like `window.btoa` does.
	     * @param {string} str Binary string
	     * @returns {string} Base64 encoded string
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa
	     * @expose
	     */
	    ByteBuffer.btoa = function(str) {
	        return ByteBuffer.fromBinary(str).toBase64();
	    };

	    /**
	     * Decodes a base64 encoded string to binary like `window.atob` does.
	     * @param {string} b64 Base64 encoded string
	     * @returns {string} Binary string
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.atob
	     * @expose
	     */
	    ByteBuffer.atob = function(b64) {
	        return ByteBuffer.fromBase64(b64).toBinary();
	    };

	    // encodings/binary

	    /**
	     * Encodes this ByteBuffer to a binary encoded string, that is using only characters 0x00-0xFF as bytes.
	     * @param {number=} begin Offset to begin at. Defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end Offset to end at. Defaults to {@link ByteBuffer#limit}.
	     * @returns {string} Binary encoded string
	     * @throws {RangeError} If `offset > limit`
	     * @expose
	     */
	    ByteBufferPrototype.toBinary = function(begin, end) {
	        if (typeof begin === 'undefined')
	            begin = this.offset;
	        if (typeof end === 'undefined')
	            end = this.limit;
	        begin |= 0; end |= 0;
	        if (begin < 0 || end > this.capacity() || begin > end)
	            throw RangeError("begin, end");
	        if (begin === end)
	            return "";
	        var chars = [],
	            parts = [];
	        while (begin < end) {
	            chars.push(this.view[begin++]);
	            if (chars.length >= 1024)
	                parts.push(String.fromCharCode.apply(String, chars)),
	                chars = [];
	        }
	        return parts.join('') + String.fromCharCode.apply(String, chars);
	    };

	    /**
	     * Decodes a binary encoded string, that is using only characters 0x00-0xFF as bytes, to a ByteBuffer.
	     * @param {string} str String to decode
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     */
	    ByteBuffer.fromBinary = function(str, littleEndian) {
	        if (typeof str !== 'string')
	            throw TypeError("str");
	        var i = 0,
	            k = str.length,
	            charCode,
	            bb = new ByteBuffer(k, littleEndian);
	        while (i<k) {
	            charCode = str.charCodeAt(i);
	            if (charCode > 0xff)
	                throw RangeError("illegal char code: "+charCode);
	            bb.view[i++] = charCode;
	        }
	        bb.limit = k;
	        return bb;
	    };

	    // encodings/debug

	    /**
	     * Encodes this ByteBuffer to a hex encoded string with marked offsets. Offset symbols are:
	     * * `<` : offset,
	     * * `'` : markedOffset,
	     * * `>` : limit,
	     * * `|` : offset and limit,
	     * * `[` : offset and markedOffset,
	     * * `]` : markedOffset and limit,
	     * * `!` : offset, markedOffset and limit
	     * @param {boolean=} columns If `true` returns two columns hex + ascii, defaults to `false`
	     * @returns {string|!Array.<string>} Debug string or array of lines if `asArray = true`
	     * @expose
	     * @example `>00'01 02<03` contains four bytes with `limit=0, markedOffset=1, offset=3`
	     * @example `00[01 02 03>` contains four bytes with `offset=markedOffset=1, limit=4`
	     * @example `00|01 02 03` contains four bytes with `offset=limit=1, markedOffset=-1`
	     * @example `|` contains zero bytes with `offset=limit=0, markedOffset=-1`
	     */
	    ByteBufferPrototype.toDebug = function(columns) {
	        var i = -1,
	            k = this.buffer.byteLength,
	            b,
	            hex = "",
	            asc = "",
	            out = "";
	        while (i<k) {
	            if (i !== -1) {
	                b = this.view[i];
	                if (b < 0x10) hex += "0"+b.toString(16).toUpperCase();
	                else hex += b.toString(16).toUpperCase();
	                if (columns)
	                    asc += b > 32 && b < 127 ? String.fromCharCode(b) : '.';
	            }
	            ++i;
	            if (columns) {
	                if (i > 0 && i % 16 === 0 && i !== k) {
	                    while (hex.length < 3*16+3) hex += " ";
	                    out += hex+asc+"\n";
	                    hex = asc = "";
	                }
	            }
	            if (i === this.offset && i === this.limit)
	                hex += i === this.markedOffset ? "!" : "|";
	            else if (i === this.offset)
	                hex += i === this.markedOffset ? "[" : "<";
	            else if (i === this.limit)
	                hex += i === this.markedOffset ? "]" : ">";
	            else
	                hex += i === this.markedOffset ? "'" : (columns || (i !== 0 && i !== k) ? " " : "");
	        }
	        if (columns && hex !== " ") {
	            while (hex.length < 3*16+3)
	                hex += " ";
	            out += hex + asc + "\n";
	        }
	        return columns ? out : hex;
	    };

	    /**
	     * Decodes a hex encoded string with marked offsets to a ByteBuffer.
	     * @param {string} str Debug string to decode (not be generated with `columns = true`)
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     * @see ByteBuffer#toDebug
	     */
	    ByteBuffer.fromDebug = function(str, littleEndian, noAssert) {
	        var k = str.length,
	            bb = new ByteBuffer(((k+1)/3)|0, littleEndian, noAssert);
	        var i = 0, j = 0, ch, b,
	            rs = false, // Require symbol next
	            ho = false, hm = false, hl = false, // Already has offset (ho), markedOffset (hm), limit (hl)?
	            fail = false;
	        while (i<k) {
	            switch (ch = str.charAt(i++)) {
	                case '!':
	                    if (!noAssert) {
	                        if (ho || hm || hl) {
	                            fail = true;
	                            break;
	                        }
	                        ho = hm = hl = true;
	                    }
	                    bb.offset = bb.markedOffset = bb.limit = j;
	                    rs = false;
	                    break;
	                case '|':
	                    if (!noAssert) {
	                        if (ho || hl) {
	                            fail = true;
	                            break;
	                        }
	                        ho = hl = true;
	                    }
	                    bb.offset = bb.limit = j;
	                    rs = false;
	                    break;
	                case '[':
	                    if (!noAssert) {
	                        if (ho || hm) {
	                            fail = true;
	                            break;
	                        }
	                        ho = hm = true;
	                    }
	                    bb.offset = bb.markedOffset = j;
	                    rs = false;
	                    break;
	                case '<':
	                    if (!noAssert) {
	                        if (ho) {
	                            fail = true;
	                            break;
	                        }
	                        ho = true;
	                    }
	                    bb.offset = j;
	                    rs = false;
	                    break;
	                case ']':
	                    if (!noAssert) {
	                        if (hl || hm) {
	                            fail = true;
	                            break;
	                        }
	                        hl = hm = true;
	                    }
	                    bb.limit = bb.markedOffset = j;
	                    rs = false;
	                    break;
	                case '>':
	                    if (!noAssert) {
	                        if (hl) {
	                            fail = true;
	                            break;
	                        }
	                        hl = true;
	                    }
	                    bb.limit = j;
	                    rs = false;
	                    break;
	                case "'":
	                    if (!noAssert) {
	                        if (hm) {
	                            fail = true;
	                            break;
	                        }
	                        hm = true;
	                    }
	                    bb.markedOffset = j;
	                    rs = false;
	                    break;
	                case ' ':
	                    rs = false;
	                    break;
	                default:
	                    if (!noAssert) {
	                        if (rs) {
	                            fail = true;
	                            break;
	                        }
	                    }
	                    b = parseInt(ch+str.charAt(i++), 16);
	                    if (!noAssert) {
	                        if (isNaN(b) || b < 0 || b > 255)
	                            throw TypeError("Illegal str: Not a debug encoded string");
	                    }
	                    bb.view[j++] = b;
	                    rs = true;
	            }
	            if (fail)
	                throw TypeError("Illegal str: Invalid symbol at "+i);
	        }
	        if (!noAssert) {
	            if (!ho || !hl)
	                throw TypeError("Illegal str: Missing offset or limit");
	            if (j<bb.buffer.byteLength)
	                throw TypeError("Illegal str: Not a debug encoded string (is it hex?) "+j+" < "+k);
	        }
	        return bb;
	    };

	    // encodings/hex

	    /**
	     * Encodes this ByteBuffer's contents to a hex encoded string.
	     * @param {number=} begin Offset to begin at. Defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end Offset to end at. Defaults to {@link ByteBuffer#limit}.
	     * @returns {string} Hex encoded string
	     * @expose
	     */
	    ByteBufferPrototype.toHex = function(begin, end) {
	        begin = typeof begin === 'undefined' ? this.offset : begin;
	        end = typeof end === 'undefined' ? this.limit : end;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        var out = new Array(end - begin),
	            b;
	        while (begin < end) {
	            b = this.view[begin++];
	            if (b < 0x10)
	                out.push("0", b.toString(16));
	            else out.push(b.toString(16));
	        }
	        return out.join('');
	    };

	    /**
	     * Decodes a hex encoded string to a ByteBuffer.
	     * @param {string} str String to decode
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     */
	    ByteBuffer.fromHex = function(str, littleEndian, noAssert) {
	        if (!noAssert) {
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	            if (str.length % 2 !== 0)
	                throw TypeError("Illegal str: Length not a multiple of 2");
	        }
	        var k = str.length,
	            bb = new ByteBuffer((k / 2) | 0, littleEndian),
	            b;
	        for (var i=0, j=0; i<k; i+=2) {
	            b = parseInt(str.substring(i, i+2), 16);
	            if (!noAssert)
	                if (!isFinite(b) || b < 0 || b > 255)
	                    throw TypeError("Illegal str: Contains non-hex characters");
	            bb.view[j++] = b;
	        }
	        bb.limit = j;
	        return bb;
	    };

	    // utfx-embeddable

	    /**
	     * utfx-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
	     * Released under the Apache License, Version 2.0
	     * see: https://github.com/dcodeIO/utfx for details
	     */
	    var utfx = function() {
	        "use strict";

	        /**
	         * utfx namespace.
	         * @inner
	         * @type {!Object.<string,*>}
	         */
	        var utfx = {};

	        /**
	         * Maximum valid code point.
	         * @type {number}
	         * @const
	         */
	        utfx.MAX_CODEPOINT = 0x10FFFF;

	        /**
	         * Encodes UTF8 code points to UTF8 bytes.
	         * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
	         *  respectively `null` if there are no more code points left or a single numeric code point.
	         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte
	         */
	        utfx.encodeUTF8 = function(src, dst) {
	            var cp = null;
	            if (typeof src === 'number')
	                cp = src,
	                src = function() { return null; };
	            while (cp !== null || (cp = src()) !== null) {
	                if (cp < 0x80)
	                    dst(cp&0x7F);
	                else if (cp < 0x800)
	                    dst(((cp>>6)&0x1F)|0xC0),
	                    dst((cp&0x3F)|0x80);
	                else if (cp < 0x10000)
	                    dst(((cp>>12)&0x0F)|0xE0),
	                    dst(((cp>>6)&0x3F)|0x80),
	                    dst((cp&0x3F)|0x80);
	                else
	                    dst(((cp>>18)&0x07)|0xF0),
	                    dst(((cp>>12)&0x3F)|0x80),
	                    dst(((cp>>6)&0x3F)|0x80),
	                    dst((cp&0x3F)|0x80);
	                cp = null;
	            }
	        };

	        /**
	         * Decodes UTF8 bytes to UTF8 code points.
	         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
	         *  are no more bytes left.
	         * @param {!function(number)} dst Code points destination as a function successively called with each decoded code point.
	         * @throws {RangeError} If a starting byte is invalid in UTF8
	         * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the
	         *  remaining bytes.
	         */
	        utfx.decodeUTF8 = function(src, dst) {
	            var a, b, c, d, fail = function(b) {
	                b = b.slice(0, b.indexOf(null));
	                var err = Error(b.toString());
	                err.name = "TruncatedError";
	                err['bytes'] = b;
	                throw err;
	            };
	            while ((a = src()) !== null) {
	                if ((a&0x80) === 0)
	                    dst(a);
	                else if ((a&0xE0) === 0xC0)
	                    ((b = src()) === null) && fail([a, b]),
	                    dst(((a&0x1F)<<6) | (b&0x3F));
	                else if ((a&0xF0) === 0xE0)
	                    ((b=src()) === null || (c=src()) === null) && fail([a, b, c]),
	                    dst(((a&0x0F)<<12) | ((b&0x3F)<<6) | (c&0x3F));
	                else if ((a&0xF8) === 0xF0)
	                    ((b=src()) === null || (c=src()) === null || (d=src()) === null) && fail([a, b, c ,d]),
	                    dst(((a&0x07)<<18) | ((b&0x3F)<<12) | ((c&0x3F)<<6) | (d&0x3F));
	                else throw RangeError("Illegal starting byte: "+a);
	            }
	        };

	        /**
	         * Converts UTF16 characters to UTF8 code points.
	         * @param {!function():number|null} src Characters source as a function returning the next char code respectively
	         *  `null` if there are no more characters left.
	         * @param {!function(number)} dst Code points destination as a function successively called with each converted code
	         *  point.
	         */
	        utfx.UTF16toUTF8 = function(src, dst) {
	            var c1, c2 = null;
	            while (true) {
	                if ((c1 = c2 !== null ? c2 : src()) === null)
	                    break;
	                if (c1 >= 0xD800 && c1 <= 0xDFFF) {
	                    if ((c2 = src()) !== null) {
	                        if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
	                            dst((c1-0xD800)*0x400+c2-0xDC00+0x10000);
	                            c2 = null; continue;
	                        }
	                    }
	                }
	                dst(c1);
	            }
	            if (c2 !== null) dst(c2);
	        };

	        /**
	         * Converts UTF8 code points to UTF16 characters.
	         * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
	         *  respectively `null` if there are no more code points left or a single numeric code point.
	         * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
	         * @throws {RangeError} If a code point is out of range
	         */
	        utfx.UTF8toUTF16 = function(src, dst) {
	            var cp = null;
	            if (typeof src === 'number')
	                cp = src, src = function() { return null; };
	            while (cp !== null || (cp = src()) !== null) {
	                if (cp <= 0xFFFF)
	                    dst(cp);
	                else
	                    cp -= 0x10000,
	                    dst((cp>>10)+0xD800),
	                    dst((cp%0x400)+0xDC00);
	                cp = null;
	            }
	        };

	        /**
	         * Converts and encodes UTF16 characters to UTF8 bytes.
	         * @param {!function():number|null} src Characters source as a function returning the next char code respectively `null`
	         *  if there are no more characters left.
	         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
	         */
	        utfx.encodeUTF16toUTF8 = function(src, dst) {
	            utfx.UTF16toUTF8(src, function(cp) {
	                utfx.encodeUTF8(cp, dst);
	            });
	        };

	        /**
	         * Decodes and converts UTF8 bytes to UTF16 characters.
	         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
	         *  are no more bytes left.
	         * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
	         * @throws {RangeError} If a starting byte is invalid in UTF8
	         * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the remaining bytes.
	         */
	        utfx.decodeUTF8toUTF16 = function(src, dst) {
	            utfx.decodeUTF8(src, function(cp) {
	                utfx.UTF8toUTF16(cp, dst);
	            });
	        };

	        /**
	         * Calculates the byte length of an UTF8 code point.
	         * @param {number} cp UTF8 code point
	         * @returns {number} Byte length
	         */
	        utfx.calculateCodePoint = function(cp) {
	            return (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
	        };

	        /**
	         * Calculates the number of UTF8 bytes required to store UTF8 code points.
	         * @param {(!function():number|null)} src Code points source as a function returning the next code point respectively
	         *  `null` if there are no more code points left.
	         * @returns {number} The number of UTF8 bytes required
	         */
	        utfx.calculateUTF8 = function(src) {
	            var cp, l=0;
	            while ((cp = src()) !== null)
	                l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
	            return l;
	        };

	        /**
	         * Calculates the number of UTF8 code points respectively UTF8 bytes required to store UTF16 char codes.
	         * @param {(!function():number|null)} src Characters source as a function returning the next char code respectively
	         *  `null` if there are no more characters left.
	         * @returns {!Array.<number>} The number of UTF8 code points at index 0 and the number of UTF8 bytes required at index 1.
	         */
	        utfx.calculateUTF16asUTF8 = function(src) {
	            var n=0, l=0;
	            utfx.UTF16toUTF8(src, function(cp) {
	                ++n; l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
	            });
	            return [n,l];
	        };

	        return utfx;
	    }();

	    // encodings/utf8

	    /**
	     * Encodes this ByteBuffer's contents between {@link ByteBuffer#offset} and {@link ByteBuffer#limit} to an UTF8 encoded
	     *  string.
	     * @returns {string} Hex encoded string
	     * @throws {RangeError} If `offset > limit`
	     * @expose
	     */
	    ByteBufferPrototype.toUTF8 = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        var sd; try {
	            utfx.decodeUTF8toUTF16(function() {
	                return begin < end ? this.view[begin++] : null;
	            }.bind(this), sd = stringDestination());
	        } catch (e) {
	            if (begin !== end)
	                throw RangeError("Illegal range: Truncated data, "+begin+" != "+end);
	        }
	        return sd();
	    };

	    /**
	     * Decodes an UTF8 encoded string to a ByteBuffer.
	     * @param {string} str String to decode
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     */
	    ByteBuffer.fromUTF8 = function(str, littleEndian, noAssert) {
	        if (!noAssert)
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	        var bb = new ByteBuffer(utfx.calculateUTF16asUTF8(stringSource(str), true)[1], littleEndian, noAssert),
	            i = 0;
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            bb.view[i++] = b;
	        });
	        bb.limit = i;
	        return bb;
	    };

	    return ByteBuffer;
	});
	});

	var empty$1 = {};


	var empty$2 = Object.freeze({
		default: empty$1
	});

	var require$$2 = ( empty$2 && empty$1 ) || empty$2;

	var protobufLight = createCommonjsModule(function (module) {
	/*
	 Copyright 2013 Daniel Wirtz <dcode@dcode.io>

	 Licensed under the Apache License, Version 2.0 (the "License");
	 you may not use this file except in compliance with the License.
	 You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

	 Unless required by applicable law or agreed to in writing, software
	 distributed under the License is distributed on an "AS IS" BASIS,
	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 See the License for the specific language governing permissions and
	 limitations under the License.
	 */

	/**
	 * @license protobuf.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
	 * Released under the Apache License, Version 2.0
	 * see: https://github.com/dcodeIO/protobuf.js for details
	 */
	(function(global, factory) {

	    /* AMD */ if (typeof undefined === 'function' && undefined["amd"])
	        undefined(["bytebuffer"], factory);
	    /* CommonJS */ else if (typeof commonjsRequire === "function" && 'object' === "object" && module && module["exports"])
	        module["exports"] = factory(bytebuffer, true);
	    /* Global */ else
	        (global["dcodeIO"] = global["dcodeIO"] || {})["ProtoBuf"] = factory(global["dcodeIO"]["ByteBuffer"]);

	})(commonjsGlobal, function(ByteBuffer, isCommonJS) {
	    "use strict";

	    /**
	     * The ProtoBuf namespace.
	     * @exports ProtoBuf
	     * @namespace
	     * @expose
	     */
	    var ProtoBuf = {};

	    /**
	     * @type {!function(new: ByteBuffer, ...[*])}
	     * @expose
	     */
	    ProtoBuf.ByteBuffer = ByteBuffer;

	    /**
	     * @type {?function(new: Long, ...[*])}
	     * @expose
	     */
	    ProtoBuf.Long = ByteBuffer.Long || null;

	    /**
	     * ProtoBuf.js version.
	     * @type {string}
	     * @const
	     * @expose
	     */
	    ProtoBuf.VERSION = "5.0.2";

	    /**
	     * Wire types.
	     * @type {Object.<string,number>}
	     * @const
	     * @expose
	     */
	    ProtoBuf.WIRE_TYPES = {};

	    /**
	     * Varint wire type.
	     * @type {number}
	     * @expose
	     */
	    ProtoBuf.WIRE_TYPES.VARINT = 0;

	    /**
	     * Fixed 64 bits wire type.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ProtoBuf.WIRE_TYPES.BITS64 = 1;

	    /**
	     * Length delimited wire type.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ProtoBuf.WIRE_TYPES.LDELIM = 2;

	    /**
	     * Start group wire type.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ProtoBuf.WIRE_TYPES.STARTGROUP = 3;

	    /**
	     * End group wire type.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ProtoBuf.WIRE_TYPES.ENDGROUP = 4;

	    /**
	     * Fixed 32 bits wire type.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ProtoBuf.WIRE_TYPES.BITS32 = 5;

	    /**
	     * Packable wire types.
	     * @type {!Array.<number>}
	     * @const
	     * @expose
	     */
	    ProtoBuf.PACKABLE_WIRE_TYPES = [
	        ProtoBuf.WIRE_TYPES.VARINT,
	        ProtoBuf.WIRE_TYPES.BITS64,
	        ProtoBuf.WIRE_TYPES.BITS32
	    ];

	    /**
	     * Types.
	     * @dict
	     * @type {!Object.<string,{name: string, wireType: number, defaultValue: *}>}
	     * @const
	     * @expose
	     */
	    ProtoBuf.TYPES = {
	        // According to the protobuf spec.
	        "int32": {
	            name: "int32",
	            wireType: ProtoBuf.WIRE_TYPES.VARINT,
	            defaultValue: 0
	        },
	        "uint32": {
	            name: "uint32",
	            wireType: ProtoBuf.WIRE_TYPES.VARINT,
	            defaultValue: 0
	        },
	        "sint32": {
	            name: "sint32",
	            wireType: ProtoBuf.WIRE_TYPES.VARINT,
	            defaultValue: 0
	        },
	        "int64": {
	            name: "int64",
	            wireType: ProtoBuf.WIRE_TYPES.VARINT,
	            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
	        },
	        "uint64": {
	            name: "uint64",
	            wireType: ProtoBuf.WIRE_TYPES.VARINT,
	            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
	        },
	        "sint64": {
	            name: "sint64",
	            wireType: ProtoBuf.WIRE_TYPES.VARINT,
	            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
	        },
	        "bool": {
	            name: "bool",
	            wireType: ProtoBuf.WIRE_TYPES.VARINT,
	            defaultValue: false
	        },
	        "double": {
	            name: "double",
	            wireType: ProtoBuf.WIRE_TYPES.BITS64,
	            defaultValue: 0
	        },
	        "string": {
	            name: "string",
	            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
	            defaultValue: ""
	        },
	        "bytes": {
	            name: "bytes",
	            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
	            defaultValue: null // overridden in the code, must be a unique instance
	        },
	        "fixed32": {
	            name: "fixed32",
	            wireType: ProtoBuf.WIRE_TYPES.BITS32,
	            defaultValue: 0
	        },
	        "sfixed32": {
	            name: "sfixed32",
	            wireType: ProtoBuf.WIRE_TYPES.BITS32,
	            defaultValue: 0
	        },
	        "fixed64": {
	            name: "fixed64",
	            wireType: ProtoBuf.WIRE_TYPES.BITS64,
	            defaultValue:  ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
	        },
	        "sfixed64": {
	            name: "sfixed64",
	            wireType: ProtoBuf.WIRE_TYPES.BITS64,
	            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
	        },
	        "float": {
	            name: "float",
	            wireType: ProtoBuf.WIRE_TYPES.BITS32,
	            defaultValue: 0
	        },
	        "enum": {
	            name: "enum",
	            wireType: ProtoBuf.WIRE_TYPES.VARINT,
	            defaultValue: 0
	        },
	        "message": {
	            name: "message",
	            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
	            defaultValue: null
	        },
	        "group": {
	            name: "group",
	            wireType: ProtoBuf.WIRE_TYPES.STARTGROUP,
	            defaultValue: null
	        }
	    };

	    /**
	     * Valid map key types.
	     * @type {!Array.<!Object.<string,{name: string, wireType: number, defaultValue: *}>>}
	     * @const
	     * @expose
	     */
	    ProtoBuf.MAP_KEY_TYPES = [
	        ProtoBuf.TYPES["int32"],
	        ProtoBuf.TYPES["sint32"],
	        ProtoBuf.TYPES["sfixed32"],
	        ProtoBuf.TYPES["uint32"],
	        ProtoBuf.TYPES["fixed32"],
	        ProtoBuf.TYPES["int64"],
	        ProtoBuf.TYPES["sint64"],
	        ProtoBuf.TYPES["sfixed64"],
	        ProtoBuf.TYPES["uint64"],
	        ProtoBuf.TYPES["fixed64"],
	        ProtoBuf.TYPES["bool"],
	        ProtoBuf.TYPES["string"],
	        ProtoBuf.TYPES["bytes"]
	    ];

	    /**
	     * Minimum field id.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ProtoBuf.ID_MIN = 1;

	    /**
	     * Maximum field id.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ProtoBuf.ID_MAX = 0x1FFFFFFF;

	    /**
	     * If set to `true`, field names will be converted from underscore notation to camel case. Defaults to `false`.
	     *  Must be set prior to parsing.
	     * @type {boolean}
	     * @expose
	     */
	    ProtoBuf.convertFieldsToCamelCase = false;

	    /**
	     * By default, messages are populated with (setX, set_x) accessors for each field. This can be disabled by
	     *  setting this to `false` prior to building messages.
	     * @type {boolean}
	     * @expose
	     */
	    ProtoBuf.populateAccessors = true;

	    /**
	     * By default, messages are populated with default values if a field is not present on the wire. To disable
	     *  this behavior, set this setting to `false`.
	     * @type {boolean}
	     * @expose
	     */
	    ProtoBuf.populateDefaults = true;

	    /**
	     * @alias ProtoBuf.Util
	     * @expose
	     */
	    ProtoBuf.Util = (function() {
	        "use strict";

	        /**
	         * ProtoBuf utilities.
	         * @exports ProtoBuf.Util
	         * @namespace
	         */
	        var Util = {};

	        /**
	         * Flag if running in node or not.
	         * @type {boolean}
	         * @const
	         * @expose
	         */
	        Util.IS_NODE = !!(
	            typeof process === 'object' && process+'' === '[object process]' && !process['browser']
	        );

	        /**
	         * Constructs a XMLHttpRequest object.
	         * @return {XMLHttpRequest}
	         * @throws {Error} If XMLHttpRequest is not supported
	         * @expose
	         */
	        Util.XHR = function() {
	            // No dependencies please, ref: http://www.quirksmode.org/js/xmlhttp.html
	            var XMLHttpFactories = [
	                function () {return new XMLHttpRequest()},
	                function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	                function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	                function () {return new ActiveXObject("Microsoft.XMLHTTP")}
	            ];
	            /** @type {?XMLHttpRequest} */
	            var xhr = null;
	            for (var i=0;i<XMLHttpFactories.length;i++) {
	                try { xhr = XMLHttpFactories[i](); }
	                catch (e) { continue; }
	                break;
	            }
	            if (!xhr)
	                throw Error("XMLHttpRequest is not supported");
	            return xhr;
	        };

	        /**
	         * Fetches a resource.
	         * @param {string} path Resource path
	         * @param {function(?string)=} callback Callback receiving the resource's contents. If omitted the resource will
	         *   be fetched synchronously. If the request failed, contents will be null.
	         * @return {?string|undefined} Resource contents if callback is omitted (null if the request failed), else undefined.
	         * @expose
	         */
	        Util.fetch = function(path, callback) {
	            if (callback && typeof callback != 'function')
	                callback = null;
	            if (Util.IS_NODE) {
	                var fs = require$$2;
	                if (callback) {
	                    fs.readFile(path, function(err, data) {
	                        if (err)
	                            callback(null);
	                        else
	                            callback(""+data);
	                    });
	                } else
	                    try {
	                        return fs.readFileSync(path);
	                    } catch (e) {
	                        return null;
	                    }
	            } else {
	                var xhr = Util.XHR();
	                xhr.open('GET', path, callback ? true : false);
	                // xhr.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
	                xhr.setRequestHeader('Accept', 'text/plain');
	                if (typeof xhr.overrideMimeType === 'function') xhr.overrideMimeType('text/plain');
	                if (callback) {
	                    xhr.onreadystatechange = function() {
	                        if (xhr.readyState != 4) return;
	                        if (/* remote */ xhr.status == 200 || /* local */ (xhr.status == 0 && typeof xhr.responseText === 'string'))
	                            callback(xhr.responseText);
	                        else
	                            callback(null);
	                    };
	                    if (xhr.readyState == 4)
	                        return;
	                    xhr.send(null);
	                } else {
	                    xhr.send(null);
	                    if (/* remote */ xhr.status == 200 || /* local */ (xhr.status == 0 && typeof xhr.responseText === 'string'))
	                        return xhr.responseText;
	                    return null;
	                }
	            }
	        };

	        /**
	         * Converts a string to camel case.
	         * @param {string} str
	         * @returns {string}
	         * @expose
	         */
	        Util.toCamelCase = function(str) {
	            return str.replace(/_([a-zA-Z])/g, function ($0, $1) {
	                return $1.toUpperCase();
	            });
	        };

	        return Util;
	    })();

	    /**
	     * Language expressions.
	     * @type {!Object.<string,!RegExp>}
	     * @expose
	     */
	    ProtoBuf.Lang = {

	        // Characters always ending a statement
	        DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g,

	        // Field rules
	        RULE: /^(?:required|optional|repeated|map)$/,

	        // Field types
	        TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/,

	        // Names
	        NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/,

	        // Type definitions
	        TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/,

	        // Type references
	        TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,

	        // Fully qualified type references
	        FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/,

	        // All numbers
	        NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/,

	        // Decimal numbers
	        NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/,

	        // Hexadecimal numbers
	        NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/,

	        // Octal numbers
	        NUMBER_OCT: /^0[0-7]+$/,

	        // Floating point numbers
	        NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/,

	        // Booleans
	        BOOL: /^(?:true|false)$/i,

	        // Id numbers
	        ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

	        // Negative id numbers (enum values)
	        NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

	        // Whitespaces
	        WHITESPACE: /\s/,

	        // All strings
	        STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,

	        // Double quoted strings
	        STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,

	        // Single quoted strings
	        STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g
	    };


	    /**
	     * @alias ProtoBuf.Reflect
	     * @expose
	     */
	    ProtoBuf.Reflect = (function(ProtoBuf) {
	        "use strict";

	        /**
	         * Reflection types.
	         * @exports ProtoBuf.Reflect
	         * @namespace
	         */
	        var Reflect = {};

	        /**
	         * Constructs a Reflect base class.
	         * @exports ProtoBuf.Reflect.T
	         * @constructor
	         * @abstract
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {?ProtoBuf.Reflect.T} parent Parent object
	         * @param {string} name Object name
	         */
	        var T = function(builder, parent, name) {

	            /**
	             * Builder reference.
	             * @type {!ProtoBuf.Builder}
	             * @expose
	             */
	            this.builder = builder;

	            /**
	             * Parent object.
	             * @type {?ProtoBuf.Reflect.T}
	             * @expose
	             */
	            this.parent = parent;

	            /**
	             * Object name in namespace.
	             * @type {string}
	             * @expose
	             */
	            this.name = name;

	            /**
	             * Fully qualified class name
	             * @type {string}
	             * @expose
	             */
	            this.className;
	        };

	        /**
	         * @alias ProtoBuf.Reflect.T.prototype
	         * @inner
	         */
	        var TPrototype = T.prototype;

	        /**
	         * Returns the fully qualified name of this object.
	         * @returns {string} Fully qualified name as of ".PATH.TO.THIS"
	         * @expose
	         */
	        TPrototype.fqn = function() {
	            var name = this.name,
	                ptr = this;
	            do {
	                ptr = ptr.parent;
	                if (ptr == null)
	                    break;
	                name = ptr.name+"."+name;
	            } while (true);
	            return name;
	        };

	        /**
	         * Returns a string representation of this Reflect object (its fully qualified name).
	         * @param {boolean=} includeClass Set to true to include the class name. Defaults to false.
	         * @return String representation
	         * @expose
	         */
	        TPrototype.toString = function(includeClass) {
	            return (includeClass ? this.className + " " : "") + this.fqn();
	        };

	        /**
	         * Builds this type.
	         * @throws {Error} If this type cannot be built directly
	         * @expose
	         */
	        TPrototype.build = function() {
	            throw Error(this.toString(true)+" cannot be built directly");
	        };

	        /**
	         * @alias ProtoBuf.Reflect.T
	         * @expose
	         */
	        Reflect.T = T;

	        /**
	         * Constructs a new Namespace.
	         * @exports ProtoBuf.Reflect.Namespace
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {?ProtoBuf.Reflect.Namespace} parent Namespace parent
	         * @param {string} name Namespace name
	         * @param {Object.<string,*>=} options Namespace options
	         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
	         * @constructor
	         * @extends ProtoBuf.Reflect.T
	         */
	        var Namespace = function(builder, parent, name, options, syntax) {
	            T.call(this, builder, parent, name);

	            /**
	             * @override
	             */
	            this.className = "Namespace";

	            /**
	             * Children inside the namespace.
	             * @type {!Array.<ProtoBuf.Reflect.T>}
	             */
	            this.children = [];

	            /**
	             * Options.
	             * @type {!Object.<string, *>}
	             */
	            this.options = options || {};

	            /**
	             * Syntax level (e.g., proto2 or proto3).
	             * @type {!string}
	             */
	            this.syntax = syntax || "proto2";
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Namespace.prototype
	         * @inner
	         */
	        var NamespacePrototype = Namespace.prototype = Object.create(T.prototype);

	        /**
	         * Returns an array of the namespace's children.
	         * @param {ProtoBuf.Reflect.T=} type Filter type (returns instances of this type only). Defaults to null (all children).
	         * @return {Array.<ProtoBuf.Reflect.T>}
	         * @expose
	         */
	        NamespacePrototype.getChildren = function(type) {
	            type = type || null;
	            if (type == null)
	                return this.children.slice();
	            var children = [];
	            for (var i=0, k=this.children.length; i<k; ++i)
	                if (this.children[i] instanceof type)
	                    children.push(this.children[i]);
	            return children;
	        };

	        /**
	         * Adds a child to the namespace.
	         * @param {ProtoBuf.Reflect.T} child Child
	         * @throws {Error} If the child cannot be added (duplicate)
	         * @expose
	         */
	        NamespacePrototype.addChild = function(child) {
	            var other;
	            if (other = this.getChild(child.name)) {
	                // Try to revert camelcase transformation on collision
	                if (other instanceof Message.Field && other.name !== other.originalName && this.getChild(other.originalName) === null)
	                    other.name = other.originalName; // Revert previous first (effectively keeps both originals)
	                else if (child instanceof Message.Field && child.name !== child.originalName && this.getChild(child.originalName) === null)
	                    child.name = child.originalName;
	                else
	                    throw Error("Duplicate name in namespace "+this.toString(true)+": "+child.name);
	            }
	            this.children.push(child);
	        };

	        /**
	         * Gets a child by its name or id.
	         * @param {string|number} nameOrId Child name or id
	         * @return {?ProtoBuf.Reflect.T} The child or null if not found
	         * @expose
	         */
	        NamespacePrototype.getChild = function(nameOrId) {
	            var key = typeof nameOrId === 'number' ? 'id' : 'name';
	            for (var i=0, k=this.children.length; i<k; ++i)
	                if (this.children[i][key] === nameOrId)
	                    return this.children[i];
	            return null;
	        };

	        /**
	         * Resolves a reflect object inside of this namespace.
	         * @param {string|!Array.<string>} qn Qualified name to resolve
	         * @param {boolean=} excludeNonNamespace Excludes non-namespace types, defaults to `false`
	         * @return {?ProtoBuf.Reflect.Namespace} The resolved type or null if not found
	         * @expose
	         */
	        NamespacePrototype.resolve = function(qn, excludeNonNamespace) {
	            var part = typeof qn === 'string' ? qn.split(".") : qn,
	                ptr = this,
	                i = 0;
	            if (part[i] === "") { // Fully qualified name, e.g. ".My.Message'
	                while (ptr.parent !== null)
	                    ptr = ptr.parent;
	                i++;
	            }
	            var child;
	            do {
	                do {
	                    if (!(ptr instanceof Reflect.Namespace)) {
	                        ptr = null;
	                        break;
	                    }
	                    child = ptr.getChild(part[i]);
	                    if (!child || !(child instanceof Reflect.T) || (excludeNonNamespace && !(child instanceof Reflect.Namespace))) {
	                        ptr = null;
	                        break;
	                    }
	                    ptr = child; i++;
	                } while (i < part.length);
	                if (ptr != null)
	                    break; // Found
	                // Else search the parent
	                if (this.parent !== null)
	                    return this.parent.resolve(qn, excludeNonNamespace);
	            } while (ptr != null);
	            return ptr;
	        };

	        /**
	         * Determines the shortest qualified name of the specified type, if any, relative to this namespace.
	         * @param {!ProtoBuf.Reflect.T} t Reflection type
	         * @returns {string} The shortest qualified name or, if there is none, the fqn
	         * @expose
	         */
	        NamespacePrototype.qn = function(t) {
	            var part = [], ptr = t;
	            do {
	                part.unshift(ptr.name);
	                ptr = ptr.parent;
	            } while (ptr !== null);
	            for (var len=1; len <= part.length; len++) {
	                var qn = part.slice(part.length-len);
	                if (t === this.resolve(qn, t instanceof Reflect.Namespace))
	                    return qn.join(".");
	            }
	            return t.fqn();
	        };

	        /**
	         * Builds the namespace and returns the runtime counterpart.
	         * @return {Object.<string,Function|Object>} Runtime namespace
	         * @expose
	         */
	        NamespacePrototype.build = function() {
	            /** @dict */
	            var ns = {};
	            var children = this.children;
	            for (var i=0, k=children.length, child; i<k; ++i) {
	                child = children[i];
	                if (child instanceof Namespace)
	                    ns[child.name] = child.build();
	            }
	            if (Object.defineProperty)
	                Object.defineProperty(ns, "$options", { "value": this.buildOpt() });
	            return ns;
	        };

	        /**
	         * Builds the namespace's '$options' property.
	         * @return {Object.<string,*>}
	         */
	        NamespacePrototype.buildOpt = function() {
	            var opt = {},
	                keys = Object.keys(this.options);
	            for (var i=0, k=keys.length; i<k; ++i) {
	                var key = keys[i],
	                    val = this.options[keys[i]];
	                // TODO: Options are not resolved, yet.
	                // if (val instanceof Namespace) {
	                //     opt[key] = val.build();
	                // } else {
	                opt[key] = val;
	                // }
	            }
	            return opt;
	        };

	        /**
	         * Gets the value assigned to the option with the specified name.
	         * @param {string=} name Returns the option value if specified, otherwise all options are returned.
	         * @return {*|Object.<string,*>}null} Option value or NULL if there is no such option
	         */
	        NamespacePrototype.getOption = function(name) {
	            if (typeof name === 'undefined')
	                return this.options;
	            return typeof this.options[name] !== 'undefined' ? this.options[name] : null;
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Namespace
	         * @expose
	         */
	        Reflect.Namespace = Namespace;

	        /**
	         * Constructs a new Element implementation that checks and converts values for a
	         * particular field type, as appropriate.
	         *
	         * An Element represents a single value: either the value of a singular field,
	         * or a value contained in one entry of a repeated field or map field. This
	         * class does not implement these higher-level concepts; it only encapsulates
	         * the low-level typechecking and conversion.
	         *
	         * @exports ProtoBuf.Reflect.Element
	         * @param {{name: string, wireType: number}} type Resolved data type
	         * @param {ProtoBuf.Reflect.T|null} resolvedType Resolved type, if relevant
	         * (e.g. submessage field).
	         * @param {boolean} isMapKey Is this element a Map key? The value will be
	         * converted to string form if so.
	         * @param {string} syntax Syntax level of defining message type, e.g.,
	         * proto2 or proto3.
	         * @param {string} name Name of the field containing this element (for error
	         * messages)
	         * @constructor
	         */
	        var Element = function(type, resolvedType, isMapKey, syntax, name) {

	            /**
	             * Element type, as a string (e.g., int32).
	             * @type {{name: string, wireType: number}}
	             */
	            this.type = type;

	            /**
	             * Element type reference to submessage or enum definition, if needed.
	             * @type {ProtoBuf.Reflect.T|null}
	             */
	            this.resolvedType = resolvedType;

	            /**
	             * Element is a map key.
	             * @type {boolean}
	             */
	            this.isMapKey = isMapKey;

	            /**
	             * Syntax level of defining message type, e.g., proto2 or proto3.
	             * @type {string}
	             */
	            this.syntax = syntax;

	            /**
	             * Name of the field containing this element (for error messages)
	             * @type {string}
	             */
	            this.name = name;

	            if (isMapKey && ProtoBuf.MAP_KEY_TYPES.indexOf(type) < 0)
	                throw Error("Invalid map key type: " + type.name);
	        };

	        var ElementPrototype = Element.prototype;

	        /**
	         * Obtains a (new) default value for the specified type.
	         * @param type {string|{name: string, wireType: number}} Field type
	         * @returns {*} Default value
	         * @inner
	         */
	        function mkDefault(type) {
	            if (typeof type === 'string')
	                type = ProtoBuf.TYPES[type];
	            if (typeof type.defaultValue === 'undefined')
	                throw Error("default value for type "+type.name+" is not supported");
	            if (type == ProtoBuf.TYPES["bytes"])
	                return new ByteBuffer(0);
	            return type.defaultValue;
	        }

	        /**
	         * Returns the default value for this field in proto3.
	         * @function
	         * @param type {string|{name: string, wireType: number}} the field type
	         * @returns {*} Default value
	         */
	        Element.defaultFieldValue = mkDefault;

	        /**
	         * Makes a Long from a value.
	         * @param {{low: number, high: number, unsigned: boolean}|string|number} value Value
	         * @param {boolean=} unsigned Whether unsigned or not, defaults to reuse it from Long-like objects or to signed for
	         *  strings and numbers
	         * @returns {!Long}
	         * @throws {Error} If the value cannot be converted to a Long
	         * @inner
	         */
	        function mkLong(value, unsigned) {
	            if (value && typeof value.low === 'number' && typeof value.high === 'number' && typeof value.unsigned === 'boolean'
	                && value.low === value.low && value.high === value.high)
	                return new ProtoBuf.Long(value.low, value.high, typeof unsigned === 'undefined' ? value.unsigned : unsigned);
	            if (typeof value === 'string')
	                return ProtoBuf.Long.fromString(value, unsigned || false, 10);
	            if (typeof value === 'number')
	                return ProtoBuf.Long.fromNumber(value, unsigned || false);
	            throw Error("not convertible to Long");
	        }

	        ElementPrototype.toString = function() {
	            return (this.name || '') + (this.isMapKey ? 'map' : 'value') + ' element';
	        };

	        /**
	         * Checks if the given value can be set for an element of this type (singular
	         * field or one element of a repeated field or map).
	         * @param {*} value Value to check
	         * @return {*} Verified, maybe adjusted, value
	         * @throws {Error} If the value cannot be verified for this element slot
	         * @expose
	         */
	        ElementPrototype.verifyValue = function(value) {
	            var self = this;
	            function fail(val, msg) {
	                throw Error("Illegal value for "+self.toString(true)+" of type "+self.type.name+": "+val+" ("+msg+")");
	            }
	            switch (this.type) {
	                // Signed 32bit
	                case ProtoBuf.TYPES["int32"]:
	                case ProtoBuf.TYPES["sint32"]:
	                case ProtoBuf.TYPES["sfixed32"]:
	                    // Account for !NaN: value === value
	                    if (typeof value !== 'number' || (value === value && value % 1 !== 0))
	                        fail(typeof value, "not an integer");
	                    return value > 4294967295 ? value | 0 : value;

	                // Unsigned 32bit
	                case ProtoBuf.TYPES["uint32"]:
	                case ProtoBuf.TYPES["fixed32"]:
	                    if (typeof value !== 'number' || (value === value && value % 1 !== 0))
	                        fail(typeof value, "not an integer");
	                    return value < 0 ? value >>> 0 : value;

	                // Signed 64bit
	                case ProtoBuf.TYPES["int64"]:
	                case ProtoBuf.TYPES["sint64"]:
	                case ProtoBuf.TYPES["sfixed64"]: {
	                    if (ProtoBuf.Long)
	                        try {
	                            return mkLong(value, false);
	                        } catch (e) {
	                            fail(typeof value, e.message);
	                        }
	                    else
	                        fail(typeof value, "requires Long.js");
	                }

	                // Unsigned 64bit
	                case ProtoBuf.TYPES["uint64"]:
	                case ProtoBuf.TYPES["fixed64"]: {
	                    if (ProtoBuf.Long)
	                        try {
	                            return mkLong(value, true);
	                        } catch (e) {
	                            fail(typeof value, e.message);
	                        }
	                    else
	                        fail(typeof value, "requires Long.js");
	                }

	                // Bool
	                case ProtoBuf.TYPES["bool"]:
	                    if (typeof value !== 'boolean')
	                        fail(typeof value, "not a boolean");
	                    return value;

	                // Float
	                case ProtoBuf.TYPES["float"]:
	                case ProtoBuf.TYPES["double"]:
	                    if (typeof value !== 'number')
	                        fail(typeof value, "not a number");
	                    return value;

	                // Length-delimited string
	                case ProtoBuf.TYPES["string"]:
	                    if (typeof value !== 'string' && !(value && value instanceof String))
	                        fail(typeof value, "not a string");
	                    return ""+value; // Convert String object to string

	                // Length-delimited bytes
	                case ProtoBuf.TYPES["bytes"]:
	                    if (ByteBuffer.isByteBuffer(value))
	                        return value;
	                    return ByteBuffer.wrap(value, "base64");

	                // Constant enum value
	                case ProtoBuf.TYPES["enum"]: {
	                    var values = this.resolvedType.getChildren(ProtoBuf.Reflect.Enum.Value);
	                    for (i=0; i<values.length; i++)
	                        if (values[i].name == value)
	                            return values[i].id;
	                        else if (values[i].id == value)
	                            return values[i].id;

	                    if (this.syntax === 'proto3') {
	                        // proto3: just make sure it's an integer.
	                        if (typeof value !== 'number' || (value === value && value % 1 !== 0))
	                            fail(typeof value, "not an integer");
	                        if (value > 4294967295 || value < 0)
	                            fail(typeof value, "not in range for uint32");
	                        return value;
	                    } else {
	                        // proto2 requires enum values to be valid.
	                        fail(value, "not a valid enum value");
	                    }
	                }
	                // Embedded message
	                case ProtoBuf.TYPES["group"]:
	                case ProtoBuf.TYPES["message"]: {
	                    if (!value || typeof value !== 'object')
	                        fail(typeof value, "object expected");
	                    if (value instanceof this.resolvedType.clazz)
	                        return value;
	                    if (value instanceof ProtoBuf.Builder.Message) {
	                        // Mismatched type: Convert to object (see: https://github.com/dcodeIO/ProtoBuf.js/issues/180)
	                        var obj = {};
	                        for (var i in value)
	                            if (value.hasOwnProperty(i))
	                                obj[i] = value[i];
	                        value = obj;
	                    }
	                    // Else let's try to construct one from a key-value object
	                    return new (this.resolvedType.clazz)(value); // May throw for a hundred of reasons
	                }
	            }

	            // We should never end here
	            throw Error("[INTERNAL] Illegal value for "+this.toString(true)+": "+value+" (undefined type "+this.type+")");
	        };

	        /**
	         * Calculates the byte length of an element on the wire.
	         * @param {number} id Field number
	         * @param {*} value Field value
	         * @returns {number} Byte length
	         * @throws {Error} If the value cannot be calculated
	         * @expose
	         */
	        ElementPrototype.calculateLength = function(id, value) {
	            if (value === null) return 0; // Nothing to encode
	            // Tag has already been written
	            var n;
	            switch (this.type) {
	                case ProtoBuf.TYPES["int32"]:
	                    return value < 0 ? ByteBuffer.calculateVarint64(value) : ByteBuffer.calculateVarint32(value);
	                case ProtoBuf.TYPES["uint32"]:
	                    return ByteBuffer.calculateVarint32(value);
	                case ProtoBuf.TYPES["sint32"]:
	                    return ByteBuffer.calculateVarint32(ByteBuffer.zigZagEncode32(value));
	                case ProtoBuf.TYPES["fixed32"]:
	                case ProtoBuf.TYPES["sfixed32"]:
	                case ProtoBuf.TYPES["float"]:
	                    return 4;
	                case ProtoBuf.TYPES["int64"]:
	                case ProtoBuf.TYPES["uint64"]:
	                    return ByteBuffer.calculateVarint64(value);
	                case ProtoBuf.TYPES["sint64"]:
	                    return ByteBuffer.calculateVarint64(ByteBuffer.zigZagEncode64(value));
	                case ProtoBuf.TYPES["fixed64"]:
	                case ProtoBuf.TYPES["sfixed64"]:
	                    return 8;
	                case ProtoBuf.TYPES["bool"]:
	                    return 1;
	                case ProtoBuf.TYPES["enum"]:
	                    return ByteBuffer.calculateVarint32(value);
	                case ProtoBuf.TYPES["double"]:
	                    return 8;
	                case ProtoBuf.TYPES["string"]:
	                    n = ByteBuffer.calculateUTF8Bytes(value);
	                    return ByteBuffer.calculateVarint32(n) + n;
	                case ProtoBuf.TYPES["bytes"]:
	                    if (value.remaining() < 0)
	                        throw Error("Illegal value for "+this.toString(true)+": "+value.remaining()+" bytes remaining");
	                    return ByteBuffer.calculateVarint32(value.remaining()) + value.remaining();
	                case ProtoBuf.TYPES["message"]:
	                    n = this.resolvedType.calculate(value);
	                    return ByteBuffer.calculateVarint32(n) + n;
	                case ProtoBuf.TYPES["group"]:
	                    n = this.resolvedType.calculate(value);
	                    return n + ByteBuffer.calculateVarint32((id << 3) | ProtoBuf.WIRE_TYPES.ENDGROUP);
	            }
	            // We should never end here
	            throw Error("[INTERNAL] Illegal value to encode in "+this.toString(true)+": "+value+" (unknown type)");
	        };

	        /**
	         * Encodes a value to the specified buffer. Does not encode the key.
	         * @param {number} id Field number
	         * @param {*} value Field value
	         * @param {ByteBuffer} buffer ByteBuffer to encode to
	         * @return {ByteBuffer} The ByteBuffer for chaining
	         * @throws {Error} If the value cannot be encoded
	         * @expose
	         */
	        ElementPrototype.encodeValue = function(id, value, buffer) {
	            if (value === null) return buffer; // Nothing to encode
	            // Tag has already been written

	            switch (this.type) {
	                // 32bit signed varint
	                case ProtoBuf.TYPES["int32"]:
	                    // "If you use int32 or int64 as the type for a negative number, the resulting varint is always ten bytes
	                    // long – it is, effectively, treated like a very large unsigned integer." (see #122)
	                    if (value < 0)
	                        buffer.writeVarint64(value);
	                    else
	                        buffer.writeVarint32(value);
	                    break;

	                // 32bit unsigned varint
	                case ProtoBuf.TYPES["uint32"]:
	                    buffer.writeVarint32(value);
	                    break;

	                // 32bit varint zig-zag
	                case ProtoBuf.TYPES["sint32"]:
	                    buffer.writeVarint32ZigZag(value);
	                    break;

	                // Fixed unsigned 32bit
	                case ProtoBuf.TYPES["fixed32"]:
	                    buffer.writeUint32(value);
	                    break;

	                // Fixed signed 32bit
	                case ProtoBuf.TYPES["sfixed32"]:
	                    buffer.writeInt32(value);
	                    break;

	                // 64bit varint as-is
	                case ProtoBuf.TYPES["int64"]:
	                case ProtoBuf.TYPES["uint64"]:
	                    buffer.writeVarint64(value); // throws
	                    break;

	                // 64bit varint zig-zag
	                case ProtoBuf.TYPES["sint64"]:
	                    buffer.writeVarint64ZigZag(value); // throws
	                    break;

	                // Fixed unsigned 64bit
	                case ProtoBuf.TYPES["fixed64"]:
	                    buffer.writeUint64(value); // throws
	                    break;

	                // Fixed signed 64bit
	                case ProtoBuf.TYPES["sfixed64"]:
	                    buffer.writeInt64(value); // throws
	                    break;

	                // Bool
	                case ProtoBuf.TYPES["bool"]:
	                    if (typeof value === 'string')
	                        buffer.writeVarint32(value.toLowerCase() === 'false' ? 0 : !!value);
	                    else
	                        buffer.writeVarint32(value ? 1 : 0);
	                    break;

	                // Constant enum value
	                case ProtoBuf.TYPES["enum"]:
	                    buffer.writeVarint32(value);
	                    break;

	                // 32bit float
	                case ProtoBuf.TYPES["float"]:
	                    buffer.writeFloat32(value);
	                    break;

	                // 64bit float
	                case ProtoBuf.TYPES["double"]:
	                    buffer.writeFloat64(value);
	                    break;

	                // Length-delimited string
	                case ProtoBuf.TYPES["string"]:
	                    buffer.writeVString(value);
	                    break;

	                // Length-delimited bytes
	                case ProtoBuf.TYPES["bytes"]:
	                    if (value.remaining() < 0)
	                        throw Error("Illegal value for "+this.toString(true)+": "+value.remaining()+" bytes remaining");
	                    var prevOffset = value.offset;
	                    buffer.writeVarint32(value.remaining());
	                    buffer.append(value);
	                    value.offset = prevOffset;
	                    break;

	                // Embedded message
	                case ProtoBuf.TYPES["message"]:
	                    var bb = new ByteBuffer().LE();
	                    this.resolvedType.encode(value, bb);
	                    buffer.writeVarint32(bb.offset);
	                    buffer.append(bb.flip());
	                    break;

	                // Legacy group
	                case ProtoBuf.TYPES["group"]:
	                    this.resolvedType.encode(value, buffer);
	                    buffer.writeVarint32((id << 3) | ProtoBuf.WIRE_TYPES.ENDGROUP);
	                    break;

	                default:
	                    // We should never end here
	                    throw Error("[INTERNAL] Illegal value to encode in "+this.toString(true)+": "+value+" (unknown type)");
	            }
	            return buffer;
	        };

	        /**
	         * Decode one element value from the specified buffer.
	         * @param {ByteBuffer} buffer ByteBuffer to decode from
	         * @param {number} wireType The field wire type
	         * @param {number} id The field number
	         * @return {*} Decoded value
	         * @throws {Error} If the field cannot be decoded
	         * @expose
	         */
	        ElementPrototype.decode = function(buffer, wireType, id) {
	            if (wireType != this.type.wireType)
	                throw Error("Unexpected wire type for element");

	            var value, nBytes;
	            switch (this.type) {
	                // 32bit signed varint
	                case ProtoBuf.TYPES["int32"]:
	                    return buffer.readVarint32() | 0;

	                // 32bit unsigned varint
	                case ProtoBuf.TYPES["uint32"]:
	                    return buffer.readVarint32() >>> 0;

	                // 32bit signed varint zig-zag
	                case ProtoBuf.TYPES["sint32"]:
	                    return buffer.readVarint32ZigZag() | 0;

	                // Fixed 32bit unsigned
	                case ProtoBuf.TYPES["fixed32"]:
	                    return buffer.readUint32() >>> 0;

	                case ProtoBuf.TYPES["sfixed32"]:
	                    return buffer.readInt32() | 0;

	                // 64bit signed varint
	                case ProtoBuf.TYPES["int64"]:
	                    return buffer.readVarint64();

	                // 64bit unsigned varint
	                case ProtoBuf.TYPES["uint64"]:
	                    return buffer.readVarint64().toUnsigned();

	                // 64bit signed varint zig-zag
	                case ProtoBuf.TYPES["sint64"]:
	                    return buffer.readVarint64ZigZag();

	                // Fixed 64bit unsigned
	                case ProtoBuf.TYPES["fixed64"]:
	                    return buffer.readUint64();

	                // Fixed 64bit signed
	                case ProtoBuf.TYPES["sfixed64"]:
	                    return buffer.readInt64();

	                // Bool varint
	                case ProtoBuf.TYPES["bool"]:
	                    return !!buffer.readVarint32();

	                // Constant enum value (varint)
	                case ProtoBuf.TYPES["enum"]:
	                    // The following Builder.Message#set will already throw
	                    return buffer.readVarint32();

	                // 32bit float
	                case ProtoBuf.TYPES["float"]:
	                    return buffer.readFloat();

	                // 64bit float
	                case ProtoBuf.TYPES["double"]:
	                    return buffer.readDouble();

	                // Length-delimited string
	                case ProtoBuf.TYPES["string"]:
	                    return buffer.readVString();

	                // Length-delimited bytes
	                case ProtoBuf.TYPES["bytes"]: {
	                    nBytes = buffer.readVarint32();
	                    if (buffer.remaining() < nBytes)
	                        throw Error("Illegal number of bytes for "+this.toString(true)+": "+nBytes+" required but got only "+buffer.remaining());
	                    value = buffer.clone(); // Offset already set
	                    value.limit = value.offset+nBytes;
	                    buffer.offset += nBytes;
	                    return value;
	                }

	                // Length-delimited embedded message
	                case ProtoBuf.TYPES["message"]: {
	                    nBytes = buffer.readVarint32();
	                    return this.resolvedType.decode(buffer, nBytes);
	                }

	                // Legacy group
	                case ProtoBuf.TYPES["group"]:
	                    return this.resolvedType.decode(buffer, -1, id);
	            }

	            // We should never end here
	            throw Error("[INTERNAL] Illegal decode type");
	        };

	        /**
	         * Converts a value from a string to the canonical element type.
	         *
	         * Legal only when isMapKey is true.
	         *
	         * @param {string} str The string value
	         * @returns {*} The value
	         */
	        ElementPrototype.valueFromString = function(str) {
	            if (!this.isMapKey) {
	                throw Error("valueFromString() called on non-map-key element");
	            }

	            switch (this.type) {
	                case ProtoBuf.TYPES["int32"]:
	                case ProtoBuf.TYPES["sint32"]:
	                case ProtoBuf.TYPES["sfixed32"]:
	                case ProtoBuf.TYPES["uint32"]:
	                case ProtoBuf.TYPES["fixed32"]:
	                    return this.verifyValue(parseInt(str));

	                case ProtoBuf.TYPES["int64"]:
	                case ProtoBuf.TYPES["sint64"]:
	                case ProtoBuf.TYPES["sfixed64"]:
	                case ProtoBuf.TYPES["uint64"]:
	                case ProtoBuf.TYPES["fixed64"]:
	                      // Long-based fields support conversions from string already.
	                      return this.verifyValue(str);

	                case ProtoBuf.TYPES["bool"]:
	                      return str === "true";

	                case ProtoBuf.TYPES["string"]:
	                      return this.verifyValue(str);

	                case ProtoBuf.TYPES["bytes"]:
	                      return ByteBuffer.fromBinary(str);
	            }
	        };

	        /**
	         * Converts a value from the canonical element type to a string.
	         *
	         * It should be the case that `valueFromString(valueToString(val))` returns
	         * a value equivalent to `verifyValue(val)` for every legal value of `val`
	         * according to this element type.
	         *
	         * This may be used when the element must be stored or used as a string,
	         * e.g., as a map key on an Object.
	         *
	         * Legal only when isMapKey is true.
	         *
	         * @param {*} val The value
	         * @returns {string} The string form of the value.
	         */
	        ElementPrototype.valueToString = function(value) {
	            if (!this.isMapKey) {
	                throw Error("valueToString() called on non-map-key element");
	            }

	            if (this.type === ProtoBuf.TYPES["bytes"]) {
	                return value.toString("binary");
	            } else {
	                return value.toString();
	            }
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Element
	         * @expose
	         */
	        Reflect.Element = Element;

	        /**
	         * Constructs a new Message.
	         * @exports ProtoBuf.Reflect.Message
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.Namespace} parent Parent message or namespace
	         * @param {string} name Message name
	         * @param {Object.<string,*>=} options Message options
	         * @param {boolean=} isGroup `true` if this is a legacy group
	         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
	         * @constructor
	         * @extends ProtoBuf.Reflect.Namespace
	         */
	        var Message = function(builder, parent, name, options, isGroup, syntax) {
	            Namespace.call(this, builder, parent, name, options, syntax);

	            /**
	             * @override
	             */
	            this.className = "Message";

	            /**
	             * Extensions range.
	             * @type {!Array.<number>|undefined}
	             * @expose
	             */
	            this.extensions = undefined;

	            /**
	             * Runtime message class.
	             * @type {?function(new:ProtoBuf.Builder.Message)}
	             * @expose
	             */
	            this.clazz = null;

	            /**
	             * Whether this is a legacy group or not.
	             * @type {boolean}
	             * @expose
	             */
	            this.isGroup = !!isGroup;

	            // The following cached collections are used to efficiently iterate over or look up fields when decoding.

	            /**
	             * Cached fields.
	             * @type {?Array.<!ProtoBuf.Reflect.Message.Field>}
	             * @private
	             */
	            this._fields = null;

	            /**
	             * Cached fields by id.
	             * @type {?Object.<number,!ProtoBuf.Reflect.Message.Field>}
	             * @private
	             */
	            this._fieldsById = null;

	            /**
	             * Cached fields by name.
	             * @type {?Object.<string,!ProtoBuf.Reflect.Message.Field>}
	             * @private
	             */
	            this._fieldsByName = null;
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Message.prototype
	         * @inner
	         */
	        var MessagePrototype = Message.prototype = Object.create(Namespace.prototype);

	        /**
	         * Builds the message and returns the runtime counterpart, which is a fully functional class.
	         * @see ProtoBuf.Builder.Message
	         * @param {boolean=} rebuild Whether to rebuild or not, defaults to false
	         * @return {ProtoBuf.Reflect.Message} Message class
	         * @throws {Error} If the message cannot be built
	         * @expose
	         */
	        MessagePrototype.build = function(rebuild) {
	            if (this.clazz && !rebuild)
	                return this.clazz;

	            // Create the runtime Message class in its own scope
	            var clazz = (function(ProtoBuf, T) {

	                var fields = T.getChildren(ProtoBuf.Reflect.Message.Field),
	                    oneofs = T.getChildren(ProtoBuf.Reflect.Message.OneOf);

	                /**
	                 * Constructs a new runtime Message.
	                 * @name ProtoBuf.Builder.Message
	                 * @class Barebone of all runtime messages.
	                 * @param {!Object.<string,*>|string} values Preset values
	                 * @param {...string} var_args
	                 * @constructor
	                 * @throws {Error} If the message cannot be created
	                 */
	                var Message = function(values, var_args) {
	                    ProtoBuf.Builder.Message.call(this);

	                    // Create virtual oneof properties
	                    for (var i=0, k=oneofs.length; i<k; ++i)
	                        this[oneofs[i].name] = null;
	                    // Create fields and set default values
	                    for (i=0, k=fields.length; i<k; ++i) {
	                        var field = fields[i];
	                        this[field.name] =
	                            field.repeated ? [] :
	                            (field.map ? new ProtoBuf.Map(field) : null);
	                        if ((field.required || T.syntax === 'proto3') &&
	                            field.defaultValue !== null)
	                            this[field.name] = field.defaultValue;
	                    }

	                    if (arguments.length > 0) {
	                        var value;
	                        // Set field values from a values object
	                        if (arguments.length === 1 && values !== null && typeof values === 'object' &&
	                            /* not _another_ Message */ (typeof values.encode !== 'function' || values instanceof Message) &&
	                            /* not a repeated field */ !Array.isArray(values) &&
	                            /* not a Map */ !(values instanceof ProtoBuf.Map) &&
	                            /* not a ByteBuffer */ !ByteBuffer.isByteBuffer(values) &&
	                            /* not an ArrayBuffer */ !(values instanceof ArrayBuffer) &&
	                            /* not a Long */ !(ProtoBuf.Long && values instanceof ProtoBuf.Long)) {
	                            this.$set(values);
	                        } else // Set field values from arguments, in declaration order
	                            for (i=0, k=arguments.length; i<k; ++i)
	                                if (typeof (value = arguments[i]) !== 'undefined')
	                                    this.$set(fields[i].name, value); // May throw
	                    }
	                };

	                /**
	                 * @alias ProtoBuf.Builder.Message.prototype
	                 * @inner
	                 */
	                var MessagePrototype = Message.prototype = Object.create(ProtoBuf.Builder.Message.prototype);

	                /**
	                 * Adds a value to a repeated field.
	                 * @name ProtoBuf.Builder.Message#add
	                 * @function
	                 * @param {string} key Field name
	                 * @param {*} value Value to add
	                 * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
	                 * @returns {!ProtoBuf.Builder.Message} this
	                 * @throws {Error} If the value cannot be added
	                 * @expose
	                 */
	                MessagePrototype.add = function(key, value, noAssert) {
	                    var field = T._fieldsByName[key];
	                    if (!noAssert) {
	                        if (!field)
	                            throw Error(this+"#"+key+" is undefined");
	                        if (!(field instanceof ProtoBuf.Reflect.Message.Field))
	                            throw Error(this+"#"+key+" is not a field: "+field.toString(true)); // May throw if it's an enum or embedded message
	                        if (!field.repeated)
	                            throw Error(this+"#"+key+" is not a repeated field");
	                        value = field.verifyValue(value, true);
	                    }
	                    if (this[key] === null)
	                        this[key] = [];
	                    this[key].push(value);
	                    return this;
	                };

	                /**
	                 * Adds a value to a repeated field. This is an alias for {@link ProtoBuf.Builder.Message#add}.
	                 * @name ProtoBuf.Builder.Message#$add
	                 * @function
	                 * @param {string} key Field name
	                 * @param {*} value Value to add
	                 * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
	                 * @returns {!ProtoBuf.Builder.Message} this
	                 * @throws {Error} If the value cannot be added
	                 * @expose
	                 */
	                MessagePrototype.$add = MessagePrototype.add;

	                /**
	                 * Sets a field's value.
	                 * @name ProtoBuf.Builder.Message#set
	                 * @function
	                 * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
	                 * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
	                 * @param {boolean=} noAssert Whether to not assert for an actual field / proper value type, defaults to `false`
	                 * @returns {!ProtoBuf.Builder.Message} this
	                 * @throws {Error} If the value cannot be set
	                 * @expose
	                 */
	                MessagePrototype.set = function(keyOrObj, value, noAssert) {
	                    if (keyOrObj && typeof keyOrObj === 'object') {
	                        noAssert = value;
	                        for (var ikey in keyOrObj) {
	                            // Check if virtual oneof field - don't set these
	                            if (keyOrObj.hasOwnProperty(ikey) && typeof (value = keyOrObj[ikey]) !== 'undefined' && T._oneofsByName[ikey] === undefined)
	                                this.$set(ikey, value, noAssert);
	                        }
	                        return this;
	                    }
	                    var field = T._fieldsByName[keyOrObj];
	                    if (!noAssert) {
	                        if (!field)
	                            throw Error(this+"#"+keyOrObj+" is not a field: undefined");
	                        if (!(field instanceof ProtoBuf.Reflect.Message.Field))
	                            throw Error(this+"#"+keyOrObj+" is not a field: "+field.toString(true));
	                        this[field.name] = (value = field.verifyValue(value)); // May throw
	                    } else
	                        this[keyOrObj] = value;
	                    if (field && field.oneof) { // Field is part of an OneOf (not a virtual OneOf field)
	                        var currentField = this[field.oneof.name]; // Virtual field references currently set field
	                        if (value !== null) {
	                            if (currentField !== null && currentField !== field.name)
	                                this[currentField] = null; // Clear currently set field
	                            this[field.oneof.name] = field.name; // Point virtual field at this field
	                        } else if (/* value === null && */currentField === keyOrObj)
	                            this[field.oneof.name] = null; // Clear virtual field (current field explicitly cleared)
	                    }
	                    return this;
	                };

	                /**
	                 * Sets a field's value. This is an alias for [@link ProtoBuf.Builder.Message#set}.
	                 * @name ProtoBuf.Builder.Message#$set
	                 * @function
	                 * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
	                 * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
	                 * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
	                 * @throws {Error} If the value cannot be set
	                 * @expose
	                 */
	                MessagePrototype.$set = MessagePrototype.set;

	                /**
	                 * Gets a field's value.
	                 * @name ProtoBuf.Builder.Message#get
	                 * @function
	                 * @param {string} key Key
	                 * @param {boolean=} noAssert Whether to not assert for an actual field, defaults to `false`
	                 * @return {*} Value
	                 * @throws {Error} If there is no such field
	                 * @expose
	                 */
	                MessagePrototype.get = function(key, noAssert) {
	                    if (noAssert)
	                        return this[key];
	                    var field = T._fieldsByName[key];
	                    if (!field || !(field instanceof ProtoBuf.Reflect.Message.Field))
	                        throw Error(this+"#"+key+" is not a field: undefined");
	                    if (!(field instanceof ProtoBuf.Reflect.Message.Field))
	                        throw Error(this+"#"+key+" is not a field: "+field.toString(true));
	                    return this[field.name];
	                };

	                /**
	                 * Gets a field's value. This is an alias for {@link ProtoBuf.Builder.Message#$get}.
	                 * @name ProtoBuf.Builder.Message#$get
	                 * @function
	                 * @param {string} key Key
	                 * @return {*} Value
	                 * @throws {Error} If there is no such field
	                 * @expose
	                 */
	                MessagePrototype.$get = MessagePrototype.get;

	                // Getters and setters

	                for (var i=0; i<fields.length; i++) {
	                    var field = fields[i];
	                    // no setters for extension fields as these are named by their fqn
	                    if (field instanceof ProtoBuf.Reflect.Message.ExtensionField)
	                        continue;

	                    if (T.builder.options['populateAccessors'])
	                        (function(field) {
	                            // set/get[SomeValue]
	                            var Name = field.originalName.replace(/(_[a-zA-Z])/g, function(match) {
	                                return match.toUpperCase().replace('_','');
	                            });
	                            Name = Name.substring(0,1).toUpperCase() + Name.substring(1);

	                            // set/get_[some_value] FIXME: Do we really need these?
	                            var name = field.originalName.replace(/([A-Z])/g, function(match) {
	                                return "_"+match;
	                            });

	                            /**
	                             * The current field's unbound setter function.
	                             * @function
	                             * @param {*} value
	                             * @param {boolean=} noAssert
	                             * @returns {!ProtoBuf.Builder.Message}
	                             * @inner
	                             */
	                            var setter = function(value, noAssert) {
	                                this[field.name] = noAssert ? value : field.verifyValue(value);
	                                return this;
	                            };

	                            /**
	                             * The current field's unbound getter function.
	                             * @function
	                             * @returns {*}
	                             * @inner
	                             */
	                            var getter = function() {
	                                return this[field.name];
	                            };

	                            if (T.getChild("set"+Name) === null)
	                                /**
	                                 * Sets a value. This method is present for each field, but only if there is no name conflict with
	                                 *  another field.
	                                 * @name ProtoBuf.Builder.Message#set[SomeField]
	                                 * @function
	                                 * @param {*} value Value to set
	                                 * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
	                                 * @returns {!ProtoBuf.Builder.Message} this
	                                 * @abstract
	                                 * @throws {Error} If the value cannot be set
	                                 */
	                                MessagePrototype["set"+Name] = setter;

	                            if (T.getChild("set_"+name) === null)
	                                /**
	                                 * Sets a value. This method is present for each field, but only if there is no name conflict with
	                                 *  another field.
	                                 * @name ProtoBuf.Builder.Message#set_[some_field]
	                                 * @function
	                                 * @param {*} value Value to set
	                                 * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
	                                 * @returns {!ProtoBuf.Builder.Message} this
	                                 * @abstract
	                                 * @throws {Error} If the value cannot be set
	                                 */
	                                MessagePrototype["set_"+name] = setter;

	                            if (T.getChild("get"+Name) === null)
	                                /**
	                                 * Gets a value. This method is present for each field, but only if there is no name conflict with
	                                 *  another field.
	                                 * @name ProtoBuf.Builder.Message#get[SomeField]
	                                 * @function
	                                 * @abstract
	                                 * @return {*} The value
	                                 */
	                                MessagePrototype["get"+Name] = getter;

	                            if (T.getChild("get_"+name) === null)
	                                /**
	                                 * Gets a value. This method is present for each field, but only if there is no name conflict with
	                                 *  another field.
	                                 * @name ProtoBuf.Builder.Message#get_[some_field]
	                                 * @function
	                                 * @return {*} The value
	                                 * @abstract
	                                 */
	                                MessagePrototype["get_"+name] = getter;

	                        })(field);
	                }

	                // En-/decoding

	                /**
	                 * Encodes the message.
	                 * @name ProtoBuf.Builder.Message#$encode
	                 * @function
	                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
	                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
	                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
	                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
	                 *  returns the encoded ByteBuffer in the `encoded` property on the error.
	                 * @expose
	                 * @see ProtoBuf.Builder.Message#encode64
	                 * @see ProtoBuf.Builder.Message#encodeHex
	                 * @see ProtoBuf.Builder.Message#encodeAB
	                 */
	                MessagePrototype.encode = function(buffer, noVerify) {
	                    if (typeof buffer === 'boolean')
	                        noVerify = buffer,
	                        buffer = undefined;
	                    var isNew = false;
	                    if (!buffer)
	                        buffer = new ByteBuffer(),
	                        isNew = true;
	                    var le = buffer.littleEndian;
	                    try {
	                        T.encode(this, buffer.LE(), noVerify);
	                        return (isNew ? buffer.flip() : buffer).LE(le);
	                    } catch (e) {
	                        buffer.LE(le);
	                        throw(e);
	                    }
	                };

	                /**
	                 * Encodes a message using the specified data payload.
	                 * @param {!Object.<string,*>} data Data payload
	                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
	                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
	                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
	                 * @expose
	                 */
	                Message.encode = function(data, buffer, noVerify) {
	                    return new Message(data).encode(buffer, noVerify);
	                };

	                /**
	                 * Calculates the byte length of the message.
	                 * @name ProtoBuf.Builder.Message#calculate
	                 * @function
	                 * @returns {number} Byte length
	                 * @throws {Error} If the message cannot be calculated or if required fields are missing.
	                 * @expose
	                 */
	                MessagePrototype.calculate = function() {
	                    return T.calculate(this);
	                };

	                /**
	                 * Encodes the varint32 length-delimited message.
	                 * @name ProtoBuf.Builder.Message#encodeDelimited
	                 * @function
	                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
	                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
	                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
	                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
	                 *  returns the encoded ByteBuffer in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.encodeDelimited = function(buffer, noVerify) {
	                    var isNew = false;
	                    if (!buffer)
	                        buffer = new ByteBuffer(),
	                        isNew = true;
	                    var enc = new ByteBuffer().LE();
	                    T.encode(this, enc, noVerify).flip();
	                    buffer.writeVarint32(enc.remaining());
	                    buffer.append(enc);
	                    return isNew ? buffer.flip() : buffer;
	                };

	                /**
	                 * Directly encodes the message to an ArrayBuffer.
	                 * @name ProtoBuf.Builder.Message#encodeAB
	                 * @function
	                 * @return {ArrayBuffer} Encoded message as ArrayBuffer
	                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
	                 *  returns the encoded ArrayBuffer in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.encodeAB = function() {
	                    try {
	                        return this.encode().toArrayBuffer();
	                    } catch (e) {
	                        if (e["encoded"]) e["encoded"] = e["encoded"].toArrayBuffer();
	                        throw(e);
	                    }
	                };

	                /**
	                 * Returns the message as an ArrayBuffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeAB}.
	                 * @name ProtoBuf.Builder.Message#toArrayBuffer
	                 * @function
	                 * @return {ArrayBuffer} Encoded message as ArrayBuffer
	                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
	                 *  returns the encoded ArrayBuffer in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.toArrayBuffer = MessagePrototype.encodeAB;

	                /**
	                 * Directly encodes the message to a node Buffer.
	                 * @name ProtoBuf.Builder.Message#encodeNB
	                 * @function
	                 * @return {!Buffer}
	                 * @throws {Error} If the message cannot be encoded, not running under node.js or if required fields are
	                 *  missing. The later still returns the encoded node Buffer in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.encodeNB = function() {
	                    try {
	                        return this.encode().toBuffer();
	                    } catch (e) {
	                        if (e["encoded"]) e["encoded"] = e["encoded"].toBuffer();
	                        throw(e);
	                    }
	                };

	                /**
	                 * Returns the message as a node Buffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeNB}.
	                 * @name ProtoBuf.Builder.Message#toBuffer
	                 * @function
	                 * @return {!Buffer}
	                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
	                 *  returns the encoded node Buffer in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.toBuffer = MessagePrototype.encodeNB;

	                /**
	                 * Directly encodes the message to a base64 encoded string.
	                 * @name ProtoBuf.Builder.Message#encode64
	                 * @function
	                 * @return {string} Base64 encoded string
	                 * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
	                 *  still returns the encoded base64 string in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.encode64 = function() {
	                    try {
	                        return this.encode().toBase64();
	                    } catch (e) {
	                        if (e["encoded"]) e["encoded"] = e["encoded"].toBase64();
	                        throw(e);
	                    }
	                };

	                /**
	                 * Returns the message as a base64 encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encode64}.
	                 * @name ProtoBuf.Builder.Message#toBase64
	                 * @function
	                 * @return {string} Base64 encoded string
	                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
	                 *  returns the encoded base64 string in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.toBase64 = MessagePrototype.encode64;

	                /**
	                 * Directly encodes the message to a hex encoded string.
	                 * @name ProtoBuf.Builder.Message#encodeHex
	                 * @function
	                 * @return {string} Hex encoded string
	                 * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
	                 *  still returns the encoded hex string in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.encodeHex = function() {
	                    try {
	                        return this.encode().toHex();
	                    } catch (e) {
	                        if (e["encoded"]) e["encoded"] = e["encoded"].toHex();
	                        throw(e);
	                    }
	                };

	                /**
	                 * Returns the message as a hex encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encodeHex}.
	                 * @name ProtoBuf.Builder.Message#toHex
	                 * @function
	                 * @return {string} Hex encoded string
	                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
	                 *  returns the encoded hex string in the `encoded` property on the error.
	                 * @expose
	                 */
	                MessagePrototype.toHex = MessagePrototype.encodeHex;

	                /**
	                 * Clones a message object or field value to a raw object.
	                 * @param {*} obj Object to clone
	                 * @param {boolean} binaryAsBase64 Whether to include binary data as base64 strings or as a buffer otherwise
	                 * @param {boolean} longsAsStrings Whether to encode longs as strings
	                 * @param {!ProtoBuf.Reflect.T=} resolvedType The resolved field type if a field
	                 * @returns {*} Cloned object
	                 * @inner
	                 */
	                function cloneRaw(obj, binaryAsBase64, longsAsStrings, resolvedType) {
	                    if (obj === null || typeof obj !== 'object') {
	                        // Convert enum values to their respective names
	                        if (resolvedType && resolvedType instanceof ProtoBuf.Reflect.Enum) {
	                            var name = ProtoBuf.Reflect.Enum.getName(resolvedType.object, obj);
	                            if (name !== null)
	                                return name;
	                        }
	                        // Pass-through string, number, boolean, null...
	                        return obj;
	                    }
	                    // Convert ByteBuffers to raw buffer or strings
	                    if (ByteBuffer.isByteBuffer(obj))
	                        return binaryAsBase64 ? obj.toBase64() : obj.toBuffer();
	                    // Convert Longs to proper objects or strings
	                    if (ProtoBuf.Long.isLong(obj))
	                        return longsAsStrings ? obj.toString() : ProtoBuf.Long.fromValue(obj);
	                    var clone;
	                    // Clone arrays
	                    if (Array.isArray(obj)) {
	                        clone = [];
	                        obj.forEach(function(v, k) {
	                            clone[k] = cloneRaw(v, binaryAsBase64, longsAsStrings, resolvedType);
	                        });
	                        return clone;
	                    }
	                    clone = {};
	                    // Convert maps to objects
	                    if (obj instanceof ProtoBuf.Map) {
	                        var it = obj.entries();
	                        for (var e = it.next(); !e.done; e = it.next())
	                            clone[obj.keyElem.valueToString(e.value[0])] = cloneRaw(e.value[1], binaryAsBase64, longsAsStrings, obj.valueElem.resolvedType);
	                        return clone;
	                    }
	                    // Everything else is a non-null object
	                    var type = obj.$type,
	                        field = undefined;
	                    for (var i in obj)
	                        if (obj.hasOwnProperty(i)) {
	                            if (type && (field = type.getChild(i)))
	                                clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings, field.resolvedType);
	                            else
	                                clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings);
	                        }
	                    return clone;
	                }

	                /**
	                 * Returns the message's raw payload.
	                 * @param {boolean=} binaryAsBase64 Whether to include binary data as base64 strings instead of Buffers, defaults to `false`
	                 * @param {boolean} longsAsStrings Whether to encode longs as strings
	                 * @returns {Object.<string,*>} Raw payload
	                 * @expose
	                 */
	                MessagePrototype.toRaw = function(binaryAsBase64, longsAsStrings) {
	                    return cloneRaw(this, !!binaryAsBase64, !!longsAsStrings, this.$type);
	                };

	                /**
	                 * Encodes a message to JSON.
	                 * @returns {string} JSON string
	                 * @expose
	                 */
	                MessagePrototype.encodeJSON = function() {
	                    return JSON.stringify(
	                        cloneRaw(this,
	                             /* binary-as-base64 */ true,
	                             /* longs-as-strings */ true,
	                             this.$type
	                        )
	                    );
	                };

	                /**
	                 * Decodes a message from the specified buffer or string.
	                 * @name ProtoBuf.Builder.Message.decode
	                 * @function
	                 * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
	                 * @param {(number|string)=} length Message length. Defaults to decode all the remainig data.
	                 * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
	                 * @return {!ProtoBuf.Builder.Message} Decoded message
	                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
	                 *  returns the decoded message with missing fields in the `decoded` property on the error.
	                 * @expose
	                 * @see ProtoBuf.Builder.Message.decode64
	                 * @see ProtoBuf.Builder.Message.decodeHex
	                 */
	                Message.decode = function(buffer, length, enc) {
	                    if (typeof length === 'string')
	                        enc = length,
	                        length = -1;
	                    if (typeof buffer === 'string')
	                        buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");
	                    else if (!ByteBuffer.isByteBuffer(buffer))
	                        buffer = ByteBuffer.wrap(buffer); // May throw
	                    var le = buffer.littleEndian;
	                    try {
	                        var msg = T.decode(buffer.LE(), length);
	                        buffer.LE(le);
	                        return msg;
	                    } catch (e) {
	                        buffer.LE(le);
	                        throw(e);
	                    }
	                };

	                /**
	                 * Decodes a varint32 length-delimited message from the specified buffer or string.
	                 * @name ProtoBuf.Builder.Message.decodeDelimited
	                 * @function
	                 * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
	                 * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
	                 * @return {ProtoBuf.Builder.Message} Decoded message or `null` if not enough bytes are available yet
	                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
	                 *  returns the decoded message with missing fields in the `decoded` property on the error.
	                 * @expose
	                 */
	                Message.decodeDelimited = function(buffer, enc) {
	                    if (typeof buffer === 'string')
	                        buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");
	                    else if (!ByteBuffer.isByteBuffer(buffer))
	                        buffer = ByteBuffer.wrap(buffer); // May throw
	                    if (buffer.remaining() < 1)
	                        return null;
	                    var off = buffer.offset,
	                        len = buffer.readVarint32();
	                    if (buffer.remaining() < len) {
	                        buffer.offset = off;
	                        return null;
	                    }
	                    try {
	                        var msg = T.decode(buffer.slice(buffer.offset, buffer.offset + len).LE());
	                        buffer.offset += len;
	                        return msg;
	                    } catch (err) {
	                        buffer.offset += len;
	                        throw err;
	                    }
	                };

	                /**
	                 * Decodes the message from the specified base64 encoded string.
	                 * @name ProtoBuf.Builder.Message.decode64
	                 * @function
	                 * @param {string} str String to decode from
	                 * @return {!ProtoBuf.Builder.Message} Decoded message
	                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
	                 *  returns the decoded message with missing fields in the `decoded` property on the error.
	                 * @expose
	                 */
	                Message.decode64 = function(str) {
	                    return Message.decode(str, "base64");
	                };

	                /**
	                 * Decodes the message from the specified hex encoded string.
	                 * @name ProtoBuf.Builder.Message.decodeHex
	                 * @function
	                 * @param {string} str String to decode from
	                 * @return {!ProtoBuf.Builder.Message} Decoded message
	                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
	                 *  returns the decoded message with missing fields in the `decoded` property on the error.
	                 * @expose
	                 */
	                Message.decodeHex = function(str) {
	                    return Message.decode(str, "hex");
	                };

	                /**
	                 * Decodes the message from a JSON string.
	                 * @name ProtoBuf.Builder.Message.decodeJSON
	                 * @function
	                 * @param {string} str String to decode from
	                 * @return {!ProtoBuf.Builder.Message} Decoded message
	                 * @throws {Error} If the message cannot be decoded or if required fields are
	                 * missing.
	                 * @expose
	                 */
	                Message.decodeJSON = function(str) {
	                    return new Message(JSON.parse(str));
	                };

	                // Utility

	                /**
	                 * Returns a string representation of this Message.
	                 * @name ProtoBuf.Builder.Message#toString
	                 * @function
	                 * @return {string} String representation as of ".Fully.Qualified.MessageName"
	                 * @expose
	                 */
	                MessagePrototype.toString = function() {
	                    return T.toString();
	                };

	                // Properties

	                /**
	                 * Message options.
	                 * @name ProtoBuf.Builder.Message.$options
	                 * @type {Object.<string,*>}
	                 * @expose
	                 */
	                var $optionsS; // cc needs this

	                /**
	                 * Message options.
	                 * @name ProtoBuf.Builder.Message#$options
	                 * @type {Object.<string,*>}
	                 * @expose
	                 */
	                var $options;

	                /**
	                 * Reflection type.
	                 * @name ProtoBuf.Builder.Message.$type
	                 * @type {!ProtoBuf.Reflect.Message}
	                 * @expose
	                 */
	                var $typeS;

	                /**
	                 * Reflection type.
	                 * @name ProtoBuf.Builder.Message#$type
	                 * @type {!ProtoBuf.Reflect.Message}
	                 * @expose
	                 */
	                var $type;

	                if (Object.defineProperty)
	                    Object.defineProperty(Message, '$options', { "value": T.buildOpt() }),
	                    Object.defineProperty(MessagePrototype, "$options", { "value": Message["$options"] }),
	                    Object.defineProperty(Message, "$type", { "value": T }),
	                    Object.defineProperty(MessagePrototype, "$type", { "value": T });

	                return Message;

	            })(ProtoBuf, this);

	            // Static enums and prototyped sub-messages / cached collections
	            this._fields = [];
	            this._fieldsById = {};
	            this._fieldsByName = {};
	            this._oneofsByName = {};
	            for (var i=0, k=this.children.length, child; i<k; i++) {
	                child = this.children[i];
	                if (child instanceof Enum || child instanceof Message || child instanceof Service) {
	                    if (clazz.hasOwnProperty(child.name))
	                        throw Error("Illegal reflect child of "+this.toString(true)+": "+child.toString(true)+" cannot override static property '"+child.name+"'");
	                    clazz[child.name] = child.build();
	                } else if (child instanceof Message.Field)
	                    child.build(),
	                    this._fields.push(child),
	                    this._fieldsById[child.id] = child,
	                    this._fieldsByName[child.name] = child;
	                else if (child instanceof Message.OneOf) {
	                    this._oneofsByName[child.name] = child;
	                }
	                else if (!(child instanceof Message.OneOf) && !(child instanceof Extension)) // Not built
	                    throw Error("Illegal reflect child of "+this.toString(true)+": "+this.children[i].toString(true));
	            }

	            return this.clazz = clazz;
	        };

	        /**
	         * Encodes a runtime message's contents to the specified buffer.
	         * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
	         * @param {ByteBuffer} buffer ByteBuffer to write to
	         * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
	         * @return {ByteBuffer} The ByteBuffer for chaining
	         * @throws {Error} If required fields are missing or the message cannot be encoded for another reason
	         * @expose
	         */
	        MessagePrototype.encode = function(message, buffer, noVerify) {
	            var fieldMissing = null,
	                field;
	            for (var i=0, k=this._fields.length, val; i<k; ++i) {
	                field = this._fields[i];
	                val = message[field.name];
	                if (field.required && val === null) {
	                    if (fieldMissing === null)
	                        fieldMissing = field;
	                } else
	                    field.encode(noVerify ? val : field.verifyValue(val), buffer, message);
	            }
	            if (fieldMissing !== null) {
	                var err = Error("Missing at least one required field for "+this.toString(true)+": "+fieldMissing);
	                err["encoded"] = buffer; // Still expose what we got
	                throw(err);
	            }
	            return buffer;
	        };

	        /**
	         * Calculates a runtime message's byte length.
	         * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
	         * @returns {number} Byte length
	         * @throws {Error} If required fields are missing or the message cannot be calculated for another reason
	         * @expose
	         */
	        MessagePrototype.calculate = function(message) {
	            for (var n=0, i=0, k=this._fields.length, field, val; i<k; ++i) {
	                field = this._fields[i];
	                val = message[field.name];
	                if (field.required && val === null)
	                   throw Error("Missing at least one required field for "+this.toString(true)+": "+field);
	                else
	                    n += field.calculate(val, message);
	            }
	            return n;
	        };

	        /**
	         * Skips all data until the end of the specified group has been reached.
	         * @param {number} expectedId Expected GROUPEND id
	         * @param {!ByteBuffer} buf ByteBuffer
	         * @returns {boolean} `true` if a value as been skipped, `false` if the end has been reached
	         * @throws {Error} If it wasn't possible to find the end of the group (buffer overrun or end tag mismatch)
	         * @inner
	         */
	        function skipTillGroupEnd(expectedId, buf) {
	            var tag = buf.readVarint32(), // Throws on OOB
	                wireType = tag & 0x07,
	                id = tag >>> 3;
	            switch (wireType) {
	                case ProtoBuf.WIRE_TYPES.VARINT:
	                    do tag = buf.readUint8();
	                    while ((tag & 0x80) === 0x80);
	                    break;
	                case ProtoBuf.WIRE_TYPES.BITS64:
	                    buf.offset += 8;
	                    break;
	                case ProtoBuf.WIRE_TYPES.LDELIM:
	                    tag = buf.readVarint32(); // reads the varint
	                    buf.offset += tag;        // skips n bytes
	                    break;
	                case ProtoBuf.WIRE_TYPES.STARTGROUP:
	                    skipTillGroupEnd(id, buf);
	                    break;
	                case ProtoBuf.WIRE_TYPES.ENDGROUP:
	                    if (id === expectedId)
	                        return false;
	                    else
	                        throw Error("Illegal GROUPEND after unknown group: "+id+" ("+expectedId+" expected)");
	                case ProtoBuf.WIRE_TYPES.BITS32:
	                    buf.offset += 4;
	                    break;
	                default:
	                    throw Error("Illegal wire type in unknown group "+expectedId+": "+wireType);
	            }
	            return true;
	        }

	        /**
	         * Decodes an encoded message and returns the decoded message.
	         * @param {ByteBuffer} buffer ByteBuffer to decode from
	         * @param {number=} length Message length. Defaults to decode all remaining data.
	         * @param {number=} expectedGroupEndId Expected GROUPEND id if this is a legacy group
	         * @return {ProtoBuf.Builder.Message} Decoded message
	         * @throws {Error} If the message cannot be decoded
	         * @expose
	         */
	        MessagePrototype.decode = function(buffer, length, expectedGroupEndId) {
	            if (typeof length !== 'number')
	                length = -1;
	            var start = buffer.offset,
	                msg = new (this.clazz)(),
	                tag, wireType, id, field;
	            while (buffer.offset < start+length || (length === -1 && buffer.remaining() > 0)) {
	                tag = buffer.readVarint32();
	                wireType = tag & 0x07;
	                id = tag >>> 3;
	                if (wireType === ProtoBuf.WIRE_TYPES.ENDGROUP) {
	                    if (id !== expectedGroupEndId)
	                        throw Error("Illegal group end indicator for "+this.toString(true)+": "+id+" ("+(expectedGroupEndId ? expectedGroupEndId+" expected" : "not a group")+")");
	                    break;
	                }
	                if (!(field = this._fieldsById[id])) {
	                    // "messages created by your new code can be parsed by your old code: old binaries simply ignore the new field when parsing."
	                    switch (wireType) {
	                        case ProtoBuf.WIRE_TYPES.VARINT:
	                            buffer.readVarint32();
	                            break;
	                        case ProtoBuf.WIRE_TYPES.BITS32:
	                            buffer.offset += 4;
	                            break;
	                        case ProtoBuf.WIRE_TYPES.BITS64:
	                            buffer.offset += 8;
	                            break;
	                        case ProtoBuf.WIRE_TYPES.LDELIM:
	                            var len = buffer.readVarint32();
	                            buffer.offset += len;
	                            break;
	                        case ProtoBuf.WIRE_TYPES.STARTGROUP:
	                            while (skipTillGroupEnd(id, buffer)) {}
	                            break;
	                        default:
	                            throw Error("Illegal wire type for unknown field "+id+" in "+this.toString(true)+"#decode: "+wireType);
	                    }
	                    continue;
	                }
	                if (field.repeated && !field.options["packed"]) {
	                    msg[field.name].push(field.decode(wireType, buffer));
	                } else if (field.map) {
	                    var keyval = field.decode(wireType, buffer);
	                    msg[field.name].set(keyval[0], keyval[1]);
	                } else {
	                    msg[field.name] = field.decode(wireType, buffer);
	                    if (field.oneof) { // Field is part of an OneOf (not a virtual OneOf field)
	                        var currentField = msg[field.oneof.name]; // Virtual field references currently set field
	                        if (currentField !== null && currentField !== field.name)
	                            msg[currentField] = null; // Clear currently set field
	                        msg[field.oneof.name] = field.name; // Point virtual field at this field
	                    }
	                }
	            }

	            // Check if all required fields are present and set default values for optional fields that are not
	            for (var i=0, k=this._fields.length; i<k; ++i) {
	                field = this._fields[i];
	                if (msg[field.name] === null) {
	                    if (this.syntax === "proto3") { // Proto3 sets default values by specification
	                        msg[field.name] = field.defaultValue;
	                    } else if (field.required) {
	                        var err = Error("Missing at least one required field for " + this.toString(true) + ": " + field.name);
	                        err["decoded"] = msg; // Still expose what we got
	                        throw(err);
	                    } else if (ProtoBuf.populateDefaults && field.defaultValue !== null)
	                        msg[field.name] = field.defaultValue;
	                }
	            }
	            return msg;
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Message
	         * @expose
	         */
	        Reflect.Message = Message;

	        /**
	         * Constructs a new Message Field.
	         * @exports ProtoBuf.Reflect.Message.Field
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.Message} message Message reference
	         * @param {string} rule Rule, one of requried, optional, repeated
	         * @param {string?} keytype Key data type, if any.
	         * @param {string} type Data type, e.g. int32
	         * @param {string} name Field name
	         * @param {number} id Unique field id
	         * @param {Object.<string,*>=} options Options
	         * @param {!ProtoBuf.Reflect.Message.OneOf=} oneof Enclosing OneOf
	         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
	         * @constructor
	         * @extends ProtoBuf.Reflect.T
	         */
	        var Field = function(builder, message, rule, keytype, type, name, id, options, oneof, syntax) {
	            T.call(this, builder, message, name);

	            /**
	             * @override
	             */
	            this.className = "Message.Field";

	            /**
	             * Message field required flag.
	             * @type {boolean}
	             * @expose
	             */
	            this.required = rule === "required";

	            /**
	             * Message field repeated flag.
	             * @type {boolean}
	             * @expose
	             */
	            this.repeated = rule === "repeated";

	            /**
	             * Message field map flag.
	             * @type {boolean}
	             * @expose
	             */
	            this.map = rule === "map";

	            /**
	             * Message field key type. Type reference string if unresolved, protobuf
	             * type if resolved. Valid only if this.map === true, null otherwise.
	             * @type {string|{name: string, wireType: number}|null}
	             * @expose
	             */
	            this.keyType = keytype || null;

	            /**
	             * Message field type. Type reference string if unresolved, protobuf type if
	             * resolved. In a map field, this is the value type.
	             * @type {string|{name: string, wireType: number}}
	             * @expose
	             */
	            this.type = type;

	            /**
	             * Resolved type reference inside the global namespace.
	             * @type {ProtoBuf.Reflect.T|null}
	             * @expose
	             */
	            this.resolvedType = null;

	            /**
	             * Unique message field id.
	             * @type {number}
	             * @expose
	             */
	            this.id = id;

	            /**
	             * Message field options.
	             * @type {!Object.<string,*>}
	             * @dict
	             * @expose
	             */
	            this.options = options || {};

	            /**
	             * Default value.
	             * @type {*}
	             * @expose
	             */
	            this.defaultValue = null;

	            /**
	             * Enclosing OneOf.
	             * @type {?ProtoBuf.Reflect.Message.OneOf}
	             * @expose
	             */
	            this.oneof = oneof || null;

	            /**
	             * Syntax level of this definition (e.g., proto3).
	             * @type {string}
	             * @expose
	             */
	            this.syntax = syntax || 'proto2';

	            /**
	             * Original field name.
	             * @type {string}
	             * @expose
	             */
	            this.originalName = this.name; // Used to revert camelcase transformation on naming collisions

	            /**
	             * Element implementation. Created in build() after types are resolved.
	             * @type {ProtoBuf.Element}
	             * @expose
	             */
	            this.element = null;

	            /**
	             * Key element implementation, for map fields. Created in build() after
	             * types are resolved.
	             * @type {ProtoBuf.Element}
	             * @expose
	             */
	            this.keyElement = null;

	            // Convert field names to camel case notation if the override is set
	            if (this.builder.options['convertFieldsToCamelCase'] && !(this instanceof Message.ExtensionField))
	                this.name = ProtoBuf.Util.toCamelCase(this.name);
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Message.Field.prototype
	         * @inner
	         */
	        var FieldPrototype = Field.prototype = Object.create(T.prototype);

	        /**
	         * Builds the field.
	         * @override
	         * @expose
	         */
	        FieldPrototype.build = function() {
	            this.element = new Element(this.type, this.resolvedType, false, this.syntax, this.name);
	            if (this.map)
	                this.keyElement = new Element(this.keyType, undefined, true, this.syntax, this.name);

	            // In proto3, fields do not have field presence, and every field is set to
	            // its type's default value ("", 0, 0.0, or false).
	            if (this.syntax === 'proto3' && !this.repeated && !this.map)
	                this.defaultValue = Element.defaultFieldValue(this.type);

	            // Otherwise, default values are present when explicitly specified
	            else if (typeof this.options['default'] !== 'undefined')
	                this.defaultValue = this.verifyValue(this.options['default']);
	        };

	        /**
	         * Checks if the given value can be set for this field.
	         * @param {*} value Value to check
	         * @param {boolean=} skipRepeated Whether to skip the repeated value check or not. Defaults to false.
	         * @return {*} Verified, maybe adjusted, value
	         * @throws {Error} If the value cannot be set for this field
	         * @expose
	         */
	        FieldPrototype.verifyValue = function(value, skipRepeated) {
	            skipRepeated = skipRepeated || false;
	            var self = this;
	            function fail(val, msg) {
	                throw Error("Illegal value for "+self.toString(true)+" of type "+self.type.name+": "+val+" ("+msg+")");
	            }
	            if (value === null) { // NULL values for optional fields
	                if (this.required)
	                    fail(typeof value, "required");
	                if (this.syntax === 'proto3' && this.type !== ProtoBuf.TYPES["message"])
	                    fail(typeof value, "proto3 field without field presence cannot be null");
	                return null;
	            }
	            var i;
	            if (this.repeated && !skipRepeated) { // Repeated values as arrays
	                if (!Array.isArray(value))
	                    value = [value];
	                var res = [];
	                for (i=0; i<value.length; i++)
	                    res.push(this.element.verifyValue(value[i]));
	                return res;
	            }
	            if (this.map && !skipRepeated) { // Map values as objects
	                if (!(value instanceof ProtoBuf.Map)) {
	                    // If not already a Map, attempt to convert.
	                    if (!(value instanceof Object)) {
	                        fail(typeof value,
	                             "expected ProtoBuf.Map or raw object for map field");
	                    }
	                    return new ProtoBuf.Map(this, value);
	                } else {
	                    return value;
	                }
	            }
	            // All non-repeated fields expect no array
	            if (!this.repeated && Array.isArray(value))
	                fail(typeof value, "no array expected");

	            return this.element.verifyValue(value);
	        };

	        /**
	         * Determines whether the field will have a presence on the wire given its
	         * value.
	         * @param {*} value Verified field value
	         * @param {!ProtoBuf.Builder.Message} message Runtime message
	         * @return {boolean} Whether the field will be present on the wire
	         */
	        FieldPrototype.hasWirePresence = function(value, message) {
	            if (this.syntax !== 'proto3')
	                return (value !== null);
	            if (this.oneof && message[this.oneof.name] === this.name)
	                return true;
	            switch (this.type) {
	                case ProtoBuf.TYPES["int32"]:
	                case ProtoBuf.TYPES["sint32"]:
	                case ProtoBuf.TYPES["sfixed32"]:
	                case ProtoBuf.TYPES["uint32"]:
	                case ProtoBuf.TYPES["fixed32"]:
	                    return value !== 0;

	                case ProtoBuf.TYPES["int64"]:
	                case ProtoBuf.TYPES["sint64"]:
	                case ProtoBuf.TYPES["sfixed64"]:
	                case ProtoBuf.TYPES["uint64"]:
	                case ProtoBuf.TYPES["fixed64"]:
	                    return value.low !== 0 || value.high !== 0;

	                case ProtoBuf.TYPES["bool"]:
	                    return value;

	                case ProtoBuf.TYPES["float"]:
	                case ProtoBuf.TYPES["double"]:
	                    return value !== 0.0;

	                case ProtoBuf.TYPES["string"]:
	                    return value.length > 0;

	                case ProtoBuf.TYPES["bytes"]:
	                    return value.remaining() > 0;

	                case ProtoBuf.TYPES["enum"]:
	                    return value !== 0;

	                case ProtoBuf.TYPES["message"]:
	                    return value !== null;
	                default:
	                    return true;
	            }
	        };

	        /**
	         * Encodes the specified field value to the specified buffer.
	         * @param {*} value Verified field value
	         * @param {ByteBuffer} buffer ByteBuffer to encode to
	         * @param {!ProtoBuf.Builder.Message} message Runtime message
	         * @return {ByteBuffer} The ByteBuffer for chaining
	         * @throws {Error} If the field cannot be encoded
	         * @expose
	         */
	        FieldPrototype.encode = function(value, buffer, message) {
	            if (this.type === null || typeof this.type !== 'object')
	                throw Error("[INTERNAL] Unresolved type in "+this.toString(true)+": "+this.type);
	            if (value === null || (this.repeated && value.length == 0))
	                return buffer; // Optional omitted
	            try {
	                if (this.repeated) {
	                    var i;
	                    // "Only repeated fields of primitive numeric types (types which use the varint, 32-bit, or 64-bit wire
	                    // types) can be declared 'packed'."
	                    if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
	                        // "All of the elements of the field are packed into a single key-value pair with wire type 2
	                        // (length-delimited). Each element is encoded the same way it would be normally, except without a
	                        // tag preceding it."
	                        buffer.writeVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
	                        buffer.ensureCapacity(buffer.offset += 1); // We do not know the length yet, so let's assume a varint of length 1
	                        var start = buffer.offset; // Remember where the contents begin
	                        for (i=0; i<value.length; i++)
	                            this.element.encodeValue(this.id, value[i], buffer);
	                        var len = buffer.offset-start,
	                            varintLen = ByteBuffer.calculateVarint32(len);
	                        if (varintLen > 1) { // We need to move the contents
	                            var contents = buffer.slice(start, buffer.offset);
	                            start += varintLen-1;
	                            buffer.offset = start;
	                            buffer.append(contents);
	                        }
	                        buffer.writeVarint32(len, start-varintLen);
	                    } else {
	                        // "If your message definition has repeated elements (without the [packed=true] option), the encoded
	                        // message has zero or more key-value pairs with the same tag number"
	                        for (i=0; i<value.length; i++)
	                            buffer.writeVarint32((this.id << 3) | this.type.wireType),
	                            this.element.encodeValue(this.id, value[i], buffer);
	                    }
	                } else if (this.map) {
	                    // Write out each map entry as a submessage.
	                    value.forEach(function(val, key, m) {
	                        // Compute the length of the submessage (key, val) pair.
	                        var length =
	                            ByteBuffer.calculateVarint32((1 << 3) | this.keyType.wireType) +
	                            this.keyElement.calculateLength(1, key) +
	                            ByteBuffer.calculateVarint32((2 << 3) | this.type.wireType) +
	                            this.element.calculateLength(2, val);

	                        // Submessage with wire type of length-delimited.
	                        buffer.writeVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
	                        buffer.writeVarint32(length);

	                        // Write out the key and val.
	                        buffer.writeVarint32((1 << 3) | this.keyType.wireType);
	                        this.keyElement.encodeValue(1, key, buffer);
	                        buffer.writeVarint32((2 << 3) | this.type.wireType);
	                        this.element.encodeValue(2, val, buffer);
	                    }, this);
	                } else {
	                    if (this.hasWirePresence(value, message)) {
	                        buffer.writeVarint32((this.id << 3) | this.type.wireType);
	                        this.element.encodeValue(this.id, value, buffer);
	                    }
	                }
	            } catch (e) {
	                throw Error("Illegal value for "+this.toString(true)+": "+value+" ("+e+")");
	            }
	            return buffer;
	        };

	        /**
	         * Calculates the length of this field's value on the network level.
	         * @param {*} value Field value
	         * @param {!ProtoBuf.Builder.Message} message Runtime message
	         * @returns {number} Byte length
	         * @expose
	         */
	        FieldPrototype.calculate = function(value, message) {
	            value = this.verifyValue(value); // May throw
	            if (this.type === null || typeof this.type !== 'object')
	                throw Error("[INTERNAL] Unresolved type in "+this.toString(true)+": "+this.type);
	            if (value === null || (this.repeated && value.length == 0))
	                return 0; // Optional omitted
	            var n = 0;
	            try {
	                if (this.repeated) {
	                    var i, ni;
	                    if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
	                        n += ByteBuffer.calculateVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
	                        ni = 0;
	                        for (i=0; i<value.length; i++)
	                            ni += this.element.calculateLength(this.id, value[i]);
	                        n += ByteBuffer.calculateVarint32(ni);
	                        n += ni;
	                    } else {
	                        for (i=0; i<value.length; i++)
	                            n += ByteBuffer.calculateVarint32((this.id << 3) | this.type.wireType),
	                            n += this.element.calculateLength(this.id, value[i]);
	                    }
	                } else if (this.map) {
	                    // Each map entry becomes a submessage.
	                    value.forEach(function(val, key, m) {
	                        // Compute the length of the submessage (key, val) pair.
	                        var length =
	                            ByteBuffer.calculateVarint32((1 << 3) | this.keyType.wireType) +
	                            this.keyElement.calculateLength(1, key) +
	                            ByteBuffer.calculateVarint32((2 << 3) | this.type.wireType) +
	                            this.element.calculateLength(2, val);

	                        n += ByteBuffer.calculateVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
	                        n += ByteBuffer.calculateVarint32(length);
	                        n += length;
	                    }, this);
	                } else {
	                    if (this.hasWirePresence(value, message)) {
	                        n += ByteBuffer.calculateVarint32((this.id << 3) | this.type.wireType);
	                        n += this.element.calculateLength(this.id, value);
	                    }
	                }
	            } catch (e) {
	                throw Error("Illegal value for "+this.toString(true)+": "+value+" ("+e+")");
	            }
	            return n;
	        };

	        /**
	         * Decode the field value from the specified buffer.
	         * @param {number} wireType Leading wire type
	         * @param {ByteBuffer} buffer ByteBuffer to decode from
	         * @param {boolean=} skipRepeated Whether to skip the repeated check or not. Defaults to false.
	         * @return {*} Decoded value: array for packed repeated fields, [key, value] for
	         *             map fields, or an individual value otherwise.
	         * @throws {Error} If the field cannot be decoded
	         * @expose
	         */
	        FieldPrototype.decode = function(wireType, buffer, skipRepeated) {
	            var value, nBytes;

	            // We expect wireType to match the underlying type's wireType unless we see
	            // a packed repeated field, or unless this is a map field.
	            var wireTypeOK =
	                (!this.map && wireType == this.type.wireType) ||
	                (!skipRepeated && this.repeated && this.options["packed"] &&
	                 wireType == ProtoBuf.WIRE_TYPES.LDELIM) ||
	                (this.map && wireType == ProtoBuf.WIRE_TYPES.LDELIM);
	            if (!wireTypeOK)
	                throw Error("Illegal wire type for field "+this.toString(true)+": "+wireType+" ("+this.type.wireType+" expected)");

	            // Handle packed repeated fields.
	            if (wireType == ProtoBuf.WIRE_TYPES.LDELIM && this.repeated && this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
	                if (!skipRepeated) {
	                    nBytes = buffer.readVarint32();
	                    nBytes = buffer.offset + nBytes; // Limit
	                    var values = [];
	                    while (buffer.offset < nBytes)
	                        values.push(this.decode(this.type.wireType, buffer, true));
	                    return values;
	                }
	                // Read the next value otherwise...
	            }

	            // Handle maps.
	            if (this.map) {
	                // Read one (key, value) submessage, and return [key, value]
	                var key = Element.defaultFieldValue(this.keyType);
	                value = Element.defaultFieldValue(this.type);

	                // Read the length
	                nBytes = buffer.readVarint32();
	                if (buffer.remaining() < nBytes)
	                    throw Error("Illegal number of bytes for "+this.toString(true)+": "+nBytes+" required but got only "+buffer.remaining());

	                // Get a sub-buffer of this key/value submessage
	                var msgbuf = buffer.clone();
	                msgbuf.limit = msgbuf.offset + nBytes;
	                buffer.offset += nBytes;

	                while (msgbuf.remaining() > 0) {
	                    var tag = msgbuf.readVarint32();
	                    wireType = tag & 0x07;
	                    var id = tag >>> 3;
	                    if (id === 1) {
	                        key = this.keyElement.decode(msgbuf, wireType, id);
	                    } else if (id === 2) {
	                        value = this.element.decode(msgbuf, wireType, id);
	                    } else {
	                        throw Error("Unexpected tag in map field key/value submessage");
	                    }
	                }

	                return [key, value];
	            }

	            // Handle singular and non-packed repeated field values.
	            return this.element.decode(buffer, wireType, this.id);
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Message.Field
	         * @expose
	         */
	        Reflect.Message.Field = Field;

	        /**
	         * Constructs a new Message ExtensionField.
	         * @exports ProtoBuf.Reflect.Message.ExtensionField
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.Message} message Message reference
	         * @param {string} rule Rule, one of requried, optional, repeated
	         * @param {string} type Data type, e.g. int32
	         * @param {string} name Field name
	         * @param {number} id Unique field id
	         * @param {!Object.<string,*>=} options Options
	         * @constructor
	         * @extends ProtoBuf.Reflect.Message.Field
	         */
	        var ExtensionField = function(builder, message, rule, type, name, id, options) {
	            Field.call(this, builder, message, rule, /* keytype = */ null, type, name, id, options);

	            /**
	             * Extension reference.
	             * @type {!ProtoBuf.Reflect.Extension}
	             * @expose
	             */
	            this.extension;
	        };

	        // Extends Field
	        ExtensionField.prototype = Object.create(Field.prototype);

	        /**
	         * @alias ProtoBuf.Reflect.Message.ExtensionField
	         * @expose
	         */
	        Reflect.Message.ExtensionField = ExtensionField;

	        /**
	         * Constructs a new Message OneOf.
	         * @exports ProtoBuf.Reflect.Message.OneOf
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.Message} message Message reference
	         * @param {string} name OneOf name
	         * @constructor
	         * @extends ProtoBuf.Reflect.T
	         */
	        var OneOf = function(builder, message, name) {
	            T.call(this, builder, message, name);

	            /**
	             * Enclosed fields.
	             * @type {!Array.<!ProtoBuf.Reflect.Message.Field>}
	             * @expose
	             */
	            this.fields = [];
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Message.OneOf
	         * @expose
	         */
	        Reflect.Message.OneOf = OneOf;

	        /**
	         * Constructs a new Enum.
	         * @exports ProtoBuf.Reflect.Enum
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.T} parent Parent Reflect object
	         * @param {string} name Enum name
	         * @param {Object.<string,*>=} options Enum options
	         * @param {string?} syntax The syntax level (e.g., proto3)
	         * @constructor
	         * @extends ProtoBuf.Reflect.Namespace
	         */
	        var Enum = function(builder, parent, name, options, syntax) {
	            Namespace.call(this, builder, parent, name, options, syntax);

	            /**
	             * @override
	             */
	            this.className = "Enum";

	            /**
	             * Runtime enum object.
	             * @type {Object.<string,number>|null}
	             * @expose
	             */
	            this.object = null;
	        };

	        /**
	         * Gets the string name of an enum value.
	         * @param {!ProtoBuf.Builder.Enum} enm Runtime enum
	         * @param {number} value Enum value
	         * @returns {?string} Name or `null` if not present
	         * @expose
	         */
	        Enum.getName = function(enm, value) {
	            var keys = Object.keys(enm);
	            for (var i=0, key; i<keys.length; ++i)
	                if (enm[key = keys[i]] === value)
	                    return key;
	            return null;
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Enum.prototype
	         * @inner
	         */
	        var EnumPrototype = Enum.prototype = Object.create(Namespace.prototype);

	        /**
	         * Builds this enum and returns the runtime counterpart.
	         * @param {boolean} rebuild Whether to rebuild or not, defaults to false
	         * @returns {!Object.<string,number>}
	         * @expose
	         */
	        EnumPrototype.build = function(rebuild) {
	            if (this.object && !rebuild)
	                return this.object;
	            var enm = new ProtoBuf.Builder.Enum(),
	                values = this.getChildren(Enum.Value);
	            for (var i=0, k=values.length; i<k; ++i)
	                enm[values[i]['name']] = values[i]['id'];
	            if (Object.defineProperty)
	                Object.defineProperty(enm, '$options', {
	                    "value": this.buildOpt(),
	                    "enumerable": false
	                });
	            return this.object = enm;
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Enum
	         * @expose
	         */
	        Reflect.Enum = Enum;

	        /**
	         * Constructs a new Enum Value.
	         * @exports ProtoBuf.Reflect.Enum.Value
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.Enum} enm Enum reference
	         * @param {string} name Field name
	         * @param {number} id Unique field id
	         * @constructor
	         * @extends ProtoBuf.Reflect.T
	         */
	        var Value = function(builder, enm, name, id) {
	            T.call(this, builder, enm, name);

	            /**
	             * @override
	             */
	            this.className = "Enum.Value";

	            /**
	             * Unique enum value id.
	             * @type {number}
	             * @expose
	             */
	            this.id = id;
	        };

	        // Extends T
	        Value.prototype = Object.create(T.prototype);

	        /**
	         * @alias ProtoBuf.Reflect.Enum.Value
	         * @expose
	         */
	        Reflect.Enum.Value = Value;

	        /**
	         * An extension (field).
	         * @exports ProtoBuf.Reflect.Extension
	         * @constructor
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.T} parent Parent object
	         * @param {string} name Object name
	         * @param {!ProtoBuf.Reflect.Message.Field} field Extension field
	         */
	        var Extension = function(builder, parent, name, field) {
	            T.call(this, builder, parent, name);

	            /**
	             * Extended message field.
	             * @type {!ProtoBuf.Reflect.Message.Field}
	             * @expose
	             */
	            this.field = field;
	        };

	        // Extends T
	        Extension.prototype = Object.create(T.prototype);

	        /**
	         * @alias ProtoBuf.Reflect.Extension
	         * @expose
	         */
	        Reflect.Extension = Extension;

	        /**
	         * Constructs a new Service.
	         * @exports ProtoBuf.Reflect.Service
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.Namespace} root Root
	         * @param {string} name Service name
	         * @param {Object.<string,*>=} options Options
	         * @constructor
	         * @extends ProtoBuf.Reflect.Namespace
	         */
	        var Service = function(builder, root, name, options) {
	            Namespace.call(this, builder, root, name, options);

	            /**
	             * @override
	             */
	            this.className = "Service";

	            /**
	             * Built runtime service class.
	             * @type {?function(new:ProtoBuf.Builder.Service)}
	             */
	            this.clazz = null;
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Service.prototype
	         * @inner
	         */
	        var ServicePrototype = Service.prototype = Object.create(Namespace.prototype);

	        /**
	         * Builds the service and returns the runtime counterpart, which is a fully functional class.
	         * @see ProtoBuf.Builder.Service
	         * @param {boolean=} rebuild Whether to rebuild or not
	         * @return {Function} Service class
	         * @throws {Error} If the message cannot be built
	         * @expose
	         */
	        ServicePrototype.build = function(rebuild) {
	            if (this.clazz && !rebuild)
	                return this.clazz;

	            // Create the runtime Service class in its own scope
	            return this.clazz = (function(ProtoBuf, T) {

	                /**
	                 * Constructs a new runtime Service.
	                 * @name ProtoBuf.Builder.Service
	                 * @param {function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))=} rpcImpl RPC implementation receiving the method name and the message
	                 * @class Barebone of all runtime services.
	                 * @constructor
	                 * @throws {Error} If the service cannot be created
	                 */
	                var Service = function(rpcImpl) {
	                    ProtoBuf.Builder.Service.call(this);

	                    /**
	                     * Service implementation.
	                     * @name ProtoBuf.Builder.Service#rpcImpl
	                     * @type {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))}
	                     * @expose
	                     */
	                    this.rpcImpl = rpcImpl || function(name, msg, callback) {
	                        // This is what a user has to implement: A function receiving the method name, the actual message to
	                        // send (type checked) and the callback that's either provided with the error as its first
	                        // argument or null and the actual response message.
	                        setTimeout(callback.bind(this, Error("Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services")), 0); // Must be async!
	                    };
	                };

	                /**
	                 * @alias ProtoBuf.Builder.Service.prototype
	                 * @inner
	                 */
	                var ServicePrototype = Service.prototype = Object.create(ProtoBuf.Builder.Service.prototype);

	                /**
	                 * Asynchronously performs an RPC call using the given RPC implementation.
	                 * @name ProtoBuf.Builder.Service.[Method]
	                 * @function
	                 * @param {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))} rpcImpl RPC implementation
	                 * @param {ProtoBuf.Builder.Message} req Request
	                 * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
	                 *  the error if any and the response either as a pre-parsed message or as its raw bytes
	                 * @abstract
	                 */

	                /**
	                 * Asynchronously performs an RPC call using the instance's RPC implementation.
	                 * @name ProtoBuf.Builder.Service#[Method]
	                 * @function
	                 * @param {ProtoBuf.Builder.Message} req Request
	                 * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
	                 *  the error if any and the response either as a pre-parsed message or as its raw bytes
	                 * @abstract
	                 */

	                var rpc = T.getChildren(ProtoBuf.Reflect.Service.RPCMethod);
	                for (var i=0; i<rpc.length; i++) {
	                    (function(method) {

	                        // service#Method(message, callback)
	                        ServicePrototype[method.name] = function(req, callback) {
	                            try {
	                                try {
	                                    // If given as a buffer, decode the request. Will throw a TypeError if not a valid buffer.
	                                    req = method.resolvedRequestType.clazz.decode(ByteBuffer.wrap(req));
	                                } catch (err) {
	                                    if (!(err instanceof TypeError))
	                                        throw err;
	                                }
	                                if (req === null || typeof req !== 'object')
	                                    throw Error("Illegal arguments");
	                                if (!(req instanceof method.resolvedRequestType.clazz))
	                                    req = new method.resolvedRequestType.clazz(req);
	                                this.rpcImpl(method.fqn(), req, function(err, res) { // Assumes that this is properly async
	                                    if (err) {
	                                        callback(err);
	                                        return;
	                                    }
	                                    // Coalesce to empty string when service response has empty content
	                                    if (res === null)
	                                        res = '';
	                                    try { res = method.resolvedResponseType.clazz.decode(res); } catch (notABuffer) {}
	                                    if (!res || !(res instanceof method.resolvedResponseType.clazz)) {
	                                        callback(Error("Illegal response type received in service method "+ T.name+"#"+method.name));
	                                        return;
	                                    }
	                                    callback(null, res);
	                                });
	                            } catch (err) {
	                                setTimeout(callback.bind(this, err), 0);
	                            }
	                        };

	                        // Service.Method(rpcImpl, message, callback)
	                        Service[method.name] = function(rpcImpl, req, callback) {
	                            new Service(rpcImpl)[method.name](req, callback);
	                        };

	                        if (Object.defineProperty)
	                            Object.defineProperty(Service[method.name], "$options", { "value": method.buildOpt() }),
	                            Object.defineProperty(ServicePrototype[method.name], "$options", { "value": Service[method.name]["$options"] });
	                    })(rpc[i]);
	                }

	                // Properties

	                /**
	                 * Service options.
	                 * @name ProtoBuf.Builder.Service.$options
	                 * @type {Object.<string,*>}
	                 * @expose
	                 */
	                var $optionsS; // cc needs this

	                /**
	                 * Service options.
	                 * @name ProtoBuf.Builder.Service#$options
	                 * @type {Object.<string,*>}
	                 * @expose
	                 */
	                var $options;

	                /**
	                 * Reflection type.
	                 * @name ProtoBuf.Builder.Service.$type
	                 * @type {!ProtoBuf.Reflect.Service}
	                 * @expose
	                 */
	                var $typeS;

	                /**
	                 * Reflection type.
	                 * @name ProtoBuf.Builder.Service#$type
	                 * @type {!ProtoBuf.Reflect.Service}
	                 * @expose
	                 */
	                var $type;

	                if (Object.defineProperty)
	                    Object.defineProperty(Service, "$options", { "value": T.buildOpt() }),
	                    Object.defineProperty(ServicePrototype, "$options", { "value": Service["$options"] }),
	                    Object.defineProperty(Service, "$type", { "value": T }),
	                    Object.defineProperty(ServicePrototype, "$type", { "value": T });

	                return Service;

	            })(ProtoBuf, this);
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Service
	         * @expose
	         */
	        Reflect.Service = Service;

	        /**
	         * Abstract service method.
	         * @exports ProtoBuf.Reflect.Service.Method
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.Service} svc Service
	         * @param {string} name Method name
	         * @param {Object.<string,*>=} options Options
	         * @constructor
	         * @extends ProtoBuf.Reflect.T
	         */
	        var Method = function(builder, svc, name, options) {
	            T.call(this, builder, svc, name);

	            /**
	             * @override
	             */
	            this.className = "Service.Method";

	            /**
	             * Options.
	             * @type {Object.<string, *>}
	             * @expose
	             */
	            this.options = options || {};
	        };

	        /**
	         * @alias ProtoBuf.Reflect.Service.Method.prototype
	         * @inner
	         */
	        var MethodPrototype = Method.prototype = Object.create(T.prototype);

	        /**
	         * Builds the method's '$options' property.
	         * @name ProtoBuf.Reflect.Service.Method#buildOpt
	         * @function
	         * @return {Object.<string,*>}
	         */
	        MethodPrototype.buildOpt = NamespacePrototype.buildOpt;

	        /**
	         * @alias ProtoBuf.Reflect.Service.Method
	         * @expose
	         */
	        Reflect.Service.Method = Method;

	        /**
	         * RPC service method.
	         * @exports ProtoBuf.Reflect.Service.RPCMethod
	         * @param {!ProtoBuf.Builder} builder Builder reference
	         * @param {!ProtoBuf.Reflect.Service} svc Service
	         * @param {string} name Method name
	         * @param {string} request Request message name
	         * @param {string} response Response message name
	         * @param {boolean} request_stream Whether requests are streamed
	         * @param {boolean} response_stream Whether responses are streamed
	         * @param {Object.<string,*>=} options Options
	         * @constructor
	         * @extends ProtoBuf.Reflect.Service.Method
	         */
	        var RPCMethod = function(builder, svc, name, request, response, request_stream, response_stream, options) {
	            Method.call(this, builder, svc, name, options);

	            /**
	             * @override
	             */
	            this.className = "Service.RPCMethod";

	            /**
	             * Request message name.
	             * @type {string}
	             * @expose
	             */
	            this.requestName = request;

	            /**
	             * Response message name.
	             * @type {string}
	             * @expose
	             */
	            this.responseName = response;

	            /**
	             * Whether requests are streamed
	             * @type {bool}
	             * @expose
	             */
	            this.requestStream = request_stream;

	            /**
	             * Whether responses are streamed
	             * @type {bool}
	             * @expose
	             */
	            this.responseStream = response_stream;

	            /**
	             * Resolved request message type.
	             * @type {ProtoBuf.Reflect.Message}
	             * @expose
	             */
	            this.resolvedRequestType = null;

	            /**
	             * Resolved response message type.
	             * @type {ProtoBuf.Reflect.Message}
	             * @expose
	             */
	            this.resolvedResponseType = null;
	        };

	        // Extends Method
	        RPCMethod.prototype = Object.create(Method.prototype);

	        /**
	         * @alias ProtoBuf.Reflect.Service.RPCMethod
	         * @expose
	         */
	        Reflect.Service.RPCMethod = RPCMethod;

	        return Reflect;

	    })(ProtoBuf);

	    /**
	     * @alias ProtoBuf.Builder
	     * @expose
	     */
	    ProtoBuf.Builder = (function(ProtoBuf, Lang, Reflect) {
	        "use strict";

	        /**
	         * Constructs a new Builder.
	         * @exports ProtoBuf.Builder
	         * @class Provides the functionality to build protocol messages.
	         * @param {Object.<string,*>=} options Options
	         * @constructor
	         */
	        var Builder = function(options) {

	            /**
	             * Namespace.
	             * @type {ProtoBuf.Reflect.Namespace}
	             * @expose
	             */
	            this.ns = new Reflect.Namespace(this, null, ""); // Global namespace

	            /**
	             * Namespace pointer.
	             * @type {ProtoBuf.Reflect.T}
	             * @expose
	             */
	            this.ptr = this.ns;

	            /**
	             * Resolved flag.
	             * @type {boolean}
	             * @expose
	             */
	            this.resolved = false;

	            /**
	             * The current building result.
	             * @type {Object.<string,ProtoBuf.Builder.Message|Object>|null}
	             * @expose
	             */
	            this.result = null;

	            /**
	             * Imported files.
	             * @type {Array.<string>}
	             * @expose
	             */
	            this.files = {};

	            /**
	             * Import root override.
	             * @type {?string}
	             * @expose
	             */
	            this.importRoot = null;

	            /**
	             * Options.
	             * @type {!Object.<string, *>}
	             * @expose
	             */
	            this.options = options || {};
	        };

	        /**
	         * @alias ProtoBuf.Builder.prototype
	         * @inner
	         */
	        var BuilderPrototype = Builder.prototype;

	        // ----- Definition tests -----

	        /**
	         * Tests if a definition most likely describes a message.
	         * @param {!Object} def
	         * @returns {boolean}
	         * @expose
	         */
	        Builder.isMessage = function(def) {
	            // Messages require a string name
	            if (typeof def["name"] !== 'string')
	                return false;
	            // Messages do not contain values (enum) or rpc methods (service)
	            if (typeof def["values"] !== 'undefined' || typeof def["rpc"] !== 'undefined')
	                return false;
	            return true;
	        };

	        /**
	         * Tests if a definition most likely describes a message field.
	         * @param {!Object} def
	         * @returns {boolean}
	         * @expose
	         */
	        Builder.isMessageField = function(def) {
	            // Message fields require a string rule, name and type and an id
	            if (typeof def["rule"] !== 'string' || typeof def["name"] !== 'string' || typeof def["type"] !== 'string' || typeof def["id"] === 'undefined')
	                return false;
	            return true;
	        };

	        /**
	         * Tests if a definition most likely describes an enum.
	         * @param {!Object} def
	         * @returns {boolean}
	         * @expose
	         */
	        Builder.isEnum = function(def) {
	            // Enums require a string name
	            if (typeof def["name"] !== 'string')
	                return false;
	            // Enums require at least one value
	            if (typeof def["values"] === 'undefined' || !Array.isArray(def["values"]) || def["values"].length === 0)
	                return false;
	            return true;
	        };

	        /**
	         * Tests if a definition most likely describes a service.
	         * @param {!Object} def
	         * @returns {boolean}
	         * @expose
	         */
	        Builder.isService = function(def) {
	            // Services require a string name and an rpc object
	            if (typeof def["name"] !== 'string' || typeof def["rpc"] !== 'object' || !def["rpc"])
	                return false;
	            return true;
	        };

	        /**
	         * Tests if a definition most likely describes an extended message
	         * @param {!Object} def
	         * @returns {boolean}
	         * @expose
	         */
	        Builder.isExtend = function(def) {
	            // Extends rquire a string ref
	            if (typeof def["ref"] !== 'string')
	                return false;
	            return true;
	        };

	        // ----- Building -----

	        /**
	         * Resets the pointer to the root namespace.
	         * @returns {!ProtoBuf.Builder} this
	         * @expose
	         */
	        BuilderPrototype.reset = function() {
	            this.ptr = this.ns;
	            return this;
	        };

	        /**
	         * Defines a namespace on top of the current pointer position and places the pointer on it.
	         * @param {string} namespace
	         * @return {!ProtoBuf.Builder} this
	         * @expose
	         */
	        BuilderPrototype.define = function(namespace) {
	            if (typeof namespace !== 'string' || !Lang.TYPEREF.test(namespace))
	                throw Error("illegal namespace: "+namespace);
	            namespace.split(".").forEach(function(part) {
	                var ns = this.ptr.getChild(part);
	                if (ns === null) // Keep existing
	                    this.ptr.addChild(ns = new Reflect.Namespace(this, this.ptr, part));
	                this.ptr = ns;
	            }, this);
	            return this;
	        };

	        /**
	         * Creates the specified definitions at the current pointer position.
	         * @param {!Array.<!Object>} defs Messages, enums or services to create
	         * @returns {!ProtoBuf.Builder} this
	         * @throws {Error} If a message definition is invalid
	         * @expose
	         */
	        BuilderPrototype.create = function(defs) {
	            if (!defs)
	                return this; // Nothing to create
	            if (!Array.isArray(defs))
	                defs = [defs];
	            else {
	                if (defs.length === 0)
	                    return this;
	                defs = defs.slice();
	            }

	            // It's quite hard to keep track of scopes and memory here, so let's do this iteratively.
	            var stack = [defs];
	            while (stack.length > 0) {
	                defs = stack.pop();

	                if (!Array.isArray(defs)) // Stack always contains entire namespaces
	                    throw Error("not a valid namespace: "+JSON.stringify(defs));

	                while (defs.length > 0) {
	                    var def = defs.shift(); // Namespaces always contain an array of messages, enums and services

	                    if (Builder.isMessage(def)) {
	                        var obj = new Reflect.Message(this, this.ptr, def["name"], def["options"], def["isGroup"], def["syntax"]);

	                        // Create OneOfs
	                        var oneofs = {};
	                        if (def["oneofs"])
	                            Object.keys(def["oneofs"]).forEach(function(name) {
	                                obj.addChild(oneofs[name] = new Reflect.Message.OneOf(this, obj, name));
	                            }, this);

	                        // Create fields
	                        if (def["fields"])
	                            def["fields"].forEach(function(fld) {
	                                if (obj.getChild(fld["id"]|0) !== null)
	                                    throw Error("duplicate or invalid field id in "+obj.name+": "+fld['id']);
	                                if (fld["options"] && typeof fld["options"] !== 'object')
	                                    throw Error("illegal field options in "+obj.name+"#"+fld["name"]);
	                                var oneof = null;
	                                if (typeof fld["oneof"] === 'string' && !(oneof = oneofs[fld["oneof"]]))
	                                    throw Error("illegal oneof in "+obj.name+"#"+fld["name"]+": "+fld["oneof"]);
	                                fld = new Reflect.Message.Field(this, obj, fld["rule"], fld["keytype"], fld["type"], fld["name"], fld["id"], fld["options"], oneof, def["syntax"]);
	                                if (oneof)
	                                    oneof.fields.push(fld);
	                                obj.addChild(fld);
	                            }, this);

	                        // Push children to stack
	                        var subObj = [];
	                        if (def["enums"])
	                            def["enums"].forEach(function(enm) {
	                                subObj.push(enm);
	                            });
	                        if (def["messages"])
	                            def["messages"].forEach(function(msg) {
	                                subObj.push(msg);
	                            });
	                        if (def["services"])
	                            def["services"].forEach(function(svc) {
	                                subObj.push(svc);
	                            });

	                        // Set extension ranges
	                        if (def["extensions"]) {
	                            if (typeof def["extensions"][0] === 'number') // pre 5.0.1
	                                obj.extensions = [ def["extensions"] ];
	                            else
	                                obj.extensions = def["extensions"];
	                        }

	                        // Create on top of current namespace
	                        this.ptr.addChild(obj);
	                        if (subObj.length > 0) {
	                            stack.push(defs); // Push the current level back
	                            defs = subObj; // Continue processing sub level
	                            subObj = null;
	                            this.ptr = obj; // And move the pointer to this namespace
	                            obj = null;
	                            continue;
	                        }
	                        subObj = null;

	                    } else if (Builder.isEnum(def)) {

	                        obj = new Reflect.Enum(this, this.ptr, def["name"], def["options"], def["syntax"]);
	                        def["values"].forEach(function(val) {
	                            obj.addChild(new Reflect.Enum.Value(this, obj, val["name"], val["id"]));
	                        }, this);
	                        this.ptr.addChild(obj);

	                    } else if (Builder.isService(def)) {

	                        obj = new Reflect.Service(this, this.ptr, def["name"], def["options"]);
	                        Object.keys(def["rpc"]).forEach(function(name) {
	                            var mtd = def["rpc"][name];
	                            obj.addChild(new Reflect.Service.RPCMethod(this, obj, name, mtd["request"], mtd["response"], !!mtd["request_stream"], !!mtd["response_stream"], mtd["options"]));
	                        }, this);
	                        this.ptr.addChild(obj);

	                    } else if (Builder.isExtend(def)) {

	                        obj = this.ptr.resolve(def["ref"], true);
	                        if (obj) {
	                            def["fields"].forEach(function(fld) {
	                                if (obj.getChild(fld['id']|0) !== null)
	                                    throw Error("duplicate extended field id in "+obj.name+": "+fld['id']);
	                                // Check if field id is allowed to be extended
	                                if (obj.extensions) {
	                                    var valid = false;
	                                    obj.extensions.forEach(function(range) {
	                                        if (fld["id"] >= range[0] && fld["id"] <= range[1])
	                                            valid = true;
	                                    });
	                                    if (!valid)
	                                        throw Error("illegal extended field id in "+obj.name+": "+fld['id']+" (not within valid ranges)");
	                                }
	                                // Convert extension field names to camel case notation if the override is set
	                                var name = fld["name"];
	                                if (this.options['convertFieldsToCamelCase'])
	                                    name = ProtoBuf.Util.toCamelCase(name);
	                                // see #161: Extensions use their fully qualified name as their runtime key and...
	                                var field = new Reflect.Message.ExtensionField(this, obj, fld["rule"], fld["type"], this.ptr.fqn()+'.'+name, fld["id"], fld["options"]);
	                                // ...are added on top of the current namespace as an extension which is used for
	                                // resolving their type later on (the extension always keeps the original name to
	                                // prevent naming collisions)
	                                var ext = new Reflect.Extension(this, this.ptr, fld["name"], field);
	                                field.extension = ext;
	                                this.ptr.addChild(ext);
	                                obj.addChild(field);
	                            }, this);

	                        } else if (!/\.?google\.protobuf\./.test(def["ref"])) // Silently skip internal extensions
	                            throw Error("extended message "+def["ref"]+" is not defined");

	                    } else
	                        throw Error("not a valid definition: "+JSON.stringify(def));

	                    def = null;
	                    obj = null;
	                }
	                // Break goes here
	                defs = null;
	                this.ptr = this.ptr.parent; // Namespace done, continue at parent
	            }
	            this.resolved = false; // Require re-resolve
	            this.result = null; // Require re-build
	            return this;
	        };

	        /**
	         * Propagates syntax to all children.
	         * @param {!Object} parent
	         * @inner
	         */
	        function propagateSyntax(parent) {
	            if (parent['messages']) {
	                parent['messages'].forEach(function(child) {
	                    child["syntax"] = parent["syntax"];
	                    propagateSyntax(child);
	                });
	            }
	            if (parent['enums']) {
	                parent['enums'].forEach(function(child) {
	                    child["syntax"] = parent["syntax"];
	                });
	            }
	        }

	        /**
	         * Imports another definition into this builder.
	         * @param {Object.<string,*>} json Parsed import
	         * @param {(string|{root: string, file: string})=} filename Imported file name
	         * @returns {!ProtoBuf.Builder} this
	         * @throws {Error} If the definition or file cannot be imported
	         * @expose
	         */
	        BuilderPrototype["import"] = function(json, filename) {
	            var delim = '/';

	            // Make sure to skip duplicate imports

	            if (typeof filename === 'string') {

	                if (ProtoBuf.Util.IS_NODE)
	                    filename = require$$2['resolve'](filename);
	                if (this.files[filename] === true)
	                    return this.reset();
	                this.files[filename] = true;

	            } else if (typeof filename === 'object') { // Object with root, file.

	                var root = filename.root;
	                if (ProtoBuf.Util.IS_NODE)
	                    root = require$$2['resolve'](root);
	                if (root.indexOf("\\") >= 0 || filename.file.indexOf("\\") >= 0)
	                    delim = '\\';
	                var fname;
	                if (ProtoBuf.Util.IS_NODE)
	                    fname = require$$2['join'](root, filename.file);
	                else
	                    fname = root + delim + filename.file;
	                if (this.files[fname] === true)
	                    return this.reset();
	                this.files[fname] = true;
	            }

	            // Import imports

	            if (json['imports'] && json['imports'].length > 0) {
	                var importRoot,
	                    resetRoot = false;

	                if (typeof filename === 'object') { // If an import root is specified, override

	                    this.importRoot = filename["root"]; resetRoot = true; // ... and reset afterwards
	                    importRoot = this.importRoot;
	                    filename = filename["file"];
	                    if (importRoot.indexOf("\\") >= 0 || filename.indexOf("\\") >= 0)
	                        delim = '\\';

	                } else if (typeof filename === 'string') {

	                    if (this.importRoot) // If import root is overridden, use it
	                        importRoot = this.importRoot;
	                    else { // Otherwise compute from filename
	                        if (filename.indexOf("/") >= 0) { // Unix
	                            importRoot = filename.replace(/\/[^\/]*$/, "");
	                            if (/* /file.proto */ importRoot === "")
	                                importRoot = "/";
	                        } else if (filename.indexOf("\\") >= 0) { // Windows
	                            importRoot = filename.replace(/\\[^\\]*$/, "");
	                            delim = '\\';
	                        } else
	                            importRoot = ".";
	                    }

	                } else
	                    importRoot = null;

	                for (var i=0; i<json['imports'].length; i++) {
	                    if (typeof json['imports'][i] === 'string') { // Import file
	                        if (!importRoot)
	                            throw Error("cannot determine import root");
	                        var importFilename = json['imports'][i];
	                        if (importFilename === "google/protobuf/descriptor.proto")
	                            continue; // Not needed and therefore not used
	                        if (ProtoBuf.Util.IS_NODE)
	                            importFilename = require$$2['join'](importRoot, importFilename);
	                        else
	                            importFilename = importRoot + delim + importFilename;
	                        if (this.files[importFilename] === true)
	                            continue; // Already imported
	                        if (/\.proto$/i.test(importFilename) && !ProtoBuf.DotProto)       // If this is a light build
	                            importFilename = importFilename.replace(/\.proto$/, ".json"); // always load the JSON file
	                        var contents = ProtoBuf.Util.fetch(importFilename);
	                        if (contents === null)
	                            throw Error("failed to import '"+importFilename+"' in '"+filename+"': file not found");
	                        if (/\.json$/i.test(importFilename)) // Always possible
	                            this["import"](JSON.parse(contents+""), importFilename); // May throw
	                        else
	                            this["import"](ProtoBuf.DotProto.Parser.parse(contents), importFilename); // May throw
	                    } else // Import structure
	                        if (!filename)
	                            this["import"](json['imports'][i]);
	                        else if (/\.(\w+)$/.test(filename)) // With extension: Append _importN to the name portion to make it unique
	                            this["import"](json['imports'][i], filename.replace(/^(.+)\.(\w+)$/, function($0, $1, $2) { return $1+"_import"+i+"."+$2; }));
	                        else // Without extension: Append _importN to make it unique
	                            this["import"](json['imports'][i], filename+"_import"+i);
	                }
	                if (resetRoot) // Reset import root override when all imports are done
	                    this.importRoot = null;
	            }

	            // Import structures

	            if (json['package'])
	                this.define(json['package']);
	            if (json['syntax'])
	                propagateSyntax(json);
	            var base = this.ptr;
	            if (json['options'])
	                Object.keys(json['options']).forEach(function(key) {
	                    base.options[key] = json['options'][key];
	                });
	            if (json['messages'])
	                this.create(json['messages']),
	                this.ptr = base;
	            if (json['enums'])
	                this.create(json['enums']),
	                this.ptr = base;
	            if (json['services'])
	                this.create(json['services']),
	                this.ptr = base;
	            if (json['extends'])
	                this.create(json['extends']);

	            return this.reset();
	        };

	        /**
	         * Resolves all namespace objects.
	         * @throws {Error} If a type cannot be resolved
	         * @returns {!ProtoBuf.Builder} this
	         * @expose
	         */
	        BuilderPrototype.resolveAll = function() {
	            // Resolve all reflected objects
	            var res;
	            if (this.ptr == null || typeof this.ptr.type === 'object')
	                return this; // Done (already resolved)

	            if (this.ptr instanceof Reflect.Namespace) { // Resolve children

	                this.ptr.children.forEach(function(child) {
	                    this.ptr = child;
	                    this.resolveAll();
	                }, this);

	            } else if (this.ptr instanceof Reflect.Message.Field) { // Resolve type

	                if (!Lang.TYPE.test(this.ptr.type)) {
	                    if (!Lang.TYPEREF.test(this.ptr.type))
	                        throw Error("illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
	                    res = (this.ptr instanceof Reflect.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, true);
	                    if (!res)
	                        throw Error("unresolvable type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
	                    this.ptr.resolvedType = res;
	                    if (res instanceof Reflect.Enum) {
	                        this.ptr.type = ProtoBuf.TYPES["enum"];
	                        if (this.ptr.syntax === 'proto3' && res.syntax !== 'proto3')
	                            throw Error("proto3 message cannot reference proto2 enum");
	                    }
	                    else if (res instanceof Reflect.Message)
	                        this.ptr.type = res.isGroup ? ProtoBuf.TYPES["group"] : ProtoBuf.TYPES["message"];
	                    else
	                        throw Error("illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
	                } else
	                    this.ptr.type = ProtoBuf.TYPES[this.ptr.type];

	                // If it's a map field, also resolve the key type. The key type can be only a numeric, string, or bool type
	                // (i.e., no enums or messages), so we don't need to resolve against the current namespace.
	                if (this.ptr.map) {
	                    if (!Lang.TYPE.test(this.ptr.keyType))
	                        throw Error("illegal key type for map field in "+this.ptr.toString(true)+": "+this.ptr.keyType);
	                    this.ptr.keyType = ProtoBuf.TYPES[this.ptr.keyType];
	                }

	                // If it's a repeated and packable field then proto3 mandates it should be packed by
	                // default
	                if (
	                  this.ptr.syntax === 'proto3' &&
	                  this.ptr.repeated && this.ptr.options.packed === undefined &&
	                  ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.ptr.type.wireType) !== -1
	                ) {
	                  this.ptr.options.packed = true;
	                }

	            } else if (this.ptr instanceof ProtoBuf.Reflect.Service.Method) {

	                if (this.ptr instanceof ProtoBuf.Reflect.Service.RPCMethod) {
	                    res = this.ptr.parent.resolve(this.ptr.requestName, true);
	                    if (!res || !(res instanceof ProtoBuf.Reflect.Message))
	                        throw Error("Illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.requestName);
	                    this.ptr.resolvedRequestType = res;
	                    res = this.ptr.parent.resolve(this.ptr.responseName, true);
	                    if (!res || !(res instanceof ProtoBuf.Reflect.Message))
	                        throw Error("Illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.responseName);
	                    this.ptr.resolvedResponseType = res;
	                } else // Should not happen as nothing else is implemented
	                    throw Error("illegal service type in "+this.ptr.toString(true));

	            } else if (
	                !(this.ptr instanceof ProtoBuf.Reflect.Message.OneOf) && // Not built
	                !(this.ptr instanceof ProtoBuf.Reflect.Extension) && // Not built
	                !(this.ptr instanceof ProtoBuf.Reflect.Enum.Value) // Built in enum
	            )
	                throw Error("illegal object in namespace: "+typeof(this.ptr)+": "+this.ptr);

	            return this.reset();
	        };

	        /**
	         * Builds the protocol. This will first try to resolve all definitions and, if this has been successful,
	         * return the built package.
	         * @param {(string|Array.<string>)=} path Specifies what to return. If omitted, the entire namespace will be returned.
	         * @returns {!ProtoBuf.Builder.Message|!Object.<string,*>}
	         * @throws {Error} If a type could not be resolved
	         * @expose
	         */
	        BuilderPrototype.build = function(path) {
	            this.reset();
	            if (!this.resolved)
	                this.resolveAll(),
	                this.resolved = true,
	                this.result = null; // Require re-build
	            if (this.result === null) // (Re-)Build
	                this.result = this.ns.build();
	            if (!path)
	                return this.result;
	            var part = typeof path === 'string' ? path.split(".") : path,
	                ptr = this.result; // Build namespace pointer (no hasChild etc.)
	            for (var i=0; i<part.length; i++)
	                if (ptr[part[i]])
	                    ptr = ptr[part[i]];
	                else {
	                    ptr = null;
	                    break;
	                }
	            return ptr;
	        };

	        /**
	         * Similar to {@link ProtoBuf.Builder#build}, but looks up the internal reflection descriptor.
	         * @param {string=} path Specifies what to return. If omitted, the entire namespace wiil be returned.
	         * @param {boolean=} excludeNonNamespace Excludes non-namespace types like fields, defaults to `false`
	         * @returns {?ProtoBuf.Reflect.T} Reflection descriptor or `null` if not found
	         */
	        BuilderPrototype.lookup = function(path, excludeNonNamespace) {
	            return path ? this.ns.resolve(path, excludeNonNamespace) : this.ns;
	        };

	        /**
	         * Returns a string representation of this object.
	         * @return {string} String representation as of "Builder"
	         * @expose
	         */
	        BuilderPrototype.toString = function() {
	            return "Builder";
	        };

	        // ----- Base classes -----
	        // Exist for the sole purpose of being able to "... instanceof ProtoBuf.Builder.Message" etc.

	        /**
	         * @alias ProtoBuf.Builder.Message
	         */
	        Builder.Message = function() {};

	        /**
	         * @alias ProtoBuf.Builder.Enum
	         */
	        Builder.Enum = function() {};

	        /**
	         * @alias ProtoBuf.Builder.Message
	         */
	        Builder.Service = function() {};

	        return Builder;

	    })(ProtoBuf, ProtoBuf.Lang, ProtoBuf.Reflect);

	    /**
	     * @alias ProtoBuf.Map
	     * @expose
	     */
	    ProtoBuf.Map = (function(ProtoBuf, Reflect) {
	        "use strict";

	        /**
	         * Constructs a new Map. A Map is a container that is used to implement map
	         * fields on message objects. It closely follows the ES6 Map API; however,
	         * it is distinct because we do not want to depend on external polyfills or
	         * on ES6 itself.
	         *
	         * @exports ProtoBuf.Map
	         * @param {!ProtoBuf.Reflect.Field} field Map field
	         * @param {Object.<string,*>=} contents Initial contents
	         * @constructor
	         */
	        var Map = function(field, contents) {
	            if (!field.map)
	                throw Error("field is not a map");

	            /**
	             * The field corresponding to this map.
	             * @type {!ProtoBuf.Reflect.Field}
	             */
	            this.field = field;

	            /**
	             * Element instance corresponding to key type.
	             * @type {!ProtoBuf.Reflect.Element}
	             */
	            this.keyElem = new Reflect.Element(field.keyType, null, true, field.syntax);

	            /**
	             * Element instance corresponding to value type.
	             * @type {!ProtoBuf.Reflect.Element}
	             */
	            this.valueElem = new Reflect.Element(field.type, field.resolvedType, false, field.syntax);

	            /**
	             * Internal map: stores mapping of (string form of key) -> (key, value)
	             * pair.
	             *
	             * We provide map semantics for arbitrary key types, but we build on top
	             * of an Object, which has only string keys. In order to avoid the need
	             * to convert a string key back to its native type in many situations,
	             * we store the native key value alongside the value. Thus, we only need
	             * a one-way mapping from a key type to its string form that guarantees
	             * uniqueness and equality (i.e., str(K1) === str(K2) if and only if K1
	             * === K2).
	             *
	             * @type {!Object<string, {key: *, value: *}>}
	             */
	            this.map = {};

	            /**
	             * Returns the number of elements in the map.
	             */
	            Object.defineProperty(this, "size", {
	                get: function() { return Object.keys(this.map).length; }
	            });

	            // Fill initial contents from a raw object.
	            if (contents) {
	                var keys = Object.keys(contents);
	                for (var i = 0; i < keys.length; i++) {
	                    var key = this.keyElem.valueFromString(keys[i]);
	                    var val = this.valueElem.verifyValue(contents[keys[i]]);
	                    this.map[this.keyElem.valueToString(key)] =
	                        { key: key, value: val };
	                }
	            }
	        };

	        var MapPrototype = Map.prototype;

	        /**
	         * Helper: return an iterator over an array.
	         * @param {!Array<*>} arr the array
	         * @returns {!Object} an iterator
	         * @inner
	         */
	        function arrayIterator(arr) {
	            var idx = 0;
	            return {
	                next: function() {
	                    if (idx < arr.length)
	                        return { done: false, value: arr[idx++] };
	                    return { done: true };
	                }
	            }
	        }

	        /**
	         * Clears the map.
	         */
	        MapPrototype.clear = function() {
	            this.map = {};
	        };

	        /**
	         * Deletes a particular key from the map.
	         * @returns {boolean} Whether any entry with this key was deleted.
	         */
	        MapPrototype["delete"] = function(key) {
	            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
	            var hadKey = keyValue in this.map;
	            delete this.map[keyValue];
	            return hadKey;
	        };

	        /**
	         * Returns an iterator over [key, value] pairs in the map.
	         * @returns {Object} The iterator
	         */
	        MapPrototype.entries = function() {
	            var entries = [];
	            var strKeys = Object.keys(this.map);
	            for (var i = 0, entry; i < strKeys.length; i++)
	                entries.push([(entry=this.map[strKeys[i]]).key, entry.value]);
	            return arrayIterator(entries);
	        };

	        /**
	         * Returns an iterator over keys in the map.
	         * @returns {Object} The iterator
	         */
	        MapPrototype.keys = function() {
	            var keys = [];
	            var strKeys = Object.keys(this.map);
	            for (var i = 0; i < strKeys.length; i++)
	                keys.push(this.map[strKeys[i]].key);
	            return arrayIterator(keys);
	        };

	        /**
	         * Returns an iterator over values in the map.
	         * @returns {!Object} The iterator
	         */
	        MapPrototype.values = function() {
	            var values = [];
	            var strKeys = Object.keys(this.map);
	            for (var i = 0; i < strKeys.length; i++)
	                values.push(this.map[strKeys[i]].value);
	            return arrayIterator(values);
	        };

	        /**
	         * Iterates over entries in the map, calling a function on each.
	         * @param {function(this:*, *, *, *)} cb The callback to invoke with value, key, and map arguments.
	         * @param {Object=} thisArg The `this` value for the callback
	         */
	        MapPrototype.forEach = function(cb, thisArg) {
	            var strKeys = Object.keys(this.map);
	            for (var i = 0, entry; i < strKeys.length; i++)
	                cb.call(thisArg, (entry=this.map[strKeys[i]]).value, entry.key, this);
	        };

	        /**
	         * Sets a key in the map to the given value.
	         * @param {*} key The key
	         * @param {*} value The value
	         * @returns {!ProtoBuf.Map} The map instance
	         */
	        MapPrototype.set = function(key, value) {
	            var keyValue = this.keyElem.verifyValue(key);
	            var valValue = this.valueElem.verifyValue(value);
	            this.map[this.keyElem.valueToString(keyValue)] =
	                { key: keyValue, value: valValue };
	            return this;
	        };

	        /**
	         * Gets the value corresponding to a key in the map.
	         * @param {*} key The key
	         * @returns {*|undefined} The value, or `undefined` if key not present
	         */
	        MapPrototype.get = function(key) {
	            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
	            if (!(keyValue in this.map))
	                return undefined;
	            return this.map[keyValue].value;
	        };

	        /**
	         * Determines whether the given key is present in the map.
	         * @param {*} key The key
	         * @returns {boolean} `true` if the key is present
	         */
	        MapPrototype.has = function(key) {
	            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
	            return (keyValue in this.map);
	        };

	        return Map;
	    })(ProtoBuf, ProtoBuf.Reflect);


	    /**
	     * Constructs a new empty Builder.
	     * @param {Object.<string,*>=} options Builder options, defaults to global options set on ProtoBuf
	     * @return {!ProtoBuf.Builder} Builder
	     * @expose
	     */
	    ProtoBuf.newBuilder = function(options) {
	        options = options || {};
	        if (typeof options['convertFieldsToCamelCase'] === 'undefined')
	            options['convertFieldsToCamelCase'] = ProtoBuf.convertFieldsToCamelCase;
	        if (typeof options['populateAccessors'] === 'undefined')
	            options['populateAccessors'] = ProtoBuf.populateAccessors;
	        return new ProtoBuf.Builder(options);
	    };

	    /**
	     * Loads a .json definition and returns the Builder.
	     * @param {!*|string} json JSON definition
	     * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
	     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
	     * @return {ProtoBuf.Builder} Builder to create new messages
	     * @throws {Error} If the definition cannot be parsed or built
	     * @expose
	     */
	    ProtoBuf.loadJson = function(json, builder, filename) {
	        if (typeof builder === 'string' || (builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string'))
	            filename = builder,
	            builder = null;
	        if (!builder || typeof builder !== 'object')
	            builder = ProtoBuf.newBuilder();
	        if (typeof json === 'string')
	            json = JSON.parse(json);
	        builder["import"](json, filename);
	        builder.resolveAll();
	        return builder;
	    };

	    /**
	     * Loads a .json file and returns the Builder.
	     * @param {string|!{root: string, file: string}} filename Path to json file or an object specifying 'file' with
	     *  an overridden 'root' path for all imported files.
	     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
	     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
	     *  file will be read synchronously and this function will return the Builder.
	     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
	     * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
	     *   request has failed), else undefined
	     * @expose
	     */
	    ProtoBuf.loadJsonFile = function(filename, callback, builder) {
	        if (callback && typeof callback === 'object')
	            builder = callback,
	            callback = null;
	        else if (!callback || typeof callback !== 'function')
	            callback = null;
	        if (callback)
	            return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"]+"/"+filename["file"], function(contents) {
	                if (contents === null) {
	                    callback(Error("Failed to fetch file"));
	                    return;
	                }
	                try {
	                    callback(null, ProtoBuf.loadJson(JSON.parse(contents), builder, filename));
	                } catch (e) {
	                    callback(e);
	                }
	            });
	        var contents = ProtoBuf.Util.fetch(typeof filename === 'object' ? filename["root"]+"/"+filename["file"] : filename);
	        return contents === null ? null : ProtoBuf.loadJson(JSON.parse(contents), builder, filename);
	    };

	    return ProtoBuf;
	});
	});

	var messageCompiled = protobufLight.newBuilder({})['import']({
	    "package": "push_server.messages2",
	    "syntax": "proto2",
	    "options": {
	        "objc_class_prefix": "AVIM"
	    },
	    "messages": [{
	        "name": "JsonObjectMessage",
	        "syntax": "proto2",
	        "fields": [{
	            "rule": "required",
	            "type": "string",
	            "name": "data",
	            "id": 1
	        }]
	    }, {
	        "name": "UnreadTuple",
	        "syntax": "proto2",
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
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "from",
	            "id": 5
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "data",
	            "id": 6
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "patchTimestamp",
	            "id": 7
	        }]
	    }, {
	        "name": "LogItem",
	        "syntax": "proto2",
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
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "readAt",
	            "id": 6
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "patchTimestamp",
	            "id": 7
	        }]
	    }, {
	        "name": "DataCommand",
	        "syntax": "proto2",
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
	        }, {
	            "rule": "optional",
	            "type": "bool",
	            "name": "offline",
	            "id": 3
	        }]
	    }, {
	        "name": "SessionCommand",
	        "syntax": "proto2",
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
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "detail",
	            "id": 16
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "lastUnreadNotifTime",
	            "id": 17
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "lastPatchTime",
	            "id": 18
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "configBitmap",
	            "id": 19
	        }]
	    }, {
	        "name": "ErrorCommand",
	        "syntax": "proto2",
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
	        "syntax": "proto2",
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
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "pushData",
	            "id": 16
	        }, {
	            "rule": "optional",
	            "type": "bool",
	            "name": "will",
	            "id": 17
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "patchTimestamp",
	            "id": 18
	        }]
	    }, {
	        "name": "AckCommand",
	        "syntax": "proto2",
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
	        "syntax": "proto2",
	        "fields": [{
	            "rule": "repeated",
	            "type": "UnreadTuple",
	            "name": "convs",
	            "id": 1
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "notifTime",
	            "id": 2
	        }]
	    }, {
	        "name": "ConvCommand",
	        "syntax": "proto2",
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
	            "type": "bool",
	            "name": "statusSub",
	            "id": 16
	        }, {
	            "rule": "optional",
	            "type": "bool",
	            "name": "statusPub",
	            "id": 17
	        }, {
	            "rule": "optional",
	            "type": "int32",
	            "name": "statusTTL",
	            "id": 18
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "uniqueId",
	            "id": 19
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "targetClientId",
	            "id": 20
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "maxReadTimestamp",
	            "id": 21
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "maxAckTimestamp",
	            "id": 22
	        }, {
	            "rule": "optional",
	            "type": "bool",
	            "name": "queryAllMembers",
	            "id": 23
	        }, {
	            "rule": "repeated",
	            "type": "MaxReadTuple",
	            "name": "maxReadTuples",
	            "id": 24
	        }, {
	            "rule": "repeated",
	            "type": "string",
	            "name": "cids",
	            "id": 25
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
	        "syntax": "proto2",
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
	        "syntax": "proto2",
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
	            "rule": "optional",
	            "type": "bool",
	            "name": "reversed",
	            "id": 10
	        }, {
	            "rule": "repeated",
	            "type": "LogItem",
	            "name": "logs",
	            "id": 105
	        }]
	    }, {
	        "name": "RcpCommand",
	        "syntax": "proto2",
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
	        }, {
	            "rule": "optional",
	            "type": "bool",
	            "name": "read",
	            "id": 4
	        }]
	    }, {
	        "name": "ReadTuple",
	        "syntax": "proto2",
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
	        "name": "MaxReadTuple",
	        "syntax": "proto2",
	        "fields": [{
	            "rule": "optional",
	            "type": "string",
	            "name": "pid",
	            "id": 1
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "maxAckTimestamp",
	            "id": 2
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "maxReadTimestamp",
	            "id": 3
	        }]
	    }, {
	        "name": "ReadCommand",
	        "syntax": "proto2",
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
	        "syntax": "proto2",
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
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "cid",
	            "id": 3
	        }]
	    }, {
	        "name": "ReportCommand",
	        "syntax": "proto2",
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
	        "name": "PatchItem",
	        "syntax": "proto2",
	        "fields": [{
	            "rule": "optional",
	            "type": "string",
	            "name": "cid",
	            "id": 1
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "mid",
	            "id": 2
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "timestamp",
	            "id": 3
	        }, {
	            "rule": "optional",
	            "type": "bool",
	            "name": "recall",
	            "id": 4
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "data",
	            "id": 5
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "patchTimestamp",
	            "id": 6
	        }, {
	            "rule": "optional",
	            "type": "string",
	            "name": "from",
	            "id": 7
	        }]
	    }, {
	        "name": "PatchCommand",
	        "syntax": "proto2",
	        "fields": [{
	            "rule": "repeated",
	            "type": "PatchItem",
	            "name": "patches",
	            "id": 1
	        }, {
	            "rule": "optional",
	            "type": "int64",
	            "name": "lastPatchTime",
	            "id": 2
	        }]
	    }, {
	        "name": "GenericCommand",
	        "syntax": "proto2",
	        "fields": [{
	            "rule": "optional",
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
	            "type": "int32",
	            "name": "priority",
	            "id": 7
	        }, {
	            "rule": "optional",
	            "type": "int32",
	            "name": "service",
	            "id": 8
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
	        }, {
	            "rule": "optional",
	            "type": "PatchCommand",
	            "name": "patchMessage",
	            "id": 114
	        }]
	    }],
	    "enums": [{
	        "name": "CommandType",
	        "syntax": "proto2",
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
	        }, {
	            "name": "loggedin",
	            "id": 15
	        }, {
	            "name": "logout",
	            "id": 16
	        }, {
	            "name": "loggedout",
	            "id": 17
	        }, {
	            "name": "patch",
	            "id": 18
	        }]
	    }, {
	        "name": "OpType",
	        "syntax": "proto2",
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
	            "name": "status",
	            "id": 49
	        }, {
	            "name": "members",
	            "id": 50
	        }, {
	            "name": "max_read",
	            "id": 51
	        }, {
	            "name": "is_member",
	            "id": 52
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
	        }, {
	            "name": "modify",
	            "id": 150
	        }, {
	            "name": "modified",
	            "id": 151
	        }]
	    }, {
	        "name": "StatusType",
	        "syntax": "proto2",
	        "values": [{
	            "name": "on",
	            "id": 1
	        }, {
	            "name": "off",
	            "id": 2
	        }]
	    }],
	    "isNamespace": true
	}).build();

	var _messages$push_server = messageCompiled.push_server.messages2;
	var JsonObjectMessage = _messages$push_server.JsonObjectMessage;
	var UnreadTuple = _messages$push_server.UnreadTuple;
	var LogItem = _messages$push_server.LogItem;
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
	var MaxReadTuple = _messages$push_server.MaxReadTuple;
	var ReadCommand = _messages$push_server.ReadCommand;
	var PresenceCommand = _messages$push_server.PresenceCommand;
	var ReportCommand = _messages$push_server.ReportCommand;
	var GenericCommand = _messages$push_server.GenericCommand;
	var PatchCommand = _messages$push_server.PatchCommand;
	var PatchItem = _messages$push_server.PatchItem;
	var CommandType = _messages$push_server.CommandType;
	var OpType = _messages$push_server.OpType;
	var StatusType = _messages$push_server.StatusType;




	var message = Object.freeze({
		JsonObjectMessage: JsonObjectMessage,
		UnreadTuple: UnreadTuple,
		LogItem: LogItem,
		DataCommand: DataCommand,
		SessionCommand: SessionCommand,
		ErrorCommand: ErrorCommand,
		DirectCommand: DirectCommand,
		AckCommand: AckCommand,
		UnreadCommand: UnreadCommand,
		ConvCommand: ConvCommand,
		RoomCommand: RoomCommand,
		LogsCommand: LogsCommand,
		RcpCommand: RcpCommand,
		ReadTuple: ReadTuple,
		MaxReadTuple: MaxReadTuple,
		ReadCommand: ReadCommand,
		PresenceCommand: PresenceCommand,
		ReportCommand: ReportCommand,
		GenericCommand: GenericCommand,
		PatchCommand: PatchCommand,
		PatchItem: PatchItem,
		CommandType: CommandType,
		OpType: OpType,
		StatusType: StatusType
	});

	var index$6 = createCommonjsModule(function (module) {
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

	var _createProperty = function(object, index, value){
	  if(index in object)_objectDp.f(object, index, _propertyDesc(0, value));
	  else object[index] = value;
	};

	_export(_export.S + _export.F * !_iterDetect(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = _toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = core_getIteratorMethod(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && _isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = _toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

	var from$1 = _core.Array.from;

	var from = createCommonjsModule(function (module) {
	module.exports = { "default": from$1, __esModule: true };
	});

	var toConsumableArray = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _from2 = _interopRequireDefault(from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};
	});

	var _toConsumableArray = unwrapExports(toConsumableArray);

	var dP$2          = _objectDp.f;
	var fastKey     = _meta.fastKey;
	var SIZE        = _descriptors ? '_s' : 'size';

	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};

	var _collectionStrong = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      _anInstance(that, C, NAME, '_i');
	      that._i = _objectCreate(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if(iterable != undefined)_forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    _redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        _anInstance(this, C, 'forEach');
	        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(_descriptors)dP$2(C.prototype, 'size', {
	      get: function(){
	        return _defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    _iterDefine(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return _iterStep(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return _iterStep(0, entry.k);
	      if(kind == 'values')return _iterStep(0, entry.v);
	      return _iterStep(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    _setSpecies(NAME);
	  }
	};

	var SPECIES$2  = _wks('species');

	var _arraySpeciesConstructor = function(original){
	  var C;
	  if(_isArray(original)){
	    C = original.constructor;
	    // cross-realm fallback
	    if(typeof C == 'function' && (C === Array || _isArray(C.prototype)))C = undefined;
	    if(_isObject(C)){
	      C = C[SPECIES$2];
	      if(C === null)C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


	var _arraySpeciesCreate = function(original, length){
	  return new (_arraySpeciesConstructor(original))(length);
	};

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex

	var _arrayMethods = function(TYPE, $create){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
	    , create        = $create || _arraySpeciesCreate;
	  return function($this, callbackfn, that){
	    var O      = _toObject($this)
	      , self   = _iobject(O)
	      , f      = _ctx(callbackfn, that, 3)
	      , length = _toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

	var dP$3             = _objectDp.f;
	var each           = _arrayMethods(0);

	var _collection = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = _global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!_descriptors || typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    _redefineAll(C.prototype, methods);
	    _meta.NEED = true;
	  } else {
	    C = wrapper(function(target, iterable){
	      _anInstance(target, C, NAME, '_c');
	      target._c = new Base;
	      if(iterable != undefined)_forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))_hide(C.prototype, KEY, function(a, b){
	        _anInstance(this, C, KEY);
	        if(!IS_ADDER && IS_WEAK && !_isObject(a))return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    if('size' in proto)dP$3(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }

	  _setToStringTag(C, NAME);

	  O[NAME] = C;
	  _export(_export.G + _export.W + _export.F, O);

	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

	// 23.2 Set Objects
	var es6_set = _collection('Set', function(get){
	  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return _collectionStrong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, _collectionStrong);

	var _arrayFromIterable = function(iter, ITERATOR){
	  var result = [];
	  _forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON

	var _collectionToJson = function(NAME){
	  return function toJSON(){
	    if(_classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    return _arrayFromIterable(this);
	  };
	};

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON


	_export(_export.P + _export.R, 'Set', {toJSON: _collectionToJson('Set')});

	var set$1 = _core.Set;

	var set = createCommonjsModule(function (module) {
	module.exports = { "default": set$1, __esModule: true };
	});

	var _Set = unwrapExports(set);

	// 19.1.2.1 Object.assign(target, source, ...)
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
	  var T     = _toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = _objectGops.f
	    , isEnum     = _objectPie.f;
	  while(aLen > index){
	    var S      = _iobject(arguments[index++])
	      , keys   = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

	// 19.1.3.1 Object.assign(target, source)


	_export(_export.S + _export.F, 'Object', {assign: _objectAssign});

	var assign$2 = _core.Object.assign;

	var assign$1 = createCommonjsModule(function (module) {
	module.exports = { "default": assign$2, __esModule: true };
	});

	var _Object$assign = unwrapExports(assign$1);

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d$1 = h * 24;
	var y = d$1 * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	var index$7 = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d$1;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d$1) {
	    return Math.round(ms / d$1) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d$1, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}

	var debug$1 = createCommonjsModule(function (module, exports) {
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = index$7;

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	 */

	exports.formatters = {};

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 * @param {String} namespace
	 * @return {Number}
	 * @api private
	 */

	function selectColor(namespace) {
	  var hash = 0, i;

	  for (i in namespace) {
	    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
	    hash |= 0; // Convert to 32bit integer
	  }

	  return exports.colors[Math.abs(hash) % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function createDebug(namespace) {

	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;

	    var self = debug;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // turn the `arguments` into a proper Array
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %O
	      args.unshift('%O');
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    // apply env-specific formatting (colors, etc.)
	    exports.formatArgs.call(self, args);

	    var logFn = debug.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }

	  debug.namespace = namespace;
	  debug.enabled = exports.enabled(namespace);
	  debug.useColors = exports.useColors();
	  debug.color = selectColor(namespace);

	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }

	  return debug;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  exports.names = [];
	  exports.skips = [];

	  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}
	});

	var browser$1 = createCommonjsModule(function (module, exports) {
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug$1;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
	    return true;
	  }

	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
	    // double check webkit in userAgent just in case we are in a worker
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return;

	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit');

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (!r && typeof process !== 'undefined' && 'env' in process) {
	    r = process.env.DEBUG;
	  }

	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}
	});

	var bind = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	var index$10 = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	};

	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}

	/*global toString:true*/

	// utils is a library of generic helper functions non-specific to axios

	var toString$2 = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray$1(val) {
	  return toString$2.call(val) === '[object Array]';
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString$2.call(val) === '[object ArrayBuffer]';
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return typeof FormData !== 'undefined' && val instanceof FormData;
	}

	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject$1(val) {
	  return val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString$2.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString$2.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString$2.call(val) === '[object Blob]';
	}

	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString$2.call(val) === '[object Function]';
	}

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject$1(val) && isFunction(val.pipe);
	}

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
	    return false;
	  }
	  return typeof window !== 'undefined' && typeof document !== 'undefined';
	}

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Force an array if not already something iterable
	  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && !isArray$1(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray$1(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge() /* obj1, obj2, obj3, ... */{
	  var result = {};
	  function assignValue(val, key) {
	    if (_typeof(result[key]) === 'object' && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}

	var utils = {
	  isArray: isArray$1,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: index$10,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject$1,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};

	var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};

	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */

	var enhanceError = function enhanceError(error, config, code, request, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.request = request;
	  error.response = response;
	  return error;
	};

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	var createError = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	var settle = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
	  }
	};

	function encode(val) {
	  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	var buildURL = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }

	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];

	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }

	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }

	      if (!utils.isArray(val)) {
	        val = [val];
	      }

	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = _JSON$stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });

	    serializedParams = parts.join('&');
	  }

	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	};

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	var parseHeaders = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;

	  if (!headers) {
	    return parsed;
	  }

	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));

	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};

	var isURLSameOrigin = utils.isStandardBrowserEnv() ?

	// Standard browser envs have full support of the APIs needed to test
	// whether the request URL is of the same origin as current location.
	function standardBrowserEnv() {
	  var msie = /(msie|trident)/i.test(navigator.userAgent);
	  var urlParsingNode = document.createElement('a');
	  var originURL;

	  /**
	  * Parse a URL to discover it's components
	  *
	  * @param {String} url The URL to be parsed
	  * @returns {Object}
	  */
	  function resolveURL(url) {
	    var href = url;

	    if (msie) {
	      // IE needs attribute set twice to normalize properties
	      urlParsingNode.setAttribute('href', href);
	      href = urlParsingNode.href;
	    }

	    urlParsingNode.setAttribute('href', href);

	    // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	    return {
	      href: urlParsingNode.href,
	      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	      host: urlParsingNode.host,
	      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	      hostname: urlParsingNode.hostname,
	      port: urlParsingNode.port,
	      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
	    };
	  }

	  originURL = resolveURL(window.location.href);

	  /**
	  * Determine if a URL shares the same origin as the current location
	  *
	  * @param {String} requestURL The URL to test
	  * @returns {boolean} True if URL shares the same origin, otherwise false
	  */
	  return function isURLSameOrigin(requestURL) {
	    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
	    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
	  };
	}() :

	// Non standard browser envs (web workers, react-native) lack needed support.
	function nonStandardBrowserEnv() {
	  return function isURLSameOrigin() {
	    return true;
	  };
	}();

	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error();
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';

	function btoa$1(input) {
	  var str = String(input);
	  var output = '';
	  for (
	  // initialize result and counter
	  var block, charCode, idx = 0, map = chars;
	  // if the next str index does not exist:
	  //   change the mapping table to "="
	  //   check if d has no fractional digits
	  str.charAt(idx | 0) || (map = '=', idx % 1);
	  // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	  output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}

	var btoa_1 = btoa$1;

	var cookies = utils.isStandardBrowserEnv() ?

	// Standard browser envs support document.cookie
	function standardBrowserEnv() {
	  return {
	    write: function write(name, value, expires, path, domain, secure) {
	      var cookie = [];
	      cookie.push(name + '=' + encodeURIComponent(value));

	      if (utils.isNumber(expires)) {
	        cookie.push('expires=' + new Date(expires).toGMTString());
	      }

	      if (utils.isString(path)) {
	        cookie.push('path=' + path);
	      }

	      if (utils.isString(domain)) {
	        cookie.push('domain=' + domain);
	      }

	      if (secure === true) {
	        cookie.push('secure');
	      }

	      document.cookie = cookie.join('; ');
	    },

	    read: function read(name) {
	      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	      return match ? decodeURIComponent(match[3]) : null;
	    },

	    remove: function remove(name) {
	      this.write(name, '', Date.now() - 86400000);
	    }
	  };
	}() :

	// Non standard browser env (web workers, react-native) lack needed support.
	function nonStandardBrowserEnv() {
	  return {
	    write: function write() {},
	    read: function read() {
	      return null;
	    },
	    remove: function remove() {}
	  };
	}();

	var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || btoa_1;

	var xhr = function xhrAdapter(config) {
	  return new _Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;

	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }

	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;

	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (process.env.NODE_ENV !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }

	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }

	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

	    // Set the request timeout in MS
	    request.timeout = config.timeout;

	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || request.readyState !== 4 && !xDomain) {
	        return;
	      }

	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }

	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };

	      settle(resolve, reject, response);

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config, null, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request));

	      // Clean up request
	      request = null;
	    };

	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies$$1 = cookies;

	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies$$1.read(config.xsrfCookieName) : undefined;

	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }

	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }

	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
	        if (config.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }

	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }

	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }

	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }

	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }

	    if (requestData === undefined) {
	      requestData = null;
	    }

	    // Send the request
	    request.send(requestData);
	  });
	};

	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}

	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = xhr;
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = xhr;
	  }
	  return adapter;
	}

	var defaults = {
	  adapter: getDefaultAdapter(),

	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return _JSON$stringify(data);
	    }
	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      try {
	        data = JSON.parse(data);
	      } catch (e) {/* Ignore */}
	    }
	    return data;
	  }],

	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};

	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};

	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});

	var defaults_1 = defaults;

	function InterceptorManager() {
	  this.handlers = [];
	}

	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};

	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};

	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	var InterceptorManager_1 = InterceptorManager;

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	var transformData = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });

	  return data;
	};

	var isCancel = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	var dispatchRequest = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  // Ensure headers exist
	  config.headers = config.headers || {};

	  // Transform request data
	  config.data = transformData(config.data, config.headers, config.transformRequest);

	  // Flatten headers
	  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

	  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
	    delete config.headers[method];
	  });

	  var adapter = config.adapter || defaults_1.adapter;

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData(response.data, response.headers, config.transformResponse);

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
	      }
	    }

	    return _Promise.reject(reason);
	  });
	};

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */

	var isAbsoluteURL = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return (/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
	  );
	};

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */

	var combineURLs = function combineURLs(baseURL, relativeURL) {
	  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
	};

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager_1(),
	    response: new InterceptorManager_1()
	  };
	}

	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }

	  config = utils.merge(defaults_1, this.defaults, { method: 'get' }, config);
	  config.method = config.method.toLowerCase();

	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }

	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = _Promise.resolve(config);

	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });

	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });

	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }

	  return promise;
	};

	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function (url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function (url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});

	var Axios_1 = Axios;

	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */

	function Cancel(message) {
	  this.message = message;
	}

	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};

	Cancel.prototype.__CANCEL__ = true;

	var Cancel_1 = Cancel;

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }

	  var resolvePromise;
	  this.promise = new _Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });

	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }

	    token.reason = new Cancel_1(message);
	    resolvePromise(token.reason);
	  });
	}

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};

	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};

	var CancelToken_1 = CancelToken;

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */

	var spread = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios_1(defaultConfig);
	  var instance = bind(Axios_1.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios_1.prototype, context);

	  // Copy context to instance
	  utils.extend(instance, context);

	  return instance;
	}

	// Create the default instance to be exported
	var axios$1 = createInstance(defaults_1);

	// Expose Axios class to allow class inheritance
	axios$1.Axios = Axios_1;

	// Factory for creating new instances
	axios$1.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults_1, instanceConfig));
	};

	// Expose Cancel & CancelToken
	axios$1.Cancel = Cancel_1;
	axios$1.CancelToken = CancelToken_1;
	axios$1.isCancel = isCancel;

	// Expose all/spread
	axios$1.all = function all(promises) {
	  return _Promise.all(promises);
	};
	axios$1.spread = spread;

	var axios_1 = axios$1;

	// Allow use of default import syntax in TypeScript
	var default_1 = axios$1;

	axios_1.default = default_1;

	var index$9 = axios_1;

	// most Object methods by ES6 should accept primitives

	var _objectSap = function(KEY, exec){
	  var fn  = (_core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  _export(_export.S + _export.F * _fails(function(){ fn(1); }), 'Object', exp);
	};

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var $getOwnPropertyDescriptor$1 = _objectGopd.f;

	_objectSap('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor$1(_toIobject(it), key);
	  };
	});

	var $Object$2 = _core.Object;
	var getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(it, key){
	  return $Object$2.getOwnPropertyDescriptor(it, key);
	};

	var getOwnPropertyDescriptor = createCommonjsModule(function (module) {
	module.exports = { "default": getOwnPropertyDescriptor$1, __esModule: true };
	});

	var _Object$getOwnPropertyDescriptor = unwrapExports(getOwnPropertyDescriptor);

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

	var _extends = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _assign2 = _interopRequireDefault(assign$1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};
	});

	var getWeak           = _meta.getWeak;
	var arrayFind         = _arrayMethods(5);
	var arrayFindIndex    = _arrayMethods(6);
	var id$1                = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function(that){
	  return that._l || (that._l = new UncaughtFrozenStore);
	};
	var UncaughtFrozenStore = function(){
	  this.a = [];
	};
	var findUncaughtFrozen = function(store, key){
	  return arrayFind(store.a, function(it){
	    return it[0] === key;
	  });
	};
	UncaughtFrozenStore.prototype = {
	  get: function(key){
	    var entry = findUncaughtFrozen(this, key);
	    if(entry)return entry[1];
	  },
	  has: function(key){
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function(key, value){
	    var entry = findUncaughtFrozen(this, key);
	    if(entry)entry[1] = value;
	    else this.a.push([key, value]);
	  },
	  'delete': function(key){
	    var index = arrayFindIndex(this.a, function(it){
	      return it[0] === key;
	    });
	    if(~index)this.a.splice(index, 1);
	    return !!~index;
	  }
	};

	var _collectionWeak = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      _anInstance(that, C, NAME, '_i');
	      that._i = id$1++;      // collection id
	      that._l = undefined; // leak store for uncaught frozen objects
	      if(iterable != undefined)_forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    _redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function(key){
	        if(!_isObject(key))return false;
	        var data = getWeak(key);
	        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
	        return data && _has(data, this._i) && delete data[this._i];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key){
	        if(!_isObject(key))return false;
	        var data = getWeak(key);
	        if(data === true)return uncaughtFrozenStore(this).has(key);
	        return data && _has(data, this._i);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var data = getWeak(_anObject(key), true);
	    if(data === true)uncaughtFrozenStore(that).set(key, value);
	    else data[that._i] = value;
	    return that;
	  },
	  ufstore: uncaughtFrozenStore
	};

	var es6_weakMap = createCommonjsModule(function (module) {
	'use strict';
	var each         = _arrayMethods(0)
	  , getWeak      = _meta.getWeak
	  , isExtensible = Object.isExtensible
	  , uncaughtFrozenStore = _collectionWeak.ufstore
	  , tmp          = {}
	  , InternalMap;

	var wrapper = function(get){
	  return function WeakMap(){
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	};

	var methods = {
	  // 23.3.3.3 WeakMap.prototype.get(key)
	  get: function get(key){
	    if(_isObject(key)){
	      var data = getWeak(key);
	      if(data === true)return uncaughtFrozenStore(this).get(key);
	      return data ? data[this._i] : undefined;
	    }
	  },
	  // 23.3.3.5 WeakMap.prototype.set(key, value)
	  set: function set(key, value){
	    return _collectionWeak.def(this, key, value);
	  }
	};

	// 23.3 WeakMap Objects
	var $WeakMap = module.exports = _collection('WeakMap', wrapper, methods, _collectionWeak, true, true);

	// IE11 WeakMap frozen keys fix
	if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
	  InternalMap = _collectionWeak.getConstructor(wrapper);
	  _objectAssign(InternalMap.prototype, methods);
	  _meta.NEED = true;
	  each(['delete', 'has', 'get', 'set'], function(key){
	    var proto  = $WeakMap.prototype
	      , method = proto[key];
	    _redefine(proto, key, function(a, b){
	      // store frozen objects on internal weakmap shim
	      if(_isObject(a) && !isExtensible(a)){
	        if(!this._f)this._f = new InternalMap;
	        var result = this._f[key](a, b);
	        return key == 'set' ? this : result;
	      // store all the rest on native weakmap
	      } return method.call(this, a, b);
	    });
	  });
	}
	});

	var weakMap$1 = _core.WeakMap;

	var weakMap = createCommonjsModule(function (module) {
	module.exports = { "default": weakMap$1, __esModule: true };
	});

	var _WeakMap = unwrapExports(weakMap);

	// 19.1.2.14 Object.keys(O)


	_objectSap('keys', function(){
	  return function keys(it){
	    return _objectKeys(_toObject(it));
	  };
	});

	var keys$1 = _core.Object.keys;

	var keys = createCommonjsModule(function (module) {
	module.exports = { "default": keys$1, __esModule: true };
	});

	var _Object$keys = unwrapExports(keys);

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = _freeGlobal || freeSelf || Function('return this')();

	var _root = root;

	/** Built-in value references. */
	var Symbol$1 = _root.Symbol;

	var _Symbol$1 = Symbol$1;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$1.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto$1.toString;

	/** Built-in value references. */
	var symToStringTag$1 = _Symbol$1 ? _Symbol$1.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
	      tag = value[symToStringTag$1];

	  try {
	    value[symToStringTag$1] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag$1] = tag;
	    } else {
	      delete value[symToStringTag$1];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$2 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$2.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString$1.call(value);
	}

	var _objectToString = objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]';
	var undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = _Symbol$1 ? _Symbol$1.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? _getRawTag(value)
	    : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	var _overArg = overArg;

	/** Built-in value references. */
	var getPrototype = _overArg(Object.getPrototypeOf, Object);

	var _getPrototype = getPrototype;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = _getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}

	var isPlainObject_1 = isPlainObject;

	/* eslint-disable */
	var global$2 = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};

	var EXPIRED = _Symbol('expired');
	var debug$5 = browser$1('LC:Expirable');

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
	      if (expired) debug$5('expired: ' + this._value);
	      return expired ? EXPIRED : this._value;
	    }
	  }]);

	  return Expirable;
	}();

	Expirable.EXPIRED = EXPIRED;

	var debug$6 = browser$1('LC:Cache');

	var Cache = function () {
	  function Cache() {
	    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'anonymous';

	    _classCallCheck(this, Cache);

	    this.name = name;
	    this._map = {};
	  }

	  Cache.prototype.get = function get(key) {
	    var cache = this._map[key];
	    if (cache) {
	      var value = cache.value;
	      if (value !== Expirable.EXPIRED) {
	        debug$6('[%s] hit: %s %O', this.name, key, value);
	        return value;
	      }
	      delete this._map[key];
	    }
	    debug$6('[' + this.name + '] missed: ' + key);
	    return null;
	  };

	  Cache.prototype.set = function set(key, value, ttl) {
	    debug$6('[%s] set: %s %O %d', this.name, key, value, ttl);
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





	var isIE10 = global$2.navigator && global$2.navigator.userAgent && global$2.navigator.userAgent.indexOf('MSIE 10.') !== -1;

	/* eslint-disable no-proto */

	/* eslint-enable no-proto */




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
	  if (!isPlainObject_1(obj)) return obj;
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
	var trim$1 = function trim(message) {
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



	// eslint-disable-next-line no-undef
	var isWeapp = (typeof wx === 'undefined' ? 'undefined' : _typeof(wx)) === 'object' && typeof wx.connectSocket === 'function';

	// throttle decorator

	var WebSocket$3 = global$2.WebSocket || global$2.MozWebSocket;

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

	var debug$4 = browser$1('LC:WebSocketPlus');

	var HEARTBEAT_TIME = 180000;
	var TIMEOUT_TIME = 380000;

	var DEFAULT_RETRY_STRATEGY = function DEFAULT_RETRY_STRATEGY(attempt) {
	  return Math.min(1000 * Math.pow(2, attempt), 300000);
	};

	var requireConnected = function requireConnected(target, name, descriptor) {
	  return _Object$assign({}, descriptor, {
	    value: function requireConnectedWrapper() {
	      var _descriptor$value;

	      if (!this.is('connected')) {
	        var currentState = this.current;
	        console.warn(name + ' should not be called when the connection is ' + currentState);
	        if (this.is('disconnected') || this.is('reconnecting')) {
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

	    if (typeof WebSocket$3 === 'undefined') {
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
	      _this.__postponeTimeoutTimer = _this._postponeTimeoutTimer.bind(_this);
	      if (global$2.addEventListener) {
	        _this.__pause = function () {
	          return _this.pause();
	        };
	        _this.__resume = function () {
	          return _this.resume();
	        };
	        global$2.addEventListener('offline', _this.__pause);
	        global$2.addEventListener('online', _this.__resume);
	      }
	      _this.open();
	    }).catch(_this.throw.bind(_this));
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
	          debug$4('connect [' + url + '] ' + protocol);
	          var ws = protocol ? new WebSocket$3(url, protocol) : new WebSocket$3(url);
	          ws.binaryType = _this2.binaryType || (global$2.Buffer ? 'nodebuffer' : 'arraybuffer');
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

	  // eslint-disable-next-line class-methods-use-this


	  WebSocketPlus.prototype.onbeforeevent = function onbeforeevent(event, from, to) {
	    for (var _len2 = arguments.length, payload = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
	      payload[_key2 - 3] = arguments[_key2];
	    }

	    debug$4.apply(undefined, [event + ': ' + from + ' -> ' + to].concat(payload));
	  };

	  WebSocketPlus.prototype.onopen = function onopen() {
	    this.emit('open');
	  };

	  WebSocketPlus.prototype.onconnected = function onconnected() {
	    this._startConnectionKeeper();
	  };

	  WebSocketPlus.prototype.onleaveconnected = function onleaveconnected(event, from, to) {
	    this._stopConnectionKeeper();
	    this._destroyWs();
	    if (to === 'offline' || to === 'disconnected') {
	      this.emit('disconnect');
	    }
	  };

	  WebSocketPlus.prototype.onpause = function onpause() {
	    this.emit('offline');
	  };

	  WebSocketPlus.prototype.onbeforeresume = function onbeforeresume() {
	    this.emit('online');
	  };

	  WebSocketPlus.prototype.onreconnect = function onreconnect() {
	    this.emit('reconnect');
	  };

	  WebSocketPlus.prototype.ondisconnected = function ondisconnected(event, from, to) {
	    var _this3 = this;

	    var attempt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	    var delay = DEFAULT_RETRY_STRATEGY.call(null, attempt);
	    debug$4('schedule attempt=' + attempt + ' delay=' + delay);
	    this.emit('schedule', attempt, delay);
	    if (this.__scheduledRetry) {
	      clearTimeout(this.__scheduledRetry);
	    }
	    this.__scheduledRetry = setTimeout(function () {
	      if (_this3.is('disconnected')) {
	        _this3.retry(attempt);
	      }
	    }, delay);
	  };

	  WebSocketPlus.prototype.onretry = function onretry(event, from, to) {
	    var _this4 = this;

	    var attempt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	    this.emit('retry', attempt);
	    this._createWs(this._getUrls, this._protocol).then(function () {
	      return _this4.can('reconnect') ? _this4.reconnect() : _this4._destroyWs();
	    }, function () {
	      return _this4.can('fail') && _this4.fail(attempt + 1);
	    });
	  };

	  WebSocketPlus.prototype.onerror = function onerror(event, from, to, error) {
	    this.emit('error', error);
	  };

	  WebSocketPlus.prototype.onclose = function onclose() {
	    if (global$2.removeEventListener) {
	      if (this.__pause) global$2.removeEventListener('offline', this.__pause);
	      if (this.__resume) global$2.removeEventListener('online', this.__resume);
	    }
	  };

	  // jsdoc-ignore-start


	  // jsdoc-ignore-end
	  WebSocketPlus.prototype._ping = function _ping() {
	    debug$4('ping');
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

	  WebSocketPlus.prototype._postponeTimeoutTimer = function _postponeTimeoutTimer() {
	    var _this5 = this;

	    debug$4('_postponeTimeoutTimer');
	    this._clearTimeoutTimers();
	    this._timeoutTimer = setTimeout(function () {
	      debug$4('timeout');
	      _this5.disconnect();
	    }, TIMEOUT_TIME);
	  };

	  WebSocketPlus.prototype._clearTimeoutTimers = function _clearTimeoutTimers() {
	    if (this._timeoutTimer) {
	      clearTimeout(this._timeoutTimer);
	    }
	  };

	  WebSocketPlus.prototype._startConnectionKeeper = function _startConnectionKeeper() {
	    debug$4('start connection keeper');
	    this._heartbeatTimer = setInterval(this._ping.bind(this), HEARTBEAT_TIME);
	    var addListener = this._ws.addListener || this._ws.addEventListener;
	    addListener.call(this._ws, 'message', this.__postponeTimeoutTimer);
	    addListener.call(this._ws, 'pong', this.__postponeTimeoutTimer);
	    this._postponeTimeoutTimer();
	  };

	  WebSocketPlus.prototype._stopConnectionKeeper = function _stopConnectionKeeper() {
	    debug$4('stop connection keeper');
	    // websockets/ws#489
	    var removeListener = this._ws.removeListener || this._ws.removeEventListener;
	    removeListener.call(this._ws, 'message', this.__postponeTimeoutTimer);
	    removeListener.call(this._ws, 'pong', this.__postponeTimeoutTimer);
	    this._clearTimeoutTimers();
	    if (this._heartbeatTimer) {
	      clearInterval(this._heartbeatTimer);
	    }
	  };

	  WebSocketPlus.prototype._handleClose = function _handleClose(event) {
	    debug$4('ws closed [' + event.code + '] ' + event.reason);
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
	    debug$4('send', data);
	    this._ws.send(data);
	  };

	  WebSocketPlus.prototype._handleMessage = function _handleMessage(event) {
	    debug$4('message', event.data);
	    this.handleMessage(event.data);
	  };

	  WebSocketPlus.prototype.handleMessage = function handleMessage(message) {
	    this.emit('message', message);
	  };

	  return WebSocketPlus;
	}(index$6), (_applyDecoratedDescriptor(_class.prototype, '_ping', [requireConnected], _Object$getOwnPropertyDescriptor(_class.prototype, '_ping'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'send', [requireConnected], _Object$getOwnPropertyDescriptor(_class.prototype, 'send'), _class.prototype)), _class);


	stateMachine.create({
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
	    to: 'disconnected'
	  }, {
	    name: 'retry',
	    from: 'disconnected',
	    to: 'reconnecting'
	  }, {
	    name: 'fail',
	    from: 'reconnecting',
	    to: 'disconnected'
	  }, {
	    name: 'reconnect',
	    from: 'reconnecting',
	    to: 'connected'
	  }, {
	    name: 'pause',
	    from: ['connected', 'disconnected', 'reconnecting'],
	    to: 'offline'
	  }, {}, {
	    name: 'resume',
	    from: 'offline',
	    to: 'disconnected'
	  }, {
	    name: 'close',
	    from: ['connected', 'disconnected', 'reconnecting', 'offline'],
	    to: 'closed'
	  }, {
	    name: 'throw',
	    from: '*',
	    to: 'error'
	  }]
	});

	// 19.1.2.5 Object.freeze(O)
	var meta     = _meta.onFreeze;

	_objectSap('freeze', function($freeze){
	  return function freeze(it){
	    return $freeze && _isObject(it) ? $freeze(meta(it)) : it;
	  };
	});

	var freeze$1 = _core.Object.freeze;

	var freeze = createCommonjsModule(function (module) {
	module.exports = { "default": freeze$1, __esModule: true };
	});

	var _Object$freeze = unwrapExports(freeze);

	var error$1 = _Object$freeze({
	  1000: {
	    name: 'CLOSE_NORMAL'
	  },
	  1006: {
	    name: 'CLOSE_ABNORMAL'
	  },
	  4100: {
	    name: 'APP_NOT_AVAILABLE',
	    message: 'App not exists or realtime message service is disabled.'
	  },
	  4103: {
	    name: 'INVALID_LOGIN',
	    message: 'Malformed clientId.'
	  },
	  4105: {
	    name: 'SESSION_REQUIRED',
	    message: 'Message sent before session opened. '
	  },
	  4107: {
	    name: 'READ_TIMEOUT'
	  },
	  4108: {
	    name: 'LOGIN_TIMEOUT'
	  },
	  4109: {
	    name: 'FRAME_TOO_LONG'
	  },
	  4110: {
	    name: 'INVALID_ORIGIN',
	    message: 'Access denied by domain whitelist.'
	  },
	  4111: {
	    name: 'SESSION_CONFLICT'
	  },
	  4112: {
	    name: 'SESSION_TOKEN_EXPIRED'
	  },
	  4200: {
	    name: 'INTERNAL_ERROR',
	    message: 'Internal error, please contact LeanCloud for support.'
	  },
	  4201: {
	    name: 'SEND_MESSAGE_TIMEOUT'
	  },
	  4302: {
	    name: 'CONVERSATION_SIGNATURE_FAILED'
	  },
	  4303: {
	    name: 'CONVERSATION_NOT_FOUND'
	  },
	  4304: {
	    name: 'CONVERSATION_FULL'
	  },
	  4305: {
	    name: 'CONVERSATION_REJECTED_BY_APP'
	  },
	  4306: {
	    name: 'CONVERSATION_UPDATE_FAILED'
	  },
	  4307: {
	    name: 'CONVERSATION_READ_ONLY'
	  },
	  4308: {
	    name: 'CONVERSATION_NOT_ALLOWED'
	  },
	  4401: {
	    name: 'INVALID_MESSAGING_TARGET'
	  },
	  4402: {
	    name: 'MESSAGE_REJECTED_BY_APP'
	  }
	});

	var ErrorCode = _Object$freeze(_Object$keys(error$1).reduce(function (result, code) {
	  return _Object$assign(result, _defineProperty({}, error$1[code].name, Number(code)));
	}, {}));

	var createError$3 = function createError(errorMessage) {
	  var code = errorMessage.code,
	      reason = errorMessage.reason,
	      appCode = errorMessage.appCode,
	      detail = errorMessage.detail;

	  var message = reason || detail;
	  if (!message && error$1[code]) {
	    message = error$1[code].message || error$1[code].name;
	  }
	  if (!message) {
	    message = 'Unknow Error: ' + code;
	  }
	  var err = new Error(message);
	  return _Object$assign(err, {
	    code: code, appCode: appCode, detail: detail
	  });
	};

	var debug$3 = browser$1('LC:Connection');

	var COMMAND_TIMEOUT = 20000;

	var Connection = function (_WebSocketPlus) {
	  _inherits(Connection, _WebSocketPlus);

	  function Connection(getUrl, _ref) {
	    var format = _ref.format,
	        version = _ref.version;

	    _classCallCheck(this, Connection);

	    debug$3('initializing Connection');
	    var protocolString = 'lc.' + format + '.' + version;
	    if (!isWeapp) {
	      var _this = _possibleConstructorReturn(this, _WebSocketPlus.call(this, getUrl, protocolString));
	    } else {
	      var _this = _possibleConstructorReturn(this, _WebSocketPlus.call(this, getUrl().then(function (urls) {
	        return urls.map(function (url) {
	          return '' + url + (url.indexOf('?') === -1 ? '?' : '&') + 'subprotocol=' + encodeURIComponent(protocolString);
	        });
	      })));
	    }
	    _this._protocalFormat = format;
	    _this._commands = {};
	    _this._serialId = 0;
	    return _possibleConstructorReturn(_this);
	  }

	  Connection.prototype.send = function send(command) {
	    var _this2 = this;

	    var waitingForRespond = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	    var serialId = void 0;
	    if (waitingForRespond) {
	      this._serialId += 1;
	      serialId = this._serialId;
	      command.i = serialId; // eslint-disable-line no-param-reassign
	    }
	    debug$3('↑ %O sent', trim$1(command));

	    var message = void 0;
	    if (this._protocalFormat === 'proto2base64') {
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
	          debug$3('✗ %O timeout', trim$1(command));
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
	      debug$3('↓ %O received', trim$1(message));
	    } catch (e) {
	      console.warn('Decode message failed', msg);
	    }
	    this.emit('allmessage', message);
	    var serialId = message.i;
	    if (serialId) {
	      if (this._commands[serialId]) {
	        if (message.cmd === CommandType.error) {
	          this._commands[serialId].reject(createError$3(message.errorMessage));
	        } else {
	          this._commands[serialId].resolve(message);
	        }
	        delete this._commands[serialId];
	      } else {
	        console.warn('Unexpected command received with serialId [' + serialId + '],\n         which have timed out or never been requested.');
	      }
	    } else if (message.cmd === CommandType.error) {
	      this.emit('error', createError$3(message.errorMessage));
	    } else {
	      this.emit('message', message);
	    }
	  };

	  Connection.prototype.ping = function ping() {
	    return this.send(new GenericCommand({
	      cmd: CommandType.echo
	    })).catch(function (error$$1) {
	      return debug$3('ping failed:', error$$1);
	    });
	  };

	  return Connection;
	}(WebSocketPlus);

	/* eslint-disable max-len */

	/**
	 * 插件接口
	 *
	 * <p>
	 * 插件是由一个或多个扩展点组成的字典。SDK 的扩展点可以分为两类：
	 * <p>
	 * 第一类扩展点是类实例化之后的回调，包括 <code>Realtime</code>、<code>IMClient</code> 与 <code>Conversation</code>。这些扩展点可以通过一个同步的 Decorator 进行扩展。Decorator 接受一个对应的实例并对其进行一些操作。
	 * 特别的，由于注册自定义消息类这个需求特别的常用，额外定义一个 messageClasses 扩展点来做这件事情。
	 * <p>
	 * 第二类扩展点是在某些事件处理前、后可以注入逻辑的点。
	 * 其中 <code>beforeMessageParse</code>，<code>afterMessageParse</code> 可以通过一个异步的 Middleware 进行扩展。Middleware 接受一个对象，返回一个同类型对象或同类型对象的 Promise。
	 * <code>beforeMessageDispatch</code> 可以通过返回一个 boolean 类型的 shouldDispatch 值来控制是否要继续派发收到的消息。
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
	 * @name Plugin.afterMessageParse
	 * @type Function
	 */

	/**
	 * 在收到消息之后，派发消息之前，控制是否派发这条消息。
	 * <p>
	 * 接受参数为 message 与 conversation。
	 * 该方法需要返回 boolean 类型的值，如果返回 false 则 SDK 不再派发这条消息，后续的 beforeMessageDispatch 也不会执行。
	 * 如果这个结果是异步得到的，也可以返回一个 Promise。
	 *
	 * @name Plugin.beforeMessageDispatch
	 * @type Function
	 * @since 3.4.0
	 */

	var applyDecorators = function applyDecorators(decorators, target) {
	  if (decorators) {
	    decorators.forEach(function (decorator) {
	      try {
	        decorator(target);
	      } catch (error) {
	        if (decorator._pluginName) {
	          error.message += '[' + decorator._pluginName + ']';
	        }
	        throw error;
	      }
	    });
	  }
	};



	var applyDispatcher = function applyDispatcher(dispatchers, payload) {
	  return ensureArray(dispatchers).reduce(function (resultPromise, dispatcher) {
	    return resultPromise.then(function (shouldDispatch) {
	      return shouldDispatch === false ? false : dispatcher.apply(undefined, _toConsumableArray(payload));
	    }).catch(function (error) {
	      if (dispatcher._pluginName) {
	        // eslint-disable-next-line no-param-reassign
	        error.message += '[' + dispatcher._pluginName + ']';
	      }
	      throw error;
	    });
	  }, _Promise.resolve(true));
	};

	var debug = browser$1('LC:Realtime');

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
	      noBinary: isWeapp,
	      ssl: true,
	      server: process.env.SERVER
	    }, options);
	    _this._cache = new Cache('endpoints');
	    internal(_this).clients = new _Set();
	    _this._plugins = [].concat(_toConsumableArray(ensureArray(Realtime.__preRegisteredPlugins)), _toConsumableArray(ensureArray(options.plugins))).reduce(function (result, plugin) {
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
	    // onRealtimeCreate hook
	    applyDecorators(_this._plugins.onRealtimeCreate, _this);
	    return _this;
	  }

	  Realtime.prototype._open = function _open() {
	    var _this2 = this;

	    if (this._openPromise) return this._openPromise;

	    var format = 'protobuf2';
	    if (this._options.noBinary) {
	      // 不发送 binary data，fallback to base64 string
	      format = 'proto2base64';
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
	      connection.on('open', function () {
	        return resolve(connection);
	      });
	      connection.on('error', reject);
	      connection.on('message', _this2._dispatchCommand.bind(_this2));
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
	      ['disconnect', 'reconnect', 'retry', 'schedule', 'offline', 'online'].forEach(function (event) {
	        return connection.on(event, function () {
	          for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
	            payload[_key] = arguments[_key];
	          }

	          debug(event + ' event emitted. %O', payload);
	          _this2.emit.apply(_this2, [event].concat(payload));
	          if (event !== 'reconnect') {
	            internal(_this2).clients.forEach(function (client) {
	              client.emit.apply(client, [event].concat(payload));
	            });
	          }
	        });
	      });
	      // override handleClose
	      connection.handleClose = function handleClose(event) {
	        var isFatal = [ErrorCode.APP_NOT_AVAILABLE, ErrorCode.INVALID_LOGIN, ErrorCode.INVALID_ORIGIN].some(function (errorCode) {
	          return errorCode === event.code;
	        });
	        if (isFatal) {
	          // in these cases, SDK should throw.
	          this.throw(createError$3(event));
	        } else {
	          // reconnect
	          this.disconnect();
	        }
	      };
	      internal(_this2).connection = connection;
	    }).catch(function (error$$1) {
	      delete _this2._openPromise;
	      throw error$$1;
	    });

	    return this._openPromise;
	  };

	  Realtime.prototype._getEndpoints = function _getEndpoints(options) {
	    var _this3 = this;

	    return _Promise.resolve(this._cache.get('endpoints') || this.constructor._fetchEndpointsInfo(options).then(tap(function (info) {
	      return _this3._cache.set('endpoints', info, info.ttl * 1000);
	    }))).then(function (info) {
	      debug('endpoint info: %O', info);
	      return [info.server, info.secondary];
	    });
	  };

	  Realtime._fetchPushRouter = function _fetchPushRouter(_ref) {
	    var appId = _ref.appId,
	        region = _ref.region;

	    debug('fetch router');
	    switch (region) {
	      case 'cn':
	        {
	          var cachedPushRouter = pushRouterCache.get(appId);
	          if (cachedPushRouter) {
	            return _Promise.resolve(cachedPushRouter);
	          }
	          return index$9.get('https://app-router.leancloud.cn/1/route', {
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
	    var appId = _ref2.appId,
	        region = _ref2.region,
	        ssl = _ref2.ssl,
	        server = _ref2.server;

	    debug('fetch endpoint info');
	    return this._fetchPushRouter({ appId: appId, region: region }).then(tap(debug)).then(function (router) {
	      return index$9.get('https://' + router + '/v1/route', {
	        params: {
	          appId: appId,
	          secure: ssl,
	          features: isWeapp ? 'wechat' : undefined,
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
	      throw new Error('retrying not allowed when not disconnected. the connection is now ' + connection.current);
	    }
	    return connection.retry();
	  };
	  /**
	   * 暂停，使 SDK 进入离线状态。
	   * 你可以在网络断开、应用进入后台等时刻调用该方法让 SDK 进入离线状态，离线状态下不会尝试重连。
	   * 在浏览器中 SDK 会自动监听网络变化，因此无需手动调用该方法。
	   *
	   * @since 3.4.0
	   * @see Realtime#event:offline
	   */


	  Realtime.prototype.pause = function pause() {
	    // 这个方法常常在网络断开、进入后台时被调用，此时 connection 可能没有建立或者已经 close。
	    // 因此不像 retry，这个方法应该尽可能 loose
	    var connection = internal(this).connection;
	    if (!connection) return;
	    if (connection.can('pause')) connection.pause();
	  };
	  /**
	   * 恢复在线状态。
	   * 你可以在网络恢复、应用回到前台等时刻调用该方法让 SDK 恢复在线状态，恢复在线状态后 SDK 会开始尝试重连。
	   *
	   * @since 3.4.0
	   * @see Realtime#event:online
	   */


	  Realtime.prototype.resume = function resume() {
	    // 与 pause 一样，这个方法应该尽可能 loose
	    var connection = internal(this).connection;
	    if (!connection) return;
	    if (connection.can('resume')) connection.resume();
	  };

	  Realtime.prototype._register = function _register(client) {
	    internal(this).clients.add(client);
	  };

	  Realtime.prototype._deregister = function _deregister(client) {
	    internal(this).clients.delete(client);
	    if (internal(this).clients.size === 0) {
	      this._close();
	    }
	  };

	  Realtime.prototype._dispatchCommand = function _dispatchCommand(command) {
	    return applyDispatcher(this._plugins.beforeCommandDispatch, [command, this]).then(function (shouldDispatch) {
	      // no plugin handled this command
	      if (shouldDispatch) return debug('[WARN] Unexpected message received: %O', trim$1(command));
	      return false;
	    });
	  };

	  return Realtime;
	}(index$6);

	exports.Protocals = message;
	exports.Promise = _Promise;
	exports.EventEmitter = index$6;
	exports.Realtime = Realtime;
	exports.ErrorCode = ErrorCode;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=realtime-core.weapp.js.map