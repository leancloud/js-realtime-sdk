/** core + plugins + runtime adapters */
import { WebSocket, request } from '@leancloud/runtime-adapters-node';
import { setAdapters } from './im';

setAdapters({
  WebSocket,
  request,
});

export * from './im';
