// 请将 AppId 改为你自己的 AppId，否则无法本地测试
var appId = '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm';

// 请换成你自己的一个房间的 conversation id
var roomId = '551a2847e4b04d688d73dc54';

// 每个客户端自定义的 id
var clientId = 'LeanCloud';

// 用来存储 realtimeObject
var rt;

// 用来存储创建好的 roomObject
var room;

// 监听是否服务器连接成功
var firstFlag = true;

// 用来标记历史消息获取状态
var logFlag = false;

var openBtn = document.getElementById('open-btn');
var sendBtn = document.getElementById('send-btn');
var inputName = document.getElementById('input-name');
var inputSend = document.getElementById('input-send');
var printWall = document.getElementById('print-wall');

// 拉取历史相关
// 最早一条消息的时间戳
var msgTime;

bindEvent(openBtn, 'click', main);
bindEvent(sendBtn, 'click', sendMsg);

bindEvent(document.body, 'keydown', function(e) {
    if (e.keyCode === 13) {
        if (firstFlag) {
            main();
        } else {
            sendMsg();
        }
    }
});

function main() {
    showLog('正在链接服务器，请等待。。。');
    var val = inputName.value;
    if (val) {
        clientId = val;
    }
    if (!firstFlag) {
        rt.close();
    }

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
        rt.room(roomId, function(object) {

            // 判断服务器端是否存在这个 room，如果存在
            if (object) {
                room = object;

                // 当前用户加入这个房间
                room.join(function() {

                    // 获取成员列表
                    room.list(function(data) {
                        showLog('当前 Conversation 的成员列表：', data);

                        // 获取聊天历史
                        getLog();
                    });
                });

                // 房间接受消息
                room.receive(function(data) {
                    if (!msgTime) {
                        // 存储下最早的一个消息时间戳
                        msgTime = data.timestamp;
                    }
                    var text = '';
                    if (data.msg.type) {
                        text = data.msg.text;
                    } else {
                        text = data.msg;
                    }
                    showLog(data.fromPeerId + '： ', text);
                });
            }
        });
    });

    // 监听服务情况
    rt.on('reuse', function() {
        showLog('服务器正在重连，请耐心等待。。。');
    });
}

function sendMsg() {

    // 如果没有连接过服务器
    if (firstFlag) {
        alert('请先连接服务器！');
        return;
    }
    var val = inputSend.value;

    // 向这个房间发送消息，这段代码是兼容多终端格式的，包括 iOS、Android、Window Phone
    room.send({
        text: val
    }, {
        type: 'text'
    }, function(data) {

        // 发送成功之后的回调
        inputSend.value = '';
        showLog('自己： ' , val);
        printWall.scrollTop = printWall.scrollHeight;
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

// 拉取历史
bindEvent(printWall, 'scroll', function(e) {
    if (printWall.scrollTop < 10) {
        getLog();
    }
});

// 获取消息历史
function getLog() {
    var height = printWall.scrollHeight;
    if (logFlag) {
        return;
    } else {
        // 标记正在拉取
        logFlag = true;
    }
    room.log({
        t: msgTime
    }, function(data) {
        logFlag = false;
        // 存储下最早一条的消息时间戳
        var l = data.length;
        if (l) {
            msgTime = data[0].timestamp;
        }
        for (var i = l - 1; i >= 0; i --) {
            var from = data[i].from;
            var text = '';
            if (data[i].data.type) {
                text = data[i].data.text;
            } else {
                text = data[i].data;
            }
            if (data[i].from === clientId) {
                from = '自己';
            }
            showLog(from + '： ', text, true);
        }
        printWall.scrollTop = printWall.scrollHeight - height;
    });
}

// demo 中输出代码
function showLog(msg, data, isBefore) {
    if (data) {
        // console.log(msg, data);
        msg = msg + '<span class="strong">' + encodeHTML(JSON.stringify(data)) + '</span>';
    }
    var p = document.createElement('p');
    p.innerHTML = msg;
    if (isBefore) {
        printWall.insertBefore(p, printWall.childNodes[0]);
    } else {
        printWall.appendChild(p);
    }
}

function encodeHTML(source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;');
        // .replace(/\\/g,'&#92;')
        // .replace(/"/g,'&quot;')
        // .replace(/'/g,'&#39;');
}

function bindEvent(dom, eventName, fun) {
    if (window.addEventListener) {
        dom.addEventListener(eventName, fun);
    } else {
        dom.attachEvent('on' + eventName, fun);
    }
}
