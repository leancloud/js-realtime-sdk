LeanCloud JavaScript Realtime SDK
====
[![Build Status](https://img.shields.io/travis/leancloud/js-realtime-sdk/next.svg?style=flat-square)](https://travis-ci.org/leancloud/js-realtime-sdk/branches)
[![Codecov](https://img.shields.io/codecov/c/github/leancloud/js-realtime-sdk/next.svg?style=flat-square)](https://codecov.io/github/leancloud/js-realtime-sdk?branch=next)
[![David](https://img.shields.io/david/leancloud/js-realtime-sdk.svg?style=flat-square)](https://david-dm.org/leancloud/js-realtime-sdk)
[![npm](https://img.shields.io/npm/v/leancloud-realtime.svg?style=flat-square)](https://www.npmjs.com/package/leancloud-realtime)

为您的 JavaScript App 接入 LeanCloud 实时通讯服务。

版本说明
----
next 分支上为 3.x 版本。
master 分支上为 2.x 版本，将仅得到安全更新，相关文档参见 [2.x 文档](https://leancloud.cn/docs/js_realtime.html)。

3.x 与 2.x 的 API 不兼容，以下说明与文档均指 3.x 版本。

试用 3.x alpha 版本：
```
npm install leancloud-realtime@next
```

支持的运行环境
----
- 浏览器 / WebView
  - IE 10+
  - Chrome 31+
  - Firefox latest
  - iOS 8.0+
  - Android 4.4+
- Node.js 0.12+
- React Native (tested with 0.22)

其中在 React Native 中运行需要在初始化 [Realtime](https://leeyeh.github.io/js-realtime-sdk/docs/Realtime.html#Realtime) 时设置 `options.noBinary` 为 `true`。

文档
----
- [安装文档]
- [使用文档]
- [API 文档]

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
0. 发起 Pull Request 至 **next 分支**

项目的目录结构说明如下：
```
.
├── demo
├── deploy.sh               // 部署 gh-pages 分支
├── dist                    // 打包产出
│   ├── bundle.browser.js     // 浏览器用
│   ├── bundle.browser.min.js // 浏览器用(uglified)
│   ├── bundle.js             // node 用
├── proto
│   ├── message-compiled.js     // 使用 pbjs 生成的 message 类
│   ├── message.js              // ES6 wrapper
│   └── message.proto           // proto 原始文件
├── release.sh                // 部署 dist 分支
├── src                       // 源码
│   └── index.js                // 打包入口
└── test                      // 测试用例
    ├── browser                 // 浏览器测试入口
    └── index.js                // 测试入口

```

开启调试模式
----
### Node.js
```bash
export DEBUG=LC*
```
### 浏览器
```javascript
localStorage.setItem('debug', 'LC*');
```

Develop Workflow
----
### 本地开发
```
grunt dev
```
如果需要更新 .proto
```
npm run convert-pb
```
### 测试
```
npm test
```
生成 dist/bundle.*
```
npm build
```
### 持续集成
合并 PR 到 next 分支后持续集成会自动运行 `npm build` 与 `npm run doc`，然后将 dist 目录推送到 dist 分支，将文档与 demo 推送到 gh-pages。

Release Process Workflow
----
0. 遵循 semver 提升 `package.json` 与 `bower.json` 中的版本号
0. `npm run changelog` 生成新的 `changelog.md`，润色之
0. Commit `package.json`，`bower.json`，`changelog.md`
0. Push to remote `next` branch
0. 等待持续集成 pass
0. 使用 GitHub 基于 dist 分支生成 pre-release 包（for bower）
0. Fetch and checkout remote `dist` branch 并确认该提交的内容是即将发布的版本
0. npm publish with `next` tag（`npm publish --tag=next`，需 npm 协作者身份）
0. `grunt upload` 上传到 CDN
