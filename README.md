_**by wangxiao 2015/02/04**_
# LeanCloud 实时通信 JavaScript SDK

## 简介

感谢您使用 JavaScript 的 Realtime SDK，LeanCloud 的 Realtime 服务每天处理请求数超过百万级，安全可靠，您的明智之选。您可以通过使用我们提供的 SDK，甚至一行后端代码都不用写，就可以做一个功能完备的实时聊天应用。当然，您也可以通过 Realtime SDK 并且配合「云代码」简单的实现之前可能需要很多人才能完成的实时通信相关需求开发，并且如果您达到我们的收费额度，也会以极低的成本支付您的使用费用，绝对物超所值。

## 概念

在您开始使用之前，首先来了解一下实时通信 SDK 的基本概念。实时通信在 SDK 层面只有两个层次：

* 一层是底层实时通信基础模块，负责与服务器匹配和授权，建立基础的连接和底层控制。这个层次只会派发一些基础的事件出来，您可以通过 SDK 的监听这些事件。这个层面 SDK 会保证底层连接的稳定，包括断开重试，心跳连接等策略；

* 另一层是业务逻辑层，用户可以使用 SDK 建立不同的 Room （房间）。一个 Room 就是一个独立的通信单元，但 Room 间一般是无法通信的。当然您可以自己在业务逻辑层，通过派发自定义事件的方式来封装其他自定义的逻辑。当您建立一个新 Room 之后，对应的服务器端就会自动生成这个房间，除非您自行删除，否则该房间一直存在。但是用户如果没有连接，该房间不会占用服务器资源，只是存储的一个条目数据；


## 全局命名空间

### lc

LeanCloud 的缩写「lc」，新版 JavaScript SDK 都会基于此命名空间，当然你可以使用 requirejs 等 AMD 模块化工具重新定义命名空间。

### 方法

#### lc.realtime(options, callback)

描述：

创建实时通信对象的方法，会启动实时通信的连接。自动调用 open 方法，内部与服务器匹配，并建立 WebSocket 连接。内部会自动维持与服务器的链接稳定，控制心跳数据包的频率等，如果发生中断可以通过对应的事件来给用户界面上的变化提示。另外，此方法支持多实例，也就是说，你可以在一个页面中，创建多个 RealtimeObject 来实现聊天。

参数：

* options {Object} （必须） 配置实时通信服务所需的必要参数。其中包括：

    * appId {String} （必须）应用的 AppId，在「控制台」-「设置」-「基本信息」中可以查看；

    * clientId {String} （必须）当前客户端的唯一 id，用来标示当前客户端；

    * auth {String}（可选）可以传入一个服务器 url 地址，每次当建立连接的时候就会去服务器请求认证，或者许可之后才能建立连接；

返回：

{Object} 返回 RealtimeObject，其中有后续调用的方法，支持链式调用。

例子：


```
var rtObject = lc.realtime({
   // appId 需要换成你自己的 appId
   appId: '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm',
   // clientId 是自定义的名字，当前客户端可以理解的名字
   clientId: 'abc123'
   // auth 是权限校验的服务器地址，具体请看文档
   // auth: 'http://signature-example.avosapps.com/sign'
}, function() {
   console.log('open');
});

rtObject.on('open', function() {
   console.log('open');
});

```

#### lc.realtime.version

描述：

获取当前 SDK 的版本信息

返回：

{String} 返回当前版本

例子：

```
console.log(lc.realtime.version);   // 2.0.0
```

#### RealtimeObject.open(callback)

描述：

该方法一般情况下，您不需要调用，SDK 会自动启动与服务的连接。该方法可以启动实时通信的连接，与服务器匹配建立 websocket 连接；

参数：

* callback {Function}（可选）创建成功并且与服务器建立连接后触发的回调，此时也会派发一个私有的事件到 RealtimeObject 内部，也可以通过监听当前的 RealtimeObject 实例的 open 事件来处理连接成功的业务逻辑；

返回：

{Object} 返回 RealtimeObject，其中有后续调用的方法，支持链式调用。

例子：

```
var rtObject = lc.realtime({
   // appId 需要换成你自己的 appId
   appId: '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm',
   // clientId 是自定义的名字，当前客户端可以理解的名字
   clientId: 'abc123'
   // auth 是权限校验的服务器地址，具体请看文档
   // auth: 'http://signature-example.avosapps.com/sign'
});

rtObject.open(function() {
   console.log('open');
});

rtObject.on('open', function() {
   console.log('open,too.');
});
```

#### RealtimeObject.close()

描述：

关闭实时通信的连接，并且内部会关闭 websocket 连接。该方法没有回调，因为调用会立刻关闭 WebSocket。

返回：

{Object} 返回 RealtimeObject，其中有后续调用的方法，支持链式调用。

例子：

```
var rtObject = lc.realtime({
   // appId 需要换成你自己的 appId
   appId: '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm',
   // clientId 是自定义的名字，当前客户端可以理解的名字
   clientId: 'abc123'
   // auth 是权限校验的服务器地址，具体请看文档
   // auth: 'http://signature-example.avosapps.com/sign'
});

rtObject.close();

rtObject.on('close', function() {
   console.log('close');
});
```

#### RealtimeObject.on(eventName, callback)

描述：

监听 RealtimeObject 内部的事件，基于一个局部的事件中心，事件每次派发就会被触发一次；

参数：

* eventName {String} （必须）监听的事件名称

* callback {Function} （必须）当事件被派发时会调用的回调

返回：

{Object} 返回 RealtimeObject，其中有后续调用的方法，支持链式调用。

