import { isCNApp } from '../src/utils';
import Realtime from '../src/realtime';

export const APP_ID =
  process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
export const APP_KEY =
  process.env.APP_KEY || 'xhiibo2eiyokjdu2y3kqcb7334rtw4x33zam98buxzkjuq5g';
const defaultServer = isCNApp ? 'https://js-rtm-test.jishuq.com' : undefined;
export const SERVER = process.env.SERVER ? process.env.SERVER : defaultServer;
export const EXISTING_ROOM_ID =
  process.env.EXSITING_ROOM_ID || '559d08a1e4b0a35bc5062ba1';
export const SYS_CONV_ID =
  process.env.SYS_CONV_ID || '5d9eae3542cda6006567ffc0';
export const NON_EXISTING_ROOM_ID = '555555555555555555555555';
export const CLIENT_ID = process.env.CLIENT_ID || 'leeyeh';

export const createRealtime = options =>
  new Realtime(
    Object.assign(
      {
        appId: APP_ID,
        appKey: APP_KEY,
        server: SERVER,
      },
      options
    )
  );
