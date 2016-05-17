import 'should';
import 'should-sinon';
import should from 'should/as-function';
import Realtime from '../src/realtime';
import IMClient from '../src/im-client';
import Conversation from '../src/conversation';
import Message from '../src/messages/message';

import { sinon } from './test-utils';

import {
  APP_ID,
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
      region: REGION,
      pushUnread: false,
    });
    return realtime
      .createIMClient(CLIENT_ID)
      .then(c => (client = c));
  });

  after(() => realtime._close());

  describe('create and close', () => {
    it('normal create and close', () => {
      const rt = new Realtime({
        appId: APP_ID,
        region: REGION,
        pushUnread: false,
      });
      const closeCallback = sinon.spy();
      return Promise.all([
        rt.createIMClient(42)
          .should.be.rejected(),
        rt.createIMClient()
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
          })
          .then(() => {
            closeCallback.should.be.calledOnce();
            rt._clients.should.not.have.properties(CLIENT_ID);
            rt._close();
          }),
      ]);
    });

    it('should be singleton', () =>
      realtime.createIMClient(CLIENT_ID).then(
        client1 => client1.should.be.exactly(client)
      )
    );

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

    it('with tag', done => {
      const ID = 'conflict-test-client';
      realtime.createIMClient(ID, undefined, 'TEST')
        .then(client1 => {
          client1.on('conflict', () => done());
          return new Realtime({
            appId: APP_ID,
            region: REGION,
            pushUnread: false,
          })
          .createIMClient(ID, undefined, 'TEST')
          .then(client2 => client2.close());
        }).catch(done);
    });
  });

  describe('ping', () => {
    it('should throw if type check failed', () => {
      (() => client.ping('1')).should.throw();
    });

    it('should only return online clients', () =>
      client.ping(['non-exists-client-id', CLIENT_ID])
        .then(ids => {
          ids.should.eql([CLIENT_ID]);
        })
    );

    it('should not request if get an empty ids list', () => {
      const send = sinon.spy(IMClient.prototype, '_send');
      return client.ping([])
        .then(ids => {
          ids.should.eql([]);
          send.should.not.be.called();
          send.restore();
        });
    });
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
    it('should always return the same conversation instance', () => {
      let anonymousClientConversatoin;
      let originConversation;
      return realtime.createIMClient().then(
          // 使用匿名 client 创建一个对话
          anonymousClient => anonymousClient.createConversation({
            members: [CLIENT_ID],
            name: 'avoscloud',
          })
        ).then(conversation => {
          // 查询这个对话
          anonymousClientConversatoin = conversation;
          return client.getConversation(conversation.id);
        }).then(conversation => {
          // 匿名 client 修改这个对话
          originConversation = conversation;
          return anonymousClientConversatoin
            .setName('leancloud')
            .save();
        }).then(
          // 再查询，应该返回原始对话
          () => client.getConversation(anonymousClientConversatoin.id)
        ).then(conversation => {
          conversation.should.be.exactly(originConversation);
          originConversation.name.should.be.eql('avoscloud');
          // 设置 noCache 查询，应该返回更新过的原始对话
          return client.getConversation(anonymousClientConversatoin.id, true);
        }).then(conversation => {
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
        .then(conversations => {
          conversations[0].lastMessage.should.be.instanceof(Message);
          return client.getQuery()
            .equalTo('objectId', EXISTING_ROOM_ID)
            .withLastMessagesRefreshed(false)
            .find();
        }).then(conversations => {
          conversations[0].lastMessage.should.be.instanceof(Message);
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
        unique: true,
      }))).then(conversations => {
        conversations[0].id.should.be.exactly(conversations[1].id);
      })
    );
    it('transient', () =>
      client.createConversation({
        name: 'transient room',
        members: ['hjiang', 'jfeng'],
        transient: true,
      }).then(conversation => {
        conversation.members.should.be.empty();
      })
    );
    it('members optional if transient', () =>
      client.createConversation({
        name: 'transient room',
        transient: true,
      })
    );
  });

  describe('markAllAsRead', () => {
    let conversation;
    before(() =>
      client.getConversation(EXISTING_ROOM_ID)
        .then(conv => (conversation = conv))
    );
    it('params check', () => {
      (() => client.markAllAsRead(conversation)).should.throw();
      (() => client.markAllAsRead([EXISTING_ROOM_ID])).should.throw();
      return client.markAllAsRead([]).should.be.fulfilledWith([]);
    });
    it('normal case', () =>
      client.markAllAsRead([conversation]).should.be.fulfilledWith([conversation])
    );
  });
});
