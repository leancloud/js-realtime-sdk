import Call from './call';
import Cancelation from '../signalings/cancelation';

export default class OutgoingCall extends Call {
  /**
   * 呼出的通话
   * @extends Call
   */
  constructor(to, conversation, RTCConfiguration) {
    super(conversation, RTCConfiguration);
    /**
     * 呼叫目标 id
     * @type {string}
     */
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
    /**
     * 呼叫被对方拒绝
     * @event OutgoingCall#refuse
     */
    this.emit('refuse');
    this._destroy();
  }

  /**
   * 取消该次呼叫
   * @return {Promise}
   */
  cancel() {
    this._call.cancel();
    return this._conversation.send(new Cancelation()).then(() => this._destroy());
  }

  /**
   * 结束通话，如果在 <code>calling</code> 状态，则取消该次呼叫
   * @return {Promise}
   */
  close() {
    if (this._call.can('cancel')) {
      return this.cancel();
    }
    return super.close();
  }

}
