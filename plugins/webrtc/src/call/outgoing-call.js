import Call from './call';
import { Cancelation } from '../signalings/cancelation';

export default class OutgoingCall extends Call {
  constructor(to, conversation, RTCConfiguration) {
    super(conversation, RTCConfiguration);
    this.to = to;
  }

  _handleAnswer(answer) {
    const desc = new RTCSessionDescription(answer.payload);
    this._peerConnection.setRemoteDescription(desc);
    this._promises.resolveAccept();
  }

  _handleRefusal() {
    this._destroyPeerConnection();
    this._call.refuse();
    this.emit('refuse');
    this.destroy();
  }

  cancel() {
    this._call.cancel();
    return this._conversation.send(new Cancelation()).then(() => this.destroy());
  }

  close() {
    if (this._call.can('cancel')) {
      return this.cancel();
    }
    return super.close();
  }

}
