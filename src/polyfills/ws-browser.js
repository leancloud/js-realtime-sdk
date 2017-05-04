import { global } from '../utils';

const WebSocket = global.WebSocket || global.MozWebSocket;
export default WebSocket;
