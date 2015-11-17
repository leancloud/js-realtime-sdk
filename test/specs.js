/* jshint -W064 */
'use strict';

require('es6-promise').polyfill();
require('should');
var Should = require('should/as-function');
var sinon = require('sinon');
require('should-sinon');

// 请将 AppId 改为你自己的 AppId
var APP_ID = process.env.APP_ID || 'anruhhk6visejjip57psvv5uuv8sggrzdfl9pg2bghgsiy35';
var REGION = process.env.REGION;

var convName = 'js-realtime-sdk-testconv';

var realtime = require('..');

var rt;
var rt2;
var rt3;

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});

before(function(done) {
  // 创建聊天实例，大部分 case 用的都是这个实例
  Promise.all([
    new Promise(function(resolve) {
      rt = realtime({
        appId: APP_ID,
        region: REGION,
        clientId: 'js-realtime-sdk-test-client1'
      }, resolve);
    }),
    new Promise(function(resolve) {
      rt2 = realtime({
        appId: APP_ID,
        region: REGION,
        clientId: 'js-realtime-sdk-test-client2'
      }, resolve);
    })
  ]).then(function() {
    done();
  });
});

describe('realtime', function() {
  describe('init', function() {
    it('param check', function() {
      (function() {
        realtime();
      }).should.throw();

      (function() {
        realtime({});
      }).should.throw();
    });
    it('callback and "open" event', function(done) {
      Promise.all([
        new Promise(function(resolve) {
          rt3 = realtime({
            appId: APP_ID,
            region: REGION,
            clientId: 'js-realtime-sdk-test-client-for-init'
          }, resolve);
        }),
        new Promise(function(resolve) {
          rt3.on('open', resolve);
        })
      ]).then(function() {
        done();
      });
    });
  });

  describe('version', function() {
    it('consistency ', function() {
      var bowerData = require('../bower.json');
      var packageData = require('../package.json');
      bowerData.version.should.equal(realtime.version);
      packageData.version.should.equal(realtime.version);
    });
  });
});

describe('RealtimeObject', function() {
  describe('#open()', function() {});

  describe('#close()', function() {
    it('ws.close should be called', function() {
      this.sinon.spy(rt3.cache.ws, 'close');
      rt3.close();
      rt3.cache.ws.close.should.be.called();
    });
  });

  describe('is an eventCenter', function() {
    it('#on() and emit()', function() {
      var callback = this.sinon.spy();
      var data = {};
      rt3.on('testevent', callback);
      rt3.emit('testevent', data);
      callback.should.be.calledOnce().and.calledWith(data);
      rt3.emit('testevent');
      callback.should.be.calledTwice();
    });
    it('#off(eventName, callback)', function() {
      var callback = this.sinon.spy();
      rt3.on('testevent', callback);
      rt3.off('testevent', callback);
      rt3.emit('testevent');
      callback.should.not.be.called();
    });
    it.skip('#off(eventName)', function() {
      var callback = this.sinon.spy();
      rt3.on('testevent', callback);
      rt3.off('testevent');
      rt3.emit('testevent');
      callback.should.not.be.called();
    });
    it('#once()', function() {
      var callback = this.sinon.spy();
      var data = {};
      rt3.once('testevent', callback);
      rt3.emit('testevent', data);
      rt3.emit('testevent');
      callback.should.be.calledOnce().and.calledWith(data);
    });
  });

  describe('#room()', function() {
    it.skip('param check', function() {
      (function() {
        rt.room();
      }).should.throw();
      (function() {
        rt.room(1);
      }).should.throw();
    });
    it('fetch an exsiting room', function(done) {
      var id = process.env.EXSITING_ROOM_ID || '559d08a1e4b0a35bc5062ba1';
      rt.room(id, function(room) {
        room.should.have.properties(['id', 'name', 'attr']);
        done();
      });
    });
    it('fetch a none-existing room', function(done) {
      rt.room('noneexistingroomid', function(room) {
        Should.equal(room, null);
        done();
      });
    });
    it('create a room');
    it('create a unique room', function(done) {
      rt.room({
        name: convName,
        members: ['LeanCloud-unique'],
        unique: true
      }, function(room1) {
        rt.room({
          name: convName,
          members: ['LeanCloud-unique'],
          unique: true
        }, function(room2) {
          room1.id.should.equal(room2.id);
          done();
        });
      });
    });
    it('RoomObject instance should be cached', function(done) {
      var room = rt.room({
        name: convName,
      }, function(room1) {
        // console.log('new room created: ', room);
        rt.room(room1.id, function(room2) {
          Should(room1).be.exactly(room2);
          done();
        });
      });
    });
  });

  describe('#conv()', function() {
    it('is an alise of #room()', function() {
      this.sinon.spy(rt, 'room');
      var callback = function() {};
      rt.conv('', callback, 'blabla');
      rt.room.should.be.calledWith('', callback, 'blabla');
    });
  });

  describe('#query()', function() {});

  describe('#ping()', function() {});
});
