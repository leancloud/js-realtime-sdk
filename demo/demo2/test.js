// 请将 AppId 改为你自己的 AppId，否则无法本地测试
var appId = '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm';

// 每个客户端自定义的 id
var clientId = 'LeanCloud';
var roomId = '551a2847e4b04d688d73dc54';

var rt;
var room;

// 监听是否服务器连接成功
var firstFlag = true;

var openBtn = document.getElementById('open-btn');
var sendBtn = document.getElementById('send-btn');

openBtn.addEventListener('click', function() {
    var val = document.getElementById('input-name').value;
    if (val) {
        clientId = val;
    }
    main();
});

sendBtn.addEventListener('click', sendMsg);

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        sendMsg();
    }
});

function main() {

    // 创建实时通信实例
    rt = AV.realtime({
        appId: appId,
        clientId: clientId
    });

    // 监听连接成功事件
    rt.on('open', function() {
        firstFlag = false;
        showLog('服务器连接成功！');

        // 获得已有房间的实例
        room = rt.room(roomId);        

        // 当前用户加入这个房间
        room.join(function() {
            room.list(function(data) {
                showLog('当前 Conversation 的成员列表：', data);
            });
        });

        // 房间接受消息
        room.receive(function(data) {
            console.log(data);
            var text = '';
            if (data.msg.type) {
                text = data.msg.text;
            } else {
                text = JSON.stringify(data.msg);
            }
            showLog(data.fromPeerId + '： ', text);
        });

    });

    // 监听服务情况
    rt.on('resue', function() {
        showLog('服务器正在重连，请耐心等待。。。');
    });
}

function sendMsg() {

    // 如果没有连接过服务器
    if (firstFlag) {
        alert('请先连接服务器！');
        return;
    }
    var input = document.getElementById('input-send');
    var val = input.value;
    
    // 向这个房间发送消息，这段代码是兼容多终端格式的，包括 iOS、Android、Window Phone
    room.send({
        text: val
    }, {
        type: 'text'
    }, function(data) {

        // 发送成功之后的回调
        input.value = '';
        showLog('自己： ' , val);
        var dom = document.getElementById('print-wall');
        dom.scrollTop = dom.scrollHeight;
    });

    // 发送多媒体消息，如果想测试图片发送，可以打开注释    
    // room.send({
    //     text: '图片测试',
    //     // 自定义的属性
    //     attr: {
    //         a:123
    //     },
    //     url: 'https://leancloud.cn/images/static/press/Logo%20-%20Blue%20Padding.png',
    //     metaData: {
    //         name:'logo',
    //         format:'png',
    //         height: 123,
    //         width: 123,
    //         size: 888
    //     }
    // }, {
    //    type: 'image'
    // }, function(data) {
    //     console.log('图片数据发送成功！');
    // });
}

// demo 中输出代码
function showLog(msg, data) {
    if (data) {
        console.log(msg, data);
        msg = msg + '<span class="strong">' + encodeHTML(JSON.stringify(data)) + '</span>';
    } else {
        console.log(msg);
    }
    var div = document.getElementById('print-wall');
    var p = document.createElement('p');
    p.innerHTML = msg;
    div.appendChild(p);
}

function encodeHTML(source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/\\/g,'&#92;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}
