export function noop() {}

// 检查是否是 JSON 格式的字符串
export function isJSONString(obj) {
  return /^\{.*\}$/.test(obj);
}

// 获取当前时间的时间戳
export function now() {
  return new Date().getTime();
}

// HTML 转义
export function encodeHTML(source) {
  var encodeHTML = function(str) {
    if (typeof(str) === 'string') {
      return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
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
  if (typeof(source) === 'object') {
    for (var key in source) {
      source[key] = tool.encodeHTML(source[key]);
    }
    return source;
  } else {
    // 非对象类型
    return encodeHTML(source);
  }
}
