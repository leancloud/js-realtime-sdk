import { Signaling } from './signaling';
import { messageType } from '../realtime';

@messageType(-104)
export class Refusal extends Signaling {}
