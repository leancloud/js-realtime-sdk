import 'should';
import 'should-sinon';
import WebSocketPlus from '../src/websocket-plus';
import { listen, wait, sinon } from './test-utils';

describe('WebSocketPlus', () => {
  describe('open/close', () => {
    it('basic open and close', () => {
      const ws = new WebSocketPlus('wss://echo.websocket.org/');
      return listen(ws, 'open', 'error').then(() => {
        ws.is('connected').should.be.true();
        ws.close();
        ws.is('closed').should.be.true();
        (() => ws.open()).should.throw();
      });
    });
    it('error event should be emitted when got 404 error', (done) => {
      const ws = new WebSocketPlus('ws://404.github.com');
      ws.on('error', (error) => {
        error.should.be.instanceof(Error);
        done();
      });
    });
    it('backup endpoint should be used when the primary one fails', () => {
      const ws = new WebSocketPlus([
        'ws://404.github.com',
        'ws://echo.websocket.org/',
      ]);
      return listen(ws, 'open', 'error').then(() => ws.close());
    });
    it('should support promised endpoints', () => {
      const ws = new WebSocketPlus(Promise.resolve([
        'wss://echo.websocket.org/',
      ]));
      return listen(ws, 'open', 'error').then(() => ws.close());
    });
  });

  describe('send', () => {
    it('should throw if not connected', () => {
      const ws = new WebSocketPlus('ws://echo.websocket.org/');
      (() => ws.send()).should.throw(/Connection unavailable/);
      (() => ws._ping()).should.throw(/Connection unavailable/);
      ws.on('open', () => ws.close());
    });
  });

  describe('Auto reconnecting', () => {
    let ws;
    before(() => {
      ws = new WebSocketPlus('ws://echo.websocket.org/');
      return listen(ws, 'open', 'error');
    });
    after(() => {
      if (!ws.is('closed')) ws.close();
    });
    it('should reconnect when closed', () => {
      const disconnectCallback = sinon.spy();
      ws.on('disconnect', disconnectCallback);
      const scheduleCallback = sinon.spy();
      ws.on('schedule', scheduleCallback);
      const retryCallback = sinon.spy();
      ws.on('retry', retryCallback);
      ws._ws.close();
      return listen(ws, 'reconnect').then(() => {
        disconnectCallback.should.be.calledOnce();
        scheduleCallback.should.be.calledOnce();
        scheduleCallback.should.be.calledWith(0, 1000);
        retryCallback.should.be.calledOnce();
        retryCallback.should.be.calledWith(0);
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

  describe('online/offline', () => {
    let ws;
    before(() => {
      ws = new WebSocketPlus('ws://echo.websocket.org/');
      return listen(ws, 'open', 'error');
    });
    after(() => {
      if (!ws.is('closed')) ws.close();
    });
    it('should emit offline-disconnect-online-schedule in order', () => {
      const offlineCallback = sinon.spy();
      ws.on('offline', offlineCallback);
      const onlineCallback = sinon.spy();
      ws.on('online', onlineCallback);
      const listenDisconnect = listen(ws, 'disconnect');
      const listenSchedule = listen(ws, 'schedule');
      ws.pause();
      return listenDisconnect.then(() => {
        offlineCallback.should.be.calledOnce();
        ws.resume();
        return listenSchedule;
      }).then(() => {
        onlineCallback.should.be.calledOnce();
      });
    });
  });
});
