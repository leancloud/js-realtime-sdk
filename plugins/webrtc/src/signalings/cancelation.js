import Signaling from './signaling';
import { messageType } from '../realtime';

@messageType(-105)
export default class Cancelation extends Signaling {}
