import 'should';
import 'should-sinon';
import Realtime from '../src/realtime';
import TypedMessage from '../src/messages/typed-message';
import TextMessage from '../src/messages/text-message';
import { messageType } from '../src/messages/helpers';

import { sinon, hold } from './test-utils';

import {
  APP_ID,
  REGION,
  EXISTING_ROOM_ID,
  CLIENT_ID,
} from './configs';

@messageType(1)
class PluginDefinedMessage extends TypedMessage {}

const patchTestFunction = (value = true, fnName = 'test') => (target) => {
  target[fnName] = () => value;
};

describe('Plugin', () => {
  describe('normal use case', () => {
    let client;
    let realtime;
    before(() => {
      realtime = new Realtime({
        appId: APP_ID,
        region: REGION,
        pushUnread: false,
        plugins: [{
          messageClasses: [PluginDefinedMessage],
          onRealtimeCreate: patchTestFunction(),
          onIMClientCreate: patchTestFunction(),
          onConversationCreate: patchTestFunction(),
          beforeMessageParse: json => Object.assign({}, json, {
            _lctext: `[plugin-test]${json._lctext}`,
          }),
          afterMessageParse: (message) => {
            message.foo = 'bar';
            return message;
          },
        }],
      });
      return realtime
        .createIMClient(CLIENT_ID)
        .then(c => (client = c));
    });

    after(() => client.close());

    it('should work', () => {
      realtime.test().should.be.ok();
      return realtime._messageParser.parse(new PluginDefinedMessage().toJSON())
        .then(message => message.should.be.instanceof(PluginDefinedMessage))
        .then(() => {
          client.test().should.be.ok();
          return client.getConversation(EXISTING_ROOM_ID);
        }).then((conversation) => {
          conversation.test().should.be.ok();
          return conversation.createMessagesIterator({
            limit: 1,
          }).next();
        }).then(({ value: [message] }) => {
          message.text.should.startWith('[plugin-test]');
          message.foo.should.be.eql('bar');
        });
    });
  });

  describe('multi plugins with async middleware', () => {
    let client;
    let realtime;
    before(() => {
      realtime = new Realtime({
        appId: APP_ID,
        region: REGION,
        pushUnread: false,
        plugins: [{
          onRealtimeCreate: patchTestFunction(1),
          beforeMessageParse: json => Object.assign({}, json, {
            _lctext: `[plugin-test]${json._lctext}`,
          }),
        }, {
          onRealtimeCreate: patchTestFunction(2),
          beforeMessageParse: json => Object.assign({}, json, {
            _lctext: `${json._lctext}[plugin-test]`,
          }),
        }, {
          onRealtimeCreate: patchTestFunction(1, 'test2'),
          beforeMessageParse: hold(200),
        }],
      });
      return realtime
        .createIMClient(CLIENT_ID)
        .then(c => (client = c));
    });

    after(() => client.close());

    it('decorators should be applied in order', () => {
      realtime.test().should.be.eql(2);
      realtime.test2().should.be.eql(1);
    });
    it('all middlewares should be applied', () =>
      realtime._messageParser.parse(new TextMessage('1').toJSON())
        .then((message) => {
          message.should.be.instanceof(TextMessage);
          message.text.should.startWith('[plugin-test]');
          message.text.should.endWith('[plugin-test]');
        })
    );
  });

  describe('error handling', () => {
    it('create Realtime should throw', () => {
      (() => new Realtime({
        appId: APP_ID,
        region: REGION,
        pushUnread: false,
        plugins: [{
          name: 'ErrorPlugin',
          onRealtimeCreate: () => {
            throw new Error('test');
          },
        }],
      })).should.throw('test[ErrorPlugin]');
    });
    it('create IMClient should be rejected', () =>
      new Realtime({
        appId: APP_ID,
        region: REGION,
        pushUnread: false,
        plugins: [{
          name: 'ErrorPlugin',
          onIMClientCreate: () => {
            throw new Error('test');
          },
        }],
      }).createIMClient().should.be.rejectedWith('test[ErrorPlugin]')
    );
    it('middleware error should be reported', () =>
      new Realtime({
        appId: APP_ID,
        region: REGION,
        pushUnread: false,
        plugins: [{
          name: 'ErrorPlugin',
          beforeMessageParse: () => {
            throw new Error('test');
          },
        }],
      })._messageParser.parse(new TextMessage('1').toJSON())
        .should.be.rejectedWith('test[ErrorPlugin]')
    );
    it('middleware return type mismatch should trigger a warning', () => {
      const spy = sinon.spy(console, 'warn');
      return Promise.all([
        new Realtime({
          appId: APP_ID,
          region: REGION,
          pushUnread: false,
          plugins: [{
            name: 'ErrorPlugin',
            beforeMessageParse: () => Promise.resolve(),
          }],
        })._messageParser.parse(new TextMessage('1').toJSON()),
        new Realtime({
          appId: APP_ID,
          region: REGION,
          pushUnread: false,
          plugins: [{
            name: 'ErrorPlugin',
            beforeMessageParse: () => 1,
          }],
        })._messageParser.parse(new TextMessage('1').toJSON()),
      ]).then(() => {
        spy.should.be.calledTwice();
        spy.restore();
      });
    });
  });
});
