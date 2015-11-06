'use strict';
module.exports = function(options, callback) {
  if (typeof options === 'string') {
    options = {
      url: options
    };
  }
  var url = options.url;
  var method = options.method || 'get';
  var XMLHttpRequest = require('./xmlhttprequest').XMLHttpRequest;
  var xhr = new XMLHttpRequest();

  // 浏览器兼容，IE8+
  if (global.XDomainRequest) {
    xhr = new global.XDomainRequest();
  }

  xhr.open(method, url);

  xhr.onload = function(data) {
    if ((xhr.status >= 200 && xhr.status < 300) || (global.XDomainRequest && !xhr.status)) {
      callback(null, JSON.parse(xhr.responseText));
    } else {
      callback(JSON.parse(xhr.responseText));
    }
  };

  xhr.onerror = function(data) {
    callback(data || {});
    throw new Error('Network error.');
  };

  // IE9 中需要设置所有的 xhr 事件回调，不然可能会无法执行后续操作
  xhr.onprogress = function() {};
  xhr.ontimeout = function() {};
  xhr.timeout = 0;

  var body = JSON.stringify(options.data);

  xhr.send(body);

};
