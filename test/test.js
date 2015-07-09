// 请将 AppId 改为你自己的 AppId
var appId = '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm';

var clientId = 'js-realtime-sdk-test';
var convName = 'js-realtime-sdk-testconv';

// 创建聊天实例
rt = AV.realtime({
    appId: appId,
    clientId: clientId,
    encodeHTML: true
});


describe('RealtimeObject', function () {
    describe('conv()', function () {
        it('RoomObject instance should be cached', function (done) {
            this.timeout(5000);
            rt.on('open', function () {
                var conv = rt.conv({
                    name: convName,
                }, function (conv1) {
                    console.log('new conv created: ', conv);
                    rt.conv(conv1.id, function(conv2) {
                        Should(conv1).be.exactly(conv2);
                        done();
                    });
                });
            });
        });
    });
});
