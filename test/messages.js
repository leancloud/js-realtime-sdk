import 'should';
import 'should-sinon';
import { Promise } from 'rsvp';
import uuid from 'uuid';
import Realtime from '../src/realtime';
import Message from '../src/messages/message';

import {
  APP_ID,
  APP_KEY,
  REGION,
} from './configs';

// const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

describe('Messages', () => {
  // describe('Message', () => {
  //
  // });

  describe('sending messages', () => {
    // let realtime;
    let wchen;
    let zwang;
    const wchenId = uuid.v4();
    const zwangId = uuid.v4();
    let conversationWchen;
    let conversationZwang;
    before(() => {
      const realtime = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
        region: REGION,
        pushUnread: false,
      });
      return Promise.all([
        realtime.createIMClient(wchenId),
        realtime.createIMClient(zwangId),
      ]).then(clients => {
        [wchen, zwang] = clients;
        return wchen.createConversation({
          members: [zwangId],
          name: 'message test conversation',
        });
      }).then(conversation => {
        conversationWchen = conversation;
        return zwang.getConversation(conversation.id);
      }).then(conversation => {
        conversationZwang = conversation;
      });
    });
    after(() => Promise.all([
      wchen.close(),
      zwang.close(),
    ]));

    it('sending message', () => {
      const receivePromise = new Promise((resolve) => {
        conversationZwang.on('message', resolve);
      });
      const sendPromise = conversationWchen.send(new Message('hello'));
      return Promise.all([receivePromise, sendPromise]).then(messages => {
        const [receivedMessage, sentMessage] = messages;
        receivedMessage.id.should.be.equal(sentMessage.id);
        receivedMessage.content.should.be.equal(sentMessage.content);
      });
    });
  });
});
