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
  let isIE10;
  if (global.navigator) {
    isIE10 = /MSIE 10\.0/.test(global.navigator.userAgent);
  }
  if (isIE10) return;
  // this case will cause the test never end in IE10 when run on Saucelabs.
  // It passes when run manually  let client;
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
    });
  });
});
