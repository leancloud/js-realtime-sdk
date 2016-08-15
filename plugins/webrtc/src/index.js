/* eslint-disable import/prefer-default-export */
/** @module leancloud-realtime-plugin-webrtc */
import WebRTCClient from './webrtc-client';
import Offer from './signalings/offer';
import Answer from './signalings/answer';
import ICECandidate from './signalings/ice-candidate';
import Refusal from './signalings/refusal';
import Cancelation from './signalings/cancelation';
import { name } from '../package.json';

const messageClasses = [
  Offer,
  Answer,
  ICECandidate,
  Refusal,
  Cancelation,
];

const onRealtimeCreate = realtime => {
  /**
   * 创建一个 WebRTC 客户端，多次创建相同 id 的客户端会返回同一个实例。应用 WebRTC 插件后，Realtime 类会增加该实例方法。
   * WebRTC 客户端是单点登录的，既在同一时刻，同一个 id 只允许一个客户端在线，后登录的客户端会将原来在线上的客户端踢下线。
   * @function createWebRTCClient
   * @global
   * @param  {String} id 客户端 id
   * @param  {Object} [clientOptions] 详细参数 @see {@link IMClient}
   * @param  {Object} [clientOptions.RTCConfiguration] @see {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCConfiguration RTCConfiguration}
   * @return {Promise.<WebRTCClient>}
   */
  // eslint-disable-next-line no-param-reassign
  realtime.createWebRTCClient = (id, clientOptions) =>
    new WebRTCClient(id)._open(realtime, clientOptions);
};

/**
 * WebRTC 插件，使用后可通过 {@link createWebRTCClient Realtime#createWebRTCClient}
 * 创建 {@link WebRTCClient} 实现音视频通话
 * @example
 * var realtime = new Realtime({
 *   appId: appId,
 *   plugins: WebRTCPlugin,
 * });
 * realtime.createWebRTCClient(id);
 */
export const WebRTCPlugin = {
  name,
  messageClasses,
  onRealtimeCreate,
};

/**
 * 当前浏览器是否支持 WebRTC 的标记
 * @type {Boolean}
 */
export const isWebRTCSupported = !!(
  window.RTCPeerConnection
  && window.RTCSessionDescription
  && window.RTCIceCandidate
);
