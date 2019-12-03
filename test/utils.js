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
  throttle,
  encode,
  decode,
} from '../src/utils';
import { wait, sinon } from './test-utils';

describe('Utils', () => {
  describe('tap', () => {
    it('should return previous promise', () => {
      const interceptor = sinon.stub().returns(2);
      return Promise.resolve(1)
        .then(tap(interceptor))
        .then(result => {
          result.should.be.equal(1);
          interceptor.should.be.calledOnce();
        });
    });
  });

  describe('tryAll', () => {
    const resolve = value => res => res(value);
    const reject = value => (res, rej) => rej(value);
    it('should return the first resolved promise', () =>
      tryAll([reject(0), resolve(1), reject(2), resolve(3)]).then(result => {
        result.should.be.equal(1);
      }));
    it('should be rejected if non resolved', done => {
      tryAll([reject(0), reject(1)])
        .catch(() => done())
        .catch(done);
    });
    it('should be synchronized', () => {
      const successCallback = sinon.spy();
      const failCallback = sinon.spy();
      return tryAll([
        res => res(successCallback()),
        (res, rej) => rej(failCallback()),
      ]).then(() => {
        successCallback.should.be.calledOnce();
        failCallback.should.have.callCount(0);
      });
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
      keyRemap(
        {
          a: 'x',
          b: 'y',
        },
        {
          a: 1,
          c: 2,
        }
      ).should.be.eql({
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

  describe('encode/decode', () => {
    it('falsy', () => {
      should(encode()).eql(undefined);
      should(decode()).eql(undefined);
    });
    it('Date', () => {
      const json = { a: [{ b: new Date(0) }] };
      const encoded = encode(json);
      encoded.should.eql({
        a: [
          {
            b: {
              __type: 'Date',
              iso: '1970-01-01T00:00:00.000Z',
            },
          },
        ],
      });
      decode(encoded).should.eql(json);
    });
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
    setValue(target, 'a.b.e.f', 1).should.eql({
      a: { b: { c: {}, e: { f: 1 } }, d: 1 },
    });
    setValue(target, 'a.b', 1).should.eql({ a: { b: 1, d: 1 } });
    setValue(target, 'a', { b: 1 }).should.eql({ a: { b: 1 } });
  });

  describe('throttle', () => {
    class Counter {
      constructor() {
        this.value1 = 0;
        this.value2 = 0;
      }

      @throttle(100)
      inc1() {
        this.value1 += 1;
      }

      @throttle(200)
      inc2() {
        this.value2 += 1;
      }
    }
    it('excution should be delayed', () => {
      const counter = new Counter();
      counter.inc1();
      // leading call should be excuted immediatly
      counter.value1.should.eql(1);
      counter.inc1();
      counter.inc1();
      counter.value1.should.eql(1);
      return wait(110)
        .then(() => {
          counter.value1.should.eql(2);
          counter.inc1();
          counter.value1.should.eql(2);
          counter.inc1();
          return wait(100);
        })
        .then(() => {
          counter.value1.should.eql(3);
        });
    });
    it('should work with multi instances/properties', () => {
      const counter = new Counter();
      const counter2 = new Counter();
      counter.inc1();
      counter.inc2();
      counter2.inc2();
      counter.value1.should.eql(1);
      counter.value2.should.eql(1);
      counter2.value2.should.eql(1);
      counter.inc1();
      counter.inc2();
      return wait(110)
        .then(() => {
          counter.value1.should.eql(2);
          counter.value2.should.eql(1);
          counter2.value2.should.eql(1);
          return wait(100);
        })
        .then(() => {
          counter.value1.should.eql(2);
          counter.value2.should.eql(2);
          counter2.value2.should.eql(1);
        });
    });
  });
});
