import { Signaling } from './signaling';
import { messageType } from '../realtime';

@messageType(-105)
export class Cancelation extends Signaling {}
