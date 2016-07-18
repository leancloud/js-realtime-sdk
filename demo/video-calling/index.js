var APP_ID = 'nOmzEDu7NtMDBXUJJhIw9bNs-gzGzoHsz';
var realtime = new AV.Realtime({
  appId: APP_ID,
  plugins: AV.WebRTCPlugin,
});

var mediaConstraints = {
  audio: true,
  video: true,
};

var vm = new Vue({
  el: '#app',
  data: {
    client: null,
    state: 0,
    id: '',
    targetId: '',
    incomingCall: null,
    currentCall: null,
    localVideoEnabled: true,
    localAudioEnabled: true,
    remoteAudioEnabled: true,
  },
  methods: {
    login: function login() {
      return realtime.createWebRTCClient(this.id).then(client => {
        this.client = client;
        client.on('call', call => {
          this.incomingCall = call;
          call.on('cancel', () => {
            this.incomingCall = null;
          });
        });
        client.on('conflict', () => {
          alert(client.id + ' logged in another device');
        })
        this.state = 'ready';
      }).catch(console.error.bind(console));
    },
    getLocalStream: function getLocalStream() {
      if (!this.localStream) {
        this.localStream = navigator.mediaDevices.getUserMedia(mediaConstraints);
        this.localStream.then((localStream) => {
          document.getElementById('local_video').srcObject = localStream;
          this.localAudio = localStream.getAudioTracks()[0];
          this.localVideo = localStream.getVideoTracks()[0];
        });
      }
      return this.localStream;
    },
    call: function call() {
      return this.getLocalStream().then(localStream => {
        if (this.targetId === '') {
          throw new Error('target id required');
        }
        if (!this.client) {
          throw new Error('not logged in');
        }
        document.getElementById('local_video').srcObject = localStream;
        return this.client.call(this.targetId, localStream);
      }).then(outgoingCall => {
        this.currentCall = outgoingCall;
        outgoingCall.on('connect', stream => {
          document.getElementById('remote_video').srcObject = stream;
          this.remoteAudio = stream.getAudioTracks()[0];
          this.state = 'connected';
        });
        outgoingCall.on('refuse', () => {
          alert(this.targetId + ' refused the call');
          this.reset();
        })
        outgoingCall.on('close', this.reset.bind(this));
        this.state = 'calling';
      }).catch(error => alert(error.message));
    },
    accept: function accept() {
      return this.getLocalStream().then(localStream => {
        var incomingCall = this.incomingCall;
        this.incomingCall = null;
        this.currentCall = incomingCall;
        this.targetId = incomingCall.from;
        this.state = 'connected';
        incomingCall.on('connect', stream => {
          document.getElementById('remote_video').srcObject = stream;
          this.remoteAudio = stream.getAudioTracks()[0];
        });
        incomingCall.on('close', this.reset.bind(this));
        return incomingCall.accept(localStream);
      }).catch(console.error.bind(console));
    },
    decline: function decline() {
      return this.incomingCall.refuse()
        .then(() => (this.incomingCall = null))
        .catch(console.error.bind(console));
    },
    hangup: function hungup() {
      this.currentCall.close();
      this.reset();
    },
    reset() {
      this.state = 'ready';
      var localVideo = document.getElementById('local_video');
      if (localVideo.srcObject) {
        localVideo.srcObject.getTracks().forEach(track => track.stop());
      }
      delete this.localStream;
      this.localVideoEnabled = true;
      this.localAudioEnabled = true;
      this.remoteAudioEnabled = true;
    },

    toggleCamera() {
      this.localVideoEnabled = !this.localVideoEnabled;
      this.localVideo.enabled = this.localVideoEnabled;
    },
    toggleMic() {
      this.localAudioEnabled = !this.localAudioEnabled;
      this.localAudio.enabled = this.localAudioEnabled;
    },
    toggleMuted() {
      this.remoteAudioEnabled = !this.remoteAudioEnabled;
      this.remoteAudio.enabled = this.remoteAudioEnabled;
    },
  },
});
