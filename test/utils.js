import 'should';
import 'should-sinon';
import { tap, tryAll } from '../src/utils';
import { Promise } from 'rsvp';

const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');

describe('utils', () => {
  describe('tap', () => {
    it('should return previous promise', () => {
      const interceptor = sinon.stub().returns(2);
      return Promise.resolve(1).then(tap(interceptor)).then(result => {
        result.should.be.equal(1);
        interceptor.should.be.calledOnce();
      });
    });
  });

  describe('tryAll', () => {
    const resolve = value => (res) => res(value);
    const reject = value => (res, rej) => rej(value);
    it('should return the first resolved promise', () =>
      tryAll([reject(0), resolve(1), reject(2), resolve(3)]).then(
        result => {
          result.should.be.equal(1);
        }
      )
    );
    it('should be rejected if non resolved', done => {
      tryAll([reject(0), reject(1)]).catch(
        () => done()
      ).catch(done);
    });
    it('should be synchronized', () => {
      const successCallback = sinon.spy();
      const failCallback = sinon.spy();
      return tryAll([
        (res) => res(successCallback()),
        (res, rej) => rej(failCallback()),
      ]).then(
        () => {
          successCallback.should.be.calledOnce();
          failCallback.should.have.callCount(0);
        }
      );
    });
  });
});
