var rt;
var room;
var firstFlag = true;

// 创建聊天实例（支持单页多实例）
rt = AV.realtime({
    // 强将 appId 换为自己的 appId
    appId: '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm',
    // appId: 'pyon3kvufmleg773ahop2i7zy0tz2rfjx5bh82n7h5jzuwjg',
    clientId: 'LeanCloud111'
    // 是否开启服务器端认证
    // auth: authFun
});

// 当前 SDK 版本
console.log('欢迎使用 LeanCloud 实时通信，当前 SDK 版本是 ' + AV.realtime.version);

// 实时通信服务连接成功
rt.on('open', function() {
    console.log('实时通信服务建立成功！');

    // 因为断开重连还会触发一次 open 事件，所以用一个状态标记下
    if (firstFlag) {
        firstFlag = false;

        // 创建一个聊天室
        room = rt.room({
            // 人员的 id
            members: [
                'LeanCloud02'
            ],
            // 默认的数据，可以放房间名字等
            data: {
                m: 123
            }
        }, function(data) {
            if (data) {
                console.log('Room 创建成功!', data);
            }
        });

        // 查询当前房间的相关信息
        rt.query(function(data) {
            console.log('查询房间所有相关信息：', data);
        });
    }
});

// 当聊天断开时触发
rt.on('close', function() {
    console.log('实时通信服务被断开！');
});

// 当房间被创建时触发，当然您可以使用回调函数来处理，不一定要监听这个事件
rt.on('create', function(data) {
    // 当前用户加入这个房间
    room.join(function(data) {
        console.log('当前用户成功加入 Room');
    });
    // 向这个房间添加新的用户
    room.add([
        'LeanCloud03', 'LeanCloud04'
    ], function(data) {
        console.log('成功添加用户：', data);
    });

    // 从这个房间中删除用户
    room.remove('LeanCloud03', function(data) {
        console.log('成功删除用户：', data);
    });

    // 当前用户离开这个房间
    room.leave(function(data) {
        console.log('当前用户成功离开 Room');
    });

    // 向这个房间中发送消息
    room.send({
        abc: 123
    }, function(data) {
        console.log('发送的消息服务端已收收到：', data);

        // 查看历史消息
        room.log(function(data) {
            console.log('查看当前房间最近的聊天记录：', data);
        });
    });

    // 向这个房间中发送消息
    room.send({
        msg: '当前用户正在输入。。。'
    }, {
        transient: true
    }, function(data) {
        console.log('暂态消息的回调不会被运行');
    });

    // 当前房间接收到消息
    room.receive(function(data) {
        console.log('当前房间收到消息：', data);
    });

    // 获取当前房间中的成员信息
    room.list(function(data) {
        console.log('列出当前房间的成员列表：', data);
    });

    // 发送多媒体消息
    room.send({
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

    // 取得当前 Room 中的人数
    room.count(function(num) {
        console.log('取得当前的用户数量：' + num);
    });
});

// 监听所有用户加入的情况
rt.on('join', function(data) {
    console.log('有用户加入某个当前用户在的 Room：', data);
});

// 监听所有用户离开的情况
rt.on('left', function(data) {
    console.log('有用户离开某个当前用户在的 Room：', data);
});

// 监听所有房间中发送的消息
rt.on('message', function(data) {
    console.log('某个当前用户在的 Room 接收到消息：', data);
});

// 接收断线或者网络状况不佳的事件（断网可测试）
rt.on('reuse', function() {
    console.log('正在重新连接。。。');
});

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
