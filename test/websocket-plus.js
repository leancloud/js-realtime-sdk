import 'should';
import 'should-sinon';
import WebsocketPlus from '../src/websocket-plus';
import { listen, wait } from './test-utils';

const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

describe('WebsocketPlus', () => {
  describe('open/close', () => {
    it('basic', () => {
      const ws = new WebsocketPlus('wss://echo.websocket.org');
      return listen(ws, 'open').then(() => {
        ws.is('connected').should.be.true();
        ws.close();
        ws.is('closed').should.be.true();
        (() => ws.open()).should.throw();
      });
    });
    it('error', (done) => {
      const ws = new WebsocketPlus('ws://404.websocket.org');
      ws.on('error', error => {
        error.should.be.instanceof(Error);
        done();
      });
    });
    it('backup endpoint', (done) => {
      const ws = new WebsocketPlus([
        'ws://404.websocket.org',
        'ws://echo.websocket.org',
      ]);
      ws.on('open', () => {
        done();
        ws.close();
      });
    });
    it('promised endpoints', (done) => {
      const ws = new WebsocketPlus(Promise.resolve([
        'wss://echo.websocket.org',
      ]));
      ws.on('open', () => {
        done();
        ws.close();
      });
    });
  });

  describe('Auto reconnecting', () => {
    let ws;
    before(done => {
      ws = new WebsocketPlus('ws://echo.websocket.org');
      ws.on('open', () => done());
    });
    after(() => {
      if (!ws.is('closed')) ws.close();
    });
    it('should reconnect when closed', () => {
      const disconnectCallback = sinon.spy();
      ws.on('disconnect', disconnectCallback);
      ws._ws.close();
      return listen(ws, 'reconnect').then(() => {
        disconnectCallback.should.be.calledOnce();
        ws.is('connected').should.be.true();
      });
    });
    it('should not reconnect when closed manually', () => {
      const disconnectCallback = sinon.spy();
      ws.on('disconnect', disconnectCallback);
      ws.close();
      return wait(500).then(() => {
        disconnectCallback.should.have.callCount(0);
        ws.is('closed').should.be.true();
      });
    });
  });
});
