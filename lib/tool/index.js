'use strict';

var tool = {};

tool.ajax = require('./ajax');
tool.extend = require('./extend');
// 小型的私有事件中心
tool.eventCenter = require('./eventcenter');

// 空函数
tool.noop = function () {};

// 检查是否是 JSON 格式的字符串
tool.isJSONString = function (obj) {
  return (/^\{.*\}$/.test(obj)
  );
};

// 获取当前时间的时间戳
tool.now = function () {
  return new Date().getTime();
};

// HTML 转义
tool.encodeHTML = function (source) {
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
  if (typeof source === 'object') {
    for (var key in source) {
      source[key] = tool.encodeHTML(source[key]);
    }
    return source;
  } else {
    // 非对象类型
    return encodeHTML(source);
  }
};

module.exports = tool;
