import d from 'debug';
import isPlainObject from 'lodash/isPlainObject';
import { getAdaptor } from '../adaptor';
import { createError } from '../error';

const debug = d('LC:request');

export default ({
  method = 'GET',
  url: _url,
  query,
  headers,
  data,
  timeout,
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
  debug('Req: %O %O %O', method, url, { query, headers, data });
  return getAdaptor('request')(url, { method, query, headers, data, timeout })
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
};
