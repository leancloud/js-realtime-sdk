import 'should';
import 'should-sinon';
// import should from 'should/as-function';
import Realtime from '../src/realtime';
// import Connection from '../src/connection';
// import Client from '../src/client';
// import IMClient from '../src/im-client';
// import { testAsync } from './test-utils';
//
// const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

const APP_ID = process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
const APP_KEY = process.env.APP_KEY || 'xhiibo2eiyokjdu2y3kqcb7334rtw4x33zam98buxzkjuq5g';
const REGION = process.env.REGION || 'cn';

const CLIENT_ID = 'test-client';

describe('IMClient', () => {
  let client;
  before(() =>
    new Realtime({
      appId: APP_ID,
      appKey: APP_KEY,
      region: REGION,
      pushUnread: false,
    }).createIMClient(CLIENT_ID).then(c => {
      client = c;
    })
  );

  describe('ping', () => {
    it('type check', () => {
      (() => client.ping('1')).should.throw();
    });

    it('ping result', () =>
      client.ping(['non-exists-client-id', CLIENT_ID])
        .then(ids => {
          ids.should.eql([CLIENT_ID]);
        })
    );
  });
});
