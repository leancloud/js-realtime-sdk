import { Signaling } from './signaling';
import { messageType } from '../realtime';

@messageType(-102)
export class Answer extends Signaling {}
