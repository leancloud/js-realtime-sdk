import WebRTCClient from './webrtc-client';
import { Offer } from './signalings/offer';
import { Answer } from './signalings/answer';
import { ICECandidate } from './signalings/ice-candidate';
import { Refusal } from './signalings/refusal';
import { Cancelation } from './signalings/cancelation';

const messageClasses = [
  Offer,
  Answer,
  ICECandidate,
  Refusal,
  Cancelation,
];

const onRealtimeCreate = realtime => {
  // eslint-disable-next-line no-param-reassign
  realtime.createWebRTCClient = (id, clientOptions) =>
    new WebRTCClient(id)._open(realtime, clientOptions);
};

export const WebRTCPlugin = {
  messageClasses,
  onRealtimeCreate,
};
