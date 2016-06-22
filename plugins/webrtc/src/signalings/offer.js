import { Signaling } from './signaling';
import { messageType } from '../realtime';

@messageType(-101)
export class Offer extends Signaling {}
