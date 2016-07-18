import Call from './call';
import Answer from '../signalings/answer';
import Refusal from '../signalings/refusal';

export default class IncomingCall extends Call {
  /**
   * 呼入的通话
   * @extends Call
   */
  constructor(offer, conversation, RTCConfiguration) {
    super(conversation, RTCConfiguration);
    /**
     * 呼叫者 id
     * @type {string}
     */
    this.from = offer.from;
    const desc = new RTCSessionDescription(offer.payload);
    this._handleOfferPromise = this._peerConnection.setRemoteDescription(desc);
  }

  /**
   * 接受该呼入通话
   * @param  {MediaStream} stream 本地流媒体，参见 {@link https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API MediaStream}
   * @return {Promise}
   */
  accept(stream) {
    if (!stream) {
      throw new TypeError('a MediaStream instance is required to accept a call');
    }
    return this._handleOfferPromise
      .then(() => this._peerConnection.addStream(stream))
      .then(() => this._peerConnection.createAnswer())
      .then((answer) => this._peerConnection.setLocalDescription(answer))
      .then(() => this._conversation.send(new Answer(this._peerConnection.localDescription)))
      .then(() => this._promises.resolveAccept());
  }
  /**
   * 拒绝该呼入通话
   * @return {Promise}
   */
  refuse() {
    return this._conversation.send(new Refusal()).then(() => {
      this._call.refuse();
      this._destroy();
    });
  }

  _handleCancelation() {
    this._call.cancel();
    /**
     * 呼叫被对方取消
     * @event IncomingCall#cancel
     */
    this.emit('cancel');
    this._destroy();
  }
}
