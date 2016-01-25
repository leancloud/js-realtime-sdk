/* eslint-disable no-unused-expressions */
import 'should';
import 'should-sinon';
import Realtime from '../src/realtime';

const APP_ID = process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
const APP_KEY = process.env.APP_KEY || 'xhiibo2eiyokjdu2y3kqcb7334rtw4x33zam98buxzkjuq5g';
const REGION = process.env.REGION || 'cn';

describe('Realtime', () => {
  it('_connect', (done) => {
    const realtime = new Realtime({
      appId: APP_ID,
      appKey: APP_KEY,
      region: REGION,
      pushUnread: false,
    });
    realtime._connect().then(() => done(), done);
  });
});
