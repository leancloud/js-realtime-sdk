import Realtime from '../src/realtime';

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
  before(() =>
    new Realtime({
      appId: APP_ID,
      appKey: APP_KEY,
      region: REGION,
      pushUnread: false,
    })
      .createIMClient(CLIENT_ID)
      .then(c => {
        client = c;
        return client.getConversation(EXISTING_ROOM_ID);
      })
      .then(conv => (conversation = conv))
  );
  after(() => client.close());

  it('update', () => {
    const timestamp = Date.now();
    const name = conversation.name;
    conversation.name = name;
    conversation.attributes = {
      timestamp,
    };
    return conversation.save().then(conv => {
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
});
