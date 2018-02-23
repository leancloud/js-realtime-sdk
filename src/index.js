import { Realtime } from './core';
import { IMPlugin, defineConversationProperty } from './plugin-im';
import * as CoreEvent from './events/core';
import * as IMEvent from './events/im';

Realtime.defineConversationProperty = defineConversationProperty;
Realtime.__preRegisteredPlugins = [IMPlugin];

const Event = {
  ...CoreEvent,
  ...IMEvent,
};

export {
  /**
   * SDK 可能会派发的事件枚举
   * @name Event
   * @memberof module:leancloud-realtime
   * @enum {String}
   * @since 4.0.0
   */
  Event,
};

export {
  /**
   * 错误码，详见 {@link https://leancloud.cn/docs/realtime_v2.html#云端错误码说明}
   * @name ErrorCode
   * @memberof module:leancloud-realtime
   * @enum {Number}
   * @since 3.3.0
   */
  ErrorCode,
} from './error';

export * from './core';

export * from './plugin-im';
