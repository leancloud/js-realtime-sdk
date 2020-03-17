/** core + plugins + platform adapters */
import { WebSocket, request } from '@leancloud/platform-adapters-node';
import { setAdapters } from './im';

setAdapters({
  WebSocket,
  request,
});

export * from './im';
