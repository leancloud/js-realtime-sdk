import 'should';
import 'should-sinon';
import should from 'should/as-function';
import Realtime, { MultitonRealtime } from '../src/realtime';
import Connection from '../src/connection';
import WebSocketPlus from '../src/websocket-plus';
import { GenericCommand, CommandType, ConvCommand } from '../proto/message';
import TextMessage from '../src/messages/text-message';
import { Event } from '../src';

import { listen, sinon, wait } from './test-utils';

import {
  createRealtime,
  APP_ID,
  APP_KEY,
  SERVER,
  NON_EXISTING_ROOM_ID,
} from './configs';

class Client {}

describe('Realtime', () => {
  describe('constructor', () => {
    it('appId required', () => (() => new MultitonRealtime()).should.throw());
    it('server required for CN app', () =>
      (() =>
        new MultitonRealtime({
          appId: 'test-cn-app-id',
          appKey: 'test-cn-app-key',
        })).should.throw());
    it('normal', () =>
      (() =>
        new MultitonRealtime({
          appId: APP_ID,
          appKey: APP_KEY,
          server: SERVER,
        })).should.not.throw);
  });
  describe('SingletonRealtime', () => {
    it('should throw on reinit', () => {
      (() => {
        // eslint-disable-next-line no-new
        new Realtime({
          appId: APP_ID,
          appKey: APP_KEY,
          server: SERVER,
        });
        // eslint-disable-next-line no-new
        new Realtime({
          appId: APP_ID,
          appKey: APP_KEY,
          server: SERVER,
        });
      }).should.throw();
    });
  });
  describe('_open/_close', () => {
    it('connection should be reused', () => {
      const realtime = createRealtime();
      let firstConnection;
      return realtime
        ._open()
        .then(connection => {
          connection.should.be.a.instanceof(Connection);
          firstConnection = connection;
        })
        .then(() => realtime._open())
        .then(connection => {
          connection.should.be.exactly(firstConnection);
          connection.close();
        });
    });
    it('_close', () => {
      const realtime = createRealtime();
      return realtime
        ._open()
        .then(connection => {
          should(realtime._openPromise).not.be.undefined();
          return connection;
        })
        .then(connection => {
          realtime._close();
          return connection;
        })
        .then(connection => {
          should(realtime._openPromise).be.undefined();
          connection.current.should.be.equal('closed');
        });
    });
    it('noBinary mode fallback', () =>
      createRealtime({
        noBinary: true,
      })
        .createIMClient()
        .then(client => client.close()));
  });
  describe('RTMServers cache', () => {
    it('_getRTMServers should use cache', async () => {
      const _fetchRTMServers = sinon.stub(Realtime, '_fetchRTMServers').returns(
        Promise.resolve({
          ttl: 1000,
        })
      );
      let realtime = createRealtime();
      await realtime._getRTMServers(realtime._options);
      _fetchRTMServers.should.be.calledOnce();
      await realtime._getRTMServers(realtime._options);
      _fetchRTMServers.should.be.calledOnce();
      const RTM_SERVER = 'testservers';
      realtime = createRealtime({ RTMServers: RTM_SERVER });
      const RTMServers = await realtime._getRTMServers(realtime._options);
      RTMServers.should.eql([RTM_SERVER]);
      _fetchRTMServers.should.be.calledOnce();
      _fetchRTMServers.restore();
    });
  });
  it('_register/_deregister clients', () => {
    const realtime = createRealtime();
    const _disconnect = sinon.spy(realtime, '_close');
    return realtime._open().then(() => {
      const a = new Client();
      const b = new Client();
      realtime._register(a);
      realtime._register(b);
      // (() => realtime._regiser({})).should.throw();
      realtime._deregister(a);
      _disconnect.should.not.be.called();
      realtime._deregister(b);
      _disconnect.should.be.calledOnce();
      _disconnect.restore();
    });
  });
  describe('events', () => {
    it('should proxy network events', () => {
      const realtime = createRealtime();
      return realtime._open().then(connection => {
        const callbackPromise = Promise.all(
          [
            Event.RETRY,
            Event.SCHEDULE,
            Event.DISCONNECT,
            Event.RECONNECT,
          ].map(event => listen(realtime, event))
        );
        connection.emit(Event.DISCONNECT);
        connection.emit(Event.RETRY, 1, 2);
        connection.emit(Event.SCHEDULE);
        connection.emit(Event.RECONNECT);
        callbackPromise.then(() => connection.close());
        return callbackPromise.then(([[retryPayload1, retryPayload2]]) => {
          retryPayload1.should.equal(1);
          retryPayload2.should.equal(2);
        });
      });
    });
  });
  describe('register Message classes', () => {
    let realtime;
    before(() => {
      realtime = createRealtime();
    });
    it('should except a Message Class', () => {
      realtime.register(TextMessage);
    });
    it('should except an Array of Message Classes', () => {
      realtime.register([TextMessage]);
    });
    it('should not except a Message Class', () => {
      (() => realtime.register({})).should.throw();
    });
  });
  describe('retry/pause/resume', () => {
    let realtime;
    before(() => {
      realtime = createRealtime();
      return realtime._open();
    });
    after(() => realtime._close());
    it('should throw when not disconnected', () => {
      (() => createRealtime().retry()).should.throw();
      (() => realtime.retry()).should.throw();
    });
    it('should retry when disconnected', () =>
      realtime
        ._open()
        .then(connection => {
          const promise = listen(realtime, Event.DISCONNECT);
          connection.disconnect();
          return promise;
        })
        .then(() => {
          realtime.retry();
          return listen(realtime, Event.RECONNECT);
        }));
    it('should reconnect when offline', () =>
      realtime
        ._open()
        .then(() => {
          const promises = [Event.DISCONNECT, Event.OFFLINE].map(event =>
            listen(realtime, event)
          );
          realtime.pause();
          return Promise.all(promises);
        })
        .then(() => {
          const promises = ['retry', Event.RECONNECT, Event.ONLINE].map(event =>
            listen(realtime, event)
          );
          realtime.resume();
          return Promise.all(promises);
        }));
  });
});

