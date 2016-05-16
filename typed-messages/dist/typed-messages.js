(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.AV = global.AV || {})));
}(this, function (exports) { 'use strict';

    var babelHelpers = {};
    babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };
    babelHelpers;


    var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
    function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

    /* global AV */
    var Storage = void 0;
    if ((typeof AV === 'undefined' ? 'undefined' : babelHelpers.typeof(AV)) === 'object' && AV.File) {
      Storage = AV;
    } else if (typeof require === 'function') {
      try {
        Storage = require('avoscloud-sdk'); // eslint-disable-line
      } catch (e) {
        throw new Error('peerDependency \'avoscloud-sdk\' not found, install it first');
      }
    } else {
      throw new Error('detect AV failed, import LeanCloud Storage SDK first');
    }

    var File = Storage.File;
    var GeoPoint = Storage.GeoPoint;

    /* global AV */
    var Realtime = void 0;
    if ((typeof AV === 'undefined' ? 'undefined' : babelHelpers.typeof(AV)) === 'object' && AV.TypedMessage) {
      Realtime = AV;
    } else if (typeof require === 'function') {
      try {
        Realtime = require('leancloud-realtime'); // eslint-disable-line
      } catch (e) {
        throw new Error('peerDependency \'leancloud-realtime\' not found, install it first');
      }
    } else {
      throw new Error('AV.Realtime not exists, import LeanCloud Realtime SDK first');
    }

    var TypedMessage = Realtime.TypedMessage;
    var messageType = Realtime.messageType;
    var messageField = Realtime.messageField;

    var inherit$1 = __commonjs(function (module, exports, global) {
    /**
     * @module inherit
     * @version 2.2.3
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

    if(typeof modules === 'object') {
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

    })(__commonjs_global);
    });

    var require$$0 = (inherit$1 && typeof inherit$1 === 'object' && 'default' in inherit$1 ? inherit$1['default'] : inherit$1);

    var index = __commonjs(function (module) {
    /*!
     * node-inherit
     * Copyright(c) 2011 Dmitry Filatov <dfilatov@yandex-team.ru>
     * MIT Licensed
     */

    module.exports = require$$0;
    });

    var inherit = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

    var FileMessage = inherit(TypedMessage, /** @lends FileMessage.prototype */{
      /**
       * 需要安装 [leancloud-realtime-typed-messages]{@link https://www.npmjs.com/package/leancloud-realtime-typed-messages} package
       * @constructs
       * @extends TypedMessage
       * @param  {AV.File} file LeanCloud 存储 SDK 中的 AV.File 实例，且必须是已经保存到服务端上的 File 实例
       * （如果是刚刚创建的，必须 save 后才能用于创建 FileMessage）
       */

      __constructor: function __constructor(file) {
        if (!(file instanceof File)) {
          throw new TypeError('file must be an AV.File');
        }
        if (typeof file.id !== 'string') {
          throw new Error('file must be saved before used to create a Message');
        }
        this.__base();
        this._file = file;
        this._lcfile = {
          objId: file.id,
          url: file._url,
          metaData: Object.assign(file._metaData || {}, {
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
        var file = File.createWithoutData(id);
        file._url = data._lcfile.url;
        file._metaData = data._lcfile.metaData;
        if (data._lcfile.metaData) {
          file._name = data._lcfile.metaData.name;
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
    messageType(-6)(FileMessage);
    messageField('_lcfile')(FileMessage);

    /**
     * 需要安装 [leancloud-realtime-typed-messages]{@link https://www.npmjs.com/package/leancloud-realtime-typed-messages} package
     * 构造方法参数同 {@link FileMessage}
     * @class
     * @extends FileMessage
     */
    var ImageMessage = inherit(FileMessage);

    /**
     * @name TYPE
     * @memberof ImageMessage
     * @type Number
     * @static
     * @const
     */
    messageType(-2)(ImageMessage);

    /**
     * 需要安装 [leancloud-realtime-typed-messages]{@link https://www.npmjs.com/package/leancloud-realtime-typed-messages} package
     * 构造方法参数同 {@link FileMessage}
     * @class
     * @extends FileMessage
     */
    var AudioMessage = inherit(FileMessage);

    /**
     * @name TYPE
     * @memberof AudioMessage
     * @type Number
     * @static
     * @const
     */
    messageType(-3)(AudioMessage);

    /**
     * 需要安装 [leancloud-realtime-typed-messages]{@link https://www.npmjs.com/package/leancloud-realtime-typed-messages} package
     * 构造方法参数同 {@link FileMessage}
     * @class
     * @extends FileMessage
     */
    var VideoMessage = inherit(FileMessage);

    /**
     * @name TYPE
     * @memberof VideoMessage
     * @type Number
     * @static
     * @const
     */
    messageType(-4)(VideoMessage);

    var LocationMessage = inherit(TypedMessage, /** @lends LocationMessage.prototype */{
      /**
       * 需要安装 [leancloud-realtime-typed-messages]{@link https://www.npmjs.com/package/leancloud-realtime-typed-messages} package
       * @constructs
       * @extends TypedMessage
       * @param  {AV.GeoPoint} geoPoint LeanCloud 存储 SDK 中的 AV.GeoPoint 实例
       */

      __constructor: function __constructor(geoPoint) {
        if (!(geoPoint instanceof GeoPoint)) {
          throw new TypeError('geoPoint must be an AV.GeoPoint');
        }
        this.__base();
        this._geoPoint = geoPoint;
        var latitude = geoPoint.latitude;
        var longitude = geoPoint.longitude;

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
        var _json$_lcloc = json._lcloc;
        var latitude = _json$_lcloc.latitude;
        var longitude = _json$_lcloc.longitude;

        var geoPoint = new GeoPoint({ latitude: latitude, longitude: longitude });
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
    messageType(-5)(LocationMessage);
    messageField('_lcloc')(LocationMessage);

    exports.FileMessage = FileMessage;
    exports.ImageMessage = ImageMessage;
    exports.AudioMessage = AudioMessage;
    exports.VideoMessage = VideoMessage;
    exports.LocationMessage = LocationMessage;

}));
//# sourceMappingURL=typed-messages.js.map