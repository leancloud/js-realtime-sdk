import Signaling from './signaling';
import { messageType } from '../realtime';

@messageType(-104)
export default class Refusal extends Signaling {}
