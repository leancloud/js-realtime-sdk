import uuid from 'uuid/v4';
import { APP_ID, REGION } from '../../../test/configs';
import { Realtime } from '../../../src/core';
import { LiveQueryPlugin } from '../src/';

const realtime = new Realtime({
  appId: APP_ID,
  region: REGION,
  plugins: [LiveQueryPlugin],
});

describe('LiveQuery', () => {
  it('login and logout', () =>
    realtime.createLiveQueryClient(uuid()).then(client => client.close()),
  );
});
