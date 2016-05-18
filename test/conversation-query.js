import ConversationQuery from '../src/conversation-query';
import Realtime from '../src/realtime';
import Message from '../src/messages/message';

import {
  APP_ID,
  REGION,
  EXISTING_ROOM_ID,
} from './configs';

import { sinon } from './test-utils';

describe('ConversationQuery', () => {
  let client;
  before(() =>
    new Realtime({
      appId: APP_ID,
      region: REGION,
      pushUnread: false,
    })
      .createIMClient()
      .then(c => (client = c))
  );
  after(() => client.close());

  it('_calculateFlag', () => {
    const calculate = ConversationQuery._calculateFlag;
    calculate({}).should.be.equal(0);
    calculate({
      compact: true,
      withLastMessagesRefreshed: true,
    }).should.be.equal(3);
  });
  it('should be a ConversationQuery', () => {
    client.getQuery().should.be.instanceof(ConversationQuery);
  });
  it('equalTo', () =>
    client.getQuery().equalTo('objectId', EXISTING_ROOM_ID).find()
      .then(conversations => {
        conversations.length.should.be.equal(1);
        conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
      })
  );
  it('containsMembers', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .containsMembers(['hjiang'])
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .containsMembers(['nobody'])
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('withMembers', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .withMembers(['hjiang', 'leeyeh'], true)
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .withMembers(['hjiang', 'leeyeh'])
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .withMembers(['hjiang'])
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('notEqualTo', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .notEqualTo('name', 'not-this-name')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .notEqualTo('name', 'js-realtime-sdk-testconv')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('matches', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .matches('name', /REALTIME-SDK/i)
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .matches('name', /REALTIME-SDK/)
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('contains', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .contains('name', 'realtime-sdk')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .contains('name', 'REALTIME-SDK')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('startsWith', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .startsWith('name', 'js-realtime')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .startsWith('name', 'JS-REALTIME')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('endsWith', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .endsWith('name', 'testconv')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .endsWith('name', 'TESTCONV')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('lessThan', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .lessThan('createdAt', new Date())
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .lessThan('createdAt', new Date(0))
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('lessThanOrEqualTo', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .lessThanOrEqualTo('createdAt', new Date())
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .lessThanOrEqualTo('createdAt', new Date(0))
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('greaterThan', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .greaterThan('createdAt', new Date(0))
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .greaterThan('createdAt', new Date())
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('greaterThanOrEqualTo', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .greaterThanOrEqualTo('createdAt', new Date(0))
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .greaterThanOrEqualTo('createdAt', new Date())
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }),
    ])
  );
  it('limit', () =>
    client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
      .limit(0)
      .find()
      .then(conversations => conversations.length.should.be.equal(0))
  );
  it('skip', () =>
    client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
      .skip(1)
      .find()
      .then(conversations => conversations.length.should.be.equal(0))
  );
  it('compact', () =>
    client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
      .compact(true)
      .find()
      .then(conversations => {
        conversations.length.should.be.equal(1);
        conversations[0].members.length.should.be.equal(0);
      })
  );
  it('withLastMessagesRefreshed', () =>
    client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
      .withLastMessagesRefreshed()
      .find()
      .then(conversations => {
        conversations.length.should.be.equal(1);
        conversations[0].lastMessage.should.be.instanceof(Message);
      })
  );
  it('withLastMessages should be proxied', () => {
    const spy = sinon.spy(
      ConversationQuery.prototype,
      'withLastMessagesRefreshed'
    );
    client.getQuery().withLastMessages(true);
    spy.should.be.calledWith(true);
    spy.restore();
  });
  it('should use cache', () =>
    Promise.all([
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .find().then(conversations => conversations[0]),
      client.getQuery().equalTo('objectId', EXISTING_ROOM_ID)
        .find().then(conversations => conversations[0]),
    ]).then(conversations => {
      conversations[0].should.be.exactly(conversations[1]);
    })
  );
});
