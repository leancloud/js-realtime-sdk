// 请将 AppId 改为你自己的 AppId
var appId = '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm';
// 每个客户端自定义的 id
var clientId = 'LeanCloud111';

var rt;
var conv;
var convOld;
var firstFlag = true;

// Demo 中聊天相关的主逻辑
function main() {

    // 创建聊天实例（支持单页多实例）
    rt = AV.realtime({
        appId: appId,
        // appId: 'pyon3kvufmleg773ahop2i7zy0tz2rfjx5bh82n7h5jzuwjg',
        clientId: clientId
        // 是否开启服务器端认证
        // auth: authFun
    });

    if (firstFlag) {
        // 当前 SDK 版本
        showLog('欢迎使用 LeanCloud 实时通信，当前 SDK 版本是 ' + AV.realtime.version);
    }

    // 实时通信服务连接成功
    rt.on('open', function() {
        showLog('实时通信服务建立成功！');

        // 因为断开重连还会触发一次 open 事件，所以用一个状态标记下
        if (firstFlag) {
            firstFlag = false;

            // 创建一个聊天室
            conv = rt.conv({
                // 人员的 id
                members: [
                    'LeanCloud02'
                ],
                // 默认的数据，可以放 Conversation 名字等
                data: {
                    m: 123
                }
            }, function(data) {
                if (data) {
                    console.log('Conversation 创建成功!', data);
                }
            });

            // 查询当前 Conversation 的相关信息
            rt.query(function(data) {
                console.log('查询 Conversation 所有相关信息：', data);
            });

            // 查询对应 clientId 的用户是否处于在线状态
            rt.ping([
                'LeanCloud111',
                'LeanCloud02'
            ], function(data) {
                console.log('查询用户在线状态：', data);
            });
        }
    });

    // 当聊天断开时触发
    rt.on('close', function() {
        console.log('实时通信服务被断开！');
    });

    // 当 Conversation 被创建时触发，当然您可以使用回调函数来处理，不一定要监听这个事件
    rt.on('create', function(data) {
        // 当前用户加入这个 Conversation 
        conv.join(function(data) {
            console.log('当前用户成功加入 Conversation');
        });
        // 向这个 Conversation 添加新的用户
        conv.add([
            'LeanCloud03', 'LeanCloud04'
        ], function(data) {
            console.log('成功添加用户：', data);
        });

        // 从这个 Conversation 中删除用户
        conv.remove('LeanCloud03', function(data) {
            console.log('成功删除用户：', data);
        });

        // 当前用户离开这个 Conversation 
        conv.leave(function(data) {
            console.log('当前用户成功离开 Conversation');
        });

        // 向这个 Conversation 中发送消息
        conv.send({
            abc: 123
        }, function(data) {
            console.log('发送的消息服务端已收收到：', data);

            // 查看历史消息
            conv.log(function(data) {
                console.log('查看当前 Conversation 最近的聊天记录：', data);
            });
        });

        // 向这个 Conversation 中发送暂态消息
        conv.send({
            msg: '当前用户正在输入。。。'
        }, {
            // 暂态消息，不需要回调
            transient: true
        }, function(data) {
            console.log('暂态消息的回调不会被运行');
        });

        // 向这个 Conversation 中发送消息，并且消息是否对方收到要有回执
        conv.send({
            abc: 123
        }, {
            // 获取阅读回执
            receipt: true
        }, function(data) {
            console.log('信息发送成功，该信息会获取阅读回执');
        });

        // 当前 Conversation 接收到消息
        conv.receive(function(data) {
            console.log('当前 Conversation 收到消息：', data);
        });

        // 当前 Conversation 接收到消息
        conv.receipt(function(data) {
            console.log('当前 Conversation 收到消息回执：', data);
        });

        // 获取当前 Conversation 中的成员信息
        conv.list(function(data) {
            console.log('列出当前 Conversation 的成员列表：', data);
        });

        // 发送多媒体消息
        conv.send({
            text: '图片测试',
            // 自定义的属性
            attr: {
                a:123
            },
            url: 'https://leancloud.cn/images/static/press/Logo%20-%20Blue%20Padding.png',
            metaData: {
                name:'logo',
                format:'png',
                height: 123,
                width: 123,
                size: 888
            }
        }, {
           type: 'image'
        }, function(data) {
            console.log('图片数据发送成功！');
        });

        // 取得当前 conv 中的人数
        conv.count(function(num) {
            console.log('取得当前的用户数量：' + num);
        });

        // 这是一个已有的对话，通过房间 id 生成它的对话实例
        convOld = rt.conv('55150e62e4b0d4d151ef12cf', function() {
            console.log('已经获取已有房间的实例');
        });

        convOld.add([
            'LeanCloud05', 'LeanCloud06'
        ], function(data) {
            console.log('已有的房间成功添加新的用户：', data);
        });

        bindReceive();
    });

    // 监听所有用户加入的情况
    rt.on('join', function(data) {
        console.log('有用户加入某个当前用户在的 Conversation：', data);
    });

    // 监听所有用户离开的情况
    rt.on('left', function(data) {
        console.log('有用户离开某个当前用户在的 Conversation：', data);
    });

    // 监听所有 Conversation 中发送的消息
    rt.on('message', function(data) {
        console.log('某个当前用户在的 Conversation 接收到消息：', data);
    });

    // 监听短信回执事件
    rt.on('receipt', function(data) {
        console.log('接收到消息阅读的回执：', data);
    });

    // 接收断线或者网络状况不佳的事件（断网可测试）
    rt.on('reuse', function() {
        console.log('正在重新连接。。。');
    });

    // 当然你可以关闭这一切
    // setTimeout(function() {
    //     rt.close();
    // }, 10000);

    var eventFun = function(data) {
        console.log('接收到自定义事件', data);
    };

    // 监听自定义事件
    rt.on('LeanCloud123', eventFun);

    // 取消绑定自定义事件
    rt.off('LeanCloud123', eventFun);

    // 派发自定义事件
    rt.emit('LeanCloud123', {
        test: 123
    });

}

