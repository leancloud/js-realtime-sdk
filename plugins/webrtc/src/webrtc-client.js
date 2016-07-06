import EventEmitter from 'eventemitter3';
import OutgoingCall from './call/outgoing-call';
import IncomingCall from './call/incoming-call';
import { Offer } from './signalings/offer';

const DEFAULT_RTCCONF = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
        'stun:stun.ekiga.net',
        'stun:stun.ideasip.com',
        'stun:stun.rixtelecom.se',
        'stun:stun.schlund.de',
        'stun:stun.stunprotocol.org:3478',
        'stun:stun.voiparound.com',
        'stun:stun.voipbuster.com',
        'stun:stun.voipstunt.com',
        'stun:stun.voxgratia.org',
      ],
    },
  ],
};


export default class WebRTCClient extends EventEmitter {
  constructor(id, options) {
    if (typeof id !== 'string') {
      throw new TypeError('id is not a string');
    }
    super();
    this.id = id;
    this.options = Object.assign({
      RTCConfiguration: DEFAULT_RTCCONF,
    }, options);
  }

  _open(realtime, clientOptions) {
    return realtime.createIMClient(this.id, clientOptions, 'webrtc').then(imClient => {
      this._imClient = imClient;
      imClient.on('message', (message, conversation) => {
        if (message instanceof Offer) {
          return this._handleOffer(message, conversation);
        }
        return false;
      });
      imClient.on('conflict', (...payload) => this.emit('conflict', ...payload));
      return this;
    });
  }

  close() {
    return this._imClient.close();
  }


  call(targetId, stream) {
    if (typeof targetId !== 'string') {
      throw new TypeError('target id is not a string');
    }
    if (!stream) {
      throw new TypeError('a MediaStream instance is required to make a call');
    }
    return this._imClient.ping([targetId])
      .then((onlineClients) => {
        if (!onlineClients.length) {
          throw new Error(`${targetId} is not online`);
        }
        const outgoingCall = new OutgoingCall(targetId, null, this.options.RTCConfiguration);
        const promise = new Promise((resolve) => {
          outgoingCall._peerConnection.onnegotiationneeded = resolve;
        });
        outgoingCall._peerConnection.addStream(stream);
        return promise
          .then(() =>
            Promise.all([
              this._imClient.createConversation({
                members: [targetId],
                unique: true,
              }),
              outgoingCall._peerConnection.createOffer().then((localDescription) => {
                outgoingCall._peerConnection.setLocalDescription(localDescription);
              }),
            ])
          )
          .then(([conversation]) => {
            outgoingCall._setConversation(conversation);
            return conversation.send(new Offer(outgoingCall._peerConnection.localDescription));
          })
          .then(() => outgoingCall);
      });
  }

  _handleOffer(offer, conversation) {
    const incomingCall = new IncomingCall(offer, conversation, this.options.RTCConfiguration);
    this.emit('call', incomingCall);
  }
}
