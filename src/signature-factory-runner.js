import d from 'debug';
import { tap } from './utils';

const debug = d('LC:SignatureFactoryRunner');

function _validateSignature(signatureResult = {}) {
  const {
    signature,
    timestamp,
    nonce,
  } = signatureResult;
  if (typeof signature !== 'string'
      || typeof timestamp !== 'number'
      || typeof nonce !== 'string') {
    throw new Error('malformed signature');
  }
  return {
    signature,
    timestamp,
    nonce,
  };
}

export default (signatureFactory, params) =>
  Promise.resolve()
    .then(() => {
      debug(`call signatureFactory with ${params}`);
      return signatureFactory(...params);
    })
    .then(
      tap(signatureResult => debug('sign result %O', signatureResult)),
      (error) => {
        // eslint-disable-next-line no-param-reassign
        error.message = `sign error: ${error.message}`;
        debug(error);
        throw error;
      }
    )
    .then(_validateSignature);
