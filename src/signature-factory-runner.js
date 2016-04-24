import { tap } from './utils';
import { default as d } from 'debug';

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

export const run = (signatureFactory, params) =>
  Promise.resolve()
    .then(() => {
      debug(`call signatureFactory with ${params}`);
      return signatureFactory.apply(null, params);
    })
    .then(
      tap(signatureResult => debug('sign result', signatureResult)),
      error => {
        // eslint-disable-next-line no-param-reassign
        error.message = `sign error: ${error.message}`;
        debug(error);
        throw error;
      }
    )
    .then(_validateSignature);
