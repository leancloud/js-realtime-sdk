import Signaling from './signaling';
import { messageType } from '../realtime';

@messageType(-102)
export default class Answer extends Signaling {}