function authFun(options, callback) {
    // 将以上签名必要参数及当前应用状态信息发送到应用服务器端做权限判
    // 端。关于签名的详细说明请查看文档：
    // https://github.com/leancloud/docs/blob/master/md/realtime_v2.md#%E4%BA%91%E4%BB%A3%E7%A0%81%E7%AD%BE%E5%90%8D%E8%8C%83%E4%BE%8B
    // 签名成功执行 callback({signature: '', nonce: '', timestamp: 123})
    // 签名被拒绝执行 callback() 即可
    // 云代码签名范例：https://github.com/leancloud/realtime-messaging-signature-cloudcode
    AV.realtime._tool.ajax({
        url: 'http://localhost:3000/sign2',
        data: {
            client_id: options.clientId,
            conv_id: options.convId,
            members: options.members,
            action: options.action
        },
        method: 'post'
    }, callback);
}

// demo 中输出代码
function showLog(msg, data) {
    if (data) {
        console.log(msg, data);
        msg = msg + '<span class="strong">' + JSON.stringify(data) + '</span>';
    } else {
        console.log(msg);
    }
    var div = document.getElementById('print-wall');
    var p = document.createElement('p');
    p.innerHTML = msg;
    div.appendChild(p);
}

var openBtn = document.getElementById('open-btn');
var sendBtn = document.getElementById('send-btn');
var changeIdBtn = document.getElementById('change-id-btn');
var changeNameBtn = document.getElementById('change-name-btn');

openBtn.addEventListener('click', function() {
    var val = document.getElementById('input-appId').value;
    if (val) {
        appId = val;
    }
    main();
});

sendBtn.addEventListener('click', sendMsg);

changeIdBtn.addEventListener('click', function() {
    var id = document.getElementById('input-cid').value;
    createNewRoom(id);
    alert('修改 Room id 成功！');
});

changeNameBtn.addEventListener('click', function() {
    clientId = document.getElementById('input-name').value;
    rt.close();
    rt = AV.realtime({
        appId: appId,
        clientId: clientId
    }, function() {
        var id = document.getElementById('input-cid').value;
        createNewRoom(id);
    });
});

function bindReceive() {
    var itemName = 'LeanCloud-realtime-sdk-demo-room-id';
    var id = localStorage.getItem(itemName);
    if (!id) {
        id = conv.id;
        localStorage.setItem(itemName, id);
    }
    document.getElementById('input-cid').value = id;
    document.getElementById('input-name').value = clientId;
    window.addEventListener('close', function() {
        localStorage.removeItem(itemName);
    });
    createNewRoom(id);
}

function createNewRoom(id) {
    convOld = rt.conv(id);
    showLog('房间的 id:  ' + id);
    convOld.join(function() {
        convOld.list(function(data) {
            showLog('当前 Conversation 的成员列表：', data);
        });
    });
    convOld.receive(function(data) {
        console.log(data);
        var text = '';
        if (data.msg.test) {
            text = data.msg.test;
        } else {
            text = JSON.stringify(data.msg);
        }
        showLog('朋友（' + data.fromPeerId + '）：', text);
    });
}

function sendMsg() {
    if (firstFlag) {
        alert('请先连接服务器！');
        return;
    }
    var input = document.getElementById('input-send');
    var val = input.value;
    convOld.send({
        test: val
    }, function(data) {
        input.value = '';
        showLog('自己（' + clientId + ')： ' , val);
        var dom = document.getElementById('print-wall');
        dom.scrollTop = dom.scrollHeight;
    });
}

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        sendMsg();
    }
});
