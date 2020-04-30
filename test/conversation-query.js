import ConversationQuery from '../src/conversation-query';
import Message, { MessageStatus } from '../src/messages/message';

import {
  createRealtime,
  EXISTING_ROOM_ID,
  NON_EXISTING_ROOM_ID,
} from './configs';

describe('ConversationQuery', () => {
  // divided to 2 parts since there is query quota for every single client
  describe('part1', () => {
    let client;
    before(() =>
      createRealtime()
        .createIMClient()
        .then(c => {
          client = c;
        })
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
      client
        .getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
        }));
    it('containsMembers', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .containsMembers(['hjiang'])
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .containsMembers(['nobody'])
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('withMembers', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .withMembers(['hjiang', 'leeyeh'], true)
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .withMembers(['hjiang', 'leeyeh'])
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .withMembers(['hjiang'])
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('notEqualTo', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .notEqualTo('name', 'not-this-name')
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .notEqualTo('name', 'js-realtime-sdk-testconv')
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('matches', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .matches('name', /REALTIME-SDK/i)
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .matches('name', /REALTIME-SDK/)
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('contains', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .contains('name', 'realtime-sdk')
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .contains('name', 'REALTIME-SDK')
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('startsWith', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .startsWith('name', 'js-realtime')
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .startsWith('name', 'JS-REALTIME')
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('endsWith', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .endsWith('name', 'testconv')
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .endsWith('name', 'TESTCONV')
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
  });

  describe('part2', () => {
    let client;
    before(() =>
      createRealtime()
        .createIMClient()
        .then(c => {
          client = c;
        })
    );
    after(() => client.close());

    it('lessThan', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .lessThan('createdAt', new Date())
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .lessThan('createdAt', new Date(0))
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('lessThanOrEqualTo', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .lessThanOrEqualTo('createdAt', new Date())
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .lessThanOrEqualTo('createdAt', new Date(0))
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('greaterThan', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .greaterThan('createdAt', new Date(0))
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .greaterThan('createdAt', new Date())
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('greaterThanOrEqualTo', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .greaterThanOrEqualTo('createdAt', new Date(0))
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          }),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .greaterThanOrEqualTo('createdAt', new Date())
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(0);
          }),
      ]));
    it('exists', () =>
      client
        .getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .exists('fakeKey')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }));
    it('doesNotExist', () =>
      client
        .getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .doesNotExist('createdAt')
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(0);
        }));
    it('first', () =>
      client
        .getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .first()
        .then(conversation => {
          conversation.id.should.be.equal(EXISTING_ROOM_ID);
        }));
    it('limit', () =>
      client
        .getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .limit(0)
        .find()
        .then(conversations => conversations.length.should.be.equal(0)));
    it('skip', () =>
      client
        .getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .skip(1)
        .find()
        .then(conversations => conversations.length.should.be.equal(0)));
    it('ascending', () =>
      client
        .getQuery()
        .limit(2)
        .notEqualTo('objectId', '0')
        .ascending('createdAt')
        .find()
        .then(([conversation0, conversation1]) =>
          conversation0.createdAt.should.below(conversation1.createdAt)
        ));
    it('descending', () =>
      client
        .getQuery()
        .limit(2)
        .notEqualTo('objectId', '0')
        .descending('createdAt')
        .find()
        .then(([conversation0, conversation1]) =>
          conversation0.createdAt.should.above(conversation1.createdAt)
        ));
    it('addAscending & addDescending', () =>
      client
        .getQuery()
        .addAscending('a')
        .addAscending('b')
        .addDescending('c')
        .addDescending('d')
        .toJSON()
        .sort.should.be.eql('a,b,-c,-d'));
    it('compact', () =>
      client
        .getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .compact(true)
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          conversations[0].members.length.should.be.equal(0);
        }));
    it('withLastMessagesRefreshed', () =>
      client
        .getQuery()
        .equalTo('objectId', EXISTING_ROOM_ID)
        .withLastMessagesRefreshed()
        .find()
        .then(conversations => {
          conversations.length.should.be.equal(1);
          const message = conversations[0].lastMessage;
          message.should.be.instanceof(Message);
          message.from.should.be.ok();
          message.id.should.be.ok();
          message.timestamp.should.be.ok();
          message.status.should.be.eql(MessageStatus.SENT);
        }));
    it('should use cache', () =>
      Promise.all([
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .find()
          .then(conversations => conversations[0]),
        client
          .getQuery()
          .equalTo('objectId', EXISTING_ROOM_ID)
          .find()
          .then(conversations => conversations[0]),
      ]).then(conversations => {
        conversations[0].should.be.exactly(conversations[1]);
      }));
    describe('and & or', () => {
      it('should fail when provide less than 2 parameters', () =>
        (() => ConversationQuery.and()).should.throw());
      it('should fail when parameters is not a ConversationQuery instance', () =>
        (() => ConversationQuery.and(0, 0)).should.throw());
      it('should return 0 conversations', () => {
        const goodQuery = new ConversationQuery(client);
        goodQuery.equalTo('objectId', EXISTING_ROOM_ID);
        const badQuery = new ConversationQuery(client);
        badQuery.equalTo('objectId', NON_EXISTING_ROOM_ID);
        return ConversationQuery.and(goodQuery, badQuery)
          .find()
          .then(conversations => conversations.length.should.be.equal(0));
      });
      it(`should return a conversation which id is ${EXISTING_ROOM_ID}`, () => {
        const goodQuery = new ConversationQuery(client);
        goodQuery.equalTo('objectId', EXISTING_ROOM_ID);
        const badQuery = new ConversationQuery(client);
        badQuery.equalTo('objectId', NON_EXISTING_ROOM_ID);
        ConversationQuery.or(goodQuery, badQuery)
          .find()
          .then(conversations => {
            conversations.length.should.be.equal(1);
            conversations[0].id.should.be.equal(EXISTING_ROOM_ID);
          });
      });
    });
  });
});
