import 'should';
import 'should-sinon';
import should from 'should/as-function';
import Realtime from '../src/realtime';
import Connection from '../src/connection';
import Client from '../src/client';
import { GenericCommand, CommandType } from '../proto/message';

const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

import {
  APP_ID,
  APP_KEY,
  REGION,
} from './configs';

const createRealtime = (options) => new Realtime(Object.assign({
  appId: APP_ID,
  appKey: APP_KEY,
  region: REGION,
  pushUnread: false,
}, options));

describe('Realtime', () => {
  describe('constructor', () => {
    it('appKey required', () =>
      (() => new Realtime({ appId: APP_ID })).should.throw()
    );
    it('appId required', () =>
      (() => new Realtime({ appKey: APP_KEY })).should.throw()
    );
    it('normal', () =>
      (() => new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
      })).should.not.throw
    );
  });
  describe('_connect/_disconnect', () => {
    it('connection should be reused', () => {
      const realtime = createRealtime();
      let firstConnection;
      return realtime._connect()
        .then(connection => {
          connection.should.be.a.instanceof(Connection);
          firstConnection = connection;
        })
        .then(() => realtime._connect())
        .then(connection => {
          connection.should.be.exactly(firstConnection);
          connection.close();
        });
    });
    it('_disconnect', () => {
      const realtime = createRealtime();
      return realtime._connect()
        .then(connection => {
          should(realtime._connectPromise).not.be.undefined();
          return connection;
        })
        .then(connection => {
          realtime._disconnect();
          return connection;
        })
        .then(connection => {
          should(realtime._connectPromise).be.undefined();
          connection.current.should.be.equal('closed');
        });
    });
  });
  describe('endpoints cache', () => {
    it('_getEndpoints should use cache', () => {
      const _fetchEndpointsInfo =
        sinon.spy(Realtime, '_fetchEndpointsInfo');
      const realtime = createRealtime();
      return realtime._getEndpoints(realtime._options)
        .then(() => {
          _fetchEndpointsInfo.should.be.calledOnce();
        })
        .then(() => realtime._getEndpoints(realtime._options))
        .then(() => {
          _fetchEndpointsInfo.should.be.calledOnce();
        });
    });
  });
  it('_register/_deregister', () => {
    const realtime = createRealtime();
    const _disconnect = sinon.spy(realtime, '_disconnect');
    return realtime._connect()
      .then(connection => {
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
});

describe('Connection', () => {
  let client;
  let connection;
  before(() =>
    createRealtime().createIMClient()
      .then(c => {
        client = c;
        connection = client._connection;
        return connection.ping();
      })
  );
  after(() => connection.close());

  it('ping', () =>
    connection.ping()
      .then(resCommand => {
        resCommand.cmd.should.be.equal(CommandType.echo);
      })
  );
  it('send command error', () =>
    connection.send(new GenericCommand({
      cmd: 'conv',
      op: 'update',
      peerId: client.id,
    })).should.be.rejectedWith('CONVERSATION_UPDATE_FAILED')
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
    clientMessageEventCallback.should.be.calledOnce();
    clientMessageEventCallback.should.be.calledWith(validMessage);
    clientMessageEventCallback.restore();
  });
});