```
var rtObject = lc.realtime({
   // appId 需要换成你自己的 appId
   appId: '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm',
   // clientId 是自定义的名字，当前客户端可以理解的名字
   clientId: 'abc123'
   // auth 是权限校验的服务器地址，具体请看文档
   // auth: 'http://signature-example.avosapps.com/sign'
});

// 当新建一个 Room 的时候就会触发
rtObject.on('new', function(data) {
   console.log(data);
});

// 有人加入 Room 的时候会被触发
rtObject.on('join', function(data) {
   console.log(data);
});
```

#### RealtimeObject.once(eventName, callback)

描述：

监听 RealtimeObject 内部的事件，基于一个局部的事件中心，事件只会被触发一次；

参数：

* eventName {String} （必须）监听的事件名称

* callback {Function} （必须）当事件被派发时会调用的回调

返回：

{Object} 返回 RealtimeObject，其中有后续调用的方法，支持链式调用。

```
var rtObject = lc.realtime({
   // appId 需要换成你自己的 appId
   appId: '9p6hyhh60av3ukkni3i9z53q1l8yy3cijj6sie3cewft18vm',
   // clientId 是自定义的名字，当前客户端可以理解的名字
   clientId: 'abc123'
   // auth 是权限校验的服务器地址，具体请看文档
   // auth: 'http://signature-example.avosapps.com/sign'
});

// 当服务建立之后会被触发
rtObject.once('open', function() {
   console.log('opened');
});

// 当服务关闭的时候会被触发
rtObject.once('close', function() {
   console.log('closed');
});
```

#### RealtimeObject.emit(eventName, dataObject)

描述：

派发一个事件到 RealtimeObject 中，局部的事件中心

参数：

* eventName {String} （必须）派发的事件名称

* dataObject {Obejct}（可选）传递的参数，可以在监听的回调中通过第一个参数获取

返回：

{Object} 返回 RealtimeObject，其中有后续调用的方法，支持链式调用。


#### RealtimeObject.room(options, callback)

描述：

创建一个 Room（房间），实时通信的最小单元；

参数：

* options {Object} （必须）传入配置信息

    * data {Object} （可选）自定义的数据信息，如 title、name 等
    
    * callback {Function} （可选）创建成功后的回调函数，此时也会在 RealtimeObject 内部派发一个 new 事件，可以通过 RealtimeObject.on() 方法来监听；

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


#### RealtimeObject.room(roomId, callback)

描述：

匹配一个在服务器端已有的 room，并生成对应的 RoomObject，此时不派发任何事件；

参数：

* roomId {String} （必须）传入已有 Room 的 id

* callback {Function} （可选）创建成功后的回调函数，此时不会派发任何事件；

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


#### RoomObject.add(clientId, callback)

描述：

向当前 RoomObject 中添加一个用户

参数：

* clientId {String} （必须）传入已有用户的 clientId

* callback {Function} （可选）创建成功后的回调函数，此时会在 RealtimeObject 内部派发一个 join 事件；

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


#### RoomObject.add(clientIdList, callback)

描述：

向当前 RoomObject 中添加多个用户

参数：

* clientIdList {Array} （必须）传入已有用户的 clientId 的 list，每个元素是 client

* callback {Function} （可选）创建成功后的回调函数，此时会在 RealtimeObject 内部派发一个 join 事件；

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


#### RoomObject.remove(clientId, callback)

描述：从当前 RoomObject 中删除一个用户

参数：

* clientId {String} （必须）传入已有用户的 clientId

* callback {Function} （可选）删除成功后的回调函数，此时会在 RealtimeObject 内部派发一个 left 事件；

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


#### RoomObject.remove(clientIdList, callback)

描述：

从当前 RoomObject 中删除多个用户

参数：

* clientIdList {Array} （必须）传入已有用户的 clientId 的 list，每个元素是 client

* callback {Function} （可选）创建成功后的回调函数，此时会在 RealtimeObject 内部派发一个 left 事件；

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


#### RoomObject.join(callback)

描述：

加入当前这个 Room

参数：

* callback {Function} （可选）加入成功后的回调函数，此时会在 RealtimeObject 内部派发一个 join 事件；

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


#### RoomObject.leave(callback)

描述：

从当前 RoomObject 中离开

参数：

* clientIdList {Array} （必须）传入已有用户的 clientId 的 list，每个元素是 client

* callback {Function} （可选）创建成功后的回调函数，此时会在 RealtimeObject 内部派发一个 left 事件；

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


#### RoomObject.send(dataObject, callback)

描述：

向当前这个 RoomObject 中发送消息

参数：

* dataObject {Object} （必须）发送的数据内容

* callback {Function} （可选）发送到服务器成功后的回调函数，不一定对方已经接收了，但是服务器已经收到。

返回：

{Object} 返回 RoomObject，其中有后续调用的方法，支持链式调用。


### 事件

SDK 会默认派发一些事件，这些事件仅会在 RealtimeObject 内部被派发（注意：RoomObject 内部默认不会派发任何事件），您可以通过监听这些事件来完成您的操作。以下是默认事件的说明：

#### open

描述：

与服务器建立好连接之后就会被派发，包括当服务断开重新被连接上时也会被触发

#### close

描述：

与服务器连接断开就会被派发，包括网络中断

#### create

描述：

新建一个 Room 成功之后会被触发

#### join

描述：

当一个 Room 新增了一个成员之后会被触发

#### left

描述：

当一个 Room 中有成员离开之后会被触发

#### message

描述：

当收到消息时会被触发，收到的消息是当前客户端（clientId）存在的 Room 中的信息，所有这些数据都可以在服务器端看到。
