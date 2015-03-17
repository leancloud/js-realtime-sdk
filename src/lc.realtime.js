/**
 * @author wangxiao
 * @date 2014-12-31
 *
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 */

void function(win) {

    // 当前版本
    var VERSION = '2.0.0';

    // 获取命名空间
    var AV = win.AV || {};
    win.AV = AV;

    // AMD 加载支持
    if (typeof define === 'function' && define.amd) {
        define('AV', [], function() {
            return AV;
        });
    }

    // 配置项
    var config = {
        // 心跳时间（一分钟）
        heartbeatsTime: 60 * 1000
    };

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
        // conversation 更新
        update: 'update',
        // 各种错误
        error: 'error'
    };

    // 生成 conversation 对象，挂载所有 conversation 相关方法，每次调用实例化
    var newConvObject = function(cache) {

        var addOrRemove = function(argument, callback, cmd) {
            var me = this;
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
                cid: me.id,
                members: members,
                serialId: engine.getSerialId()
            };
            switch(cmd) {
                case 'add':
                    eventName = 'conv-added';
                    engine.convAdd(options);
                break;
                case 'remove':
                    eventName = 'conv-removed';
                    engine.convRemove(options);
                break;
            }
            fun = function(data) {
                if (data.i === options.serialId) {
                    if (callback) {
                        callback(data);
                    }
                    cache.ec.remove(eventName, fun);
                }
            };
            cache.ec.on(eventName, fun);
            return this;
        };

        return {
            // cid 即 conversation id
            id: '',
            add: function(argument, callback) {
                addOrRemove(argument, callback, 'add');
                return this;
            },
            remove: function(argument, callback) {
                addOrRemove(argument, callback, 'remove');
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
            send: function(data, callback) {
                var me = this;
                var options = {
                    cid: me.id,
                    data: data,
                    serialId: engine.getSerialId()
                };
                var fun = function(data) {
                    if (data.i === options.serialId) {
                        if (callback) {
                            callback(data);
                        }
                        cache.ec.remove('ack', fun);
                    }
                };
                cache.ec.on('ack', fun);
                engine.send(options, callback);
                return this;
            },
            log: function(argument, callback) {
                var options = {};
                switch(arguments.length) {
                    // 如果只有一个参数，那么是 callback
                    case 1:
                        callback = argument;
                    break;
                    case 2:
                        options = argument;
                    break;
                }
                options.cid = options.cid || this.id;
                options.serialId = options.serialId || engine.getSerialId();
                var fun = function(data) {
                    if (data.i === options.serialId) {
                        if (callback) {
                            callback(data.logs);
                        }
                        cache.ec.remove('logs', fun);
                    }
                };
                cache.ec.on('logs', fun);
                
                // 注：立刻获取消息历史有可能取不到
                engine.convLog(options);
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
            list: function(callback) {
                var options = {};
                var id = this.id;
                options.where = {
                    m: cache.options.peerId,
                    objectId: id
                };
                options.serialId = engine.getSerialId();
                var fun = function(data) {
                    if (data.i === options.serialId) {
                        if (callback) {
                            if (data.results.length) {
                                // 因为是查询固定的 cid，所以结果只有一个。
                                callback(data.results[0].m);
                            } 
                            else {
                                callback([]);
                            }
                        }
                        cache.ec.remove('conv-results', fun);
                    }
                };
                cache.ec.on('conv-results', fun);
                engine.convQuery(options);
                return this;
            },
            update: function(data, callback) {
                var id = this.id;
                var options = {
                    cid: id,
                    data: data,
                    serialId: engine.getSerialId()
                };
                var fun = function(data) {
                    if (data.i === options.serialId) {
                        if (callback) {
                            callback(data);
                        }
                        cache.ec.remove('conv-updated', fun);
                    }
                };
                cache.ec.on('conv-updated', fun);
                engine.convUpate(options);                
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
            // 心跳的计时器
            heartbeatsTimer: undefined,
            // 事件中心
            ec: undefined,
            // 所有已生成的 conversation 对象
            convIndex: {},
            // 是否是用户关闭，如果不是将会断开重连
            closeFlag: false,
            // reuse 事件的重试 timer
            reuseTimer: undefined
        };

        // WebSocket Open
        var wsOpen = function() {
            tool.log('WebSocket opened.');
            engine.bindEvent();
            engine.openSession();
            // 启动心跳
            engine.heartbeats();
            // 启动守护进程
            engine.guard();
        };

        // WebSocket Close
        var wsClose = function() {
            tool.log('WebSocket closed.');
            // 派发全局 close 事件，表示 realtime 已经关闭
            cache.ec.emit(eNameIndex.close);
        };

        // WebSocket Message
        var wsMessage = function(msg) {
            var data = JSON.parse(msg.data);
            if (data.cmd) {
                var eventName = data.cmd;
                if (data.op) {
                    eventName += '-' + data.op;
                }
                cache.ec.emit(eventName, data);
            }
        };

        var wsError = function(data) {
            cache.ec.emit(eNameIndex.error, data);
            throw(data);
        };

        // WebSocket send message
        var wsSend = function(data) {
            cache.ws.send(JSON.stringify(data));
        };

        engine.createSocket = function(server) {
            var ws = new WebSocket(server);
            cache.ws = ws;
            ws.addEventListener('open', wsOpen);
            ws.addEventListener('close', wsClose);
            ws.addEventListener('message', wsMessage);
            ws.addEventListener('error', wsError);
        };

        // 心跳程序
        engine.heartbeats = function() {
            cache.ws.addEventListener('message', function() {
                if (cache.heartbeatsTimer) {
                    clearTimeout(cache.heartbeatsTimer);
                }
                cache.heartbeatsTimer = setTimeout(function() {
                    wsSend({});
                }, config.heartbeatsTime);
            });
        };

        // 守护进程，会派发 reuse 重连事件
        engine.guard = function() {
            cache.ec.on(eNameIndex.close + ' ' + 'session-closed', function() {
                if (!cache.closeFlag) {
                    cache.ec.emit(eNameIndex.reuse);
                }
            });
        };

        engine.connect = function(options) {
            var server = options.server;
            if (server && tool.now() < server.expires) {
                engine.createSocket(server.server);
            }
            else {
                throw('WebSocket connet failed.');
            }
        };

        engine.getServer = function(options, callback) {
            var appId = options.appId;
            // 是否获取 wss 的安全链接
            var secure = options.secure || true;
            var url = '';
            var protocol = 'http://';
            if (win && win.location.protocol === 'https:') {
                protocol = 'https://';
            }
            url = protocol + 'router-g0-push.avoscloud.com/v1/route?appId=' + appId ;
            if (secure) {
              url += '&secure=1';
            }
            tool.ajax({
                url: url
            }, function(data, error) {
                if (data) {
                    data.expires = tool.now() + data.ttl * 1000;
                    cache.server = data;
                    callback(data);
                }
                else {
                    if (error.code === 403 || error.code === 404) {
                        throw(error.error);
                    }
                    else {
                        cache.ec.emit(eNameIndex.error);
                    }
                }
            });
        };

        engine.auth = function(callback) {
            tool.ajax({
                url: cache.options.auth,
                method: 'post',
                data: {
                    self_id: cache.options.peerId
                }
            }, callback);
        };

        // 打开 session
        engine.openSession = function(options) {
            wsSend({
                cmd: 'session',
                op: 'open',
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                ua: 'js/' + VERSION,
                // i: options.serialId
                // TODO: session 的对应，即使用参数 i
                // n 签名参数随机字符串
                n: cache.sessionAuth && cache.sessionAuth.nonce,
                // s 签名参数签名
                s: cache.sessionAuth && cache.sessionAuth.signature,
                // 服务器时间认证
                t: cache.sessionAuth && cache.sessionAuth.timestamp
            });
        };

        engine.closeSession = function() {
            wsSend({
                cmd: 'session',
                op: 'close',
                peerId: cache.options.peerId,
                i: options.serialId
                // ASK: 这块用不用 appId
                // appId: cache.options.appId
            });
        };

        engine.startConv = function(options) {
            wsSend({
                cmd: 'conv',
                op: 'start',
                // m [] 初始的对话用户id列表，服务器默认会把自己加入
                m: options.members,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                // attr json对象，对话的任意初始属性
                attr: options.data || {},
                // t: tool.now(),
                i: options.serialId
                // n 签名参数随机字符串
                // n: n,
                // s 签名参数签名
                // s: s
            });
        };

        engine.convAdd = function(options) {
            wsSend({
                cmd: 'conv',
                op: 'add',
                cid: options.cid,
                m: options.members,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                // t: tool.now(),
                i: options.serialId
                // n 签名参数随机字符串
                // n: n,
                // s 签名参数签名
                // s: s
            });
        };

        engine.convRemove = function(options) {
            wsSend({
                cmd: 'conv',
                op: 'remove',
                cid: options.cid,
                m: options.members,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                // t: tool.now(),
                i: options.serialId
                // n 签名参数随机字符串
                // n: n,
                // s 签名参数签名
                // s: s
            });
        };

        engine.send = function(options) {
            wsSend({
                cmd: 'direct',
                cid: options.cid,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                msg: options.data,
                i: options.serialId
                // r 是否需要回执需要则1，否则不传
                // r: 1,
                // transient 是否暂态消息（暂态消息不返回 ack，不保留离线消息，不触发离 线推送），否则不传
            });
        };

        engine.convQuery = function(options) {
            options = options || {};
            wsSend({
                cmd: 'conv',
                op: 'query',
                appId: cache.options.appId,
                peerId: cache.options.peerId,
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

        // 查询 conversation 的聊天记录
        engine.convLog = function(options) {
            wsSend({
                cmd: 'logs',
                cid: options.cid,
                // t 时间戳，从 t 开始向前查询
                // t: tool.now(),
                // mid 消息 id，从消息 id 开始向前查询（和 t 共同使用，为防止某毫秒时刻有重复消息）
                mid: options.mid,
                limit: options.limit,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                // i serial-id
                i: options.serialId
            });
        };

        engine.convUpate = function(options) {
            wsSend({
                cmd: 'conv',
                op: 'update',
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                cid: options.cid,
                // attr 要修改的内容
                attr: options.data,
                i: options.serialId
            });
        };

        // 生成多媒体特定格式的数据
        engine.createMediaMsg = function(type, data) {
            var obj;
            if (type !== 'text' && !data.metaData) {
                throw('Media Data must have metaData attribute.');
            }
            switch(type) {
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
            return obj;
        };

        // 取自增的 number 类型
        engine.getSerialId = function() {
            return tool.now() + 1;
        };

        // 绑定所有服务返回事件
        engine.bindEvent = function() {
            cache.ec.on('session-opened', function(data) {
                // 派发全局 open 事件，表示 realtime 已经启动
                cache.ec.emit(eNameIndex.open, data);
            });
            // cache.ec.on('session-closed', function() {
                // session 被关闭，则关闭当前 websocket 连接                
            // });
            cache.ec.on('session-error', function(data) {
                cache.ec.emit(eNameIndex.error, data);
            });

            // 服务器端确认收到 conversation 创建，并创建成功
            // 在创建时已经做绑定，所以注释掉
            // cache.ec.on('conv-started', function(data) {
            // });

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
            // cache.ec.on('conv-added', function(data) {
            // });

            // 服务器端确认删除成功
            // 因为 removed 之后也会触发 members-removed，所以注释掉
            // cache.ec.on('conv-removed', function() {
            // });

            cache.ec.on('conv-error', function(data) {
                cache.ec.emit(eNameIndex.error, data);
                throw(data.code + ':' + data.reason);
            });

            // 查询对话的结果
            // cache.ec.on('conv-results', function(data) {
                // cmd conv
                // op result
                // appId
                // peerId
                // i serial-id
                // results 数组，是查询结果
                // cache.ec.emit(eNameIndex.result, data);
            // });
            // cache.ec.on('conv-updated', function(data) {
            //     cache.ec.emit(eNameIndex.update, data);
            // });

            cache.ec.on('direct', function(data) {
                // cmd direct
                // cid 会话 id
                // fromPeerId 发自用户id
                // msg
                // id 消息id，即之前ack中的uid
                // timestamp 时间戳，毫秒
                // transient 是否是暂态消息，如果为 true 客户端不需要回复 ack
                // appId
                // peerId
                cache.ec.emit(eNameIndex.message, data);
            });

            // cache.ec.on('ack', function(data) {
                // cmd ack
                // uid 消息全局id
                // i
                // t 服务器时间戳，毫秒
                // appId
                // peerId
            // });

            // 对要求回执的消息，服务器端会在对方客户端发送ack后发送回执
            // cache.ec.on('rcp', function() {
            // });

            // 用户可以获取自己所在对话的历史记录
            // cache.ec.on('logs', function(data) {
            // });

            // 清空 bindEvent，防止事件重复绑定
            engine.bindEvent = tool.noop;
        };

        return {
            cache: cache,
            open: function(callback) {
                var me = this;
                engine.getServer(cache.options, function(data) {
                    if (data) {
                        engine.connect({
                            server: cache.server
                        });
                    }
                });
                if (callback) {
                    cache.ec.once('open', callback);
                }
                // 断开重连
                cache.ec.once(eNameIndex.reuse + ' ' + eNameIndex.error, function() {
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
                cache.closeFlag = true;
                engine.closeSession();
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
            room: function(argument, callback) {
                var convObject = newConvObject(cache);
                // 传入 convId
                if (typeof argument === 'string') {
                    convObject.id = argument;
                    cache.convIndex[convObject.id] = convObject;
                }
                // 传入 options
                else {
                    var options = argument;
                    options.serialId = engine.getSerialId();
                    engine.startConv(options, callback);
                    // 服务器端确认收到对话创建，并创建成功
                    var fun = function(data) {
                        if (data.i === options.serialId) {
                            convObject.id = data.cid;
                            cache.convIndex[convObject.id] = convObject;
                            if (callback) {
                                callback(data);
                            }
                            cache.ec.emit(eNameIndex.create, data);
                            cache.ec.remove('conv-started', fun);
                        }
                    };
                    cache.ec.on('conv-started', fun);
                }
                return convObject;
            },
            // 相关查询，包括用户列表查询，房间查询等
            query: function(argument, callback) {
                var options = {};
                switch(arguments.length) {
                    // 如果只有一个参数，那么是 callback
                    case 1:
                        callback = argument;
                    break;
                    case 2:
                        options = argument;
                    break;
                }
                options.serialId = engine.getSerialId();
                var fun = function(data) {
                    if (data.i === options.serialId) {
                        if (callback) {
                            callback(data);
                        }
                        cache.ec.remove('conv-results', fun);
                    }
                };
                cache.ec.on('conv-results', fun);
                engine.convQuery(options);
                return this;
            }
        };
    };

    // 主函数，启动通信并获得 realtimeObject
    AV.realtime = function(options, callback) {
        if (typeof options !== 'object') {
            throw('AV.realtime need a argument at least.');
        }
        else if (!options.appId) {
            throw('Options must have appId.');
        }
        else {
            // clientId 对应的就是 peerId，如果不传入服务器会自动生成，客户端没有持久化该数据。
            options.peerId = options.clientId;
            var realtimeObj = newRealtimeObject();
            realtimeObj.cache.options = options;
            realtimeObj.cache.ec = tool.eventCenter();
            if (options.auth) {
                engine.auth(function(data, error) {
                    if (data) {
                        // 存储 session 的认证信息
                        realtimeObj.cache.sessionAuth = data;
                        realtimeObj.open(callback);
                    } else {
                        throw(error);
                    }
                });
            } else {
                // 启动 websocket，然后连接 session
                realtimeObj.open(callback);
            }
            return realtimeObj;
        }
    };

    // 赋值版本号
    AV.realtime.version = VERSION;

    // 挂载私有方法
    AV.realtime._tool = tool;
    AV.realtime._engine = engine;

    // 空函数
    tool.noop = function() {};

    // 获取一个唯一 id，碰撞概率：基本不可能
    tool.getId = function() {
        // 与时间相关的随机引子
        var getIdItem = function() {
            return Date.now().toString(36) + Math.random().toString(36).substring(2, 3);
        };
        return 'AV-' + getIdItem() + '-' + getIdItem() + '-' + getIdItem();
    };

    // 输出 log
    tool.log = function(msg) {
        console.log(msg);
    };

    // Ajax get 请求
    tool.ajax = function(options, callback) {
        var url = options.url;
        var method = options.method || 'get';
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        if (method === 'post') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            // xhr.setRequestHeader('Content-Type', 'application/json');
            // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            // xhr.setRequestHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
            // xhr.setRequestHeader('Access-Control-Allow-Methods',"POST, GET, OPTIONS, DELETE, PUT, HEAD");
        }
        xhr.onload = function(data) {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                callback(null, JSON.parse(xhr.responseText));
            }
        };
        xhr.onerror = function(data) {
            callback(null, data);
            throw('Network error.');
        };
        // 临时
        var formData = '';
        for (var k in options.data) {
            if (!formData) {
                formData += (k + '=' + options.data[k]);
            } else {
                formData += ('&' + k + '=' + options.data[k]);
            }
        }
        xhr.send(formData);
    };

    // 获取当前时间的时间戳
    tool.now = function() {
        return Date.now();
    };

    // 小型的私有事件中心
    tool.eventCenter = function() {
        var eventList = {};
        var eventOnceList = {};

        var _on = function(eventName, fun, isOnce) {
            if (!eventName) {
                throw('No event name.');
            }
            else if (!fun) {
                throw('No callback function.');
            }
            var list = eventName.split(/\s+/);
            for (var i = 0, l = list.length; i < l; i ++) {
                if (list[i]) {
                    if (!isOnce) {
                        if (!eventList[list[i]]) {
                            eventList[list[i]] = [];
                        }
                        eventList[list[i]].push(fun);
                    }
                    else {
                        if (!eventOnceList[list[i]]) {
                            eventOnceList[list[i]] = [];
                        }
                        eventOnceList[list[i]].push(fun);
                    }
                }
            }
        };

        return {
            on: function(eventName, fun) {
                _on(eventName, fun);
                return this;
            },
            once: function(eventName, fun) {
                _on(eventName, fun, true);
                return this;
            },
            emit: function(eventName, data) {
                if (!eventName) {
                    throw('No emit event name.');
                }
                var i = 0;
                var l = 0;
                if (eventList[eventName]) {
                    i = 0;
                    l = eventList[eventName].length;
                    for (; i < l; i ++) {
                        // 有可能执行过程中，删除了某个事件对应的方法
                        if (l > eventList[eventName].length) {
                            i --;
                            l = eventList[eventName].length;
                        }
                        eventList[eventName][i].call(this, data);
                    }
                }
                if (eventOnceList[eventName]) {
                    i = 0;
                    l = eventOnceList[eventName].length;
                    for (; i < l; i ++) {
                        // 有可能执行过程中，删除了某个事件对应的方法
                        if (l > eventOnceList[eventName].length) {
                            i --;
                            l = eventOnceList[eventName].length;
                        }
                        eventOnceList[eventName][i].call(this, data);
                    }
                }
                return this;
            },
            remove: function(eventName, fun) {
                if (eventList[eventName]) {
                    var i = 0;
                    var l = eventList[eventName].length;
                    for (; i < l; i ++) {
                        if (eventList[eventName][i] === fun) {
                            eventList[eventName].splice(i, 1);
                        }
                    }
                }
                return this;
            }
        };
    };

} (window);
