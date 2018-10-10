<a name="4.2.1"></a>

## [4.2.1](https://github.com/leancloud/js-realtime-sdk/compare/v4.2.0...v4.2.1) (2018-10-09)

### Bug Fixes

- 现在能正确处理对话属性中的数组类型了。
- 移除了关于 `region` 参数不再使用的警告。

<a name="4.2.0"></a>

# [4.2.0](https://github.com/leancloud/js-realtime-sdk/compare/v4.1.0...v4.2.0) (2018-07-06)

### Features

- 改进了 TypeScript 定义，现在事件回调的参数也会得到类型推导与提示：
  ![Type inference](https://user-images.githubusercontent.com/175227/42360160-933389f8-8119-11e8-9b76-a114a184e4ff.png)
- `Realtime` 初始化时不再需要 `region` 参数了。

<a name="4.1.0"></a>

# [4.1.0](https://github.com/leancloud/js-realtime-sdk/compare/v4.0.1...v4.1.0) (2018-06-24)

在这个版本中，我们主要对话成员管理功能进行了一些调整。

### Features

- 增加了新角色 `ConversationMemberRole.OWNER`。现在对群主、管理员与成员的判断有了更一致的判断方法。
- `Conversation#getAllMemberInfo` 方法默认会利用缓存，因此开发者可以频繁的调用这个方法来获取最新的成员信息。

### Bug Fixes

- 修复了 `Conversation#getAllMemberInfo` 获取的成员信息中的角色全都是 `MEMBER` 的问题。
- 修复了没有「成员」概念的 `ChatRoom` 与 `ServiceConversation` 拥有成员管理相关的 API 的问题。
- 修复了使用 TypeScript 时 `EventEmitter` 类无法接受 Event 枚举的问题。

<a name="4.0.1"></a>

## [4.0.1](https://github.com/leancloud/js-realtime-sdk/compare/v4.0.0...v4.0.1) (2018-05-31)

### Bug Fixes

- 修复了在 React Native 中 `Realtime#createIMClient` 返回 `undefined` 的问题。
- 修复了私有部署应用会错误地请求公有集群的问题。

<a name="4.0.0"></a>

# 4.0.0 (2018-05-28)

在这个版本的更新中我们主要做了以下几方面的事情：

- **增加新功能：** 增加了提及（@）对话成员、对话成员角色（管理员）、对话黑名单与禁言、二进制消息、临时对话以及更灵活的消息查询条件等功能。
- **更清晰的异常：** 我们重新审视了 SDK 的异常机制，确保了异步的 API 只会异步地抛出异常（通过返回一个 rejected Promise），我们为用户可能会需要在运行时处理的服务端异常增加了 `name` 属性用来进行异常的匹配，并为部分异常更新了更详细的 `error.message`。
- **改进开发体验：** 我们增加了 `Event` 枚举来代替越来越长的事件名称字符串。我们还按照类型拆分了对话类，聊天室与服务号现在会显示为对应的类，并且有各自特有的 API。
- **为微信小程序优化：** 我们重新设计了对话与消息的序列化方法，现在可以在小程序中直接将其 `setData` 了。我们还持续跟进了小程序 API 的更新，优化了 SDK 连接层的性能与稳定性。此外，SDK 现已支持微信小游戏。

v4.0.0 是一个主版本更新，包含了一些不向前兼容的改动，具体的改动细节请参考 [BREAKING CHANGES](#v4-breaking-changes) 部分的说明，你也可以参考 [《v4.0 升级检查清单》](https://github.com/leancloud/js-realtime-sdk/wiki/v4.0-upgrade-checklist)进行升级。

v4.0.0 相比 v4.0.0-rc.0 没有改动。测试版本的更新日志参见[《v4.0 pre releases changelog》](https://github.com/leancloud/js-realtime-sdk/wiki/v4.0-pre-releases-changelog)。

<a name="v4-breaking-changes"></a>

### BREAKING CHANGES

- 重新设计了对话与消息的序列化方法。现在在小程序中能够直接将 Conversation 与 Message 实例作为 data 设置给视图层使用了。
  - `AVMessage` 接口原有的用来获取消息内容的 `toJSON` 方法现在改名为 `getPayload`。内置的 `Message` 类及其子类均已更新，如果使用富文本消息插件（leancloud-realtime-plugin-typed-messages），需要更新插件至 v3.0.0 或以上版本。
  - `Message` 类及其子类重新实现了 `toJSON` 方法用于获取该消息的有效信息。
  - `Conversation` 类增加了 `toJSON` 方法用于获取该对话的有效信息。
- 初始化 `Realtime` 现在需要 `appKey` 参数。

    <details>
  <summary>示例</summary>

  ```diff
   const realtime = new Realtime({
     appId: 'YOUR_APP_ID',
  +  appKey: 'YOUR_APP_KEY',
   });
  ```

    </details>

- 现在所有异步 API 的异常都是以异步的方式抛出。我们还更新了 API 文档，标出了 API 的异步属性。

    <details>
  <summary>示例</summary>

  ```javascript
  // before
  try {
    conversation.send(message);
  } catch (error) {
    // handle `Connection unavailable` error
  }

  // after
  conversation.add(members).catch(error => {
    // handle `Connection unavailable` error
  });
  ```

    </details>

- 部分异常的 `error.message` 被更新为更详细的解释。

  这是一个不兼容的改动，考虑到开发者可能会对 `error.message` 进行字符串匹配。我们建议使用 `error.code` 或 `error.name` 进行异常匹配与处理。

  **请注意：** 今后对 `error.message` 的改动将不被认为是不兼容的改动。

- 为了更好的隔离服务，我们为每个应用提供了独立的域名。对于小程序用户，请前往 [《小程序域名白名单配置》](https://leancloud.cn/docs/weapp-domains.html) 更新域名白名单。
- 移除了 v3 中被标记为废弃的 API，包括：
  - `IMClient`
    - `#markAllAsRead` 方法
    - `createConversation` 的 `options.attributes` 参数
    - `'unreadmessages'` 事件
  - `Conversation`
    - `attributes` 属性
    - `#setAttributes`、`#setAttribute`、`#setName` 与 `#markAsRead` 方法
    - `'receipt'` 事件
  - `ConversationQuery`
    - `#withLastMessages` 方法
  - `Message`
    - `needReceipt` 与 `transient` 属性
    - `#setNeedReceipt` 与 `#setTransient` 方法
- 作为批量操作对话成员支持部分成功的副作用，`Conversation` 与 `ChatRoom` 的 `#add` 与 `#remove` 方法现在不再返回当前的 Conversation 实例，而是返回一个包含部分成功与失败信息的 `PartiallySuccess` 对象。
- 不再支持下列运行环境（SDK 应该仍能在这些环境下工作，但我们不再对其进行测试了）：
  - Chrome < 45
  - iOS < 9.3
- 移除了对包管理工具 Bower 的支持，请使用 npm 或 Yarn 代替。

### Features

- 支持与 LeanCloud 用户系统集成。`Realtime#createIMClient` 方法现在支持使用一个已登录的 `AV.User` 登录 IM，详见 [相关文档](https://url.leanapp.cn/im-login-with-avuser)。
- 新增枚举 `Event`。SDK 派发的事件的名称是全小写风格的字符串。当事件的名称由多个单词组成时，全小写风格的命名会很难辩识（例如 `unreadmessagescountupdate`）。SDK 现在提供了事件常量枚举 `Event`，你可以使用 `Event.UNREAD_MESSAGES_COUNT_UPDATE` 来代替 `unreadmessagescountupdate` 了。
- 消息支持提及（@）对话中的成员。
  - 增加了 `Message#setMentionList` 与 `Message#mentionAll` 方法用于指定消息提及的对话成员。
  - 在收到消息时可以通过 `Message#mentioned` 属性判断当前用户是否被提及，通过 `Message#mentionList` 与 `Message#mentionedAll` 属性获取详细的信息。
  - 增加了 `Conversation#unreadMessagesMentioned` 属性指示当前用户是否在对话中被提及。该属性会在 `UNREAD_MESSAGES_COUNT_UPDATE` 事件发生时被更新，调用 `Conversation#read` 方法会重置该属性。
- 新增对话成员角色功能，对话成员支持区分「管理员」与「成员」等不同角色。为了支持该功能，我们增加了 `ConversationMemberInfo` 类用来存储对话成员的属性。相关的 API 有：
  - `Conversation` 与 `ChatRoom` 增加了 `#getAllMemberInfo` 与 `#getMemberInfo` 方法用于查询用户的角色信息。
  - `Conversation` 与 `ChatRoom` 增加了 `#updateMemberRole` 方法用于设置用户的角色。
  - 增加了 `ConversationMemberRole` 枚举，包含了内置的 `MANAGER` 与 `MEMBER` 两种角色。
- 新增对话黑名单与禁言功能：
  - `Conversation`、`ChatRoom` 与 `ServiceConversation` 增加了 `#blockMembers`、`#unblockMembers` 与 `#queryBlockedMembers` 方法。
  - `Conversation`、`ChatRoom` 与 `ServiceConversation` 增加了 `#muteMembers`、`#unmuteMembers` 与 `#queryMutedMembers` 方法。
  - `Realtime#createIMClient` 方法增加了指定黑名单的签名方法的参数 `clientOptions.blacklistSignatureFactory` 。
- 所有支持批量操作对话成员的方法（包括已经存在 add/remove，新增的 block/unblockMembers、mute/unmuteMembers），均支持部分成功。可以在成功的结果中得到对哪些成员的操作成功了，对哪些成员的操作失败了以及对应的失败原因。
- 支持发送接收二进制消息。
  - 增加了 `BinaryMessage`，可以通过 `ArrayBuffer` 构造。
- 查询历史消息接口（`Conversation#queryMessage`）现在支持按照从旧到新的方向查询，可以实现弹幕等需求。
  - 增加了 `direction` 选项，其值为 `MessageQueryDirection.NEW_TO_OLD` 或 `MessageQueryDirection.OLD_TO_NEW`。
  - 增加了方向的概念后，原先指定查询区间的参数会产生歧义，这些参数因此被重新命名了：
    - `beforeTime` -> `startTime`
    - `beforeMessageId` -> `startMessageId`
    - `afterTime` -> `endTime`
    - `afterMessageId` -> `endMessageId`
  - 增加了 `startClosed` 与 `endMessageId` 选项用于指定查询区间的开闭。
- 支持按照富媒体消息类型查询历史消息。`Conversation#queryMessages` 方法增加了 `type` 参数用于指定查询的消息的类型

    <details>
  <summary>示例</summary>

  ```js
  // 限定查询图片消息
  conversation
    .queryMessage({
      type: ImageMessage.TYPE,
    })
    .then(console.log)
    .catch(console.error);
  ```

    </details>

- 支持临时对话（TemporaryConversation)。临时对话是一种有有效期的对话，更多关于临时对话的的说明请参考[《实时通信服务总览 - 临时对话》](https://url.leanapp.cn/temporary-conversation)。
- 拆分了对话的概念。
  - SDK 现在暴露了四种不同的对话类：
    - 普通对话（`Conversation`）
    - 聊天室（`ChatRoom`）
    - 服务号（`ServiceConversation`）
    - 临时对话（`TemporaryConversation`）
  - 增加了相应的 API：
    - `IMClient` 提供了三种创建对话的方法（服务号不支持在客户端创建）：
      - `IMClient#createConversation`
      - `IMClient#createChatRoom`
      - `IMClient#createTemporaryConversation`
    - `IMClient` 提供了三种查询对话的方法（临时对话没有查询的概念）：
      - `IMClient#getQuery`
      - `IMClient#getChatRoomQuery`
      - `IMClient#getServiceConversationQuery`
    - 服务号特有的订阅相关方法：
      - `ServiceConversation#subscribe`
      - `ServiceConversation#unsubscribe`
- 支持对话属性更新通知：
  - `Conversation`、`ChatRoom` 与 `ServiceConversation` 的属性现在会自动更新，并增加了 `INFO_UPDATED` 事件。
  - 相应的，`IMClient` 增加了 `CONVERSATION_INFO_UPDATED` 事件。
- 引入了更加可靠的通知机制。在断线期间发生的 `INVITED` 与 `KICKED` 事件，现在会在断线重连成功后收到。
- `Realtime#createIMClient` 方法的第二个参数 `options` 增加了用于单点登录的 `tag` 与 `isReconnect` 选项。原第三个参数 `tag` 已被废弃。
- 支持微信小游戏。
- 支持私有部署。

### Bug Fixes

- 解决了与序列化 Conversation 抛循环引用异常相关的问题，包括小程序中无法 `console.log` Conversation 的问题。
- 修复了被服务端踢下线后链接没有正确断开的问题。
- 修复了创建 unique 对话时，尽管内存中已经存在了该对话，仍然会得到一个新实例的问题。
- 修复了查询得到的对话中自定义的 Date 类型的属性没有被正确解析为 Date 的问题。
- 修复了当连接不可用时，调用 `IMClient#close` 方法会抛异常的问题。
- 修复了多个导致切换用户时连接状态异常的问题。

### Performance Improvements

- 断线重连时优先尝试未连接过的服务器从而改善某些情况下的重连速度。
- 改善了小程序中的性能
  - 使用二进制帧通讯，减少流量消耗。
  - 自动感知网络状态变化从而获得更及时的重连。
