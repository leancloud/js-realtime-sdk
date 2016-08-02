// for document only
// SDK uses https://www.npmjs.com/package/eventemitter3

/**
 * @class EventEmitter
 * @private
 */

/**
 * 给指定的 event 添加监听器，并将该监听器置于监听器列表的末位。该方法不会检查是否已经添加过该监听器。重复添加相同的 event 和 listener 会导致该事件和监听器被重复触发。
 *
 * @function on
 * @memberof EventEmitter.prototype
 * @param {String|Symbol} event The event name.
 * @param {Function} listener The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} self.
 */

/**
 * 为 event 事件添加一个一次性的监听器，该事件第一次触发之后就会被注销。
 *
 * @function once
 * @memberof EventEmitter.prototype
 * @param {String|Symbol} event The event name.
 * @param {Function} listener The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} self.
 */

/**
 * 移除 event 事件的监听器列表中的 listener。
 *
 * @function off
 * @memberof EventEmitter.prototype
 * @param {String|Symbol} event The event name.
 * @param {Function} [listener] Only remove the listeners that match this function.
 * @param {Mixed} [context] Only remove the listeners that have this context.
 * @param {Boolean} [once] Only remove one-time listeners.
 * @returns {EventEmitter} self.
 */

/**
 * 依次调用 event 事件的监听器列表中的 listener。
 *
 * @function emit
 * @memberof EventEmitter.prototype
 * @param {String|Symbol} event The event name.
 * @param {Mixed} [...arg] payloads
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 */
