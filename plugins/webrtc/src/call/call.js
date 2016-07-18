import EventEmitter from 'eventemitter3';
import createCallStateMachine from './call-state-machine';
import Answer from '../signalings/answer';
import ICECandidate from '../signalings/ice-candidate';
import Refusal from '../signalings/refusal';
import Cancelation from '../signalings/cancelation';

export default class Call extends EventEmitter {
  /**
   * {@link IncomingCall} 与 {@link OutgoingCall} 的基类
   * @abstract
   */
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
        /**
         * 通话连接成功
         * @event Call#connect
         * @param {MediaStream} stram 对方的媒体流
         */
        this.emit('connect', stream);
      }
    });
  }

  /**
   * 当前通话状态
   * （<code>calling</code>, <code>connected</code>, <code>closed</code>,
   * <code>refused</code>, <code>canceled</code>）
   * @type {string}
   * @readonly
   */
  get state() {
    return this._call.current;
  }

  /**
   * 结束通话
   * @return {Promise}
   */
  close() {
    return Promise.resolve().then(() => {
      this._call.close();
      this._destroyPeerConnection();
      this._peerConnection.close();
      this._destroy();
    });
  }

  _handleCloseEvent() {
    if (this._call.can('close')) {
      this.close();
      /**
       * 通话结束，可能是对方挂断或网络中断
       * @event Call#close
       */
      this.emit('close');
    }
  }

  _setConversation(conversation) {
    if (this._conversation) {
      this._conversation.off('message');
    }
    if (conversation) {
      this._conversation = conversation;
      conversation.on('message', this._handleMessage.bind(this));
    }
  }

  _destroy() {
    this._conversation.off('message');
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

  _destroyPeerConnection() {
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
  _handleAnswer() {
    throw new Error('not implemented');
  }
  _handleRefusal() {
    throw new Error('not implemented');
  }
  _handleCancelation() {
    throw new Error('not implemented');
  }
}
