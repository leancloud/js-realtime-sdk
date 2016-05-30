import Realtime from '../src/realtime';
import { tap } from '../src/utils';
import uuid from 'uuid';
import {
  GenericCommand,
  ConvCommand,
} from '../proto/message';
import Message from '../src/messages/message';

import {
  APP_ID,
  REGION,
  EXISTING_ROOM_ID,
  CLIENT_ID,
} from './configs';

import { listen, sinon } from './test-utils';

describe('Conversation', () => {
  let realtime;
  let client;
  let conversation;
  before(() => {
    realtime = new Realtime({
      appId: APP_ID,
      region: REGION,
    });
    return realtime.createIMClient(CLIENT_ID)
      .then(c => {
        client = c;
        return client.getConversation(EXISTING_ROOM_ID);
      })
      .then(conv => (conversation = conv));
  });
  after(() => client.close());

  it('update', () => {
    const timestamp = Date.now();
    const name = conversation.name;
    return Promise.resolve(conversation).then(conv => {
      conv.name = name;
      conv.attributes = {
        timestamp,
      };
      return conv.save();
    }).then(conv => {
      conv.should.be.exactly(conversation);
      conv.name.should.be.equal(name);
      conv.attributes.should.be.eql({ timestamp });
      return conv
        .setAttributes({ lean: 'cloud' }, true)
        .setAttribute('lee', 'yeh')
        .save();
    }).then(conv => {
      conv.name.should.be.equal(name);
      conv.attributes.should.be.eql({
        timestamp,
        lean: 'cloud',
        lee: 'yeh',
      });
      return conv.save();
    });
  });

  it('fetch', () => {
    const { name, createdAt } = conversation;
    conversation.name = 'should not be this name';
    conversation.createdAt = new Date();
    return conversation.fetch().then(conv => {
      conv.name.should.be.equal(name);
      conv.createdAt.should.be.eql(createdAt);
      conv.should.be.exactly(conversation);
    });
  });

  it('mute', () =>
    conversation.mute().then(conv => {
      conv.should.be.exactly(conversation);
      conv.muted.should.be.equal(true);
      conv.mutedMembers.should.containEql(CLIENT_ID);
    })
  );
  it('unmute', () =>
    conversation.unmute().then(conv => {
      conv.should.be.exactly(conversation);
      conv.muted.should.be.equal(false);
      conv.mutedMembers.should.not.containEql(CLIENT_ID);
    })
  );
  it('count', () => conversation.count().should.be.fulfilledWith(2));
  it('add/remove', () =>
    client.createConversation({ members: ['nsun'] })
      .then(conv => conv.add('rguo'))
      .then(conv => {
        conv.members.should.containEql('rguo');
        return conv.remove('rguo');
      }).then(conv => {
        conv.members.should.not.containEql('rguo');
      })
  );
  it('join/quit', () =>
    client.createConversation({ members: ['rguo'] })
      .then(conv => conv.quit())
      .then(conv => {
        conv.members.should.not.containEql(CLIENT_ID);
        return conv.join();
      }).then(conv => {
        conv.members.should.containEql(CLIENT_ID);
      })
  );

  describe('converastion signature', () => {
    beforeEach(function setupConversation() {
      this.conversationSignatureFactory = sinon.stub().returns({
        signature: 'signature',
        timestamp: Date.now(),
        nonce: 'nonce',
      });
      return realtime.createIMClient('ycui', {
        conversationSignatureFactory: this.conversationSignatureFactory,
      }).then(c => {
        this.ycui = c;
        return c.createConversation({
          members: ['zwang', 'dli', 'zwang'], // duplicated id should be ignored
        });
      }).then(conv => (this.conversation = conv));
    });
    afterEach(function cleanup() {
      return this.ycui.close();
    });
    it('create', function createAsserts() {
      this.conversationSignatureFactory
        .should.be.calledWith(null, 'ycui', ['dli', 'ycui', 'zwang'], 'create');
    });
    it('add', function addAsserts() {
      return this.conversation.add(['wduan', 'jwu']).then(() => {
        this.conversationSignatureFactory.getCall(1).args
          .should.be.eql([this.conversation.id, 'ycui', ['jwu', 'wduan'], 'add']);
      });
    });
    it('remove', function removeAsserts() {
      return this.conversation.quit().then(() => {
        this.conversationSignatureFactory.getCall(1).args
          .should.be.eql([this.conversation.id, 'ycui', ['ycui'], 'remove']);
      });
    });
  });

  describe('Message Query', () => {
    it('queryMessages', () =>
      conversation.queryMessages().then(messages => {
        messages.should.be.an.Array();
        messages[0].should.be.instanceof(Message);
      })
    );
    it('with limit', () =>
      conversation.queryMessages({
        limit: 0,
      }).then(messages => {
        messages.should.be.an.empty();
      })
    );
    it('beforeTime', () =>
      conversation.queryMessages({
        beforeTime: 1,
      }).then(messages => {
        messages.should.be.an.empty();
      })
    );
    it('afterTime', () =>
      conversation.queryMessages({
        afterTime: new Date(),
      }).then(messages => {
        messages.should.be.an.empty();
      })
    );
    describe('MessageIterator', () => {
      it('normal case', () => {
        const iterator = conversation.createMessagesIterator({
          limit: 2,
        });
        return Promise.all([iterator.next(), iterator.next()])
          .then(([page1, page2]) => {
            page1.value.should.be.an.Array();
            page1.value.length.should.eql(2);
            page1.done.should.eql(false);
            page2.value.should.be.an.Array();
            const minMessageTimestamp =
              Math.min(page1.value[0].timestamp, page1.value[1].timestamp);
            page2.value[0].timestamp.should.lessThan(minMessageTimestamp);
          });
      });
      // https://github.com/leancloud/js-realtime-sdk/issues/240
      it('result should be a copy', () => {
        const iterator = conversation.createMessagesIterator({
          limit: 2,
        });
        let minMessageTimestamp;
        return iterator.next()
          .then(page1 => {
            minMessageTimestamp = Math.min(page1.value[0].timestamp, page1.value[1].timestamp);
            page1.value.splice(0);
            return iterator.next();
          }).then(page2 => {
            page2.value[0].timestamp.should.lessThan(minMessageTimestamp);
          });
      });
    });
  });

  describe('message dispatch', () => {
    let client2;
    let conversation2;
    const CLIENT_ID_2 = Date.now().toString();
    before(
      () => realtime
        .createIMClient(CLIENT_ID_2)
        .then(tap(c => (client2 = c)))
        .then(c => c.createConversation({
          members: ['xwang', 'csun'],
          name: 'message dispatch test conversation',
        }))
        .then(c => (conversation2 = c))
    );
    after(() => client2.close());
    it('membersjoined', () => {
      const clientCallback = sinon.spy();
      client2.on('membersjoined', clientCallback);
      const conversationCallback = sinon.spy();
      conversation2.on('membersjoined', conversationCallback);
      return client2._dispatchMessage(new GenericCommand({
        cmd: 'conv',
        op: 'members_joined',
        peerId: CLIENT_ID_2,
        convMessage: new ConvCommand({
          cid: conversation2.id,
          m: ['lan'],
          initBy: CLIENT_ID,
        }),
      })).then(() => {
        clientCallback.should.be.calledOnce();
        clientCallback.getCall(0).args[0].should.be.containEql({
          invitedBy: CLIENT_ID,
          members: ['lan'],
        });
        clientCallback.getCall(0).args[1].should.be.exactly(conversation2);
        conversationCallback.should.be.calledOnce();
        conversationCallback.getCall(0).args[0].should.be.containEql({
          invitedBy: CLIENT_ID,
          members: ['lan'],
        });
        conversation2.members.should.containEql('lan');
      });
    });
    it('membersleft', () => {
      const clientCallback = sinon.spy();
      client2.on('membersleft', clientCallback);
      const conversationCallback = sinon.spy();
      conversation2.on('membersleft', conversationCallback);
      return client2._dispatchMessage(new GenericCommand({
        cmd: 'conv',
        op: 'members_left',
        peerId: CLIENT_ID_2,
        convMessage: new ConvCommand({
          cid: conversation2.id,
          m: ['lan'],
          initBy: CLIENT_ID,
        }),
      })).then(() => {
        clientCallback.should.be.calledOnce();
        clientCallback.getCall(0).args[0].should.be.containEql({
          kickedBy: CLIENT_ID,
          members: ['lan'],
        });
        clientCallback.getCall(0).args[1].should.be.exactly(conversation2);
        conversationCallback.should.be.calledOnce();
        conversationCallback.getCall(0).args[0].should.be.containEql({
          kickedBy: CLIENT_ID,
          members: ['lan'],
        });
        conversation2.members.should.not.containEql('lan');
      });
    });
    it('kicked', () => {
      const clientCallback = sinon.spy();
      client2.on('kicked', clientCallback);
      const conversationCallback = sinon.spy();
      conversation2.on('kicked', conversationCallback);
      return client2._dispatchMessage(new GenericCommand({
        cmd: 'conv',
        op: 'left',
        peerId: CLIENT_ID_2,
        convMessage: new ConvCommand({
          cid: conversation2.id,
          initBy: CLIENT_ID,
        }),
      })).then(() => {
        clientCallback.should.be.calledOnce();
        clientCallback.getCall(0).args[0].should.be.eql({
          kickedBy: CLIENT_ID,
        });
        clientCallback.getCall(0).args[1].should.be.exactly(conversation2);
        conversationCallback.should.be.calledOnce();
        conversationCallback.getCall(0).args[0].should.be.eql({
          kickedBy: CLIENT_ID,
        });
        conversation2.members.should.not.containEql(CLIENT_ID_2);
      });
    });
    it('invited', () => {
      const callback = sinon.spy();
      client2.on('invited', callback);
      const conversationCallback = sinon.spy();
      conversation2.on('invited', conversationCallback);
      return client2._dispatchMessage(new GenericCommand({
        cmd: 'conv',
        op: 'joined',
        peerId: CLIENT_ID_2,
        convMessage: new ConvCommand({
          cid: conversation2.id,
          initBy: CLIENT_ID,
        }),
      })).then(() => {
        callback.should.be.calledOnce();
        callback.getCall(0).args[0].should.be.eql({
          invitedBy: CLIENT_ID,
        });
        callback.getCall(0).args[1].should.be.exactly(conversation2);
        conversationCallback.should.be.calledOnce();
        conversationCallback.getCall(0).args[0].should.be.containEql({
          invitedBy: CLIENT_ID,
        });
        conversation2.members.should.containEql(CLIENT_ID_2);
      });
    });
  });

  it('unreadmessages event and markAsRead', () => {
    const bwangId = uuid.v4();
    let bwang0;
    let conversationId;
    return realtime.createIMClient()
      .then(jwu =>
        jwu.createConversation({
          members: [bwangId],
        }).then(conv => {
          conversationId = conv.id;
          return conv.send(new Message({}));
        }).then(tap(() => jwu.close()))
      ).then(() =>
        new Realtime({
          appId: APP_ID,
          region: REGION,
        }).createIMClient(bwangId)
      ).then(c => {
        bwang0 = c;
        return listen(bwang0, 'unreadmessages').then(([payload, conv]) => {
          payload.count.should.be.eql(1);
          conv.unreadMessagesCount.should.eql(1);
          conv.id.should.be.eql(conversationId);
        });
      })
      .then(() => realtime.createIMClient(bwangId))
      .then(bwang1 => listen(bwang1, 'unreadmessages')
        .then(([payload, conv]) => {
          payload.count.should.be.eql(1);
          conv.id.should.be.eql(conversationId);
          return conv.markAsRead().then(conv1 => {
            conv1.unreadMessagesCount.should.be.eql(0);
            bwang1.close();
          });
        })
      ).then(() => listen(bwang0, 'unreadmessages')
        .then(([payload, conv]) => {
          payload.count.should.be.eql(0);
          conv.id.should.be.eql(conversationId);
        })
      ).then(() => {
        bwang0.close();
      });
  });
});
