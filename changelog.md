# 2.0.4
* 修正关闭 encodeHTML 时多媒体格式没有对 text 赋值

# 2.0.3
* 提供兼容 IE8+ 低版本浏览器的插件方式
* 修改获取已有 conversation id 没有判断在服务器端是否存在
* 提供获取 conversation 初始化属性的方式
* 开放 secure 选项，用户可以手动关闭 SSL 协议

# 2.0.2
* 修复与 iOS 及 Android 端 SDK 通信的 bug
* 创建 conversation 成功后，回调中可以直接取到 convObject
* 修正 convObject.update 方法的 bug
* 补充对接受的消息做 HTML 转义处理，SDK 层面支持 XSS 防御

# 2.0.1
* 修正事件中心中的 bug
* 增加 realtimeObject.ping 判断用户在线状态
* 修正调用 close() 方法的 bug
* ajax 返回 2xx 都应该认为正确
* 心跳链接中的 bug，close 之后无法停止
* 修正已有的 conversation 获取实例失败的 bug
