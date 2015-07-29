// 请将 AppId 改为你自己的 AppId，否则无法本地测试
var appId = '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm';

// 用来存储 realtimeObject
var rt;

// 用来存储创建好的 roomObject
var room;

var BOT_NAME = 'LeanEchoBot';

var demo = new Vue({
  el: '#demo',
  data: {
    clientId: '',
    connected: false,
    botOffline: false,
    draft: '',
    msgs:[],
    email: ['mai', 'to:y', 'i@', 'eanc', 'oud.rocks'].join('l')
  },
  methods: {
    connect: function(e) {
      e.preventDefault();
      console.log('connecting');
      rt = AV.realtime({
        appId: appId,
        clientId: this.$data.clientId
      });

      var self = this;

      rt.on('open', function() {
        // 检查时候在线
        rt.ping(BOT_NAME, function(result) {
          if (result.length === 0) {
            self.$data.botOffline = true;
          } else {
            self.$data.botOffline = false;
            // 新开一个会话
            rt.room({
              members: [BOT_NAME]
            }, function(result) {
              room = result;

              room.receive(function(msg) {
                console.log(msg);
                self.$data.msgs.push(msg);
              });
            });
            self.$data.connected = true;
            console.log('connected');
          }
        });
      });

    },
    send: function(e) {
      e.preventDefault();
      var self = this;
      var draft = this.$data.draft;
      this.$data.draft = '';
      room.send(draft, function() {
        var msg = {
          fromPeerId: self.$data.clientId,
          msg: draft
        };
        self.$data.msgs.push(msg);
      });
    }
  }
});
