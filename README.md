#LeanCloud 实时通信 JavaScript SDK 2.0


##概念

在您开始使用之前，首先需要了解实时通信 SDK 的基本概念。实时通信在 SDK 层面只有两个层次：
一层是基本的实时通信模块，负责与服务器匹配和授权，建立基础的连接和底层控制；
另一层是业务逻辑层，用户可以自行来使用建立不同的 Room （房间）。一个 Room 就是一个独立的通信单元，Room 间是无法通信的。当然您可以自己在业务逻辑层，通过派发自定义事件的方式来封装其他自定义的逻辑。


##方法

###命名空间

实时通信 SDK 会占用全局命名空间 lc，当然你可以使用 requirejs 等 AMD 模块化工具重新定义命名空间。

###lc.realtime(options, callback)
创建实时通信对象的方法，会启动实时通信的连接，自动调用 open 方法，内部与服务器匹配建立 websocket 连接
options 配置参数
appId
clientId
auth
callback 创建成功后触发的回调，也可以监听 open 事件
返回 realtimeObject，其中有后续调用的方法

###realtimeObject.open(callback)
启动实时通信的连接，与服务器匹配建立 websocket 连接
callback 创建成功后触发的回调，也可以监听 open 事件
返回 realtimeObject，其中有后续调用的方法

###realtimeObject.close()
关闭实时通信的连接，并且内部会关闭 websocket 连接
返回 realtimeObject，其中有后续调用的方法

###realtimeObject.on(eventName, callback)
监听 realtimeObject 内部的事件，一个局部的事件中心，事件每次派发就会被触发一次
eventName 监听的事件名称
callback 当事件被派发时会调用的回调
返回 realtimeObject，其中有后续调用的方法

###realtimeObject.once(eventName, callback)
监听 realtimeObject 内部的事件，一个局部的事件中心，事件只会被触发一次
eventName 监听的事件名称
callback 当事件被派发时会调用的回调
返回 realtimeObject，其中有后续调用的方法

###realtimeObject.emit(eventName)
派发一个事件到 realtimeObject 中，局部的事件中心
eventName 派发的事件名称
返回 realtimeObject，其中有后续调用的方法

###realtimeObject.room(options, callback)
创建一个 Room，实时通信的最小单元
options 传入配置信息
data 自定义的数据信息，如 title、name 等
callback 创建成功后的回调函数，此时会派发一个 new 事件
返回 roomObject，其中有后续调用的方法

###realtimeObject.room(roomId, callback)
匹配一个在服务器端已有的 room，并生成对应的 roomObject
roomId 传入对应的 roomId
callback 创建成功后的回调函数
返回 roomObject，其中有后续调用的方法

###roomObject.add(clentId, callback)
向当前 roomObject 中添加一个用户
roomObject.remove(clentId, callback)
向当前 roomObject 中移除一个用户

###roomObject.join()

###roomObject.leave()

###roomObject.send()

###roomObject.log()

###roomObject.query()

###roomObject.update()

##事件

