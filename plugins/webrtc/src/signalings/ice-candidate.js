import { Signaling } from './signaling';
import { messageType } from '../realtime';

@messageType(-103)
export class ICECandidate extends Signaling {}
