import { APP_ID, APP_KEY, REGION } from '../../test/configs';
import AV from 'avoscloud-sdk';

import './file-message';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY,
  region: REGION,
});
