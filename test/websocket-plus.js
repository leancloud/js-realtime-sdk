import 'should';
import 'should-sinon';
import WebsocketPlus from '../src/websocket-plus';
import { Promise } from 'rsvp';
import { testAsync } from './test-utils';

const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

describe('WebsocketPlus', () => {
  describe('open', () => {
    it('basic', (done) => {
      const ws = new WebsocketPlus('wss://echo.websocket.org');
      ws.on('open', () => {
        ws.is('connected').should.be.true();
        done();
        ws.close();
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

  it('close', (done) => {
    const ws = new WebsocketPlus('ws://echo.websocket.org');
    ws.on('open', testAsync(() => {
      ws.close();
      ws.is('closed').should.be.true();
      (() => ws.open()).should.throw();
      done();
    }, done));
  });

  describe('Auto reconnecting', () => {
    it('should reconnect when closed', (done) => {
      const ws = new WebsocketPlus('ws://echo.websocket.org');
      ws.on('open', () => {
        ws._ws.close();
      });
      const disconnectCallback = sinon.spy();
      ws.on('disconnect', disconnectCallback);
      ws.on('reconnect', testAsync(() => {
        disconnectCallback.should.be.calledOnce();
        ws.is('connected').should.be.true();
        done();
        ws.close();
      }, done));
    });
    it('should not reconnect when closed manually', (done) => {
      const ws = new WebsocketPlus('ws://echo.websocket.org');
      const disconnectCallback = sinon.spy();
      ws.on('disconnect', disconnectCallback);
      ws.on('open', () => {
        ws.close();
        setTimeout(testAsync(() => {
          disconnectCallback.should.have.callCount(0);
          ws.is('closed').should.be.true();
          done();
        }, done), 1000);
      });
    });
  });
});
