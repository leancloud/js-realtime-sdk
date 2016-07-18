import Signaling from './signaling';
import { messageType } from '../realtime';

@messageType(-101)
export default class Offer extends Signaling {}
