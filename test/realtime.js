import 'should';
import 'should-sinon';
import should from 'should/as-function';
import Realtime from '../src/realtime';
import { testAsync } from './test-utils';

const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

const APP_ID = process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
const APP_KEY = process.env.APP_KEY || 'xhiibo2eiyokjdu2y3kqcb7334rtw4x33zam98buxzkjuq5g';
const REGION = process.env.REGION || 'cn';

describe('Realtime', () => {
  describe('constructor', () => {
    it('appKey required', () =>
      (() => new Realtime({ appId: APP_ID })).should.throw()
    );
    it('appId required', () =>
      (() => new Realtime({ appKey: APP_KEY })).should.throw()
    );
    it('normal', () =>
      (() => new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
      })).should.not.throw
    );
  });
  it('_connect', (done) => {
    const realtime = new Realtime({
      appId: APP_ID,
      appKey: APP_KEY,
      region: REGION,
      pushUnread: false,
    });
    realtime._connect().then(() => done(), done);
  });
  describe('endpoints cache', () => {
    it('getter/setter', (done) => {
      const realtime = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
      });
      should(realtime._getCache('__test')).be.null();
      realtime._setCache('__test', 1);
      realtime._getCache('__test').should.equal(1);
      realtime._setCache('__test', '1', 100);
      realtime._getCache('__test').should.equal('1');
      setTimeout(testAsync(() => {
        should(realtime._getCache('__test')).be.null();
        done();
      }, done), 110);
    });
    it('_getEndpoints should use cache', (done) => {
      const _fetchEndpointsInfo =
        sinon.spy(Realtime.prototype, '_fetchEndpointsInfo');
      const realtime = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
        region: REGION,
        pushUnread: false,
      });
      realtime._getEndpoints(realtime._options)
        .then(() => {
          _fetchEndpointsInfo.should.be.calledOnce();
        })
        .then(() => realtime._getEndpoints(realtime._options))
        .then(() => {
          _fetchEndpointsInfo.should.be.calledOnce();
          done();
        })
        .catch(done);
    });
  });
});
