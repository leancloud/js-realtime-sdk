import Signaling from './signaling';
import { messageType } from '../realtime';

@messageType(-103)
export default class ICECandidate extends Signaling {}
