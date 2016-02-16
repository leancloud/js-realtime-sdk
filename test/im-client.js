import 'should';
import 'should-sinon';
// import should from 'should/as-function';
import Realtime from '../src/realtime';
// import Connection from '../src/connection';
// import Client from '../src/client';
import IMClient from '../src/im-client';
// import { testAsync } from './test-utils';
//
const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

const APP_ID = process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
const APP_KEY = process.env.APP_KEY || 'xhiibo2eiyokjdu2y3kqcb7334rtw4x33zam98buxzkjuq5g';
const REGION = process.env.REGION || 'cn';

const CLIENT_ID = 'test-client';

describe('IMClient', () => {
  let client;
  let realtime;
  before(() => {
    realtime = new Realtime({
      appId: APP_ID,
      appKey: APP_KEY,
      region: REGION,
      pushUnread: false,
    });
    return realtime
      .createIMClient(CLIENT_ID)
      .then(c => client = c);
  });

  describe('create and close', () => {
    it('create and close', () => {
      const rt = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
        region: REGION,
        pushUnread: false,
      });
      return rt
        .createIMClient()
        .then(client1 => {
          client1.should.be.instanceof(IMClient);
          client1.id.should.be.a.String();
          rt._clients.should.have.properties(client1.id);
        })
        .then(() => rt.createIMClient(CLIENT_ID))
        .then(client2 => {
          client2.id.should.be.equal(CLIENT_ID);
          rt._clients.should.have.properties(CLIENT_ID);
          return client2.close();
        }).then(() => {
          rt._clients.should.not.have.properties(CLIENT_ID);
        });
    });

    describe('with signitureFactory', () => {
      it('normal case', () => {
        const signatureFactory = sinon.stub().returns({
          signature: 'signature',
          timestamp: Date.now(),
          nonce: 'nonce',
        });
        return realtime
          .createIMClient(CLIENT_ID, {
            signatureFactory,
          })
          .should.be.fulfilled()
          .then(() => {
            signatureFactory.should.be.calledWith(CLIENT_ID);
          });
      });
      it('malformed signature', () =>
        realtime
          .createIMClient(CLIENT_ID, {
            signatureFactory: () => undefined,
          })
          .should.be.rejectedWith('malformed signature')
      );
      it('signitureFactory throws', () =>
        realtime
          .createIMClient(CLIENT_ID, {
            signatureFactory: () => {
              throw new Error('error message');
            },
          })
          .should.be.rejectedWith('signitureFactory error: error message')
      );
    });
  });

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
