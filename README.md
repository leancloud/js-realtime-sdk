# LeanCloud 实时通信 JavaScript SDK
[![Build Status](https://img.shields.io/travis/leancloud/js-realtime-sdk.svg)](https://travis-ci.org/leancloud/js-realtime-sdk) [![npm](https://img.shields.io/npm/v/leancloud-realtime.svg)](https://www.npmjs.com/package/leancloud-realtime) [![Bower](https://img.shields.io/bower/v/leancloud-realtime.svg)]() [![David](https://img.shields.io/david/leancloud/js-realtime-sdk.svg)](https://david-dm.org/leancloud/js-realtime-sdk)

## 使用方法请看 [官方文档](https://leancloud.cn/docs/js_realtime.html)

## 贡献
如果你希望为这个项目贡献代码，请按以下步骤进行：
* fork 这个项目
* 在目录中执行 `npm install` 安装所需 node 依赖包
* 在目录中执行 `bower install` 安装所需 Web 依赖库
* 执行 `grunt dev` 浏览器打开 http://localhost:8000 本地进行调试
* 修改 `src` 目录中的源码，系统会自动生成调试代码
* 确保 `grunt test` 的测试全部 pass
* 提交改动并发起 PR，请不要提交 dist 与 lib 下的变动

项目的目录结构说明如下：
```
.
├── demo            // demo
├── dist            // 浏览器环境使用的编译产出(browserify)
├── lib             // node 环境使用的编译产出(babel)
├── plugin          // 浏览器 Websocket 降级插件
├── src             // 源码
│   ├── tool            // 工具方法
│   ├── AV.realtime.js  // 暴露全局变量的主文件版本
│   └── realtime.js     // 主文件
└── test            // 测试
    └── browser         // 浏览器版本
```

## 支持
* 如果你发现了新的 bug，或者有新的 feature request，请新建一个 issue
* 在使用过程中遇到了问题时
  * 如果你购买了技术支持服务，请新建一个 ticket。
  * 也可以在[论坛](https://forum.leancloud.cn/)提问、讨论。

## 官方新版本发布流程

* 修改代码中版本号及修改日期
* 修改 package.json 与 bower.json 中的版本号
* 修改 changelog.md
* `grunt test`
* `grunt release` and commit all changed files
* push to master
* GitHub 生成 release 包（for bower）
* 发布到 npm（`npm publish`，需 npm 协作者身份）
* `grunt upload` 发布到 CDN
