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
