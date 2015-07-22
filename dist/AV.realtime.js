(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],2:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? (this || self)
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(err || new_err, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":3,"reduce":4}],3:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],4:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],5:[function(require,module,exports){
(function (global){
var AV = global.AV = global.AV || {};
AV.realtime = require('./realtime');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./realtime":6}],6:[function(require,module,exports){
(function (global){
/**
 * @author wangxiao
 * @date 2015-05-25
 * @homepage http://github.com/leancloud/js-realtime-sdk/
 *
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 */

var request = require('superagent');
var extend = require('extend');

// 当前版本
var VERSION = '2.2.0';

// 配置项
var config = {
    // 心跳时间（一分钟）
    heartbeatsTime: 60 * 1000,
    WebSocket: undefined
};

if (typeof window !== 'undefined' && typeof window.WebSocket !== 'undefined') {
    config.WebSocket = window.WebSocket;
}

// 命名空间，挂载一些工具方法
var tool = {};

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
    join: 'join',
    // conversation 成员离开
    left: 'left',
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
var newConvObject = function(cache) {

    var addOrRemove = function(cid, argument, callback, cmd) {
        var members = [];
        var options;
        var fun;
        var eventName;

        // 传入 userId
        if (typeof argument === 'string') {
            members.push(argument);
        }
        // 传入多个 userId
        else {
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
        fun = function(data) {
            if (data.i === options.serialId) {
                if (callback) {
                    callback(data);
                }
                cache.ec.off(eventName, fun);
            }
        };
        cache.ec.on(eventName, fun);
        return this;
    };

    return {
        // cid 即 conversation id
        id: '',
        // 创建 Conversation 时的默认属性
        attr: {},
        add: function(argument, callback) {
            addOrRemove(this.id, argument, callback, 'add');
            return this;
        },
        remove: function(argument, callback) {
            addOrRemove(this.id, argument, callback, 'remove');
            return this;
        },
        // 自己加入
        join: function(callback) {
            this.add(cache.options.peerId, callback);
            return this;
        },
        // 自己离开
        leave: function(callback) {
            this.remove(cache.options.peerId, callback);
            return this;
        },
        send: function(data, argument1, argument2) {
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
                var fun = function(data) {
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
        log: function(argument, callback) {
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
            var fun = function(data) {
                if (data.i === options.serialId) {
                    if (callback) {
                        // 对查出的类型进行过滤，兼容多端通信
                        for (var i = 0, l = data.logs.length; i < l; i++) {
                            data.logs[i].data = engine.getMediaMsg(cache, data.logs[i].data);
                            // 增加字段，兼容接收消息的字段
                            data.logs[i].fromPeerId = data.logs[i].from;
                            data.logs[i].msg = data.logs[i].data;
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
        receive: function(callback) {
            var id = this.id;
            cache.ec.on(eNameIndex.message, function(data) {
                // 是否是当前 room 的信息
                if (id === data.cid) {
                    callback(data);
                }
            });
            return this;
        },
        // 获取信息回执
        receipt: function(callback) {
            var id = this.id;
            cache.ec.on(eNameIndex.receipt, function(data) {
                // 是否是当前 room 的信息
                if (id === data.cid) {
                    callback(data);
                }
            });
            return this;
        },
        list: function(callback) {
            var options = {};
            var id = this.id;
            options.where = {
                m: cache.options.peerId,
                objectId: id
            };
            options.serialId = engine.getSerialId(cache);
            var fun = function(data) {
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
        count: function(callback) {
            var id = this.id;
            var options = {
                cid: id,
                serialId: engine.getSerialId(cache)
            };
            var fun = function(data) {
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
        update: function(data, callback) {
            var id = this.id;
            var options = {
                cid: id,
                data: data,
                serialId: engine.getSerialId(cache)
            };
            var fun = function(data) {
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
var newRealtimeObject = function() {

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
        open: function(callback) {
            var me = this;
            var cache = this.cache;
            cache.closeFlag = false;
            engine.getServer(cache, cache.options, function(data) {
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
            cache.ec.once(eNameIndex.reuse, function() {
                if (cache.reuseTimer) {
                    clearTimeout(cache.reuseTimer);
                }
                cache.reuseTimer = setTimeout(function() {
                    me.open();
                }, 5000);
            });
            return this;
        },
        // 表示关闭当前的 session 连接和 WebSocket 连接，并且回收内存
        close: function() {
            var cache = this.cache;
            if (!cache.openFlag) {
                throw new Error('Must call after open() has successed.');
            }
            cache.closeFlag = true;
            engine.closeSession(cache);
            cache.ws.close();
            return this;
        },
        on: function(eventName, callback) {
            this.cache.ec.on(eventName, callback);
            return this;
        },
        once: function(eventName, callback) {
            this.cache.ec.once(eventName, callback);
            return this;
        },
        emit: function(eventName, data) {
            this.cache.ec.emit(eventName, data);
            return this;
        },
        off: function(eventName, callback) {
            this.cache.ec.off(eventName, callback);
            return this;
        },
        room: function(argument, callback) {
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
                }, function(data) {

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
                        }
                        // 如果服务器端不存在这个 room id
                        else {
                            callback(null);
                        }
                    }
                });
            }
            // 传入 options
            else {
                // 如果没有传入参数，则给一个错误提示
                if (!argument) {
                    throw new Error('Createing room must have a callback function.');
                }

                var options;

                // 只传入 callback
                if (typeof argument === 'function') {
                    callback = argument;
                }
                // 传入参数
                else {
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
                    serialId: engine.getSerialId(cache)
                };

                convObject = newConvObject(cache);

                engine.startConv(cache, options, callback);

                // 服务器端确认收到对话创建，并创建成功
                var fun = function(data) {
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
        conv: function() {
            return this.room.apply(this, arguments);
        },
        // 相关查询，包括用户列表查询，房间查询等
        query: function(argument, callback) {
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
            var fun = function(data) {
                if (data.i === options.serialId) {
                    if (callback) {
                        callback(data.results);
                    }
                    cache.ec.off('conv-results', fun);
                }
            };
            cache.ec.on('conv-results', fun);
            engine.convQuery(cache, options);
            return this;
        },
        // 判断用户是否在线
        ping: function(argument, callback) {
            var cache = this.cache;
            if (!cache.openFlag) {
                throw new Error('Must call after open() has successed.');
            }
            if (!callback) {
                throw new Error('Ping must have callback.');
            }
            var peerIdList = [];
            // 传入一个 id
            if (typeof(argument) === 'string') {
                peerIdList.push(argument);
            }
            // 传入的是数组
            else {
                peerIdList = argument;
            }
            var options = {
                serialId: engine.getSerialId(cache),
                peerIdList: peerIdList
            };
            var fun = function(data) {
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
var realtime = function(options, callback) {
    if (typeof options !== 'object') {
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
            secure: typeof(options.secure) === 'undefined' ? secure : options.secure,
            // 服务器地区选项，默认为中国大陆
            region: options.region || 'cn'
        };

        var realtimeObj = newRealtimeObject();
        realtimeObj.clientId = options.clientId;
        realtimeObj.cache.options = options;
        realtimeObj.cache.ec = tool.eventCenter();
        realtimeObj.cache.authFun = options.auth;
        realtimeObj.open(callback);

        return realtimeObj;
    }
};

// 赋值版本号
realtime.version = VERSION;

// 挂载私有方法
realtime._tool = tool;
realtime._engine = engine;

realtime.config = function(newConfig) {
    extend(config, newConfig);
};

// WebSocket Open
engine.wsOpen = function(cache) {
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
engine.wsClose = function(cache, event) {
    // 派发全局 close 事件，表示 realtime 已经关闭
    cache.ec.emit(eNameIndex.close, event);
};

// WebSocket Message
engine.wsMessage = function(cache, msg) {
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

engine.wsError = function(cache, data) {
    cache.ec.emit(eNameIndex.error, data);
    throw (data);
};

// WebSocket send message
engine.wsSend = function(cache, data) {
    if (!cache.closeFlag) {
        if (!cache.ws) {
            throw new Error('The realtimeObject must opened first. Please listen to the "open" event.');
        } else {
            data.peerId = cache.options.peerId;
            cache.ws.send(JSON.stringify(data));
        }
    }
};

engine.createSocket = function(cache, server) {
    if (cache.ws) {
        cache.ws.close();
    }
    var ws = new config.WebSocket(server);
    cache.ws = ws;
    ws.addEventListener('open', function() {
        engine.wsOpen(cache);
    });
    ws.addEventListener('close', function(event) {
        engine.wsClose(cache, event);
    });
    ws.addEventListener('message', function(msg) {
        engine.wsMessage(cache, msg);
    });
    ws.addEventListener('error', function(data) {
        engine.wsError(cache, data);
    });
};

// 心跳程序
engine.heartbeats = function(cache) {

    // 当前 RealtimeObject 已经启动心跳程序
    if (cache.openFlag) {
        return;
    }

    var timer;
    cache.ws.addEventListener('message', function() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            cache.ws.send("{}");
        }, config.heartbeatsTime);
    });
};

// 守护进程，会派发 reuse 重连事件
engine.guard = function(cache) {

    // 当前 RealtimeObject 已经启动守护进程
    if (cache.openFlag) {
        return;
    }

    // 超时是三分钟
    var timeLength = 3 * 60 * 1000;
    var timer;

    // 结合心跳事件，如果长时间没有收到服务器的心跳，也要触发重连机制
    cache.ws.addEventListener('message', function() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            if (!cache.closeFlag && !cache.reuseFlag) {
                cache.reuseFlag = true;
                // 超时则派发重试事件
                cache.ec.emit(eNameIndex.reuse);
            }
        }, timeLength);
    });

    // 监测断开事件
    cache.ec.on(eNameIndex.close + ' ' + 'session-closed', function() {
        if (!cache.closeFlag && !cache.reuseFlag) {
            cache.reuseFlag = true;
            cache.ec.emit(eNameIndex.reuse);
        }
    });
};

engine.connect = function(cache, options) {
    var server = options.server;
    // 判断获取出缓存的时间是否是比较新的
    if (server && tool.now() <= server.expires) {
        engine.createSocket(cache, server.server);
    } else {
        cache.ec.emit(eNameIndex.error);
        throw new Error('WebSocket connet failed.');
    }
};

engine.getServer = function(cache, options, callback) {
    var appId = options.appId;
    // 是否获取 wss 的安全链接
    var secure = options.secure;
    var url = '';
    var protocol = 'http://';
    if (global.location && global.location.protocol === 'https:' && secure) {
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
    url = protocol + 'router-' + node + '-push.leancloud.cn/v1/route?_t=' + tool.now() + '&appId=' + appId;
    if (secure) {
        url += '&secure=1';
    }
    request.get(url).end(function(error, response) {
        if (response.ok) {
            var data = response.body;
            data.expires = tool.now() + data.ttl * 1000;
            cache.server = data;
            callback(data);
        } else {
            cache.ec.emit(eNameIndex.error);
        }
    });
};

// 打开 session
engine.openSession = function(cache, options) {
    var cmd = {
        cmd: 'session',
        op: 'open',
        appId: cache.options.appId,
        ua: 'js/' + VERSION,
        i: options.serialId
    };
    if (cache.authFun) {
        cache.authFun({
            clientId: cache.options.peerId
        }, function(authResult) {
            if (authResult && authResult.signature) {
                cmd.n = authResult.nonce;
                cmd.t = authResult.timestamp;
                cmd.s = authResult.signature;
                engine.wsSend(cache, cache.cmd);
            } else {
                throw new Error('Session open denied by application: ' + authResult);
            }
        });
    } else {
        engine.wsSend(cache, cmd);
    }
};

engine.closeSession = function(cache) {
    engine.wsSend(cache, cache, {
        cmd: 'session',
        op: 'close'
    });
};

engine.startConv = function(cache, options) {
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
        // 是否是开放聊天室，无人数限制
        transient: options.transient || false
    };
    if (cache.authFun) {
        cache.authFun({
            clientId: cache.options.peerId,
            members: options.members
        }, function(authResult) {
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

engine.convAdd = function(cache, options) {
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
        }, function(authResult) {
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

engine.convRemove = function(cache, options) {
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
        }, function(authResult) {
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

engine.send = function(cache, options) {
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

engine.convQuery = function(cache, options) {
    options = options || {};
    engine.wsSend(cache, {
        cmd: 'conv',
        op: 'query',
        // where 可选，对象，默认为包含自己的查询 {"m": peerId}
        where: options.where || {
            m: cache.options.peerId
                // conversation 的 id
                // objectId: options.cid
        },
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
engine.querySession = function(cache, options) {
    engine.wsSend(cache, {
        cmd: 'session',
        op: 'query',
        i: options.serialId,
        sessionPeerIds: options.peerIdList
    });
};

// 查询 conversation 的聊天记录
engine.convLog = function(cache, options) {
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

engine.convUpdate = function(cache, options) {
    engine.wsSend(cache, {
        cmd: 'conv',
        op: 'update',
        cid: options.cid,
        // attr 要修改的内容
        attr: options.data,
        i: options.serialId
    });
};

engine.convAck = function(cache, options) {
    engine.wsSend(cache, {
        cmd: 'ack',
        cid: options.cid,
        mid: options.mid
    });
};

engine.convCount = function(cache, options) {
    engine.wsSend(cache, {
        cmd: 'conv',
        op: 'count',
        i: options.serialId,
        cid: options.cid
    });
};

// 取出多媒体类型的格式（内置 HTML 转义逻辑）
engine.getMediaMsg = function(cache, msg) {

    // 检查是否是 JSON 格式的一个 String 类型
    if (!tool.isJSONString(msg)) {

        // 是否对消息中的 HTML 进行转义
        if (cache.options.encodeHTML) {
            msg = tool.encodeHTML(msg);
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
        obj.text = tool.encodeHTML(msg._lctext);
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
            break;
        case -6:
            obj.type = 'file';
            break;
    }
    return obj;
};

// 生成多媒体特定格式的数据
engine.setMediaMsg = function(cache, type, data) {
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
engine.getSerialId = function(cache) {
    cache.serialId++;
    if (cache.serialId > 999999) {
        cache.serialId = 2015;
    }
    return cache.serialId;
};

// 绑定所有服务返回事件
engine.bindEvent = function(cache) {

    // RealtimeObject 已经初始化过，不再重复绑定事件
    if (cache.openFlag) {
        return;
    }

    cache.ec.on('session-opened', function(data) {
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

    cache.ec.on('session-error', function(data) {
        cache.ec.emit(eNameIndex.error, data);
    });

    // 服务器端确认收到 conversation 创建，并创建成功
    // 在创建时已经做绑定，所以注释掉
    // cache.ec.on('conv-started', function(data) {});

    // 服务器端发给客户端，表示当前用户加入了某个对话。包括创建对话、或加入对话
    cache.ec.on('conv-joined', function(data) {
        // 不是当前用户自己加入
        if (data.peerId !== data.initBy) {
            cache.ec.emit(eNameIndex.join, data);
        }
    });

    // 服务器端发给客户端，表示当前用户离开了某个对话，不再能收到对话的消息
    cache.ec.on('conv-left', function(data) {
        cache.ec.emit(eNameIndex.left, data);
    });

    // 服务器端发给客户端，表示当前对话有新人加入
    cache.ec.on('conv-members-joined', function(data) {
        cache.ec.emit(eNameIndex.join, data);
    });

    // 服务器端发给客户端，表示当前对话有新人离开
    cache.ec.on('conv-members-left', function(data) {
        cache.ec.emit(eNameIndex.left, data);
    });

    // 服务器端回复。表示 add 操作完成
    // 因为 added 之后也会触发 members-joined，所以注释掉
    // cache.ec.on('conv-added', function(data) {});

    // 服务器端确认删除成功
    // 因为 removed 之后也会触发 members-removed，所以注释掉
    // cache.ec.on('conv-removed', function() {});

    cache.ec.on('conv-error', function(data) {
        cache.ec.emit(eNameIndex.error, data);
        throw (data.code + ':' + data.reason);
    });

    // 查询对话的结果
    // cache.ec.on('conv-results', function(data) {});

    // cache.ec.on('conv-updated', function(data) {});

    cache.ec.on('direct', function(data) {

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
    cache.ec.on('rcp', function(data) {
        cache.ec.emit(eNameIndex.receipt, data);
    });

    // cache.ec.on('ack', function(data) {});

    // 用户可以获取自己所在对话的历史记录
    // cache.ec.on('logs', function(data) {});
};

// 空函数
tool.noop = function() {};

// 检查是否是 JSON 格式的字符串
tool.isJSONString = function(obj) {
    return /^\{.*\}$/.test(obj);
};

// 获取当前时间的时间戳
tool.now = function() {
    return new Date().getTime();
};

// HTML 转义
tool.encodeHTML = function(source) {
    var encodeHTML = function(str) {
        if (typeof(str) === 'string') {
            return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            // 考虑到其中有可能是 JSON，所以不做 HTML 强过滤，仅对标签过滤
            // .replace(/\\/g,'&#92;')
            // .replace(/"/g,'&quot;')
            // .replace(/'/g,'&#39;');
        }
        // 数字
        else {
            return str;
        }
    };

    // 对象类型
    if (typeof(source) === 'object') {
        for (var key in source) {
            source[key] = tool.encodeHTML(source[key]);
        }
        return source;
    }
    // 非对象类型
    else {
        return encodeHTML(source);
    }
};

// 小型的私有事件中心
tool.eventCenter = function() {
    var eventList = {};
    var eventOnceList = {};

    var _on = function(eventName, fun, options) {
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
                        if ((itemEventList[m]).toString() === (fun).toString()) {
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

    var _off = function(eventName, fun, options) {
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
        on: function(eventName, fun) {
            _on(eventName, fun);
            return this;
        },

        // 方法绑定以后只会运行一次
        once: function(eventName, fun) {
            _on(eventName, fun, {
                once: true
            });
            return this;
        },

        // 同一个方法只会被绑定一次
        _one: function(eventName, fun) {
            _on(eventName, fun, {
                single: true
            });
        },
        emit: function(eventName, data) {
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
        off: function(eventName, fun) {
            _off(eventName, fun);
            return this;
        }
    };
};

if (typeof exports !== 'undefined') {
    // CommonJS 支持
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = realtime;
    }
    exports.realtime = realtime;
} else if (typeof define === 'function' && define.amd) {
    // AMD 支持
    define('AV/realtime', [], function() {
        return realtime;
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"extend":1,"superagent":2}]},{},[5,6]);
