import 'should';
import 'should-sinon';
import runSignatureFactory from '../src/signature-factory-runner';

import { sinon } from './test-utils';

describe('Run SignatureFactory', () => {
  it('normal case', () => {
    const signatureFactory = sinon.stub().returns({
      signature: 'signature',
      timestamp: Date.now(),
      nonce: 'nonce',
    });
    return runSignatureFactory(signatureFactory, ['ycui'])
      .then(() => {
        signatureFactory.should.be.calledWith('ycui');
      });
  });
  it('malformed signature', () =>
    runSignatureFactory(() => undefined, [])
      .should.be.rejectedWith('malformed signature')
  );
  it('signatureFactory throws', () =>
    runSignatureFactory(() => {
      throw new Error('error message');
    }, []).should.be.rejectedWith('sign error: error message')
  );
});
