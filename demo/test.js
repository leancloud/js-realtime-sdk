var rt;
var room;

// 创建聊天实例（支持单页多实例）
rt = lc.realtime({
    // 强将 appId 换为自己的 appId
    appId: '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm',
    // appId: 'pyon3kvufmleg773ahop2i7zy0tz2rfjx5bh82n7h5jzuwjg',
    clientId: 'wangxiao111'
    // auth: 'http://signature-example.avosapps.com/sign'
});

// 聊天连接成功
rt.on('open', function() {
    // 创建一个聊天室
    room = rt.room({
        // 人员的 id
        members: [
            'wangxiao02'
        ],
        // 默认的数据，可以放房间名字等
        data: {
            m: 123
        }
    }, function(result) {
        if (!result.avError) {
            console.log('conversation callback');
        }
    });

    // 查询当前房间的相关信息
    rt.query(function(data) {
        console.log('conversation results');
        console.log(data);
    });
});

// 当聊天断开时触发
rt.on('close', function() {
    console.log('close');
});

// 当房间被创建时触发，当然您可以使用回调函数来处理，不一定要监听这个事件
rt.on('create', function(data) {
    // 当前用户加入这个房间
    room.join(function(data) {
        console.log('conversation joined callback');
    });
    // 向这个房间添加新的用户
    room.add([
        'wangxiao03', 'wangxiao04'
    ], function(data) {
        console.log('conversation added callback');
        console.log(data);
    });

    // 从这个房间中删除用户
    room.remove('wangxiao03', function(data) {
        console.log('conversation removed callback');
        console.log(data);
    });

    // 当前用户离开这个房间    
    room.leave(function(data) {
        console.log('conversation leave callback');
    });
    
    // 向这个房间中发送消息
    room.send({
        abc: 123
    }, function(data) {
        console.log('conversation ack callback');
        console.log(data);

        // 查看历史消息
        room.log(function(data) {
            console.log('conversation logs callback');
            console.log(data);
        });

    });

    // 当前房间接收到消息
    room.receive(function(data) {
        console.log('conversation receive callback');        
        console.log(data);
    });
});

// 监听所有用户加入的情况
rt.on('join', function(data) {
    console.log('conversation join');
    console.log(data);
});

// 监听所有用户离开的情况
rt.on('left', function(data) {
    console.log('conversation left');
    console.log(data);
});

// 监听所有房间中发送的消息
rt.on('message', function(data) {
    console.log('conversation message');
    console.log(data);
});

