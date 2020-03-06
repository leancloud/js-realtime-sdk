import d from 'debug';
import isPlainObject from 'lodash/isPlainObject';
import { timeout } from 'promise-timeout';
import { getAdaptor } from '../adaptor';
import { createError } from '../error';

const debug = d('LC:request');

export default ({
  method = 'GET',
  url: _url,
  query,
  headers,
  data,
  timeout: time,
}) => {
  let url = _url;
  if (query) {
    const queryString = Object.keys(query)
      .map(key => {
        const value = query[key];
        if (value === undefined) return undefined;
        const v = isPlainObject(value) ? JSON.stringify(value) : value;
        return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
      })
      .filter(qs => qs)
      .join('&');
    url = `${url}?${queryString}`;
  }
  debug('Req: %O %O %O', method, url, { headers, data });
  const request = getAdaptor('request');
  const promise = request(url, { method, headers, data })
    .then(response => {
      if (response.ok === false) {
        const error = createError(response.data);
        error.response = response;
        throw error;
      }
      debug('Res: %O %O %O', url, response.status, response.data);
      return response.data;
    })
    .catch(error => {
      if (error.response) {
        debug(
          'Error: %O %O %O',
          url,
          error.response.status,
          error.response.data
        );
      }
      throw error;
    });
  return time ? timeout(promise, time) : promise;
};
