import 'should';
import 'should-sinon';
import should from 'should/as-function';
import { Promise } from 'rsvp';
import Realtime from '../src/realtime';
import IMClient from '../src/im-client';
import Conversation from '../src/conversation';

const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

const APP_ID = process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
const APP_KEY = process.env.APP_KEY || 'xhiibo2eiyokjdu2y3kqcb7334rtw4x33zam98buxzkjuq5g';
const REGION = process.env.REGION || 'cn';
const EXISTING_ROOM_ID = process.env.EXSITING_ROOM_ID || '559d08a1e4b0a35bc5062ba1';
const NON_EXISTING_ROOM_ID = '555555555555555555555555';
const CLIENT_ID = 'leeyeh';

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
      .then(c => (client = c));
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

  describe('getConversation', () => {
    it('param check', () => {
      (() => client.getConversation()).should.throw();
      (() => client.getConversation(1)).should.throw();
    });
    it('should return null if no match', () =>
      client.getConversation(NON_EXISTING_ROOM_ID).then(conversation => {
        should(conversation).be.null();
      })
    );
    it('should match one conversation', () =>
      client.getConversation(EXISTING_ROOM_ID).then(conversation => {
        conversation.should.be.instanceof(Conversation);
        conversation.id.should.be.equal(EXISTING_ROOM_ID);
        conversation.createdAt.should.be.a.Date();
        conversation.updatedAt.should.be.a.Date();
        conversation.lastMessageAt.should.be.a.Date();
      })
    );
    it('should use cache', () =>
      Promise.all([
        client.getConversation(EXISTING_ROOM_ID),
        client.getConversation(EXISTING_ROOM_ID),
      ]).then(conversations => {
        conversations[0].should.be.exactly(conversations[1]);
      })
    );
  });

  describe('createConversation', () => {
    it('should create a conversation', () =>
      client.createConversation({
        members: ['hjiang'],
        name: '135',
        attributes: {
          foo: 'bar',
        },
      }).then(conversation => {
        conversation.should.be.instanceof(Conversation);
        conversation.members.should.have.length(2);
        conversation.members.should.containDeep(['hjiang', CLIENT_ID]);
        conversation.createdAt.should.be.a.Date();
        conversation.updatedAt.should.be.a.Date();
        should(conversation.lastMessageAt).be.null();
        conversation.name.should.be.equal('135');
        conversation.attributes.should.be.eql({ foo: 'bar' });
      })
    );
    it('members required', () => {
      (() => client.createConversation()).should.throw();
    });
    it('unique', () =>
      Promise.all([0, 0].map(() => client.createConversation({
        name: 'unique room',
        members: ['hjiang', 'jfeng'],
        isUnique: true,
      }))).then(conversations => {
        conversations[0].id.should.be.exactly(conversations[1].id);
      })
    );
  });
});
