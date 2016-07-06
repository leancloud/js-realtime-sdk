import Call from './call';
import { Answer } from '../signalings/answer';
import { Refusal } from '../signalings/refusal';

export default class IncomingCall extends Call {
  constructor(offer, conversation, RTCConfiguration) {
    super(conversation, RTCConfiguration);
    this.from = offer.from;
    const desc = new RTCSessionDescription(offer.payload);
    this._handleOfferPromise = this._peerConnection.setRemoteDescription(desc);
  }

  accept(stream) {
    return this._handleOfferPromise
      .then(() => this._peerConnection.addStream(stream))
      .then(() => this._peerConnection.createAnswer())
      .then((answer) => this._peerConnection.setLocalDescription(answer))
      .then(() => this._conversation.send(new Answer(this._peerConnection.localDescription)))
      .then(() => this._promises.resolveAccept());
  }
  refuse() {
    return this._conversation.send(new Refusal()).then(() => {
      this._call.refuse();
      this.destroy();
    });
  }

  _handleCancelation() {
    this._call.cancel();
    this.emit('cancel');
    this.destroy();
  }
}
