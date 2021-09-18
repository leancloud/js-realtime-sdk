<a name="4.0.0"></a>

# 4.0.0 (2021-09-18)

### BREAKING CHANGES

- 使用前需要先进行初始化：

  ```js
  const AV = require('leancloud-storage');
  const IM = require('leancloud-realtime');
  const initPlugin = require('leancloud-realtime-plugin-typed-messages');

  const { TypedMessagesPlugin, FileMessage } = initPlugin(AV, IM);
  ```

<a name="3.1.0"></a>

# 3.1.0 (2020-01-25)

### Features

- 适配 leancloud-realtime@5 与 leancloud-storage@4

<a name="3.0.1"></a>

## 3.0.1 (2018-05-11)

### Bug Fixes

- 修复 IE10 兼容问题。

<a name="3.0.0"></a>

# 3.0.0 (2017-11-02)

### Features

- 适配 leancloud-realtime@4，不再支持 leancloud-realtime@3。

<a name="2.0.0"></a>

# 2.0.0 (2017-06-15)

### Features

- peerDependencies 中 leancloud-storage 不再支持 leancloud-storage@1，请升级到 v2 或 v3。