describe('Connection', () => {
  let client;
  let connection;
  before(() =>
    createRealtime()
      .createIMClient()
      .then(c => {
        client = c;
        connection = client._connection;
        return connection.ping();
      })
  );
  after(() => connection.close());

  it('ping', () =>
    connection.ping().then(resCommand => {
      resCommand.cmd.should.be.equal(CommandType.echo);
    }));
  it('send command error', () =>
    connection
      .send(
        new GenericCommand({
          cmd: 'conv',
          op: 'update',
          peerId: client.id,
          convMessage: new ConvCommand({
            cid: NON_EXISTING_ROOM_ID,
          }),
        })
      )
      .should.be.rejectedWith('CONVERSATION_NOT_FOUND'));
  it('message dispatch', async () => {
    let clientMessageEventCallback = sinon.spy(client, '_dispatchCommand');
    connection.emit(
      'message',
      new GenericCommand({
        cmd: 1,
        service: 0,
      })
    );
    connection.emit(
      'message',
      new GenericCommand({
        cmd: 1,
        peerId: 'fake clientId',
      })
    );
    await wait(0);
    clientMessageEventCallback.should.not.be.called();
    const validMessage = new GenericCommand({
      cmd: 1,
      peerId: client.id,
    });
    connection.emit('message', validMessage);
    await wait(0);
    clientMessageEventCallback.should.be.calledOnce();
    clientMessageEventCallback.should.be.calledWith(validMessage);
    clientMessageEventCallback.restore();
    clientMessageEventCallback = sinon.spy(client, '_dispatchCommand');
    const omitPeerIdMessage = new GenericCommand({
      cmd: 1,
      service: 2,
    });
    connection.emit('message', omitPeerIdMessage);
    await wait(0);
    clientMessageEventCallback.should.be.calledOnce();
    clientMessageEventCallback.should.be.calledWith(omitPeerIdMessage);
    clientMessageEventCallback.restore();
  });
  describe('throttle', () => {
    it('same cmds should be throttled', async () => {
      const send = sinon.spy(WebSocketPlus.prototype, 'send');
      await Promise.all([client.ping(['0']), client.ping(['0'])]);
      send.should.be.calledOnce();
      send.restore();
    });
    it('different cmds should not be throttled', async () => {
      const send = sinon.spy(WebSocketPlus.prototype, 'send');
      await Promise.all([client.ping(['1']), client.ping(['2'])]);
      send.should.be.calledTwice();
      send.restore();
    });
  });
});
