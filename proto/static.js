/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobuf"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Lazily resolved type references
    var $lazyTypes = [];
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.push_server = (function() {
    
        /**
         * Namespace push_server.
         * @exports push_server
         * @namespace
         */
        var push_server = {};
    
        push_server.messages = (function() {
    
            /**
             * Namespace messages.
             * @exports push_server.messages
             * @namespace
             */
            var messages = {};
    
            /**
             * CommandType enum.
             * @name CommandType
             * @memberof push_server.messages
             * @enum {number}
             * @property {number} session=0 session value
             * @property {number} conv=1 conv value
             * @property {number} direct=2 direct value
             * @property {number} ack=3 ack value
             * @property {number} rcp=4 rcp value
             * @property {number} unread=5 unread value
             * @property {number} logs=6 logs value
             * @property {number} error=7 error value
             * @property {number} login=8 login value
             * @property {number} data=9 data value
             * @property {number} room=10 room value
             * @property {number} read=11 read value
             * @property {number} presence=12 presence value
             * @property {number} report=13 report value
             * @property {number} echo=14 echo value
             */
            messages.CommandType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "session"] = 0;
                values[valuesById[1] = "conv"] = 1;
                values[valuesById[2] = "direct"] = 2;
                values[valuesById[3] = "ack"] = 3;
                values[valuesById[4] = "rcp"] = 4;
                values[valuesById[5] = "unread"] = 5;
                values[valuesById[6] = "logs"] = 6;
                values[valuesById[7] = "error"] = 7;
                values[valuesById[8] = "login"] = 8;
                values[valuesById[9] = "data"] = 9;
                values[valuesById[10] = "room"] = 10;
                values[valuesById[11] = "read"] = 11;
                values[valuesById[12] = "presence"] = 12;
                values[valuesById[13] = "report"] = 13;
                values[valuesById[14] = "echo"] = 14;
                return values;
            })();
    
            /**
             * OpType enum.
             * @name OpType
             * @memberof push_server.messages
             * @enum {number}
             * @property {number} open=1 open value
             * @property {number} add=2 add value
             * @property {number} remove=3 remove value
             * @property {number} close=4 close value
             * @property {number} opened=5 opened value
             * @property {number} closed=6 closed value
             * @property {number} query=7 query value
             * @property {number} query_result=8 query_result value
             * @property {number} conflict=9 conflict value
             * @property {number} added=10 added value
             * @property {number} removed=11 removed value
             * @property {number} start=30 start value
             * @property {number} started=31 started value
             * @property {number} joined=32 joined value
             * @property {number} members_joined=33 members_joined value
             * @property {number} left=39 left value
             * @property {number} members_left=40 members_left value
             * @property {number} results=42 results value
             * @property {number} count=43 count value
             * @property {number} result=44 result value
             * @property {number} update=45 update value
             * @property {number} updated=46 updated value
             * @property {number} mute=47 mute value
             * @property {number} unmute=48 unmute value
             * @property {number} status=49 status value
             * @property {number} members=50 members value
             * @property {number} join=80 join value
             * @property {number} invite=81 invite value
             * @property {number} leave=82 leave value
             * @property {number} kick=83 kick value
             * @property {number} reject=84 reject value
             * @property {number} invited=85 invited value
             * @property {number} kicked=86 kicked value
             * @property {number} upload=100 upload value
             * @property {number} uploaded=101 uploaded value
             */
            messages.OpType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[1] = "open"] = 1;
                values[valuesById[2] = "add"] = 2;
                values[valuesById[3] = "remove"] = 3;
                values[valuesById[4] = "close"] = 4;
                values[valuesById[5] = "opened"] = 5;
                values[valuesById[6] = "closed"] = 6;
                values[valuesById[7] = "query"] = 7;
                values[valuesById[8] = "query_result"] = 8;
                values[valuesById[9] = "conflict"] = 9;
                values[valuesById[10] = "added"] = 10;
                values[valuesById[11] = "removed"] = 11;
                values[valuesById[30] = "start"] = 30;
                values[valuesById[31] = "started"] = 31;
                values[valuesById[32] = "joined"] = 32;
                values[valuesById[33] = "members_joined"] = 33;
                values[valuesById[39] = "left"] = 39;
                values[valuesById[40] = "members_left"] = 40;
                values[valuesById[42] = "results"] = 42;
                values[valuesById[43] = "count"] = 43;
                values[valuesById[44] = "result"] = 44;
                values[valuesById[45] = "update"] = 45;
                values[valuesById[46] = "updated"] = 46;
                values[valuesById[47] = "mute"] = 47;
                values[valuesById[48] = "unmute"] = 48;
                values[valuesById[49] = "status"] = 49;
                values[valuesById[50] = "members"] = 50;
                values[valuesById[80] = "join"] = 80;
                values[valuesById[81] = "invite"] = 81;
                values[valuesById[82] = "leave"] = 82;
                values[valuesById[83] = "kick"] = 83;
                values[valuesById[84] = "reject"] = 84;
                values[valuesById[85] = "invited"] = 85;
                values[valuesById[86] = "kicked"] = 86;
                values[valuesById[100] = "upload"] = 100;
                values[valuesById[101] = "uploaded"] = 101;
                return values;
            })();
    
            /**
             * StatusType enum.
             * @name StatusType
             * @memberof push_server.messages
             * @enum {number}
             * @property {number} on=1 on value
             * @property {number} off=2 off value
             */
            messages.StatusType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[1] = "on"] = 1;
                values[valuesById[2] = "off"] = 2;
                return values;
            })();
    
            messages.JsonObjectMessage = (function() {
    
                /**
                 * Constructs a new JsonObjectMessage.
                 * @exports push_server.messages.JsonObjectMessage
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function JsonObjectMessage(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * JsonObjectMessage data.
                 * @type {string}
                 */
                JsonObjectMessage.prototype.data = "";
    
                /**
                 * Creates a new JsonObjectMessage instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.JsonObjectMessage} JsonObjectMessage instance
                 */
                JsonObjectMessage.create = function create(properties) {
                    return new JsonObjectMessage(properties);
                };
    
                /**
                 * Encodes the specified JsonObjectMessage message.
                 * @param {push_server.messages.JsonObjectMessage|Object} message JsonObjectMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                JsonObjectMessage.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.data);
                    return writer;
                };
    
                /**
                 * Encodes the specified JsonObjectMessage message, length delimited.
                 * @param {push_server.messages.JsonObjectMessage|Object} message JsonObjectMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                JsonObjectMessage.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a JsonObjectMessage message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.JsonObjectMessage} JsonObjectMessage
                 */
                JsonObjectMessage.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.JsonObjectMessage();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.data = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a JsonObjectMessage message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.JsonObjectMessage} JsonObjectMessage
                 */
                JsonObjectMessage.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a JsonObjectMessage message.
                 * @param {push_server.messages.JsonObjectMessage|Object} message JsonObjectMessage message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                JsonObjectMessage.verify = function verify(message) {    
                    if (!$util.isString(message.data))
                        return "data: string expected";
                    return null;
                };
    
                /**
                 * Creates a JsonObjectMessage message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.JsonObjectMessage} JsonObjectMessage
                 */
                JsonObjectMessage.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.JsonObjectMessage)
                        return object;
                    var message = new $root.push_server.messages.JsonObjectMessage();
                    if (object.data !== undefined && object.data !== null)
                        message.data = String(object.data);
                    return message;
                };
    
                /**
                 * Creates a JsonObjectMessage message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.JsonObjectMessage.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.JsonObjectMessage} JsonObjectMessage
                 */
                JsonObjectMessage.from = JsonObjectMessage.fromObject;
    
                /**
                 * Creates a plain object from a JsonObjectMessage message. Also converts values to other types if specified.
                 * @param {push_server.messages.JsonObjectMessage} message JsonObjectMessage
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                JsonObjectMessage.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.data = "";
                    if (message.data !== undefined && message.data !== null && message.hasOwnProperty("data"))
                        object.data = message.data;
                    return object;
                };
    
                /**
                 * Creates a plain object from this JsonObjectMessage message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                JsonObjectMessage.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this JsonObjectMessage to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                JsonObjectMessage.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return JsonObjectMessage;
            })();
    
            messages.UnreadTuple = (function() {
    
                /**
                 * Constructs a new UnreadTuple.
                 * @exports push_server.messages.UnreadTuple
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function UnreadTuple(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * UnreadTuple cid.
                 * @type {string}
                 */
                UnreadTuple.prototype.cid = "";
    
                /**
                 * UnreadTuple unread.
                 * @type {number}
                 */
                UnreadTuple.prototype.unread = 0;
    
                /**
                 * UnreadTuple mid.
                 * @type {string}
                 */
                UnreadTuple.prototype.mid = "";
    
                /**
                 * UnreadTuple timestamp.
                 * @type {number|$protobuf.Long}
                 */
                UnreadTuple.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Creates a new UnreadTuple instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.UnreadTuple} UnreadTuple instance
                 */
                UnreadTuple.create = function create(properties) {
                    return new UnreadTuple(properties);
                };
    
                /**
                 * Encodes the specified UnreadTuple message.
                 * @param {push_server.messages.UnreadTuple|Object} message UnreadTuple message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UnreadTuple.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.unread);
                    if (message.mid !== undefined && message.hasOwnProperty("mid"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.mid);
                    if (message.timestamp !== undefined && message.timestamp !== null && message.hasOwnProperty("timestamp"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timestamp);
                    return writer;
                };
    
                /**
                 * Encodes the specified UnreadTuple message, length delimited.
                 * @param {push_server.messages.UnreadTuple|Object} message UnreadTuple message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UnreadTuple.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an UnreadTuple message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.UnreadTuple} UnreadTuple
                 */
                UnreadTuple.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.UnreadTuple();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.cid = reader.string();
                            break;
                        case 2:
                            message.unread = reader.int32();
                            break;
                        case 3:
                            message.mid = reader.string();
                            break;
                        case 4:
                            message.timestamp = reader.int64();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an UnreadTuple message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.UnreadTuple} UnreadTuple
                 */
                UnreadTuple.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an UnreadTuple message.
                 * @param {push_server.messages.UnreadTuple|Object} message UnreadTuple message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                UnreadTuple.verify = function verify(message) {    
                    if (!$util.isString(message.cid))
                        return "cid: string expected";
                    if (!$util.isInteger(message.unread))
                        return "unread: integer expected";
                    if (message.mid !== undefined)
                        if (!$util.isString(message.mid))
                            return "mid: string expected";
                    if (message.timestamp !== undefined)
                        if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                            return "timestamp: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates an UnreadTuple message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.UnreadTuple} UnreadTuple
                 */
                UnreadTuple.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.UnreadTuple)
                        return object;
                    var message = new $root.push_server.messages.UnreadTuple();
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    if (object.unread !== undefined && object.unread !== null)
                        message.unread = object.unread | 0;
                    if (object.mid !== undefined && object.mid !== null)
                        message.mid = String(object.mid);
                    if (object.timestamp !== undefined && object.timestamp !== null)
                        if ($util.Long)
                            (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                        else if (typeof object.timestamp === "string")
                            message.timestamp = parseInt(object.timestamp, 10);
                        else if (typeof object.timestamp === "number")
                            message.timestamp = object.timestamp;
                        else if (typeof object.timestamp === "object")
                            message.timestamp = new $util.LongBits(object.timestamp.low, object.timestamp.high).toNumber();
                    return message;
                };
    
                /**
                 * Creates an UnreadTuple message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.UnreadTuple.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.UnreadTuple} UnreadTuple
                 */
                UnreadTuple.from = UnreadTuple.fromObject;
    
                /**
                 * Creates a plain object from an UnreadTuple message. Also converts values to other types if specified.
                 * @param {push_server.messages.UnreadTuple} message UnreadTuple
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UnreadTuple.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.cid = "";
                        object.unread = 0;
                        object.mid = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.timestamp = options.longs === String ? "0" : 0;
                    }
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    if (message.unread !== undefined && message.unread !== null && message.hasOwnProperty("unread"))
                        object.unread = message.unread;
                    if (message.mid !== undefined && message.mid !== null && message.hasOwnProperty("mid"))
                        object.mid = message.mid;
                    if (message.timestamp !== undefined && message.timestamp !== null && message.hasOwnProperty("timestamp"))
                        if (typeof message.timestamp === "number")
                            object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                        else
                            object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low, message.timestamp.high).toNumber() : message.timestamp;
                    return object;
                };
    
                /**
                 * Creates a plain object from this UnreadTuple message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UnreadTuple.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this UnreadTuple to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                UnreadTuple.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return UnreadTuple;
            })();
    
            messages.LogItem = (function() {
    
                /**
                 * Constructs a new LogItem.
                 * @exports push_server.messages.LogItem
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function LogItem(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * LogItem from.
                 * @type {string}
                 */
                LogItem.prototype.from = "";
    
                /**
                 * LogItem data.
                 * @type {string}
                 */
                LogItem.prototype.data = "";
    
                /**
                 * LogItem timestamp.
                 * @type {number|$protobuf.Long}
                 */
                LogItem.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * LogItem msgId.
                 * @type {string}
                 */
                LogItem.prototype.msgId = "";
    
                /**
                 * LogItem ackAt.
                 * @type {number|$protobuf.Long}
                 */
                LogItem.prototype.ackAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Creates a new LogItem instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.LogItem} LogItem instance
                 */
                LogItem.create = function create(properties) {
                    return new LogItem(properties);
                };
    
                /**
                 * Encodes the specified LogItem message.
                 * @param {push_server.messages.LogItem|Object} message LogItem message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LogItem.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.from !== undefined && message.hasOwnProperty("from"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.from);
                    if (message.data !== undefined && message.hasOwnProperty("data"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.data);
                    if (message.timestamp !== undefined && message.timestamp !== null && message.hasOwnProperty("timestamp"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
                    if (message.msgId !== undefined && message.hasOwnProperty("msgId"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.msgId);
                    if (message.ackAt !== undefined && message.ackAt !== null && message.hasOwnProperty("ackAt"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int64(message.ackAt);
                    return writer;
                };
    
                /**
                 * Encodes the specified LogItem message, length delimited.
                 * @param {push_server.messages.LogItem|Object} message LogItem message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LogItem.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a LogItem message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.LogItem} LogItem
                 */
                LogItem.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.LogItem();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.from = reader.string();
                            break;
                        case 2:
                            message.data = reader.string();
                            break;
                        case 3:
                            message.timestamp = reader.int64();
                            break;
                        case 4:
                            message.msgId = reader.string();
                            break;
                        case 5:
                            message.ackAt = reader.int64();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a LogItem message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.LogItem} LogItem
                 */
                LogItem.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a LogItem message.
                 * @param {push_server.messages.LogItem|Object} message LogItem message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                LogItem.verify = function verify(message) {    
                    if (message.from !== undefined)
                        if (!$util.isString(message.from))
                            return "from: string expected";
                    if (message.data !== undefined)
                        if (!$util.isString(message.data))
                            return "data: string expected";
                    if (message.timestamp !== undefined)
                        if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                            return "timestamp: integer|Long expected";
                    if (message.msgId !== undefined)
                        if (!$util.isString(message.msgId))
                            return "msgId: string expected";
                    if (message.ackAt !== undefined)
                        if (!$util.isInteger(message.ackAt) && !(message.ackAt && $util.isInteger(message.ackAt.low) && $util.isInteger(message.ackAt.high)))
                            return "ackAt: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a LogItem message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.LogItem} LogItem
                 */
                LogItem.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.LogItem)
                        return object;
                    var message = new $root.push_server.messages.LogItem();
                    if (object.from !== undefined && object.from !== null)
                        message.from = String(object.from);
                    if (object.data !== undefined && object.data !== null)
                        message.data = String(object.data);
                    if (object.timestamp !== undefined && object.timestamp !== null)
                        if ($util.Long)
                            (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                        else if (typeof object.timestamp === "string")
                            message.timestamp = parseInt(object.timestamp, 10);
                        else if (typeof object.timestamp === "number")
                            message.timestamp = object.timestamp;
                        else if (typeof object.timestamp === "object")
                            message.timestamp = new $util.LongBits(object.timestamp.low, object.timestamp.high).toNumber();
                    if (object.msgId !== undefined && object.msgId !== null)
                        message.msgId = String(object.msgId);
                    if (object.ackAt !== undefined && object.ackAt !== null)
                        if ($util.Long)
                            (message.ackAt = $util.Long.fromValue(object.ackAt)).unsigned = false;
                        else if (typeof object.ackAt === "string")
                            message.ackAt = parseInt(object.ackAt, 10);
                        else if (typeof object.ackAt === "number")
                            message.ackAt = object.ackAt;
                        else if (typeof object.ackAt === "object")
                            message.ackAt = new $util.LongBits(object.ackAt.low, object.ackAt.high).toNumber();
                    return message;
                };
    
                /**
                 * Creates a LogItem message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.LogItem.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.LogItem} LogItem
                 */
                LogItem.from = LogItem.fromObject;
    
                /**
                 * Creates a plain object from a LogItem message. Also converts values to other types if specified.
                 * @param {push_server.messages.LogItem} message LogItem
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LogItem.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.from = "";
                        object.data = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.timestamp = options.longs === String ? "0" : 0;
                        object.msgId = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.ackAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.ackAt = options.longs === String ? "0" : 0;
                    }
                    if (message.from !== undefined && message.from !== null && message.hasOwnProperty("from"))
                        object.from = message.from;
                    if (message.data !== undefined && message.data !== null && message.hasOwnProperty("data"))
                        object.data = message.data;
                    if (message.timestamp !== undefined && message.timestamp !== null && message.hasOwnProperty("timestamp"))
                        if (typeof message.timestamp === "number")
                            object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                        else
                            object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low, message.timestamp.high).toNumber() : message.timestamp;
                    if (message.msgId !== undefined && message.msgId !== null && message.hasOwnProperty("msgId"))
                        object.msgId = message.msgId;
                    if (message.ackAt !== undefined && message.ackAt !== null && message.hasOwnProperty("ackAt"))
                        if (typeof message.ackAt === "number")
                            object.ackAt = options.longs === String ? String(message.ackAt) : message.ackAt;
                        else
                            object.ackAt = options.longs === String ? $util.Long.prototype.toString.call(message.ackAt) : options.longs === Number ? new $util.LongBits(message.ackAt.low, message.ackAt.high).toNumber() : message.ackAt;
                    return object;
                };
    
                /**
                 * Creates a plain object from this LogItem message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LogItem.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this LogItem to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                LogItem.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return LogItem;
            })();
    
            messages.LoginCommand = (function() {
    
                /**
                 * Constructs a new LoginCommand.
                 * @exports push_server.messages.LoginCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function LoginCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Creates a new LoginCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.LoginCommand} LoginCommand instance
                 */
                LoginCommand.create = function create(properties) {
                    return new LoginCommand(properties);
                };
    
                /**
                 * Encodes the specified LoginCommand message.
                 * @param {push_server.messages.LoginCommand|Object} message LoginCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LoginCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    return writer;
                };
    
                /**
                 * Encodes the specified LoginCommand message, length delimited.
                 * @param {push_server.messages.LoginCommand|Object} message LoginCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LoginCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a LoginCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.LoginCommand} LoginCommand
                 */
                LoginCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.LoginCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a LoginCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.LoginCommand} LoginCommand
                 */
                LoginCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a LoginCommand message.
                 * @param {push_server.messages.LoginCommand|Object} message LoginCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                LoginCommand.verify = function verify() {    
                    return null;
                };
    
                /**
                 * Creates a LoginCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.LoginCommand} LoginCommand
                 */
                LoginCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.LoginCommand)
                        return object;
                    return new $root.push_server.messages.LoginCommand();
                };
    
                /**
                 * Creates a LoginCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.LoginCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.LoginCommand} LoginCommand
                 */
                LoginCommand.from = LoginCommand.fromObject;
    
                /**
                 * Creates a plain object from a LoginCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.LoginCommand} message LoginCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LoginCommand.toObject = function toObject() {    
                    return {};
                };
    
                /**
                 * Creates a plain object from this LoginCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LoginCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this LoginCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                LoginCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return LoginCommand;
            })();
    
            messages.DataCommand = (function() {
    
                /**
                 * Constructs a new DataCommand.
                 * @exports push_server.messages.DataCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function DataCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * DataCommand ids.
                 * @type {Array.<string>}
                 */
                DataCommand.prototype.ids = $util.emptyArray;
    
                /**
                 * DataCommand msg.
                 * @type {Array.<push_server.messages.JsonObjectMessage>}
                 */
                DataCommand.prototype.msg = $util.emptyArray;
    
                /**
                 * DataCommand offline.
                 * @type {boolean}
                 */
                DataCommand.prototype.offline = false;
    
                // Lazily resolved type references
                var $types = {
                    1: "push_server.messages.JsonObjectMessage"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new DataCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.DataCommand} DataCommand instance
                 */
                DataCommand.create = function create(properties) {
                    return new DataCommand(properties);
                };
    
                /**
                 * Encodes the specified DataCommand message.
                 * @param {push_server.messages.DataCommand|Object} message DataCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DataCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.ids !== undefined && message.hasOwnProperty("ids"))
                        for (var i = 0; i < message.ids.length; ++i)
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.ids[i]);
                    if (message.msg !== undefined && message.hasOwnProperty("msg"))
                        for (var i = 0; i < message.msg.length; ++i)
                            $types[1].encode(message.msg[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.offline !== undefined && message.hasOwnProperty("offline"))
                        writer.uint32(/* id 3, wireType 0 =*/24).bool(message.offline);
                    return writer;
                };
    
                /**
                 * Encodes the specified DataCommand message, length delimited.
                 * @param {push_server.messages.DataCommand|Object} message DataCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DataCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a DataCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.DataCommand} DataCommand
                 */
                DataCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.DataCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.ids && message.ids.length))
                                message.ids = [];
                            message.ids.push(reader.string());
                            break;
                        case 2:
                            if (!(message.msg && message.msg.length))
                                message.msg = [];
                            message.msg.push($types[1].decode(reader, reader.uint32()));
                            break;
                        case 3:
                            message.offline = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a DataCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.DataCommand} DataCommand
                 */
                DataCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a DataCommand message.
                 * @param {push_server.messages.DataCommand|Object} message DataCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                DataCommand.verify = function verify(message) {    
                    if (message.ids !== undefined) {
                        if (!Array.isArray(message.ids))
                            return "ids: array expected";
                        for (var i = 0; i < message.ids.length; ++i)
                            if (!$util.isString(message.ids[i]))
                                return "ids: string[] expected";
                    }
                    if (message.msg !== undefined) {
                        if (!Array.isArray(message.msg))
                            return "msg: array expected";
                        for (var i = 0; i < message.msg.length; ++i) {
                            var error = $types[1].verify(message.msg[i]);
                            if (error)
                                return "msg." + error;
                        }
                    }
                    if (message.offline !== undefined)
                        if (typeof message.offline !== "boolean")
                            return "offline: boolean expected";
                    return null;
                };
    
                /**
                 * Creates a DataCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.DataCommand} DataCommand
                 */
                DataCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.DataCommand)
                        return object;
                    var message = new $root.push_server.messages.DataCommand();
                    if (object.ids) {
                        if (!Array.isArray(object.ids))
                            throw TypeError(".push_server.messages.DataCommand.ids: array expected");
                        message.ids = [];
                        for (var i = 0; i < object.ids.length; ++i)
                            message.ids[i] = String(object.ids[i]);
                    }
                    if (object.msg) {
                        if (!Array.isArray(object.msg))
                            throw TypeError(".push_server.messages.DataCommand.msg: array expected");
                        message.msg = [];
                        for (var i = 0; i < object.msg.length; ++i) {
                            if (typeof object.msg[i] !== "object")
                                throw TypeError(".push_server.messages.DataCommand.msg: object expected");
                            message.msg[i] = $types[1].fromObject(object.msg[i]);
                        }
                    }
                    if (object.offline !== undefined && object.offline !== null)
                        message.offline = Boolean(object.offline);
                    return message;
                };
    
                /**
                 * Creates a DataCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.DataCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.DataCommand} DataCommand
                 */
                DataCommand.from = DataCommand.fromObject;
    
                /**
                 * Creates a plain object from a DataCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.DataCommand} message DataCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DataCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.ids = [];
                        object.msg = [];
                    }
                    if (options.defaults)
                        object.offline = false;
                    if (message.ids !== undefined && message.ids !== null && message.hasOwnProperty("ids")) {
                        object.ids = [];
                        for (var j = 0; j < message.ids.length; ++j)
                            object.ids[j] = message.ids[j];
                    }
                    if (message.msg !== undefined && message.msg !== null && message.hasOwnProperty("msg")) {
                        object.msg = [];
                        for (var j = 0; j < message.msg.length; ++j)
                            object.msg[j] = $types[1].toObject(message.msg[j], options);
                    }
                    if (message.offline !== undefined && message.offline !== null && message.hasOwnProperty("offline"))
                        object.offline = message.offline;
                    return object;
                };
    
                /**
                 * Creates a plain object from this DataCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DataCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this DataCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                DataCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return DataCommand;
            })();
    
            messages.SessionCommand = (function() {
    
                /**
                 * Constructs a new SessionCommand.
                 * @exports push_server.messages.SessionCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function SessionCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * SessionCommand t.
                 * @type {number|$protobuf.Long}
                 */
                SessionCommand.prototype.t = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * SessionCommand n.
                 * @type {string}
                 */
                SessionCommand.prototype.n = "";
    
                /**
                 * SessionCommand s.
                 * @type {string}
                 */
                SessionCommand.prototype.s = "";
    
                /**
                 * SessionCommand ua.
                 * @type {string}
                 */
                SessionCommand.prototype.ua = "";
    
                /**
                 * SessionCommand r.
                 * @type {boolean}
                 */
                SessionCommand.prototype.r = false;
    
                /**
                 * SessionCommand tag.
                 * @type {string}
                 */
                SessionCommand.prototype.tag = "";
    
                /**
                 * SessionCommand deviceId.
                 * @type {string}
                 */
                SessionCommand.prototype.deviceId = "";
    
                /**
                 * SessionCommand sessionPeerIds.
                 * @type {Array.<string>}
                 */
                SessionCommand.prototype.sessionPeerIds = $util.emptyArray;
    
                /**
                 * SessionCommand onlineSessionPeerIds.
                 * @type {Array.<string>}
                 */
                SessionCommand.prototype.onlineSessionPeerIds = $util.emptyArray;
    
                /**
                 * SessionCommand st.
                 * @type {string}
                 */
                SessionCommand.prototype.st = "";
    
                /**
                 * SessionCommand stTtl.
                 * @type {number}
                 */
                SessionCommand.prototype.stTtl = 0;
    
                /**
                 * SessionCommand code.
                 * @type {number}
                 */
                SessionCommand.prototype.code = 0;
    
                /**
                 * SessionCommand reason.
                 * @type {string}
                 */
                SessionCommand.prototype.reason = "";
    
                /**
                 * SessionCommand deviceToken.
                 * @type {string}
                 */
                SessionCommand.prototype.deviceToken = "";
    
                /**
                 * SessionCommand sp.
                 * @type {boolean}
                 */
                SessionCommand.prototype.sp = false;
    
                /**
                 * SessionCommand detail.
                 * @type {string}
                 */
                SessionCommand.prototype.detail = "";
    
                /**
                 * Creates a new SessionCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.SessionCommand} SessionCommand instance
                 */
                SessionCommand.create = function create(properties) {
                    return new SessionCommand(properties);
                };
    
                /**
                 * Encodes the specified SessionCommand message.
                 * @param {push_server.messages.SessionCommand|Object} message SessionCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SessionCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.t);
                    if (message.n !== undefined && message.hasOwnProperty("n"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.n);
                    if (message.s !== undefined && message.hasOwnProperty("s"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.s);
                    if (message.ua !== undefined && message.hasOwnProperty("ua"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.ua);
                    if (message.r !== undefined && message.hasOwnProperty("r"))
                        writer.uint32(/* id 5, wireType 0 =*/40).bool(message.r);
                    if (message.tag !== undefined && message.hasOwnProperty("tag"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.tag);
                    if (message.deviceId !== undefined && message.hasOwnProperty("deviceId"))
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.deviceId);
                    if (message.sessionPeerIds !== undefined && message.hasOwnProperty("sessionPeerIds"))
                        for (var i = 0; i < message.sessionPeerIds.length; ++i)
                            writer.uint32(/* id 8, wireType 2 =*/66).string(message.sessionPeerIds[i]);
                    if (message.onlineSessionPeerIds !== undefined && message.hasOwnProperty("onlineSessionPeerIds"))
                        for (var i = 0; i < message.onlineSessionPeerIds.length; ++i)
                            writer.uint32(/* id 9, wireType 2 =*/74).string(message.onlineSessionPeerIds[i]);
                    if (message.st !== undefined && message.hasOwnProperty("st"))
                        writer.uint32(/* id 10, wireType 2 =*/82).string(message.st);
                    if (message.stTtl !== undefined && message.hasOwnProperty("stTtl"))
                        writer.uint32(/* id 11, wireType 0 =*/88).int32(message.stTtl);
                    if (message.code !== undefined && message.hasOwnProperty("code"))
                        writer.uint32(/* id 12, wireType 0 =*/96).int32(message.code);
                    if (message.reason !== undefined && message.hasOwnProperty("reason"))
                        writer.uint32(/* id 13, wireType 2 =*/106).string(message.reason);
                    if (message.deviceToken !== undefined && message.hasOwnProperty("deviceToken"))
                        writer.uint32(/* id 14, wireType 2 =*/114).string(message.deviceToken);
                    if (message.sp !== undefined && message.hasOwnProperty("sp"))
                        writer.uint32(/* id 15, wireType 0 =*/120).bool(message.sp);
                    if (message.detail !== undefined && message.hasOwnProperty("detail"))
                        writer.uint32(/* id 16, wireType 2 =*/130).string(message.detail);
                    return writer;
                };
    
                /**
                 * Encodes the specified SessionCommand message, length delimited.
                 * @param {push_server.messages.SessionCommand|Object} message SessionCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SessionCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a SessionCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.SessionCommand} SessionCommand
                 */
                SessionCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.SessionCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.t = reader.int64();
                            break;
                        case 2:
                            message.n = reader.string();
                            break;
                        case 3:
                            message.s = reader.string();
                            break;
                        case 4:
                            message.ua = reader.string();
                            break;
                        case 5:
                            message.r = reader.bool();
                            break;
                        case 6:
                            message.tag = reader.string();
                            break;
                        case 7:
                            message.deviceId = reader.string();
                            break;
                        case 8:
                            if (!(message.sessionPeerIds && message.sessionPeerIds.length))
                                message.sessionPeerIds = [];
                            message.sessionPeerIds.push(reader.string());
                            break;
                        case 9:
                            if (!(message.onlineSessionPeerIds && message.onlineSessionPeerIds.length))
                                message.onlineSessionPeerIds = [];
                            message.onlineSessionPeerIds.push(reader.string());
                            break;
                        case 10:
                            message.st = reader.string();
                            break;
                        case 11:
                            message.stTtl = reader.int32();
                            break;
                        case 12:
                            message.code = reader.int32();
                            break;
                        case 13:
                            message.reason = reader.string();
                            break;
                        case 14:
                            message.deviceToken = reader.string();
                            break;
                        case 15:
                            message.sp = reader.bool();
                            break;
                        case 16:
                            message.detail = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a SessionCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.SessionCommand} SessionCommand
                 */
                SessionCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a SessionCommand message.
                 * @param {push_server.messages.SessionCommand|Object} message SessionCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                SessionCommand.verify = function verify(message) {    
                    if (message.t !== undefined)
                        if (!$util.isInteger(message.t) && !(message.t && $util.isInteger(message.t.low) && $util.isInteger(message.t.high)))
                            return "t: integer|Long expected";
                    if (message.n !== undefined)
                        if (!$util.isString(message.n))
                            return "n: string expected";
                    if (message.s !== undefined)
                        if (!$util.isString(message.s))
                            return "s: string expected";
                    if (message.ua !== undefined)
                        if (!$util.isString(message.ua))
                            return "ua: string expected";
                    if (message.r !== undefined)
                        if (typeof message.r !== "boolean")
                            return "r: boolean expected";
                    if (message.tag !== undefined)
                        if (!$util.isString(message.tag))
                            return "tag: string expected";
                    if (message.deviceId !== undefined)
                        if (!$util.isString(message.deviceId))
                            return "deviceId: string expected";
                    if (message.sessionPeerIds !== undefined) {
                        if (!Array.isArray(message.sessionPeerIds))
                            return "sessionPeerIds: array expected";
                        for (var i = 0; i < message.sessionPeerIds.length; ++i)
                            if (!$util.isString(message.sessionPeerIds[i]))
                                return "sessionPeerIds: string[] expected";
                    }
                    if (message.onlineSessionPeerIds !== undefined) {
                        if (!Array.isArray(message.onlineSessionPeerIds))
                            return "onlineSessionPeerIds: array expected";
                        for (var i = 0; i < message.onlineSessionPeerIds.length; ++i)
                            if (!$util.isString(message.onlineSessionPeerIds[i]))
                                return "onlineSessionPeerIds: string[] expected";
                    }
                    if (message.st !== undefined)
                        if (!$util.isString(message.st))
                            return "st: string expected";
                    if (message.stTtl !== undefined)
                        if (!$util.isInteger(message.stTtl))
                            return "stTtl: integer expected";
                    if (message.code !== undefined)
                        if (!$util.isInteger(message.code))
                            return "code: integer expected";
                    if (message.reason !== undefined)
                        if (!$util.isString(message.reason))
                            return "reason: string expected";
                    if (message.deviceToken !== undefined)
                        if (!$util.isString(message.deviceToken))
                            return "deviceToken: string expected";
                    if (message.sp !== undefined)
                        if (typeof message.sp !== "boolean")
                            return "sp: boolean expected";
                    if (message.detail !== undefined)
                        if (!$util.isString(message.detail))
                            return "detail: string expected";
                    return null;
                };
    
                /**
                 * Creates a SessionCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.SessionCommand} SessionCommand
                 */
                SessionCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.SessionCommand)
                        return object;
                    var message = new $root.push_server.messages.SessionCommand();
                    if (object.t !== undefined && object.t !== null)
                        if ($util.Long)
                            (message.t = $util.Long.fromValue(object.t)).unsigned = false;
                        else if (typeof object.t === "string")
                            message.t = parseInt(object.t, 10);
                        else if (typeof object.t === "number")
                            message.t = object.t;
                        else if (typeof object.t === "object")
                            message.t = new $util.LongBits(object.t.low, object.t.high).toNumber();
                    if (object.n !== undefined && object.n !== null)
                        message.n = String(object.n);
                    if (object.s !== undefined && object.s !== null)
                        message.s = String(object.s);
                    if (object.ua !== undefined && object.ua !== null)
                        message.ua = String(object.ua);
                    if (object.r !== undefined && object.r !== null)
                        message.r = Boolean(object.r);
                    if (object.tag !== undefined && object.tag !== null)
                        message.tag = String(object.tag);
                    if (object.deviceId !== undefined && object.deviceId !== null)
                        message.deviceId = String(object.deviceId);
                    if (object.sessionPeerIds) {
                        if (!Array.isArray(object.sessionPeerIds))
                            throw TypeError(".push_server.messages.SessionCommand.sessionPeerIds: array expected");
                        message.sessionPeerIds = [];
                        for (var i = 0; i < object.sessionPeerIds.length; ++i)
                            message.sessionPeerIds[i] = String(object.sessionPeerIds[i]);
                    }
                    if (object.onlineSessionPeerIds) {
                        if (!Array.isArray(object.onlineSessionPeerIds))
                            throw TypeError(".push_server.messages.SessionCommand.onlineSessionPeerIds: array expected");
                        message.onlineSessionPeerIds = [];
                        for (var i = 0; i < object.onlineSessionPeerIds.length; ++i)
                            message.onlineSessionPeerIds[i] = String(object.onlineSessionPeerIds[i]);
                    }
                    if (object.st !== undefined && object.st !== null)
                        message.st = String(object.st);
                    if (object.stTtl !== undefined && object.stTtl !== null)
                        message.stTtl = object.stTtl | 0;
                    if (object.code !== undefined && object.code !== null)
                        message.code = object.code | 0;
                    if (object.reason !== undefined && object.reason !== null)
                        message.reason = String(object.reason);
                    if (object.deviceToken !== undefined && object.deviceToken !== null)
                        message.deviceToken = String(object.deviceToken);
                    if (object.sp !== undefined && object.sp !== null)
                        message.sp = Boolean(object.sp);
                    if (object.detail !== undefined && object.detail !== null)
                        message.detail = String(object.detail);
                    return message;
                };
    
                /**
                 * Creates a SessionCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.SessionCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.SessionCommand} SessionCommand
                 */
                SessionCommand.from = SessionCommand.fromObject;
    
                /**
                 * Creates a plain object from a SessionCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.SessionCommand} message SessionCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SessionCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.sessionPeerIds = [];
                        object.onlineSessionPeerIds = [];
                    }
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.t = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.t = options.longs === String ? "0" : 0;
                        object.n = "";
                        object.s = "";
                        object.ua = "";
                        object.r = false;
                        object.tag = "";
                        object.deviceId = "";
                        object.st = "";
                        object.stTtl = 0;
                        object.code = 0;
                        object.reason = "";
                        object.deviceToken = "";
                        object.sp = false;
                        object.detail = "";
                    }
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        if (typeof message.t === "number")
                            object.t = options.longs === String ? String(message.t) : message.t;
                        else
                            object.t = options.longs === String ? $util.Long.prototype.toString.call(message.t) : options.longs === Number ? new $util.LongBits(message.t.low, message.t.high).toNumber() : message.t;
                    if (message.n !== undefined && message.n !== null && message.hasOwnProperty("n"))
                        object.n = message.n;
                    if (message.s !== undefined && message.s !== null && message.hasOwnProperty("s"))
                        object.s = message.s;
                    if (message.ua !== undefined && message.ua !== null && message.hasOwnProperty("ua"))
                        object.ua = message.ua;
                    if (message.r !== undefined && message.r !== null && message.hasOwnProperty("r"))
                        object.r = message.r;
                    if (message.tag !== undefined && message.tag !== null && message.hasOwnProperty("tag"))
                        object.tag = message.tag;
                    if (message.deviceId !== undefined && message.deviceId !== null && message.hasOwnProperty("deviceId"))
                        object.deviceId = message.deviceId;
                    if (message.sessionPeerIds !== undefined && message.sessionPeerIds !== null && message.hasOwnProperty("sessionPeerIds")) {
                        object.sessionPeerIds = [];
                        for (var j = 0; j < message.sessionPeerIds.length; ++j)
                            object.sessionPeerIds[j] = message.sessionPeerIds[j];
                    }
                    if (message.onlineSessionPeerIds !== undefined && message.onlineSessionPeerIds !== null && message.hasOwnProperty("onlineSessionPeerIds")) {
                        object.onlineSessionPeerIds = [];
                        for (var j = 0; j < message.onlineSessionPeerIds.length; ++j)
                            object.onlineSessionPeerIds[j] = message.onlineSessionPeerIds[j];
                    }
                    if (message.st !== undefined && message.st !== null && message.hasOwnProperty("st"))
                        object.st = message.st;
                    if (message.stTtl !== undefined && message.stTtl !== null && message.hasOwnProperty("stTtl"))
                        object.stTtl = message.stTtl;
                    if (message.code !== undefined && message.code !== null && message.hasOwnProperty("code"))
                        object.code = message.code;
                    if (message.reason !== undefined && message.reason !== null && message.hasOwnProperty("reason"))
                        object.reason = message.reason;
                    if (message.deviceToken !== undefined && message.deviceToken !== null && message.hasOwnProperty("deviceToken"))
                        object.deviceToken = message.deviceToken;
                    if (message.sp !== undefined && message.sp !== null && message.hasOwnProperty("sp"))
                        object.sp = message.sp;
                    if (message.detail !== undefined && message.detail !== null && message.hasOwnProperty("detail"))
                        object.detail = message.detail;
                    return object;
                };
    
                /**
                 * Creates a plain object from this SessionCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SessionCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this SessionCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                SessionCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return SessionCommand;
            })();
    
            messages.ErrorCommand = (function() {
    
                /**
                 * Constructs a new ErrorCommand.
                 * @exports push_server.messages.ErrorCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ErrorCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ErrorCommand code.
                 * @type {number}
                 */
                ErrorCommand.prototype.code = 0;
    
                /**
                 * ErrorCommand reason.
                 * @type {string}
                 */
                ErrorCommand.prototype.reason = "";
    
                /**
                 * ErrorCommand appCode.
                 * @type {number}
                 */
                ErrorCommand.prototype.appCode = 0;
    
                /**
                 * ErrorCommand detail.
                 * @type {string}
                 */
                ErrorCommand.prototype.detail = "";
    
                /**
                 * Creates a new ErrorCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.ErrorCommand} ErrorCommand instance
                 */
                ErrorCommand.create = function create(properties) {
                    return new ErrorCommand(properties);
                };
    
                /**
                 * Encodes the specified ErrorCommand message.
                 * @param {push_server.messages.ErrorCommand|Object} message ErrorCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ErrorCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.reason);
                    if (message.appCode !== undefined && message.hasOwnProperty("appCode"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.appCode);
                    if (message.detail !== undefined && message.hasOwnProperty("detail"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.detail);
                    return writer;
                };
    
                /**
                 * Encodes the specified ErrorCommand message, length delimited.
                 * @param {push_server.messages.ErrorCommand|Object} message ErrorCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ErrorCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an ErrorCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.ErrorCommand} ErrorCommand
                 */
                ErrorCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.ErrorCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.code = reader.int32();
                            break;
                        case 2:
                            message.reason = reader.string();
                            break;
                        case 3:
                            message.appCode = reader.int32();
                            break;
                        case 4:
                            message.detail = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an ErrorCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.ErrorCommand} ErrorCommand
                 */
                ErrorCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an ErrorCommand message.
                 * @param {push_server.messages.ErrorCommand|Object} message ErrorCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ErrorCommand.verify = function verify(message) {    
                    if (!$util.isInteger(message.code))
                        return "code: integer expected";
                    if (!$util.isString(message.reason))
                        return "reason: string expected";
                    if (message.appCode !== undefined)
                        if (!$util.isInteger(message.appCode))
                            return "appCode: integer expected";
                    if (message.detail !== undefined)
                        if (!$util.isString(message.detail))
                            return "detail: string expected";
                    return null;
                };
    
                /**
                 * Creates an ErrorCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ErrorCommand} ErrorCommand
                 */
                ErrorCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.ErrorCommand)
                        return object;
                    var message = new $root.push_server.messages.ErrorCommand();
                    if (object.code !== undefined && object.code !== null)
                        message.code = object.code | 0;
                    if (object.reason !== undefined && object.reason !== null)
                        message.reason = String(object.reason);
                    if (object.appCode !== undefined && object.appCode !== null)
                        message.appCode = object.appCode | 0;
                    if (object.detail !== undefined && object.detail !== null)
                        message.detail = String(object.detail);
                    return message;
                };
    
                /**
                 * Creates an ErrorCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.ErrorCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ErrorCommand} ErrorCommand
                 */
                ErrorCommand.from = ErrorCommand.fromObject;
    
                /**
                 * Creates a plain object from an ErrorCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.ErrorCommand} message ErrorCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ErrorCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.code = 0;
                        object.reason = "";
                        object.appCode = 0;
                        object.detail = "";
                    }
                    if (message.code !== undefined && message.code !== null && message.hasOwnProperty("code"))
                        object.code = message.code;
                    if (message.reason !== undefined && message.reason !== null && message.hasOwnProperty("reason"))
                        object.reason = message.reason;
                    if (message.appCode !== undefined && message.appCode !== null && message.hasOwnProperty("appCode"))
                        object.appCode = message.appCode;
                    if (message.detail !== undefined && message.detail !== null && message.hasOwnProperty("detail"))
                        object.detail = message.detail;
                    return object;
                };
    
                /**
                 * Creates a plain object from this ErrorCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ErrorCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this ErrorCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ErrorCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ErrorCommand;
            })();
    
            messages.DirectCommand = (function() {
    
                /**
                 * Constructs a new DirectCommand.
                 * @exports push_server.messages.DirectCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function DirectCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * DirectCommand msg.
                 * @type {string}
                 */
                DirectCommand.prototype.msg = "";
    
                /**
                 * DirectCommand uid.
                 * @type {string}
                 */
                DirectCommand.prototype.uid = "";
    
                /**
                 * DirectCommand fromPeerId.
                 * @type {string}
                 */
                DirectCommand.prototype.fromPeerId = "";
    
                /**
                 * DirectCommand timestamp.
                 * @type {number|$protobuf.Long}
                 */
                DirectCommand.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * DirectCommand offline.
                 * @type {boolean}
                 */
                DirectCommand.prototype.offline = false;
    
                /**
                 * DirectCommand hasMore.
                 * @type {boolean}
                 */
                DirectCommand.prototype.hasMore = false;
    
                /**
                 * DirectCommand toPeerIds.
                 * @type {Array.<string>}
                 */
                DirectCommand.prototype.toPeerIds = $util.emptyArray;
    
                /**
                 * DirectCommand r.
                 * @type {boolean}
                 */
                DirectCommand.prototype.r = false;
    
                /**
                 * DirectCommand cid.
                 * @type {string}
                 */
                DirectCommand.prototype.cid = "";
    
                /**
                 * DirectCommand id.
                 * @type {string}
                 */
                DirectCommand.prototype.id = "";
    
                /**
                 * DirectCommand transient.
                 * @type {boolean}
                 */
                DirectCommand.prototype.transient = false;
    
                /**
                 * DirectCommand dt.
                 * @type {string}
                 */
                DirectCommand.prototype.dt = "";
    
                /**
                 * DirectCommand roomId.
                 * @type {string}
                 */
                DirectCommand.prototype.roomId = "";
    
                /**
                 * DirectCommand pushData.
                 * @type {string}
                 */
                DirectCommand.prototype.pushData = "";
    
                /**
                 * Creates a new DirectCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.DirectCommand} DirectCommand instance
                 */
                DirectCommand.create = function create(properties) {
                    return new DirectCommand(properties);
                };
    
                /**
                 * Encodes the specified DirectCommand message.
                 * @param {push_server.messages.DirectCommand|Object} message DirectCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DirectCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.msg !== undefined && message.hasOwnProperty("msg"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.msg);
                    if (message.uid !== undefined && message.hasOwnProperty("uid"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.uid);
                    if (message.fromPeerId !== undefined && message.hasOwnProperty("fromPeerId"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.fromPeerId);
                    if (message.timestamp !== undefined && message.timestamp !== null && message.hasOwnProperty("timestamp"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timestamp);
                    if (message.offline !== undefined && message.hasOwnProperty("offline"))
                        writer.uint32(/* id 5, wireType 0 =*/40).bool(message.offline);
                    if (message.hasMore !== undefined && message.hasOwnProperty("hasMore"))
                        writer.uint32(/* id 6, wireType 0 =*/48).bool(message.hasMore);
                    if (message.toPeerIds !== undefined && message.hasOwnProperty("toPeerIds"))
                        for (var i = 0; i < message.toPeerIds.length; ++i)
                            writer.uint32(/* id 7, wireType 2 =*/58).string(message.toPeerIds[i]);
                    if (message.r !== undefined && message.hasOwnProperty("r"))
                        writer.uint32(/* id 10, wireType 0 =*/80).bool(message.r);
                    if (message.cid !== undefined && message.hasOwnProperty("cid"))
                        writer.uint32(/* id 11, wireType 2 =*/90).string(message.cid);
                    if (message.id !== undefined && message.hasOwnProperty("id"))
                        writer.uint32(/* id 12, wireType 2 =*/98).string(message.id);
                    if (message.transient !== undefined && message.hasOwnProperty("transient"))
                        writer.uint32(/* id 13, wireType 0 =*/104).bool(message.transient);
                    if (message.dt !== undefined && message.hasOwnProperty("dt"))
                        writer.uint32(/* id 14, wireType 2 =*/114).string(message.dt);
                    if (message.roomId !== undefined && message.hasOwnProperty("roomId"))
                        writer.uint32(/* id 15, wireType 2 =*/122).string(message.roomId);
                    if (message.pushData !== undefined && message.hasOwnProperty("pushData"))
                        writer.uint32(/* id 16, wireType 2 =*/130).string(message.pushData);
                    return writer;
                };
    
                /**
                 * Encodes the specified DirectCommand message, length delimited.
                 * @param {push_server.messages.DirectCommand|Object} message DirectCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DirectCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a DirectCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.DirectCommand} DirectCommand
                 */
                DirectCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.DirectCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.msg = reader.string();
                            break;
                        case 2:
                            message.uid = reader.string();
                            break;
                        case 3:
                            message.fromPeerId = reader.string();
                            break;
                        case 4:
                            message.timestamp = reader.int64();
                            break;
                        case 5:
                            message.offline = reader.bool();
                            break;
                        case 6:
                            message.hasMore = reader.bool();
                            break;
                        case 7:
                            if (!(message.toPeerIds && message.toPeerIds.length))
                                message.toPeerIds = [];
                            message.toPeerIds.push(reader.string());
                            break;
                        case 10:
                            message.r = reader.bool();
                            break;
                        case 11:
                            message.cid = reader.string();
                            break;
                        case 12:
                            message.id = reader.string();
                            break;
                        case 13:
                            message.transient = reader.bool();
                            break;
                        case 14:
                            message.dt = reader.string();
                            break;
                        case 15:
                            message.roomId = reader.string();
                            break;
                        case 16:
                            message.pushData = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a DirectCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.DirectCommand} DirectCommand
                 */
                DirectCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a DirectCommand message.
                 * @param {push_server.messages.DirectCommand|Object} message DirectCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                DirectCommand.verify = function verify(message) {    
                    if (message.msg !== undefined)
                        if (!$util.isString(message.msg))
                            return "msg: string expected";
                    if (message.uid !== undefined)
                        if (!$util.isString(message.uid))
                            return "uid: string expected";
                    if (message.fromPeerId !== undefined)
                        if (!$util.isString(message.fromPeerId))
                            return "fromPeerId: string expected";
                    if (message.timestamp !== undefined)
                        if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                            return "timestamp: integer|Long expected";
                    if (message.offline !== undefined)
                        if (typeof message.offline !== "boolean")
                            return "offline: boolean expected";
                    if (message.hasMore !== undefined)
                        if (typeof message.hasMore !== "boolean")
                            return "hasMore: boolean expected";
                    if (message.toPeerIds !== undefined) {
                        if (!Array.isArray(message.toPeerIds))
                            return "toPeerIds: array expected";
                        for (var i = 0; i < message.toPeerIds.length; ++i)
                            if (!$util.isString(message.toPeerIds[i]))
                                return "toPeerIds: string[] expected";
                    }
                    if (message.r !== undefined)
                        if (typeof message.r !== "boolean")
                            return "r: boolean expected";
                    if (message.cid !== undefined)
                        if (!$util.isString(message.cid))
                            return "cid: string expected";
                    if (message.id !== undefined)
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.transient !== undefined)
                        if (typeof message.transient !== "boolean")
                            return "transient: boolean expected";
                    if (message.dt !== undefined)
                        if (!$util.isString(message.dt))
                            return "dt: string expected";
                    if (message.roomId !== undefined)
                        if (!$util.isString(message.roomId))
                            return "roomId: string expected";
                    if (message.pushData !== undefined)
                        if (!$util.isString(message.pushData))
                            return "pushData: string expected";
                    return null;
                };
    
                /**
                 * Creates a DirectCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.DirectCommand} DirectCommand
                 */
                DirectCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.DirectCommand)
                        return object;
                    var message = new $root.push_server.messages.DirectCommand();
                    if (object.msg !== undefined && object.msg !== null)
                        message.msg = String(object.msg);
                    if (object.uid !== undefined && object.uid !== null)
                        message.uid = String(object.uid);
                    if (object.fromPeerId !== undefined && object.fromPeerId !== null)
                        message.fromPeerId = String(object.fromPeerId);
                    if (object.timestamp !== undefined && object.timestamp !== null)
                        if ($util.Long)
                            (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                        else if (typeof object.timestamp === "string")
                            message.timestamp = parseInt(object.timestamp, 10);
                        else if (typeof object.timestamp === "number")
                            message.timestamp = object.timestamp;
                        else if (typeof object.timestamp === "object")
                            message.timestamp = new $util.LongBits(object.timestamp.low, object.timestamp.high).toNumber();
                    if (object.offline !== undefined && object.offline !== null)
                        message.offline = Boolean(object.offline);
                    if (object.hasMore !== undefined && object.hasMore !== null)
                        message.hasMore = Boolean(object.hasMore);
                    if (object.toPeerIds) {
                        if (!Array.isArray(object.toPeerIds))
                            throw TypeError(".push_server.messages.DirectCommand.toPeerIds: array expected");
                        message.toPeerIds = [];
                        for (var i = 0; i < object.toPeerIds.length; ++i)
                            message.toPeerIds[i] = String(object.toPeerIds[i]);
                    }
                    if (object.r !== undefined && object.r !== null)
                        message.r = Boolean(object.r);
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    if (object.id !== undefined && object.id !== null)
                        message.id = String(object.id);
                    if (object.transient !== undefined && object.transient !== null)
                        message.transient = Boolean(object.transient);
                    if (object.dt !== undefined && object.dt !== null)
                        message.dt = String(object.dt);
                    if (object.roomId !== undefined && object.roomId !== null)
                        message.roomId = String(object.roomId);
                    if (object.pushData !== undefined && object.pushData !== null)
                        message.pushData = String(object.pushData);
                    return message;
                };
    
                /**
                 * Creates a DirectCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.DirectCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.DirectCommand} DirectCommand
                 */
                DirectCommand.from = DirectCommand.fromObject;
    
                /**
                 * Creates a plain object from a DirectCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.DirectCommand} message DirectCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DirectCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.toPeerIds = [];
                    if (options.defaults) {
                        object.msg = "";
                        object.uid = "";
                        object.fromPeerId = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.timestamp = options.longs === String ? "0" : 0;
                        object.offline = false;
                        object.hasMore = false;
                        object.r = false;
                        object.cid = "";
                        object.id = "";
                        object.transient = false;
                        object.dt = "";
                        object.roomId = "";
                        object.pushData = "";
                    }
                    if (message.msg !== undefined && message.msg !== null && message.hasOwnProperty("msg"))
                        object.msg = message.msg;
                    if (message.uid !== undefined && message.uid !== null && message.hasOwnProperty("uid"))
                        object.uid = message.uid;
                    if (message.fromPeerId !== undefined && message.fromPeerId !== null && message.hasOwnProperty("fromPeerId"))
                        object.fromPeerId = message.fromPeerId;
                    if (message.timestamp !== undefined && message.timestamp !== null && message.hasOwnProperty("timestamp"))
                        if (typeof message.timestamp === "number")
                            object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                        else
                            object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low, message.timestamp.high).toNumber() : message.timestamp;
                    if (message.offline !== undefined && message.offline !== null && message.hasOwnProperty("offline"))
                        object.offline = message.offline;
                    if (message.hasMore !== undefined && message.hasMore !== null && message.hasOwnProperty("hasMore"))
                        object.hasMore = message.hasMore;
                    if (message.toPeerIds !== undefined && message.toPeerIds !== null && message.hasOwnProperty("toPeerIds")) {
                        object.toPeerIds = [];
                        for (var j = 0; j < message.toPeerIds.length; ++j)
                            object.toPeerIds[j] = message.toPeerIds[j];
                    }
                    if (message.r !== undefined && message.r !== null && message.hasOwnProperty("r"))
                        object.r = message.r;
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    if (message.id !== undefined && message.id !== null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.transient !== undefined && message.transient !== null && message.hasOwnProperty("transient"))
                        object.transient = message.transient;
                    if (message.dt !== undefined && message.dt !== null && message.hasOwnProperty("dt"))
                        object.dt = message.dt;
                    if (message.roomId !== undefined && message.roomId !== null && message.hasOwnProperty("roomId"))
                        object.roomId = message.roomId;
                    if (message.pushData !== undefined && message.pushData !== null && message.hasOwnProperty("pushData"))
                        object.pushData = message.pushData;
                    return object;
                };
    
                /**
                 * Creates a plain object from this DirectCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DirectCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this DirectCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                DirectCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return DirectCommand;
            })();
    
            messages.AckCommand = (function() {
    
                /**
                 * Constructs a new AckCommand.
                 * @exports push_server.messages.AckCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function AckCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * AckCommand code.
                 * @type {number}
                 */
                AckCommand.prototype.code = 0;
    
                /**
                 * AckCommand reason.
                 * @type {string}
                 */
                AckCommand.prototype.reason = "";
    
                /**
                 * AckCommand mid.
                 * @type {string}
                 */
                AckCommand.prototype.mid = "";
    
                /**
                 * AckCommand cid.
                 * @type {string}
                 */
                AckCommand.prototype.cid = "";
    
                /**
                 * AckCommand t.
                 * @type {number|$protobuf.Long}
                 */
                AckCommand.prototype.t = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * AckCommand uid.
                 * @type {string}
                 */
                AckCommand.prototype.uid = "";
    
                /**
                 * AckCommand fromts.
                 * @type {number|$protobuf.Long}
                 */
                AckCommand.prototype.fromts = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * AckCommand tots.
                 * @type {number|$protobuf.Long}
                 */
                AckCommand.prototype.tots = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * AckCommand type.
                 * @type {string}
                 */
                AckCommand.prototype.type = "";
    
                /**
                 * AckCommand ids.
                 * @type {Array.<string>}
                 */
                AckCommand.prototype.ids = $util.emptyArray;
    
                /**
                 * AckCommand appCode.
                 * @type {number}
                 */
                AckCommand.prototype.appCode = 0;
    
                /**
                 * Creates a new AckCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.AckCommand} AckCommand instance
                 */
                AckCommand.create = function create(properties) {
                    return new AckCommand(properties);
                };
    
                /**
                 * Encodes the specified AckCommand message.
                 * @param {push_server.messages.AckCommand|Object} message AckCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AckCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.code !== undefined && message.hasOwnProperty("code"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
                    if (message.reason !== undefined && message.hasOwnProperty("reason"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.reason);
                    if (message.mid !== undefined && message.hasOwnProperty("mid"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.mid);
                    if (message.cid !== undefined && message.hasOwnProperty("cid"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.cid);
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int64(message.t);
                    if (message.uid !== undefined && message.hasOwnProperty("uid"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.uid);
                    if (message.fromts !== undefined && message.fromts !== null && message.hasOwnProperty("fromts"))
                        writer.uint32(/* id 7, wireType 0 =*/56).int64(message.fromts);
                    if (message.tots !== undefined && message.tots !== null && message.hasOwnProperty("tots"))
                        writer.uint32(/* id 8, wireType 0 =*/64).int64(message.tots);
                    if (message.type !== undefined && message.hasOwnProperty("type"))
                        writer.uint32(/* id 9, wireType 2 =*/74).string(message.type);
                    if (message.ids !== undefined && message.hasOwnProperty("ids"))
                        for (var i = 0; i < message.ids.length; ++i)
                            writer.uint32(/* id 10, wireType 2 =*/82).string(message.ids[i]);
                    if (message.appCode !== undefined && message.hasOwnProperty("appCode"))
                        writer.uint32(/* id 11, wireType 0 =*/88).int32(message.appCode);
                    return writer;
                };
    
                /**
                 * Encodes the specified AckCommand message, length delimited.
                 * @param {push_server.messages.AckCommand|Object} message AckCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AckCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an AckCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.AckCommand} AckCommand
                 */
                AckCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.AckCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.code = reader.int32();
                            break;
                        case 2:
                            message.reason = reader.string();
                            break;
                        case 3:
                            message.mid = reader.string();
                            break;
                        case 4:
                            message.cid = reader.string();
                            break;
                        case 5:
                            message.t = reader.int64();
                            break;
                        case 6:
                            message.uid = reader.string();
                            break;
                        case 7:
                            message.fromts = reader.int64();
                            break;
                        case 8:
                            message.tots = reader.int64();
                            break;
                        case 9:
                            message.type = reader.string();
                            break;
                        case 10:
                            if (!(message.ids && message.ids.length))
                                message.ids = [];
                            message.ids.push(reader.string());
                            break;
                        case 11:
                            message.appCode = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an AckCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.AckCommand} AckCommand
                 */
                AckCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an AckCommand message.
                 * @param {push_server.messages.AckCommand|Object} message AckCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                AckCommand.verify = function verify(message) {    
                    if (message.code !== undefined)
                        if (!$util.isInteger(message.code))
                            return "code: integer expected";
                    if (message.reason !== undefined)
                        if (!$util.isString(message.reason))
                            return "reason: string expected";
                    if (message.mid !== undefined)
                        if (!$util.isString(message.mid))
                            return "mid: string expected";
                    if (message.cid !== undefined)
                        if (!$util.isString(message.cid))
                            return "cid: string expected";
                    if (message.t !== undefined)
                        if (!$util.isInteger(message.t) && !(message.t && $util.isInteger(message.t.low) && $util.isInteger(message.t.high)))
                            return "t: integer|Long expected";
                    if (message.uid !== undefined)
                        if (!$util.isString(message.uid))
                            return "uid: string expected";
                    if (message.fromts !== undefined)
                        if (!$util.isInteger(message.fromts) && !(message.fromts && $util.isInteger(message.fromts.low) && $util.isInteger(message.fromts.high)))
                            return "fromts: integer|Long expected";
                    if (message.tots !== undefined)
                        if (!$util.isInteger(message.tots) && !(message.tots && $util.isInteger(message.tots.low) && $util.isInteger(message.tots.high)))
                            return "tots: integer|Long expected";
                    if (message.type !== undefined)
                        if (!$util.isString(message.type))
                            return "type: string expected";
                    if (message.ids !== undefined) {
                        if (!Array.isArray(message.ids))
                            return "ids: array expected";
                        for (var i = 0; i < message.ids.length; ++i)
                            if (!$util.isString(message.ids[i]))
                                return "ids: string[] expected";
                    }
                    if (message.appCode !== undefined)
                        if (!$util.isInteger(message.appCode))
                            return "appCode: integer expected";
                    return null;
                };
    
                /**
                 * Creates an AckCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.AckCommand} AckCommand
                 */
                AckCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.AckCommand)
                        return object;
                    var message = new $root.push_server.messages.AckCommand();
                    if (object.code !== undefined && object.code !== null)
                        message.code = object.code | 0;
                    if (object.reason !== undefined && object.reason !== null)
                        message.reason = String(object.reason);
                    if (object.mid !== undefined && object.mid !== null)
                        message.mid = String(object.mid);
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    if (object.t !== undefined && object.t !== null)
                        if ($util.Long)
                            (message.t = $util.Long.fromValue(object.t)).unsigned = false;
                        else if (typeof object.t === "string")
                            message.t = parseInt(object.t, 10);
                        else if (typeof object.t === "number")
                            message.t = object.t;
                        else if (typeof object.t === "object")
                            message.t = new $util.LongBits(object.t.low, object.t.high).toNumber();
                    if (object.uid !== undefined && object.uid !== null)
                        message.uid = String(object.uid);
                    if (object.fromts !== undefined && object.fromts !== null)
                        if ($util.Long)
                            (message.fromts = $util.Long.fromValue(object.fromts)).unsigned = false;
                        else if (typeof object.fromts === "string")
                            message.fromts = parseInt(object.fromts, 10);
                        else if (typeof object.fromts === "number")
                            message.fromts = object.fromts;
                        else if (typeof object.fromts === "object")
                            message.fromts = new $util.LongBits(object.fromts.low, object.fromts.high).toNumber();
                    if (object.tots !== undefined && object.tots !== null)
                        if ($util.Long)
                            (message.tots = $util.Long.fromValue(object.tots)).unsigned = false;
                        else if (typeof object.tots === "string")
                            message.tots = parseInt(object.tots, 10);
                        else if (typeof object.tots === "number")
                            message.tots = object.tots;
                        else if (typeof object.tots === "object")
                            message.tots = new $util.LongBits(object.tots.low, object.tots.high).toNumber();
                    if (object.type !== undefined && object.type !== null)
                        message.type = String(object.type);
                    if (object.ids) {
                        if (!Array.isArray(object.ids))
                            throw TypeError(".push_server.messages.AckCommand.ids: array expected");
                        message.ids = [];
                        for (var i = 0; i < object.ids.length; ++i)
                            message.ids[i] = String(object.ids[i]);
                    }
                    if (object.appCode !== undefined && object.appCode !== null)
                        message.appCode = object.appCode | 0;
                    return message;
                };
    
                /**
                 * Creates an AckCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.AckCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.AckCommand} AckCommand
                 */
                AckCommand.from = AckCommand.fromObject;
    
                /**
                 * Creates a plain object from an AckCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.AckCommand} message AckCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AckCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.ids = [];
                    if (options.defaults) {
                        object.code = 0;
                        object.reason = "";
                        object.mid = "";
                        object.cid = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.t = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.t = options.longs === String ? "0" : 0;
                        object.uid = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.fromts = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.fromts = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.tots = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.tots = options.longs === String ? "0" : 0;
                        object.type = "";
                        object.appCode = 0;
                    }
                    if (message.code !== undefined && message.code !== null && message.hasOwnProperty("code"))
                        object.code = message.code;
                    if (message.reason !== undefined && message.reason !== null && message.hasOwnProperty("reason"))
                        object.reason = message.reason;
                    if (message.mid !== undefined && message.mid !== null && message.hasOwnProperty("mid"))
                        object.mid = message.mid;
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        if (typeof message.t === "number")
                            object.t = options.longs === String ? String(message.t) : message.t;
                        else
                            object.t = options.longs === String ? $util.Long.prototype.toString.call(message.t) : options.longs === Number ? new $util.LongBits(message.t.low, message.t.high).toNumber() : message.t;
                    if (message.uid !== undefined && message.uid !== null && message.hasOwnProperty("uid"))
                        object.uid = message.uid;
                    if (message.fromts !== undefined && message.fromts !== null && message.hasOwnProperty("fromts"))
                        if (typeof message.fromts === "number")
                            object.fromts = options.longs === String ? String(message.fromts) : message.fromts;
                        else
                            object.fromts = options.longs === String ? $util.Long.prototype.toString.call(message.fromts) : options.longs === Number ? new $util.LongBits(message.fromts.low, message.fromts.high).toNumber() : message.fromts;
                    if (message.tots !== undefined && message.tots !== null && message.hasOwnProperty("tots"))
                        if (typeof message.tots === "number")
                            object.tots = options.longs === String ? String(message.tots) : message.tots;
                        else
                            object.tots = options.longs === String ? $util.Long.prototype.toString.call(message.tots) : options.longs === Number ? new $util.LongBits(message.tots.low, message.tots.high).toNumber() : message.tots;
                    if (message.type !== undefined && message.type !== null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    if (message.ids !== undefined && message.ids !== null && message.hasOwnProperty("ids")) {
                        object.ids = [];
                        for (var j = 0; j < message.ids.length; ++j)
                            object.ids[j] = message.ids[j];
                    }
                    if (message.appCode !== undefined && message.appCode !== null && message.hasOwnProperty("appCode"))
                        object.appCode = message.appCode;
                    return object;
                };
    
                /**
                 * Creates a plain object from this AckCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AckCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this AckCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                AckCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return AckCommand;
            })();
    
            messages.UnreadCommand = (function() {
    
                /**
                 * Constructs a new UnreadCommand.
                 * @exports push_server.messages.UnreadCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function UnreadCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * UnreadCommand convs.
                 * @type {Array.<push_server.messages.UnreadTuple>}
                 */
                UnreadCommand.prototype.convs = $util.emptyArray;
    
                // Lazily resolved type references
                var $types = {
                    0: "push_server.messages.UnreadTuple"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new UnreadCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.UnreadCommand} UnreadCommand instance
                 */
                UnreadCommand.create = function create(properties) {
                    return new UnreadCommand(properties);
                };
    
                /**
                 * Encodes the specified UnreadCommand message.
                 * @param {push_server.messages.UnreadCommand|Object} message UnreadCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UnreadCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.convs !== undefined && message.hasOwnProperty("convs"))
                        for (var i = 0; i < message.convs.length; ++i)
                            $types[0].encode(message.convs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified UnreadCommand message, length delimited.
                 * @param {push_server.messages.UnreadCommand|Object} message UnreadCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UnreadCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an UnreadCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.UnreadCommand} UnreadCommand
                 */
                UnreadCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.UnreadCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.convs && message.convs.length))
                                message.convs = [];
                            message.convs.push($types[0].decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an UnreadCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.UnreadCommand} UnreadCommand
                 */
                UnreadCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an UnreadCommand message.
                 * @param {push_server.messages.UnreadCommand|Object} message UnreadCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                UnreadCommand.verify = function verify(message) {    
                    if (message.convs !== undefined) {
                        if (!Array.isArray(message.convs))
                            return "convs: array expected";
                        for (var i = 0; i < message.convs.length; ++i) {
                            var error = $types[0].verify(message.convs[i]);
                            if (error)
                                return "convs." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates an UnreadCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.UnreadCommand} UnreadCommand
                 */
                UnreadCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.UnreadCommand)
                        return object;
                    var message = new $root.push_server.messages.UnreadCommand();
                    if (object.convs) {
                        if (!Array.isArray(object.convs))
                            throw TypeError(".push_server.messages.UnreadCommand.convs: array expected");
                        message.convs = [];
                        for (var i = 0; i < object.convs.length; ++i) {
                            if (typeof object.convs[i] !== "object")
                                throw TypeError(".push_server.messages.UnreadCommand.convs: object expected");
                            message.convs[i] = $types[0].fromObject(object.convs[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates an UnreadCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.UnreadCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.UnreadCommand} UnreadCommand
                 */
                UnreadCommand.from = UnreadCommand.fromObject;
    
                /**
                 * Creates a plain object from an UnreadCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.UnreadCommand} message UnreadCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UnreadCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.convs = [];
                    if (message.convs !== undefined && message.convs !== null && message.hasOwnProperty("convs")) {
                        object.convs = [];
                        for (var j = 0; j < message.convs.length; ++j)
                            object.convs[j] = $types[0].toObject(message.convs[j], options);
                    }
                    return object;
                };
    
                /**
                 * Creates a plain object from this UnreadCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UnreadCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this UnreadCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                UnreadCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return UnreadCommand;
            })();
    
            messages.ConvCommand = (function() {
    
                /**
                 * Constructs a new ConvCommand.
                 * @exports push_server.messages.ConvCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ConvCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ConvCommand m.
                 * @type {Array.<string>}
                 */
                ConvCommand.prototype.m = $util.emptyArray;
    
                /**
                 * ConvCommand transient.
                 * @type {boolean}
                 */
                ConvCommand.prototype.transient = false;
    
                /**
                 * ConvCommand unique.
                 * @type {boolean}
                 */
                ConvCommand.prototype.unique = false;
    
                /**
                 * ConvCommand cid.
                 * @type {string}
                 */
                ConvCommand.prototype.cid = "";
    
                /**
                 * ConvCommand cdate.
                 * @type {string}
                 */
                ConvCommand.prototype.cdate = "";
    
                /**
                 * ConvCommand initBy.
                 * @type {string}
                 */
                ConvCommand.prototype.initBy = "";
    
                /**
                 * ConvCommand sort.
                 * @type {string}
                 */
                ConvCommand.prototype.sort = "";
    
                /**
                 * ConvCommand limit.
                 * @type {number}
                 */
                ConvCommand.prototype.limit = 0;
    
                /**
                 * ConvCommand skip.
                 * @type {number}
                 */
                ConvCommand.prototype.skip = 0;
    
                /**
                 * ConvCommand flag.
                 * @type {number}
                 */
                ConvCommand.prototype.flag = 0;
    
                /**
                 * ConvCommand count.
                 * @type {number}
                 */
                ConvCommand.prototype.count = 0;
    
                /**
                 * ConvCommand udate.
                 * @type {string}
                 */
                ConvCommand.prototype.udate = "";
    
                /**
                 * ConvCommand t.
                 * @type {number|$protobuf.Long}
                 */
                ConvCommand.prototype.t = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ConvCommand n.
                 * @type {string}
                 */
                ConvCommand.prototype.n = "";
    
                /**
                 * ConvCommand s.
                 * @type {string}
                 */
                ConvCommand.prototype.s = "";
    
                /**
                 * ConvCommand statusSub.
                 * @type {boolean}
                 */
                ConvCommand.prototype.statusSub = false;
    
                /**
                 * ConvCommand statusPub.
                 * @type {boolean}
                 */
                ConvCommand.prototype.statusPub = false;
    
                /**
                 * ConvCommand statusTTL.
                 * @type {number}
                 */
                ConvCommand.prototype.statusTTL = 0;
    
                /**
                 * ConvCommand members.
                 * @type {Array.<string>}
                 */
                ConvCommand.prototype.members = $util.emptyArray;
    
                /**
                 * ConvCommand results.
                 * @type {push_server.messages.JsonObjectMessage}
                 */
                ConvCommand.prototype.results = null;
    
                /**
                 * ConvCommand where.
                 * @type {push_server.messages.JsonObjectMessage}
                 */
                ConvCommand.prototype.where = null;
    
                /**
                 * ConvCommand attr.
                 * @type {push_server.messages.JsonObjectMessage}
                 */
                ConvCommand.prototype.attr = null;
    
                // Lazily resolved type references
                var $types = {
                    19: "push_server.messages.JsonObjectMessage",
                    20: "push_server.messages.JsonObjectMessage",
                    21: "push_server.messages.JsonObjectMessage"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new ConvCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.ConvCommand} ConvCommand instance
                 */
                ConvCommand.create = function create(properties) {
                    return new ConvCommand(properties);
                };
    
                /**
                 * Encodes the specified ConvCommand message.
                 * @param {push_server.messages.ConvCommand|Object} message ConvCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConvCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.m !== undefined && message.hasOwnProperty("m"))
                        for (var i = 0; i < message.m.length; ++i)
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.m[i]);
                    if (message.transient !== undefined && message.hasOwnProperty("transient"))
                        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.transient);
                    if (message.unique !== undefined && message.hasOwnProperty("unique"))
                        writer.uint32(/* id 3, wireType 0 =*/24).bool(message.unique);
                    if (message.cid !== undefined && message.hasOwnProperty("cid"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.cid);
                    if (message.cdate !== undefined && message.hasOwnProperty("cdate"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.cdate);
                    if (message.initBy !== undefined && message.hasOwnProperty("initBy"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.initBy);
                    if (message.sort !== undefined && message.hasOwnProperty("sort"))
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.sort);
                    if (message.limit !== undefined && message.hasOwnProperty("limit"))
                        writer.uint32(/* id 8, wireType 0 =*/64).int32(message.limit);
                    if (message.skip !== undefined && message.hasOwnProperty("skip"))
                        writer.uint32(/* id 9, wireType 0 =*/72).int32(message.skip);
                    if (message.flag !== undefined && message.hasOwnProperty("flag"))
                        writer.uint32(/* id 10, wireType 0 =*/80).int32(message.flag);
                    if (message.count !== undefined && message.hasOwnProperty("count"))
                        writer.uint32(/* id 11, wireType 0 =*/88).int32(message.count);
                    if (message.udate !== undefined && message.hasOwnProperty("udate"))
                        writer.uint32(/* id 12, wireType 2 =*/98).string(message.udate);
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        writer.uint32(/* id 13, wireType 0 =*/104).int64(message.t);
                    if (message.n !== undefined && message.hasOwnProperty("n"))
                        writer.uint32(/* id 14, wireType 2 =*/114).string(message.n);
                    if (message.s !== undefined && message.hasOwnProperty("s"))
                        writer.uint32(/* id 15, wireType 2 =*/122).string(message.s);
                    if (message.statusSub !== undefined && message.hasOwnProperty("statusSub"))
                        writer.uint32(/* id 16, wireType 0 =*/128).bool(message.statusSub);
                    if (message.statusPub !== undefined && message.hasOwnProperty("statusPub"))
                        writer.uint32(/* id 17, wireType 0 =*/136).bool(message.statusPub);
                    if (message.statusTTL !== undefined && message.hasOwnProperty("statusTTL"))
                        writer.uint32(/* id 18, wireType 0 =*/144).int32(message.statusTTL);
                    if (message.members !== undefined && message.hasOwnProperty("members"))
                        for (var i = 0; i < message.members.length; ++i)
                            writer.uint32(/* id 19, wireType 2 =*/154).string(message.members[i]);
                    if (message.results && message.hasOwnProperty("results"))
                        $types[19].encode(message.results, writer.uint32(/* id 100, wireType 2 =*/802).fork()).ldelim();
                    if (message.where && message.hasOwnProperty("where"))
                        $types[20].encode(message.where, writer.uint32(/* id 101, wireType 2 =*/810).fork()).ldelim();
                    if (message.attr && message.hasOwnProperty("attr"))
                        $types[21].encode(message.attr, writer.uint32(/* id 103, wireType 2 =*/826).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified ConvCommand message, length delimited.
                 * @param {push_server.messages.ConvCommand|Object} message ConvCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConvCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ConvCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.ConvCommand} ConvCommand
                 */
                ConvCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.ConvCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.m && message.m.length))
                                message.m = [];
                            message.m.push(reader.string());
                            break;
                        case 2:
                            message.transient = reader.bool();
                            break;
                        case 3:
                            message.unique = reader.bool();
                            break;
                        case 4:
                            message.cid = reader.string();
                            break;
                        case 5:
                            message.cdate = reader.string();
                            break;
                        case 6:
                            message.initBy = reader.string();
                            break;
                        case 7:
                            message.sort = reader.string();
                            break;
                        case 8:
                            message.limit = reader.int32();
                            break;
                        case 9:
                            message.skip = reader.int32();
                            break;
                        case 10:
                            message.flag = reader.int32();
                            break;
                        case 11:
                            message.count = reader.int32();
                            break;
                        case 12:
                            message.udate = reader.string();
                            break;
                        case 13:
                            message.t = reader.int64();
                            break;
                        case 14:
                            message.n = reader.string();
                            break;
                        case 15:
                            message.s = reader.string();
                            break;
                        case 16:
                            message.statusSub = reader.bool();
                            break;
                        case 17:
                            message.statusPub = reader.bool();
                            break;
                        case 18:
                            message.statusTTL = reader.int32();
                            break;
                        case 19:
                            if (!(message.members && message.members.length))
                                message.members = [];
                            message.members.push(reader.string());
                            break;
                        case 100:
                            message.results = $types[19].decode(reader, reader.uint32());
                            break;
                        case 101:
                            message.where = $types[20].decode(reader, reader.uint32());
                            break;
                        case 103:
                            message.attr = $types[21].decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ConvCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.ConvCommand} ConvCommand
                 */
                ConvCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ConvCommand message.
                 * @param {push_server.messages.ConvCommand|Object} message ConvCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ConvCommand.verify = function verify(message) {    
                    if (message.m !== undefined) {
                        if (!Array.isArray(message.m))
                            return "m: array expected";
                        for (var i = 0; i < message.m.length; ++i)
                            if (!$util.isString(message.m[i]))
                                return "m: string[] expected";
                    }
                    if (message.transient !== undefined)
                        if (typeof message.transient !== "boolean")
                            return "transient: boolean expected";
                    if (message.unique !== undefined)
                        if (typeof message.unique !== "boolean")
                            return "unique: boolean expected";
                    if (message.cid !== undefined)
                        if (!$util.isString(message.cid))
                            return "cid: string expected";
                    if (message.cdate !== undefined)
                        if (!$util.isString(message.cdate))
                            return "cdate: string expected";
                    if (message.initBy !== undefined)
                        if (!$util.isString(message.initBy))
                            return "initBy: string expected";
                    if (message.sort !== undefined)
                        if (!$util.isString(message.sort))
                            return "sort: string expected";
                    if (message.limit !== undefined)
                        if (!$util.isInteger(message.limit))
                            return "limit: integer expected";
                    if (message.skip !== undefined)
                        if (!$util.isInteger(message.skip))
                            return "skip: integer expected";
                    if (message.flag !== undefined)
                        if (!$util.isInteger(message.flag))
                            return "flag: integer expected";
                    if (message.count !== undefined)
                        if (!$util.isInteger(message.count))
                            return "count: integer expected";
                    if (message.udate !== undefined)
                        if (!$util.isString(message.udate))
                            return "udate: string expected";
                    if (message.t !== undefined)
                        if (!$util.isInteger(message.t) && !(message.t && $util.isInteger(message.t.low) && $util.isInteger(message.t.high)))
                            return "t: integer|Long expected";
                    if (message.n !== undefined)
                        if (!$util.isString(message.n))
                            return "n: string expected";
                    if (message.s !== undefined)
                        if (!$util.isString(message.s))
                            return "s: string expected";
                    if (message.statusSub !== undefined)
                        if (typeof message.statusSub !== "boolean")
                            return "statusSub: boolean expected";
                    if (message.statusPub !== undefined)
                        if (typeof message.statusPub !== "boolean")
                            return "statusPub: boolean expected";
                    if (message.statusTTL !== undefined)
                        if (!$util.isInteger(message.statusTTL))
                            return "statusTTL: integer expected";
                    if (message.members !== undefined) {
                        if (!Array.isArray(message.members))
                            return "members: array expected";
                        for (var i = 0; i < message.members.length; ++i)
                            if (!$util.isString(message.members[i]))
                                return "members: string[] expected";
                    }
                    if (message.results !== undefined && message.results !== null) {
                        var error = $types[19].verify(message.results);
                        if (error)
                            return "results." + error;
                    }
                    if (message.where !== undefined && message.where !== null) {
                        var error = $types[20].verify(message.where);
                        if (error)
                            return "where." + error;
                    }
                    if (message.attr !== undefined && message.attr !== null) {
                        var error = $types[21].verify(message.attr);
                        if (error)
                            return "attr." + error;
                    }
                    return null;
                };
    
                /**
                 * Creates a ConvCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ConvCommand} ConvCommand
                 */
                ConvCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.ConvCommand)
                        return object;
                    var message = new $root.push_server.messages.ConvCommand();
                    if (object.m) {
                        if (!Array.isArray(object.m))
                            throw TypeError(".push_server.messages.ConvCommand.m: array expected");
                        message.m = [];
                        for (var i = 0; i < object.m.length; ++i)
                            message.m[i] = String(object.m[i]);
                    }
                    if (object.transient !== undefined && object.transient !== null)
                        message.transient = Boolean(object.transient);
                    if (object.unique !== undefined && object.unique !== null)
                        message.unique = Boolean(object.unique);
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    if (object.cdate !== undefined && object.cdate !== null)
                        message.cdate = String(object.cdate);
                    if (object.initBy !== undefined && object.initBy !== null)
                        message.initBy = String(object.initBy);
                    if (object.sort !== undefined && object.sort !== null)
                        message.sort = String(object.sort);
                    if (object.limit !== undefined && object.limit !== null)
                        message.limit = object.limit | 0;
                    if (object.skip !== undefined && object.skip !== null)
                        message.skip = object.skip | 0;
                    if (object.flag !== undefined && object.flag !== null)
                        message.flag = object.flag | 0;
                    if (object.count !== undefined && object.count !== null)
                        message.count = object.count | 0;
                    if (object.udate !== undefined && object.udate !== null)
                        message.udate = String(object.udate);
                    if (object.t !== undefined && object.t !== null)
                        if ($util.Long)
                            (message.t = $util.Long.fromValue(object.t)).unsigned = false;
                        else if (typeof object.t === "string")
                            message.t = parseInt(object.t, 10);
                        else if (typeof object.t === "number")
                            message.t = object.t;
                        else if (typeof object.t === "object")
                            message.t = new $util.LongBits(object.t.low, object.t.high).toNumber();
                    if (object.n !== undefined && object.n !== null)
                        message.n = String(object.n);
                    if (object.s !== undefined && object.s !== null)
                        message.s = String(object.s);
                    if (object.statusSub !== undefined && object.statusSub !== null)
                        message.statusSub = Boolean(object.statusSub);
                    if (object.statusPub !== undefined && object.statusPub !== null)
                        message.statusPub = Boolean(object.statusPub);
                    if (object.statusTTL !== undefined && object.statusTTL !== null)
                        message.statusTTL = object.statusTTL | 0;
                    if (object.members) {
                        if (!Array.isArray(object.members))
                            throw TypeError(".push_server.messages.ConvCommand.members: array expected");
                        message.members = [];
                        for (var i = 0; i < object.members.length; ++i)
                            message.members[i] = String(object.members[i]);
                    }
                    if (object.results !== undefined && object.results !== null) {
                        if (typeof object.results !== "object")
                            throw TypeError(".push_server.messages.ConvCommand.results: object expected");
                        message.results = $types[19].fromObject(object.results);
                    }
                    if (object.where !== undefined && object.where !== null) {
                        if (typeof object.where !== "object")
                            throw TypeError(".push_server.messages.ConvCommand.where: object expected");
                        message.where = $types[20].fromObject(object.where);
                    }
                    if (object.attr !== undefined && object.attr !== null) {
                        if (typeof object.attr !== "object")
                            throw TypeError(".push_server.messages.ConvCommand.attr: object expected");
                        message.attr = $types[21].fromObject(object.attr);
                    }
                    return message;
                };
    
                /**
                 * Creates a ConvCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.ConvCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ConvCommand} ConvCommand
                 */
                ConvCommand.from = ConvCommand.fromObject;
    
                /**
                 * Creates a plain object from a ConvCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.ConvCommand} message ConvCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ConvCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.m = [];
                        object.members = [];
                    }
                    if (options.defaults) {
                        object.transient = false;
                        object.unique = false;
                        object.cid = "";
                        object.cdate = "";
                        object.initBy = "";
                        object.sort = "";
                        object.limit = 0;
                        object.skip = 0;
                        object.flag = 0;
                        object.count = 0;
                        object.udate = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.t = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.t = options.longs === String ? "0" : 0;
                        object.n = "";
                        object.s = "";
                        object.statusSub = false;
                        object.statusPub = false;
                        object.statusTTL = 0;
                        object.results = null;
                        object.where = null;
                        object.attr = null;
                    }
                    if (message.m !== undefined && message.m !== null && message.hasOwnProperty("m")) {
                        object.m = [];
                        for (var j = 0; j < message.m.length; ++j)
                            object.m[j] = message.m[j];
                    }
                    if (message.transient !== undefined && message.transient !== null && message.hasOwnProperty("transient"))
                        object.transient = message.transient;
                    if (message.unique !== undefined && message.unique !== null && message.hasOwnProperty("unique"))
                        object.unique = message.unique;
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    if (message.cdate !== undefined && message.cdate !== null && message.hasOwnProperty("cdate"))
                        object.cdate = message.cdate;
                    if (message.initBy !== undefined && message.initBy !== null && message.hasOwnProperty("initBy"))
                        object.initBy = message.initBy;
                    if (message.sort !== undefined && message.sort !== null && message.hasOwnProperty("sort"))
                        object.sort = message.sort;
                    if (message.limit !== undefined && message.limit !== null && message.hasOwnProperty("limit"))
                        object.limit = message.limit;
                    if (message.skip !== undefined && message.skip !== null && message.hasOwnProperty("skip"))
                        object.skip = message.skip;
                    if (message.flag !== undefined && message.flag !== null && message.hasOwnProperty("flag"))
                        object.flag = message.flag;
                    if (message.count !== undefined && message.count !== null && message.hasOwnProperty("count"))
                        object.count = message.count;
                    if (message.udate !== undefined && message.udate !== null && message.hasOwnProperty("udate"))
                        object.udate = message.udate;
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        if (typeof message.t === "number")
                            object.t = options.longs === String ? String(message.t) : message.t;
                        else
                            object.t = options.longs === String ? $util.Long.prototype.toString.call(message.t) : options.longs === Number ? new $util.LongBits(message.t.low, message.t.high).toNumber() : message.t;
                    if (message.n !== undefined && message.n !== null && message.hasOwnProperty("n"))
                        object.n = message.n;
                    if (message.s !== undefined && message.s !== null && message.hasOwnProperty("s"))
                        object.s = message.s;
                    if (message.statusSub !== undefined && message.statusSub !== null && message.hasOwnProperty("statusSub"))
                        object.statusSub = message.statusSub;
                    if (message.statusPub !== undefined && message.statusPub !== null && message.hasOwnProperty("statusPub"))
                        object.statusPub = message.statusPub;
                    if (message.statusTTL !== undefined && message.statusTTL !== null && message.hasOwnProperty("statusTTL"))
                        object.statusTTL = message.statusTTL;
                    if (message.members !== undefined && message.members !== null && message.hasOwnProperty("members")) {
                        object.members = [];
                        for (var j = 0; j < message.members.length; ++j)
                            object.members[j] = message.members[j];
                    }
                    if (message.results !== undefined && message.results !== null && message.hasOwnProperty("results"))
                        object.results = $types[19].toObject(message.results, options);
                    if (message.where !== undefined && message.where !== null && message.hasOwnProperty("where"))
                        object.where = $types[20].toObject(message.where, options);
                    if (message.attr !== undefined && message.attr !== null && message.hasOwnProperty("attr"))
                        object.attr = $types[21].toObject(message.attr, options);
                    return object;
                };
    
                /**
                 * Creates a plain object from this ConvCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ConvCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this ConvCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ConvCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ConvCommand;
            })();
    
            messages.RoomCommand = (function() {
    
                /**
                 * Constructs a new RoomCommand.
                 * @exports push_server.messages.RoomCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function RoomCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * RoomCommand roomId.
                 * @type {string}
                 */
                RoomCommand.prototype.roomId = "";
    
                /**
                 * RoomCommand s.
                 * @type {string}
                 */
                RoomCommand.prototype.s = "";
    
                /**
                 * RoomCommand t.
                 * @type {number|$protobuf.Long}
                 */
                RoomCommand.prototype.t = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * RoomCommand n.
                 * @type {string}
                 */
                RoomCommand.prototype.n = "";
    
                /**
                 * RoomCommand transient.
                 * @type {boolean}
                 */
                RoomCommand.prototype.transient = false;
    
                /**
                 * RoomCommand roomPeerIds.
                 * @type {Array.<string>}
                 */
                RoomCommand.prototype.roomPeerIds = $util.emptyArray;
    
                /**
                 * RoomCommand byPeerId.
                 * @type {string}
                 */
                RoomCommand.prototype.byPeerId = "";
    
                /**
                 * Creates a new RoomCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.RoomCommand} RoomCommand instance
                 */
                RoomCommand.create = function create(properties) {
                    return new RoomCommand(properties);
                };
    
                /**
                 * Encodes the specified RoomCommand message.
                 * @param {push_server.messages.RoomCommand|Object} message RoomCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RoomCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.roomId !== undefined && message.hasOwnProperty("roomId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
                    if (message.s !== undefined && message.hasOwnProperty("s"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.s);
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int64(message.t);
                    if (message.n !== undefined && message.hasOwnProperty("n"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.n);
                    if (message.transient !== undefined && message.hasOwnProperty("transient"))
                        writer.uint32(/* id 5, wireType 0 =*/40).bool(message.transient);
                    if (message.roomPeerIds !== undefined && message.hasOwnProperty("roomPeerIds"))
                        for (var i = 0; i < message.roomPeerIds.length; ++i)
                            writer.uint32(/* id 6, wireType 2 =*/50).string(message.roomPeerIds[i]);
                    if (message.byPeerId !== undefined && message.hasOwnProperty("byPeerId"))
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.byPeerId);
                    return writer;
                };
    
                /**
                 * Encodes the specified RoomCommand message, length delimited.
                 * @param {push_server.messages.RoomCommand|Object} message RoomCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RoomCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a RoomCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.RoomCommand} RoomCommand
                 */
                RoomCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.RoomCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.roomId = reader.string();
                            break;
                        case 2:
                            message.s = reader.string();
                            break;
                        case 3:
                            message.t = reader.int64();
                            break;
                        case 4:
                            message.n = reader.string();
                            break;
                        case 5:
                            message.transient = reader.bool();
                            break;
                        case 6:
                            if (!(message.roomPeerIds && message.roomPeerIds.length))
                                message.roomPeerIds = [];
                            message.roomPeerIds.push(reader.string());
                            break;
                        case 7:
                            message.byPeerId = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a RoomCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.RoomCommand} RoomCommand
                 */
                RoomCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a RoomCommand message.
                 * @param {push_server.messages.RoomCommand|Object} message RoomCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                RoomCommand.verify = function verify(message) {    
                    if (message.roomId !== undefined)
                        if (!$util.isString(message.roomId))
                            return "roomId: string expected";
                    if (message.s !== undefined)
                        if (!$util.isString(message.s))
                            return "s: string expected";
                    if (message.t !== undefined)
                        if (!$util.isInteger(message.t) && !(message.t && $util.isInteger(message.t.low) && $util.isInteger(message.t.high)))
                            return "t: integer|Long expected";
                    if (message.n !== undefined)
                        if (!$util.isString(message.n))
                            return "n: string expected";
                    if (message.transient !== undefined)
                        if (typeof message.transient !== "boolean")
                            return "transient: boolean expected";
                    if (message.roomPeerIds !== undefined) {
                        if (!Array.isArray(message.roomPeerIds))
                            return "roomPeerIds: array expected";
                        for (var i = 0; i < message.roomPeerIds.length; ++i)
                            if (!$util.isString(message.roomPeerIds[i]))
                                return "roomPeerIds: string[] expected";
                    }
                    if (message.byPeerId !== undefined)
                        if (!$util.isString(message.byPeerId))
                            return "byPeerId: string expected";
                    return null;
                };
    
                /**
                 * Creates a RoomCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.RoomCommand} RoomCommand
                 */
                RoomCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.RoomCommand)
                        return object;
                    var message = new $root.push_server.messages.RoomCommand();
                    if (object.roomId !== undefined && object.roomId !== null)
                        message.roomId = String(object.roomId);
                    if (object.s !== undefined && object.s !== null)
                        message.s = String(object.s);
                    if (object.t !== undefined && object.t !== null)
                        if ($util.Long)
                            (message.t = $util.Long.fromValue(object.t)).unsigned = false;
                        else if (typeof object.t === "string")
                            message.t = parseInt(object.t, 10);
                        else if (typeof object.t === "number")
                            message.t = object.t;
                        else if (typeof object.t === "object")
                            message.t = new $util.LongBits(object.t.low, object.t.high).toNumber();
                    if (object.n !== undefined && object.n !== null)
                        message.n = String(object.n);
                    if (object.transient !== undefined && object.transient !== null)
                        message.transient = Boolean(object.transient);
                    if (object.roomPeerIds) {
                        if (!Array.isArray(object.roomPeerIds))
                            throw TypeError(".push_server.messages.RoomCommand.roomPeerIds: array expected");
                        message.roomPeerIds = [];
                        for (var i = 0; i < object.roomPeerIds.length; ++i)
                            message.roomPeerIds[i] = String(object.roomPeerIds[i]);
                    }
                    if (object.byPeerId !== undefined && object.byPeerId !== null)
                        message.byPeerId = String(object.byPeerId);
                    return message;
                };
    
                /**
                 * Creates a RoomCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.RoomCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.RoomCommand} RoomCommand
                 */
                RoomCommand.from = RoomCommand.fromObject;
    
                /**
                 * Creates a plain object from a RoomCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.RoomCommand} message RoomCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                RoomCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.roomPeerIds = [];
                    if (options.defaults) {
                        object.roomId = "";
                        object.s = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.t = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.t = options.longs === String ? "0" : 0;
                        object.n = "";
                        object.transient = false;
                        object.byPeerId = "";
                    }
                    if (message.roomId !== undefined && message.roomId !== null && message.hasOwnProperty("roomId"))
                        object.roomId = message.roomId;
                    if (message.s !== undefined && message.s !== null && message.hasOwnProperty("s"))
                        object.s = message.s;
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        if (typeof message.t === "number")
                            object.t = options.longs === String ? String(message.t) : message.t;
                        else
                            object.t = options.longs === String ? $util.Long.prototype.toString.call(message.t) : options.longs === Number ? new $util.LongBits(message.t.low, message.t.high).toNumber() : message.t;
                    if (message.n !== undefined && message.n !== null && message.hasOwnProperty("n"))
                        object.n = message.n;
                    if (message.transient !== undefined && message.transient !== null && message.hasOwnProperty("transient"))
                        object.transient = message.transient;
                    if (message.roomPeerIds !== undefined && message.roomPeerIds !== null && message.hasOwnProperty("roomPeerIds")) {
                        object.roomPeerIds = [];
                        for (var j = 0; j < message.roomPeerIds.length; ++j)
                            object.roomPeerIds[j] = message.roomPeerIds[j];
                    }
                    if (message.byPeerId !== undefined && message.byPeerId !== null && message.hasOwnProperty("byPeerId"))
                        object.byPeerId = message.byPeerId;
                    return object;
                };
    
                /**
                 * Creates a plain object from this RoomCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                RoomCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this RoomCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                RoomCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return RoomCommand;
            })();
    
            messages.LogsCommand = (function() {
    
                /**
                 * Constructs a new LogsCommand.
                 * @exports push_server.messages.LogsCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function LogsCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * LogsCommand cid.
                 * @type {string}
                 */
                LogsCommand.prototype.cid = "";
    
                /**
                 * LogsCommand l.
                 * @type {number}
                 */
                LogsCommand.prototype.l = 0;
    
                /**
                 * LogsCommand limit.
                 * @type {number}
                 */
                LogsCommand.prototype.limit = 0;
    
                /**
                 * LogsCommand t.
                 * @type {number|$protobuf.Long}
                 */
                LogsCommand.prototype.t = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * LogsCommand tt.
                 * @type {number|$protobuf.Long}
                 */
                LogsCommand.prototype.tt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * LogsCommand tmid.
                 * @type {string}
                 */
                LogsCommand.prototype.tmid = "";
    
                /**
                 * LogsCommand mid.
                 * @type {string}
                 */
                LogsCommand.prototype.mid = "";
    
                /**
                 * LogsCommand checksum.
                 * @type {string}
                 */
                LogsCommand.prototype.checksum = "";
    
                /**
                 * LogsCommand stored.
                 * @type {boolean}
                 */
                LogsCommand.prototype.stored = false;
    
                /**
                 * LogsCommand logs.
                 * @type {Array.<push_server.messages.LogItem>}
                 */
                LogsCommand.prototype.logs = $util.emptyArray;
    
                // Lazily resolved type references
                var $types = {
                    9: "push_server.messages.LogItem"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new LogsCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.LogsCommand} LogsCommand instance
                 */
                LogsCommand.create = function create(properties) {
                    return new LogsCommand(properties);
                };
    
                /**
                 * Encodes the specified LogsCommand message.
                 * @param {push_server.messages.LogsCommand|Object} message LogsCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LogsCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.cid !== undefined && message.hasOwnProperty("cid"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
                    if (message.l !== undefined && message.hasOwnProperty("l"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.l);
                    if (message.limit !== undefined && message.hasOwnProperty("limit"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.limit);
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int64(message.t);
                    if (message.tt !== undefined && message.tt !== null && message.hasOwnProperty("tt"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int64(message.tt);
                    if (message.tmid !== undefined && message.hasOwnProperty("tmid"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.tmid);
                    if (message.mid !== undefined && message.hasOwnProperty("mid"))
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.mid);
                    if (message.checksum !== undefined && message.hasOwnProperty("checksum"))
                        writer.uint32(/* id 8, wireType 2 =*/66).string(message.checksum);
                    if (message.stored !== undefined && message.hasOwnProperty("stored"))
                        writer.uint32(/* id 9, wireType 0 =*/72).bool(message.stored);
                    if (message.logs !== undefined && message.hasOwnProperty("logs"))
                        for (var i = 0; i < message.logs.length; ++i)
                            $types[9].encode(message.logs[i], writer.uint32(/* id 105, wireType 2 =*/842).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified LogsCommand message, length delimited.
                 * @param {push_server.messages.LogsCommand|Object} message LogsCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LogsCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a LogsCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.LogsCommand} LogsCommand
                 */
                LogsCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.LogsCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.cid = reader.string();
                            break;
                        case 2:
                            message.l = reader.int32();
                            break;
                        case 3:
                            message.limit = reader.int32();
                            break;
                        case 4:
                            message.t = reader.int64();
                            break;
                        case 5:
                            message.tt = reader.int64();
                            break;
                        case 6:
                            message.tmid = reader.string();
                            break;
                        case 7:
                            message.mid = reader.string();
                            break;
                        case 8:
                            message.checksum = reader.string();
                            break;
                        case 9:
                            message.stored = reader.bool();
                            break;
                        case 105:
                            if (!(message.logs && message.logs.length))
                                message.logs = [];
                            message.logs.push($types[9].decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a LogsCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.LogsCommand} LogsCommand
                 */
                LogsCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a LogsCommand message.
                 * @param {push_server.messages.LogsCommand|Object} message LogsCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                LogsCommand.verify = function verify(message) {    
                    if (message.cid !== undefined)
                        if (!$util.isString(message.cid))
                            return "cid: string expected";
                    if (message.l !== undefined)
                        if (!$util.isInteger(message.l))
                            return "l: integer expected";
                    if (message.limit !== undefined)
                        if (!$util.isInteger(message.limit))
                            return "limit: integer expected";
                    if (message.t !== undefined)
                        if (!$util.isInteger(message.t) && !(message.t && $util.isInteger(message.t.low) && $util.isInteger(message.t.high)))
                            return "t: integer|Long expected";
                    if (message.tt !== undefined)
                        if (!$util.isInteger(message.tt) && !(message.tt && $util.isInteger(message.tt.low) && $util.isInteger(message.tt.high)))
                            return "tt: integer|Long expected";
                    if (message.tmid !== undefined)
                        if (!$util.isString(message.tmid))
                            return "tmid: string expected";
                    if (message.mid !== undefined)
                        if (!$util.isString(message.mid))
                            return "mid: string expected";
                    if (message.checksum !== undefined)
                        if (!$util.isString(message.checksum))
                            return "checksum: string expected";
                    if (message.stored !== undefined)
                        if (typeof message.stored !== "boolean")
                            return "stored: boolean expected";
                    if (message.logs !== undefined) {
                        if (!Array.isArray(message.logs))
                            return "logs: array expected";
                        for (var i = 0; i < message.logs.length; ++i) {
                            var error = $types[9].verify(message.logs[i]);
                            if (error)
                                return "logs." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a LogsCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.LogsCommand} LogsCommand
                 */
                LogsCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.LogsCommand)
                        return object;
                    var message = new $root.push_server.messages.LogsCommand();
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    if (object.l !== undefined && object.l !== null)
                        message.l = object.l | 0;
                    if (object.limit !== undefined && object.limit !== null)
                        message.limit = object.limit | 0;
                    if (object.t !== undefined && object.t !== null)
                        if ($util.Long)
                            (message.t = $util.Long.fromValue(object.t)).unsigned = false;
                        else if (typeof object.t === "string")
                            message.t = parseInt(object.t, 10);
                        else if (typeof object.t === "number")
                            message.t = object.t;
                        else if (typeof object.t === "object")
                            message.t = new $util.LongBits(object.t.low, object.t.high).toNumber();
                    if (object.tt !== undefined && object.tt !== null)
                        if ($util.Long)
                            (message.tt = $util.Long.fromValue(object.tt)).unsigned = false;
                        else if (typeof object.tt === "string")
                            message.tt = parseInt(object.tt, 10);
                        else if (typeof object.tt === "number")
                            message.tt = object.tt;
                        else if (typeof object.tt === "object")
                            message.tt = new $util.LongBits(object.tt.low, object.tt.high).toNumber();
                    if (object.tmid !== undefined && object.tmid !== null)
                        message.tmid = String(object.tmid);
                    if (object.mid !== undefined && object.mid !== null)
                        message.mid = String(object.mid);
                    if (object.checksum !== undefined && object.checksum !== null)
                        message.checksum = String(object.checksum);
                    if (object.stored !== undefined && object.stored !== null)
                        message.stored = Boolean(object.stored);
                    if (object.logs) {
                        if (!Array.isArray(object.logs))
                            throw TypeError(".push_server.messages.LogsCommand.logs: array expected");
                        message.logs = [];
                        for (var i = 0; i < object.logs.length; ++i) {
                            if (typeof object.logs[i] !== "object")
                                throw TypeError(".push_server.messages.LogsCommand.logs: object expected");
                            message.logs[i] = $types[9].fromObject(object.logs[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a LogsCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.LogsCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.LogsCommand} LogsCommand
                 */
                LogsCommand.from = LogsCommand.fromObject;
    
                /**
                 * Creates a plain object from a LogsCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.LogsCommand} message LogsCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LogsCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.logs = [];
                    if (options.defaults) {
                        object.cid = "";
                        object.l = 0;
                        object.limit = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.t = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.t = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.tt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.tt = options.longs === String ? "0" : 0;
                        object.tmid = "";
                        object.mid = "";
                        object.checksum = "";
                        object.stored = false;
                    }
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    if (message.l !== undefined && message.l !== null && message.hasOwnProperty("l"))
                        object.l = message.l;
                    if (message.limit !== undefined && message.limit !== null && message.hasOwnProperty("limit"))
                        object.limit = message.limit;
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        if (typeof message.t === "number")
                            object.t = options.longs === String ? String(message.t) : message.t;
                        else
                            object.t = options.longs === String ? $util.Long.prototype.toString.call(message.t) : options.longs === Number ? new $util.LongBits(message.t.low, message.t.high).toNumber() : message.t;
                    if (message.tt !== undefined && message.tt !== null && message.hasOwnProperty("tt"))
                        if (typeof message.tt === "number")
                            object.tt = options.longs === String ? String(message.tt) : message.tt;
                        else
                            object.tt = options.longs === String ? $util.Long.prototype.toString.call(message.tt) : options.longs === Number ? new $util.LongBits(message.tt.low, message.tt.high).toNumber() : message.tt;
                    if (message.tmid !== undefined && message.tmid !== null && message.hasOwnProperty("tmid"))
                        object.tmid = message.tmid;
                    if (message.mid !== undefined && message.mid !== null && message.hasOwnProperty("mid"))
                        object.mid = message.mid;
                    if (message.checksum !== undefined && message.checksum !== null && message.hasOwnProperty("checksum"))
                        object.checksum = message.checksum;
                    if (message.stored !== undefined && message.stored !== null && message.hasOwnProperty("stored"))
                        object.stored = message.stored;
                    if (message.logs !== undefined && message.logs !== null && message.hasOwnProperty("logs")) {
                        object.logs = [];
                        for (var j = 0; j < message.logs.length; ++j)
                            object.logs[j] = $types[9].toObject(message.logs[j], options);
                    }
                    return object;
                };
    
                /**
                 * Creates a plain object from this LogsCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LogsCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this LogsCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                LogsCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return LogsCommand;
            })();
    
            messages.RcpCommand = (function() {
    
                /**
                 * Constructs a new RcpCommand.
                 * @exports push_server.messages.RcpCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function RcpCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * RcpCommand id.
                 * @type {string}
                 */
                RcpCommand.prototype.id = "";
    
                /**
                 * RcpCommand cid.
                 * @type {string}
                 */
                RcpCommand.prototype.cid = "";
    
                /**
                 * RcpCommand t.
                 * @type {number|$protobuf.Long}
                 */
                RcpCommand.prototype.t = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Creates a new RcpCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.RcpCommand} RcpCommand instance
                 */
                RcpCommand.create = function create(properties) {
                    return new RcpCommand(properties);
                };
    
                /**
                 * Encodes the specified RcpCommand message.
                 * @param {push_server.messages.RcpCommand|Object} message RcpCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RcpCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id !== undefined && message.hasOwnProperty("id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.cid !== undefined && message.hasOwnProperty("cid"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.cid);
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int64(message.t);
                    return writer;
                };
    
                /**
                 * Encodes the specified RcpCommand message, length delimited.
                 * @param {push_server.messages.RcpCommand|Object} message RcpCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RcpCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a RcpCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.RcpCommand} RcpCommand
                 */
                RcpCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.RcpCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.id = reader.string();
                            break;
                        case 2:
                            message.cid = reader.string();
                            break;
                        case 3:
                            message.t = reader.int64();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a RcpCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.RcpCommand} RcpCommand
                 */
                RcpCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a RcpCommand message.
                 * @param {push_server.messages.RcpCommand|Object} message RcpCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                RcpCommand.verify = function verify(message) {    
                    if (message.id !== undefined)
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.cid !== undefined)
                        if (!$util.isString(message.cid))
                            return "cid: string expected";
                    if (message.t !== undefined)
                        if (!$util.isInteger(message.t) && !(message.t && $util.isInteger(message.t.low) && $util.isInteger(message.t.high)))
                            return "t: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a RcpCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.RcpCommand} RcpCommand
                 */
                RcpCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.RcpCommand)
                        return object;
                    var message = new $root.push_server.messages.RcpCommand();
                    if (object.id !== undefined && object.id !== null)
                        message.id = String(object.id);
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    if (object.t !== undefined && object.t !== null)
                        if ($util.Long)
                            (message.t = $util.Long.fromValue(object.t)).unsigned = false;
                        else if (typeof object.t === "string")
                            message.t = parseInt(object.t, 10);
                        else if (typeof object.t === "number")
                            message.t = object.t;
                        else if (typeof object.t === "object")
                            message.t = new $util.LongBits(object.t.low, object.t.high).toNumber();
                    return message;
                };
    
                /**
                 * Creates a RcpCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.RcpCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.RcpCommand} RcpCommand
                 */
                RcpCommand.from = RcpCommand.fromObject;
    
                /**
                 * Creates a plain object from a RcpCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.RcpCommand} message RcpCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                RcpCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.cid = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.t = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.t = options.longs === String ? "0" : 0;
                    }
                    if (message.id !== undefined && message.id !== null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    if (message.t !== undefined && message.t !== null && message.hasOwnProperty("t"))
                        if (typeof message.t === "number")
                            object.t = options.longs === String ? String(message.t) : message.t;
                        else
                            object.t = options.longs === String ? $util.Long.prototype.toString.call(message.t) : options.longs === Number ? new $util.LongBits(message.t.low, message.t.high).toNumber() : message.t;
                    return object;
                };
    
                /**
                 * Creates a plain object from this RcpCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                RcpCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this RcpCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                RcpCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return RcpCommand;
            })();
    
            messages.ReadTuple = (function() {
    
                /**
                 * Constructs a new ReadTuple.
                 * @exports push_server.messages.ReadTuple
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ReadTuple(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ReadTuple cid.
                 * @type {string}
                 */
                ReadTuple.prototype.cid = "";
    
                /**
                 * ReadTuple timestamp.
                 * @type {number|$protobuf.Long}
                 */
                ReadTuple.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ReadTuple mid.
                 * @type {string}
                 */
                ReadTuple.prototype.mid = "";
    
                /**
                 * Creates a new ReadTuple instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.ReadTuple} ReadTuple instance
                 */
                ReadTuple.create = function create(properties) {
                    return new ReadTuple(properties);
                };
    
                /**
                 * Encodes the specified ReadTuple message.
                 * @param {push_server.messages.ReadTuple|Object} message ReadTuple message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReadTuple.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
                    if (message.timestamp !== undefined && message.timestamp !== null && message.hasOwnProperty("timestamp"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
                    if (message.mid !== undefined && message.hasOwnProperty("mid"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.mid);
                    return writer;
                };
    
                /**
                 * Encodes the specified ReadTuple message, length delimited.
                 * @param {push_server.messages.ReadTuple|Object} message ReadTuple message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReadTuple.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ReadTuple message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.ReadTuple} ReadTuple
                 */
                ReadTuple.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.ReadTuple();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.cid = reader.string();
                            break;
                        case 2:
                            message.timestamp = reader.int64();
                            break;
                        case 3:
                            message.mid = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ReadTuple message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.ReadTuple} ReadTuple
                 */
                ReadTuple.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ReadTuple message.
                 * @param {push_server.messages.ReadTuple|Object} message ReadTuple message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ReadTuple.verify = function verify(message) {    
                    if (!$util.isString(message.cid))
                        return "cid: string expected";
                    if (message.timestamp !== undefined)
                        if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                            return "timestamp: integer|Long expected";
                    if (message.mid !== undefined)
                        if (!$util.isString(message.mid))
                            return "mid: string expected";
                    return null;
                };
    
                /**
                 * Creates a ReadTuple message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ReadTuple} ReadTuple
                 */
                ReadTuple.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.ReadTuple)
                        return object;
                    var message = new $root.push_server.messages.ReadTuple();
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    if (object.timestamp !== undefined && object.timestamp !== null)
                        if ($util.Long)
                            (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                        else if (typeof object.timestamp === "string")
                            message.timestamp = parseInt(object.timestamp, 10);
                        else if (typeof object.timestamp === "number")
                            message.timestamp = object.timestamp;
                        else if (typeof object.timestamp === "object")
                            message.timestamp = new $util.LongBits(object.timestamp.low, object.timestamp.high).toNumber();
                    if (object.mid !== undefined && object.mid !== null)
                        message.mid = String(object.mid);
                    return message;
                };
    
                /**
                 * Creates a ReadTuple message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.ReadTuple.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ReadTuple} ReadTuple
                 */
                ReadTuple.from = ReadTuple.fromObject;
    
                /**
                 * Creates a plain object from a ReadTuple message. Also converts values to other types if specified.
                 * @param {push_server.messages.ReadTuple} message ReadTuple
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReadTuple.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.cid = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.timestamp = options.longs === String ? "0" : 0;
                        object.mid = "";
                    }
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    if (message.timestamp !== undefined && message.timestamp !== null && message.hasOwnProperty("timestamp"))
                        if (typeof message.timestamp === "number")
                            object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                        else
                            object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low, message.timestamp.high).toNumber() : message.timestamp;
                    if (message.mid !== undefined && message.mid !== null && message.hasOwnProperty("mid"))
                        object.mid = message.mid;
                    return object;
                };
    
                /**
                 * Creates a plain object from this ReadTuple message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReadTuple.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this ReadTuple to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ReadTuple.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ReadTuple;
            })();
    
            messages.ReadCommand = (function() {
    
                /**
                 * Constructs a new ReadCommand.
                 * @exports push_server.messages.ReadCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ReadCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ReadCommand cid.
                 * @type {string}
                 */
                ReadCommand.prototype.cid = "";
    
                /**
                 * ReadCommand cids.
                 * @type {Array.<string>}
                 */
                ReadCommand.prototype.cids = $util.emptyArray;
    
                /**
                 * ReadCommand convs.
                 * @type {Array.<push_server.messages.ReadTuple>}
                 */
                ReadCommand.prototype.convs = $util.emptyArray;
    
                // Lazily resolved type references
                var $types = {
                    2: "push_server.messages.ReadTuple"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new ReadCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.ReadCommand} ReadCommand instance
                 */
                ReadCommand.create = function create(properties) {
                    return new ReadCommand(properties);
                };
    
                /**
                 * Encodes the specified ReadCommand message.
                 * @param {push_server.messages.ReadCommand|Object} message ReadCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReadCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.cid !== undefined && message.hasOwnProperty("cid"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
                    if (message.cids !== undefined && message.hasOwnProperty("cids"))
                        for (var i = 0; i < message.cids.length; ++i)
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.cids[i]);
                    if (message.convs !== undefined && message.hasOwnProperty("convs"))
                        for (var i = 0; i < message.convs.length; ++i)
                            $types[2].encode(message.convs[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified ReadCommand message, length delimited.
                 * @param {push_server.messages.ReadCommand|Object} message ReadCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReadCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ReadCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.ReadCommand} ReadCommand
                 */
                ReadCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.ReadCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.cid = reader.string();
                            break;
                        case 2:
                            if (!(message.cids && message.cids.length))
                                message.cids = [];
                            message.cids.push(reader.string());
                            break;
                        case 3:
                            if (!(message.convs && message.convs.length))
                                message.convs = [];
                            message.convs.push($types[2].decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ReadCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.ReadCommand} ReadCommand
                 */
                ReadCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ReadCommand message.
                 * @param {push_server.messages.ReadCommand|Object} message ReadCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ReadCommand.verify = function verify(message) {    
                    if (message.cid !== undefined)
                        if (!$util.isString(message.cid))
                            return "cid: string expected";
                    if (message.cids !== undefined) {
                        if (!Array.isArray(message.cids))
                            return "cids: array expected";
                        for (var i = 0; i < message.cids.length; ++i)
                            if (!$util.isString(message.cids[i]))
                                return "cids: string[] expected";
                    }
                    if (message.convs !== undefined) {
                        if (!Array.isArray(message.convs))
                            return "convs: array expected";
                        for (var i = 0; i < message.convs.length; ++i) {
                            var error = $types[2].verify(message.convs[i]);
                            if (error)
                                return "convs." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a ReadCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ReadCommand} ReadCommand
                 */
                ReadCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.ReadCommand)
                        return object;
                    var message = new $root.push_server.messages.ReadCommand();
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    if (object.cids) {
                        if (!Array.isArray(object.cids))
                            throw TypeError(".push_server.messages.ReadCommand.cids: array expected");
                        message.cids = [];
                        for (var i = 0; i < object.cids.length; ++i)
                            message.cids[i] = String(object.cids[i]);
                    }
                    if (object.convs) {
                        if (!Array.isArray(object.convs))
                            throw TypeError(".push_server.messages.ReadCommand.convs: array expected");
                        message.convs = [];
                        for (var i = 0; i < object.convs.length; ++i) {
                            if (typeof object.convs[i] !== "object")
                                throw TypeError(".push_server.messages.ReadCommand.convs: object expected");
                            message.convs[i] = $types[2].fromObject(object.convs[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a ReadCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.ReadCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ReadCommand} ReadCommand
                 */
                ReadCommand.from = ReadCommand.fromObject;
    
                /**
                 * Creates a plain object from a ReadCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.ReadCommand} message ReadCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReadCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.cids = [];
                        object.convs = [];
                    }
                    if (options.defaults)
                        object.cid = "";
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    if (message.cids !== undefined && message.cids !== null && message.hasOwnProperty("cids")) {
                        object.cids = [];
                        for (var j = 0; j < message.cids.length; ++j)
                            object.cids[j] = message.cids[j];
                    }
                    if (message.convs !== undefined && message.convs !== null && message.hasOwnProperty("convs")) {
                        object.convs = [];
                        for (var j = 0; j < message.convs.length; ++j)
                            object.convs[j] = $types[2].toObject(message.convs[j], options);
                    }
                    return object;
                };
    
                /**
                 * Creates a plain object from this ReadCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReadCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this ReadCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ReadCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ReadCommand;
            })();
    
            messages.PresenceCommand = (function() {
    
                /**
                 * Constructs a new PresenceCommand.
                 * @exports push_server.messages.PresenceCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function PresenceCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * PresenceCommand status.
                 * @type {number}
                 */
                PresenceCommand.prototype.status = 1;
    
                /**
                 * PresenceCommand sessionPeerIds.
                 * @type {Array.<string>}
                 */
                PresenceCommand.prototype.sessionPeerIds = $util.emptyArray;
    
                /**
                 * PresenceCommand cid.
                 * @type {string}
                 */
                PresenceCommand.prototype.cid = "";
    
                // Lazily resolved type references
                var $types = {
                    0: "push_server.messages.StatusType"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new PresenceCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.PresenceCommand} PresenceCommand instance
                 */
                PresenceCommand.create = function create(properties) {
                    return new PresenceCommand(properties);
                };
    
                /**
                 * Encodes the specified PresenceCommand message.
                 * @param {push_server.messages.PresenceCommand|Object} message PresenceCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PresenceCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.status !== undefined && message.hasOwnProperty("status"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.status);
                    if (message.sessionPeerIds !== undefined && message.hasOwnProperty("sessionPeerIds"))
                        for (var i = 0; i < message.sessionPeerIds.length; ++i)
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sessionPeerIds[i]);
                    if (message.cid !== undefined && message.hasOwnProperty("cid"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.cid);
                    return writer;
                };
    
                /**
                 * Encodes the specified PresenceCommand message, length delimited.
                 * @param {push_server.messages.PresenceCommand|Object} message PresenceCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PresenceCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a PresenceCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.PresenceCommand} PresenceCommand
                 */
                PresenceCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.PresenceCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.status = reader.uint32();
                            break;
                        case 2:
                            if (!(message.sessionPeerIds && message.sessionPeerIds.length))
                                message.sessionPeerIds = [];
                            message.sessionPeerIds.push(reader.string());
                            break;
                        case 3:
                            message.cid = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a PresenceCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.PresenceCommand} PresenceCommand
                 */
                PresenceCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a PresenceCommand message.
                 * @param {push_server.messages.PresenceCommand|Object} message PresenceCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                PresenceCommand.verify = function verify(message) {    
                    if (message.status !== undefined)
                        switch (message.status) {
                        default:
                            return "status: enum value expected";
                        case 1:
                        case 2:
                            break;
                        }
                    if (message.sessionPeerIds !== undefined) {
                        if (!Array.isArray(message.sessionPeerIds))
                            return "sessionPeerIds: array expected";
                        for (var i = 0; i < message.sessionPeerIds.length; ++i)
                            if (!$util.isString(message.sessionPeerIds[i]))
                                return "sessionPeerIds: string[] expected";
                    }
                    if (message.cid !== undefined)
                        if (!$util.isString(message.cid))
                            return "cid: string expected";
                    return null;
                };
    
                /**
                 * Creates a PresenceCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.PresenceCommand} PresenceCommand
                 */
                PresenceCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.PresenceCommand)
                        return object;
                    var message = new $root.push_server.messages.PresenceCommand();
                    switch (object.status) {
                    case "on":
                    case 1:
                        message.status = 1;
                        break;
                    case "off":
                    case 2:
                        message.status = 2;
                        break;
                    }
                    if (object.sessionPeerIds) {
                        if (!Array.isArray(object.sessionPeerIds))
                            throw TypeError(".push_server.messages.PresenceCommand.sessionPeerIds: array expected");
                        message.sessionPeerIds = [];
                        for (var i = 0; i < object.sessionPeerIds.length; ++i)
                            message.sessionPeerIds[i] = String(object.sessionPeerIds[i]);
                    }
                    if (object.cid !== undefined && object.cid !== null)
                        message.cid = String(object.cid);
                    return message;
                };
    
                /**
                 * Creates a PresenceCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.PresenceCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.PresenceCommand} PresenceCommand
                 */
                PresenceCommand.from = PresenceCommand.fromObject;
    
                /**
                 * Creates a plain object from a PresenceCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.PresenceCommand} message PresenceCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                PresenceCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.sessionPeerIds = [];
                    if (options.defaults) {
                        object.status = options.enums === String ? "on" : 1;
                        object.cid = "";
                    }
                    if (message.status !== undefined && message.status !== null && message.hasOwnProperty("status"))
                        object.status = options.enums === String ? $types[0][message.status] : message.status;
                    if (message.sessionPeerIds !== undefined && message.sessionPeerIds !== null && message.hasOwnProperty("sessionPeerIds")) {
                        object.sessionPeerIds = [];
                        for (var j = 0; j < message.sessionPeerIds.length; ++j)
                            object.sessionPeerIds[j] = message.sessionPeerIds[j];
                    }
                    if (message.cid !== undefined && message.cid !== null && message.hasOwnProperty("cid"))
                        object.cid = message.cid;
                    return object;
                };
    
                /**
                 * Creates a plain object from this PresenceCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                PresenceCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this PresenceCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                PresenceCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return PresenceCommand;
            })();
    
            messages.ReportCommand = (function() {
    
                /**
                 * Constructs a new ReportCommand.
                 * @exports push_server.messages.ReportCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function ReportCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ReportCommand initiative.
                 * @type {boolean}
                 */
                ReportCommand.prototype.initiative = false;
    
                /**
                 * ReportCommand type.
                 * @type {string}
                 */
                ReportCommand.prototype.type = "";
    
                /**
                 * ReportCommand data.
                 * @type {string}
                 */
                ReportCommand.prototype.data = "";
    
                /**
                 * Creates a new ReportCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.ReportCommand} ReportCommand instance
                 */
                ReportCommand.create = function create(properties) {
                    return new ReportCommand(properties);
                };
    
                /**
                 * Encodes the specified ReportCommand message.
                 * @param {push_server.messages.ReportCommand|Object} message ReportCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReportCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.initiative !== undefined && message.hasOwnProperty("initiative"))
                        writer.uint32(/* id 1, wireType 0 =*/8).bool(message.initiative);
                    if (message.type !== undefined && message.hasOwnProperty("type"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
                    if (message.data !== undefined && message.hasOwnProperty("data"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.data);
                    return writer;
                };
    
                /**
                 * Encodes the specified ReportCommand message, length delimited.
                 * @param {push_server.messages.ReportCommand|Object} message ReportCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReportCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ReportCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.ReportCommand} ReportCommand
                 */
                ReportCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.ReportCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.initiative = reader.bool();
                            break;
                        case 2:
                            message.type = reader.string();
                            break;
                        case 3:
                            message.data = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ReportCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.ReportCommand} ReportCommand
                 */
                ReportCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ReportCommand message.
                 * @param {push_server.messages.ReportCommand|Object} message ReportCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ReportCommand.verify = function verify(message) {    
                    if (message.initiative !== undefined)
                        if (typeof message.initiative !== "boolean")
                            return "initiative: boolean expected";
                    if (message.type !== undefined)
                        if (!$util.isString(message.type))
                            return "type: string expected";
                    if (message.data !== undefined)
                        if (!$util.isString(message.data))
                            return "data: string expected";
                    return null;
                };
    
                /**
                 * Creates a ReportCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ReportCommand} ReportCommand
                 */
                ReportCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.ReportCommand)
                        return object;
                    var message = new $root.push_server.messages.ReportCommand();
                    if (object.initiative !== undefined && object.initiative !== null)
                        message.initiative = Boolean(object.initiative);
                    if (object.type !== undefined && object.type !== null)
                        message.type = String(object.type);
                    if (object.data !== undefined && object.data !== null)
                        message.data = String(object.data);
                    return message;
                };
    
                /**
                 * Creates a ReportCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.ReportCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.ReportCommand} ReportCommand
                 */
                ReportCommand.from = ReportCommand.fromObject;
    
                /**
                 * Creates a plain object from a ReportCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.ReportCommand} message ReportCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReportCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.initiative = false;
                        object.type = "";
                        object.data = "";
                    }
                    if (message.initiative !== undefined && message.initiative !== null && message.hasOwnProperty("initiative"))
                        object.initiative = message.initiative;
                    if (message.type !== undefined && message.type !== null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    if (message.data !== undefined && message.data !== null && message.hasOwnProperty("data"))
                        object.data = message.data;
                    return object;
                };
    
                /**
                 * Creates a plain object from this ReportCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReportCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this ReportCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ReportCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ReportCommand;
            })();
    
            messages.GenericCommand = (function() {
    
                /**
                 * Constructs a new GenericCommand.
                 * @exports push_server.messages.GenericCommand
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function GenericCommand(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * GenericCommand cmd.
                 * @type {number}
                 */
                GenericCommand.prototype.cmd = 0;
    
                /**
                 * GenericCommand op.
                 * @type {number}
                 */
                GenericCommand.prototype.op = 1;
    
                /**
                 * GenericCommand appId.
                 * @type {string}
                 */
                GenericCommand.prototype.appId = "";
    
                /**
                 * GenericCommand peerId.
                 * @type {string}
                 */
                GenericCommand.prototype.peerId = "";
    
                /**
                 * GenericCommand i.
                 * @type {number}
                 */
                GenericCommand.prototype.i = 0;
    
                /**
                 * GenericCommand installationId.
                 * @type {string}
                 */
                GenericCommand.prototype.installationId = "";
    
                /**
                 * GenericCommand priority.
                 * @type {number}
                 */
                GenericCommand.prototype.priority = 0;
    
                /**
                 * GenericCommand loginMessage.
                 * @type {push_server.messages.LoginCommand}
                 */
                GenericCommand.prototype.loginMessage = null;
    
                /**
                 * GenericCommand dataMessage.
                 * @type {push_server.messages.DataCommand}
                 */
                GenericCommand.prototype.dataMessage = null;
    
                /**
                 * GenericCommand sessionMessage.
                 * @type {push_server.messages.SessionCommand}
                 */
                GenericCommand.prototype.sessionMessage = null;
    
                /**
                 * GenericCommand errorMessage.
                 * @type {push_server.messages.ErrorCommand}
                 */
                GenericCommand.prototype.errorMessage = null;
    
                /**
                 * GenericCommand directMessage.
                 * @type {push_server.messages.DirectCommand}
                 */
                GenericCommand.prototype.directMessage = null;
    
                /**
                 * GenericCommand ackMessage.
                 * @type {push_server.messages.AckCommand}
                 */
                GenericCommand.prototype.ackMessage = null;
    
                /**
                 * GenericCommand unreadMessage.
                 * @type {push_server.messages.UnreadCommand}
                 */
                GenericCommand.prototype.unreadMessage = null;
    
                /**
                 * GenericCommand readMessage.
                 * @type {push_server.messages.ReadCommand}
                 */
                GenericCommand.prototype.readMessage = null;
    
                /**
                 * GenericCommand rcpMessage.
                 * @type {push_server.messages.RcpCommand}
                 */
                GenericCommand.prototype.rcpMessage = null;
    
                /**
                 * GenericCommand logsMessage.
                 * @type {push_server.messages.LogsCommand}
                 */
                GenericCommand.prototype.logsMessage = null;
    
                /**
                 * GenericCommand convMessage.
                 * @type {push_server.messages.ConvCommand}
                 */
                GenericCommand.prototype.convMessage = null;
    
                /**
                 * GenericCommand roomMessage.
                 * @type {push_server.messages.RoomCommand}
                 */
                GenericCommand.prototype.roomMessage = null;
    
                /**
                 * GenericCommand presenceMessage.
                 * @type {push_server.messages.PresenceCommand}
                 */
                GenericCommand.prototype.presenceMessage = null;
    
                /**
                 * GenericCommand reportMessage.
                 * @type {push_server.messages.ReportCommand}
                 */
                GenericCommand.prototype.reportMessage = null;
    
                // Lazily resolved type references
                var $types = {
                    0: "push_server.messages.CommandType",
                    1: "push_server.messages.OpType",
                    7: "push_server.messages.LoginCommand",
                    8: "push_server.messages.DataCommand",
                    9: "push_server.messages.SessionCommand",
                    10: "push_server.messages.ErrorCommand",
                    11: "push_server.messages.DirectCommand",
                    12: "push_server.messages.AckCommand",
                    13: "push_server.messages.UnreadCommand",
                    14: "push_server.messages.ReadCommand",
                    15: "push_server.messages.RcpCommand",
                    16: "push_server.messages.LogsCommand",
                    17: "push_server.messages.ConvCommand",
                    18: "push_server.messages.RoomCommand",
                    19: "push_server.messages.PresenceCommand",
                    20: "push_server.messages.ReportCommand"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new GenericCommand instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {push_server.messages.GenericCommand} GenericCommand instance
                 */
                GenericCommand.create = function create(properties) {
                    return new GenericCommand(properties);
                };
    
                /**
                 * Encodes the specified GenericCommand message.
                 * @param {push_server.messages.GenericCommand|Object} message GenericCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GenericCommand.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.cmd);
                    if (message.op !== undefined && message.hasOwnProperty("op"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.op);
                    if (message.appId !== undefined && message.hasOwnProperty("appId"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.appId);
                    if (message.peerId !== undefined && message.hasOwnProperty("peerId"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.peerId);
                    if (message.i !== undefined && message.hasOwnProperty("i"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.i);
                    if (message.installationId !== undefined && message.hasOwnProperty("installationId"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.installationId);
                    if (message.priority !== undefined && message.hasOwnProperty("priority"))
                        writer.uint32(/* id 7, wireType 0 =*/56).int32(message.priority);
                    if (message.loginMessage && message.hasOwnProperty("loginMessage"))
                        $types[7].encode(message.loginMessage, writer.uint32(/* id 100, wireType 2 =*/802).fork()).ldelim();
                    if (message.dataMessage && message.hasOwnProperty("dataMessage"))
                        $types[8].encode(message.dataMessage, writer.uint32(/* id 101, wireType 2 =*/810).fork()).ldelim();
                    if (message.sessionMessage && message.hasOwnProperty("sessionMessage"))
                        $types[9].encode(message.sessionMessage, writer.uint32(/* id 102, wireType 2 =*/818).fork()).ldelim();
                    if (message.errorMessage && message.hasOwnProperty("errorMessage"))
                        $types[10].encode(message.errorMessage, writer.uint32(/* id 103, wireType 2 =*/826).fork()).ldelim();
                    if (message.directMessage && message.hasOwnProperty("directMessage"))
                        $types[11].encode(message.directMessage, writer.uint32(/* id 104, wireType 2 =*/834).fork()).ldelim();
                    if (message.ackMessage && message.hasOwnProperty("ackMessage"))
                        $types[12].encode(message.ackMessage, writer.uint32(/* id 105, wireType 2 =*/842).fork()).ldelim();
                    if (message.unreadMessage && message.hasOwnProperty("unreadMessage"))
                        $types[13].encode(message.unreadMessage, writer.uint32(/* id 106, wireType 2 =*/850).fork()).ldelim();
                    if (message.readMessage && message.hasOwnProperty("readMessage"))
                        $types[14].encode(message.readMessage, writer.uint32(/* id 107, wireType 2 =*/858).fork()).ldelim();
                    if (message.rcpMessage && message.hasOwnProperty("rcpMessage"))
                        $types[15].encode(message.rcpMessage, writer.uint32(/* id 108, wireType 2 =*/866).fork()).ldelim();
                    if (message.logsMessage && message.hasOwnProperty("logsMessage"))
                        $types[16].encode(message.logsMessage, writer.uint32(/* id 109, wireType 2 =*/874).fork()).ldelim();
                    if (message.convMessage && message.hasOwnProperty("convMessage"))
                        $types[17].encode(message.convMessage, writer.uint32(/* id 110, wireType 2 =*/882).fork()).ldelim();
                    if (message.roomMessage && message.hasOwnProperty("roomMessage"))
                        $types[18].encode(message.roomMessage, writer.uint32(/* id 111, wireType 2 =*/890).fork()).ldelim();
                    if (message.presenceMessage && message.hasOwnProperty("presenceMessage"))
                        $types[19].encode(message.presenceMessage, writer.uint32(/* id 112, wireType 2 =*/898).fork()).ldelim();
                    if (message.reportMessage && message.hasOwnProperty("reportMessage"))
                        $types[20].encode(message.reportMessage, writer.uint32(/* id 113, wireType 2 =*/906).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified GenericCommand message, length delimited.
                 * @param {push_server.messages.GenericCommand|Object} message GenericCommand message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GenericCommand.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a GenericCommand message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {push_server.messages.GenericCommand} GenericCommand
                 */
                GenericCommand.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push_server.messages.GenericCommand();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.cmd = reader.uint32();
                            break;
                        case 2:
                            message.op = reader.uint32();
                            break;
                        case 3:
                            message.appId = reader.string();
                            break;
                        case 4:
                            message.peerId = reader.string();
                            break;
                        case 5:
                            message.i = reader.int32();
                            break;
                        case 6:
                            message.installationId = reader.string();
                            break;
                        case 7:
                            message.priority = reader.int32();
                            break;
                        case 100:
                            message.loginMessage = $types[7].decode(reader, reader.uint32());
                            break;
                        case 101:
                            message.dataMessage = $types[8].decode(reader, reader.uint32());
                            break;
                        case 102:
                            message.sessionMessage = $types[9].decode(reader, reader.uint32());
                            break;
                        case 103:
                            message.errorMessage = $types[10].decode(reader, reader.uint32());
                            break;
                        case 104:
                            message.directMessage = $types[11].decode(reader, reader.uint32());
                            break;
                        case 105:
                            message.ackMessage = $types[12].decode(reader, reader.uint32());
                            break;
                        case 106:
                            message.unreadMessage = $types[13].decode(reader, reader.uint32());
                            break;
                        case 107:
                            message.readMessage = $types[14].decode(reader, reader.uint32());
                            break;
                        case 108:
                            message.rcpMessage = $types[15].decode(reader, reader.uint32());
                            break;
                        case 109:
                            message.logsMessage = $types[16].decode(reader, reader.uint32());
                            break;
                        case 110:
                            message.convMessage = $types[17].decode(reader, reader.uint32());
                            break;
                        case 111:
                            message.roomMessage = $types[18].decode(reader, reader.uint32());
                            break;
                        case 112:
                            message.presenceMessage = $types[19].decode(reader, reader.uint32());
                            break;
                        case 113:
                            message.reportMessage = $types[20].decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a GenericCommand message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {push_server.messages.GenericCommand} GenericCommand
                 */
                GenericCommand.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a GenericCommand message.
                 * @param {push_server.messages.GenericCommand|Object} message GenericCommand message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                GenericCommand.verify = function verify(message) {    
                    switch (message.cmd) {
                    default:
                        return "cmd: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        break;
                    }
                    if (message.op !== undefined)
                        switch (message.op) {
                        default:
                            return "op: enum value expected";
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 30:
                        case 31:
                        case 32:
                        case 33:
                        case 39:
                        case 40:
                        case 42:
                        case 43:
                        case 44:
                        case 45:
                        case 46:
                        case 47:
                        case 48:
                        case 49:
                        case 50:
                        case 80:
                        case 81:
                        case 82:
                        case 83:
                        case 84:
                        case 85:
                        case 86:
                        case 100:
                        case 101:
                            break;
                        }
                    if (message.appId !== undefined)
                        if (!$util.isString(message.appId))
                            return "appId: string expected";
                    if (message.peerId !== undefined)
                        if (!$util.isString(message.peerId))
                            return "peerId: string expected";
                    if (message.i !== undefined)
                        if (!$util.isInteger(message.i))
                            return "i: integer expected";
                    if (message.installationId !== undefined)
                        if (!$util.isString(message.installationId))
                            return "installationId: string expected";
                    if (message.priority !== undefined)
                        if (!$util.isInteger(message.priority))
                            return "priority: integer expected";
                    if (message.loginMessage !== undefined && message.loginMessage !== null) {
                        var error = $types[7].verify(message.loginMessage);
                        if (error)
                            return "loginMessage." + error;
                    }
                    if (message.dataMessage !== undefined && message.dataMessage !== null) {
                        var error = $types[8].verify(message.dataMessage);
                        if (error)
                            return "dataMessage." + error;
                    }
                    if (message.sessionMessage !== undefined && message.sessionMessage !== null) {
                        var error = $types[9].verify(message.sessionMessage);
                        if (error)
                            return "sessionMessage." + error;
                    }
                    if (message.errorMessage !== undefined && message.errorMessage !== null) {
                        var error = $types[10].verify(message.errorMessage);
                        if (error)
                            return "errorMessage." + error;
                    }
                    if (message.directMessage !== undefined && message.directMessage !== null) {
                        var error = $types[11].verify(message.directMessage);
                        if (error)
                            return "directMessage." + error;
                    }
                    if (message.ackMessage !== undefined && message.ackMessage !== null) {
                        var error = $types[12].verify(message.ackMessage);
                        if (error)
                            return "ackMessage." + error;
                    }
                    if (message.unreadMessage !== undefined && message.unreadMessage !== null) {
                        var error = $types[13].verify(message.unreadMessage);
                        if (error)
                            return "unreadMessage." + error;
                    }
                    if (message.readMessage !== undefined && message.readMessage !== null) {
                        var error = $types[14].verify(message.readMessage);
                        if (error)
                            return "readMessage." + error;
                    }
                    if (message.rcpMessage !== undefined && message.rcpMessage !== null) {
                        var error = $types[15].verify(message.rcpMessage);
                        if (error)
                            return "rcpMessage." + error;
                    }
                    if (message.logsMessage !== undefined && message.logsMessage !== null) {
                        var error = $types[16].verify(message.logsMessage);
                        if (error)
                            return "logsMessage." + error;
                    }
                    if (message.convMessage !== undefined && message.convMessage !== null) {
                        var error = $types[17].verify(message.convMessage);
                        if (error)
                            return "convMessage." + error;
                    }
                    if (message.roomMessage !== undefined && message.roomMessage !== null) {
                        var error = $types[18].verify(message.roomMessage);
                        if (error)
                            return "roomMessage." + error;
                    }
                    if (message.presenceMessage !== undefined && message.presenceMessage !== null) {
                        var error = $types[19].verify(message.presenceMessage);
                        if (error)
                            return "presenceMessage." + error;
                    }
                    if (message.reportMessage !== undefined && message.reportMessage !== null) {
                        var error = $types[20].verify(message.reportMessage);
                        if (error)
                            return "reportMessage." + error;
                    }
                    return null;
                };
    
                /**
                 * Creates a GenericCommand message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.GenericCommand} GenericCommand
                 */
                GenericCommand.fromObject = function fromObject(object) {    
                    if (object instanceof $root.push_server.messages.GenericCommand)
                        return object;
                    var message = new $root.push_server.messages.GenericCommand();
                    switch (object.cmd) {
                    case "session":
                    case 0:
                        message.cmd = 0;
                        break;
                    case "conv":
                    case 1:
                        message.cmd = 1;
                        break;
                    case "direct":
                    case 2:
                        message.cmd = 2;
                        break;
                    case "ack":
                    case 3:
                        message.cmd = 3;
                        break;
                    case "rcp":
                    case 4:
                        message.cmd = 4;
                        break;
                    case "unread":
                    case 5:
                        message.cmd = 5;
                        break;
                    case "logs":
                    case 6:
                        message.cmd = 6;
                        break;
                    case "error":
                    case 7:
                        message.cmd = 7;
                        break;
                    case "login":
                    case 8:
                        message.cmd = 8;
                        break;
                    case "data":
                    case 9:
                        message.cmd = 9;
                        break;
                    case "room":
                    case 10:
                        message.cmd = 10;
                        break;
                    case "read":
                    case 11:
                        message.cmd = 11;
                        break;
                    case "presence":
                    case 12:
                        message.cmd = 12;
                        break;
                    case "report":
                    case 13:
                        message.cmd = 13;
                        break;
                    case "echo":
                    case 14:
                        message.cmd = 14;
                        break;
                    }
                    switch (object.op) {
                    case "open":
                    case 1:
                        message.op = 1;
                        break;
                    case "add":
                    case 2:
                        message.op = 2;
                        break;
                    case "remove":
                    case 3:
                        message.op = 3;
                        break;
                    case "close":
                    case 4:
                        message.op = 4;
                        break;
                    case "opened":
                    case 5:
                        message.op = 5;
                        break;
                    case "closed":
                    case 6:
                        message.op = 6;
                        break;
                    case "query":
                    case 7:
                        message.op = 7;
                        break;
                    case "query_result":
                    case 8:
                        message.op = 8;
                        break;
                    case "conflict":
                    case 9:
                        message.op = 9;
                        break;
                    case "added":
                    case 10:
                        message.op = 10;
                        break;
                    case "removed":
                    case 11:
                        message.op = 11;
                        break;
                    case "start":
                    case 30:
                        message.op = 30;
                        break;
                    case "started":
                    case 31:
                        message.op = 31;
                        break;
                    case "joined":
                    case 32:
                        message.op = 32;
                        break;
                    case "members_joined":
                    case 33:
                        message.op = 33;
                        break;
                    case "left":
                    case 39:
                        message.op = 39;
                        break;
                    case "members_left":
                    case 40:
                        message.op = 40;
                        break;
                    case "results":
                    case 42:
                        message.op = 42;
                        break;
                    case "count":
                    case 43:
                        message.op = 43;
                        break;
                    case "result":
                    case 44:
                        message.op = 44;
                        break;
                    case "update":
                    case 45:
                        message.op = 45;
                        break;
                    case "updated":
                    case 46:
                        message.op = 46;
                        break;
                    case "mute":
                    case 47:
                        message.op = 47;
                        break;
                    case "unmute":
                    case 48:
                        message.op = 48;
                        break;
                    case "status":
                    case 49:
                        message.op = 49;
                        break;
                    case "members":
                    case 50:
                        message.op = 50;
                        break;
                    case "join":
                    case 80:
                        message.op = 80;
                        break;
                    case "invite":
                    case 81:
                        message.op = 81;
                        break;
                    case "leave":
                    case 82:
                        message.op = 82;
                        break;
                    case "kick":
                    case 83:
                        message.op = 83;
                        break;
                    case "reject":
                    case 84:
                        message.op = 84;
                        break;
                    case "invited":
                    case 85:
                        message.op = 85;
                        break;
                    case "kicked":
                    case 86:
                        message.op = 86;
                        break;
                    case "upload":
                    case 100:
                        message.op = 100;
                        break;
                    case "uploaded":
                    case 101:
                        message.op = 101;
                        break;
                    }
                    if (object.appId !== undefined && object.appId !== null)
                        message.appId = String(object.appId);
                    if (object.peerId !== undefined && object.peerId !== null)
                        message.peerId = String(object.peerId);
                    if (object.i !== undefined && object.i !== null)
                        message.i = object.i | 0;
                    if (object.installationId !== undefined && object.installationId !== null)
                        message.installationId = String(object.installationId);
                    if (object.priority !== undefined && object.priority !== null)
                        message.priority = object.priority | 0;
                    if (object.loginMessage !== undefined && object.loginMessage !== null) {
                        if (typeof object.loginMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.loginMessage: object expected");
                        message.loginMessage = $types[7].fromObject(object.loginMessage);
                    }
                    if (object.dataMessage !== undefined && object.dataMessage !== null) {
                        if (typeof object.dataMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.dataMessage: object expected");
                        message.dataMessage = $types[8].fromObject(object.dataMessage);
                    }
                    if (object.sessionMessage !== undefined && object.sessionMessage !== null) {
                        if (typeof object.sessionMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.sessionMessage: object expected");
                        message.sessionMessage = $types[9].fromObject(object.sessionMessage);
                    }
                    if (object.errorMessage !== undefined && object.errorMessage !== null) {
                        if (typeof object.errorMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.errorMessage: object expected");
                        message.errorMessage = $types[10].fromObject(object.errorMessage);
                    }
                    if (object.directMessage !== undefined && object.directMessage !== null) {
                        if (typeof object.directMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.directMessage: object expected");
                        message.directMessage = $types[11].fromObject(object.directMessage);
                    }
                    if (object.ackMessage !== undefined && object.ackMessage !== null) {
                        if (typeof object.ackMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.ackMessage: object expected");
                        message.ackMessage = $types[12].fromObject(object.ackMessage);
                    }
                    if (object.unreadMessage !== undefined && object.unreadMessage !== null) {
                        if (typeof object.unreadMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.unreadMessage: object expected");
                        message.unreadMessage = $types[13].fromObject(object.unreadMessage);
                    }
                    if (object.readMessage !== undefined && object.readMessage !== null) {
                        if (typeof object.readMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.readMessage: object expected");
                        message.readMessage = $types[14].fromObject(object.readMessage);
                    }
                    if (object.rcpMessage !== undefined && object.rcpMessage !== null) {
                        if (typeof object.rcpMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.rcpMessage: object expected");
                        message.rcpMessage = $types[15].fromObject(object.rcpMessage);
                    }
                    if (object.logsMessage !== undefined && object.logsMessage !== null) {
                        if (typeof object.logsMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.logsMessage: object expected");
                        message.logsMessage = $types[16].fromObject(object.logsMessage);
                    }
                    if (object.convMessage !== undefined && object.convMessage !== null) {
                        if (typeof object.convMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.convMessage: object expected");
                        message.convMessage = $types[17].fromObject(object.convMessage);
                    }
                    if (object.roomMessage !== undefined && object.roomMessage !== null) {
                        if (typeof object.roomMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.roomMessage: object expected");
                        message.roomMessage = $types[18].fromObject(object.roomMessage);
                    }
                    if (object.presenceMessage !== undefined && object.presenceMessage !== null) {
                        if (typeof object.presenceMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.presenceMessage: object expected");
                        message.presenceMessage = $types[19].fromObject(object.presenceMessage);
                    }
                    if (object.reportMessage !== undefined && object.reportMessage !== null) {
                        if (typeof object.reportMessage !== "object")
                            throw TypeError(".push_server.messages.GenericCommand.reportMessage: object expected");
                        message.reportMessage = $types[20].fromObject(object.reportMessage);
                    }
                    return message;
                };
    
                /**
                 * Creates a GenericCommand message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link push_server.messages.GenericCommand.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {push_server.messages.GenericCommand} GenericCommand
                 */
                GenericCommand.from = GenericCommand.fromObject;
    
                /**
                 * Creates a plain object from a GenericCommand message. Also converts values to other types if specified.
                 * @param {push_server.messages.GenericCommand} message GenericCommand
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GenericCommand.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.cmd = options.enums === String ? "session" : 0;
                        object.op = options.enums === String ? "open" : 1;
                        object.appId = "";
                        object.peerId = "";
                        object.i = 0;
                        object.installationId = "";
                        object.priority = 0;
                        object.loginMessage = null;
                        object.dataMessage = null;
                        object.sessionMessage = null;
                        object.errorMessage = null;
                        object.directMessage = null;
                        object.ackMessage = null;
                        object.unreadMessage = null;
                        object.readMessage = null;
                        object.rcpMessage = null;
                        object.logsMessage = null;
                        object.convMessage = null;
                        object.roomMessage = null;
                        object.presenceMessage = null;
                        object.reportMessage = null;
                    }
                    if (message.cmd !== undefined && message.cmd !== null && message.hasOwnProperty("cmd"))
                        object.cmd = options.enums === String ? $types[0][message.cmd] : message.cmd;
                    if (message.op !== undefined && message.op !== null && message.hasOwnProperty("op"))
                        object.op = options.enums === String ? $types[1][message.op] : message.op;
                    if (message.appId !== undefined && message.appId !== null && message.hasOwnProperty("appId"))
                        object.appId = message.appId;
                    if (message.peerId !== undefined && message.peerId !== null && message.hasOwnProperty("peerId"))
                        object.peerId = message.peerId;
                    if (message.i !== undefined && message.i !== null && message.hasOwnProperty("i"))
                        object.i = message.i;
                    if (message.installationId !== undefined && message.installationId !== null && message.hasOwnProperty("installationId"))
                        object.installationId = message.installationId;
                    if (message.priority !== undefined && message.priority !== null && message.hasOwnProperty("priority"))
                        object.priority = message.priority;
                    if (message.loginMessage !== undefined && message.loginMessage !== null && message.hasOwnProperty("loginMessage"))
                        object.loginMessage = $types[7].toObject(message.loginMessage, options);
                    if (message.dataMessage !== undefined && message.dataMessage !== null && message.hasOwnProperty("dataMessage"))
                        object.dataMessage = $types[8].toObject(message.dataMessage, options);
                    if (message.sessionMessage !== undefined && message.sessionMessage !== null && message.hasOwnProperty("sessionMessage"))
                        object.sessionMessage = $types[9].toObject(message.sessionMessage, options);
                    if (message.errorMessage !== undefined && message.errorMessage !== null && message.hasOwnProperty("errorMessage"))
                        object.errorMessage = $types[10].toObject(message.errorMessage, options);
                    if (message.directMessage !== undefined && message.directMessage !== null && message.hasOwnProperty("directMessage"))
                        object.directMessage = $types[11].toObject(message.directMessage, options);
                    if (message.ackMessage !== undefined && message.ackMessage !== null && message.hasOwnProperty("ackMessage"))
                        object.ackMessage = $types[12].toObject(message.ackMessage, options);
                    if (message.unreadMessage !== undefined && message.unreadMessage !== null && message.hasOwnProperty("unreadMessage"))
                        object.unreadMessage = $types[13].toObject(message.unreadMessage, options);
                    if (message.readMessage !== undefined && message.readMessage !== null && message.hasOwnProperty("readMessage"))
                        object.readMessage = $types[14].toObject(message.readMessage, options);
                    if (message.rcpMessage !== undefined && message.rcpMessage !== null && message.hasOwnProperty("rcpMessage"))
                        object.rcpMessage = $types[15].toObject(message.rcpMessage, options);
                    if (message.logsMessage !== undefined && message.logsMessage !== null && message.hasOwnProperty("logsMessage"))
                        object.logsMessage = $types[16].toObject(message.logsMessage, options);
                    if (message.convMessage !== undefined && message.convMessage !== null && message.hasOwnProperty("convMessage"))
                        object.convMessage = $types[17].toObject(message.convMessage, options);
                    if (message.roomMessage !== undefined && message.roomMessage !== null && message.hasOwnProperty("roomMessage"))
                        object.roomMessage = $types[18].toObject(message.roomMessage, options);
                    if (message.presenceMessage !== undefined && message.presenceMessage !== null && message.hasOwnProperty("presenceMessage"))
                        object.presenceMessage = $types[19].toObject(message.presenceMessage, options);
                    if (message.reportMessage !== undefined && message.reportMessage !== null && message.hasOwnProperty("reportMessage"))
                        object.reportMessage = $types[20].toObject(message.reportMessage, options);
                    return object;
                };
    
                /**
                 * Creates a plain object from this GenericCommand message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GenericCommand.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this GenericCommand to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                GenericCommand.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return GenericCommand;
            })();
    
            return messages;
        })();
    
        return push_server;
    })();
    
    // Resolve lazy type references to actual types
    $util.lazyResolve($root, $lazyTypes);

    return $root;
});
