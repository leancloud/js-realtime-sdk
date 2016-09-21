import 'should';
import 'should-sinon';
import should from 'should/as-function';
import {
  tap,
  tryAll,
  Cache,
  keyRemap,
  union,
  difference,
  ensureArray,
  setValue,
} from '../src/utils';
import { wait, sinon } from './test-utils';

describe('Utils', () => {
  describe('tap', () => {
    it('should return previous promise', () => {
      const interceptor = sinon.stub().returns(2);
      return Promise.resolve(1).then(tap(interceptor)).then((result) => {
        result.should.be.equal(1);
        interceptor.should.be.calledOnce();
      });
    });
  });

  describe('tryAll', () => {
    const resolve = value => res => res(value);
    const reject = value => (res, rej) => rej(value);
    it('should return the first resolved promise', () =>
      tryAll([reject(0), resolve(1), reject(2), resolve(3)]).then(
        (result) => {
          result.should.be.equal(1);
        }
      )
    );
    it('should be rejected if non resolved', (done) => {
      tryAll([reject(0), reject(1)]).catch(
        () => done()
      ).catch(done);
    });
    it('should be synchronized', () => {
      const successCallback = sinon.spy();
      const failCallback = sinon.spy();
      return tryAll([
        res => res(successCallback()),
        (res, rej) => rej(failCallback()),
      ]).then(
        () => {
          successCallback.should.be.calledOnce();
          failCallback.should.have.callCount(0);
        }
      );
    });
  });

  describe('Cache', () => {
    it('get/set', () => {
      const cache = new Cache();
      should(cache.get('__test')).be.null();
      cache.set('__test', 1);
      cache.get('__test').should.equal(1);
      cache.set('__test', '1', 100);
      cache.get('__test').should.equal('1');
      return wait(110).then(() => should(cache.get('__test')).be.null());
    });
  });

  describe('keyRemap', () => {
    it('remap', () => {
      keyRemap({
        a: 'x',
        b: 'y',
      }, {
        a: 1,
        c: 2,
      }).should.be.eql({
        x: 1,
        c: 2,
      });
    });
  });

  describe('iterator tools', () => {
    const a = [1, 1, 2, 3];
    const b = [2, 3, 4, 2];
    it('union', () => union(a, b).should.be.eql([1, 2, 3, 4]));
    it('difference', () => difference(a, b).should.be.eql([1]));
  });

  it('ensureArray', () => {
    ensureArray().should.eql([]);
    ensureArray(null).should.eql([]);
    ensureArray([]).should.eql([]);
    ensureArray(0).should.eql([0]);
    ensureArray([0]).should.eql([0]);
    ensureArray([[0]]).should.eql([[0]]);
  });

  it('setValue', () => {
    const target = { a: { b: { c: 1 }, d: 1 } };
    setValue(target, 'a.b.c', {}).should.eql({ a: { b: { c: {} }, d: 1 } });
    setValue(target, 'a.b.e.f', 1).should.eql({ a: { b: { c: {}, e: { f: 1 } }, d: 1 } });
    setValue(target, 'a.b', 1).should.eql({ a: { b: 1, d: 1 } });
    setValue(target, 'a', { b: 1 }).should.eql({ a: { b: 1 } });
  });
});
