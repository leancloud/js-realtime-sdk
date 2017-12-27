import uuid from 'uuid/v4';
import Realtime from '../src/realtime';
import { tap } from '../src/utils';
import {
  GenericCommand,
  ConvCommand,
} from '../proto/message';
import {
  Conversation,
  ServiceConversation,
  TemporaryConversation,
  MessageQueryDirection,
  Message,
  MessageStatus,
  TextMessage,
  defineConversationProperty,
  ErrorCode,
} from '../src';

import {
  APP_ID,
  APP_KEY,
  REGION,
  EXISTING_ROOM_ID,
  SYS_CONV_ID,
  CLIENT_ID,
} from './configs';

import { listen, sinon, wait } from './test-utils';
import { ConversationMemberRole } from '../src/conversation-member-info';

describe('Conversation', () => {
  let realtime;
  let client;
  let conversation;
  before(() => {
    realtime = new Realtime({
      appId: APP_ID,
      appKey: APP_KEY,
      region: REGION,
    });
    return realtime.createIMClient(CLIENT_ID)
      .then((c) => {
        client = c;
        return client.getConversation(EXISTING_ROOM_ID);
      })
      .then((conv) => {
        conversation = conv;
        return conv.send(new TextMessage('42'));
      });
  });
  after(() => client.close());

  it('defineConversationProperty', () => {
    defineConversationProperty('testProperty1');
    conversation.set('testProperty1', 1);
    conversation.testProperty1.should.eql(1);
    defineConversationProperty('testProperty2');
    conversation.testProperty2 = 2;
    conversation.get('testProperty2').should.eql(2);
  });

  it('serialize and parse', async () => {
    const json = conversation.toFullJSON();
    const parsedConversation =
      await client.parseConversation(JSON.parse(JSON.stringify(json)));
    parsedConversation.should.be.instanceof(Conversation);
    parsedConversation.toFullJSON().should.eql(json);
  });

  it('system conversation', async () => {
    const conv = await client.getConversation(SYS_CONV_ID);
    conv.should.be.instanceof(ServiceConversation);
    conv.system.should.be.equal(true);
    const json = conv.toFullJSON();
    const parsedConversation =
      await client.parseConversation(JSON.parse(JSON.stringify(json)));
    parsedConversation.should.be.instanceof(ServiceConversation);
    parsedConversation.toFullJSON().should.eql(json);
  });

  it('update', () => {
    const timestamp = Date.now();
    const { name } = conversation;
    return Promise.resolve(conversation).then((conv) => {
      conv.name = name;
      conv.set('attr', {
        timestamp,
      });
      return conv.save();
    }).then((conv) => {
      conv.should.be.exactly(conversation);
      conv.name.should.be.equal(name);
      conv.get('attr').should.be.eql({ timestamp });
      return conv
        .set('attr', {
          lean: 'cloud',
        })
        .save();
    }).then((conv) => {
      conv.name.should.be.equal(name);
      conv.get('attr').should.be.eql({
        lean: 'cloud',
      });
      return conv
        .set('attr.lee', 'yeh')
        .save();
    }).then((conv) => {
      conv.name.should.be.equal(name);
      conv.get('attr').should.be.eql({
        lean: 'cloud',
        lee: 'yeh',
      });
      return conv.fetch();
    }).then((conv) => {
      conv.name.should.be.equal(name);
      conv.get('attr').should.be.eql({
        lean: 'cloud',
        lee: 'yeh',
      });
    });
  });

  it('fetch', () => {
    const { name, createdAt } = conversation;
    conversation.name = 'should not be this name';
    conversation.createdAt = new Date();
    return conversation.fetch().then((conv) => {
      conv.name.should.be.equal(name);
      conv.createdAt.should.be.eql(createdAt);
      conv.should.be.exactly(conversation);
    });
  });

  it('mute', () =>
    conversation.mute().then((conv) => {
      conv.should.be.exactly(conversation);
      conv.muted.should.be.equal(true);
      conv.mutedMembers.should.containEql(CLIENT_ID);
    }));
  it('unmute', () =>
    conversation.unmute().then((conv) => {
      conv.should.be.exactly(conversation);
      conv.muted.should.be.equal(false);
      conv.mutedMembers.should.not.containEql(CLIENT_ID);
    }));
  it('count', () => conversation.count().should.be.fulfilledWith(2));
  it('add/remove', async () => {
    const conv = await client.createConversation({ members: ['nsun'] });
    await conv.add('rguo');
    conv.members.should.containEql('rguo');
    await conv.remove('rguo');
    conv.members.should.not.containEql('rguo');
  });
  it('join/quit', () =>
    client.createConversation({ members: ['rguo'] })
      .then(conv => conv.quit())
      .then((conv) => {
        conv.members.should.not.containEql(CLIENT_ID);
        return conv.join();
      }).then((conv) => {
        conv.members.should.containEql(CLIENT_ID);
      }));

  describe('converastion signature', () => {
    beforeEach(function setupConversation() {
      this.conversationSignatureFactory = sinon.stub().returns({
        signature: 'signature',
        timestamp: Date.now(),
        nonce: 'nonce',
      });
      return realtime.createIMClient('ycui', {
        conversationSignatureFactory: this.conversationSignatureFactory,
      }).then((c) => {
        this.ycui = c;
        return c.createConversation({
          members: ['zwang', 'dli', 'zwang'], // duplicated id should be ignored
        });
      }).then((conv) => { this.conversation = conv; });
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
      return this.conversation.remove(['wduan']).then(() => {
        this.conversationSignatureFactory.getCall(1).args
          .should.be.eql([this.conversation.id, 'ycui', ['wduan'], 'remove']);
      });
    });
  });

  describe('Message Query', () => {
    it('queryMessages', () =>
      conversation.queryMessages().then((messages) => {
        messages.should.be.an.Array();
        messages[0].should.be.instanceof(Message);
        messages[0].status.should.be.eql(MessageStatus.SENT);
      }));
    it('with limit', () =>
      conversation.queryMessages({
        limit: 0,
      }).then((messages) => {
        messages.should.be.an.empty();
      }));
    it('beforeTime', () =>
      conversation.queryMessages({
        beforeTime: 1,
      }).then((messages) => {
        messages.should.be.an.empty();
      }));
    it('afterTime', () =>
      conversation.queryMessages({
        afterTime: new Date(),
      }).then((messages) => {
        messages.should.be.an.empty();
      }));
    it('direction', () =>
      conversation.queryMessages({
        startTime: new Date(),
        direction: MessageQueryDirection.OLD_TO_NEW,
      }).then((messages) => {
        messages.should.be.an.empty();
      }));
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
          .then((page1) => {
            minMessageTimestamp = Math.min(page1.value[0].timestamp, page1.value[1].timestamp);
            page1.value.splice(0);
            return iterator.next();
          }).then((page2) => {
            page2.value[0].timestamp.should.lessThan(minMessageTimestamp);
          });
      });
    });
  });

  describe('message dispatch', () => {
    let client2;
    let conversation2;
    const CLIENT_ID_2 = Date.now().toString();
    before(() => realtime
      .createIMClient(CLIENT_ID_2)
      .then(tap((c) => { client2 = c; }))
      .then(c => c.createConversation({
        members: ['xwang', 'csun'],
        name: 'message dispatch test conversation',
      }))
      .then((c) => { conversation2 = c; }));
    after(() => client2.close());
    it('membersjoined', () => {
      const clientCallback = sinon.spy();
      client2.on('membersjoined', clientCallback);
      const conversationCallback = sinon.spy();
      conversation2.on('membersjoined', conversationCallback);
      return client2._dispatchCommand(new GenericCommand({
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
      return client2._dispatchCommand(new GenericCommand({
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
      return client2._dispatchCommand(new GenericCommand({
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
      return client2._dispatchCommand(new GenericCommand({
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

  it('unreadmessagescountupdate event and read', () => {
    const bwangId = uuid();
    let bwang0;
    let conversationId;
    let bwangRealtime;
    const message = new Message({});
    message.setMentionList(bwangId).mentionAll();
    return realtime.createIMClient()
      .then(jwu =>
        jwu.createConversation({
          members: [bwangId],
        }).then((conv) => {
          conversationId = conv.id;
          // 这里连续发 3 条消息，conv.lm 可能不会被更新为最后一条消息
          // 发送 read 命令时如果用 conv.lm 可能会导致漏标消息
          return Promise.all([
            conv.send(new Message({}).setMentionList(bwangId)),
            conv.send(new Message({}).mentionAll()),
          ]).then(() => conv.send(message));
        }).then(tap(() => jwu.close()))).then(() => {
        bwangRealtime = new Realtime({
          appId: APP_ID,
          appKey: APP_KEY,
          region: REGION,
        });
        return bwangRealtime.createIMClient(bwangId);
      }).then((c) => {
        bwang0 = c;
        return listen(bwang0, 'unreadmessagescountupdate').then(([[conv]]) => {
          conv.unreadMessagesCount.should.eql(3);
          conv.unreadMessagesMentioned.should.eql(true);
          conv.id.should.be.eql(conversationId);
          conv.lastMessage.should.be.instanceof(Message);
          conv.lastMessage.id.should.eql(message.id);
        });
      })
      .then(() => realtime.createIMClient(bwangId))
      .then(bwang1 => listen(bwang1, 'unreadmessagescountupdate')
        .then(([[conv]]) => {
          conv.unreadMessagesCount.should.be.eql(3);
          conv.unreadMessagesMentioned.should.eql(true);
          conv.id.should.be.eql(conversationId);
          conv.lastMessage.id.should.eql(message.id);
          return conv.read().then((conv1) => {
            conv1.unreadMessagesCount.should.be.eql(0);
            bwang1.close();
          });
        })).then(() => listen(bwang0, 'unreadmessagescountupdate')
        .then(([[conv]]) => {
          conv.unreadMessagesCount.should.be.eql(0);
          conv.unreadMessagesMentioned.should.eql(false);
          conv.id.should.be.eql(conversationId);
          conv.lastMessage.id.should.eql(message.id);
        })).then(() => {
        bwang0.close();
      });
  });

  describe('ConversationMemberInfo', () => {
    let owner;
    let member;
    let ownerConversation;
    let memberConversation;
    before(async () => {
      member = await realtime.createIMClient();
      owner = await realtime.createIMClient();
      ownerConversation = await owner.createConversation({
        members: [member.id, uuid()],
      });
      memberConversation = await member.getConversation(ownerConversation.id);
    });
    after(() => {
      owner.close();
      member.close();
    });
    it('member can not promote itself', async () =>
      memberConversation.updateMemberRole(member.id, ConversationMemberRole.MANAGER)
        .should.be.rejectedWith('CONVERSATION_OPERATION_UNAUTHORIZED'));
    it('info update and notification', async () => {
      const waitForUpdate = listen(memberConversation, 'memberinfoupdated');
      await ownerConversation.updateMemberRole(member.id, ConversationMemberRole.MANAGER);
      const [{ member: memberId, memberInfo, updatedBy }] = await waitForUpdate;
      memberId.should.be.eql(member.id);
      updatedBy.should.be.eql(owner.id);
      memberInfo.role.should.be.eql(ConversationMemberRole.MANAGER);
      const cachedMemberInfo = await memberConversation.getMemberInfo(member.id);
      cachedMemberInfo.role.should.be.eql(ConversationMemberRole.MANAGER);
    });
    it('owner can not quit', () => ownerConversation.quit().should.be.rejected('CONVERSATION_NEED_OWNER'));
    it('remove should succeed partially', async () => {
      const result = await ownerConversation.remove([owner.id, member.id]);
      result.successfulClientIds.should.eql([member.id]);
      result.failures.should.have.length(1);
      result.failures[0].should.be.instanceof(Error);
      result.failures[0].message.should.eql('CONVERSATION_NEED_OWNER');
      result.failures[0].clientIds.should.eql([owner.id]);
    });
  });

  describe('TemporaryConversation', () => {
    let fzhang;
    let she;
    let fzhangConversation;
    before(async () => {
      she = await realtime.createIMClient();
      fzhang = await realtime.createIMClient();
      fzhangConversation = await fzhang.createTemporaryConversation({
        members: [she.id],
      });
    });
    after(() => {
      fzhang.close();
      she.close();
    });
    it('should be immutable', () => {
      [
        'set',
        'save',
        'get',
        'fetch',
        'join',
        'quit',
        'add',
        'remove',
      ].forEach(key => fzhangConversation.should.not.have.property(key));
    });
    it('create, send and recieve', async () => {
      const waitForMessage = listen(she, 'message');
      const message = new TextMessage('hi');
      await fzhangConversation.send(message);
      const [recievedMessage, recievedConversation] = await waitForMessage;
      recievedMessage.id.should.eql(message.id);
      recievedConversation.id.should.eql(fzhangConversation.id);
      recievedConversation.expired.should.eql(false);
      recievedConversation.expiredAt.should.be.instanceof(Date);
      const sheConversation = await she.createTemporaryConversation({
        members: [fzhang.id],
      });
      // should use cached conversation
      sheConversation.should.be.exactly(recievedConversation);
    });
    it('expiration', async () => {
      const conv = await fzhang.createTemporaryConversation({
        members: ['dli'],
        ttl: 1,
      });
      await wait(1100);
      // local expiration check
      conv.expired.should.eql(true);
      await conv.send(new TextMessage('')).should.be.rejectedWith(Error, {
        message: 'Temporary conversation expired or does not exist.',
        code: ErrorCode.CONVERSATION_EXPIRED,
      });
      // server expiration check
      conv.expiredAt = Date.now() + 1000000;
      conv.expired.should.eql(false);
      return conv.send(new TextMessage('')).should.be.rejectedWith(Error, {
        message: 'Temporary conversation expired or does not exist.',
        code: ErrorCode.CONVERSATION_EXPIRED,
      });
    });
    it('serialize and parse', async () => {
      const json = fzhangConversation.toFullJSON();
      const parsedConversation =
        await fzhang.parseConversation(JSON.parse(JSON.stringify(json)));
      parsedConversation.should.be.instanceof(TemporaryConversation);
      parsedConversation.toFullJSON().should.eql(json);
    });
  });
});
