import 'should';
import 'should-sinon';
import should from 'should/as-function';
import { Promise } from 'rsvp';
import Realtime from '../src/realtime';
// import Connection from '../src/connection';
// import Client from '../src/client';
import IMClient from '../src/im-client';
import ConversationQuery from '../src/conversation-query';
// import { testAsync } from './test-utils';
//
const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

const APP_ID = process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
const APP_KEY = process.env.APP_KEY || 'xhiibo2eiyokjdu2y3kqcb7334rtw4x33zam98buxzkjuq5g';
const REGION = process.env.REGION || 'cn';
const EXSITING_ROOM_ID = process.env.EXSITING_ROOM_ID || '559d08a1e4b0a35bc5062ba1';
const NON_EXSITING_ROOM_ID = '555555555555555555555555';
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
      const closeCallback = sinon.spy();
      return rt
        .createIMClient()
        .then(client1 => {
          client1.should.be.instanceof(IMClient);
          client1.id.should.be.a.String();
          rt._clients.should.have.properties(client1.id);
        })
        .then(() => rt.createIMClient(CLIENT_ID))
        .then(client2 => {
          client2.on('close', closeCallback);
          client2.id.should.be.equal(CLIENT_ID);
          rt._clients.should.have.properties(CLIENT_ID);
          return client2.close();
        }).then(() => {
          closeCallback.should.be.calledOnce();
          rt._clients.should.not.have.properties(CLIENT_ID);
        });
    });

    describe('with signatureFactory', () => {
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
      it('signatureFactory throws', () =>
        realtime
          .createIMClient(CLIENT_ID, {
            signatureFactory: () => {
              throw new Error('error message');
            },
          })
          .should.be.rejectedWith('signatureFactory error: error message')
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

  describe('query', () => {
    it('should be a ConversationQuery', () => {
      client.getQuery().should.be.instanceof(ConversationQuery);
    });
    it('should match one conversation', () =>
      client.getQuery().equalTo('objectId', EXSITING_ROOM_ID).find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXSITING_ROOM_ID);
        })
    );
  });

  describe('getConversation', () => {
    it('should return null if no match', () =>
      client.getConversation(NON_EXSITING_ROOM_ID).then(conversation => {
        should(conversation).be.null();
      })
    );
    it('should match one conversation', () =>
      client.getConversation(EXSITING_ROOM_ID).then(conversation => {
        conversation.id.should.be.equal(EXSITING_ROOM_ID);
      })
    );
    it('should use cache', () =>
      Promise.all([
        client.getConversation(EXSITING_ROOM_ID),
        client.getConversation(EXSITING_ROOM_ID),
      ]).then(conversations => {
        conversations[0].should.be.exactly(conversations[1]);
      })
    );
  });
});
