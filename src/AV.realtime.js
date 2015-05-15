/**
 * @author wangxiao
 * @date 2015-05-15
 * @homepage http://github.com/leancloud/js-realtime-sdk/
 *
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 */

void function(win) {

    // 当前版本
    var VERSION = '2.0.7';

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
            data: {},
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
                switch(arguments.length) {
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
                options.serialId = engine.getSerialId();

                // 如果 type 存在，则发送多媒体格式
                if (options.type) {
                    options.data = engine.setMediaMsg(options.type, data);
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
                            // 对查出的类型进行过滤，兼容多端通信
                            for (var i = 0, l = data.logs.length; i < l; i ++) {
                                data.logs[i].data = engine.getMediaMsg(data.logs[i].data);
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
                        cache.ec.off('conv-results', fun);
                    }
                };
                cache.ec.on('conv-results', fun);
                engine.convQuery(options);
                return this;
            },
            count: function(callback) {
                var id = this.id;
                var options = {
                    cid: id,
                    serialId: engine.getSerialId()
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
                engine.convCount(options);
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
                        cache.ec.off('conv-updated', fun);
                    }
                };
                cache.ec.on('conv-updated', fun);
                engine.convUpdate(options);
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
            // 所有已生成的 conversation 对象（缓存也并没有使用，暂时去掉）
            // convIndex: {},
            // 是否已经 open 完毕，主要在 close 方法中检测
            openFlag: false,
            // 是否是用户关闭，如果不是将会断开重连
            closeFlag: false,
            // reuse 事件的重试 timer
            reuseTimer: undefined,
            // resuse 状态，如果为 true 表示内部已经在重试中
            resuseFlag: false,
            // 当前的 serialId
            serialId: 2015
        };

        // WebSocket Open
        var wsOpen = function() {
            engine.bindEvent();
            engine.openSession({
                serialId: engine.getSerialId()
            });
            // 启动心跳
            engine.heartbeats();
            // 启动守护进程
            engine.guard();
        };

        // WebSocket Close
        var wsClose = function(event) {
            // 派发全局 close 事件，表示 realtime 已经关闭
            cache.ec.emit(eNameIndex.close, event);
        };

        // WebSocket Message
        var wsMessage = function(msg) {
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

        var wsError = function(data) {
            cache.ec.emit(eNameIndex.error, data);
            throw(data);
        };

        // WebSocket send message
        var wsSend = function(data) {
            if (!cache.closeFlag) {
                if (!cache.ws) {
                    throw('The realtimeObject must opened first. Please listening to the "open" event.');
                }
                else {
                    cache.ws.send(JSON.stringify(data));
                }
            }
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
            var timer;
            cache.ws.addEventListener('message', function() {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function() {
                    wsSend({});
                }, config.heartbeatsTime);
            });

            // 防止多次实例化
            engine.heartbeats = tool.noop;
        };

        // 守护进程，会派发 reuse 重连事件
        engine.guard = function() {

            // 超时是三分钟
            var timeLength = 3 * 60 * 1000;
            var timer;

            // 结合心跳事件，如果长时间没有收到服务器的心跳，也要触发重连机制
            cache.ws.addEventListener('message', function() {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function() {
                    if (!cache.closeFlag && !cache.resuseFlag) {
                        cache.resuseFlag = true;
                        // 超时则派发重试事件
                        cache.ec.emit(eNameIndex.reuse);
                    }
                }, timeLength);
            });

            // 监测断开事件
            cache.ec.on(eNameIndex.close + ' ' + 'session-closed', function() {
                if (!cache.closeFlag && !cache.resuseFlag) {
                    cache.resuseFlag = true;
                    cache.ec.emit(eNameIndex.reuse);
                }
            });

            // 防止多次实例化
            engine.guard = tool.noop;
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
            var secure = options.secure;
            var url = '';
            var protocol = 'http://';
            if (win && win.location.protocol === 'https:' && secure) {
                protocol = 'https://';
            }
            url = protocol + 'router-g0-push.avoscloud.com/v1/route?_t=' + tool.now() + '&appId=' + appId ;
            if (secure) {
              url += '&secure=1';
            }
            tool.ajax({
                url: url,
                form: true
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

        // 打开 session
        engine.openSession = function(options) {
            var cmd = {
                cmd: 'session',
                op: 'open',
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                ua: 'js/' + VERSION,
                i: options.serialId
            };
            if (cache.authFun) {
                cache.authFun({
                    clientId: cache.options.peerId
                }, function(authResult){
                    if (authResult && authResult.signature) {
                        cmd.n = authResult.nonce;
                        cmd.t = authResult.timestamp;
                        cmd.s = authResult.signature;
                        wsSend(cmd);
                    } else {
                        throw('Session open denied by application: ' + authResult);
                    }
                });
            } else {
                wsSend(cmd);
            }
        };

        engine.closeSession = function() {
            wsSend({
                cmd: 'session',
                op: 'close',
                peerId: cache.options.peerId
                // ASK: 这块用不用 appId
                // appId: cache.options.appId
            });
        };

        engine.startConv = function(options) {
            var cmd = {
                cmd: 'conv',
                op: 'start',
                // m [] 初始的对话用户id列表，服务器默认会把自己加入
                m: options.members,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                // attr json对象，对话的任意初始属性
                attr: options.data || {},
                i: options.serialId,
                // 是否是开放聊天室，无人数限制
                transient: options.transient || false
            };
            if (cache.authFun) {
                cache.authFun({
                    clientId: cache.options.peerId,
                    members: options.members
                }, function(authResult){
                    if (authResult && authResult.signature) {
                        cmd.n = authResult.nonce;
                        cmd.t = authResult.timestamp;
                        cmd.s = authResult.signature;
                        wsSend(cmd);
                    } else {
                        throw('Conversation creation denied by application: ' + authResult);
                    }
                });
            } else {
                wsSend(cmd);
            }
        };

        engine.convAdd = function(options) {
            var cmd = {
                cmd: 'conv',
                op: 'add',
                cid: options.cid,
                m: options.members,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                i: options.serialId
            };
            if (cache.authFun) {
                cache.authFun({
                    clientId: cache.options.peerId,
                    members: options.members,
                    convId: options.cid,
                    action: 'invite'
                }, function(authResult){
                    if (authResult && authResult.signature) {
                        cmd.n = authResult.nonce;
                        cmd.t = authResult.timestamp;
                        cmd.s = authResult.signature;
                        wsSend(cmd);
                    } else {
                        throw('Adding members to conversation denied by application: ' + authResult);
                    }
                });
            } else {
                wsSend(cmd);
            }
        };

        engine.convRemove = function(options) {
            var cmd = {
                cmd: 'conv',
                op: 'remove',
                cid: options.cid,
                m: options.members,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                i: options.serialId
            };
            if (cache.authFun && (options.members.length > 1 || options.members[0] != cache.options.peerId)) {
                cache.authFun({
                    clientId: cache.options.peerId,
                    members: options.members,
                    convId: options.cid,
                    action: 'kick'
                }, function(authResult){
                    if (authResult && authResult.signature) {
                        cmd.n = authResult.nonce;
                        cmd.t = authResult.timestamp;
                        cmd.s = authResult.signature;
                        wsSend(cmd);
                    } else {
                        throw('Removing members from conversation denied by application: ' + authResult);
                    }
                });
            } else {
                wsSend(cmd);
            }
        };

        engine.send = function(options) {
            wsSend({
                cmd: 'direct',
                cid: options.cid,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                msg: options.data,
                i: options.serialId,
                // r 是否需要回执需要则1，否则不传
                r: options.receipt || false,
                // transient 是否暂态消息（暂态消息不返回 ack，不保留离线消息，不触发离 线推送），否则不传
                transient: options.transient || false
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

        // 查询 session 在线情况
        engine.querySession = function(options) {
            wsSend({
                cmd: 'session',
                op: 'query',
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                i: options.serialId,
                sessionPeerIds: options.peerIdList
            });
        };

        // 查询 conversation 的聊天记录
        engine.convLog = function(options) {
            wsSend({
                cmd: 'logs',
                cid: options.cid,
                // t 时间戳，从 t 开始向前查询
                t: options.t || undefined,
                // mid 消息 id，从消息 id 开始向前查询（和 t 共同使用，为防止某毫秒时刻有重复消息）
                mid: options.mid || undefined,
                limit: options.limit || 20,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                // i serial-id
                i: options.serialId
            });
        };

        engine.convUpdate = function(options) {
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

        engine.convAck = function(options) {
            wsSend({
                cmd: 'ack',
                cid: options.cid,
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                mid: options.mid
            });
        };

        engine.convCount = function(options) {
            wsSend({
                cmd: 'conv',
                op: 'count',
                appId: cache.options.appId,
                peerId: cache.options.peerId,
                i: options.serialId,
                cid: options.cid
            });
        };

        // 取出多媒体类型的格式（内置 HTML 转义逻辑）
        engine.getMediaMsg = function(msg) {

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
            switch(msg._lctype) {
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
        engine.setMediaMsg = function(type, data) {
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
            obj = JSON.stringify(obj);
            return obj;
        };

        // 取自增的 number 类型
        engine.getSerialId = function() {
            cache.serialId ++;
            if (cache.serialId > 999999) {
                cache.serialId = 2015;
            }
            return cache.serialId;
        };

        // 绑定所有服务返回事件
        engine.bindEvent = function() {
            cache.ec.on('session-opened', function(data) {
                // 标记重试状态为 false，表示没有在重试
                cache.resuseFlag = false;
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
                throw(data.code + ':' + data.reason);
            });

            // 查询对话的结果
            // cache.ec.on('conv-results', function(data) {});

            // cache.ec.on('conv-updated', function(data) {});

            cache.ec.on('direct', function(data) {

                // 增加多媒体消息的数据格式化
                data.msg = engine.getMediaMsg(data.msg);

                // 收到消息，立刻告知服务器
                engine.convAck({
                    cid: data.cid,
                    mid: data.id
                });

                cache.ec.emit(eNameIndex.message, data);
            });

            // 对要求回执的消息，服务器端会在对方客户端发送ack后发送回执
            cache.ec.on('rcp', function(data) {
                cache.ec.emit(eNameIndex.receipt, data);
            });

            // cache.ec.on('ack', function(data) {});

            // 用户可以获取自己所在对话的历史记录
            // cache.ec.on('logs', function(data) {});

            // 清空 bindEvent，防止事件重复绑定
            engine.bindEvent = tool.noop;
        };

        return {
            cache: cache,
            open: function(callback) {
                var me = this;
                cache.closeFlag = false;
                engine.getServer(cache.options, function(data) {
                    if (data) {
                        engine.connect({
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
                if (!cache.openFlag) {
                    throw('Must call after open() has successed.');
                }
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
            off: function(eventName, callback) {
                this.cache.ec.off(eventName, callback);
                return this;
            },
            room: function(argument, callback) {
                if (!cache.openFlag) {
                    throw('Must call after open() has successed.');
                }
                var convObject = newConvObject(cache);
                // 传入 convId
                if (typeof argument === 'string') {
                    // cache.convIndex[convObject.id] = convObject;

                    // 去服务器端判断下当前 room id 是否存在
                    this.query({
                        where: {
                            objectId: argument
                        }
                    }, function(data) {
                        
                        // 如果服务器端有这个 id
                        if (data.length) {
                            convObject.id = argument;
                            // 获取初始化时的属性
                            convObject.data = data[0];
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
                    var options = argument;
                    options = {
                        // 人员的 id list
                        members: options.members,
                        // 默认的数据，可以放 Conversation 名字等
                        data: options.data,
                        transient: options.transient,
                        serialId: engine.getSerialId()
                    };

                    engine.startConv(options, callback);

                    // 服务器端确认收到对话创建，并创建成功
                    var fun = function(data) {
                        if (data.i === options.serialId) {
                            convObject.id = data.cid;
                            convObject.data = options.data;
                            // cache.convIndex[convObject.id] = convObject;
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
            conv: function(argument, callback) {
                return this.room(argument, callback);
            },
            // 相关查询，包括用户列表查询，房间查询等
            query: function(argument, callback) {
                if (!cache.openFlag) {
                    throw('Must call after open() has successed.');
                }
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
                            callback(data.results);
                        }
                        cache.ec.off('conv-results', fun);
                    }
                };
                cache.ec.on('conv-results', fun);
                engine.convQuery(options);
                return this;
            },
            // 判断用户是否在线
            ping: function(argument, callback) {
                if (!cache.openFlag) {
                    throw('Must call after open() has successed.');
                }
                if (!callback) {
                    throw('Ping must have callback.');
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
                    serialId: engine.getSerialId(),
                    peerIdList: peerIdList
                };
                var fun = function(data) {
                    if (data.i === options.serialId) {
                        callback(data.onlineSessionPeerIds);
                        cache.ec.off('session-query-result', fun);
                    }
                };
                cache.ec.on('session-query-result', fun);
                engine.querySession(options);
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
        else if (!win.WebSocket) {
            alert('Bowser must support WebSocket, please read LeanCloud doc and use plugin.');
        }
        else {

            // 通过判断插件库中的对象是否存在来检测是否需要关掉安全链接，在需要兼容 flash 的时候需要关掉，默认开启。
            var secure = win.WebSocket.loadFlashPolicyFile ? false : true;

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
                secure: typeof(options.secure) === 'undefined' ? secure : options.secure
            };

            var realtimeObj = newRealtimeObject();
            realtimeObj.cache.options = options;
            realtimeObj.cache.ec = tool.eventCenter();
            realtimeObj.cache.authFun = options.auth;

            realtimeObj.open(callback);

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

    // 获取一个唯一 id
    tool.getId = function() {
        // 与时间相关的随机因子
        var getIdItem = function() {
            return new Date().getTime().toString(36) + Math.random().toString(36).substring(2, 3);
        };
        return 'AV' + getIdItem();
    };

    // 检查是否是 JSON 格式的字符串
    tool.isJSONString = function(obj) {
        return /^\{.*\}$/.test(obj);
    };

    // Ajax get 请求
    tool.ajax = function(options, callback) {
        var url = options.url;
        var method = options.method || 'get';
        var xhr;

        // 浏览器兼容，IE8+
        if (window.XDomainRequest) {
            xhr = new XDomainRequest();
        } else {
            xhr = new XMLHttpRequest();
        }

        xhr.open(method, url);

        if (method === 'post') {
            if (options.form) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            } else {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.setRequestHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
                xhr.setRequestHeader('Access-Control-Allow-Methods',"POST, GET, OPTIONS, DELETE, PUT, HEAD");
            }
        }

        xhr.onload = function(data) {
            if ((xhr.status >= 200 && xhr.status < 300) || (window.XDomainRequest && !xhr.status)) {
                callback(JSON.parse(xhr.responseText));
            } else {
                callback(null, JSON.parse(xhr.responseText));
            }
        };

        xhr.onerror = function(data) {
            callback(null, data || {});
            throw('Network error.');
        };

        // IE9 中需要设置所有的 xhr 事件回调，不然可能会无法执行后续操作
        xhr.onprogress = function(){}
        xhr.ontimeout = function(){}
        xhr.timeout = 0;

        var formData = '';
        if (options.form) {
            for (var k in options.data) {
                if (!formData) {
                    formData += (k + '=' + options.data[k]);
                } else {
                    formData += ('&' + k + '=' + options.data[k]);
                }
            }
        } else {
            formData = JSON.stringify(options.data);
        }
        
        xhr.send(formData);
        
    };

    // 获取当前时间的时间戳
    tool.now = function() {
        return new Date().getTime();
    };

    // HTML 转义
    tool.encodeHTML = function(source) {
        var encodeHTML = function(str) {
            if (typeof(str) === 'string') {
                return str.replace(/&/g,'&amp;')
                        .replace(/</g,'&lt;')
                        .replace(/>/g,'&gt;');
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

        var _on = function(eventName, fun, isOnce) {
            if (!eventName) {
                throw('No event name.');
            }
            else if (!fun) {
                throw('No callback function.');
            }
            var list = eventName.split(/\s+/);
            var tempList;
            if (!isOnce) {
                tempList = eventList;
            }
            else {
                tempList = eventOnceList;
            }
            for (var i = 0, l = list.length; i < l; i ++) {
                if (list[i]) {
                    if (!tempList[list[i]]) {
                        tempList[list[i]] = [];
                    }
                    tempList[list[i]].push(fun);
                }
            }
        };

        var _off = function(eventName, fun, isOnce) {
            var tempList;
            if (!isOnce) {
                tempList = eventList;
            } else {
                tempList = eventOnceList;
            }
            if (tempList[eventName]) {
                var i = 0;
                var l = tempList[eventName].length;
                for (; i < l; i ++) {
                    if (tempList[eventName][i] === fun) {
                        tempList[eventName][i] = null;
                        // 每次只清除一个相同事件绑定
                        return;
                    }
                }
            }
        };

        function cleanNull(list) {
            var tempList = [];
            var i = 0;
            var l = list.length;
            if (l) {
                for (; i < l; i ++) {
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
                        if (eventList[eventName][i]) {
                            eventList[eventName][i].call(this, data);
                        }
                    }
                    eventList[eventName] = cleanNull(eventList[eventName]);
                }
                if (eventOnceList[eventName]) {
                    i = 0;
                    l = eventOnceList[eventName].length;
                    for (; i < l; i ++) {
                        if (eventOnceList[eventName][i]) {
                            eventOnceList[eventName][i].call(this, data);
                            _off(eventName, eventOnceList[eventName][i], true);
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

} (window);
