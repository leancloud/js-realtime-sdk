var rt;
var conv;

// 每次调用生成一个聊天实例
createNew('wangxiao111', function(data) {
    rt = data.realtime;
    conv = data.room;
});

function createNew(clientId, callback) {
    var rt;
    var conv;

    rt = lc.realtime({
        appId: '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm',
        // appId: 'pyon3kvufmleg773ahop2i7zy0tz2rfjx5bh82n7h5jzuwjg',
        clientId: clientId
        // auth: 'http://signature-example.avosapps.com/sign'
    });

    rt.on('open', function() {
        conv = rt.room({
            members: [
                'wangxiao02'
            ],
            data: {
                m: 123
            }
        }, function(result) {
            if (!result.avError) {
                console.log('conversation callback');
            }
        });
        callback({
            realtime: rt,
            room: conv
        });
    });

    rt.on('close', function() {
        console.log('close');
    });

    rt.on('new', function(data) {
        conv.join(function(data) {
            console.log('conversation joined callback');
        });

        conv.add([
            'wangxiao03', 'wangxiao04'
        ], function(data) {
            console.log('conversation added callback');
            console.log(data);
        });

        conv.remove('wangxiao03', function(data) {
            console.log('conversation removed callback');
            console.log(data);
        });
        
        conv.leave(function(data) {
            console.log('conversation leave callback');
        });
        
        conv.send({
            abc: 123
        }, function(data) {
            console.log('conversation ack callback');
            console.log(data);
        });
    });

    rt.on('join', function(data) {
        console.log('conversation join');
        console.log(data);
    });

    rt.on('left', function(data) {
        console.log('conversation left');
        console.log(data);
    });

    rt.on('message', function(data) {
        console.log('conversation message');
        console.log(data);
    });

    rt.on('log', function(data) {
        console.log('conversation logs');
        console.log(data);
    });

    rt.on('result', function(data) {
        console.log('conversation results');
        console.log(data);
    });
}

