import 'should';
import 'should-sinon';
import should from 'should/as-function';
import Realtime from '../src/realtime';
import IMClient from '../src/im-client';
import { Conversation, ChatRoom } from '../src/conversations';
import Message from '../src/messages/message';
import SessionManager from '../src/session-manager';
import { Expirable } from '../src/utils';

import { sinon, listen, series } from './test-utils';

import {
  APP_ID,
  APP_KEY,
  REGION,
  EXISTING_ROOM_ID,
  NON_EXISTING_ROOM_ID,
  CLIENT_ID,
} from './configs';

describe('IMClient', () => {
  let client;
  let realtime;
  before(() => {
    realtime = new Realtime({
      appId: APP_ID,
      appKey: APP_KEY,
      region: REGION,
    });
    return realtime
      .createIMClient(CLIENT_ID)
      .then((c) => { client = c; });
  });

  after(() => realtime._close());

  describe('create and close', () => {
    it('normal create and close', () => {
      const rt = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
        region: REGION,
      });
      const closeCallback = sinon.spy();
      return Promise.all([
        rt.createIMClient(42)
          .should.be.rejected(),
        rt.createIMClient()
          .then((client1) => {
            client1.should.be.instanceof(IMClient);
            client1.id.should.be.a.String();
            rt._IMClients.should.have.properties(client1.id);
          })
          .then(() => rt.createIMClient(CLIENT_ID))
          .then((client2) => {
            client2.on('close', closeCallback);
            client2.id.should.be.equal(CLIENT_ID);
            rt._IMClients.should.have.properties(CLIENT_ID);
            return client2.close();
          })
          .then(() => {
            closeCallback.should.be.calledOnce();
            rt._IMClients.should.not.have.properties(CLIENT_ID);
            rt._close();
          }),
      ]);
    });

    it('should be singleton', () =>
      realtime.createIMClient(CLIENT_ID).then(client1 => client1.should.be.exactly(client)));

    describe('with signatureFactory', () => {
      it('normal case', () => {
        const signatureFactory = sinon.stub().returns({
          signature: 'signature',
          timestamp: Date.now(),
          nonce: 'nonce',
        });
        return realtime
          .createIMClient('ycui', {
            signatureFactory,
          })
          .then(() => {
            signatureFactory.should.be.calledWith('ycui');
          });
      });
    });

    it('with tag', (done) => {
      const ID = 'conflict-test-client';
      realtime.createIMClient(ID, undefined, 'TEST')
        .then((client1) => {
          client1.on('conflict', () => done());
          return new Realtime({
            appId: APP_ID,
            appKey: APP_KEY,
            region: REGION,
          }).createIMClient(ID, undefined, 'TEST')
            .then(client2 => client2.close());
        }).catch(done);
    });
  });

  describe('ping', () => {
    it('should throw if type check failed', () =>
      client.ping('1').should.be.rejected());

    it('should only return online clients', () =>
      client.ping(['non-exists-client-id', CLIENT_ID])
        .then((ids) => {
          ids.should.eql([CLIENT_ID]);
        }));

    it('should not request if get an empty ids list', () => {
      const send = sinon.spy(IMClient.prototype, '_send');
      return client.ping([])
        .then((ids) => {
          ids.should.eql([]);
          send.should.not.be.called();
          send.restore();
        });
    });
  });

  describe('getConversation', () => {
    it('param check', async () => {
      await client.getConversation().should.be.rejected();
      await client.getConversation(1).should.be.rejected();
    });
    it('should return null if no match', () =>
      client.getConversation(NON_EXISTING_ROOM_ID).then((conversation) => {
        should(conversation).be.null();
      }));
    it('should match one conversation', () =>
      client.getConversation(EXISTING_ROOM_ID).then((conversation) => {
        conversation.should.be.instanceof(Conversation);
        conversation.id.should.be.equal(EXISTING_ROOM_ID);
        conversation.createdAt.should.be.a.Date();
        conversation.updatedAt.should.be.a.Date();
        conversation.lastMessageAt.should.be.a.Date();
      }));
    it('should always return the same conversation instance', () => {
      let anonymousClientConversatoin;
      let originConversation;
      return realtime.createIMClient().then(anonymousClient =>
        // 使用匿名 client 创建一个对话
        anonymousClient.createConversation({
          members: [CLIENT_ID],
          name: 'avoscloud',
        })).then((conversation) => {
        // 查询这个对话
        anonymousClientConversatoin = conversation;
        return client.getConversation(conversation.id);
      }).then((conversation) => {
        // 匿名 client 修改这个对话
        originConversation = conversation;
        return anonymousClientConversatoin
          .set('name', 'leancloud')
          .save();
      }).then(() =>
        // 再查询，应该返回原始对话
        client.getConversation(anonymousClientConversatoin.id)).then((conversation) => {
        conversation.should.be.exactly(originConversation);
        originConversation.name.should.be.eql('avoscloud');
        // 设置 noCache 查询，应该返回更新过的原始对话
        return client.getConversation(anonymousClientConversatoin.id, true);
      }).then((conversation) => {
        conversation.should.be.exactly(originConversation);
        originConversation.name.should.be.eql('leancloud');
      });
    });
    // https://github.com/leancloud/js-realtime-sdk/issues/229
    it('should update properties', () =>
      client.getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .withLastMessagesRefreshed(true)
        .find()
        .then((conversations) => {
          conversations[0].lastMessage.should.be.instanceof(Message);
          return client.getQuery()
            .equalTo('objectId', EXISTING_ROOM_ID)
            .withLastMessagesRefreshed(false)
            .find();
        }).then((conversations) => {
          conversations[0].lastMessage.should.be.instanceof(Message);
        }));
    it('getConversations', () =>
      client.getConversations([NON_EXISTING_ROOM_ID, EXISTING_ROOM_ID, EXISTING_ROOM_ID])
        .then(([nonExistingConv, existingConv1, existingConv2]) => {
          should(nonExistingConv).be.null();
          existingConv1.id.should.eql(EXISTING_ROOM_ID);
          existingConv2.should.be.exactly(existingConv1);
        }));
  });

  describe('createConversation', () => {
    it('should create a conversation', () =>
      client.createConversation({
        members: ['hjiang'],
        name: '135',
        attributes: {
          foo: 'bar',
        },
        baz: 'qux',
      }).then((conversation) => {
        conversation.should.be.instanceof(Conversation);
        conversation.members.should.have.length(2);
        conversation.members.should.containDeep(['hjiang', CLIENT_ID]);
        conversation.createdAt.should.be.a.Date();
        conversation.updatedAt.should.be.a.Date();
        should(conversation.lastMessageAt).be.null();
        conversation.name.should.be.equal('135');
        conversation.get('attributes').should.eql({ foo: 'bar' });
        conversation.get('baz').should.eql('qux');
      }));
    it('members required', () =>
      client.createConversation().should.be.rejected());
    it('unique', () =>
      series([0, 0].map(() => () => client.createConversation({
        name: 'unique room',
        members: ['hjiang', 'jfeng'],
        unique: true,
      }))).then((conversations) => {
        conversations[0].should.be.exactly(conversations[1]);
      }));
    it('transient', () =>
      client.createChatRoom({
        name: 'transient room',
      }).then((conversation) => {
        conversation.should.be.instanceof(ChatRoom);
        conversation.members.should.be.empty();
      }));
    it('createConversation with transient option ', () =>
      client.createConversation({
        name: 'transient room',
        transient: true,
      }).then((conversation) => {
        conversation.should.be.instanceof(ChatRoom);
        conversation.members.should.be.empty();
      }));
  });

  describe('session token', () => {
    const FAKE_TOKEN = 'fake_session_token';
    const EXPIRED_SESSION_TOKEN = 'expired_session_token';
    it('get/set/revoke', async () => {
      const sm = new SessionManager();
      sm.setSessionToken(FAKE_TOKEN, 1000);
      const token = await sm.getSessionToken();
      token.should.be.eql(FAKE_TOKEN);
      sm.revoke();
      const revokedToken = await sm.getSessionToken();
      revokedToken.should.be.eql(Expirable.EXPIRED);
    });
    it('setAsync', async () => {
      const sm = new SessionManager();
      await sm.setSessionTokenAsync(Promise.resolve([FAKE_TOKEN, 1000]));
      const token = await sm.getSessionToken();
      token.should.be.eql(FAKE_TOKEN);
    });
    it('setAsyncRejected', async () => {
      const sm = new SessionManager();
      sm.setSessionToken(FAKE_TOKEN, 1000);
      try {
        await sm.setSessionTokenAsync(Promise.reject(new Error('fetch session token error')));
      } catch (error) {
        // ignore
      }
      const token = await sm.getSessionToken();
      token.should.be.eql(FAKE_TOKEN);
    });
    it('refresh', async () => {
      const refresh = sinon.stub().returns(Promise.resolve([FAKE_TOKEN, 1000]));
      const sm = new SessionManager({
        refresh,
      });
      sm.setSessionToken(EXPIRED_SESSION_TOKEN, 0);
      const token = await sm.getSessionToken();
      token.should.be.eql(FAKE_TOKEN);
      refresh.should.be.calledWith(sm, EXPIRED_SESSION_TOKEN);
    });
    describe('reconnect with session token', () => {
      beforeEach(function setupSpy() {
        this.spy = sinon.spy(client, '_open');
      });
      afterEach(function setupSpy() {
        this.spy.restore();
      });
      it('normal case', function () {
        client._connection.disconnect();
        return listen(client, 'reconnect').then(() => {
          this.spy.should.be.called();
        });
      });
      it('session token expired', function () {
        // Magic
        client._sessionManager.setSessionToken(EXPIRED_SESSION_TOKEN, 1000);
        client._connection.disconnect();
        return listen(client, 'reconnect').then(() => {
          this.spy.should.be.calledTwice();
        });
      });
    });
  });
});
