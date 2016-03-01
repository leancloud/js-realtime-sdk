import Realtime from '../src/realtime';
import { tap } from '../src/utils';
import { Promise } from 'rsvp';
import {
  GenericCommand,
  ConvCommand,
} from '../proto/message';

import {
  APP_ID,
  APP_KEY,
  REGION,
  EXISTING_ROOM_ID,
  CLIENT_ID,
} from './configs';

const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

describe('Conversation', () => {
  let realtime;
  let client;
  let conversation;
  before(() => {
    realtime = new Realtime({
      appId: APP_ID,
      appKey: APP_KEY,
      region: REGION,
      pushUnread: false,
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
      conv.setAttributes({ lean: 'cloud' }, true);
      conv.setAttribute('lee', 'yeh');
      return conv.save();
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

    it('invited/kicked/membersjoined/membersleft', () => {
      const callback = sinon.spy();
      client2.on('invited', callback);
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
          conversation: conversation2,
        });
      });
    });
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
          conversation: conversation2,
        });
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
          conversation: conversation2,
        });
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
          conversation: conversation2,
        });
        conversationCallback.should.be.calledOnce();
        conversationCallback.getCall(0).args[0].should.be.eql({
          kickedBy: CLIENT_ID,
        });
        conversation2.members.should.not.containEql(CLIENT_ID_2);
      });
    });
  });
});
