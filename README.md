# LeanCloud 实时通信 JavaScript SDK [![Build Status](https://img.shields.io/travis/leancloud/js-realtime-sdk.svg)](https://travis-ci.org/leancloud/js-realtime-sdk) [![npm](https://img.shields.io/npm/v/leancloud-realtime.svg)](https://www.npmjs.com/package/leancloud-realtime) [![Bower](https://img.shields.io/bower/v/leancloud-realtime.svg)]() [![David](https://img.shields.io/david/leancloud/js-realtime-sdk.svg)](https://david-dm.org/leancloud/js-realtime-sdk)

## 详细使用方法请看 [官方文档](https://leancloud.cn/docs/js_realtime.html)

## 官方新版本发布流程

* 修改代码中版本号及修改日期
* 修改 package.json 与 bower.json 中的版本号
* 修改 changelog.md
* `grunt test`
* `grunt release`
* 提交代码合并到 master
* Github 生成 release 包
* 发布到 npm 与 bower

```
bower register leancloud-realtime git@github.com:leancloud/js-realtime-sdk.git
```
