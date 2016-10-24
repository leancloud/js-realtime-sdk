import 'should';
import 'should-sinon';
import Realtime from '../src/realtime';
import Conversation from '../src/conversation';
import { ErrorCode, MessagePriority } from '../src';
import Message, { MessageStatus } from '../src/messages/message';
import TypedMessage from '../src/messages/typed-message';
import TextMessage from '../src/messages/text-message';
import { messageType, messageField, IE10Compatible } from '../src/messages/helpers';

import { listen, sinon } from './test-utils';

import {
  APP_ID,
  REGION,
  EXISTING_ROOM_ID,
} from './configs';

@messageType(1)
@messageField('foo')
@IE10Compatible
class CustomMessage extends TypedMessage {
  constructor(foo) {
    super();
    this.foo = foo;
  }
}
CustomMessage.sendOptions = {
  priority: MessagePriority.HIGH,
};

describe('Messages', () => {
  describe('helpers', () => {
    describe('messageType', () => {
      it('param type check', () => {
        (() => messageType()).should.throw();
        (() => messageType('1')).should.throw();
        (() => messageType(1)).should.not.throw();
      });
    });
    describe('messageField', () => {
      it('param type check', () => {
        (() => messageField()).should.throw();
        (() => messageField(1)).should.throw();
        (() => messageField('1')).should.not.throw();
        (() => messageField([1])).should.throw();
        (() => messageField(['1'])).should.not.throw();
      });
    });
  });

  describe('message status', () => {
    before(function () {
      this.message = new Message();
    });
    it('should default to none', function () {
      this.message.status.should.eql(MessageStatus.NONE);
    });
    it('should be readonly', function () {
      (() => {
        this.message.status = MessageStatus.SENT;
      }).should.throw();
    });
    it('_setStatus should work', function () {
      this.message._setStatus(MessageStatus.SENT);
      this.message.status.should.eql(MessageStatus.SENT);
    });
    it('_setStatus should only accept MessageStatus', function () {
      (() => this.message._setStatus(0)).should.throw(/Invalid/);
    });
  });

  describe('TextMessage', () => {
    it('param check', () => {
      (() => new TextMessage({})).should.throw(TypeError);
    });
    it('message type should be readonly', () => {
      const message = new TextMessage('');
      message.type.should.eql(-1);
      (() => (message.type = 0)).should.throw();
    });
    it('parse and toJSON', () => {
      const json = {
        _lctext: 'leancloud',
        _lcattrs: {
          lean: 'cloud',
        },
        _lctype: -1,
      };
      const message = new TextMessage(json._lctext)
        .setAttributes(json._lcattrs);
      message.toJSON().should.eql(json);
      const parsedMessage = TextMessage.parse(json);
      parsedMessage.should.be.instanceof(TextMessage);
      parsedMessage.getText().should.eql(json._lctext);
      parsedMessage.getAttributes().should.eql(json._lcattrs);
      parsedMessage.toJSON().should.eql(json);
    });
  });

  describe('CustomMessage', () => {
    it('parse and toJSON', () => {
      const json = {
        _lctext: 'leancloud',
        _lcattrs: {
          lean: 'cloud',
        },
        _lctype: 1,
        foo: 'bar',
      };
      const message = new CustomMessage(json.foo)
        .setText('leancloud')
        .setAttributes(json._lcattrs);
      message.toJSON().should.eql(json);
      const parsedMessage = CustomMessage.parse(json);
      parsedMessage.should.be.instanceof(CustomMessage);
      parsedMessage.getText().should.eql(json._lctext);
      parsedMessage.getAttributes().should.eql(json._lcattrs);
      parsedMessage.foo.should.eql(json.foo);
      parsedMessage.toJSON().should.eql(json);
    });
  });

  describe('sending messages', () => {
    // let realtime;
    let wchen;
    let zwang;
    let conversationWchen;
    let conversationZwang;
    before(() => {
      const realtime = new Realtime({
        appId: APP_ID,
        region: REGION,
        pushUnread: false,
      });
      return Promise.all([
        realtime.createIMClient(),
        realtime.createIMClient(),
      ]).then((clients) => {
        [wchen, zwang] = clients;
        return wchen.createConversation({
          members: [zwang.id],
          name: 'message test conversation',
        });
      }).then((conversation) => {
        conversationWchen = conversation;
        return zwang.getConversation(conversation.id);
      }).then((conversation) => {
        conversationZwang = conversation;
      });
    });

    after(() => Promise.all([
      wchen.close(),
      zwang.close(),
    ]));

    it('sending message', () => {
      const message = new Message('hello');
      const promise = Promise.all([
        listen(conversationZwang, 'message'),
        listen(zwang, 'message'),
        conversationWchen.send(message),
      ]).then((messages) => {
        const [
          [receivedMessage],
          [clientReceivedMessage, clientReceivedConversation],
          sentMessage,
        ] = messages;
        sentMessage.status.should.eql(MessageStatus.SENT);
        receivedMessage.id.should.eql(sentMessage.id);
        receivedMessage.content.should.eql(sentMessage.content);
        receivedMessage.status.should.eql(MessageStatus.SENT);
        clientReceivedMessage.id.should.eql(sentMessage.id);
        clientReceivedConversation.id.should.eql(conversationWchen.id);
        conversationZwang.lastMessage.content.should.eql(sentMessage.content);
        conversationWchen.lastMessage.content.should.eql(sentMessage.content);
        conversationZwang.unreadMessagesCount.should.eql(1);
      });
      message.status.should.eql(MessageStatus.SENDING);
      return promise;
    });
    it('sending typed message', () => {
      const receivePromise = listen(conversationZwang, 'message');
      const sendPromise = conversationWchen.send(
        new TextMessage('hello').setAttributes({
          leancloud: 'rocks',
        })
      );
      return Promise.all([receivePromise, sendPromise]).then((messages) => {
        const [[receivedMessage], sentMessage] = messages;
        receivedMessage.id.should.be.equal(sentMessage.id);
        receivedMessage.getText().should.eql(sentMessage.getText());
        receivedMessage.getAttributes().should.eql(sentMessage.getAttributes());
      });
    });
    it('sending transient message', () => {
      const message = new TextMessage('transient message');
      message.setTransient(true);
      // transient message 不返回 ack
      // 这里确保成功 resolve
      return conversationZwang.send(message).then((msg) => {
        msg.should.be.instanceof(Message);
        msg.status.should.eql(MessageStatus.SENT);
      });
    });
    describe('sendOptions', () => {
      beforeEach(function () {
        this.spy = sinon.spy(Conversation.prototype, '_send');
      });
      afterEach(function () {
        this.spy.restore();
      });
      it('sendOptions', function () {
        const message = new TextMessage('sendOptions test');
        const pushData = {
          alert: 'test',
        };
        conversationZwang.send(message, {
          priority: MessagePriority.LOW,
          pushData,
        });
        const command = this.spy.getCall(0).args[0];
        command.should.containDeepOrdered({
          priority: MessagePriority.LOW,
          directMessage: {
            pushData: JSON.stringify(pushData),
          },
        });
      });
      it('Message.sendOptions', function () {
        conversationZwang.send(new CustomMessage());
        const command = this.spy.getCall(0).args[0];
        command.should.containDeepOrdered({
          priority: MessagePriority.HIGH,
        });
      });
    });
    it('receipt', () => {
      const message = new TextMessage('message needs receipt');
      const receiptPromise = listen(conversationZwang, 'receipt');
      message.setNeedReceipt(true);
      return conversationZwang.send(message)
        .then(() => receiptPromise)
        .then(() => {
          message.status.should.eql(MessageStatus.DELIVERED);
          message.deliveredAt.should.be.Date();
        });
    });
    it('errors', () => {
      (() => conversationWchen.send('1')).should.throw(/not a Message/);
      const message = new Message('hello');
      return wchen
        .getConversation(EXISTING_ROOM_ID)
        .then(conversation => conversation.send(message))
        .should.be.rejectedWith(Error, {
          message: 'INVALID_MESSAGING_TARGET',
          code: ErrorCode.INVALID_MESSAGING_TARGET,
        })
        .then(() => {
          message.status.should.eql(MessageStatus.FAILED);
        });
    });
  });
});
