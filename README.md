LeanCloud JavaScript Realtime SDK
====
[![Build Status](https://img.shields.io/travis/leancloud/js-realtime-sdk.svg?style=flat-square)](https://travis-ci.org/leancloud/js-realtime-sdk)
[![Codecov](https://img.shields.io/codecov/c/github/leancloud/js-realtime-sdk.svg?style=flat-square)](https://codecov.io/github/leancloud/js-realtime-sdk)
[![David](https://img.shields.io/david/leancloud/js-realtime-sdk.svg?style=flat-square)](https://david-dm.org/leancloud/js-realtime-sdk)
[![npm](https://img.shields.io/npm/v/leancloud-realtime.svg?style=flat-square)](https://www.npmjs.com/package/leancloud-realtime)

为您的 JavaScript App 接入 LeanCloud 实时通讯服务。

版本说明
----
master 分支为开发版本。
v2 分支上为 2.x 版本，将仅得到安全更新，相关文档参见 [2.x 文档](https://leancloud.cn/docs/js_realtime.html)。

自 v3 起遵循 [语义化版本](http://semver.org/lang/zh-CN/)。

安装稳定版本：
```
npm install leancloud-realtime
```

安装 v2 版本：
```
npm install leancloud-realtime@2
```

支持的运行环境
----
- 浏览器 / WebView
  - IE 10+ / Edge
  - Chrome 31+
  - Firefox latest
  - iOS 8.0+
  - Android 4.4+
- Node.js 0.12+
- React Native
  - iOS 0.22+
  - Android 0.25+

其中在 React Native 中运行需要在初始化 [Realtime](https://leancloud.github.io/js-realtime-sdk/docs/Realtime.html#Realtime) 时设置 `options.noBinary` 为 `true`。

文档
----
- [安装文档](https://leancloud.cn/docs/realtime_guide-js.html#安装和初始化)
- [使用文档](https://leancloud.cn/docs/realtime_guide-js.html)
- API 文档
  - [leancloud-realtime](https://leancloud.github.io/js-realtime-sdk/docs/)
  - [leancloud-realtime-plugin-typed-messages](https://leancloud.github.io/js-realtime-sdk/plugins/typed-messages/docs/)
  - [leancloud-realtime-plugin-webrtc](https://leancloud.github.io/js-realtime-sdk/plugins/webrtc/docs/)

Demo
----
- [Simple Chatroom](https://leancloud.github.io/js-realtime-sdk/demo/simple-chatroom/) ([src](https://github.com/leancloud/js-realtime-sdk/tree/master/demo/simple-chatroom))
- [WebRTC 视频通话](https://leancloud.github.io/js-realtime-sdk/demo/webrtc/) ([src](https://github.com/leancloud/js-realtime-sdk/tree/master/demo/webrtc))

支持
----
* 如果你发现了新的 bug，或者有新的 feature request，请新建一个 issue
* 在使用过程中遇到了问题时
  * 如果你购买了技术支持服务，请新建一个 ticket。
  * 也可以在 [论坛](https://forum.leancloud.cn/) 提问、讨论。

贡献
----
如果你希望为这个项目贡献代码，请按以下步骤进行：

0. Fork 这个项目，clone 到本地
0. 在目录中执行 `npm install` 安装所需 Node.js 依赖包
0. 在目录中执行 `bower install` 安装所需 web 依赖包
0. 执行 `grunt dev` 浏览器打开 [](http://localhost:8000) 本地进行调试
0. 编码，更新测试用例
0. 运行 `npm test` 确保测试全部 pass
0. 提交改动，请遵循 [conversational commit message 风格](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
0. 发起 Pull Request 至 master 分支

### 项目的目录结构
```
.
├── demo
├── deploy.sh                 // 部署 gh-pages 分支
├── release.sh                // 部署 dist 分支
├── dist                      // 打包产出
│   ├── realtime.browser.js     // 浏览器用
│   ├── realtime.browser.min.js // 浏览器用(uglified)
│   └── realtime.js             // node 用
├── proto
│   ├── message-compiled.js     // 使用 pbjs 生成的 message 类
│   ├── message.js              // ES6 wrapper
│   └── message.proto           // proto 原始文件
├── src                       // 源码
│   └── index.js                // 打包入口
├── test                      // 测试用例
│   ├── browser                 // 浏览器测试入口
│   └── index.js                // 测试入口
└── plugins
    ├── typed-messages          // leancloud-realtime-plugin-typed-messages package
    └── webrtc                  // leancloud-realtime-plugin-webrtc package
```

### Architecture
SDK 分为连接层与应用层两部分，只存在应用层对连接层公开 API 的调用，连接层对开发者不可见。

#### 连接层
* `WebSocketPlus`：封装了 WebSocket。相比 w3 WebSocket，增加了以下特性：
  * 是一个有限状态机
  * 实现了 [Node.js EventEmitter 接口](https://nodejs.org/api/events.html)
  * 超时与自动重连机制
  * url 参数支持 Promise 及备用地址
* `Connection`：继承自 `WebSocketPlus`，增加了与业务相关的功能：
  * 根据 subprotocol 自动处理发送与接收的消息，应用层发送接收的均是 ProtoBuf Message 类
  * `send` 接口返回 Promise，在 server 回复后才算 send 成功
  * 实现了应用层 ping/pong

#### 应用层
* `Realtime`：开发者使用 SDK 的入口，负责访问 router、创建 connection、创建与管理 clients、创建 messageParser（管理消息类型）、监听 connection 的消息并 dispatch 给对应的 client
* `Client`：所有的 clients 共享一个 connection
  * `IMClient`：对应即时通讯中的「用户」，持有 connection 与 conversations，负责创建管理将收到的消息处理后在对应 conversation 上派发，所有的 IMClients 共享一个 messageParser
* `MessageParser` 消息解析器，负责将一个 JSON 格式的消息 parse 为对应的 Message 类
* `Conversation`：实现对话相关的操作
  * `ConversationQuery`：对话查询器
* `Messages`
  * `AVMessage`：接口描述，生成文档用
  * `Message`：消息基类
  * `TypedMessage`：类型消息基类，继承自 `Message`
  * `TextMessage`：文本消息，继承自 `TypedMessage`
  * 其他富媒体消息类（`FileMessage` 及其子类、`LocationMessage`）由于依赖 leancloud-storage，作为另一个独立 package 发布

### 开启调试模式

#### Node.js
```bash
export DEBUG=LC*
```
#### 浏览器
```javascript
localStorage.setItem('debug', 'LC*');
```

Develop Workflow
----
### 本地开发
更新 .proto 后请运行
```
npm run convert-pb
```
测试
```
npm run test:node -- --grep KEYWORDS
```
浏览器测试
```
# 在当前目录启动一个静态 server
# static . -p 8000
npm run test:browser
# open http://localhost:8000/test/browser/
```
生成 dist/realtime.*
```
npm run build
```
### 持续集成
合并 PR 到 master 分支后持续集成会自动运行 `npm build` 与 `npm run doc`，然后将 dist 目录推送到 dist 分支，将文档与 demo 推送到 gh-pages。

Release Process Workflow
----
0. 遵循 semver 提升 `package.json` 与 `bower.json` 中的版本号
0. `npm run changelog` 生成新的 `changelog.md`，润色之
0. Commit `package.json`，`bower.json`，`changelog.md`
0. Push to remote `master` branch
0. 等待持续集成 pass
0. 使用 GitHub 基于 dist 分支生成 pre-release 包（for bower）
0. Fetch and checkout remote `dist` branch 并确认该提交的内容是即将发布的版本
0. npm publish（`npm publish`，需 npm 协作者身份），如果是 pre-release 版本需要带 next tag
0. 如有更新，在 npm 上发布各个 plugin
