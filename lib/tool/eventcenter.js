'use strict';

module.exports = function () {
  var eventList = {};
  var eventOnceList = {};

  var _on = function _on(eventName, fun, options) {
    if (!eventName) {
      throw new Error('No event name.');
    } else if (!fun) {
      throw new Error('No callback function.');
    }
    var list = eventName.split(/\s+/);
    var tempList;
    var isOnce;
    var isSingle;
    if (options) {
      isOnce = options.once;
      isSingle = options.single;
    }

    if (!isOnce) {
      tempList = eventList;
    } else {
      tempList = eventOnceList;
    }
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i]) {
        var itemEventList = tempList[list[i]];

        if (!itemEventList) {
          itemEventList = [];

          // 将新指针指向原链表
          tempList[list[i]] = itemEventList;
        }

        if (isSingle) {

          // 标记是否存在重复的方法，如果有则为 true
          var flag = false;
          for (var m = 0, n = itemEventList.length; m < n; m++) {
            if (itemEventList[m].toString() === fun.toString()) {
              flag = true;
              break;
            }
          }

          if (!flag) {
            itemEventList.push(fun);
          }
        } else {
          itemEventList.push(fun);
        }
      }
    }
  };

  var _off = function _off(eventName, fun, options) {
    var tempList;
    var isOnce;
    if (options) {
      isOnce = options.once;
    }
    if (!isOnce) {
      tempList = eventList;
    } else {
      tempList = eventOnceList;
    }
    if (tempList[eventName]) {
      var i = 0;
      var l = tempList[eventName].length;
      for (; i < l; i++) {
        if (tempList[eventName][i] === fun) {
          tempList[eventName][i] = null;
          // 每次只清除一个相同事件绑定
          break;
        }
      }
    }
  };

  function cleanNull(list) {
    var tempList = [];
    var i = 0;
    var l = list.length;
    if (l) {
      for (; i < l; i++) {
        if (list[i]) {
          tempList.push(list[i]);
        }
      }
      return tempList;
    } else {
      return null;
    }
  }

  return {
    on: function on(eventName, fun) {
      _on(eventName, fun);
      return this;
    },

    // 方法绑定以后只会运行一次
    once: function once(eventName, fun) {
      _on(eventName, fun, {
        once: true
      });
      return this;
    },

    // 同一个方法只会被绑定一次
    _one: function _one(eventName, fun) {
      _on(eventName, fun, {
        single: true
      });
    },
    emit: function emit(eventName, data) {
      if (!eventName) {
        throw new Error('No emit event name.');
      }
      var i = 0;
      var l = 0;
      if (eventList[eventName]) {
        i = 0;
        l = eventList[eventName].length;
        for (; i < l; i++) {
          if (eventList[eventName][i]) {
            eventList[eventName][i].call(this, data);
          }
        }
        eventList[eventName] = cleanNull(eventList[eventName]);
      }
      if (eventOnceList[eventName]) {
        i = 0;
        l = eventOnceList[eventName].length;
        for (; i < l; i++) {
          if (eventOnceList[eventName][i]) {
            eventOnceList[eventName][i].call(this, data);
            _off(eventName, eventOnceList[eventName][i], {
              once: true
            });
          }
        }
        eventOnceList[eventName] = cleanNull(eventOnceList[eventName]);
      }
      return this;
    },
    off: function off(eventName, fun) {
      _off(eventName, fun);
      return this;
    }
  };
};
