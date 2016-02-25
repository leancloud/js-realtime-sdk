import Realtime from '../src/realtime';
import { Promise } from 'rsvp';

import {
  APP_ID,
  APP_KEY,
  REGION,
  EXISTING_ROOM_ID,
  CLIENT_ID,
} from './configs';

describe('Conversation', () => {
  let client;
  let conversation;
  before(() => {
    const realtime = new Realtime({
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
});
