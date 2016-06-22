import { createCallStateMachine } from './call-state-machine';
import EventEmitter from 'eventemitter3';
import { Answer } from '../signalings/answer';
import { ICECandidate } from '../signalings/ice-candidate';
import { Refusal } from '../signalings/refusal';
import { Cancelation } from '../signalings/cancelation';

export default class Call extends EventEmitter {
  constructor(conversation, RTCConfiguration) {
    super();
    this._setConversation(conversation);
    this._peerConnection = this._createPeerConnection(RTCConfiguration);
    this._call = createCallStateMachine();
    this._promises = {};
    const streamReady = new Promise(resolve => {
      this._promises.resolveStreamReady = resolve;
    });
    const accept = new Promise(resolve => {
      this._promises.resolveAccept = resolve;
    });
    Promise.all([streamReady, accept]).then(([stream]) => {
      if (this._call.can('connect')) {
        this._call.connect();
        this.emit('connect', stream);
      }
    });
  }

  get state() {
    return this._call.current;
  }

  close() {
    return Promise.resolve().then(() => {
      this._call.close();
      this._destoryPeerConnection();
      this._peerConnection.close();
    });
  }

  _handleCloseEvent() {
    if (this._call.can('close')) {
      this.close();
      this.emit('close');
    }
  }

  _setConversation(conversation) {
    if (conversation) {
      this._conversation = conversation;
      conversation.on('message', this._handleMessage.bind(this));
    }
  }

  _createPeerConnection(RTCConfiguration) {
    const connection = new RTCPeerConnection(RTCConfiguration);
    connection.onicecandidate = this._handleICECandidateEvent.bind(this);
    connection.onaddstream = this._handleAddStreamEvent.bind(this);
    connection.onnremovestream = this._handleRemoveStreamEvent.bind(this);
    connection.oniceconnectionstatechange = this._handleICEConnectionStateChangeEvent.bind(this);
    connection.onsignalingstatechange = this._handleSignalingStateChangeEvent.bind(this);
    return connection;
  }

  _destoryPeerConnection() {
    const connection = this._peerConnection;
    delete connection.onaddstream;
    delete connection.onremovestream;
    delete connection.onnicecandidate;
    delete connection.oniceconnectionstatechange;
    delete connection.onsignalingstatechange;
  }

  _handleMessage(message) {
    if (message instanceof Answer) {
      return this._handleAnswer(message);
    }
    if (message instanceof Refusal) {
      return this._handleRefusal();
    }
    if (message instanceof Cancelation) {
      return this._handleCancelation();
    }
    if (message instanceof ICECandidate) {
      return this._handleICECandidate(message);
    }
    return false;
  }

  _handleICECandidate(message) {
    const candidate = new RTCIceCandidate(message.payload);
    if (this._peerConnection) {
      this._peerConnection.addIceCandidate(candidate)
        .catch(console.error.bind(console));
    }
  }

  _handleICECandidateEvent(event) {
    if (event.candidate && this._conversation) {
      return this._conversation.send(new ICECandidate(event.candidate))
        .catch(console.error.bind(console));
    }
    return false;
  }

  _handleAddStreamEvent(event) {
    this._promises.resolveStreamReady(event.stream);
  }

  _handleRemoveStreamEvent() {
    this._handleCloseEvent();
  }

  _handleICEConnectionStateChangeEvent() {
    switch (this._peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this._handleCloseEvent();
        break;
      default:
    }
  }

  _handleSignalingStateChangeEvent() {
    switch (this._peerConnection.signalingState) {
      case 'closed':
        this._handleCloseEvent();
        break;
      default:
    }
  }
}
