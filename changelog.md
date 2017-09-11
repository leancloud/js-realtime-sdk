<a name="3.5.7"></a>
## [3.5.7](https://github.com/leancloud/js-realtime-sdk/compare/v3.5.5+source...v3.5.7) (2017-09-11)


### Bug Fixes

* **IM:** 修复了某些情况下登录后 `unreadmessagescountupdate` 或 `message` 等事件没有派发的问题 ([#570](https://github.com/leancloud/js-realtime-sdk/issues/570)) ([7de8432](https://github.com/leancloud/js-realtime-sdk/commit/7de8432))



<a name="3.5.6"></a>
## 3.5.6 (2017-08-29)


### Bug Fixes

* **WebSocketPlus:** 修复了在 Electron 的 Chromium 环境中报错的问题 ([15d16e5](https://github.com/leancloud/js-realtime-sdk/commit/5d582ac)), closes [#566](https://github.com/leancloud/js-realtime-sdk/issues/566)



<a name="3.5.5"></a>
## 3.5.5 (2017-07-28)


### Bug Fixes

* **IMClient:** 修复了 `getConversations` 方法在获取大量会话的时候可能会错误的返回部分 null 的问题 ([4a3d48f](https://github.com/leancloud/js-realtime-sdk/commit/4a3d48f))



<a name="3.5.4"></a>
## 3.5.4 (2017-07-28)


### Bug Fixes

* **IMClient:** 修复了 v3.5.3 中没有彻底修复的 createIMClient 失败后，使用相同的 id 再次创建会一直失败的问题 ([0cbe268](https://github.com/leancloud/js-realtime-sdk/commit/0cbe268))



<a name="3.5.3"></a>
## 3.5.3 (2017-07-28)


### Bug Fixes

* **IMClient:** 修复了 createIMClient 失败后，使用相同的 id 再次创建会一直失败的问题 ([#561](https://github.com/leancloud/js-realtime-sdk/issues/561)) ([b8d7c6a](https://github.com/leancloud/js-realtime-sdk/commit/b8d7c6a))
* **IMClient:** 修复了某些情况下 SDK 会出现 unhandled Promise rejection 的问题 ([#562](https://github.com/leancloud/js-realtime-sdk/issues/562)) ([697bf60](https://github.com/leancloud/js-realtime-sdk/commit/697bf60))



<a name="3.5.2"></a>
## 3.5.2 (2017-06-30)


### Bug Fixes

* 修复了 TypeScript 定义文件无效的问题 ([bb866f0](https://github.com/leancloud/js-realtime-sdk/commit/bb866f0))
* 修复了在某些情况下，`Conversation` 的 `lastMessage` 被修改或撤回后 `updatedAt` 时间不准确的问题 ([6ab82db](https://github.com/leancloud/js-realtime-sdk/commit/6ab82db))



<a name="3.5.1"></a>
## 3.5.1 (2017-06-20)


### Bug Fixes

* **Read:** 修复了在某些情况下将会话标记为已读无法成功清除其未读消息数的问题 ([89eb094](https://github.com/leancloud/js-realtime-sdk/commit/89eb094))。



<a name="3.5.0"></a>
# 3.5.0 (2017-06-15)


### Highlights
* **消息撤回与修改**：支持用户撤回或修改已发送的消息。
* **富媒体消息摘要**：支持在某些情况下以文字形式展示富媒体消息。


### Features

#### 消息撤回与修改

现在，用户可以在客户端通过 `Conversation#recall` 与 `Conversation#update` 方法撤回或修改已发送的消息了。撤回、修改消息后，该会话中的其他用户会立即通过 `messagerecall` 或 `messageupdate` 事件得到通知。

- 增加 `Conversation#recall` 与 `Conversation#update` 方法
- 增加 `Conversation` `messagerecall` 与 `messageupdate` 事件
- 增加 `IMClient` `messagerecall` 与 `messageupdate` 事件

此外，我们还提供了云引擎 hook 允许你实现撤回控制策略，例如只允许在发送消息后一段时间内撤回。

#### 富媒体消息摘要

富媒体消息在一些场景下需要以文本的形式展示，例如在会话列表页面显示最近一条消息时，红包消息需要显示为 `[红包] 节日快乐`。为了方便实现该功能，我们为 `TypedMessage` 增加了 `summary` 属性，视图层可以直接使用 `message.summary` 来得到字符串类型的「消息摘要」。SDK 内置的 TypedMessage 均已支持该功能。

#### 其他

* **ConversationQuery:** 增加了 `exists` 与 `doesNotExist` 方法


### Bug Fixes
* 修复了会话被删除后 SDK 无法正常派发未读消息数更新通知（`unreadmessagescountupdate`）的问题 ([#548](https://github.com/leancloud/js-realtime-sdk/issues/548))


### Miscellanies
* 增加了对存储 SDK LiveQuery 功能的支持
* 降低了客户端心跳频率，SDK 更加省电



<a name="3.4.1"></a>
## 3.4.1 (2017-04-17)


### Bug Fixes

* **IMClient:** 修复了收到在线消息时 `unreadmessagescountupdate` 事件回调的 `conversations` 参数不是数组的问题 ([#547](https://github.com/leancloud/js-realtime-sdk/issues/547)) ([9df01d8](https://github.com/leancloud/js-realtime-sdk/commit/9df01d8))
* **Read:** 修复了标记对话已读对系统消息不生效的问题 ([#544](https://github.com/leancloud/js-realtime-sdk/issues/544)) ([28dcf50](https://github.com/leancloud/js-realtime-sdk/commit/28dcf50))



<a name="3.4.0"></a>
# 3.4.0 (2017-04-06)


### Highlights

- **消息已读回执**：全面支持消息已读回执，包括单人聊天与多人聊天。
- **新未读消息数更新事件**：重新设计了更精确更友好的未读消息数更新机制。
- **掉线通知**：发送消息时可以指定其为「掉线消息」，掉线消息会延迟到该客户端掉线之后发送，从而实现「掉线通知」等需要用户在线状态的场景。
- **网络离线状态**：SDK 增加了网络「离线」状态。与之前的「断线」状态不同的是，处于离线状态时，SDK 不会试图进行重连直到网络恢复。这个状态的引入能加快网络变化时 SDK 的响应速度并降低用户的电量消耗。

### Features

#### 消息已读回执

为了更好的支持消息已读回执，标记会话已读的方法得到了重构，增加了 `Conversation#read` 方法，允许以任意的频率调用这个方法而无需担心达到单个客户端的每分钟命令数限额，因此用于批量标记的 `IMClient#markAllAsRead` 方法也被废弃。

- 增加 `Conversation#read` 方法
- 废弃 `Conversation#markAsRead` 方法，请使用 `Conversation#read` 方法
- 废弃 `IMClient#markAllAsRead` 方法，请分别调用对应的 `Conversation#read` 方法

SDK 内置了对单聊的已读回执支持。`Conversation` 增加了 `lastDeliveredAt` 与 `lastReadAt` 属性标记了该对话中最后一条已送达与已读的消息时间戳，可以通过 `Conversation#fetchReceiptTimestamps` 方法获取到这两个属性。对于在单聊中发送的需要回执的消息，当对方收到消息时，`lastDeliveredAt` 属性会得到更新，当对方标记会话已读时，`lastReadAt` 属性会得到更新。此外，由于 `reciept` 的含义发生了变化，我们还废弃了 `Conversation` 的 `reciept` 事件（请用 `lastdeliveredatupdate` 事件代替）。与之相关的 API 变化有：

- 增加 `Conversation#fetchReceiptTimestamps` 方法
- 增加 `Conversation` `lastDeliveredAt` 属性与 `lastdeliveredatupdate` 事件
- 增加 `Conversation` `lastReadAt` 属性与 `lastreadatupdate` 事件
- 废弃 `Conversation` `reciept` 事件，请使用 `lastdeliveredatupdate` 事件

群聊的已读回执的支持需要使用 [leancloud-realtime-plugin-groupchat-receipts](https://www.npmjs.com/package/leancloud-realtime-plugin-groupchat-receipts) 插件，详细的使用说明请参见其 [API 文档](https://url.leanapp.cn/groupchat-receipts-apidocs)。

#### 新未读消息数更新事件

我们希望最大限度的减少开发者维护状态的工作量，因此我们重新设计了对话的未读消息数更新机制。我们增加了 `unreadmessagescountupdate` 事件，该事件会在任意对话的未读消息数发生变化的时候被派发，包括了：

- 服务端更新了会话的未读消息数
- 收到在线消息
- 将会话标记未已读

开发者现在只需在接到 `unreadmessagescountupdate` 事件时刷新视图中对应的会话的未读消息数即可。之前在服务端更新会话的未读消息数时派发的 `unreadmessages` 事件因为不再需要被废弃。

- 增加 `IMClient` `unreadmessagescountupdate` 事件
- 废弃 `IMClient` `unreadmessages` 事件，请使用 `unreadmessagescountupdate` 事件

#### 掉线通知

在一些即时互动的应用中，会话成员的在线状态是很重要的信息，用户加入或退出会话时可以主动广播自己的在线状态变化，但如果用户掉线了，会话中的其他成员将得不到及时的通知。为了解决这个问题，我们为发送消息方法增加了 `will` 发送选项指定消息为「掉线消息」，掉线消息会延迟到该客户端掉线之后自动发送。

- 增加 `Conversation#send` 方法新的发送选项 `sendOptions.will`

#### 网络离线状态

之前，SDK 通过维持心跳包来检测是否与服务器保持连接，在网络状态变化时 SDK 可能会需要几分钟的时间才能进入「掉线」状态，并会立即开始尝试重连，同样在网络恢复之后也可能需要几分钟才会开始下一次重连。SDK 引入了新的「离线」状态，在离线状态时，SDK 不会试图进行重连直到网络恢复。

在浏览器中，SDK 会通过 Network Information API 感知到网络的变化自动进入离线状态，在进入离线状态时会派发 `offline` 事件，在恢复在线时会派发 `online` 事件。在其他环境中可以通过调用 `Realtime#pause` 与 `Realtime#resume` 方法来手动进入或离开离线状态，可以实现实时通信在 App 被切到后台挂起、切回前台恢复等功能。

- `Realtime` 与 `IMClient` 增加了 `offline` 与 `online` 事件
- 增加 `Realtime#pause` 与 `Realtime#resume` 方法

#### 其他

- `Conversation#send` 方法中的发送选项 `sendOption.reciept` 的拼写错误已被订正为 `sendOption.receipt`，错误的选项已被废弃。
- 插件机制增加了 `beforeMessageDispatch` 扩展点，允许在 SDK 解析消息之后，派发消息之前，控制是否派发该消息。



<a name="3.3.4"></a>
## 3.3.4 (2017-01-11)


### Bug Fixes

* **Conversation:** 修复了 send 方法的 `options.transient` 不生效的问题 ([#502](https://github.com/leancloud/js-realtime-sdk/issues/502)) ([f8c0b49](https://github.com/leancloud/js-realtime-sdk/commit/f8c0b49))



<a name="3.3.3"></a>
## 3.3.3 (2016-12-16)


### Bug Fixes

* 修复 React Native 与小程序中访问 `navigator.userAgent` 导致异常的问题 ([#469](https://github.com/leancloud/js-realtime-sdk/issues/469)) ([4a1abd7](https://github.com/leancloud/js-realtime-sdk/commit/4a1abd7))



<a name="3.3.2"></a>
## 3.3.2 (2016-12-14)


### Bug Fixes

* 支持微信小程序真机 ([#458](https://github.com/leancloud/js-realtime-sdk/issues/458)) ([fc9e346](https://github.com/leancloud/js-realtime-sdk/commit/fc9e346))



<a name="3.3.1"></a>
## 3.3.1 (2016-11-16)


### Bug Fixes

在 3.3.0 中`send` 方法增加了 `options` 参数，与消息内容无关的信息现在作为发送选项设置，但是遗漏了 transient（暂态）信息。在这个补丁中 transient（暂态）从消息的属性变为了发送选项。
* **Conversation:**`send` 方法的 `options` 参数增加了 `options.transient` 参数，用于指定是否作为暂态消息发送 ([#439](https://github.com/leancloud/js-realtime-sdk/issues/439)) ([9b4d2ef](https://github.com/leancloud/js-realtime-sdk/commit/9b4d2ef))
* **Message:** 废弃了 `Message#setTransient` 方法与 Message 的 `transient` 属性，请使用 `Conversation#send` 方法的 `options.transient` 代替。请不要将是否为暂态作为区分某些消息的标记，可以使用富媒体消息的属性（attributes）或使用自定义消息类型代替。

<a name="3.3.0"></a>
# 3.3.0 (2016-10-24)


### Features

* 支持微信小程序 ([#417](https://github.com/leancloud/js-realtime-sdk/issues/417)) ([5e138cc](https://github.com/leancloud/js-realtime-sdk/commit/5e138cc))
* **Conversation:** 增加 `system` 属性，标识对话是否是系统对话 ([#357](https://github.com/leancloud/js-realtime-sdk/issues/357)) ([075d508](https://github.com/leancloud/js-realtime-sdk/commit/075d508))
* **Conversation:** `send` 方法新增参数 `options`，与消息内容无关的信息现在作为发送选项设置，可选的参数包括
  * `options.pushData`：离线推送内容
  * `options.priority`：聊天室消息的优先级
  * `options.receipt`：是否需要送达回执
* **Message:** 废弃了 `Message#setNeedReceipt` 方法与 Message 的 `needReceipt` 属性，推荐使用 `Conversation#send` 方法的 `options.receipt` 参数 ([a38c481](https://github.com/leancloud/js-realtime-sdk/commit/a38c481))
* **Error:** 新增了 ErrorCode，用于判断捕获的异常 ([#353](https://github.com/leancloud/js-realtime-sdk/issues/353)) ([bbdf608](https://github.com/leancloud/js-realtime-sdk/commit/bbdf608))
* 增加 TypeScript 定义文件 ([#373](https://github.com/leancloud/js-realtime-sdk/issues/373)) ([2e5da17](https://github.com/leancloud/js-realtime-sdk/commit/2e5da17))


<a name="3.2.3"></a>
## 3.2.3 (2016-09-05)


### Bug Fixes

* **WebSocketPlus:** 修复了 iOS 下开启飞行模式会导致自动重连机制失效的问题 ([#369](https://github.com/leancloud/js-realtime-sdk/issues/369)) ([c563483](https://github.com/leancloud/js-realtime-sdk/commit/c563483))



<a name="3.2.2"></a>
## 3.2.2 (2016-08-29)


### Bug Fixes

* **unread:** 修复了 `unreadmessages` 事件中 `payload.lastMessageTimestamp` 值为无效时间的问题 ([#355](https://github.com/leancloud/js-realtime-sdk/issues/355)) ([bf5727d](https://github.com/leancloud/js-realtime-sdk/commit/bf5727d))
* **unread:** 修复了标记为已读时有可能会漏掉消息的问题 ([#355](https://github.com/leancloud/js-realtime-sdk/issues/355)) ([bf5727d](https://github.com/leancloud/js-realtime-sdk/commit/bf5727d))



<a name="3.2.1"></a>
## 3.2.1 (2016-08-12)


### Bug Fixes

* **IMClient:** 3.2.0 中废弃 `Conversation` 的 `attributes` 属性时遗漏了 `IMClient#createIMClient` 的 `options.attributes` 参数。这个补丁废弃了这个参数，并支持直接使用 `options[propertyName]` 来定义 `Conversation` 的自定义属性 ([#343](https://github.com/leancloud/js-realtime-sdk/issues/343)) ([05ce2c5](https://github.com/leancloud/js-realtime-sdk/commit/05ce2c5))



<a name="3.2.0"></a>
# 3.2.0 (2016-08-10)


### Bug Fixes

* **IMClient:** 修复了用户有可能移除内部事件导致 client 无法正常 close 的问题 ([#325](https://github.com/leancloud/js-realtime-sdk/issues/325)) ([4945c26](https://github.com/leancloud/js-realtime-sdk/commit/4945c26))


### Features

* **Conversation:** 新的自定义属性相关 API 变动：

  * 增加了 `Conversation#get`，`Conversation#set` 方法
  * 废弃了 `Conversation` 的 `attributes` 属性，以及 `setAttribute`、`setAttributes`、`setName` 方法
  * 修复了 `Conversation#setAttribute` 会删除 `attr` 列中其他字段的错误行为
  * 增加了 `Realtime.defineConversationProperty` 方法

  详情说明与迁移指南请参考 [《新的 Conversation 自定义属性 API》](https://url.leanapp.cn/DeprecateAttributes)

* **Message:** 实现了消息送达回执，为 `Message` 类增加了状态属性（`status`），详细说明请参考 [《JavaScript 实时通信开发指南 - 消息送达回执》](https://leancloud.cn/docs/realtime_guide-js.html#消息送达回执)([#326](https://github.com/leancloud/js-realtime-sdk/issues/326)) ([34c6d08](https://github.com/leancloud/js-realtime-sdk/commit/34c6d08))
* **Realtime:** 减少了断线重连的开销，为 `IMClient` 增加了 `disconnect`，`schedule`，`retry`，`reconnect` 与 `reconnecterror` 事件 ([affbd5f](https://github.com/leancloud/js-realtime-sdk/commit/affbd5f))



<a name="3.1.3"></a>
## 3.1.3 (2016-08-02)


### Bug Fixes

* **package:** 修复 3.1.1 中引入的在 React Native 中引入 SDK 抛无法找到 `fs` 模块异常的问题


<a name="3.1.2"></a>
## 3.1.2 (2016-07-26)


### Bug Fixes

* **ConversationQuery:** 修复会话查询排序相关方法（`ascending`, `addAscending`, `descending`, `addDescending`）没有生效的问题 ([#312](https://github.com/leancloud/js-realtime-sdk/issues/312)) ([cb86299](https://github.com/leancloud/js-realtime-sdk/commit/cb86299))



<a name="3.1.1"></a>
## 3.1.1 (2016-07-20)


### Bug Fixes

* **package:** 修复使用 webpack 等 bundlers 无法加载 leancloud-realtime 的问题 ([a8abdec](https://github.com/leancloud/js-realtime-sdk/commit/a8abdec))



<a name="3.1.0"></a>
# 3.1.0 (2016-07-18)
同时发布
- leancloud-realtime-plugin-typed-messages 1.0.0
- leancloud-realtime-plugin-webrtc 1.0.0-beta.1

从这个版本开始，插件的 changelog 将更新在具体的插件目录下。

### Features

* **Plugin:** 支持通过插件来对功能进行扩展，详细说明请参考 [《JavaScript 实时通信开发指南 - 插件》](https://leancloud.cn/docs/realtime_guide-js.html#插件)。
* **Plugin/TypedMessage:** leancloud-realtime-typed-messages 包改名为 leancloud-realtime-plugin-typed-messages，新增 export `TypedMessagesPlugin`：

  ```javascript
  const { Realtime } = require('leancloud-realtime');

  // before (use package leancloud-realtime-typed-messages)
  const { AudioMessage, FileMessage, ImageMessage, LocationMessage, VideoMessage } = require('leancloud-realtime-typed-messages');
  const realtime = new Realtime({
    appId: 'APP_ID',
  });
  realtime.register([AudioMessage, FileMessage, ImageMessage, LocationMessage, VideoMessage]);

  // after (use package leancloud-realtime-plugin-typed-messages)
  const { TypedMessagesPlugin } = require('leancloud-realtime-plugin-typed-messages');
  const realtime = new Realtime({
    appId: 'APP_ID',
    plugins: [TypedMessagesPlugin],
  });

  ```

  详细的安装与初始化说明请参考 [《JavaScript 实时通信开发指南 - 富媒体消息插件》](https://leancloud.cn/docs/realtime_guide-js.html#富媒体消息插件)。
* **Plugin/WebRTC:** 发布了 WebRTC 插件的 beta 版本。该插件能帮助你实现 Web 端点对点实时音视频通话功能。详细的文档请参考 [《JavaScript 实时通讯 WebRTC 插件使用指南》](https://leancloud.cn/docs/webrtc-js.html)。



<a name="3.0.2"></a>
## 3.0.2 (2016-06-30)


### Bug Fixes

* **ConversationQuery:** 指定 `withLastMessagesRefreshed` 时，查询结果的 lastMessage 现在包含了完整的信息（`from`、`id`） ([#285](https://github.com/leancloud/js-realtime-sdk/issues/285)) ([51bda7e](https://github.com/leancloud/js-realtime-sdk/commit/51bda7e))



<a name="3.0.1"></a>
## 3.0.1 (2016-06-27)


### Bug Fixes

* 修复了在 React Native for Android 中抛 `Attempted to assign to readonly property` 异常的问题 ([ac02fa3](https://github.com/leancloud/js-realtime-sdk/commit/ac02fa3)), closes [#281](https://github.com/leancloud/js-realtime-sdk/issues/281)



<a name="3.0.0"></a>
# 3.0.0 (2016-06-22)
同时发布
- leancloud-realtime-typed-messages 1.0.0

### Bug Fixes

* **TypedMessages:** 修复在部分浏览器中抛出 `Object.assign` 未定义的异常 ([a0fa8ca](https://github.com/leancloud/js-realtime-sdk/commit/a0fa8ca))


### Features

* 兼容 IE10 ([75d325d](https://github.com/leancloud/js-realtime-sdk/commit/75d325d))



<a name="3.0.0-beta.4"></a>
# 3.0.0-beta.4 (2016-05-30)
同时发布
- leancloud-realtime-typed-messages 1.0.0-beta.3


### Bug Fixes

* **Conversation:** 修复缓存中的 `Conversation` 有时被错误地更新为 `undefined` 的问题 ([91ae143](https://github.com/leancloud/js-realtime-sdk/commit/91ae143))，感谢 [@dangyuluo](https://github.com/dangyuluo)
* **ConversationQuery:** 废弃 `withLastMessages` 方法，请使用 `withLastMassagesRefreshed` 代替，两个 API 没有区别，重命名是为了避免误解 ([6afbd43](https://github.com/leancloud/js-realtime-sdk/commit/6afbd43))
* **FileMessage:** 修复 FileMessage 使用 avoscloud-sdk@^1.0.0-rc9 时的兼容性问题([6a2fd12](https://github.com/leancloud/js-realtime-sdk/commit/6a2fd12))
* **MessageIterator:** 修复对某次查询结果数据进行操作会影响下次查询结果的问题 ([ff899e0](https://github.com/leancloud/js-realtime-sdk/commit/ff899e0))，感谢 [@dangyuluo](https://github.com/dangyuluo)
* **Realtime:** 修复了在收到某些消息时抛出 `unhandled promise rejection` 异常的问题 ([e68e87d](https://github.com/leancloud/js-realtime-sdk/commit/e68e87d))，感谢 [@han4wluc](https://github.com/han4wluc)
* **TypedMessages:** 修复了 leancloud-realtime-typed-messages 不支持 AMD loaders 的问题 ([dd82fb8](https://github.com/leancloud/js-realtime-sdk/commit/dd82fb8))
* **WebSocketPlus:** 当连接不可用时，调用部分 API 抛出更加有指导意义的异常与提示 ([4b3c841](https://github.com/leancloud/js-realtime-sdk/commit/4b3c841))，感谢 [@han4wluc](https://github.com/han4wluc)



<a name="3.0.0-beta.3"></a>
# 3.0.0-beta.3 (2016-05-16)
同时发布
- leancloud-realtime-typed-messages 1.0.0-beta.2


### Bug Fixes

* **Bundle:** 修复与 AMD loaders (require.js) 一起使用报错的问题 ([8ae8093](https://github.com/leancloud/js-realtime-sdk/commit/8ae8093))
* **Realtime:** 修复了误报跨域的问题 ([#225](https://github.com/leancloud/js-realtime-sdk/issues/225)) ([1e7d0ef](https://github.com/leancloud/js-realtime-sdk/commit/1e7d0ef))
* **FileMessage:** 增强了 FileMessage 对非标准消息的兼容 ([e86d4c4](https://github.com/leancloud/js-realtime-sdk/commit/e86d4c4))
* **TypedMessages:** 修复 leancloud-realtime-typed-messages 在不支持 ES6 语法的浏览器上报错的问题 ([abcfbd7](https://github.com/leancloud/js-realtime-sdk/commit/abcfbd7))


### Features

* **Realtime:** 支持动态路由 ([9b753c6](https://github.com/leancloud/js-realtime-sdk/commit/9b753c6))



<a name="3.0.0-beta.2"></a>
# [3.0.0-beta.2](https://github.com/leancloud/js-realtime-sdk/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2016-05-07)


### Bug Fixes

* **Conversation:** 创建暂态对话时不再必须传入 members 参数 ([1bb7cc2](https://github.com/leancloud/js-realtime-sdk/commit/1bb7cc2))
* **Realtime:** 修正创建匿名客户端会导致连接不会自动关闭的问题 ([7675b2a](https://github.com/leancloud/js-realtime-sdk/commit/7675b2a))

### Features

* **IMClient:** 新增 IMClient#markAllAsRead() 方法 ([288623c](https://github.com/leancloud/js-realtime-sdk/commit/288623c))
* **Realtime:** 新增 schedule 事件，实现新的断线重连事件机制 ([#208](https://github.com/leancloud/js-realtime-sdk/issues/208Â))([bd8cdc7](https://github.com/leancloud/js-realtime-sdk/commit/bd8cdc7))

<a name="3.0.0-beta.1"></a>
# 3.0.0-beta.1 (2016-04-24)
* **(BREAKING)** 重新设计了 API，主要改进有：
  * 提供了面向对象的，与其他平台 SDK 统一的 API
  * Promise 化的异步 API
  * 新的事件模型
  * 完善的异常机制
  * 可扩展的消息类型系统
* 新增对以下特性的支持：
  * 单点登录
  * 「未读消息通知」模式
  * 对话查询条件构造器
* 增强了断线重连的可靠性
* 采用了二进制协议，减少了传输消息时的流量消耗
* **(BREAKING)** 停止对 IE10 及以下版本的支持。如果需要支持这些运行环境请使用 2.x 版本。

# Legacies
## 2.3.5
### Bug Fixes
* 修复 query 方法自动增加当前用户为条件的 Bug

## 2.3.3
### Bug Fixes
* query 方法支持搜索多个 members 同时所在的房间
* query 方法支持搜索多个 roomId 所在的 room 信息
* 支持地位位置信息的传递

## 2.3.2
### Features
* 支持 React Native
* 创建对话支持 `unique` 参数

## 2.3.1
### Features
* 支持接收自定义类型消息

### Bug Fixes
* 修复一个可能导致签名校验失败的 bug

## 2.3.0
### Features
* 增加 `invited`, `kicked`, `membersjoined`, `membersleft` 事件，废弃 `join`, `left` 事件

### Bug Fixes
* 修复 IE8、IE9 无法连接服务器的 bug
* 修复没有加入的 conversation 无法查询成员的 bug

## 2.2.1
### Features
* 内置 [ws](https://www.npmjs.com/package/ws) 作为默认 WebSocket 实现，在 node 运行环境中使用时不再要求配置 WebSocket 类。

## 2.2.0
### Features
* 支持 node 运行环境
* 支持使用 browserify 打包
* 优化了用户使用过程中的流量消耗 (2c0f88cc23f5ed29c0a84e9af5e5576ae4c74193)
* RealtimeObject 实例暴露了 clientId 字段 (05a6f2668aad1576ff7324004733efe62f174d5f)

### Breaking Changes
* 由于增加了编译环节，现在在浏览器中直接使用时应该加载 dist/AV.realtime.js（之前是直接使用 src/AV.realtime.js）

### Bug Fixes
* 切换到了 leancloud.cn 域名，解决某些地区的劫持问题 (d0cd5f934a1c25f61504edb1e180448b61634fb5)

## 2.1.0
* 创建 Room 更简单，支持只传入 CallBack，参数变为可选
* 修改初始化 Room 属性为 attr（原来是 data 字段）
* 初始化属性在服务端 Conversation 表中结构修改，与之前版本不兼容，存储在 attr 字段内
* 增加创建 Room 的名称，提供一个默认字段 name
* 防止同一个 realtime 实例可能产生两个 websocket 实例

## 2.0.7
* 修正创建暂态聊天室失败的问题
* 兼容 IE9
* 对在 open 之前调用方法增加友好报错

## 2.0.6
* 支持自定义的 JSON，并兼容其他端 SDK
* close 事件中可以获取 websocket 关闭的 event 对象

## 2.0.5
* 修正获取 conversation 历史消息的 bug，并且支持多端通信协议
* 修正 tool.ajax 有时不会返回错误信息的 bug

## 2.0.4
* 修正关闭 encodeHTML 时多媒体格式没有对 text 赋值

## 2.0.3
* 提供兼容 IE8+ 低版本浏览器的插件方式
* 修改获取已有 conversation id 没有判断在服务器端是否存在
* 提供获取 conversation 初始化属性的方式
* 开放 secure 选项，用户可以手动关闭 SSL 协议

## 2.0.2
* 修复与 iOS 及 Android 端 SDK 通信的 bug
* 创建 conversation 成功后，回调中可以直接取到 convObject
* 修正 convObject.update 方法的 bug
* 补充对接受的消息做 HTML 转义处理，SDK 层面支持 XSS 防御

## 2.0.1
* 修正事件中心中的 bug
* 增加 realtimeObject.ping 判断用户在线状态
* 修正调用 close() 方法的 bug
* ajax 返回 2xx 都应该认为正确
* 心跳链接中的 bug，close 之后无法停止
* 修正已有的 conversation 获取实例失败的 bug
