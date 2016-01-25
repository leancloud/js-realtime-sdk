/* jshint -W064 */
import 'should';
import 'should-sinon';
import WebsocketPlus from '../src/websocket-plus';
import Should from 'should/as-function';
import { Promise } from 'rsvp';

var sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

describe('WebsocketPlus', () => {
  describe('open', () => {
    it('basic', (done) => {
      const ws = new WebsocketPlus('wss://echo.websocket.org');
      ws.on('open', () => {
        ws.is('connected').should.be.true;
        done();
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
        'ws://echo.websocket.org'
      ]);
      ws.on('open', done);
    });
    it('promised endpoints', (done) => {
      const ws = new WebsocketPlus(Promise.resolve([
        'wss://echo.websocket.org'
      ]));
      ws.on('open', done);
    });
  });

  it('close', (done) => {
    const ws = new WebsocketPlus('ws://echo.websocket.org');
    ws.on('open', () => {
      ws.close();
      ws.is('closed').should.be.true;
      (() => ws.open()).should.throw();
      done();
    });
  });

  describe('Auto reconnecting', () => {
    it('should reconnect when closed', (done) => {
      const ws = new WebsocketPlus('ws://echo.websocket.org');
      ws.on('open', () => {
        ws._ws.close();
      });
      const disconnectCallback = sinon.spy();
      ws.on('disconnect', disconnectCallback)
      ws.on('reconnect', testAsync(() => {
        disconnectCallback.should.be.calledOnce();
        ws.is('connected').should.be.true;
        done();
      }, done));
    });
    it('should not reconnect when closed manully', (done) => {
      const ws = new WebsocketPlus('ws://echo.websocket.org');
      ws.on('open', () => {
        ws._ws.close();
      });
      const disconnectCallback = sinon.spy();
      ws.on('disconnect', disconnectCallback)
      setTimeout(testAsync(() => {
        disconnectCallback.should.not.be.called();
        ws.is('closed').should.be.true;
        done();
      }, done), 500);
    });
  })
});

const testAsync = (asserts, done) => () => {
  try {
    asserts();
  } catch (e) {
    return done(e);
  }
}
