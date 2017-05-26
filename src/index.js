import { Realtime } from './core';
import { IMPlugin, defineConversationProperty } from './plugin-im';

Realtime.defineConversationProperty = defineConversationProperty;
Realtime.__preRegisteredPlugins = [IMPlugin];

export * from './core';

export * from './plugin-im';
