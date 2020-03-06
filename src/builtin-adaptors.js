import superagent from 'superagent';
import WebSocket from 'ws';

export function request(url, { method, data, headers }) {
  const req = superagent(method, url);
  if (headers) {
    req.set(headers);
  }

  return req
    .send(data)
    .catch(error => {
      if (error.response) {
        return error.response;
      }
      throw error;
    })
    .then(({ status, ok, header, body }) => ({
      status,
      ok,
      headers: header,
      data: body,
    }));
}

export { WebSocket };
