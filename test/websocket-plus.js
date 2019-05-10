import 'should';
import 'should-sinon';
import WebSocketPlus, {
  ERROR,
  OPEN,
  DISCONNECT,
  SCHEDULE,
  RETRY,
  RECONNECT,
  OFFLINE,
  ONLINE,
} from '../src/websocket-plus';
import { listen, wait, sinon } from './test-utils';

describe('WebSocketPlus', () => {
  describe('open/close', () => {
    it('basic open and close', () => {
      const ws = new WebSocketPlus('ws://demos.kaazing.com/echo');
      return listen(ws, OPEN, ERROR).then(() => {
        ws.is('connected').should.be.true();
        ws.close();
        ws.is('closed').should.be.true();
        (() => ws.open()).should.throw();
      });
    });
    it('error event should be emitted when got 404 error', done => {
      const ws = new WebSocketPlus('wss://404.github.com');
      ws.on(ERROR, error => {
        error.should.be.instanceof(Error);
        done();
      });
    });
    it('backup endpoint should be used when the primary one fails', () => {
      const ws = new WebSocketPlus([
        'wss://404.github.com',
        'ws://demos.kaazing.com/echo',
      ]);
      return listen(ws, OPEN, ERROR).then(() => ws.close());
    });
    it('should support promised endpoints', () => {
      const ws = new WebSocketPlus(
        Promise.resolve(['ws://demos.kaazing.com/echo'])
      );
      return listen(ws, OPEN, ERROR).then(() => ws.close());
    });
  });

  describe('send', () => {
    it('should throw if not connected', () => {
      const ws = new WebSocketPlus('ws://demos.kaazing.com/echo');
      (() => ws.send()).should.throw(/Connection unavailable/);
      (() => ws._ping()).should.throw(/Connection unavailable/);
      ws.on(OPEN, () => ws.close());
    });
  });

  describe('Auto reconnecting', () => {
    let ws;
    before(() => {
      ws = new WebSocketPlus('ws://demos.kaazing.com/echo');
      return listen(ws, OPEN, ERROR);
    });
    after(() => {
      if (!ws.is('closed')) ws.close();
    });
    it('should reconnect when closed', () => {
      const disconnectCallback = sinon.spy();
      ws.on(DISCONNECT, disconnectCallback);
      const scheduleCallback = sinon.spy();
      ws.on(SCHEDULE, scheduleCallback);
      const retryCallback = sinon.spy();
      ws.on(RETRY, retryCallback);
      ws._ws.close();
      return listen(ws, RECONNECT).then(() => {
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
      ws.on(DISCONNECT, disconnectCallback);
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
      ws = new WebSocketPlus('ws://demos.kaazing.com/echo');
      return listen(ws, OPEN, ERROR);
    });
    after(() => {
      if (!ws.is('closed')) ws.close();
    });
    it('should emit offline-disconnect-online-schedule in order', () => {
      const events = [];
      [DISCONNECT, OFFLINE, ONLINE, SCHEDULE].forEach(event => {
        ws.on(event, () => events.push(event));
      });
      const listenOffline = listen(ws, OFFLINE);
      const listenSchedule = listen(ws, SCHEDULE);
      ws.pause();
      return listenOffline
        .then(() => {
          events.should.eql([DISCONNECT, OFFLINE]);
          ws.resume();
          return listenSchedule;
        })
        .then(() => {
          events.should.eql([DISCONNECT, OFFLINE, ONLINE, SCHEDULE]);
        });
    });
  });
});
