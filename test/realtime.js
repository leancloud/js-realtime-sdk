import 'should';
import 'should-sinon';
import should from 'should/as-function';
import Realtime from '../src/realtime';
import Connection from '../src/connection';
import Client from '../src/client';
import { GenericCommand, CommandType, ConvCommand } from '../proto/message';
import TextMessage from '../src/messages/text-message';

import { listen, sinon } from './test-utils';

import {
  APP_ID,
  REGION,
  NON_EXISTING_ROOM_ID,
} from './configs';

const createRealtime = options => new Realtime(Object.assign({
  appId: APP_ID,
  region: REGION,
  pushUnread: false,
}, options));

describe('Realtime', () => {
  describe('constructor', () => {
    it('appId required', () =>
      (() => new Realtime()).should.throw()
    );
    it('normal', () =>
      (() => new Realtime({
        appId: APP_ID,
      })).should.not.throw
    );
  });
  describe('_open/_close', () => {
    it('connection should be reused', () => {
      const realtime = createRealtime();
      let firstConnection;
      return realtime._open()
        .then((connection) => {
          connection.should.be.a.instanceof(Connection);
          firstConnection = connection;
        })
        .then(() => realtime._open())
        .then((connection) => {
          connection.should.be.exactly(firstConnection);
          connection.close();
        });
    });
    it('_close', () => {
      const realtime = createRealtime();
      return realtime._open()
        .then((connection) => {
          should(realtime._openPromise).not.be.undefined();
          return connection;
        })
        .then((connection) => {
          realtime._close();
          return connection;
        })
        .then((connection) => {
          should(realtime._openPromise).be.undefined();
          connection.current.should.be.equal('closed');
        });
    });
    it('noBinary mode fallback', () =>
      createRealtime({
        noBinary: true,
      }).createIMClient()
        .then(client => client.close())
    );
  });
  describe('endpoints cache', () => {
    it('_getEndpoints should use cache', () => {
      const _fetchEndpointsInfo =
        sinon.stub(Realtime, '_fetchEndpointsInfo').returns(Promise.resolve({
          ttl: 1000,
        }));
      const realtime = createRealtime();
      return realtime._getEndpoints(realtime._options)
        .then(() => {
          _fetchEndpointsInfo.should.be.calledOnce();
        })
        .then(() => realtime._getEndpoints(realtime._options))
        .then(() => {
          _fetchEndpointsInfo.should.be.calledOnce();
          _fetchEndpointsInfo.restore();
        });
    });
  });
  it('_register/_deregister clients', () => {
    const realtime = createRealtime();
    const _disconnect = sinon.spy(realtime, '_close');
    return realtime._open()
      .then((connection) => {
        const a = new Client('a', connection);
        const b = new Client('b', connection);
        const c = new Client(undefined, connection);
        realtime._register(a);
        realtime._register(b);
        (() => realtime._register({})).should.throw();
        (() => realtime._register(c)).should.throw();
        realtime._deregister(a);
        _disconnect.should.not.be.called();
        realtime._deregister(b);
        _disconnect.should.be.calledOnce();
        (() => realtime._deregister({})).should.throw();
        (() => realtime._deregister(c)).should.throw();
        _disconnect.restore();
      });
  });
  describe('events', () => {
    it('should proxy network events', () => {
      const realtime = createRealtime();
      return realtime._open()
        .then((connection) => {
          const callbackPromise = Promise.all(['retry', 'schedule', 'disconnect', 'reconnect'].map(
            event => listen(realtime, event)
          ));
          connection.emit('disconnect');
          connection.emit('retry', 1, 2);
          connection.emit('schedule');
          connection.emit('reconnect');
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
  describe('retry', () => {
    let realtime;
    before(() => {
      realtime = createRealtime();
      return realtime._open();
    });
    after(() => realtime._close());
    it('should throw when not offline', () => {
      (() => createRealtime().retry()).should.throw();
      (() => realtime.retry()).should.throw();
    });
    it('should retry when offline', () =>
      realtime._open().then((connection) => {
        const promise = listen(realtime, 'disconnect', 'eroor');
        connection.disconnect();
        return promise;
      }).then(() => {
        realtime.retry();
        return listen(realtime, 'reconnect', 'eroor');
      })
    );
  });
});

describe('Connection', () => {
  let client;
  let connection;
  before(() =>
    createRealtime().createIMClient()
      .then((c) => {
        client = c;
        connection = client._connection;
        return connection.ping();
      })
  );
  after(() => connection.close());

  it('ping', () =>
    connection.ping()
      .then((resCommand) => {
        resCommand.cmd.should.be.equal(CommandType.echo);
      })
  );
  it('send command error', () =>
    connection.send(new GenericCommand({
      cmd: 'conv',
      op: 'update',
      peerId: client.id,
      convMessage: new ConvCommand({
        cid: NON_EXISTING_ROOM_ID,
      }),
    })).should.be.rejectedWith('CONVERSATION_UPDATE_REJECTED')
  );
  it('message dispatch', () => {
    const clientMessageEventCallback = sinon.stub(client, '_dispatchMessage');
    connection.emit('message', new GenericCommand({
      cmd: 1,
    }));
    connection.emit('message', new GenericCommand({
      cmd: 1,
      peerId: 'fake clientId',
    }));
    clientMessageEventCallback.should.not.be.called();
    const validMessage = new GenericCommand({
      cmd: 1,
      peerId: client.id,
    });
    connection.emit('message', validMessage);
    return Promise.resolve().then(() => {
      clientMessageEventCallback.should.be.calledOnce();
      clientMessageEventCallback.should.be.calledWith(validMessage);
      clientMessageEventCallback.restore();
    });
  });
});
