(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var AV = global.AV = global.AV || {};
AV.realtime = require('./realtime');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./realtime":2}],2:[function(require,module,exports){
(function (global){
/**
 * @author wangxiao liye
 * @see http://github.com/leancloud/js-realtime-sdk/
 *
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 */

'use strict';

var tool = require('./tool');
var ajax = tool.ajax;
var extend = tool.extend;

// 当前版本
var VERSION = '2.4.0';

// 配置项
var config = {
  // 心跳时间（一分钟）
  heartbeatsTime: 60 * 1000,
  // ws 在 browserify 打包时会使用浏览器内置的 WebSocket 实现
  WebSocket: require('ws')
};

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
  // deprecated
  join: 'join',
  // conversation 成员离开
  // deprecated
  left: 'left',
  // 当前用户被加入会话
  invited: 'invited',
  // 当前用户被踢出会话
  kicked: 'kicked',
  // 用户加入会话
  membersjoined: 'membersjoined',
  // 用户离开会话
  membersleft: 'membersleft',
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
var newConvObject = function newConvObject(cache) {

  var addOrRemove = function addOrRemove(cid, argument, callback, cmd) {
    var members = [];
    var options;
    var fun;
    var eventName;

    // 传入 userId
    if (typeof argument === 'string') {
      members.push(argument);
    } else {
      // 传入多个 userId
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
    fun = function (data) {
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
    add: function add(argument, callback) {
      addOrRemove(this.id, argument, callback, 'add');
      return this;
    },
    remove: function remove(argument, callback) {
      addOrRemove(this.id, argument, callback, 'remove');
      return this;
    },
    // 自己加入
    join: function join(callback) {
      this.add(cache.options.peerId, callback);
      return this;
    },
    // 自己离开
    leave: function leave(callback) {
      this.remove(cache.options.peerId, callback);
      return this;
    },
    send: function send(data, argument1, argument2) {
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
        var fun = function fun(data) {
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
    log: function log(argument, callback) {
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
      var fun = function fun(data) {
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
    receive: function receive(callback) {
      var id = this.id;
      cache.ec.on(eNameIndex.message, function (data) {
        // 是否是当前 room 的信息
        if (id === data.cid) {
          callback(data);
        }
      });
      return this;
    },
    // 获取信息回执
    receipt: function receipt(callback) {
      var id = this.id;
      cache.ec.on(eNameIndex.receipt, function (data) {
        // 是否是当前 room 的信息
        if (id === data.cid) {
          callback(data);
        }
      });
      return this;
    },
    list: function list(callback) {
      var options = {};
      var id = this.id;
      options.where = {
        objectId: id
      };
      options.serialId = engine.getSerialId(cache);
      var fun = function fun(data) {
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
    count: function count(callback) {
      var id = this.id;
      var options = {
        cid: id,
        serialId: engine.getSerialId(cache)
      };
      var fun = function fun(data) {
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
    update: function update(data, callback) {
      var id = this.id;
      var options = {
        cid: id,
        data: data,
        serialId: engine.getSerialId(cache)
      };
      var fun = function fun(data) {
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
var newRealtimeObject = function newRealtimeObject() {

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
    open: function open(callback) {
      var me = this;
      var cache = this.cache;
      cache.closeFlag = false;
      engine.getServer(cache, cache.options, function (data) {
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
      cache.ec.once(eNameIndex.reuse, function () {
        if (cache.reuseTimer) {
          clearTimeout(cache.reuseTimer);
        }
        cache.reuseTimer = setTimeout(function () {
          me.open();
        }, 5000);
      });
      return this;
    },
    // 表示关闭当前的 session 连接和 WebSocket 连接，并且回收内存
    close: function close() {
      var cache = this.cache;
      if (!cache.openFlag) {
        throw new Error('Must call after open() has successed.');
      }
      cache.closeFlag = true;
      engine.closeSession(cache);
      cache.ws.close();
      return this;
    },
    on: function on(eventName, callback) {
      this.cache.ec.on(eventName, callback);
      return this;
    },
    once: function once(eventName, callback) {
      this.cache.ec.once(eventName, callback);
      return this;
    },
    emit: function emit(eventName, data) {
      this.cache.ec.emit(eventName, data);
      return this;
    },
    off: function off(eventName, callback) {
      this.cache.ec.off(eventName, callback);
      return this;
    },
    room: function room(argument, callback) {
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
        }, function (data) {

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
            } else {
              // 如果服务器端不存在这个 room id
              callback(null);
            }
          }
        });
      } else {
        // 传入 options
        // 如果没有传入参数，则给一个错误提示
        if (!argument) {
          throw new Error('Createing room must have a callback function.');
        }

        var options;

        // 只传入 callback
        if (typeof argument === 'function') {
          callback = argument;
        } else {
          // 传入参数
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
          unique: options.unique || false,
          serialId: engine.getSerialId(cache)
        };

        convObject = newConvObject(cache);

        engine.startConv(cache, options, callback);

        // 服务器端确认收到对话创建，并创建成功
        var fun = function fun(data) {
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
    conv: function conv() {
      return this.room.apply(this, arguments);
    },
    // 相关查询，包括用户列表查询，房间查询等
    query: function query(argument, callback) {
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
      options.flag = 0;
      if (options.compact) {
        options.flag |= 1;
      }
      if (options.withLastMessages) {
        options.flag |= 2;
      }
      var fun = function fun(data) {
        if (data.i === options.serialId) {
          if (callback) {
            callback(data.results);
          }
          cache.ec.off('conv-results', fun);
        }
      };
      cache.ec.on('conv-results', fun);
      if (!options.where) {
        options.where = {};
        // 默认查找的当前用户所在的 conv
        options.where.m = cache.options.peerId;
      }
      engine.convQuery(cache, options);
      return this;
    },
    // 判断用户是否在线
    ping: function ping(argument, callback) {
      var cache = this.cache;
      if (!cache.openFlag) {
        throw new Error('Must call after open() has successed.');
      }
      if (!callback) {
        throw new Error('Ping must have callback.');
      }
      var peerIdList = [];
      // 传入一个 id
      if (typeof argument === 'string') {
        peerIdList.push(argument);
      } else {
        // 传入的是数组
        peerIdList = argument;
      }
      var options = {
        serialId: engine.getSerialId(cache),
        peerIdList: peerIdList
      };
      var fun = function fun(data) {
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
var realtime = function realtime(options, callback) {
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
      secure: typeof options.secure === 'undefined' ? secure : options.secure,
      // 服务器地区选项，默认为中国大陆
      region: options.region || 'cn'
    };

    var realtimeObj = newRealtimeObject();
    realtimeObj.clientId = options.peerId;
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

realtime.config = function (newConfig) {
  extend(config, newConfig);
};

// WebSocket Open
engine.wsOpen = function (cache) {
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
engine.wsClose = function (cache, event) {
  // 派发全局 close 事件，表示 realtime 已经关闭
  cache.ec.emit(eNameIndex.close, event);
};

// WebSocket Message
engine.wsMessage = function (cache, msg) {
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

engine.wsError = function (cache, data) {
  cache.ec.emit(eNameIndex.error, data);
  throw data;
};

// WebSocket send message
engine.wsSend = function (cache, data) {
  if (!cache.closeFlag) {
    if (!cache.ws) {
      throw new Error('The realtimeObject must opened first. Please listen to the "open" event.');
    } else {
      data.peerId = cache.options.peerId;
      cache.ws.send(JSON.stringify(data));
    }
  }
};

engine.createSocket = function (cache, server) {
  if (cache.ws) {
    cache.ws.close();
  }
  var ws = new config.WebSocket(server);
  cache.ws = ws;
  ws.addEventListener('open', function () {
    engine.wsOpen(cache);
  });
  ws.addEventListener('close', function (event) {
    engine.wsClose(cache, event);
  });
  ws.addEventListener('message', function (msg) {
    engine.wsMessage(cache, msg);
  });
  ws.addEventListener('error', function (data) {
    engine.wsError(cache, data);
  });
};

// 心跳程序
engine.heartbeats = function (cache) {

  // 当前 RealtimeObject 已经启动心跳程序
  if (cache.openFlag) {
    return;
  }

  var timer;
  cache.ws.addEventListener('message', function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      cache.ws.send('{}');
    }, config.heartbeatsTime);
  });
};

// 守护进程，会派发 reuse 重连事件
engine.guard = function (cache) {

  // 当前 RealtimeObject 已经启动守护进程
  if (cache.openFlag) {
    return;
  }

  // 超时是三分钟
  var timeLength = 3 * 60 * 1000;
  var timer;

  // 结合心跳事件，如果长时间没有收到服务器的心跳，也要触发重连机制
  cache.ws.addEventListener('message', function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      if (!cache.closeFlag && !cache.reuseFlag) {
        cache.reuseFlag = true;
        // 超时则派发重试事件
        cache.ec.emit(eNameIndex.reuse);
      }
    }, timeLength);
  });

  // 监测断开事件
  cache.ec.on(eNameIndex.close + ' ' + 'session-closed', function () {
    if (!cache.closeFlag && !cache.reuseFlag) {
      cache.reuseFlag = true;
      cache.ec.emit(eNameIndex.reuse);
    }
  });
};

engine.connect = function (cache, options) {
  var server = options.server;
  // 判断获取出缓存的时间是否是比较新的
  if (server && tool.now() <= server.expires) {
    engine.createSocket(cache, server.server);
  } else {
    cache.ec.emit(eNameIndex.error);
    throw new Error('WebSocket connet failed.');
  }
};

engine.getServer = function (cache, options, callback) {
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
  url = protocol + 'router-' + node + '-push.leancloud.cn/v1/route';
  url += '?_t=' + tool.now() + '&appId=' + appId;
  if (secure) {
    url += '&secure=1';
  }
  ajax(url, function (error, data) {
    if (data) {
      data.expires = tool.now() + data.ttl * 1000;
      cache.server = data;
      callback(data);
    } else {
      cache.ec.emit(eNameIndex.error);
    }
  });
};

// 打开 session
engine.openSession = function (cache, options) {
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
    }, function (authResult) {
      if (authResult && authResult.signature) {
        cmd.n = authResult.nonce;
        cmd.t = authResult.timestamp;
        cmd.s = authResult.signature;
        engine.wsSend(cache, cmd);
      } else {
        throw new Error('Session open denied by application: ' + authResult);
      }
    });
  } else {
    engine.wsSend(cache, cmd);
  }
};

engine.closeSession = function (cache) {
  engine.wsSend(cache, cache, {
    cmd: 'session',
    op: 'close'
  });
};

engine.startConv = function (cache, options) {
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
    unique: options.unique || false,
    // 是否是开放聊天室，无人数限制
    transient: options.transient || false
  };
  if (cache.authFun) {
    cache.authFun({
      clientId: cache.options.peerId,
      members: options.members
    }, function (authResult) {
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

engine.convAdd = function (cache, options) {
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
    }, function (authResult) {
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

engine.convRemove = function (cache, options) {
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
    }, function (authResult) {
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

engine.send = function (cache, options) {
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

engine.convQuery = function (cache, options) {
  options = options || {};
  var where = options.where || {};

  // 同时查找含有数组中 id 的用户所在的 conversation
  if (where.m && typeof where.m !== 'string') {
    where.m = {
      $all: where.m
    };
  }

  // 批量查找 room 信息
  if (where.roomIds || where.convIds) {
    where.objectId = {
      $in: where.roomIds || where.convIds
    };
    // 避免对查询项产生干扰
    delete where.roomIds;
    delete where.convIds;
  }

  engine.wsSend(cache, {
    cmd: 'conv',
    op: 'query',
    // where 可选，对象，默认为包含自己的查询 {"m": peerId}
    where: where,
    // sort 可选，字符串，默认为 -lm，最近对话反序
    sort: options.sort || '-lm',
    // limit 可选，数字，默认10
    limit: options.limit || 10,
    // skip 可选，数字，默认0
    skip: options.skip || 0,
    // bitflag
    // 0001 - 不返回成员列表
    // 0010 - 返回对话最近一条消息
    flag: options.flag,
    // i serial-id
    i: options.serialId
  });
};

// 查询 session 在线情况
engine.querySession = function (cache, options) {
  engine.wsSend(cache, {
    cmd: 'session',
    op: 'query',
    i: options.serialId,
    sessionPeerIds: options.peerIdList
  });
};

// 查询 conversation 的聊天记录
engine.convLog = function (cache, options) {
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

engine.convUpdate = function (cache, options) {
  engine.wsSend(cache, {
    cmd: 'conv',
    op: 'update',
    cid: options.cid,
    // attr 要修改的内容
    attr: options.data,
    i: options.serialId
  });
};

engine.convAck = function (cache, options) {
  engine.wsSend(cache, {
    cmd: 'ack',
    cid: options.cid,
    mid: options.mid
  });
};

engine.convCount = function (cache, options) {
  engine.wsSend(cache, {
    cmd: 'conv',
    op: 'count',
    i: options.serialId,
    cid: options.cid
  });
};

// 取出多媒体类型的格式（内置 HTML 转义逻辑）
engine.getMediaMsg = function (cache, msg) {

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
      if (msg._lcloc) {
        obj.location = msg._lcloc;
      }
      break;
    case -6:
      obj.type = 'file';
      break;
    // 自定义类型，返回全部自定义数据
    default:
      obj = msg;
      break;
  }
  return obj;
};

// 生成多媒体特定格式的数据
engine.setMediaMsg = function (cache, type, data) {
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
engine.getSerialId = function (cache) {
  cache.serialId++;
  if (cache.serialId > 999999) {
    cache.serialId = 2015;
  }
  return cache.serialId;
};

// 绑定所有服务返回事件
engine.bindEvent = function (cache) {

  // RealtimeObject 已经初始化过，不再重复绑定事件
  if (cache.openFlag) {
    return;
  }

  cache.ec.on('session-opened', function (data) {
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

  cache.ec.on('session-error', function (data) {
    cache.ec.emit(eNameIndex.error, data);
  });

  // 服务器端确认收到 conversation 创建，并创建成功
  // 在创建时已经做绑定，所以注释掉
  // cache.ec.on('conv-started', function(data) {});

  // 服务器端发给客户端，表示当前用户加入了某个对话。包括创建对话、或加入对话
  cache.ec.on('conv-joined', function (data) {
    // 不是当前用户自己加入
    // join 事件已废弃
    // 这里把当前用户主动操作的情况过滤掉了，为了兼容保持原样。
    if (data.peerId !== data.initBy) {
      cache.ec.emit(eNameIndex.join, data);
    }
    cache.ec.emit(eNameIndex.invited, data);
  });

  // 服务器端发给客户端，表示当前用户离开了某个对话，不再能收到对话的消息
  cache.ec.on('conv-left', function (data) {
    cache.ec.emit(eNameIndex.left, data);
    cache.ec.emit(eNameIndex.kicked, data);
  });

  // 服务器端发给客户端，表示当前对话有新人加入
  cache.ec.on('conv-members-joined', function (data) {
    cache.ec.emit(eNameIndex.join, data);
    cache.ec.emit(eNameIndex.membersjoined, data);
  });

  // 服务器端发给客户端，表示当前对话有新人离开
  cache.ec.on('conv-members-left', function (data) {
    cache.ec.emit(eNameIndex.left, data);
    cache.ec.emit(eNameIndex.membersleft, data);
  });

  // 服务器端回复。表示 add 操作完成
  // 因为 added 之后也会触发 members-joined，所以注释掉
  // cache.ec.on('conv-added', function(data) {});

  // 服务器端确认删除成功
  // 因为 removed 之后也会触发 members-removed，所以注释掉
  // cache.ec.on('conv-removed', function() {});

  cache.ec.on('conv-error', function (data) {
    cache.ec.emit(eNameIndex.error, data);
    throw data.code + ':' + data.reason;
  });

  // 查询对话的结果
  // cache.ec.on('conv-results', function(data) {});

  // cache.ec.on('conv-updated', function(data) {});

  cache.ec.on('direct', function (data) {

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
  cache.ec.on('rcp', function (data) {
    cache.ec.emit(eNameIndex.receipt, data);
  });

  // cache.ec.on('ack', function(data) {});

  // 用户可以获取自己所在对话的历史记录
  // cache.ec.on('logs', function(data) {});
};

if (typeof exports !== 'undefined') {
  // CommonJS 支持
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = realtime;
  }
  exports.realtime = realtime;
  /* jshint -W117 */
  /* ignore 'define' is not defined */
} else if (typeof define === 'function' && define.amd) {
    // AMD 支持
    define('AV/realtime', [], function () {
      return realtime;
    });
    /* jshint +W117 */
  }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./tool":6,"ws":8}],3:[function(require,module,exports){
(function (global){
'use strict';
module.exports = function (options, callback) {
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

  xhr.onload = function (data) {
    if (xhr.status >= 200 && xhr.status < 300 || global.XDomainRequest && !xhr.status) {
      callback(null, JSON.parse(xhr.responseText));
    } else {
      callback(JSON.parse(xhr.responseText));
    }
  };

  xhr.onerror = function (data) {
    callback(data || {});
    throw new Error('Network error.');
  };

  // IE9 中需要设置所有的 xhr 事件回调，不然可能会无法执行后续操作
  xhr.onprogress = function () {};
  xhr.ontimeout = function () {};
  xhr.timeout = 0;

  var body = JSON.stringify(options.data);

  xhr.send(body);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./xmlhttprequest":7}],4:[function(require,module,exports){
'use strict';

module.exports = function () {
  var eventList = {};
  var eventOnceList = {};

  var _on = function _on(eventName, fun, options) {
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
            if (itemEventList[m].toString() === fun.toString()) {
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

  var _off = function _off(eventName, fun, options) {
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
    on: function on(eventName, fun) {
      _on(eventName, fun);
      return this;
    },

    // 方法绑定以后只会运行一次
    once: function once(eventName, fun) {
      _on(eventName, fun, {
        once: true
      });
      return this;
    },

    // 同一个方法只会被绑定一次
    _one: function _one(eventName, fun) {
      _on(eventName, fun, {
        single: true
      });
    },
    emit: function emit(eventName, data) {
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
    off: function off(eventName, fun) {
      _off(eventName, fun);
      return this;
    }
  };
};

},{}],5:[function(require,module,exports){
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
  var options;
  var name;
  var src;
  var copy;
  var copyIsArray;
  var clone;
  var target = arguments[0];
  var i = 1;
  var length = arguments.length;
  var deep = false;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  } else if (typeof target !== 'object' && typeof target !== 'function' || target === null) {
    target = {};
  }

  for (; i < length; ++i) {
    options = arguments[i];
    // Only deal with non-null/undefined values
    if (options !== null) {
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

},{}],6:[function(require,module,exports){
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

},{"./ajax":3,"./eventcenter":4,"./extend":5}],7:[function(require,module,exports){
"use strict";

exports.XMLHttpRequest = window.XMLHttpRequest || window.XDomainRequest;

},{}],8:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}]},{},[1]);
