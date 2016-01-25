/* jshint -W064 */
import 'should';
import 'should-sinon';
import Realtime from '../src/realtime';
import Should from 'should/as-function';
import { Promise } from 'rsvp';

var sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

var APP_ID = process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
var APP_KEY = process.env.APP_KEY || 'xhiibo2eiyokjdu2y3kqcb7334rtw4x33zam98buxzkjuq5g';
var REGION = process.env.REGION || 'cn';

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
