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
