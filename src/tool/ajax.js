import { XMLHttpRequest } from 'leancloud-xmlhttprequest';
export const  ajax = (options, callback) => {
  if (typeof options === 'string') {
    options = {
      url: options
    };
  }
  var url = options.url;
  var method = options.method || 'get';
  var xhr = new XMLHttpRequest();

  xhr.open(method, url);

  xhr.onload = function(data) {
    if ((xhr.status >= 200 && xhr.status < 300)) {
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
