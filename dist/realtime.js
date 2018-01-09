'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var protobufLight = _interopDefault(require('protobufjs/dist/protobuf-light'));
var EventEmitter = _interopDefault(require('eventemitter3'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _toConsumableArray = _interopDefault(require('babel-runtime/helpers/toConsumableArray'));
var _Set = _interopDefault(require('babel-runtime/core-js/set'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var d = _interopDefault(require('debug'));
var axios = _interopDefault(require('axios'));
var shuffle = _interopDefault(require('lodash/shuffle'));
var _Object$getOwnPropertyDescriptor = _interopDefault(require('babel-runtime/core-js/object/get-own-property-descriptor'));
var StateMachine = _interopDefault(require('javascript-state-machine'));
var WebSocket = _interopDefault(require('ws'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _WeakMap = _interopDefault(require('babel-runtime/core-js/weak-map'));
var _Array$from = _interopDefault(require('babel-runtime/core-js/array/from'));
var _defineProperty = _interopDefault(require('babel-runtime/helpers/defineProperty'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var isPlainObject = _interopDefault(require('lodash/isPlainObject'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _Symbol = _interopDefault(require('babel-runtime/core-js/symbol'));
var _Object$freeze = _interopDefault(require('babel-runtime/core-js/object/freeze'));
var _Object$defineProperty = _interopDefault(require('babel-runtime/core-js/object/define-property'));
var uuid = _interopDefault(require('uuid/v4'));
var _objectWithoutProperties = _interopDefault(require('babel-runtime/helpers/objectWithoutProperties'));
var _slicedToArray = _interopDefault(require('babel-runtime/helpers/slicedToArray'));
var base64Arraybuffer = require('base64-arraybuffer');
var remove = _interopDefault(require('lodash/remove'));
var _Array$find = _interopDefault(require('babel-runtime/core-js/array/find'));
var isEmpty = _interopDefault(require('lodash/isEmpty'));
var cloneDeep = _interopDefault(require('lodash/cloneDeep'));
var _getIterator = _interopDefault(require('babel-runtime/core-js/get-iterator'));

var messageCompiled = protobufLight.newBuilder({})['import']({
    "package": "push_server.messages2",
    "syntax": "proto2",
    "options": {
        "objc_class_prefix": "AVIM"
    },
    "messages": [{
        "name": "JsonObjectMessage",
        "syntax": "proto2",
        "fields": [{
            "rule": "required",
            "type": "string",
            "name": "data",
            "id": 1
        }]
    }, {
        "name": "UnreadTuple",
        "syntax": "proto2",
        "fields": [{
            "rule": "required",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "required",
            "type": "int32",
            "name": "unread",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 3
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 4
        }, {
            "rule": "optional",
            "type": "string",
            "name": "from",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "data",
            "id": 6
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "patchTimestamp",
            "id": 7
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "mentioned",
            "id": 8
        }, {
            "rule": "optional",
            "type": "bytes",
            "name": "binaryMsg",
            "id": 9
        }]
    }, {
        "name": "LogItem",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "from",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "data",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "msgId",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "ackAt",
            "id": 5
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "readAt",
            "id": 6
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "patchTimestamp",
            "id": 7
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "mentionAll",
            "id": 8
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "mentionPids",
            "id": 9
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "bin",
            "id": 10
        }]
    }, {
        "name": "ConvProperty",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "pid",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "role",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "propertyId",
            "id": 3
        }]
    }, {
        "name": "DataCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "repeated",
            "type": "string",
            "name": "ids",
            "id": 1
        }, {
            "rule": "repeated",
            "type": "JsonObjectMessage",
            "name": "msg",
            "id": 2
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "offline",
            "id": 3
        }]
    }, {
        "name": "SessionCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "n",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "s",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "ua",
            "id": 4
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "r",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "tag",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "deviceId",
            "id": 7
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "sessionPeerIds",
            "id": 8
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "onlineSessionPeerIds",
            "id": 9
        }, {
            "rule": "optional",
            "type": "string",
            "name": "st",
            "id": 10
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "stTtl",
            "id": 11
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "code",
            "id": 12
        }, {
            "rule": "optional",
            "type": "string",
            "name": "reason",
            "id": 13
        }, {
            "rule": "optional",
            "type": "string",
            "name": "deviceToken",
            "id": 14
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "sp",
            "id": 15
        }, {
            "rule": "optional",
            "type": "string",
            "name": "detail",
            "id": 16
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "lastUnreadNotifTime",
            "id": 17
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "lastPatchTime",
            "id": 18
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "configBitmap",
            "id": 19
        }]
    }, {
        "name": "ErrorCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "required",
            "type": "int32",
            "name": "code",
            "id": 1
        }, {
            "rule": "required",
            "type": "string",
            "name": "reason",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "appCode",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "detail",
            "id": 4
        }]
    }, {
        "name": "DirectCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "msg",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "uid",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "fromPeerId",
            "id": 3
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 4
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "offline",
            "id": 5
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "hasMore",
            "id": 6
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "toPeerIds",
            "id": 7
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "r",
            "id": 10
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 11
        }, {
            "rule": "optional",
            "type": "string",
            "name": "id",
            "id": 12
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "transient",
            "id": 13
        }, {
            "rule": "optional",
            "type": "string",
            "name": "dt",
            "id": 14
        }, {
            "rule": "optional",
            "type": "string",
            "name": "roomId",
            "id": 15
        }, {
            "rule": "optional",
            "type": "string",
            "name": "pushData",
            "id": 16
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "will",
            "id": 17
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "patchTimestamp",
            "id": 18
        }, {
            "rule": "optional",
            "type": "bytes",
            "name": "binaryMsg",
            "id": 19
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "mentionPids",
            "id": 20
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "mentionAll",
            "id": 21
        }]
    }, {
        "name": "AckCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "int32",
            "name": "code",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "reason",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "uid",
            "id": 6
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "fromts",
            "id": 7
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "tots",
            "id": 8
        }, {
            "rule": "optional",
            "type": "string",
            "name": "type",
            "id": 9
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "ids",
            "id": 10
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "appCode",
            "id": 11
        }]
    }, {
        "name": "UnreadCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "repeated",
            "type": "UnreadTuple",
            "name": "convs",
            "id": 1
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "notifTime",
            "id": 2
        }]
    }, {
        "name": "ConvCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "repeated",
            "type": "string",
            "name": "m",
            "id": 1
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "transient",
            "id": 2
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "unique",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 4
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cdate",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "initBy",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "sort",
            "id": 7
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "limit",
            "id": 8
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "skip",
            "id": 9
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "flag",
            "id": 10
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "count",
            "id": 11
        }, {
            "rule": "optional",
            "type": "string",
            "name": "udate",
            "id": 12
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 13
        }, {
            "rule": "optional",
            "type": "string",
            "name": "n",
            "id": 14
        }, {
            "rule": "optional",
            "type": "string",
            "name": "s",
            "id": 15
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "statusSub",
            "id": 16
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "statusPub",
            "id": 17
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "statusTTL",
            "id": 18
        }, {
            "rule": "optional",
            "type": "string",
            "name": "uniqueId",
            "id": 19
        }, {
            "rule": "optional",
            "type": "string",
            "name": "targetClientId",
            "id": 20
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "maxReadTimestamp",
            "id": 21
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "maxAckTimestamp",
            "id": 22
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "queryAllMembers",
            "id": 23
        }, {
            "rule": "repeated",
            "type": "MaxReadTuple",
            "name": "maxReadTuples",
            "id": 24
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "cids",
            "id": 25
        }, {
            "rule": "optional",
            "type": "ConvProperty",
            "name": "property",
            "id": 26
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "tempConv",
            "id": 27
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "tempConvTTL",
            "id": 28
        }, {
            "rule": "optional",
            "type": "string",
            "name": "tempConvId",
            "id": 29
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "convBlockedPids",
            "id": 30
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "clientBlockedPids",
            "id": 31
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "allowedPids",
            "id": 32
        }, {
            "rule": "optional",
            "type": "JsonObjectMessage",
            "name": "results",
            "id": 100
        }, {
            "rule": "optional",
            "type": "JsonObjectMessage",
            "name": "where",
            "id": 101
        }, {
            "rule": "optional",
            "type": "JsonObjectMessage",
            "name": "attr",
            "id": 103
        }]
    }, {
        "name": "RoomCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "roomId",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "s",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "n",
            "id": 4
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "transient",
            "id": 5
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "roomPeerIds",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "byPeerId",
            "id": 7
        }]
    }, {
        "name": "LogsCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "l",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "limit",
            "id": 3
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "tt",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "tmid",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 7
        }, {
            "rule": "optional",
            "type": "string",
            "name": "checksum",
            "id": 8
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "stored",
            "id": 9
        }, {
            "rule": "optional",
            "type": "QueryDirection",
            "name": "direction",
            "id": 10,
            "options": {
                "default": "OLD"
            }
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "tIncluded",
            "id": 11
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "ttIncluded",
            "id": 12
        }, {
            "rule": "repeated",
            "type": "LogItem",
            "name": "logs",
            "id": 105
        }],
        "enums": [{
            "name": "QueryDirection",
            "syntax": "proto2",
            "values": [{
                "name": "OLD",
                "id": 1
            }, {
                "name": "NEW",
                "id": 2
            }]
        }]
    }, {
        "name": "RcpCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "id",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "t",
            "id": 3
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "read",
            "id": 4
        }, {
            "rule": "optional",
            "type": "string",
            "name": "from",
            "id": 5
        }]
    }, {
        "name": "ReadTuple",
        "syntax": "proto2",
        "fields": [{
            "rule": "required",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 3
        }]
    }, {
        "name": "MaxReadTuple",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "pid",
            "id": 1
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "maxAckTimestamp",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "maxReadTimestamp",
            "id": 3
        }]
    }, {
        "name": "ReadCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "cids",
            "id": 2
        }, {
            "rule": "repeated",
            "type": "ReadTuple",
            "name": "convs",
            "id": 3
        }]
    }, {
        "name": "PresenceCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "StatusType",
            "name": "status",
            "id": 1
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "sessionPeerIds",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 3
        }]
    }, {
        "name": "ReportCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "bool",
            "name": "initiative",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "type",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "data",
            "id": 3
        }]
    }, {
        "name": "PatchItem",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "optional",
            "type": "string",
            "name": "mid",
            "id": 2
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "timestamp",
            "id": 3
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "recall",
            "id": 4
        }, {
            "rule": "optional",
            "type": "string",
            "name": "data",
            "id": 5
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "patchTimestamp",
            "id": 6
        }, {
            "rule": "optional",
            "type": "string",
            "name": "from",
            "id": 7
        }, {
            "rule": "optional",
            "type": "bytes",
            "name": "binaryMsg",
            "id": 8
        }, {
            "rule": "optional",
            "type": "bool",
            "name": "mentionAll",
            "id": 9
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "mentionPids",
            "id": 10
        }]
    }, {
        "name": "PatchCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "repeated",
            "type": "PatchItem",
            "name": "patches",
            "id": 1
        }, {
            "rule": "optional",
            "type": "int64",
            "name": "lastPatchTime",
            "id": 2
        }]
    }, {
        "name": "PubsubCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "cid",
            "id": 1
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "cids",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "topic",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "subtopic",
            "id": 4
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "topics",
            "id": 5
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "subtopics",
            "id": 6
        }, {
            "rule": "optional",
            "type": "JsonObjectMessage",
            "name": "results",
            "id": 7
        }]
    }, {
        "name": "BlacklistCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "string",
            "name": "srcCid",
            "id": 1
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "toPids",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "srcPid",
            "id": 3
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "toCids",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "limit",
            "id": 5,
            "options": {
                "default": 100
            }
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "offset",
            "id": 6,
            "options": {
                "default": 0
            }
        }, {
            "rule": "optional",
            "type": "string",
            "name": "lastRk",
            "id": 7
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "blockedPids",
            "id": 8
        }, {
            "rule": "repeated",
            "type": "string",
            "name": "blockedCids",
            "id": 9
        }]
    }, {
        "name": "GenericCommand",
        "syntax": "proto2",
        "fields": [{
            "rule": "optional",
            "type": "CommandType",
            "name": "cmd",
            "id": 1
        }, {
            "rule": "optional",
            "type": "OpType",
            "name": "op",
            "id": 2
        }, {
            "rule": "optional",
            "type": "string",
            "name": "appId",
            "id": 3
        }, {
            "rule": "optional",
            "type": "string",
            "name": "peerId",
            "id": 4
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "i",
            "id": 5
        }, {
            "rule": "optional",
            "type": "string",
            "name": "installationId",
            "id": 6
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "priority",
            "id": 7
        }, {
            "rule": "optional",
            "type": "int32",
            "name": "service",
            "id": 8
        }, {
            "rule": "optional",
            "type": "DataCommand",
            "name": "dataMessage",
            "id": 101
        }, {
            "rule": "optional",
            "type": "SessionCommand",
            "name": "sessionMessage",
            "id": 102
        }, {
            "rule": "optional",
            "type": "ErrorCommand",
            "name": "errorMessage",
            "id": 103
        }, {
            "rule": "optional",
            "type": "DirectCommand",
            "name": "directMessage",
            "id": 104
        }, {
            "rule": "optional",
            "type": "AckCommand",
            "name": "ackMessage",
            "id": 105
        }, {
            "rule": "optional",
            "type": "UnreadCommand",
            "name": "unreadMessage",
            "id": 106
        }, {
            "rule": "optional",
            "type": "ReadCommand",
            "name": "readMessage",
            "id": 107
        }, {
            "rule": "optional",
            "type": "RcpCommand",
            "name": "rcpMessage",
            "id": 108
        }, {
            "rule": "optional",
            "type": "LogsCommand",
            "name": "logsMessage",
            "id": 109
        }, {
            "rule": "optional",
            "type": "ConvCommand",
            "name": "convMessage",
            "id": 110
        }, {
            "rule": "optional",
            "type": "RoomCommand",
            "name": "roomMessage",
            "id": 111
        }, {
            "rule": "optional",
            "type": "PresenceCommand",
            "name": "presenceMessage",
            "id": 112
        }, {
            "rule": "optional",
            "type": "ReportCommand",
            "name": "reportMessage",
            "id": 113
        }, {
            "rule": "optional",
            "type": "PatchCommand",
            "name": "patchMessage",
            "id": 114
        }, {
            "rule": "optional",
            "type": "PubsubCommand",
            "name": "pubsubMessage",
            "id": 115
        }, {
            "rule": "optional",
            "type": "BlacklistCommand",
            "name": "blacklistMessage",
            "id": 116
        }]
    }],
    "enums": [{
        "name": "CommandType",
        "syntax": "proto2",
        "values": [{
            "name": "session",
            "id": 0
        }, {
            "name": "conv",
            "id": 1
        }, {
            "name": "direct",
            "id": 2
        }, {
            "name": "ack",
            "id": 3
        }, {
            "name": "rcp",
            "id": 4
        }, {
            "name": "unread",
            "id": 5
        }, {
            "name": "logs",
            "id": 6
        }, {
            "name": "error",
            "id": 7
        }, {
            "name": "login",
            "id": 8
        }, {
            "name": "data",
            "id": 9
        }, {
            "name": "room",
            "id": 10
        }, {
            "name": "read",
            "id": 11
        }, {
            "name": "presence",
            "id": 12
        }, {
            "name": "report",
            "id": 13
        }, {
            "name": "echo",
            "id": 14
        }, {
            "name": "loggedin",
            "id": 15
        }, {
            "name": "logout",
            "id": 16
        }, {
            "name": "loggedout",
            "id": 17
        }, {
            "name": "patch",
            "id": 18
        }, {
            "name": "pubsub",
            "id": 19
        }, {
            "name": "blacklist",
            "id": 20
        }]
    }, {
        "name": "OpType",
        "syntax": "proto2",
        "values": [{
            "name": "open",
            "id": 1
        }, {
            "name": "add",
            "id": 2
        }, {
            "name": "remove",
            "id": 3
        }, {
            "name": "close",
            "id": 4
        }, {
            "name": "opened",
            "id": 5
        }, {
            "name": "closed",
            "id": 6
        }, {
            "name": "query",
            "id": 7
        }, {
            "name": "query_result",
            "id": 8
        }, {
            "name": "conflict",
            "id": 9
        }, {
            "name": "added",
            "id": 10
        }, {
            "name": "removed",
            "id": 11
        }, {
            "name": "refresh",
            "id": 12
        }, {
            "name": "refreshed",
            "id": 13
        }, {
            "name": "start",
            "id": 30
        }, {
            "name": "started",
            "id": 31
        }, {
            "name": "joined",
            "id": 32
        }, {
            "name": "members_joined",
            "id": 33
        }, {
            "name": "left",
            "id": 39
        }, {
            "name": "members_left",
            "id": 40
        }, {
            "name": "results",
            "id": 42
        }, {
            "name": "count",
            "id": 43
        }, {
            "name": "result",
            "id": 44
        }, {
            "name": "update",
            "id": 45
        }, {
            "name": "updated",
            "id": 46
        }, {
            "name": "mute",
            "id": 47
        }, {
            "name": "unmute",
            "id": 48
        }, {
            "name": "status",
            "id": 49
        }, {
            "name": "members",
            "id": 50
        }, {
            "name": "max_read",
            "id": 51
        }, {
            "name": "is_member",
            "id": 52
        }, {
            "name": "property_update",
            "id": 53
        }, {
            "name": "property_updated",
            "id": 54
        }, {
            "name": "property_changed",
            "id": 55
        }, {
            "name": "join",
            "id": 80
        }, {
            "name": "invite",
            "id": 81
        }, {
            "name": "leave",
            "id": 82
        }, {
            "name": "kick",
            "id": 83
        }, {
            "name": "reject",
            "id": 84
        }, {
            "name": "invited",
            "id": 85
        }, {
            "name": "kicked",
            "id": 86
        }, {
            "name": "upload",
            "id": 100
        }, {
            "name": "uploaded",
            "id": 101
        }, {
            "name": "subscribe",
            "id": 120
        }, {
            "name": "subscribed",
            "id": 121
        }, {
            "name": "unsubscribe",
            "id": 122
        }, {
            "name": "unsubscribed",
            "id": 123
        }, {
            "name": "is_subscribed",
            "id": 124
        }, {
            "name": "modify",
            "id": 150
        }, {
            "name": "modified",
            "id": 151
        }, {
            "name": "block",
            "id": 170
        }, {
            "name": "unblock",
            "id": 171
        }]
    }, {
        "name": "StatusType",
        "syntax": "proto2",
        "values": [{
            "name": "on",
            "id": 1
        }, {
            "name": "off",
            "id": 2
        }]
    }],
    "isNamespace": true
}).build();

var _messages$push_server = messageCompiled.push_server.messages2;
var JsonObjectMessage = _messages$push_server.JsonObjectMessage;
var UnreadTuple = _messages$push_server.UnreadTuple;
var LogItem = _messages$push_server.LogItem;
var DataCommand = _messages$push_server.DataCommand;
var SessionCommand = _messages$push_server.SessionCommand;
var ErrorCommand = _messages$push_server.ErrorCommand;
var DirectCommand = _messages$push_server.DirectCommand;
var AckCommand = _messages$push_server.AckCommand;
var UnreadCommand = _messages$push_server.UnreadCommand;
var ConvCommand = _messages$push_server.ConvCommand;
var RoomCommand = _messages$push_server.RoomCommand;
var LogsCommand = _messages$push_server.LogsCommand;
var RcpCommand = _messages$push_server.RcpCommand;
var ReadTuple = _messages$push_server.ReadTuple;
var MaxReadTuple = _messages$push_server.MaxReadTuple;
var ReadCommand = _messages$push_server.ReadCommand;
var PresenceCommand = _messages$push_server.PresenceCommand;
var ReportCommand = _messages$push_server.ReportCommand;
var GenericCommand = _messages$push_server.GenericCommand;
var PatchCommand = _messages$push_server.PatchCommand;
var PatchItem = _messages$push_server.PatchItem;
var CommandType = _messages$push_server.CommandType;
var OpType = _messages$push_server.OpType;
var StatusType = _messages$push_server.StatusType;




var message = Object.freeze({
	JsonObjectMessage: JsonObjectMessage,
	UnreadTuple: UnreadTuple,
	LogItem: LogItem,
	DataCommand: DataCommand,
	SessionCommand: SessionCommand,
	ErrorCommand: ErrorCommand,
	DirectCommand: DirectCommand,
	AckCommand: AckCommand,
	UnreadCommand: UnreadCommand,
	ConvCommand: ConvCommand,
	RoomCommand: RoomCommand,
	LogsCommand: LogsCommand,
	RcpCommand: RcpCommand,
	ReadTuple: ReadTuple,
	MaxReadTuple: MaxReadTuple,
	ReadCommand: ReadCommand,
	PresenceCommand: PresenceCommand,
	ReportCommand: ReportCommand,
	GenericCommand: GenericCommand,
	PatchCommand: PatchCommand,
	PatchItem: PatchItem,
	CommandType: CommandType,
	OpType: OpType,
	StatusType: StatusType
});

/* eslint-disable */
var global$1 = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};

var EXPIRED = _Symbol('expired');
var debug$3 = d('LC:Expirable');

var Expirable = function () {
  function Expirable(value, ttl) {
    _classCallCheck(this, Expirable);

    this._value = value;
    if (typeof ttl === 'number') {
      this.expiredAt = Date.now() + ttl;
    }
  }

  _createClass(Expirable, [{
    key: 'value',
    get: function get() {
      var expired = this.expiredAt && this.expiredAt < Date.now();
      if (expired) debug$3('expired: ' + this._value);
      return expired ? EXPIRED : this._value;
    }
  }]);

  return Expirable;
}();

Expirable.EXPIRED = EXPIRED;

var debug$4 = d('LC:Cache');

var Cache = function () {
  function Cache() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'anonymous';

    _classCallCheck(this, Cache);

    this.name = name;
    this._map = {};
  }

  Cache.prototype.get = function get(key) {
    var cache = this._map[key];
    if (cache) {
      var value = cache.value;

      if (value !== Expirable.EXPIRED) {
        debug$4('[%s] hit: %s %O', this.name, key, value);
        return value;
      }
      delete this._map[key];
    }
    debug$4('[' + this.name + '] missed: ' + key);
    return null;
  };

  Cache.prototype.set = function set(key, value, ttl) {
    debug$4('[%s] set: %s %O %d', this.name, key, value, ttl);
    this._map[key] = new Expirable(value, ttl);
  };

  return Cache;
}();

var tryAll = function tryAll(promiseConstructors) {
  var promise = new _Promise(promiseConstructors[0]);
  if (promiseConstructors.length === 1) {
    return promise;
  }
  return promise.catch(function () {
    return tryAll(promiseConstructors.slice(1));
  });
};

var tap = function tap(interceptor) {
  return function (value) {
    return interceptor(value), value;
  };
};

/**
 * 将对象转换为 Date，支持 string、number、ProtoBuf Long 以及 LeanCloud 的 Date 类型，
 * 其他情况下（包括对象为 falsy）返回原值。
 * @private
 */
var decodeDate = function decodeDate(date) {
  if (!date) return date;
  if (typeof date === 'string' || typeof date === 'number') {
    return new Date(date);
  }
  if (date.__type === 'Date' && date.iso) {
    return new Date(date.iso);
  }
  // Long
  if (typeof date.toNumber === 'function') {
    return new Date(date.toNumber());
  }
  return date;
};
/**
 * 获取 Date 的毫秒数，如果不是一个 Date 返回 undefined。
 * @private
 */
var getTime = function getTime(date) {
  return date && date.getTime ? date.getTime() : undefined;
};

/**
 * 解码对象中的 LeanCloud 数据结构。
 * 目前仅会处理 Date 类型。
 * @private
 */
var decode$1 = function decode$$1(value) {
  if (!value) return value;
  if (value.__type === 'Date' && value.iso) {
    return new Date(value.iso);
  }
  if (isPlainObject(value)) {
    return _Object$keys(value).reduce(function (result, key) {
      return _extends({}, result, _defineProperty({}, key, decode$$1(value[key])));
    }, {});
  }
  return value;
};
/**
 * 将对象中的特殊类型编码为 LeanCloud 数据结构。
 * 目前仅会处理 Date 类型。
 * @private
 */
var encode$1 = function encode$$1(value) {
  if (value instanceof Date) return { __type: 'Date', iso: value.toJSON() };
  if (isPlainObject(value)) {
    return _Object$keys(value).reduce(function (result, key) {
      return _extends({}, result, _defineProperty({}, key, encode$$1(value[key])));
    }, {});
  }
  return value;
};

var keyRemap = function keyRemap(keymap, obj) {
  return _Object$keys(obj).reduce(function (newObj, key) {
    var newKey = keymap[key] || key;
    return _Object$assign(newObj, _defineProperty({}, newKey, obj[key]));
  }, {});
};

var isIE10 = global$1.navigator && global$1.navigator.userAgent && global$1.navigator.userAgent.indexOf('MSIE 10.') !== -1;

/* eslint-disable no-proto */
var getStaticProperty = function getStaticProperty(klass, property) {
  return klass[property] || (klass.__proto__ ? getStaticProperty(klass.__proto__, property) : undefined);
};
/* eslint-enable no-proto */

var union = function union(a, b) {
  return _Array$from(new _Set([].concat(_toConsumableArray(a), _toConsumableArray(b))));
};
var difference = function difference(a, b) {
  return _Array$from(function (bSet) {
    return new _Set(a.filter(function (x) {
      return !bSet.has(x);
    }));
  }(new _Set(b)));
};

var map = new _WeakMap();

// protected property helper
var internal = function internal(object) {
  if (!map.has(object)) {
    map.set(object, {});
  }
  return map.get(object);
};

var compact = function compact(obj, filter) {
  if (!isPlainObject(obj)) return obj;
  var object = _Object$assign({}, obj);
  // eslint-disable-next-line no-restricted-syntax
  for (var prop in object) {
    if ({}.hasOwnProperty.call(object, prop)) {
      var value = object[prop];
      if (value === filter) {
        delete object[prop];
      } else {
        object[prop] = compact(value, filter);
      }
    }
  }
  return object;
};

// debug utility
var removeNull = function removeNull(obj) {
  return compact(obj, null);
};
var trim = function trim(message) {
  return removeNull(JSON.parse(_JSON$stringify(message)));
};

var ensureArray = function ensureArray(target) {
  if (Array.isArray(target)) {
    return target;
  }
  if (target === undefined || target === null) {
    return [];
  }
  return [target];
};

var setValue = function setValue(target, key, value) {
  // '.' is not allowed in Class keys, escaping is not in concern now.
  var segs = key.split('.');
  var lastSeg = segs.pop();
  var currentTarget = target;
  segs.forEach(function (seg) {
    if (currentTarget[seg] === undefined) currentTarget[seg] = {};
    currentTarget = currentTarget[seg];
  });
  currentTarget[lastSeg] = value;
  return target;
};

// eslint-disable-next-line no-undef
var isWeapp = (typeof wx === 'undefined' ? 'undefined' : _typeof(wx)) === 'object' && typeof wx.connectSocket === 'function';

// throttle decorator
var throttle = function throttle(wait) {
  return function (target, property, descriptor) {
    var callback = descriptor.value;
    // very naive, internal use only
    if (callback.length) {
      throw new Error('throttled function should not accept any arguments');
    }
    return _extends({}, descriptor, {
      value: function value() {
        var _this = this;

        var _internal = internal(this),
            throttleMeta = _internal.throttleMeta;

        if (!throttleMeta) {
          throttleMeta = {};
          internal(this).throttleMeta = throttleMeta;
        }
        var _throttleMeta = throttleMeta,
            propertyMeta = _throttleMeta[property];

        if (!propertyMeta) {
          propertyMeta = {};
          throttleMeta[property] = propertyMeta;
        }
        var _propertyMeta = propertyMeta,
            _propertyMeta$previou = _propertyMeta.previouseTimestamp,
            previouseTimestamp = _propertyMeta$previou === undefined ? 0 : _propertyMeta$previou,
            timeout = _propertyMeta.timeout;

        var now = Date.now();
        var remainingTime = wait - (now - previouseTimestamp);
        if (remainingTime <= 0) {
          throttleMeta[property].previouseTimestamp = now;
          callback.apply(this);
        } else if (!timeout) {
          propertyMeta.timeout = setTimeout(function () {
            propertyMeta.previouseTimestamp = Date.now();
            delete propertyMeta.timeout;
            callback.apply(_this);
          }, remainingTime);
        }
      }
    });
  };
};

var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

// WebSocket with auto reconnecting feature, backup endpoint and EventEmitter interface.

var debug$2 = d('LC:WebSocketPlus');

var HEARTBEAT_TIME = 180000;
var TIMEOUT_TIME = 380000;

var DEFAULT_RETRY_STRATEGY = function DEFAULT_RETRY_STRATEGY(attempt) {
  return Math.min(1000 * Math.pow(2, attempt), 300000);
};

var requireConnected = function requireConnected(target, name, descriptor) {
  return _Object$assign({}, descriptor, {
    value: function requireConnectedWrapper() {
      var _descriptor$value;

      if (!this.is('connected')) {
        var currentState = this.current;
        console.warn(name + ' should not be called when the connection is ' + currentState);
        if (this.is('disconnected') || this.is('reconnecting')) {
          console.warn('disconnect and reconnect event should be handled to avoid such calls.');
        }
        throw new Error('Connection unavailable');
      }

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_descriptor$value = descriptor.value).call.apply(_descriptor$value, [this].concat(args));
    }
  });
};

var WebSocketPlus = (_class = function (_EventEmitter) {
  _inherits(WebSocketPlus, _EventEmitter);

  function WebSocketPlus(getUrls, protocol) {
    _classCallCheck(this, WebSocketPlus);

    if (typeof WebSocket === 'undefined') {
      throw new Error('WebSocket is undefined. Polyfill is required in this runtime.');
    }

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    if (typeof getUrls !== 'function') {
      _this._getUrls = function () {
        return _Promise.resolve(getUrls);
      };
    } else {
      _this._getUrls = getUrls;
    }
    _this._protocol = protocol;
    _this.init();
    _this._createWs(_this._getUrls, _this._protocol).then(function () {
      _this.__postponeTimeoutTimer = _this._postponeTimeoutTimer.bind(_this);
      if (global$1.addEventListener) {
        _this.__pause = function () {
          return _this.pause();
        };
        _this.__resume = function () {
          return _this.resume();
        };
        global$1.addEventListener('offline', _this.__pause);
        global$1.addEventListener('online', _this.__resume);
      }
      _this.open();
    }).catch(_this.throw.bind(_this));
    return _this;
  }

  WebSocketPlus.prototype._createWs = function _createWs(getUrls, protocol) {
    var _this2 = this;

    return getUrls().then(function (urls) {
      return tryAll(ensureArray(urls).map(function (url) {
        return function (resolve, reject) {
          debug$2('connect [' + url + '] ' + protocol);
          var ws = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
          ws.binaryType = _this2.binaryType || 'arraybuffer';
          ws.onopen = function () {
            return resolve(ws);
          };
          ws.onclose = function (error) {
            if (error instanceof Error) {
              return reject(error);
            }
            // in browser, error event is useless
            return reject(new Error('Failed to connect [' + url + ']'));
          };
          ws.onerror = ws.onclose;
        };
      })).then(function (ws) {
        _this2._ws = ws;
        _this2._ws.onclose = _this2._handleClose.bind(_this2);
        _this2._ws.onmessage = _this2._handleMessage.bind(_this2);
        return ws;
      });
    });
  };

  WebSocketPlus.prototype._destroyWs = function _destroyWs() {
    var ws = this._ws;
    if (!ws) return;
    ws.onopen = null;
    ws.onclose = null;
    ws.onerror = null;
    ws.onmessage = null;
    this._ws = null;
    ws.close();
  };

  // eslint-disable-next-line class-methods-use-this


  WebSocketPlus.prototype.onbeforeevent = function onbeforeevent(event, from, to) {
    for (var _len2 = arguments.length, payload = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      payload[_key2 - 3] = arguments[_key2];
    }

    debug$2.apply(undefined, [event + ': ' + from + ' -> ' + to].concat(payload));
  };

  WebSocketPlus.prototype.onopen = function onopen() {
    this.emit('open');
  };

  WebSocketPlus.prototype.onconnected = function onconnected() {
    this._startConnectionKeeper();
  };

  WebSocketPlus.prototype.onleaveconnected = function onleaveconnected(event, from, to) {
    this._stopConnectionKeeper();
    this._destroyWs();
    if (to === 'offline' || to === 'disconnected') {
      this.emit('disconnect');
    }
  };

  WebSocketPlus.prototype.onpause = function onpause() {
    this.emit('offline');
  };

  WebSocketPlus.prototype.onbeforeresume = function onbeforeresume() {
    this.emit('online');
  };

  WebSocketPlus.prototype.onreconnect = function onreconnect() {
    this.emit('reconnect');
  };

  WebSocketPlus.prototype.ondisconnected = function ondisconnected(event, from, to) {
    var _this3 = this;

    var attempt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var delay = DEFAULT_RETRY_STRATEGY.call(null, attempt);
    debug$2('schedule attempt=' + attempt + ' delay=' + delay);
    this.emit('schedule', attempt, delay);
    if (this.__scheduledRetry) {
      clearTimeout(this.__scheduledRetry);
    }
    this.__scheduledRetry = setTimeout(function () {
      if (_this3.is('disconnected')) {
        _this3.retry(attempt);
      }
    }, delay);
  };

  WebSocketPlus.prototype.onretry = function onretry(event, from, to) {
    var _this4 = this;

    var attempt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    this.emit('retry', attempt);
    this._createWs(this._getUrls, this._protocol).then(function () {
      return _this4.can('reconnect') ? _this4.reconnect() : _this4._destroyWs();
    }, function () {
      return _this4.can('fail') && _this4.fail(attempt + 1);
    });
  };

  WebSocketPlus.prototype.onerror = function onerror(event, from, to, error) {
    this.emit('error', error);
  };

  WebSocketPlus.prototype.onclose = function onclose() {
    if (global$1.removeEventListener) {
      if (this.__pause) global$1.removeEventListener('offline', this.__pause);
      if (this.__resume) global$1.removeEventListener('online', this.__resume);
    }
  };

  // jsdoc-ignore-start


  // jsdoc-ignore-end
  WebSocketPlus.prototype._ping = function _ping() {
    debug$2('ping');
    try {
      this.ping();
    } catch (error) {
      console.warn('websocket ping error: ' + error.message);
    }
  };

  WebSocketPlus.prototype.ping = function ping() {
    if (this._ws.ping) {
      this._ws.ping();
    } else {
      console.warn('The WebSocket implement does not support sending ping frame.\n        Override ping method to use application defined ping/pong mechanism.');
    }
  };

  WebSocketPlus.prototype._postponeTimeoutTimer = function _postponeTimeoutTimer() {
    var _this5 = this;

    debug$2('_postponeTimeoutTimer');
    this._clearTimeoutTimers();
    this._timeoutTimer = setTimeout(function () {
      debug$2('timeout');
      _this5.disconnect();
    }, TIMEOUT_TIME);
  };

  WebSocketPlus.prototype._clearTimeoutTimers = function _clearTimeoutTimers() {
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer);
    }
  };

  WebSocketPlus.prototype._startConnectionKeeper = function _startConnectionKeeper() {
    debug$2('start connection keeper');
    this._heartbeatTimer = setInterval(this._ping.bind(this), HEARTBEAT_TIME);
    var addListener = this._ws.addListener || this._ws.addEventListener;
    addListener.call(this._ws, 'message', this.__postponeTimeoutTimer);
    addListener.call(this._ws, 'pong', this.__postponeTimeoutTimer);
    this._postponeTimeoutTimer();
  };

  WebSocketPlus.prototype._stopConnectionKeeper = function _stopConnectionKeeper() {
    debug$2('stop connection keeper');
    // websockets/ws#489
    var removeListener = this._ws.removeListener || this._ws.removeEventListener;
    removeListener.call(this._ws, 'message', this.__postponeTimeoutTimer);
    removeListener.call(this._ws, 'pong', this.__postponeTimeoutTimer);
    this._clearTimeoutTimers();
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
    }
  };

  WebSocketPlus.prototype._handleClose = function _handleClose(event) {
    debug$2('ws closed [' + event.code + '] ' + event.reason);
    // socket closed manually, ignore close event.
    if (this.isFinished()) return;
    this.handleClose(event);
  };

  WebSocketPlus.prototype.handleClose = function handleClose() {
    // reconnect
    this.disconnect();
  };

  // jsdoc-ignore-start


  // jsdoc-ignore-end
  WebSocketPlus.prototype.send = function send(data) {
    debug$2('send', data);
    this._ws.send(data);
  };

  WebSocketPlus.prototype._handleMessage = function _handleMessage(event) {
    debug$2('message', event.data);
    this.handleMessage(event.data);
  };

  WebSocketPlus.prototype.handleMessage = function handleMessage(message) {
    this.emit('message', message);
  };

  return WebSocketPlus;
}(EventEmitter), (_applyDecoratedDescriptor(_class.prototype, '_ping', [requireConnected], _Object$getOwnPropertyDescriptor(_class.prototype, '_ping'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'send', [requireConnected], _Object$getOwnPropertyDescriptor(_class.prototype, 'send'), _class.prototype)), _class);


StateMachine.create({
  target: WebSocketPlus.prototype,
  initial: {
    state: 'initialized',
    event: 'init',
    defer: true
  },
  terminal: 'closed',
  events: [{
    name: 'open',
    from: 'initialized',
    to: 'connected'
  }, {
    name: 'disconnect',
    from: 'connected',
    to: 'disconnected'
  }, {
    name: 'retry',
    from: 'disconnected',
    to: 'reconnecting'
  }, {
    name: 'fail',
    from: 'reconnecting',
    to: 'disconnected'
  }, {
    name: 'reconnect',
    from: 'reconnecting',
    to: 'connected'
  }, {
    name: 'pause',
    from: ['connected', 'disconnected', 'reconnecting'],
    to: 'offline'
  }, {}, {
    name: 'resume',
    from: 'offline',
    to: 'disconnected'
  }, {
    name: 'close',
    from: ['connected', 'disconnected', 'reconnecting', 'offline'],
    to: 'closed'
  }, {
    name: 'throw',
    from: '*',
    to: 'error'
  }]
});

var error = _Object$freeze({
  1000: {
    name: 'CLOSE_NORMAL'
  },
  1006: {
    name: 'CLOSE_ABNORMAL'
  },
  4100: {
    name: 'APP_NOT_AVAILABLE',
    message: 'App not exists or realtime message service is disabled.'
  },
  4103: {
    name: 'INVALID_LOGIN',
    message: 'Malformed clientId.'
  },
  4105: {
    name: 'SESSION_REQUIRED',
    message: 'Message sent before session opened. '
  },
  4107: {
    name: 'READ_TIMEOUT'
  },
  4108: {
    name: 'LOGIN_TIMEOUT'
  },
  4109: {
    name: 'FRAME_TOO_LONG'
  },
  4110: {
    name: 'INVALID_ORIGIN',
    message: 'Access denied by domain whitelist.'
  },
  4111: {
    name: 'SESSION_CONFLICT'
  },
  4112: {
    name: 'SESSION_TOKEN_EXPIRED'
  },
  4200: {
    name: 'INTERNAL_ERROR',
    message: 'Internal error, please contact LeanCloud for support.'
  },
  4201: {
    name: 'SEND_MESSAGE_TIMEOUT'
  },
  4302: {
    name: 'CONVERSATION_SIGNATURE_FAILED'
  },
  4303: {
    name: 'CONVERSATION_NOT_FOUND'
  },
  4304: {
    name: 'CONVERSATION_FULL'
  },
  4305: {
    name: 'CONVERSATION_REJECTED_BY_APP'
  },
  4306: {
    name: 'CONVERSATION_UPDATE_FAILED'
  },
  4307: {
    name: 'CONVERSATION_READ_ONLY'
  },
  4308: {
    name: 'CONVERSATION_NOT_ALLOWED'
  },
  4317: {
    name: 'CONVERSATION_EXPIRED',
    message: 'Temporary conversation expired or does not exist.'
  },
  4401: {
    name: 'INVALID_MESSAGING_TARGET'
  },
  4402: {
    name: 'MESSAGE_REJECTED_BY_APP'
  }
});

var ErrorCode = _Object$freeze(_Object$keys(error).reduce(function (result, code) {
  return _Object$assign(result, _defineProperty({}, error[code].name, Number(code)));
}, {}));

var createError = function createError(errorMessage) {
  var code = errorMessage.code,
      reason = errorMessage.reason,
      appCode = errorMessage.appCode,
      detail = errorMessage.detail;

  var message = reason || detail;
  if (!message && error[code]) {
    message = error[code].message || error[code].name;
  }
  if (!message) {
    message = 'Unknow Error: ' + code;
  }
  var err = new Error(message);
  return _Object$assign(err, {
    code: code, appCode: appCode, detail: detail
  });
};

var debug$1 = d('LC:Connection');

var COMMAND_TIMEOUT = 20000;

var Connection = function (_WebSocketPlus) {
  _inherits(Connection, _WebSocketPlus);

  function Connection(getUrl, _ref) {
    var format = _ref.format,
        version = _ref.version;

    _classCallCheck(this, Connection);

    debug$1('initializing Connection');
    var protocolString = 'lc.' + format + '.' + version;
    if (!isWeapp) {
      var _this = _possibleConstructorReturn(this, _WebSocketPlus.call(this, getUrl, protocolString));
    } else {
      var _this = _possibleConstructorReturn(this, _WebSocketPlus.call(this, getUrl().then(function (urls) {
        return urls.map(function (url) {
          return '' + url + (url.indexOf('?') === -1 ? '?' : '&') + 'subprotocol=' + encodeURIComponent(protocolString);
        });
      })));
    }
    _this._protocalFormat = format;
    _this._commands = {};
    _this._serialId = 0;
    return _possibleConstructorReturn(_this);
  }

  Connection.prototype.send = function send(command) {
    var _this2 = this;

    var waitingForRespond = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var serialId = void 0;
    if (waitingForRespond) {
      this._serialId += 1;
      serialId = this._serialId;
      command.i = serialId; // eslint-disable-line no-param-reassign
    }
    debug$1('↑ %O sent', trim(command));

    var message = void 0;
    if (this._protocalFormat === 'proto2base64') {
      message = command.toBase64();
    } else if (command.toArrayBuffer) {
      message = command.toArrayBuffer();
    }
    if (!message) {
      throw new TypeError(command + ' is not a GenericCommand');
    }

    _WebSocketPlus.prototype.send.call(this, message);

    if (!waitingForRespond) {
      return _Promise.resolve();
    }
    return new _Promise(function (resolve, reject) {
      _this2._commands[serialId] = {
        resolve: resolve,
        reject: reject,
        timeout: setTimeout(function () {
          if (_this2._commands[serialId]) {
            debug$1('✗ %O timeout', trim(command));
            reject(new Error('Command Timeout.'));
            delete _this2._commands[serialId];
          }
        }, COMMAND_TIMEOUT)
      };
    });
  };

  Connection.prototype.handleMessage = function handleMessage(msg) {
    var message = void 0;
    try {
      message = GenericCommand.decode(msg);
      debug$1('↓ %O received', trim(message));
    } catch (e) {
      console.warn('Decode message failed', msg);
    }
    this.emit('allmessage', message);
    var serialId = message.i;
    if (serialId) {
      if (this._commands[serialId]) {
        clearTimeout(this._commands[serialId].timeout);
        if (message.cmd === CommandType.error) {
          this._commands[serialId].reject(createError(message.errorMessage));
        } else {
          this._commands[serialId].resolve(message);
        }
        delete this._commands[serialId];
      } else {
        console.warn('Unexpected command received with serialId [' + serialId + '],\n         which have timed out or never been requested.');
      }
    } else if (message.cmd === CommandType.error) {
      this.emit('error', createError(message.errorMessage));
    } else {
      this.emit('message', message);
    }
  };

  Connection.prototype.ping = function ping() {
    return this.send(new GenericCommand({
      cmd: CommandType.echo
    })).catch(function (error$$1) {
      return debug$1('ping failed:', error$$1);
    });
  };

  return Connection;
}(WebSocketPlus);

/* eslint-disable max-len */

/**
 * 插件接口
 *
 * <p>
 * 插件是由一个或多个扩展点组成的字典。SDK 的扩展点可以分为两类：
 * <p>
 * 第一类扩展点是类实例化之后的回调，包括 <code>Realtime</code>、<code>IMClient</code> 与 <code>Conversation</code>。这些扩展点可以通过一个同步的 Decorator 进行扩展。Decorator 接受一个对应的实例并对其进行一些操作。
 * 特别的，由于注册自定义消息类这个需求特别的常用，额外定义一个 messageClasses 扩展点来做这件事情。
 * <p>
 * 第二类扩展点是在某些事件处理前、后可以注入逻辑的点。
 * 其中 <code>beforeMessageParse</code>，<code>afterMessageParse</code> 可以通过一个异步的 Middleware 进行扩展。Middleware 接受一个对象，返回一个同类型对象或同类型对象的 Promise。
 * <code>beforeMessageDispatch</code> 可以通过返回一个 boolean 类型的 shouldDispatch 值来控制是否要继续派发收到的消息。
 * <p>
 * 如果使用了多个插件，这些 hook 会按照插件数组的顺序依次执行。前一个 Middleware 的返回值会作为参数传给后一个 Middleware。
 *
 * @interface Plugin
 * @since 3.1.0
 */

/* eslint-enable max-len */

/**
 * 插件名称，用于在日志中显示异常的插件
 *
 * @name Plugin.name
 * @type string
 */

/**
 * 插件注册的消息类型
 *
 * @name Plugin.messageClasses
 * @type AVMessage[]
 */

/**
 * 在 Realtime 实例化后对其进行修饰。
 * <p>
 * 接受一个参数为 Realtime 实例。
 *
 * @name Plugin.onRealtimeCreate
 * @type Function
 */

/**
 * 在 IMClient 实例化后对其进行修饰。
 * <p>
 * 接受一个参数为 IMClient 实例。
 *
 * @name Plugin.onIMClientCreate
 * @type Function
 */

/**
 * 在 Conversation 实例化后对其进行修饰。
 * <p>
 * 接受一个参数为 Conversation 实例。
 * 需要注意的是，该扩展点并不是在 <code>{@link IMClient#createConversation}</code> 方法创建成功后调用的 hook，
 * 而是所有的 Conversation 实例化的时候（包括但不限于 query 时）调用的 hook。
 *
 * @name Plugin.onConversationCreate
 * @type Function
 */

/**
 * 在对消息进行 parse 之前，对原始消息进行修改。
 * <p>
 * 接受一个参数为原始消息，是某个消息的内容，一般是一个 JSON 对象。
 * 该方法需要返回一个 JSON 对象。如果这个结果是异步得到的，也可以返回一个 Promise(fulfilled with a JSON)。
 *
 * @name Plugin.beforeMessageParse
 * @type Function
 */

/**
 * 在对消息进行 parse 之后，对消息实例进行修改。
 * <p>
 * 接受一个参数为消息实例，一般是一个已注册的 Message 类或其子类的实例。
 * 该方法需要返回一个同类型的消息实例。如果这个结果是异步得到的，也可以返回一个 Promise。
 *
 * @name Plugin.afterMessageParse
 * @type Function
 */

/**
 * 在收到消息之后，派发消息之前，控制是否派发这条消息。
 * <p>
 * 接受参数为 message 与 conversation。
 * 该方法需要返回 boolean 类型的值，如果返回 false 则 SDK 不再派发这条消息，后续的 beforeMessageDispatch 也不会执行。
 * 如果这个结果是异步得到的，也可以返回一个 Promise。
 *
 * @name Plugin.beforeMessageDispatch
 * @type Function
 * @since 3.4.0
 */

var checkType = function checkType(middleware) {
  return function (param) {
    var constructor = param.constructor;

    return _Promise.resolve(param).then(middleware).then(tap(function (result) {
      if (result === undefined || result === null) {
        // eslint-disable-next-line max-len
        return console.warn('Middleware[' + (middleware._pluginName || 'anonymous plugin') + ':' + (middleware.name || 'anonymous middleware') + '] param/return types not match. It returns ' + result + ' while a ' + param.constructor.name + ' expected.');
      }
      if (!(result instanceof constructor)) {
        // eslint-disable-next-line max-len
        return console.warn('Middleware[' + (middleware._pluginName || 'anonymous plugin') + ':' + (middleware.name || 'anonymous middleware') + '] param/return types not match. It returns a ' + result.constructor.name + ' while a ' + param.constructor.name + ' expected.');
      }
      return 0;
    }));
  };
};

var applyDecorators = function applyDecorators(decorators, target) {
  if (decorators) {
    decorators.forEach(function (decorator) {
      try {
        decorator(target);
      } catch (error) {
        if (decorator._pluginName) {
          error.message += '[' + decorator._pluginName + ']';
        }
        throw error;
      }
    });
  }
};

var applyMiddlewares = function applyMiddlewares(middlewares) {
  return function (target) {
    return ensureArray(middlewares).reduce(function (previousPromise, middleware) {
      return previousPromise.then(checkType(middleware)).catch(function (error) {
        if (middleware._pluginName) {
          // eslint-disable-next-line no-param-reassign
          error.message += '[' + middleware._pluginName + ']';
        }
        throw error;
      });
    }, _Promise.resolve(target));
  };
};

var applyDispatcher = function applyDispatcher(dispatchers, payload) {
  return ensureArray(dispatchers).reduce(function (resultPromise, dispatcher) {
    return resultPromise.then(function (shouldDispatch) {
      return shouldDispatch === false ? false : dispatcher.apply(undefined, _toConsumableArray(payload));
    }).catch(function (error) {
      if (dispatcher._pluginName) {
        // eslint-disable-next-line no-param-reassign
        error.message += '[' + dispatcher._pluginName + ']';
      }
      throw error;
    });
  }, _Promise.resolve(true));
};

var debug = d('LC:Realtime');

var routerCache = new Cache('push-router');

var Realtime = function (_EventEmitter) {
  _inherits(Realtime, _EventEmitter);

  /**
   * @extends EventEmitter
   * @param  {Object} options
   * @param  {String} options.appId
   * @param  {String} options.appKey （since 4.0.0）
   * @param  {String} [options.region='cn'] 节点 id
   * @param  {Boolean} [options.pushOfflineMessages=false] 启用推送离线消息模式（默认为发送未读消息通知模式）
   * @param  {Boolean} [options.noBinary=false] 设置 WebSocket 使用字符串格式收发消息（默认为二进制格式）。
   *                                            适用于 WebSocket 实现不支持二进制数据格式的情况
   * @param  {Boolean} [options.ssl=true] 使用 wss 进行连接
   * @param  {String} [options.server] 指定私有部署的服务器域名（since 4.0.0）
   * @param  {String|String[]} [options.RTMServers] 指定私有部署的 RTM 服务器地址（since 4.0.0）
   * @param  {Plugin[]} [options.plugins] 加载插件（since 3.1.0）
   */
  function Realtime(options) {
    _classCallCheck(this, Realtime);

    debug('initializing Realtime');

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    if (typeof options.appId !== 'string') {
      throw new TypeError('appId [' + options.appId + '] is not a string');
    }
    if (typeof options.appKey !== 'string') {
      throw new TypeError('appKey [' + options.appKey + '] is not a string');
    }
    _this._options = _Object$assign({
      appId: undefined,
      appKey: undefined,
      region: 'cn',
      pushOfflineMessages: false,
      noBinary: false,
      ssl: true,
      RTMServerName: process.env.RTM_SERVER_NAME // undocumented on purpose, internal use only
    }, options);
    _this._cache = new Cache('endpoints');
    internal(_this).clients = new _Set();
    _this._plugins = [].concat(_toConsumableArray(ensureArray(Realtime.__preRegisteredPlugins)), _toConsumableArray(ensureArray(options.plugins))).reduce(function (result, plugin) {
      // eslint-disable-next-line no-restricted-syntax
      for (var hook in plugin) {
        if ({}.hasOwnProperty.call(plugin, hook) && hook !== 'name') {
          if (plugin.name) {
            ensureArray(plugin[hook]).forEach(function (value) {
              // eslint-disable-next-line no-param-reassign
              value._pluginName = plugin.name;
            });
          }
          // eslint-disable-next-line no-param-reassign
          result[hook] = ensureArray(result[hook]).concat(plugin[hook]);
        }
      }
      return result;
    }, {});
    // onRealtimeCreate hook
    applyDecorators(_this._plugins.onRealtimeCreate, _this);
    return _this;
  }

  Realtime.prototype._request = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
      var method = _ref.method,
          _ref$version = _ref.version,
          version = _ref$version === undefined ? '1.1' : _ref$version,
          path = _ref.path,
          query = _ref.query,
          headers = _ref.headers,
          _ref$data = _ref.data,
          data = _ref$data === undefined ? {} : _ref$data;

      var _options, appId, region, _ref3, api, url;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _options = this._options, appId = _options.appId, region = _options.region;
              _context.next = 3;
              return this.constructor._getServerUrls({ appId: appId, region: region });

            case 3:
              _ref3 = _context.sent;
              api = _ref3.api;
              url = 'https://' + api + '/' + version + path;
              return _context.abrupt('return', axios(url, {
                method: method,
                params: query,
                headers: _extends({
                  'X-LC-Id': this._options.appId,
                  'X-LC-Key': this._options.appKey
                }, headers),
                data: data
              }).then(function (response) {
                return response.data;
              }));

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function _request(_x) {
      return _ref2.apply(this, arguments);
    }

    return _request;
  }();

  Realtime.prototype._open = function _open() {
    var _this2 = this;

    if (this._openPromise) return this._openPromise;

    var format = 'protobuf2';
    if (this._options.noBinary) {
      // 不发送 binary data，fallback to base64 string
      format = 'proto2base64';
    }
    var version = 3;
    if (this._options.pushOfflineMessages) {
      // 不推送离线消息，而是发送对话的未读通知
      version = 1;
    }
    var protocol = {
      format: format,
      version: version
    };
    this._openPromise = new _Promise(function (resolve, reject) {
      debug('No connection established, create a new one.');
      var connection = new Connection(function () {
        return _this2._getRTMServers(_this2._options);
      }, protocol);
      connection.on('open', function () {
        return resolve(connection);
      });
      connection.on('error', reject);
      connection.on('message', _this2._dispatchCommand.bind(_this2));
      /**
       * 连接断开。
       * 连接断开可能是因为 SDK 进入了离线状态（see {@link Realtime#event:offline}），或长时间没有收到服务器心跳。
       * 连接断开后所有的网络操作都会失败，请在连接断开后禁用相关的 UI 元素。
       * @event Realtime#disconnect
       */
      /**
       * 计划在一段时间后尝试重新连接
       * @event Realtime#schedule
       * @param {Number} attempt 尝试重连的次数
       * @param {Number} delay 延迟的毫秒数
       */
      /**
       * 正在尝试重新连接
       * @event Realtime#retry
       * @param {Number} attempt 尝试重连的次数
       */
      /**
       * 连接恢复正常。
       * 请重新启用在 {@link Realtime#event:disconnect} 事件中禁用的相关 UI 元素
       * @event Realtime#reconnect
       */

      /**
       * 客户端连接断开
       * @event IMClient#disconnect
       * @see Realtime#event:disconnect
       * @since 3.2.0
       */
      /**
       * 计划在一段时间后尝试重新连接
       * @event IMClient#schedule
       * @param {Number} attempt 尝试重连的次数
       * @param {Number} delay 延迟的毫秒数
       * @since 3.2.0
       */
      /**
       * 正在尝试重新连接
       * @event IMClient#retry
       * @param {Number} attempt 尝试重连的次数
       * @since 3.2.0
       */

      /**
       * 客户端进入离线状态。
       * 这通常意味着网络已断开，或者 {@link Realtime#pause} 被调用
       * @event Realtime#offline
       * @since 3.4.0
       */
      /**
       * 客户端恢复在线状态
       * 这通常意味着网络已恢复，或者 {@link Realtime#resume} 被调用
       * @event Realtime#online
       * @since 3.4.0
       */
      /**
       * 进入离线状态。
       * 这通常意味着网络已断开，或者 {@link Realtime#pause} 被调用
       * @event IMClient#offline
       * @since 3.4.0
       */
      /**
       * 恢复在线状态
       * 这通常意味着网络已恢复，或者 {@link Realtime#resume} 被调用
       * @event IMClient#online
       * @since 3.4.0
       */

      // event proxy
      ['disconnect', 'reconnect', 'retry', 'schedule', 'offline', 'online'].forEach(function (event) {
        return connection.on(event, function () {
          for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
            payload[_key] = arguments[_key];
          }

          debug(event + ' event emitted. %O', payload);
          _this2.emit.apply(_this2, [event].concat(payload));
          if (event !== 'reconnect') {
            internal(_this2).clients.forEach(function (client) {
              client.emit.apply(client, [event].concat(payload));
            });
          }
        });
      });
      // override handleClose
      connection.handleClose = function handleClose(event) {
        var isFatal = [ErrorCode.APP_NOT_AVAILABLE, ErrorCode.INVALID_LOGIN, ErrorCode.INVALID_ORIGIN].some(function (errorCode) {
          return errorCode === event.code;
        });
        if (isFatal) {
          // in these cases, SDK should throw.
          this.throw(createError(event));
        } else {
          // reconnect
          this.disconnect();
        }
      };
      internal(_this2).connection = connection;
    });

    return this._openPromise;
  };

  Realtime.prototype._getRTMServers = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(options) {
      var info, cachedEndPoints;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!options.RTMServers) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt('return', shuffle(ensureArray(options.RTMServers)));

            case 2:
              info = void 0;
              cachedEndPoints = this._cache.get('endpoints');

              if (!cachedEndPoints) {
                _context2.next = 10;
                break;
              }

              _context2.next = 7;
              return cachedEndPoints;

            case 7:
              info = _context2.sent;
              _context2.next = 14;
              break;

            case 10:
              _context2.next = 12;
              return this.constructor._fetchRTMServers(options);

            case 12:
              info = _context2.sent;

              this._cache.set('endpoints', info, info.ttl * 1000);

            case 14:
              debug('endpoint info: %O', info);
              return _context2.abrupt('return', [info.server, info.secondary]);

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function _getRTMServers(_x2) {
      return _ref4.apply(this, arguments);
    }

    return _getRTMServers;
  }();

  Realtime._getServerUrls = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(_ref5) {
      var appId = _ref5.appId,
          region = _ref5.region,
          server = _ref5.server;
      var cachedRouter;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              debug('fetch server urls');

              if (!server) {
                _context3.next = 5;
                break;
              }

              if (!(typeof server !== 'string')) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt('return', server);

            case 4:
              return _context3.abrupt('return', {
                RTMRouter: server,
                api: server
              });

            case 5:
              _context3.t0 = region;
              _context3.next = _context3.t0 === 'cn' ? 8 : _context3.t0 === 'us' ? 12 : 13;
              break;

            case 8:
              cachedRouter = routerCache.get(appId);

              if (!cachedRouter) {
                _context3.next = 11;
                break;
              }

              return _context3.abrupt('return', cachedRouter);

            case 11:
              return _context3.abrupt('return', axios.get('https://app-router.leancloud.cn/2/route', {
                params: {
                  appId: appId
                },
                timeout: 20000
              }).then(function (res) {
                return res.data;
              }).then(tap(debug)).then(function (_ref7) {
                var RTMRouter = _ref7.rtm_router_server,
                    api = _ref7.api_server,
                    _ref7$ttl = _ref7.ttl,
                    ttl = _ref7$ttl === undefined ? 3600 : _ref7$ttl;

                if (!RTMRouter) {
                  throw new Error('rtm router not exists');
                }
                var serverUrls = {
                  RTMRouter: RTMRouter,
                  api: api
                };
                routerCache.set(appId, serverUrls, ttl * 1000);
                return serverUrls;
              }).catch(function () {
                var id = appId.slice(0, 8).toLowerCase();
                return {
                  RTMRouter: id + '.rtm.lncld.net',
                  api: id + '.api.lncld.net'
                };
              }));

            case 12:
              return _context3.abrupt('return', {
                RTMRouter: 'router-a0-push.leancloud.cn',
                api: 'us-api.leancloud.cn'
              });

            case 13:
              throw new Error('Region [' + region + '] is not supported.');

            case 14:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function _getServerUrls(_x3) {
      return _ref6.apply(this, arguments);
    }

    return _getServerUrls;
  }();

  Realtime._fetchRTMServers = function _fetchRTMServers(_ref8) {
    var appId = _ref8.appId,
        region = _ref8.region,
        ssl = _ref8.ssl,
        server = _ref8.server,
        RTMServerName = _ref8.RTMServerName;

    debug('fetch endpoint info');
    return this._getServerUrls({ appId: appId, region: region, server: server }).then(tap(debug)).then(function (_ref9) {
      var RTMRouter = _ref9.RTMRouter;
      return axios.get('https://' + RTMRouter + '/v1/route', {
        params: {
          appId: appId,
          secure: ssl,
          features: isWeapp ? 'wechat' : undefined,
          server: RTMServerName,
          _t: Date.now()
        },
        timeout: 20000
      }).then(function (res) {
        return res.data;
      }).then(tap(debug));
    });
  };

  Realtime.prototype._close = function _close() {
    if (this._openPromise) {
      this._openPromise.then(function (connection) {
        return connection.close();
      });
    }
    delete this._openPromise;
  };

  /**
   * 手动进行重连。
   * SDK 在网络出现异常时会自动按照一定的时间间隔尝试重连，调用该方法会立即尝试重连并重置重连尝试计数器。
   * 只能在 `schedule` 事件之后，`retry` 事件之前调用，如果当前网络正常或者正在进行重连，调用该方法会抛异常。
   */


  Realtime.prototype.retry = function retry() {
    var _internal = internal(this),
        connection = _internal.connection;

    if (!connection) {
      throw new Error('no connection established');
    }
    if (connection.cannot('retry')) {
      throw new Error('retrying not allowed when not disconnected. the connection is now ' + connection.current);
    }
    return connection.retry();
  };
  /**
   * 暂停，使 SDK 进入离线状态。
   * 你可以在网络断开、应用进入后台等时刻调用该方法让 SDK 进入离线状态，离线状态下不会尝试重连。
   * 在浏览器中 SDK 会自动监听网络变化，因此无需手动调用该方法。
   *
   * @since 3.4.0
   * @see Realtime#event:offline
   */


  Realtime.prototype.pause = function pause() {
    // 这个方法常常在网络断开、进入后台时被调用，此时 connection 可能没有建立或者已经 close。
    // 因此不像 retry，这个方法应该尽可能 loose
    var _internal2 = internal(this),
        connection = _internal2.connection;

    if (!connection) return;
    if (connection.can('pause')) connection.pause();
  };
  /**
   * 恢复在线状态。
   * 你可以在网络恢复、应用回到前台等时刻调用该方法让 SDK 恢复在线状态，恢复在线状态后 SDK 会开始尝试重连。
   *
   * @since 3.4.0
   * @see Realtime#event:online
   */


  Realtime.prototype.resume = function resume() {
    // 与 pause 一样，这个方法应该尽可能 loose
    var _internal3 = internal(this),
        connection = _internal3.connection;

    if (!connection) return;
    if (connection.can('resume')) connection.resume();
  };

  Realtime.prototype._register = function _register(client) {
    internal(this).clients.add(client);
  };

  Realtime.prototype._deregister = function _deregister(client) {
    internal(this).clients.delete(client);
    if (internal(this).clients.size === 0) {
      this._close();
    }
  };

  Realtime.prototype._dispatchCommand = function _dispatchCommand(command) {
    return applyDispatcher(this._plugins.beforeCommandDispatch, [command, this]).then(function (shouldDispatch) {
      // no plugin handled this command
      if (shouldDispatch) return debug('[WARN] Unexpected message received: %O', trim(command));
      return false;
    });
  };

  return Realtime;
}(EventEmitter);

var _rMessageStatus;

/**
 * 消息状态枚举
 * @enum {Symbol}
 * @since 3.2.0
 * @memberof module:leancloud-realtime
 */
var MessageStatus = {
  /** 初始状态、未知状态 */
  NONE: _Symbol('none'),
  /** 正在发送 */
  SENDING: _Symbol('sending'),
  /** 已发送 */
  SENT: _Symbol('sent'),
  /** 已送达 */
  DELIVERED: _Symbol('delivered'),
  /** 发送失败 */
  FAILED: _Symbol('failed')
};
_Object$freeze(MessageStatus);

var rMessageStatus = (_rMessageStatus = {}, _defineProperty(_rMessageStatus, MessageStatus.NONE, true), _defineProperty(_rMessageStatus, MessageStatus.SENDING, true), _defineProperty(_rMessageStatus, MessageStatus.SENT, true), _defineProperty(_rMessageStatus, MessageStatus.DELIVERED, true), _defineProperty(_rMessageStatus, MessageStatus.READ, true), _defineProperty(_rMessageStatus, MessageStatus.FAILED, true), _rMessageStatus);

var Message = function () {
  /**
   * @implements AVMessage
   * @param  {Object|String|ArrayBuffer} content 消息内容
   */
  function Message(content) {
    _classCallCheck(this, Message);

    _Object$assign(this, { content: content }, {
      /**
       * @type {String}
       * @memberof Message#
       */
      id: uuid(),
      /**
       * 消息所在的 conversation id
       * @memberof Message#
       * @type {String?}
       */
      cid: null,
      /**
       * 消息发送时间
       * @memberof Message#
       * @type {Date}
       */
      timestamp: new Date(),
      /**
       * 消息发送者
       * @memberof Message#
       * @type {String}
       */
      from: undefined,
      /**
       * 消息提及的用户
       * @since 4.0.0
       * @memberof Message#
       * @type {String[]}
       */
      mentionList: [],
      /**
       * 消息是否提及了所有人
       * @since 4.0.0
       * @memberof Message#
       * @type {Boolean}
       */
      mentionedAll: false,
      _mentioned: false
    });
    this._setStatus(MessageStatus.NONE);
  }

  /**
   * 将当前消息的内容序列化为 JSON 对象
   * @private
   * @return {Object}
   */


  Message.prototype.getPayload = function getPayload() {
    return this.content;
  };

  Message.prototype._toJSON = function _toJSON() {
    var id = this.id,
        cid = this.cid,
        from = this.from,
        timestamp = this.timestamp,
        deliveredAt = this.deliveredAt,
        updatedAt = this.updatedAt,
        mentionList = this.mentionList,
        mentionedAll = this.mentionedAll,
        mentioned = this.mentioned;

    return {
      id: id,
      cid: cid,
      from: from,
      timestamp: timestamp,
      deliveredAt: deliveredAt,
      updatedAt: updatedAt,
      mentionList: mentionList,
      mentionedAll: mentionedAll,
      mentioned: mentioned
    };
  };

  /**
   * 返回 JSON 格式的消息
   * @return {Object} 返回值是一个 plain Object
   */


  Message.prototype.toJSON = function toJSON() {
    return _extends({}, this._toJSON(), {
      data: this.content
    });
  };

  /**
   * 返回 JSON 格式的消息，与 toJSON 不同的是，该对象包含了完整的信息，可以通过 {@link IMClient#parseMessage} 反序列化。
   * @return {Object} 返回值是一个 plain Object
   * @since 4.0.0
   */


  Message.prototype.toFullJSON = function toFullJSON() {
    var content = this.content,
        id = this.id,
        cid = this.cid,
        from = this.from,
        timestamp = this.timestamp,
        deliveredAt = this.deliveredAt,
        _updatedAt = this._updatedAt,
        mentionList = this.mentionList,
        mentionedAll = this.mentionedAll;

    return {
      data: content,
      id: id,
      cid: cid,
      from: from,
      timestamp: getTime(timestamp),
      deliveredAt: getTime(deliveredAt),
      updatedAt: getTime(_updatedAt),
      mentionList: mentionList,
      mentionedAll: mentionedAll
    };
  };

  /**
   * 消息状态，值为 {@link module:leancloud-realtime.MessageStatus} 之一
   * @type {Symbol}
   * @readonly
   * @since 3.2.0
   */


  Message.prototype._setStatus = function _setStatus(status) {
    if (!rMessageStatus[status]) {
      throw new Error('Invalid message status');
    }
    this._status = status;
  };

  Message.prototype._updateMentioned = function _updateMentioned(client) {
    this._mentioned = this.from !== client && (this.mentionedAll || this.mentionList.indexOf(client) > -1);
  };
  /**
   * 获取提及用户列表
   * @since 4.0.0
   * @return {String[]} 提及用户的 id 列表
   */


  Message.prototype.getMentionList = function getMentionList() {
    return this.mentionList;
  };
  /**
   * 设置提及用户列表
   * @since 4.0.0
   * @param {String[]} clients 提及用户的 id 列表
   * @return {this} self
   */


  Message.prototype.setMentionList = function setMentionList(clients) {
    this.mentionList = ensureArray(clients);
    return this;
  };
  /**
   * 设置是否提及所有人
   * @since 4.0.0
   * @param {Boolean} [value=true]
   * @return {this} self
   */


  Message.prototype.mentionAll = function mentionAll() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this.mentionedAll = Boolean(value);
    return this;
  };

  /**
   * 判断给定的内容是否是有效的 Message，
   * 该方法始终返回 true
   * @private
   * @returns {Boolean}
   * @implements AVMessage.validate
   */


  Message.validate = function validate() {
    return true;
  };

  /**
   * 解析处理消息内容
   * <pre>
   * 如果子类提供了 message，返回该 message
   * 如果没有提供，将 json 作为 content 实例化一个 Message
   * @private
   * @param  {Object}  json    json 格式的消息内容
   * @param  {Message} message 子类提供的 message
   * @return {Message}
   * @implements AVMessage.parse
   */


  Message.parse = function parse(json, message) {
    return message || new this(json);
  };

  _createClass(Message, [{
    key: 'status',
    get: function get() {
      return this._status;
    }
  }, {
    key: 'timestamp',
    get: function get() {
      return this._timestamp;
    },
    set: function set(value) {
      this._timestamp = decodeDate(value);
    }

    /**
     * 消息送达时间
     * @type {?Date}
     */

  }, {
    key: 'deliveredAt',
    get: function get() {
      return this._deliveredAt;
    },
    set: function set(value) {
      this._deliveredAt = decodeDate(value);
    }

    /**
     * 消息修改或撤回时间，可以通过比较其与消息的 timestamp 是否相等判断消息是否被修改过或撤回过。
     * @type {Date}
     * @since 3.5.0
     */

  }, {
    key: 'updatedAt',
    get: function get() {
      return this._updatedAt || this.timestamp;
    },
    set: function set(value) {
      this._updatedAt = decodeDate(value);
    }

    /**
     * 当前用户是否在该消息中被提及
     * @type {Boolean}
     * @readonly
     * @since 4.0.0
     */

  }, {
    key: 'mentioned',
    get: function get() {
      return this._mentioned;
    }
  }]);

  return Message;
}();

/* eslint-disable no-param-reassign */
// documented in ../index.js
var messageType = function messageType(type) {
  if (typeof type !== 'number') {
    throw new TypeError(type + ' is not a Number');
  }
  return function (target) {
    target.TYPE = type;
    target.validate = function (json) {
      return json._lctype === type;
    };
    target.prototype._getType = function () {
      return { _lctype: type };
    };
  };
};

// documented in ../index.js
var messageField = function messageField(fields) {
  if (typeof fields !== 'string') {
    if (!Array.isArray(fields)) {
      throw new TypeError(fields + ' is not an Array');
    } else if (fields.some(function (value) {
      return typeof value !== 'string';
    })) {
      throw new TypeError('fields contains non-string typed member');
    }
  }
  return function (target) {
    // IE10 Hack:
    // static properties in IE10 will not be inherited from super
    // search for parse method and assign it manually
    var originalCustomFields = isIE10 ? getStaticProperty(target, '_customFields') : target._customFields;
    originalCustomFields = Array.isArray(originalCustomFields) ? originalCustomFields : [];
    target._customFields = originalCustomFields.concat(fields);
  };
};

// IE10 Hack:
// static properties in IE10 will not be inherited from super
// search for parse method and assign it manually

var IE10Compatible = function IE10Compatible(target) {
  if (isIE10) {
    target.parse = getStaticProperty(target, 'parse');
  }
};

var _dec$2;
var _class$3;

// jsdoc-ignore-start

// jsdoc-ignore-end
/**
 * 所有内置的富媒体消息均继承自本类
 * @extends Message
 */
var TypedMessage = (_dec$2 = messageField(['_lctext', '_lcattrs']), _dec$2(_class$3 = function (_Message) {
  _inherits(TypedMessage, _Message);

  function TypedMessage() {
    _classCallCheck(this, TypedMessage);

    return _possibleConstructorReturn(this, _Message.apply(this, arguments));
  }

  /**
   * @param {String} text
   * @return {this} self
   */
  TypedMessage.prototype.setText = function setText(text) {
    this._lctext = text;
    return this;
  };
  /**
   * @return {String}
   */


  TypedMessage.prototype.getText = function getText() {
    return this._lctext;
  };

  /**
   * @param {Object} attributes
   * @return {this} self
   */


  TypedMessage.prototype.setAttributes = function setAttributes(attributes) {
    this._lcattrs = attributes;
    return this;
  };
  /**
   * @return {Object}
   */


  TypedMessage.prototype.getAttributes = function getAttributes() {
    return this._lcattrs;
  };

  TypedMessage.prototype._getCustomFields = function _getCustomFields() {
    var _this2 = this;

    var fields = Array.isArray(this.constructor._customFields) ? this.constructor._customFields : [];
    return fields.reduce(function (result, field) {
      if (typeof field !== 'string') return result;
      result[field] = _this2[field]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
  };

  /* eslint-disable class-methods-use-this */


  TypedMessage.prototype._getType = function _getType() {
    throw new Error('not implemented');
  };
  /* eslint-enable class-methods-use-this */

  TypedMessage.prototype.getPayload = function getPayload() {
    return compact(_Object$assign({
      _lctext: this.getText(),
      _lcattrs: this.getAttributes()
    }, this._getCustomFields(), this._getType()));
  };

  TypedMessage.prototype.toJSON = function toJSON() {
    var type = this.type,
        text = this.text,
        attributes = this.attributes,
        summary = this.summary;

    return _extends({}, _Message.prototype._toJSON.call(this), {
      type: type,
      text: text,
      attributes: attributes,
      summary: summary
    });
  };

  TypedMessage.prototype.toFullJSON = function toFullJSON() {
    return _extends({}, _Message.prototype.toFullJSON.call(this), {
      data: this.getPayload()
    });
  };

  /**
   * 解析处理消息内容
   * <pre>
   * 为给定的 message 设置 text 与 attributes 属性，返回该 message
   * 如果子类没有提供 message，new this()
   * @protected
   * @param  {Object}  json    json 格式的消息内容
   * @param  {TypedMessage} message 子类提供的 message
   * @return {TypedMessage}
   * @implements AVMessage.parse
   */


  TypedMessage.parse = function parse(json) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new this();

    message.content = json; // eslint-disable-line no-param-reassign
    var customFields = isIE10 ? getStaticProperty(message.constructor, '_customFields') : message.constructor._customFields;
    var fields = Array.isArray(customFields) ? customFields : [];
    fields = fields.reduce(function (result, field) {
      if (typeof field !== 'string') return result;
      result[field] = json[field]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
    _Object$assign(message, fields);
    return _Message.parse.call(this, json, message);
  };

  _createClass(TypedMessage, [{
    key: 'type',

    /**
     * @type {Number}
     * @readonly
     */
    get: function get() {
      return this.constructor.TYPE;
    }

    /** @type {String} */

  }, {
    key: 'text',
    set: function set(text) {
      return this.setText(text);
    },
    get: function get() {
      return this.getText();
    }

    /** @type {Object} */

  }, {
    key: 'attributes',
    set: function set(attributes) {
      return this.setAttributes(attributes);
    },
    get: function get() {
      return this.getAttributes();
    }

    /**
     * 在客户端需要以文本形式展示该消息时显示的文案，
     * 如 <code>[红包] 新春快乐</code>。
     * 默认值为消息的 text。
     * @type {String}
     * @readonly
     */

  }, {
    key: 'summary',
    get: function get() {
      return this.text;
    }
  }]);

  return TypedMessage;
}(Message)) || _class$3);

var _dec$1;
var _class$2;

// jsdoc-ignore-start

// jsdoc-ignore-end
/**
 * 已撤回类型消息，当消息被撤回时，SDK 会使用该类型的消息替代原始消息
 * @extends TypedMessage
 */
var RecalledMessage = (_dec$1 = messageType(-127), _dec$1(_class$2 = function (_TypedMessage) {
  _inherits(RecalledMessage, _TypedMessage);

  function RecalledMessage() {
    _classCallCheck(this, RecalledMessage);

    return _possibleConstructorReturn(this, _TypedMessage.apply(this, arguments));
  }

  _createClass(RecalledMessage, [{
    key: 'summary',

    /**
     * 在客户端需要以文本形式展示该消息时显示的文案，值为 <code>[该消息已撤回]</code>
     * @type {String}
     * @readonly
     */
    // eslint-disable-next-line class-methods-use-this
    get: function get() {
      return '[该消息已撤回]';
    }
  }]);

  return RecalledMessage;
}(TypedMessage)) || _class$2);

var debug$7 = d('LC:Conversation');

var serializeMessage = function serializeMessage(message) {
  var content = message.getPayload();
  var msg = void 0;
  var binaryMsg = void 0;
  if (content instanceof ArrayBuffer) {
    binaryMsg = content;
  } else if (typeof content !== 'string') {
    msg = _JSON$stringify(content);
  } else {
    msg = content;
  }
  return { msg: msg, binaryMsg: binaryMsg };
};

var _LogsCommand$QueryDir = LogsCommand.QueryDirection;
var NEW = _LogsCommand$QueryDir.NEW;
var OLD = _LogsCommand$QueryDir.OLD;

/**
 * 历史消息查询方向枚举
 * @enum {Number}
 * @since 4.0.0
 * @memberof module:leancloud-realtime
 */

var MessageQueryDirection = {
  /** 从后向前 */
  NEW_TO_OLD: OLD,
  /** 从前向后 */
  OLD_TO_NEW: NEW
};
_Object$freeze(MessageQueryDirection);

var ConversationBase = function (_EventEmitter) {
  _inherits(ConversationBase, _EventEmitter);

  /**
   * @extends EventEmitter
   * @private
   * @abstract
   */
  function ConversationBase(_ref, client) {
    var id = _ref.id,
        lastMessageAt = _ref.lastMessageAt,
        lastMessage = _ref.lastMessage,
        lastDeliveredAt = _ref.lastDeliveredAt,
        lastReadAt = _ref.lastReadAt,
        _ref$unreadMessagesCo = _ref.unreadMessagesCount,
        unreadMessagesCount = _ref$unreadMessagesCo === undefined ? 0 : _ref$unreadMessagesCo,
        _ref$members = _ref.members,
        members = _ref$members === undefined ? [] : _ref$members,
        _ref$mentioned = _ref.mentioned,
        mentioned = _ref$mentioned === undefined ? false : _ref$mentioned,
        properties = _objectWithoutProperties(_ref, ['id', 'lastMessageAt', 'lastMessage', 'lastDeliveredAt', 'lastReadAt', 'unreadMessagesCount', 'members', 'mentioned']);

    _classCallCheck(this, ConversationBase);

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    _Object$assign(_this, _extends({
      /**
       * 对话 id，对应 _Conversation 表中的 objectId
       * @memberof ConversationBase#
       * @type {String}
       */
      id: id,
      /**
       * 最后一条消息时间
       * @memberof ConversationBase#
       * @type {?Date}
       */
      lastMessageAt: lastMessageAt,
      /**
       * 最后一条消息
       * @memberof ConversationBase#
       * @type {?Message}
       */
      lastMessage: lastMessage,
      /**
       * 参与该对话的用户列表
       * @memberof ConversationBase#
       * @type {String[]}
       */
      members: members
    }, properties));
    _this.members = _Array$from(new _Set(_this.members));
    _Object$assign(internal(_this), {
      messagesWaitingForReceipt: {},
      lastDeliveredAt: lastDeliveredAt,
      lastReadAt: lastReadAt,
      unreadMessagesCount: unreadMessagesCount,
      mentioned: mentioned
    });
    if (client instanceof IMClient) {
      _this._client = client;
    } else {
      throw new TypeError('Conversation must be initialized with a client');
    }
    ['kicked', 'membersjoined', 'membersleft', 'message', 'receipt', 'lastdeliveredatupdate', 'lastreadatupdate', 'messagerecall', 'messageupdate'].forEach(function (event) {
      return _this.on(event, function () {
        for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
          payload[_key] = arguments[_key];
        }

        return _this._debug(event + ' event emitted. %O', payload);
      });
    });
    // onConversationCreate hook
    applyDecorators(_this._client._plugins.onConversationCreate, _this);
    return _this;
  }

  /**
   * 当前用户是否在该对话的未读消息中被提及
   * @type {Boolean}
   * @since 4.0.0
   */


  ConversationBase.prototype._setUnreadMessagesMentioned = function _setUnreadMessagesMentioned(value) {
    internal(this).unreadMessagesMentioned = Boolean(value);
  };

  ConversationBase.prototype._setLastDeliveredAt = function _setLastDeliveredAt(value) {
    var date = decodeDate(value);
    if (!(date < internal(this).lastDeliveredAt)) {
      internal(this).lastDeliveredAt = date;
      /**
       * 最后消息送达时间更新
       * @event Conversation#lastdeliveredatupdate
       * @since 3.4.0
       */
      this.emit('lastdeliveredatupdate');
    }
  };
  /**
   * 最后消息被阅读时间，常用来实现发送消息的「已读」标记，可通过 {@link Conversation#fetchReceiptTimestamps} 获取或更新该属性
   * @type {?Date}
   * @since 3.4.0
   */


  ConversationBase.prototype._setLastReadAt = function _setLastReadAt(value) {
    var date = decodeDate(value);
    if (!(date < internal(this).lastReadAt)) {
      internal(this).lastReadAt = date;
      /**
       * 最后消息被阅读时间更新
       * @event Conversation#lastreadatupdate
       * @since 3.4.0
       */
      this.emit('lastreadatupdate');
    }
  };

  /**
   * 返回 JSON 格式的对话，与 toJSON 不同的是，该对象包含了完整的信息，可以通过 {@link IMClient#parseConversation} 反序列化。
   * @return {Object} 返回值是一个 plain Object
   * @since 4.0.0
   */


  ConversationBase.prototype.toFullJSON = function toFullJSON() {
    var id = this.id,
        members = this.members,
        lastMessageAt = this.lastMessageAt,
        lastDeliveredAt = this.lastDeliveredAt,
        lastReadAt = this.lastReadAt,
        lastMessage = this.lastMessage,
        unreadMessagesCount = this.unreadMessagesCount;

    return {
      id: id,
      members: members,
      lastMessageAt: getTime(lastMessageAt),
      lastDeliveredAt: getTime(lastDeliveredAt),
      lastReadAt: getTime(lastReadAt),
      lastMessage: lastMessage ? lastMessage.toFullJSON() : undefined,
      unreadMessagesCount: unreadMessagesCount
    };
  };

  /**
   * 返回 JSON 格式的对话
   * @return {Object} 返回值是一个 plain Object
   * @since 4.0.0
   */


  ConversationBase.prototype.toJSON = function toJSON() {
    var id = this.id,
        members = this.members,
        lastMessageAt = this.lastMessageAt,
        lastDeliveredAt = this.lastDeliveredAt,
        lastReadAt = this.lastReadAt,
        lastMessage = this.lastMessage,
        unreadMessagesCount = this.unreadMessagesCount,
        unreadMessagesMentioned = this.unreadMessagesMentioned;

    return {
      id: id,
      members: members,
      lastMessageAt: lastMessageAt,
      lastDeliveredAt: lastDeliveredAt,
      lastReadAt: lastReadAt,
      lastMessage: lastMessage ? lastMessage.toJSON() : undefined,
      unreadMessagesCount: unreadMessagesCount,
      unreadMessagesMentioned: unreadMessagesMentioned
    };
  };

  ConversationBase.prototype._debug = function _debug() {
    for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      params[_key2] = arguments[_key2];
    }

    debug$7.apply(undefined, params.concat(['[' + this.id + ']']));
  };

  ConversationBase.prototype._send = function _send(command) {
    var _client;

    /* eslint-disable no-param-reassign */
    if (command.cmd === null) {
      command.cmd = 'conv';
    }
    if (command.cmd === 'conv' && command.convMessage === null) {
      command.convMessage = new ConvCommand();
    }
    if (command.convMessage && command.convMessage.cid === null) {
      command.convMessage.cid = this.id;
    }
    /* eslint-enable no-param-reassign */

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return (_client = this._client)._send.apply(_client, [command].concat(args));
  };

  /**
   * 发送消息
   * @param  {Message} message 消息，Message 及其子类的实例
   * @param {Object} [options] since v3.3.0，发送选项
   * @param {Boolean} [options.transient] since v3.3.1，是否作为暂态消息发送
   * @param {Boolean} [options.receipt] 是否需要回执，仅在普通对话中有效
   * @param {Boolean} [options.will] since v3.4.0，是否指定该消息作为「掉线消息」发送，
   * 「掉线消息」会延迟到当前用户掉线后发送，常用来实现「下线通知」功能
   * @param {MessagePriority} [options.priority] 消息优先级，仅在暂态对话中有效，
   * see: {@link module:leancloud-realtime.MessagePriority MessagePriority}
   * @param {Object} [options.pushData] 消息对应的离线推送内容，如果消息接收方不在线，会推送指定的内容。其结构说明参见: {@link https://url.leanapp.cn/pushData 推送消息内容}
   * @return {Promise.<Message>} 发送的消息
   */


  ConversationBase.prototype.send = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(message, options) {
      var _Object$assign2, transient, receipt, priority, pushData, will, _serializeMessage, msg, binaryMsg, command, resCommand, _resCommand$ackMessag, uid, t, code, reason, appCode;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this._debug(message, 'send');

              if (message instanceof Message) {
                _context.next = 3;
                break;
              }

              throw new TypeError(message + ' is not a Message');

            case 3:
              _Object$assign2 = _Object$assign({},
              // support Message static property: sendOptions
              message.constructor.sendOptions,
              // support Message static property: getSendOptions
              typeof message.constructor.getSendOptions === 'function' ? message.constructor.getSendOptions(message) : {}, options), transient = _Object$assign2.transient, receipt = _Object$assign2.receipt, priority = _Object$assign2.priority, pushData = _Object$assign2.pushData, will = _Object$assign2.will;

              if (receipt) {
                if (this.transient) {
                  console.warn('receipt option is ignored as the conversation is transient.');
                } else if (transient) {
                  console.warn('receipt option is ignored as the message is sent transiently.');
                } else if (this.members.length > 2) {
                  console.warn('receipt option is recommended to be used in one-on-one conversation.'); // eslint-disable-line max-len
                }
              }
              if (priority && !this.transient) {
                console.warn('priority option is ignored as the conversation is not transient.');
              }
              _Object$assign(message, {
                cid: this.id,
                from: this._client.id
              });
              message._setStatus(MessageStatus.SENDING);
              _serializeMessage = serializeMessage(message), msg = _serializeMessage.msg, binaryMsg = _serializeMessage.binaryMsg;
              command = new GenericCommand({
                cmd: 'direct',
                directMessage: new DirectCommand({
                  msg: msg,
                  binaryMsg: binaryMsg,
                  cid: this.id,
                  r: receipt,
                  transient: transient,
                  dt: message.id,
                  pushData: _JSON$stringify(pushData),
                  will: will,
                  mentionPids: message.mentionList,
                  mentionAll: message.mentionedAll
                }),
                priority: priority
              });
              _context.prev = 10;
              _context.next = 13;
              return this._send(command, !transient);

            case 13:
              resCommand = _context.sent;

              if (transient) {
                _context.next = 21;
                break;
              }

              _resCommand$ackMessag = resCommand.ackMessage, uid = _resCommand$ackMessag.uid, t = _resCommand$ackMessag.t, code = _resCommand$ackMessag.code, reason = _resCommand$ackMessag.reason, appCode = _resCommand$ackMessag.appCode;

              if (!(code !== null)) {
                _context.next = 18;
                break;
              }

              throw createError({
                code: code, reason: reason, appCode: appCode
              });

            case 18:
              _Object$assign(message, {
                id: uid,
                timestamp: t
              });
              this.lastMessage = message;
              this.lastMessageAt = message.timestamp;

            case 21:
              message._setStatus(MessageStatus.SENT);
              if (receipt) {
                internal(this).messagesWaitingForReceipt[message.id] = message;
              }
              return _context.abrupt('return', message);

            case 26:
              _context.prev = 26;
              _context.t0 = _context['catch'](10);

              message._setStatus(MessageStatus.FAILED);
              throw _context.t0;

            case 30:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[10, 26]]);
    }));

    function send(_x, _x2) {
      return _ref2.apply(this, arguments);
    }

    return send;
  }();

  ConversationBase.prototype._update = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(message, newMessage, recall) {
      var msg, binaryMsg, content, id, cid, timestamp, from, _status;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this._debug('patch %O %O %O', message, newMessage, recall);

              if (!(message instanceof Message)) {
                _context2.next = 8;
                break;
              }

              if (!(message.from !== this._client.id)) {
                _context2.next = 4;
                break;
              }

              throw new Error('Updating message from others is not allowed');

            case 4:
              if (!(message.status !== MessageStatus.SENT && message.status !== MessageStatus.DELIVERED)) {
                _context2.next = 6;
                break;
              }

              throw new Error('Message is not sent');

            case 6:
              _context2.next = 10;
              break;

            case 8:
              if (message.id && message.timestamp) {
                _context2.next = 10;
                break;
              }

              throw new TypeError(message + ' is not a Message');

            case 10:
              msg = void 0;
              binaryMsg = void 0;

              if (!recall) {
                content = serializeMessage(newMessage);
                msg = content.msg;
                binaryMsg = content.binaryMsg;
              }
              _context2.next = 15;
              return this._send(new GenericCommand({
                cmd: CommandType.patch,
                op: OpType.modify,
                patchMessage: new PatchCommand({
                  patches: [new PatchItem({
                    cid: this.id,
                    mid: message.id,
                    timestamp: Number(message.timestamp),
                    recall: recall,
                    data: msg,
                    binaryMsg: binaryMsg,
                    mentionPids: newMessage.mentionList,
                    mentionAll: newMessage.mentionedAll
                  })],
                  lastPatchTime: this._client._lastPatchTime
                })
              }));

            case 15:
              id = message.id, cid = message.cid, timestamp = message.timestamp, from = message.from, _status = message._status;

              _Object$assign(newMessage, {
                id: id, cid: cid, timestamp: timestamp, from: from, _status: _status
              });
              if (this.lastMessage.id === newMessage.id) {
                this.lastMessage = newMessage;
              }
              return _context2.abrupt('return', newMessage);

            case 19:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function _update(_x3, _x4, _x5) {
      return _ref3.apply(this, arguments);
    }

    return _update;
  }();

  /**
   * 获取对话人数，或暂态对话的在线人数
   * @return {Promise.<Number>}
   */


  ConversationBase.prototype.count = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var resCommand;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this._debug('count');
              _context3.next = 3;
              return this._send(new GenericCommand({
                op: 'count'
              }));

            case 3:
              resCommand = _context3.sent;
              return _context3.abrupt('return', resCommand.convMessage.count);

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function count() {
      return _ref4.apply(this, arguments);
    }

    return count;
  }();

  /**
   * 修改已发送的消息
   * @param {AVMessage} message 要修改的消息，该消息必须是由当前用户发送的。也可以提供一个包含消息 {id, timestamp} 的对象
   * @param {AVMessage} newMessage 新的消息
   * @return {Promise.<AVMessage>} 更新后的消息
   */


  ConversationBase.prototype.update = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(message, newMessage) {
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (newMessage instanceof Message) {
                _context4.next = 2;
                break;
              }

              throw new TypeError(newMessage + ' is not a Message');

            case 2:
              return _context4.abrupt('return', this._update(message, newMessage, false));

            case 3:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function update(_x6, _x7) {
      return _ref5.apply(this, arguments);
    }

    return update;
  }();

  /**
   * 撤回已发送的消息
   * @param {AVMessage} message 要撤回的消息，该消息必须是由当前用户发送的。也可以提供一个包含消息 {id, timestamp} 的对象
   * @return {Promise.<RecalledMessage>} 一条已撤回的消息
   */


  ConversationBase.prototype.recall = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(message) {
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt('return', this._update(message, new RecalledMessage(), true));

            case 1:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function recall(_x8) {
      return _ref6.apply(this, arguments);
    }

    return recall;
  }();

  /**
   * 查询消息记录
   * 如果仅需实现消息向前记录翻页查询需求，建议使用 {@link Conversation#createMessagesIterator}。
   * 不论何种方向，获得的消息都是按照时间升序排列的。
   * startClosed 与 endClosed 用于指定查询区间的开闭。
   *
   * @param  {Object} [options]
   * @param  {Number} [options.limit] 限制查询结果的数量，目前服务端默认为 20
   * @param  {MessageQueryDirection} [options.direction] 查询的方向。
   * 在不指定的情况下如果 startTime 大于 endTime，则为从新到旧查询，可以实现加载聊天记录等场景。
   * 如果 startTime 小于 endTime，则为从旧到新查询，可以实现弹幕等场景。
   * @param  {Date}   [options.startTime] 从该时间开始查询，不传则从当前时间开始查询
   * @param  {String} [options.startMessageId] 从该消息之前开始查询，需要与 startTime 同时使用，为防止某时刻有重复消息
   * @param  {Boolean}[options.startClosed] 指定查询范围是否包括开始的时间点，默认不包括
   * @param  {Date}   [options.endTime] 查询到该时间为止，不传则查询最早消息为止
   * @param  {String} [options.endMessageId] 查询到该消息为止，需要与 endTime 同时使用，为防止某时刻有重复消息
   * @param  {Boolean}[options.endClosed] 指定查询范围是否包括结束的时间点，默认不包括
   *
   * @param  {Date}   [options.beforeTime] DEPRECATED: 使用 startTime 代替。限制查询结果为小于该时间之前的消息，不传则为当前时间
   * @param  {String} [options.beforeMessageId] DEPRECATED: 使用 startMessageId 代替。
   * 限制查询结果为该消息之前的消息，需要与 beforeTime 同时使用，为防止某时刻有重复消息
   * @param  {Date}   [options.afterTime] DEPRECATED: 使用 endTime 代替。限制查询结果为大于该时间之前的消息
   * @param  {String} [options.afterMessageId] DEPRECATED: 使用 endMessageId 代替。
   * 限制查询结果为该消息之后的消息，需要与 afterTime 同时使用，为防止某时刻有重复消息
   * @return {Promise.<Message[]>} 消息列表
   */


  ConversationBase.prototype.queryMessages = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var beforeTime, beforeMessageId, afterTime, afterMessageId, limit, direction, startTime, startMessageId, startClosed, endTime, endMessageId, endClosed, conditions, resCommand;
      return _regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              this._debug('query messages %O', options);
              beforeTime = options.beforeTime, beforeMessageId = options.beforeMessageId, afterTime = options.afterTime, afterMessageId = options.afterMessageId, limit = options.limit, direction = options.direction, startTime = options.startTime, startMessageId = options.startMessageId, startClosed = options.startClosed, endTime = options.endTime, endMessageId = options.endMessageId, endClosed = options.endClosed;

              if (!(beforeMessageId || beforeTime || afterMessageId || afterTime)) {
                _context7.next = 5;
                break;
              }

              console.log('DEPRECATION: queryMessages options beforeTime, beforeMessageId, afterTime and afterMessageId are deprecated in favor of startTime, startMessageId, endTime and endMessageId.');
              return _context7.abrupt('return', this.queryMessages({
                startTime: beforeTime,
                startMessageId: beforeMessageId,
                endTime: afterTime,
                endMessageId: afterMessageId,
                limit: limit
              }));

            case 5:
              if (!(startMessageId && !startTime)) {
                _context7.next = 7;
                break;
              }

              throw new Error('query option startMessageId must be used with option startTime');

            case 7:
              if (!(endMessageId && !endTime)) {
                _context7.next = 9;
                break;
              }

              throw new Error('query option endMessageId must be used with option endTime');

            case 9:
              conditions = {
                t: startTime,
                mid: startMessageId,
                tIncluded: startClosed,
                tt: endTime,
                tmid: endMessageId,
                ttIncluded: endClosed,
                l: limit
              };

              if (conditions.t instanceof Date) {
                conditions.t = conditions.t.getTime();
              }
              if (conditions.tt instanceof Date) {
                conditions.tt = conditions.tt.getTime();
              }
              if (direction !== undefined) {
                conditions.direction = direction;
              } else if (conditions.tt > conditions.t) {
                conditions.direction = MessageQueryDirection.OLD_TO_NEW;
              }
              _context7.next = 15;
              return this._send(new GenericCommand({
                cmd: 'logs',
                logsMessage: new LogsCommand(_Object$assign(conditions, {
                  cid: this.id
                }))
              }));

            case 15:
              resCommand = _context7.sent;
              return _context7.abrupt('return', _Promise.all(resCommand.logsMessage.logs.map(function () {
                var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(_ref8) {
                  var msgId = _ref8.msgId,
                      timestamp = _ref8.timestamp,
                      patchTimestamp = _ref8.patchTimestamp,
                      from = _ref8.from,
                      ackAt = _ref8.ackAt,
                      readAt = _ref8.readAt,
                      data = _ref8.data,
                      mentionAll = _ref8.mentionAll,
                      mentionPids = _ref8.mentionPids,
                      bin = _ref8.bin;
                  var messageData, message, status;
                  return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          messageData = {
                            data: data,
                            bin: bin,
                            id: msgId,
                            cid: _this2.id,
                            timestamp: timestamp,
                            from: from,
                            deliveredAt: ackAt,
                            updatedAt: patchTimestamp,
                            mentionList: mentionPids,
                            mentionedAll: mentionAll
                          };
                          _context6.next = 3;
                          return _this2._client.parseMessage(messageData);

                        case 3:
                          message = _context6.sent;
                          status = MessageStatus.SENT;

                          if (_this2.members.length === 2) {
                            if (ackAt) status = MessageStatus.DELIVERED;
                            if (ackAt) _this2._setLastDeliveredAt(ackAt);
                            if (readAt) _this2._setLastReadAt(readAt);
                          }
                          message._setStatus(status);
                          return _context6.abrupt('return', message);

                        case 8:
                        case 'end':
                          return _context6.stop();
                      }
                    }
                  }, _callee6, _this2);
                }));

                return function (_x10) {
                  return _ref9.apply(this, arguments);
                };
              }())));

            case 17:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function queryMessages() {
      return _ref7.apply(this, arguments);
    }

    return queryMessages;
  }();

  /**
   * 获取消息翻页迭代器
   * @param  {Object} [options]
   * @param  {Date}   [options.beforeTime] 限制起始查询结果为小于该时间之前的消息，不传则为当前时间
   * @param  {String} [options.beforeMessageId] 限制起始查询结果为该消息之前的消息，需要与 beforeTime 同时使用，为防止某时刻有重复消息
   * @param  {Number} [options.limit] 限制每页查询结果的数量，目前服务端默认为 20
   * @return {AsyncIterater.<Promise.<IteratorResult<Message[]>>>} [AsyncIterator]{@link https://github.com/tc39/proposal-async-iteration}，调用其 next 方法返回获取下一页消息的 Promise
   * @example
   * var messageIterator = conversation.createMessagesIterator({ limit: 10 });
   * messageIterator.next().then(function(result) {
   *   // result: {
   *   //   value: [message1, ..., message10],
   *   //   done: false,
   *   // }
   * });
   * messageIterator.next().then(function(result) {
   *   // result: {
   *   //   value: [message11, ..., message20],
   *   //   done: false,
   *   // }
   * });
   * messageIterator.next().then(function(result) {
   *   // No more messages
   *   // result: { value: [], done: true }
   * });
   */


  ConversationBase.prototype.createMessagesIterator = function createMessagesIterator() {
    var _this3 = this;

    var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        beforeTime = _ref10.beforeTime,
        beforeMessageId = _ref10.beforeMessageId,
        limit = _ref10.limit;

    var promise = void 0;
    return {
      next: function next() {
        if (promise === undefined) {
          // first call
          promise = _this3.queryMessages({
            limit: limit,
            startTime: beforeTime,
            startMessageId: beforeMessageId
          });
        } else {
          promise = promise.then(function (prevMessages) {
            if (prevMessages.length === 0 || prevMessages.length < limit) {
              // no more messages
              return [];
            }
            return _this3.queryMessages({
              startTime: prevMessages[0].timestamp,
              startMessageId: prevMessages[0].id,
              limit: limit
            });
          });
        }
        return promise.then(function (value) {
          return {
            value: _Array$from(value),
            done: value.length === 0 || value.length < limit
          };
        });
      }
    };
  };

  /**
   * 将该会话标记为已读
   * @return {Promise.<this>} self
   */


  ConversationBase.prototype.read = function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
      var client;
      return _regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              this.unreadMessagesCount = 0;
              this._setUnreadMessagesMentioned(false);
              // 跳过暂态会话

              if (!this.transient) {
                _context8.next = 4;
                break;
              }

              return _context8.abrupt('return', this);

            case 4:
              client = this._client;

              if (!internal(client).readConversationsBuffer) {
                internal(client).readConversationsBuffer = new _Set();
              }
              internal(client).readConversationsBuffer.add(this);
              client._doSendRead();
              return _context8.abrupt('return', this);

            case 9:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function read() {
      return _ref11.apply(this, arguments);
    }

    return read;
  }();

  ConversationBase.prototype._handleReceipt = function _handleReceipt(_ref12) {
    var messageId = _ref12.messageId,
        timestamp = _ref12.timestamp,
        read = _ref12.read;

    if (read) {
      this._setLastReadAt(timestamp);
    } else {
      this._setLastDeliveredAt(timestamp);
    }

    var _internal = internal(this),
        messagesWaitingForReceipt = _internal.messagesWaitingForReceipt;

    var message = messagesWaitingForReceipt[messageId];
    if (!message) return;
    message._setStatus(MessageStatus.DELIVERED);
    message.deliveredAt = timestamp;
    delete messagesWaitingForReceipt[messageId];
  };

  /**
   * 更新对话的最新回执时间戳（lastDeliveredAt、lastReadAt）
   * @since 3.4.0
   * @return {Promise.<this>} this
   */


  ConversationBase.prototype.fetchReceiptTimestamps = function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9() {
      var _ref14, _ref14$convMessage, maxReadTimestamp, maxAckTimestamp;

      return _regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this._send(new GenericCommand({
                op: 'max_read'
              }));

            case 2:
              _ref14 = _context9.sent;
              _ref14$convMessage = _ref14.convMessage;
              maxReadTimestamp = _ref14$convMessage.maxReadTimestamp;
              maxAckTimestamp = _ref14$convMessage.maxAckTimestamp;

              this._setLastDeliveredAt(maxAckTimestamp);
              this._setLastReadAt(maxReadTimestamp);
              return _context9.abrupt('return', this);

            case 9:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function fetchReceiptTimestamps() {
      return _ref13.apply(this, arguments);
    }

    return fetchReceiptTimestamps;
  }();

  ConversationBase.prototype._fetchAllReceiptTimestamps = function _fetchAllReceiptTimestamps() {
    var convMessage = new ConvCommand({
      queryAllMembers: true
    });
    return this._send(new GenericCommand({
      op: 'max_read',
      convMessage: convMessage
    })).then(function (_ref15) {
      var maxReadTuples = _ref15.convMessage.maxReadTuples;
      return maxReadTuples.filter(function (maxReadTuple) {
        return maxReadTuple.maxAckTimestamp || maxReadTuple.maxReadTimestamp;
      }).map(function (_ref16) {
        var pid = _ref16.pid,
            maxAckTimestamp = _ref16.maxAckTimestamp,
            maxReadTimestamp = _ref16.maxReadTimestamp;
        return {
          pid: pid,
          lastDeliveredAt: decodeDate(maxAckTimestamp),
          lastReadAt: decodeDate(maxReadTimestamp)
        };
      });
    });
  };

  _createClass(ConversationBase, [{
    key: 'unreadMessagesMentioned',
    get: function get() {
      return internal(this).unreadMessagesMentioned;
    }
  }, {
    key: 'unreadMessagesCount',
    set: function set(value) {
      if (value !== this.unreadMessagesCount) {
        internal(this).unreadMessagesCount = value;
        this._client.emit('unreadmessagescountupdate', [this]);
      }
    }
    /**
     * 当前用户在该对话的未读消息数
     * @type {Number}
     */
    ,
    get: function get() {
      return internal(this).unreadMessagesCount;
    }
  }, {
    key: 'lastMessageAt',
    set: function set(value) {
      var time = decodeDate(value);
      if (time <= this._lastMessageAt) return;
      this._lastMessageAt = time;
    },
    get: function get() {
      return this._lastMessageAt;
    }
    /**
     * 最后消息送达时间，常用来实现消息的「已送达」标记，可通过 {@link Conversation#fetchReceiptTimestamps} 获取或更新该属性
     * @type {?Date}
     * @since 3.4.0
     */

  }, {
    key: 'lastDeliveredAt',
    get: function get() {
      if (this.members.length !== 2) return null;
      return internal(this).lastDeliveredAt;
    }
  }, {
    key: 'lastReadAt',
    get: function get() {
      if (this.members.length !== 2) return null;
      return internal(this).lastReadAt;
    }
  }]);

  return ConversationBase;
}(EventEmitter);

var debug$8 = d('LC:SignatureFactoryRunner');

function _validateSignature() {
  var signatureResult = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var signature = signatureResult.signature,
      timestamp = signatureResult.timestamp,
      nonce = signatureResult.nonce;

  if (typeof signature !== 'string' || typeof timestamp !== 'number' || typeof nonce !== 'string') {
    throw new Error('malformed signature');
  }
  return {
    signature: signature,
    timestamp: timestamp,
    nonce: nonce
  };
}

var runSignatureFactory = (function (signatureFactory, params) {
  return _Promise.resolve().then(function () {
    debug$8('call signatureFactory with %O', params);
    return signatureFactory.apply(undefined, _toConsumableArray(params));
  }).then(tap(function (signatureResult) {
    return debug$8('sign result %O', signatureResult);
  }), function (error) {
    // eslint-disable-next-line no-param-reassign
    error.message = 'sign error: ' + error.message;
    debug$8(error);
    throw error;
  }).then(_validateSignature);
});

/**
 * @extends ConversationBase
 * @private
 * @abstract
 */

var PersistentConversation = function (_ConversationBase) {
  _inherits(PersistentConversation, _ConversationBase);

  function PersistentConversation(data, _ref, client) {
    var creator = _ref.creator,
        createdAt = _ref.createdAt,
        updatedAt = _ref.updatedAt,
        _ref$transient = _ref.transient,
        transient = _ref$transient === undefined ? false : _ref$transient,
        _ref$system = _ref.system,
        system = _ref$system === undefined ? false : _ref$system,
        _ref$muted = _ref.muted,
        muted = _ref$muted === undefined ? false : _ref$muted,
        _ref$mutedMembers = _ref.mutedMembers,
        mutedMembers = _ref$mutedMembers === undefined ? [] : _ref$mutedMembers,
        attributes = _objectWithoutProperties(_ref, ['creator', 'createdAt', 'updatedAt', 'transient', 'system', 'muted', 'mutedMembers']);

    _classCallCheck(this, PersistentConversation);

    var _this = _possibleConstructorReturn(this, _ConversationBase.call(this, _extends({}, data, {
      /**
       * 对话创建者
       * @memberof PersistentConversation#
       * @type {String}
       */
      creator: creator,
      /**
       * 对话创建时间
       * @memberof PersistentConversation#
       * @type {Date}
       */
      createdAt: createdAt,
      /**
       * 对话更新时间
       * @memberof PersistentConversation#
       * @type {Date}
       */
      updatedAt: updatedAt,
      /**
       * 对该对话设置了静音的用户列表
       * @memberof PersistentConversation#
       * @type {?String[]}
       */
      mutedMembers: mutedMembers,
      /**
       * 暂态对话标记
       * @memberof PersistentConversation#
       * @type {Boolean}
       */
      transient: transient,
      /**
       * 系统对话标记
       * @memberof PersistentConversation#
       * @type {Boolean}
       * @since 3.3.0
       */
      system: system,
      /**
       * 当前用户静音该对话标记
       * @memberof PersistentConversation#
       * @type {Boolean}
       */
      muted: muted,
      _attributes: attributes
    }), client));

    _this._reset();
    return _this;
  }

  /**
   * 获取对话的自定义属性
   * @since 3.2.0
   * @param  {String} key key 属性的键名，'x' 对应 Conversation 表中的 x 列
   * @return {Any} 属性的值
   */
  PersistentConversation.prototype.get = function get(key) {
    return internal(this).currentAttributes[key];
  };

  /**
   * 设置对话的自定义属性
   * @since 3.2.0
   * @param {String} key 属性的键名，'x' 对应 Conversation 表中的 x 列，支持使用 'x.y.z' 来修改对象的部分字段。
   * @param {Any} value 属性的值
   * @return {this} self
   * @example
   *
   * // 设置对话的 color 属性
   * conversation.set('color', {
   *   text: '#000',
   *   background: '#DDD',
   * });
   * // 设置对话的 color.text 属性
   * conversation.set('color.text', '#333');
   */


  PersistentConversation.prototype.set = function set(key, value) {
    this._debug('set [' + key + ']: ' + value);

    var _internal = internal(this),
        pendingAttributes = _internal.pendingAttributes;

    var pendingKeys = _Object$keys(pendingAttributes);
    // suppose pendingAttributes = { 'a.b': {} }
    // set 'a' or 'a.b': delete 'a.b'
    var re = new RegExp('^' + key);
    var childKeys = pendingKeys.filter(re.test.bind(re));
    childKeys.forEach(function (k) {
      delete pendingAttributes[k];
    });
    if (childKeys.length) {
      pendingAttributes[key] = value;
    } else {
      // set 'a.c': nothing to do
      // set 'a.b.c.d': assign c: { d: {} } to 'a.b'
      // CAUTION: non-standard API, provided by core-js
      var parentKey = _Array$find(pendingKeys, function (k) {
        return key.indexOf(k) === 0;
      }); // 'a.b'
      if (parentKey) {
        setValue(pendingAttributes[parentKey], key.slice(parentKey.length + 1), value);
      } else {
        pendingAttributes[key] = value;
      }
    }
    // build currentAttributes
    internal(this).currentAttributes = _Object$keys(pendingAttributes).reduce(function (target, k) {
      return setValue(target, k, pendingAttributes[k]);
    }, cloneDeep(this._attributes));
    return this;
  };

  PersistentConversation.prototype._reset = function _reset() {
    internal(this).pendingAttributes = {};
    internal(this).currentAttributes = this._attributes;
  };

  /**
   * 保存当前对话的属性至服务器
   * @return {Promise.<this>} self
   */


  PersistentConversation.prototype.save = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var attr, convMessage, resCommand;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this._debug('save');
              attr = internal(this).pendingAttributes;

              if (!isEmpty(attr)) {
                _context.next = 5;
                break;
              }

              this._debug('nothing touched, resolve with self');
              return _context.abrupt('return', this);

            case 5:
              this._debug('attr: %O', attr);
              convMessage = new ConvCommand({
                attr: new JsonObjectMessage({
                  data: _JSON$stringify(encode$1(attr))
                })
              });
              _context.next = 9;
              return this._send(new GenericCommand({
                op: 'update',
                convMessage: convMessage
              }));

            case 9:
              resCommand = _context.sent;

              this.updatedAt = resCommand.convMessage.udate;
              this._attributes = internal(this).currentAttributes;
              internal(this).pendingAttributes = {};
              return _context.abrupt('return', this);

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function save() {
      return _ref2.apply(this, arguments);
    }

    return save;
  }();

  /**
   * 从服务器更新对话的属性
   * @return {Promise.<this>} self
   */


  PersistentConversation.prototype.fetch = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var query;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = this._client.getQuery().equalTo('objectId', this.id);
              _context2.next = 3;
              return query.find();

            case 3:
              return _context2.abrupt('return', this);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function fetch() {
      return _ref3.apply(this, arguments);
    }

    return fetch;
  }();

  /**
   * 静音，客户端拒绝收到服务器端的离线推送通知
   * @return {Promise.<this>} self
   */


  PersistentConversation.prototype.mute = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this._debug('mute');
              _context3.next = 3;
              return this._send(new GenericCommand({
                op: 'mute'
              }));

            case 3:
              if (!this.transient) {
                this.muted = true;
                this.mutedMembers = union(this.mutedMembers, [this._client.id]);
              }
              return _context3.abrupt('return', this);

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function mute() {
      return _ref4.apply(this, arguments);
    }

    return mute;
  }();

  /**
   * 取消静音
   * @return {Promise.<this>} self
   */


  PersistentConversation.prototype.unmute = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              this._debug('unmute');
              _context4.next = 3;
              return this._send(new GenericCommand({
                op: 'unmute'
              }));

            case 3:
              if (!this.transient) {
                this.muted = false;
                this.mutedMembers = difference(this.mutedMembers, [this._client.id]);
              }
              return _context4.abrupt('return', this);

            case 5:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function unmute() {
      return _ref5.apply(this, arguments);
    }

    return unmute;
  }();

  /**
   * 增加成员
   * @param {String|String[]} clientIds 新增成员 client id
   * @return {Promise.<this>} self
   */


  PersistentConversation.prototype.add = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(clientIds) {
      var convMessage, command, params, signatureResult;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              this._debug('add', clientIds);
              if (typeof clientIds === 'string') {
                clientIds = [clientIds]; // eslint-disable-line no-param-reassign
              }
              convMessage = new ConvCommand({
                m: clientIds
              });
              command = new GenericCommand({
                op: 'add',
                convMessage: convMessage
              });

              if (!this._client.options.conversationSignatureFactory) {
                _context5.next = 10;
                break;
              }

              params = [this.id, this._client.id, clientIds.sort(), 'add'];
              _context5.next = 8;
              return runSignatureFactory(this._client.options.conversationSignatureFactory, params);

            case 8:
              signatureResult = _context5.sent;

              _Object$assign(command.convMessage, keyRemap({
                signature: 's',
                timestamp: 't',
                nonce: 'n'
              }, signatureResult));

            case 10:
              _context5.next = 12;
              return this._send(command);

            case 12:
              if (!this.transient && !this.system) {
                this.members = union(this.members, clientIds);
              }
              return _context5.abrupt('return', this);

            case 14:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function add(_x) {
      return _ref6.apply(this, arguments);
    }

    return add;
  }();

  /**
   * 剔除成员
   * @param {String|String[]} clientIds 成员 client id
   * @return {Promise.<this>} self
   */


  PersistentConversation.prototype.remove = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(clientIds) {
      var convMessage, command, params, signatureResult;
      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              this._debug('remove', clientIds);
              if (typeof clientIds === 'string') {
                clientIds = [clientIds]; // eslint-disable-line no-param-reassign
              }
              convMessage = new ConvCommand({
                m: clientIds
              });
              command = new GenericCommand({
                op: 'remove',
                convMessage: convMessage
              });

              if (!this._client.options.conversationSignatureFactory) {
                _context6.next = 10;
                break;
              }

              params = [this.id, this._client.id, clientIds.sort(), 'remove'];
              _context6.next = 8;
              return runSignatureFactory(this._client.options.conversationSignatureFactory, params);

            case 8:
              signatureResult = _context6.sent;

              _Object$assign(command.convMessage, keyRemap({
                signature: 's',
                timestamp: 't',
                nonce: 'n'
              }, signatureResult));

            case 10:
              _context6.next = 12;
              return this._send(command);

            case 12:
              if (!this.transient && !this.system) {
                this.members = difference(this.members, clientIds);
              }
              return _context6.abrupt('return', this);

            case 14:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function remove$$1(_x2) {
      return _ref7.apply(this, arguments);
    }

    return remove$$1;
  }();

  /**
   * （当前用户）加入该对话
   * @return {Promise.<this>} self
   */


  PersistentConversation.prototype.join = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
      return _regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              this._debug('join');
              return _context7.abrupt('return', this.add(this._client.id));

            case 2:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function join() {
      return _ref8.apply(this, arguments);
    }

    return join;
  }();

  /**
   * （当前用户）退出该对话
   * @return {Promise.<this>} self
   */


  PersistentConversation.prototype.quit = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
      return _regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              this._debug('quit');
              return _context8.abrupt('return', this.remove(this._client.id));

            case 2:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function quit() {
      return _ref9.apply(this, arguments);
    }

    return quit;
  }();

  PersistentConversation.prototype.toFullJSON = function toFullJSON() {
    var creator = this.creator,
        system = this.system,
        transient = this.transient,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        _attributes = this._attributes;

    return _extends({}, _ConversationBase.prototype.toFullJSON.call(this), {
      creator: creator,
      system: system,
      transient: transient,
      createdAt: getTime(createdAt),
      updatedAt: getTime(updatedAt)
    }, _attributes);
  };

  PersistentConversation.prototype.toJSON = function toJSON() {
    var creator = this.creator,
        system = this.system,
        transient = this.transient,
        muted = this.muted,
        mutedMembers = this.mutedMembers,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        _attributes = this._attributes;

    return _extends({}, _ConversationBase.prototype.toJSON.call(this), {
      creator: creator,
      system: system,
      transient: transient,
      muted: muted,
      mutedMembers: mutedMembers,
      createdAt: createdAt,
      updatedAt: updatedAt
    }, _attributes);
  };

  _createClass(PersistentConversation, [{
    key: 'createdAt',
    set: function set(value) {
      this._createdAt = decodeDate(value);
    },
    get: function get() {
      return this._createdAt;
    }
  }, {
    key: 'updatedAt',
    set: function set(value) {
      this._updatedAt = decodeDate(value);
    },
    get: function get() {
      return this._updatedAt;
    }

    /**
     * 对话名字，对应 _Conversation 表中的 name
     * @type {String}
     */

  }, {
    key: 'name',
    get: function get() {
      return this.get('name');
    },
    set: function set(value) {
      this.set('name', value);
    }
  }]);

  return PersistentConversation;
}(ConversationBase);

/**
 * 普通对话
 *
 * 无法直接实例化，请使用 {@link IMClient#createConversation} 创建新的普通对话。
 * @extends PersistentConversation
 * @public
 */

var Conversation = function (_PersistentConversati) {
  _inherits(Conversation, _PersistentConversati);

  function Conversation() {
    _classCallCheck(this, Conversation);

    return _possibleConstructorReturn(this, _PersistentConversati.apply(this, arguments));
  }

  return Conversation;
}(PersistentConversation);

/**
 * 聊天室。
 *
 * 无法直接实例化，请使用 {@link IMClient#createChatRoom} 创建新的聊天室。
 * @since 4.0.0
 * @extends PersistentConversation
 * @public
 */

var ChatRoom = function (_PersistentConversati) {
  _inherits(ChatRoom, _PersistentConversati);

  function ChatRoom() {
    _classCallCheck(this, ChatRoom);

    return _possibleConstructorReturn(this, _PersistentConversati.apply(this, arguments));
  }

  return ChatRoom;
}(PersistentConversation);

/**
 * 服务号。
 *
 * 服务号不支持在客户端创建。
 * @since 4.0.0
 * @extends PersistentConversation
 * @public
 */

var ServiceConversation = function (_PersistentConversati) {
  _inherits(ServiceConversation, _PersistentConversati);

  function ServiceConversation() {
    _classCallCheck(this, ServiceConversation);

    return _possibleConstructorReturn(this, _PersistentConversati.apply(this, arguments));
  }

  return ServiceConversation;
}(PersistentConversation);

var transformNotFoundError = function transformNotFoundError(error$$1) {
  return error$$1.code === ErrorCode.CONVERSATION_NOT_FOUND ? createError({ code: ErrorCode.CONVERSATION_EXPIRED }) : error$$1;
};

/**
 * 临时对话
 * @since 4.0.0
 * @extends ConversationBase
 * @public
 */

var TemporaryConversation = function (_ConversationBase) {
  _inherits(TemporaryConversation, _ConversationBase);

  /**
   * 无法直接实例化，请使用 {@link IMClient#createTemporaryConversation} 创建新的临时对话。
   */
  function TemporaryConversation(data, _ref, client) {
    var expiredAt = _ref.expiredAt;

    _classCallCheck(this, TemporaryConversation);

    return _possibleConstructorReturn(this, _ConversationBase.call(this, _extends({}, data, {
      expiredAt: expiredAt
    }), client));
  }

  /**
   * 对话失效时间
   * @type {Date}
   */


  TemporaryConversation.prototype._send = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _ConversationBase$pro,
          _len,
          args,
          _key,
          _args = arguments;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.expired) {
                _context.next = 2;
                break;
              }

              throw createError({ code: ErrorCode.CONVERSATION_EXPIRED });

            case 2:
              _context.prev = 2;

              for (_len = _args.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = _args[_key];
              }

              _context.next = 6;
              return (_ConversationBase$pro = _ConversationBase.prototype._send).call.apply(_ConversationBase$pro, [this].concat(_toConsumableArray(args)));

            case 6:
              return _context.abrupt('return', _context.sent);

            case 9:
              _context.prev = 9;
              _context.t0 = _context['catch'](2);
              throw transformNotFoundError(_context.t0);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 9]]);
    }));

    function _send() {
      return _ref2.apply(this, arguments);
    }

    return _send;
  }();

  TemporaryConversation.prototype.send = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var _ConversationBase$pro2,
          _len2,
          args,
          _key2,
          _args2 = arguments;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              for (_len2 = _args2.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = _args2[_key2];
              }

              _context2.next = 4;
              return (_ConversationBase$pro2 = _ConversationBase.prototype.send).call.apply(_ConversationBase$pro2, [this].concat(_toConsumableArray(args)));

            case 4:
              return _context2.abrupt('return', _context2.sent);

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2['catch'](0);
              throw transformNotFoundError(_context2.t0);

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 7]]);
    }));

    function send() {
      return _ref3.apply(this, arguments);
    }

    return send;
  }();

  TemporaryConversation.prototype.toFullJSON = function toFullJSON() {
    var expiredAt = this.expiredAt;

    return _extends({}, _ConversationBase.prototype.toFullJSON.call(this), {
      expiredAt: getTime(expiredAt)
    });
  };

  TemporaryConversation.prototype.toJSON = function toJSON() {
    var expiredAt = this.expiredAt,
        expired = this.expired;

    return _extends({}, _ConversationBase.prototype.toJSON.call(this), {
      expiredAt: expiredAt,
      expired: expired
    });
  };

  _createClass(TemporaryConversation, [{
    key: 'expiredAt',
    set: function set(value) {
      this._expiredAt = decodeDate(value);
    },
    get: function get() {
      return this._expiredAt;
    }

    /**
     * 对话是否已失效
     * @type {Boolean}
     */

  }, {
    key: 'expired',
    get: function get() {
      return this.expiredAt < new Date();
    }
  }]);

  return TemporaryConversation;
}(ConversationBase);

var debug$9 = d('LC:ConversationQuery');

var ConversationQuery = function () {
  ConversationQuery._encode = function _encode(value) {
    if (value instanceof Date) {
      return { __type: 'Date', iso: value.toJSON() };
    }
    if (value instanceof RegExp) {
      return value.source;
    }
    return value;
  };

  ConversationQuery._quote = function _quote(s) {
    return '\\Q' + s.replace('\\E', '\\E\\\\E\\Q') + '\\E';
  };

  ConversationQuery._calculateFlag = function _calculateFlag(options) {
    return ['withLastMessagesRefreshed', 'compact'].reduce(
    // eslint-disable-next-line no-bitwise
    function (prev, key) {
      return (prev << 1) + Boolean(options[key]);
    }, 0);
  };

  /**
   * Create a ConversationQuery
   * @param  {IMClient} client
   */


  function ConversationQuery(client) {
    _classCallCheck(this, ConversationQuery);

    this._client = client;
    this._where = {};
    this._extraOptions = {};
  }

  ConversationQuery.prototype._addCondition = function _addCondition(key, condition, value) {
    // Check if we already have a condition
    if (!this._where[key]) {
      this._where[key] = {};
    }
    this._where[key][condition] = this.constructor._encode(value);
    return this;
  };

  ConversationQuery.prototype.toJSON = function toJSON() {
    var json = {
      where: this._where,
      flag: this.constructor._calculateFlag(this._extraOptions)
    };
    if (typeof this._skip !== 'undefined') json.skip = this._skip;
    if (typeof this._limit !== 'undefined') json.limit = this._limit;
    if (typeof this._order !== 'undefined') json.sort = this._order;
    debug$9(json);
    return json;
  };

  /**
   * 增加查询条件，指定聊天室的组员包含某些成员即可返回
   * @param {string[]} peerIds - 成员 ID 列表
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.containsMembers = function containsMembers(peerIds) {
    return this.containsAll('m', peerIds);
  };

  /**
   * 增加查询条件，指定聊天室的组员条件满足条件的才返回
   *
   * @param {string[]} - 成员 ID 列表
   * @param {Boolean} includeSelf - 是否包含自己
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.withMembers = function withMembers(peerIds, includeSelf) {
    var peerIdsSet = new _Set(peerIds);
    if (includeSelf) {
      peerIdsSet.add(this._client.id);
    }
    this.sizeEqualTo('m', peerIdsSet.size);
    return this.containsMembers(_Array$from(peerIdsSet));
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.equalTo = function equalTo(key, value) {
    this._where[key] = this.constructor._encode(value);
    return this;
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足小于条件时即可返回
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.lessThan = function lessThan(key, value) {
    return this._addCondition(key, '$lt', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足小于等于条件时即可返回
    * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.lessThanOrEqualTo = function lessThanOrEqualTo(key, value) {
    return this._addCondition(key, '$lte', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足大于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */

  ConversationQuery.prototype.greaterThan = function greaterThan(key, value) {
    return this._addCondition(key, '$gt', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足大于等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */

  ConversationQuery.prototype.greaterThanOrEqualTo = function greaterThanOrEqualTo(key, value) {
    return this._addCondition(key, '$gte', value);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段满足不等于条件时即可返回
   *
   * @param {string} key
   * @param value
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.notEqualTo = function notEqualTo(key, value) {
    return this._addCondition(key, '$ne', value);
  };

  /**
   * 增加查询条件，当 conversation 存在指定的字段时即可返回
   *
   * @since 3.5.0
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.exists = function exists(key) {
    return this._addCondition(key, '$exists', true);
  };

  /**
   * 增加查询条件，当 conversation 不存在指定的字段时即可返回
   *
   * @since 3.5.0
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.doesNotExist = function doesNotExist(key) {
    return this._addCondition(key, '$exists', false);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值包含在指定值中时即可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.containedIn = function containedIn(key, values) {
    return this._addCondition(key, '$in', values);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值不包含在指定值中时即可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.notContainsIn = function notContainsIn(key, values) {
    return this._addCondition(key, '$nin', values);
  };
  /**
   * 增加查询条件，当conversation的属性中对应的字段中的元素包含所有的值才可返回
   *
   * @param {string} key
   * @param values
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.containsAll = function containsAll(key, values) {
    return this._addCondition(key, '$all', values);
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值包含此字符串即可返回
   *
   * @param {string} key
   * @param {string} subString
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.contains = function contains(key, subString) {
    return this._addCondition(key, '$regex', ConversationQuery._quote(subString));
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值以此字符串起始即可返回
   *
   * @param {string} key
   * @param {string} prefix
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.startsWith = function startsWith(key, prefix) {
    return this._addCondition(key, '$regex', '^' + ConversationQuery._quote(prefix));
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值以此字符串结束即可返回
   *
   * @param {string} key
   * @param {string} suffix
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.endsWith = function endsWith(key, suffix) {
    return this._addCondition(key, '$regex', ConversationQuery._quote(suffix) + '$');
  };

  /**
   * 增加查询条件，当 conversation 的属性中对应的字段对应的值满足提供的正则表达式即可返回
   *
   * @param {string} key
   * @param {RegExp} regex
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.matches = function matches(key, regex) {
    this._addCondition(key, '$regex', regex);
    // Javascript regex options support mig as inline options but store them
    // as properties of the object. We support mi & should migrate them to
    // modifiers
    var _modifiers = '';
    if (regex.ignoreCase) {
      _modifiers += 'i';
    }
    if (regex.multiline) {
      _modifiers += 'm';
    }

    if (_modifiers && _modifiers.length) {
      this._addCondition(key, '$options', _modifiers);
    }
    return this;
  };

  /**
   * 添加查询约束条件，查找 key 类型是数组，该数组的长度匹配提供的数值
   *
   * @param {string} key
   * @param {Number} length
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.sizeEqualTo = function sizeEqualTo(key, length) {
    return this._addCondition(key, '$size', length);
  };

  /**
   * 设置返回集合的大小上限
   *
   * @param {Number} limit - 上限
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.limit = function limit(_limit) {
    this._limit = _limit;
    return this;
  };

  /**
   * 设置返回集合的起始位置，一般用于分页
   *
   * @param {Number} skip - 起始位置跳过几个对象
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.skip = function skip(_skip) {
    this._skip = _skip;
    return this;
  };

  /**
   * 设置返回集合按照指定key进行增序排列
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.ascending = function ascending(key) {
    this._order = key;
    return this;
  };

  /**
   * 设置返回集合按照指定key进行增序排列，如果已设置其他排序，原排序的优先级较高
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.addAscending = function addAscending(key) {
    if (this._order) {
      this._order += ',' + key;
    } else {
      this._order = key;
    }
    return this;
  };

  /**
   * 设置返回集合按照指定 key 进行降序排列
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.descending = function descending(key) {
    this._order = '-' + key;
    return this;
  };

  /**
   * 设置返回集合按照指定 key 进行降序排列，如果已设置其他排序，原排序的优先级较高
   *
   * @param {string} key
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.addDescending = function addDescending(key) {
    if (this._order) {
      this._order += ',-' + key;
    } else {
      this._order = '-' + key;
    }
    return this;
  };

  /**
   * 设置返回的 conversations 刷新最后一条消息
   * @param  {Boolean} [enabled=true]
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.withLastMessagesRefreshed = function withLastMessagesRefreshed() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this._extraOptions.withLastMessagesRefreshed = enabled;
    return this;
  };

  /**
   * 设置返回的 conversations 为精简模式，即不含成员列表
   * @param  {Boolean} [enabled=true]
   * @return {ConversationQuery} self
   */


  ConversationQuery.prototype.compact = function compact() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this._extraOptions.compact = enabled;
    return this;
  };

  /**
   * 执行查询
   * @return {Promise.<ConversationBase[]>}
   */


  ConversationQuery.prototype.find = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', this._client._executeQuery(this));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function find() {
      return _ref.apply(this, arguments);
    }

    return find;
  }();

  return ConversationQuery;
}();

var version = "4.0.0-beta.2";

var _dec;
var _dec2;
var _class$1;

function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var debug$6 = d('LC:IMClient');

var isTemporaryConversatrionId = function isTemporaryConversatrionId(id) {
  return (/^_tmp:/.test(id)
  );
};

var IMClient = (_dec = throttle(1000), _dec2 = throttle(1000), (_class$1 = function (_EventEmitter) {
  _inherits(IMClient, _EventEmitter);

  /**
   * 无法直接实例化，请使用 {@link Realtime#createIMClient} 创建新的 IMClient。
   *
   * @extends EventEmitter
   * @param  {String} [id] 客户端 id
   * @param  {Object} [options]
   * @param  {Function} [options.signatureFactory] open session 时的签名方法 // TODO need details
   * @param  {Function} [options.conversationSignatureFactory] 对话创建、增减成员操作时的签名方法
   */
  function IMClient(id) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var connection = arguments[2];
    var props = arguments[3];

    _classCallCheck(this, IMClient);

    if (!(id === undefined || typeof id === 'string')) {
      throw new TypeError('Client id [' + id + '] is not a String');
    }

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    _Object$assign(_this, {
      /**
       * @var id {String} 客户端 id
       * @memberof IMClient#
       */
      id: id,
      _connection: connection,
      options: options
    }, props);

    if (!_this._messageParser) {
      throw new Error('IMClient must be initialized with a MessageParser');
    }
    _this._conversationCache = new Cache('client:' + _this.id);
    _this._ackMessageBuffer = {};
    internal(_this).lastPatchTime = Date.now();
    internal(_this)._eventemitter = new EventEmitter();
    ['invited', 'kicked', 'membersjoined', 'membersleft', 'message', 'unreadmessages', 'unreadmessagescountupdate', 'close', 'conflict', 'unhandledmessage', 'reconnect', 'reconnecterror'].forEach(function (event) {
      return _this.on(event, function () {
        for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
          payload[_key] = arguments[_key];
        }

        return _this._debug(event + ' event emitted. %O', payload);
      });
    });
    // onIMClientCreate hook
    applyDecorators(_this._plugins.onIMClientCreate, _this);
    return _this;
  }

  IMClient.prototype._debug = function _debug() {
    for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      params[_key2] = arguments[_key2];
    }

    debug$6.apply(undefined, params.concat(['[' + this.id + ']']));
  };

  /**
   * @override
   * @private
   */


  IMClient.prototype._dispatchCommand = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(command) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this._debug(trim(command), 'received');
              _context.t0 = command.cmd;
              _context.next = _context.t0 === CommandType.conv ? 4 : _context.t0 === CommandType.direct ? 5 : _context.t0 === CommandType.session ? 6 : _context.t0 === CommandType.unread ? 7 : _context.t0 === CommandType.rcp ? 8 : _context.t0 === CommandType.patch ? 9 : 10;
              break;

            case 4:
              return _context.abrupt('return', this._dispatchConvMessage(command));

            case 5:
              return _context.abrupt('return', this._dispatchDirectMessage(command));

            case 6:
              return _context.abrupt('return', this._dispatchSessionMessage(command));

            case 7:
              return _context.abrupt('return', this._dispatchUnreadMessage(command));

            case 8:
              return _context.abrupt('return', this._dispatchRcpMessage(command));

            case 9:
              return _context.abrupt('return', this._dispatchPatchMessage(command));

            case 10:
              return _context.abrupt('return', this.emit('unhandledmessage', command));

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function _dispatchCommand(_x2) {
      return _ref.apply(this, arguments);
    }

    return _dispatchCommand;
  }();

  IMClient.prototype._dispatchSessionMessage = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(message) {
      var _message$sessionMessa, code, reason;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _message$sessionMessa = message.sessionMessage, code = _message$sessionMessa.code, reason = _message$sessionMessa.reason;
              _context2.t0 = message.op;
              _context2.next = _context2.t0 === OpType.closed ? 4 : 8;
              break;

            case 4:
              internal(this)._eventemitter.emit('close');

              if (!(code === ErrorCode.SESSION_CONFLICT)) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', this.emit('conflict', {
                reason: reason
              }));

            case 7:
              return _context2.abrupt('return', this.emit('close', {
                code: code, reason: reason
              }));

            case 8:
              this.emit('unhandledmessage', message);
              throw new Error('Unrecognized session command');

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function _dispatchSessionMessage(_x3) {
      return _ref2.apply(this, arguments);
    }

    return _dispatchSessionMessage;
  }();

  IMClient.prototype._dispatchUnreadMessage = function _dispatchUnreadMessage(_ref3) {
    var _this2 = this;

    var _ref3$unreadMessage = _ref3.unreadMessage,
        convs = _ref3$unreadMessage.convs,
        notifTime = _ref3$unreadMessage.notifTime;

    internal(this).lastUnreadNotifTime = notifTime;
    // ensure all converstions are cached
    return this.getConversations(convs.map(function (conv) {
      return conv.cid;
    })).then(function () {
      return (
        // update conversations data
        _Promise.all(convs.map(function (_ref4) {
          var cid = _ref4.cid,
              unread = _ref4.unread,
              mid = _ref4.mid,
              ts = _ref4.timestamp,
              from = _ref4.from,
              data = _ref4.data,
              binaryMsg = _ref4.binaryMsg,
              patchTimestamp = _ref4.patchTimestamp,
              mentioned = _ref4.mentioned;

          var conversation = _this2._conversationCache.get(cid);
          // deleted conversation
          if (!conversation) return null;
          var timestamp = void 0;
          if (ts) {
            timestamp = new Date(ts.toNumber());
            conversation.lastMessageAt = timestamp; // eslint-disable-line no-param-reassign
          }
          return (mid ? _this2._messageParser.parse(binaryMsg || data).then(function (message) {
            var messageProps = {
              id: mid,
              cid: cid,
              timestamp: timestamp,
              updatedAt: patchTimestamp,
              from: from
            };
            _Object$assign(message, messageProps);
            conversation.lastMessage = message; // eslint-disable-line no-param-reassign
          }) : _Promise.resolve()).then(function () {
            conversation._setUnreadMessagesMentioned(mentioned);
            var countNotUpdated = unread === internal(conversation).unreadMessagesCount;
            if (countNotUpdated) return null; // to be filtered
            // manipulate internal property directly to skip unreadmessagescountupdate event
            internal(conversation).unreadMessagesCount = unread;
            return conversation;
          });
          // filter conversations without unread count update
        })).then(function (conversations) {
          return conversations.filter(function (conversation) {
            return conversation;
          });
        })
      );
    }).then(function (conversations) {
      if (conversations.length) {
        /**
         * 未读消息数目更新
         * @event IMClient#unreadmessagescountupdate
         * @since 3.4.0
         * @param {Conversation[]} conversations 未读消息数目有更新的对话列表
         */
        _this2.emit('unreadmessagescountupdate', conversations);
      }
    });
  };

  IMClient.prototype._dispatchRcpMessage = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(message) {
      var rcpMessage, read, conversationId, messageId, timestamp, conversation;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              rcpMessage = message.rcpMessage, read = message.rcpMessage.read;
              conversationId = rcpMessage.cid;
              messageId = rcpMessage.id;
              timestamp = new Date(rcpMessage.t.toNumber());
              conversation = this._conversationCache.get(conversationId);
              // conversation not cached means the client does not send the message
              // during this session

              if (conversation) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt('return');

            case 7:
              conversation._handleReceipt({ messageId: messageId, timestamp: timestamp, read: read });

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function _dispatchRcpMessage(_x4) {
      return _ref5.apply(this, arguments);
    }

    return _dispatchRcpMessage;
  }();

  IMClient.prototype._dispatchPatchMessage = function _dispatchPatchMessage(_ref6) {
    var _this3 = this;

    var patches = _ref6.patchMessage.patches;

    // ensure all converstions are cached
    return this.getConversations(patches.map(function (patch) {
      return patch.cid;
    })).then(function () {
      return _Promise.all(patches.map(function (_ref7) {
        var cid = _ref7.cid,
            mid = _ref7.mid,
            timestamp = _ref7.timestamp,
            recall = _ref7.recall,
            data = _ref7.data,
            patchTimestamp = _ref7.patchTimestamp,
            from = _ref7.from,
            binaryMsg = _ref7.binaryMsg,
            mentionAll = _ref7.mentionAll,
            mentionPids = _ref7.mentionPids;

        var conversation = _this3._conversationCache.get(cid);
        // deleted conversation
        if (!conversation) return null;
        return _this3._messageParser.parse(binaryMsg || data).then(function (message) {
          var patchTime = patchTimestamp.toNumber();
          var messageProps = {
            id: mid,
            cid: cid,
            timestamp: timestamp,
            updatedAt: patchTime,
            from: from,
            mentionList: mentionPids,
            mentionedAll: mentionAll
          };
          _Object$assign(message, messageProps);
          message._setStatus(MessageStatus.SENT);
          message._updateMentioned(_this3.id);
          if (internal(_this3).lastPatchTime < patchTime) {
            internal(_this3).lastPatchTime = patchTime;
          }
          // update conversation lastMessage
          if (conversation.lastMessage && conversation.lastMessage.id === mid) {
            conversation.lastMessage = message; // eslint-disable-line no-param-reassign
          }
          if (recall) {
            /**
             * 消息被撤回
             * @event IMClient#messagerecall
             * @param {AVMessage} message 被撤回的消息
             * @param {ConversationBase} conversation 消息所在的会话
             */
            _this3.emit('messagerecall', message, conversation);
            /**
             * 消息被撤回
             * @event Conversation#messagerecall
             * @param {AVMessage} message 被撤回的消息
             */
            conversation.emit('messagerecall', message);
          } else {
            /**
             * 消息被修改
             * @event IMClient#messageupdate
             * @param {AVMessage} message 被修改的消息
             * @param {ConversationBase} conversation 消息所在的会话
             */
            _this3.emit('messageupdate', message, conversation);
            /**
             * 消息被修改
             * @event Conversation#messageupdate
             * @param {AVMessage} message 被修改的消息
             */
            conversation.emit('messageupdate', message);
          }
        });
      }));
    });
  };

  IMClient.prototype._dispatchConvMessage = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(message) {
      var convMessage, _message$convMessage, initBy, m, conversation, payload, _payload, _payload2, _payload3;

      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              convMessage = message.convMessage, _message$convMessage = message.convMessage, initBy = _message$convMessage.initBy, m = _message$convMessage.m;
              _context4.next = 3;
              return this.getConversation(convMessage.cid);

            case 3:
              conversation = _context4.sent;
              _context4.t0 = message.op;
              _context4.next = _context4.t0 === OpType.joined ? 7 : _context4.t0 === OpType.left ? 12 : _context4.t0 === OpType.members_joined ? 17 : _context4.t0 === OpType.members_left ? 22 : 27;
              break;

            case 7:
              if (!conversation.transient) {
                // eslint-disable-next-line no-param-reassign
                conversation.members = union(conversation.members, [this.id]);
              }
              payload = {
                invitedBy: initBy
              };
              /**
               * 当前用户被添加至某个对话
               * @event IMClient#invited
               * @param {Object} payload
               * @param {String} payload.invitedBy 邀请者 id
               * @param {ConversationBase} conversation
               */

              this.emit('invited', payload, conversation);
              /**
               * 当前用户被添加至当前对话
               * @event Conversation#invited
               * @param {Object} payload
               * @param {String} payload.invitedBy 该移除操作的发起者 id
               */
              conversation.emit('invited', payload);
              return _context4.abrupt('return');

            case 12:
              if (!conversation.transient) {
                // eslint-disable-next-line no-param-reassign
                conversation.members = difference(conversation.members, [this.id]);
              }
              _payload = {
                kickedBy: initBy
              };
              /**
               * 当前用户被从某个对话中移除
               * @event IMClient#kicked
               * @param {Object} payload
               * @param {String} payload.kickedBy 该移除操作的发起者 id
               * @param {ConversationBase} conversation
               */

              this.emit('kicked', _payload, conversation);
              /**
               * 当前用户被从当前对话中移除
               * @event Conversation#kicked
               * @param {Object} payload
               * @param {String} payload.kickedBy 该移除操作的发起者 id
               */
              conversation.emit('kicked', _payload);
              return _context4.abrupt('return');

            case 17:
              if (!conversation.transient) {
                // eslint-disable-next-line no-param-reassign
                conversation.members = union(conversation.members, convMessage.m);
              }
              _payload2 = {
                invitedBy: initBy,
                members: m
              };
              /**
               * 有用户被添加至某个对话
               * @event IMClient#membersjoined
               * @param {Object} payload
               * @param {String[]} payload.members 被添加的用户 id 列表
               * @param {String} payload.invitedBy 邀请者 id
               * @param {ConversationBase} conversation
               */

              this.emit('membersjoined', _payload2, conversation);
              /**
               * 有成员被添加至当前对话
               * @event Conversation#membersjoined
               * @param {Object} payload
               * @param {String[]} payload.members 被添加的成员 id 列表
               * @param {String} payload.invitedBy 邀请者 id
               */
              conversation.emit('membersjoined', _payload2);
              return _context4.abrupt('return');

            case 22:
              if (!conversation.transient) {
                // eslint-disable-next-line no-param-reassign
                conversation.members = difference(conversation.members, convMessage.m);
              }
              _payload3 = {
                kickedBy: initBy,
                members: m
              };
              /**
               * 有成员被从某个对话中移除
               * @event IMClient#membersleft
               * @param {Object} payload
               * @param {String[]} payload.members 被移除的成员 id 列表
               * @param {String} payload.kickedBy 该移除操作的发起者 id
               * @param {ConversationBase} conversation
               */

              this.emit('membersleft', _payload3, conversation);
              /**
               * 有成员被从当前对话中移除
               * @event Conversation#membersleft
               * @param {Object} payload
               * @param {String[]} payload.members 被移除的成员 id 列表
               * @param {String} payload.kickedBy 该移除操作的发起者 id
               */
              conversation.emit('membersleft', _payload3);
              return _context4.abrupt('return');

            case 27:
              this.emit('unhandledmessage', message);
              throw new Error('Unrecognized conversation command');

            case 29:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function _dispatchConvMessage(_x5) {
      return _ref8.apply(this, arguments);
    }

    return _dispatchConvMessage;
  }();

  IMClient.prototype._dispatchDirectMessage = function _dispatchDirectMessage(originalMessage) {
    var _this4 = this;

    var directMessage = originalMessage.directMessage,
        _originalMessage$dire = originalMessage.directMessage,
        id = _originalMessage$dire.id,
        cid = _originalMessage$dire.cid,
        fromPeerId = _originalMessage$dire.fromPeerId,
        timestamp = _originalMessage$dire.timestamp,
        transient = _originalMessage$dire.transient,
        patchTimestamp = _originalMessage$dire.patchTimestamp,
        mentionPids = _originalMessage$dire.mentionPids,
        mentionAll = _originalMessage$dire.mentionAll,
        binaryMsg = _originalMessage$dire.binaryMsg,
        msg = _originalMessage$dire.msg;

    var content = binaryMsg ? binaryMsg.toArrayBuffer() : msg;
    return _Promise.all([this.getConversation(directMessage.cid), this._messageParser.parse(content)]).then(function (_ref9) {
      var _ref10 = _slicedToArray(_ref9, 2),
          conversation = _ref10[0],
          message = _ref10[1];

      // deleted conversation
      if (!conversation) return undefined;
      var messageProps = {
        id: id,
        cid: cid,
        timestamp: timestamp,
        updatedAt: patchTimestamp,
        from: fromPeerId,
        mentionList: mentionPids,
        mentionedAll: mentionAll
      };
      _Object$assign(message, messageProps);
      message._updateMentioned(_this4.id);
      message._setStatus(MessageStatus.SENT);
      // filter outgoing message sent from another device
      if (message.from !== _this4.id) {
        if (!(transient || conversation.transient)) {
          _this4._sendAck(message);
        }
      }
      return _this4._dispatchParsedMessage(message, conversation);
    });
  };

  IMClient.prototype._dispatchParsedMessage = function _dispatchParsedMessage(message, conversation) {
    var _this5 = this;

    // beforeMessageDispatch hook
    return applyDispatcher(this._plugins.beforeMessageDispatch, [message, conversation]).then(function (shouldDispatch) {
      if (shouldDispatch === false) return;
      conversation.lastMessage = message; // eslint-disable-line no-param-reassign
      conversation.lastMessageAt = message.timestamp; // eslint-disable-line no-param-reassign
      // filter outgoing message sent from another device
      if (message.from !== _this5.id) {
        conversation.unreadMessagesCount += 1; // eslint-disable-line no-param-reassign
        if (message.mentioned) conversation._setUnreadMessagesMentioned(true);
      }
      /**
       * 当前用户收到消息
       * @event IMClient#message
       * @param {Message} message
       * @param {ConversationBase} conversation 收到消息的对话
       */
      _this5.emit('message', message, conversation);
      /**
       * 当前对话收到消息
       * @event Conversation#message
       * @param {Message} message
       */
      conversation.emit('message', message);
    });
  };

  IMClient.prototype._sendAck = function _sendAck(message) {
    this._debug('send ack for %O', message);
    var cid = message.cid;

    if (!cid) {
      throw new Error('missing cid');
    }
    if (!this._ackMessageBuffer[cid]) {
      this._ackMessageBuffer[cid] = [];
    }
    this._ackMessageBuffer[cid].push(message);
    return this._doSendAck();
  };

  // jsdoc-ignore-start


  // jsdoc-ignore-end
  IMClient.prototype._doSendAck = function _doSendAck() {
    var _this6 = this;

    // if not connected, just skip everything
    if (!this._connection.is('connected')) return;
    this._debug('do send ack %O', this._ackMessageBuffer);
    _Promise.all(_Object$keys(this._ackMessageBuffer).map(function (cid) {
      var convAckMessages = _this6._ackMessageBuffer[cid];
      var timestamps = convAckMessages.map(function (message) {
        return message.timestamp;
      });
      var command = new GenericCommand({
        cmd: 'ack',
        peerId: _this6.id,
        ackMessage: new AckCommand({
          cid: cid,
          fromts: Math.min.apply(null, timestamps),
          tots: Math.max.apply(null, timestamps)
        })
      });
      delete _this6._ackMessageBuffer[cid];
      return _this6._send(command, false).catch(function (error$$1) {
        _this6._debug('send ack failed: %O', error$$1);
        _this6._ackMessageBuffer[cid] = convAckMessages;
      });
    }));
  };

  IMClient.prototype._omitPeerId = function _omitPeerId(value) {
    internal(this).peerIdOmittable = value;
  };

  IMClient.prototype._send = function _send(cmd) {
    var _connection;

    var command = cmd;
    if (!internal(this).peerIdOmittable && this.id) {
      command.peerId = this.id;
    }

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return (_connection = this._connection).send.apply(_connection, [command].concat(args));
  };

  IMClient.prototype._open = function _open(appId, tag, deviceId) {
    var _this7 = this;

    var isReconnect = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    this._debug('open session');

    var _internal = internal(this),
        lastUnreadNotifTime = _internal.lastUnreadNotifTime,
        lastPatchTime = _internal.lastPatchTime;

    return _Promise.resolve(new GenericCommand({
      cmd: 'session',
      op: 'open',
      appId: appId,
      peerId: this.id,
      sessionMessage: new SessionCommand({
        ua: 'js/' + version,
        r: isReconnect,
        lastUnreadNotifTime: lastUnreadNotifTime,
        lastPatchTime: lastPatchTime,
        configBitmap: 1
      })
    })).then(function (command) {
      if (isReconnect) {
        // if sessionToken is not expired, skip signature/tag/deviceId
        var _internal2 = internal(_this7),
            sessionToken = _internal2.sessionToken;

        if (sessionToken) {
          var value = sessionToken.value;

          if (value && value !== Expirable.EXPIRED) {
            _Object$assign(command.sessionMessage, {
              st: value
            });
            return command;
          }
        }
      }
      _Object$assign(command.sessionMessage, trim({
        tag: tag,
        deviceId: deviceId
      }));
      if (_this7.options.signatureFactory) {
        return runSignatureFactory(_this7.options.signatureFactory, [_this7._identity]).then(function (signatureResult) {
          _Object$assign(command.sessionMessage, keyRemap({
            signature: 's',
            timestamp: 't',
            nonce: 'n'
          }, signatureResult));
          return command;
        });
      }
      return command;
    }).then(this._send.bind(this)).then(function (resCommand) {
      var peerId = resCommand.peerId,
          sessionMessage = resCommand.sessionMessage,
          _resCommand$sessionMe = resCommand.sessionMessage,
          token = _resCommand$sessionMe.st,
          tokenTTL = _resCommand$sessionMe.stTtl,
          code = _resCommand$sessionMe.code;

      if (code) {
        throw createError(sessionMessage);
      }
      if (!peerId) {
        console.warn('Unexpected session opened without peerId.');
        return;
      }
      _this7.id = peerId;
      if (!_this7._identity) _this7._identity = peerId;
      if (token) {
        internal(_this7).sessionToken = new Expirable(token, tokenTTL * 1000);
      }
    }).catch(function (error$$1) {
      if (error$$1.code === ErrorCode.SESSION_TOKEN_EXPIRED) {
        if (internal(_this7).sessionToken === undefined) {
          // let it fail if sessoinToken not cached but command rejected as token expired
          // to prevent session openning flood
          throw new Error('Unexpected session expiration');
        }
        debug$6('Session token expired, reopening');
        delete internal(_this7).sessionToken;
        return _this7._open(appId, tag, deviceId, isReconnect);
      }
      throw error$$1;
    });
  };

  /**
   * 关闭客户端
   * @return {Promise}
   */


  IMClient.prototype.close = function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
      var command;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              this._debug('close session');
              command = new GenericCommand({
                cmd: 'session',
                op: 'close'
              });
              _context5.next = 4;
              return this._send(command);

            case 4:
              internal(this)._eventemitter.emit('close');
              this.emit('close', {
                code: 0
              });

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function close() {
      return _ref11.apply(this, arguments);
    }

    return close;
  }();
  /**
   * 获取 client 列表中在线的 client，每次查询最多 20 个 clientId，超出部分会被忽略
   * @param  {String[]} clientIds 要查询的 client ids
   * @return {Primse.<String[]>} 在线的 client ids
   */


  IMClient.prototype.ping = function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(clientIds) {
      var command, resCommand;
      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              this._debug('ping');

              if (clientIds instanceof Array) {
                _context6.next = 3;
                break;
              }

              throw new TypeError('clientIds ' + clientIds + ' is not an Array');

            case 3:
              if (clientIds.length) {
                _context6.next = 5;
                break;
              }

              return _context6.abrupt('return', _Promise.resolve([]));

            case 5:
              command = new GenericCommand({
                cmd: 'session',
                op: 'query',
                sessionMessage: new SessionCommand({
                  sessionPeerIds: clientIds
                })
              });
              _context6.next = 8;
              return this._send(command);

            case 8:
              resCommand = _context6.sent;
              return _context6.abrupt('return', resCommand.sessionMessage.onlineSessionPeerIds);

            case 10:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function ping(_x7) {
      return _ref12.apply(this, arguments);
    }

    return ping;
  }();

  /**
   * 获取某个特定的对话
   * @param  {String} id 对话 id，对应 _Conversation 表中的 objectId
   * @param  {Boolean} [noCache=false] 强制不从缓存中获取
   * @return {Promise.<ConversationBase>} 如果 id 对应的对话不存在则返回 null
   */


  IMClient.prototype.getConversation = function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(id) {
      var noCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var cachedConversation;
      return _regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!(typeof id !== 'string')) {
                _context7.next = 2;
                break;
              }

              throw new TypeError(id + ' is not a String');

            case 2:
              if (noCache) {
                _context7.next = 6;
                break;
              }

              cachedConversation = this._conversationCache.get(id);

              if (!cachedConversation) {
                _context7.next = 6;
                break;
              }

              return _context7.abrupt('return', cachedConversation);

            case 6:
              if (!isTemporaryConversatrionId(id)) {
                _context7.next = 8;
                break;
              }

              return _context7.abrupt('return', this._getTemporaryConversations(id));

            case 8:
              return _context7.abrupt('return', this.getQuery().equalTo('objectId', id).find().then(function (conversations) {
                return conversations[0] || null;
              }));

            case 9:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function getConversation(_x9) {
      return _ref13.apply(this, arguments);
    }

    return getConversation;
  }();

  /**
   * 通过 id 批量获取某个特定的对话
   * @since 3.4.0
   * @param  {String[]} ids 对话 id 列表，对应 _Conversation 表中的 objectId
   * @param  {Boolean} [noCache=false] 强制不从缓存中获取
   * @return {Promise.<ConversationBase[]>} 如果 id 对应的对话不存在则返回 null
   */


  IMClient.prototype.getConversations = function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(ids) {
      var _this8 = this;

      var noCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var remoteConversationIds, remoteTemporaryConversationIds, query, remoteTemporaryConversationsPromise;
      return _regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              remoteConversationIds = noCache ? ids : ids.filter(function (id) {
                return _this8._conversationCache.get(id) === null;
              });

              if (!remoteConversationIds.length) {
                _context8.next = 8;
                break;
              }

              remoteTemporaryConversationIds = remove(remoteConversationIds, isTemporaryConversatrionId);
              query = [];

              if (remoteConversationIds.length) {
                query.push(this.getQuery().containedIn('objectId', remoteConversationIds).limit(999).find());
              }
              if (remoteTemporaryConversationIds.length) {
                remoteTemporaryConversationsPromise = remoteTemporaryConversationIds.map(this._getTemporaryConversations.bind(this));

                query.push.apply(query, _toConsumableArray(remoteTemporaryConversationsPromise));
              }
              _context8.next = 8;
              return _Promise.all(query);

            case 8:
              return _context8.abrupt('return', ids.map(function (id) {
                return _this8._conversationCache.get(id);
              }));

            case 9:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function getConversations(_x11) {
      return _ref14.apply(this, arguments);
    }

    return getConversations;
  }();

  IMClient.prototype._getTemporaryConversations = function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(ids) {
      var command, resCommand;
      return _regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              command = new GenericCommand({
                cmd: 'conv',
                op: 'query',
                convMessage: new ConvCommand({
                  tempConvId: ids
                })
              });
              _context9.next = 3;
              return this._send(command);

            case 3:
              resCommand = _context9.sent;
              _context9.next = 6;
              return this._handleQueryResults(resCommand);

            case 6:
              return _context9.abrupt('return', _context9.sent[0]);

            case 7:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function _getTemporaryConversations(_x12) {
      return _ref15.apply(this, arguments);
    }

    return _getTemporaryConversations;
  }();

  /**
   * 构造一个 ConversationQuery 来查询对话
   * @return {ConversationQuery}
   */


  IMClient.prototype.getQuery = function getQuery() {
    return new ConversationQuery(this);
  };

  IMClient.prototype._executeQuery = function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(query) {
      var queryJSON, command, resCommand;
      return _regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              queryJSON = query.toJSON();

              queryJSON.where = new JsonObjectMessage({
                data: _JSON$stringify(encode$1(queryJSON.where))
              });
              command = new GenericCommand({
                cmd: 'conv',
                op: 'query',
                convMessage: new ConvCommand(queryJSON)
              });
              _context10.next = 5;
              return this._send(command);

            case 5:
              resCommand = _context10.sent;
              return _context10.abrupt('return', this._handleQueryResults(resCommand));

            case 7:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    function _executeQuery(_x13) {
      return _ref16.apply(this, arguments);
    }

    return _executeQuery;
  }();

  IMClient.prototype._handleQueryResults = function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(resCommand) {
      var conversations, commandString;
      return _regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              conversations = void 0;
              _context11.prev = 1;

              conversations = JSON.parse(decode$1(resCommand.convMessage.results.data));
              _context11.next = 9;
              break;

            case 5:
              _context11.prev = 5;
              _context11.t0 = _context11['catch'](1);
              commandString = _JSON$stringify(trim(resCommand));
              throw new Error('Parse query result failed: ' + _context11.t0.message + '. Command: ' + commandString);

            case 9:
              _context11.next = 11;
              return _Promise.all(conversations.map(this._parseConversationFromRawData.bind(this)));

            case 11:
              conversations = _context11.sent;
              return _context11.abrupt('return', conversations.map(this._upsertConversationToCache.bind(this)));

            case 13:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, this, [[1, 5]]);
    }));

    function _handleQueryResults(_x14) {
      return _ref17.apply(this, arguments);
    }

    return _handleQueryResults;
  }();

  IMClient.prototype._upsertConversationToCache = function _upsertConversationToCache(fetchedConversation) {
    var conversation = this._conversationCache.get(fetchedConversation.id);
    if (!conversation) {
      conversation = fetchedConversation;
      this._debug('no match, set cache');
      this._conversationCache.set(fetchedConversation.id, fetchedConversation);
    } else {
      this._debug('update cached conversation');
      ['creator', 'createdAt', 'updatedAt', 'lastMessageAt', 'lastMessage', 'mutedMembers', 'members', '_attributes', 'transient', 'muted'].forEach(function (key) {
        var value = fetchedConversation[key];
        if (value !== undefined) conversation[key] = value;
      });
      if (conversation._reset) conversation._reset();
    }
    return conversation;
  };

  /**
   * 反序列化消息，与 {@link Message#toFullJSON} 相对。
   * @param {Object}
   * @return {AVMessage} 解析后的消息
   * @since 4.0.0
   */


  IMClient.prototype.parseMessage = function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(_ref18) {
      var data = _ref18.data,
          _ref18$bin = _ref18.bin,
          bin = _ref18$bin === undefined ? false : _ref18$bin,
          properties = _objectWithoutProperties(_ref18, ['data', 'bin']);

      var content, message;
      return _regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              content = bin ? base64Arraybuffer.decode(data) : data;
              _context12.next = 3;
              return this._messageParser.parse(content);

            case 3:
              message = _context12.sent;

              _Object$assign(message, properties);
              message._updateMentioned(this.id);
              return _context12.abrupt('return', message);

            case 7:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, this);
    }));

    function parseMessage(_x15) {
      return _ref19.apply(this, arguments);
    }

    return parseMessage;
  }();

  /**
   * 反序列化对话，与 {@link Conversation#toFullJSON} 相对。
   * @param {Object}
   * @return {ConversationBase} 解析后的对话
   * @since 4.0.0
   */


  IMClient.prototype.parseConversation = function () {
    var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(_ref20) {
      var id = _ref20.id,
          lastMessageAt = _ref20.lastMessageAt,
          lastMessage = _ref20.lastMessage,
          lastDeliveredAt = _ref20.lastDeliveredAt,
          lastReadAt = _ref20.lastReadAt,
          unreadMessagesCount = _ref20.unreadMessagesCount,
          members = _ref20.members,
          mentioned = _ref20.mentioned,
          properties = _objectWithoutProperties(_ref20, ['id', 'lastMessageAt', 'lastMessage', 'lastDeliveredAt', 'lastReadAt', 'unreadMessagesCount', 'members', 'mentioned']);

      var conversationData, transient, system, expiredAt;
      return _regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              conversationData = {
                id: id,
                lastMessageAt: lastMessageAt,
                lastMessage: lastMessage,
                lastDeliveredAt: lastDeliveredAt,
                lastReadAt: lastReadAt,
                unreadMessagesCount: unreadMessagesCount,
                members: members,
                mentioned: mentioned
              };

              if (!lastMessage) {
                _context13.next = 6;
                break;
              }

              _context13.next = 4;
              return this.parseMessage(lastMessage);

            case 4:
              conversationData.lastMessage = _context13.sent;

              conversationData.lastMessage._setStatus(MessageStatus.SENT);

            case 6:
              transient = properties.transient, system = properties.system, expiredAt = properties.expiredAt;

              if (!transient) {
                _context13.next = 9;
                break;
              }

              return _context13.abrupt('return', new ChatRoom(conversationData, properties, this));

            case 9:
              if (!system) {
                _context13.next = 11;
                break;
              }

              return _context13.abrupt('return', new ServiceConversation(conversationData, properties, this));

            case 11:
              if (!(expiredAt || isTemporaryConversatrionId(id))) {
                _context13.next = 13;
                break;
              }

              return _context13.abrupt('return', new TemporaryConversation(conversationData, { expiredAt: expiredAt }, this));

            case 13:
              return _context13.abrupt('return', new Conversation(conversationData, properties, this));

            case 14:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, this);
    }));

    function parseConversation(_x16) {
      return _ref21.apply(this, arguments);
    }

    return parseConversation;
  }();

  IMClient.prototype._parseConversationFromRawData = function () {
    var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14(rawData) {
      var data, ttl;
      return _regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              data = keyRemap({
                objectId: 'id',
                lm: 'lastMessageAt',
                m: 'members',
                tr: 'transient',
                sys: 'system',
                c: 'creator',
                mu: 'mutedMembers'
              }, rawData);

              if (data.msg) {
                data.lastMessage = {
                  data: data.msg,
                  bin: data.bin,
                  from: data.msg_from,
                  id: data.msg_mid,
                  timestamp: data.msg_timestamp,
                  updatedAt: data.patch_timestamp
                };
                delete data.lastMessageFrom;
                delete data.lastMessageId;
                delete data.lastMessageTimestamp;
                delete data.lastMessagePatchTimestamp;
              }
              ttl = data.ttl;

              if (ttl) data.expiredAt = Date.now() + ttl * 1000;
              return _context14.abrupt('return', this.parseConversation(data));

            case 5:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee14, this);
    }));

    function _parseConversationFromRawData(_x17) {
      return _ref22.apply(this, arguments);
    }

    return _parseConversationFromRawData;
  }();

  /**
   * 创建一个对话
   * @param {Object} options 除了下列字段外的其他字段将被视为对话的自定义属性
   * @param {String[]} options.members 对话的初始成员列表，默认包含当前 client
   * @param {String} [options.name] 对话的名字
   * @param {Boolean} [options.unique=false] 唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话
   * @return {Promise.<Conversation>}
   */


  IMClient.prototype.createConversation = function () {
    var _ref24 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15() {
      var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var m = _ref23.members,
          name$$1 = _ref23.name,
          transient = _ref23.transient,
          unique = _ref23.unique,
          tempConv = _ref23._tempConv,
          tempConvTTL = _ref23._tempConvTTL,
          properties = _objectWithoutProperties(_ref23, ['members', 'name', 'transient', 'unique', '_tempConv', '_tempConvTTL']);

      var members, attr, startCommandJson, command, _params, signatureResult, _ref25, _ref25$convMessage, cid, cdate, ttl, data, conversation;

      return _regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              if (transient || Array.isArray(m)) {
                _context15.next = 2;
                break;
              }

              throw new TypeError('conversation members ' + m + ' is not an array');

            case 2:
              members = new _Set(m);

              members.add(this.id);
              members = _Array$from(members).sort();
              attr = properties || {};

              if (!name$$1) {
                _context15.next = 10;
                break;
              }

              if (!(typeof name$$1 !== 'string')) {
                _context15.next = 9;
                break;
              }

              throw new TypeError('conversation name ' + name$$1 + ' is not a string');

            case 9:
              attr.name = name$$1;

            case 10:
              attr = new JsonObjectMessage({
                data: _JSON$stringify(encode$1(attr))
              });

              startCommandJson = {
                m: members,
                attr: attr,
                transient: transient,
                unique: unique,
                tempConv: tempConv,
                tempConvTTL: tempConvTTL
              };
              command = new GenericCommand({
                cmd: 'conv',
                op: 'start',
                convMessage: new ConvCommand(startCommandJson)
              });

              if (!this.options.conversationSignatureFactory) {
                _context15.next = 19;
                break;
              }

              _params = [null, this._identity, members, 'create'];
              _context15.next = 17;
              return runSignatureFactory(this.options.conversationSignatureFactory, _params);

            case 17:
              signatureResult = _context15.sent;

              _Object$assign(command.convMessage, keyRemap({
                signature: 's',
                timestamp: 't',
                nonce: 'n'
              }, signatureResult));

            case 19:
              _context15.next = 21;
              return this._send(command);

            case 21:
              _ref25 = _context15.sent;
              _ref25$convMessage = _ref25.convMessage;
              cid = _ref25$convMessage.cid;
              cdate = _ref25$convMessage.cdate;
              ttl = _ref25$convMessage.tempConvTTL;
              data = _extends({
                name: name$$1,
                transient: transient,
                unique: unique,
                id: cid,
                createdAt: cdate,
                updatedAt: cdate,
                lastMessageAt: null,
                creator: this.id,
                members: transient ? [] : members
              }, properties);

              if (ttl) data.expiredAt = Date.now() + ttl * 1000;
              _context15.next = 30;
              return this.parseConversation(data);

            case 30:
              conversation = _context15.sent;
              return _context15.abrupt('return', this._upsertConversationToCache(conversation));

            case 32:
            case 'end':
              return _context15.stop();
          }
        }
      }, _callee15, this);
    }));

    function createConversation() {
      return _ref24.apply(this, arguments);
    }

    return createConversation;
  }();

  /**
   * 创建一个聊天室
   * @since 4.0.0
   * @param {Object} options 除了下列字段外的其他字段将被视为对话的自定义属性
   * @param {String} [options.name] 对话的名字
   * @return {Promise.<ChatRoom>}
   */


  IMClient.prototype.createChatRoom = function () {
    var _ref26 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(param) {
      return _regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              return _context16.abrupt('return', this.createConversation(_extends({}, param, {
                transient: true,
                members: null,
                unique: false
              })));

            case 1:
            case 'end':
              return _context16.stop();
          }
        }
      }, _callee16, this);
    }));

    function createChatRoom(_x19) {
      return _ref26.apply(this, arguments);
    }

    return createChatRoom;
  }();

  /**
   * 创建一个临时对话
   * @since 4.0.0
   * @param {Object} options
   * @param {String[]} options.members 对话的初始成员列表，默认包含当前 client
   * @param {String} [options.ttl] 对话存在时间，单位为秒，最大值与默认值均为 86400（一天），过期后该对话不再可用。
   * @return {Promise.<TemporaryConversation>}
   */


  IMClient.prototype.createTemporaryConversation = function () {
    var _ref28 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(_ref27) {
      var _tempConvTTL = _ref27.ttl,
          param = _objectWithoutProperties(_ref27, ['ttl']);

      return _regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              return _context17.abrupt('return', this.createConversation(_extends({}, param, {
                transient: false,
                unique: false,
                _tempConv: true,
                _tempConvTTL: _tempConvTTL
              })));

            case 1:
            case 'end':
              return _context17.stop();
          }
        }
      }, _callee17, this);
    }));

    function createTemporaryConversation(_x20) {
      return _ref28.apply(this, arguments);
    }

    return createTemporaryConversation;
  }();

  // jsdoc-ignore-start


  // jsdoc-ignore-end
  IMClient.prototype._doSendRead = function _doSendRead() {
    var _this9 = this;

    // if not connected, just skip everything
    if (!this._connection.is('connected')) return;
    var buffer = internal(this).readConversationsBuffer;
    var conversations = _Array$from(buffer);
    if (!conversations.length) return;
    var ids = conversations.map(function (conversation) {
      if (!(conversation instanceof ConversationBase)) {
        throw new TypeError(conversation + ' is not a Conversation');
      }
      return conversation.id;
    });
    this._debug('mark [' + ids + '] as read');
    buffer.clear();
    this._sendReadCommand(conversations).catch(function (error$$1) {
      _this9._debug('send read failed: %O', error$$1);
      conversations.forEach(buffer.add.bind(buffer));
    });
  };

  IMClient.prototype._sendReadCommand = function _sendReadCommand(conversations) {
    var _this10 = this;

    return this._send(new GenericCommand({
      cmd: 'read',
      readMessage: new ReadCommand({
        convs: conversations.map(function (conversation) {
          return new ReadTuple({
            cid: conversation.id,
            mid: conversation.lastMessage && conversation.lastMessage.from !== _this10.id ? conversation.lastMessage.id : undefined,
            timestamp: (conversation.lastMessageAt || new Date()).getTime()
          });
        })
      })
    }), false);
  };

  return IMClient;
}(EventEmitter), (_applyDecoratedDescriptor$1(_class$1.prototype, '_doSendAck', [_dec], _Object$getOwnPropertyDescriptor(_class$1.prototype, '_doSendAck'), _class$1.prototype), _applyDecoratedDescriptor$1(_class$1.prototype, '_doSendRead', [_dec2], _Object$getOwnPropertyDescriptor(_class$1.prototype, '_doSendRead'), _class$1.prototype)), _class$1));

var BinaryMessage = function (_Message) {
  _inherits(BinaryMessage, _Message);

  /**
   * 二进制消息
   * @extends Message
   * @param {ArrayBuffer} buffer
   * @since 4.0.0
   */
  function BinaryMessage(buffer) {
    _classCallCheck(this, BinaryMessage);

    if (!(buffer instanceof ArrayBuffer)) {
      throw new TypeError(buffer + ' is not an ArrayBuffer');
    }
    return _possibleConstructorReturn(this, _Message.call(this, buffer));
  }

  /**
   * @type ArrayBuffer
   */


  BinaryMessage.validate = function validate(target) {
    return target instanceof ArrayBuffer;
  };

  BinaryMessage.prototype.toJSON = function toJSON() {
    return _extends({}, _Message.prototype._toJSON.call(this), {
      data: base64Arraybuffer.encode(this.content)
    });
  };

  BinaryMessage.prototype.toFullJSON = function toFullJSON() {
    return _extends({}, _Message.prototype.toFullJSON.call(this), {
      bin: true,
      data: base64Arraybuffer.encode(this.content)
    });
  };

  _createClass(BinaryMessage, [{
    key: 'buffer',
    get: function get() {
      return this.content;
    },
    set: function set(buffer) {
      this.content = buffer;
    }
  }]);

  return BinaryMessage;
}(Message);

var _dec$3;
var _class$4;

// jsdoc-ignore-start

// jsdoc-ignore-end
var TextMessage = (_dec$3 = messageType(-1), _dec$3(_class$4 = IE10Compatible(_class$4 = function (_TypedMessage) {
  _inherits(TextMessage, _TypedMessage);

  /**
   * 文类类型消息
   * @extends TypedMessage
   * @param  {String} [text='']
   * @throws {TypeError} text 不是 String 类型
   */
  function TextMessage() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, TextMessage);

    if (typeof text !== 'string') {
      throw new TypeError(text + ' is not a string');
    }

    var _this = _possibleConstructorReturn(this, _TypedMessage.call(this));

    _this.setText(text);
    return _this;
  }

  return TextMessage;
}(TypedMessage)) || _class$4) || _class$4);

var _class$5;

function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var debug$10 = d('LC:MessageParser');

var tryParseJson = function tryParseJson(target, key, descriptor) {
  var fn = descriptor.value;
  // eslint-disable-next-line no-param-reassign
  descriptor.value = function wrapper(param) {
    var content = void 0;
    if (typeof param !== 'string') {
      content = param;
    } else {
      try {
        content = JSON.parse(param);
      } catch (error) {
        content = param;
      }
    }
    return fn.call(this, content);
  };
};

var applyPlugins = function applyPlugins(target, key, descriptor) {
  var fn = descriptor.value;
  // eslint-disable-next-line no-param-reassign
  descriptor.value = function wrapper(json) {
    var _this = this;

    return _Promise.resolve(json).then(applyMiddlewares(this._plugins.beforeMessageParse)).then(function (decoratedJson) {
      return fn.call(_this, decoratedJson);
    }).then(applyMiddlewares(this._plugins.afterMessageParse));
  };
};

var MessageParser = (_class$5 = function () {
  function MessageParser() {
    var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MessageParser);

    this._plugins = plugins;
    this._messageClasses = [];
  }

  MessageParser.prototype.register = function register(messageClass) {
    if (messageClass && messageClass.parse && messageClass.prototype && messageClass.prototype.getPayload) {
      this._messageClasses.unshift(messageClass);
    } else {
      throw new TypeError('Invalid messageClass');
    }
  };

  // jsdoc-ignore-start


  // jsdoc-ignore-end
  MessageParser.prototype.parse = function parse(content) {
    debug$10('parsing message: %O', content);
    // eslint-disable-next-line no-restricted-syntax
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(this._messageClasses), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var Klass = _step.value;

        var contentCopy = isPlainObject(content) ? _Object$assign({}, content) : content;
        var valid = void 0;
        var result = void 0;
        try {
          valid = Klass.validate(contentCopy);
        } catch (error) {
          // eslint-disable-line no-empty
        }
        if (valid) {
          try {
            result = Klass.parse(contentCopy);
          } catch (error) {
            console.warn('parsing a valid message content error', {
              error: error,
              Klass: Klass,
              content: contentCopy
            });
          }
          if (result !== undefined) {
            debug$10('parse result: %O', result);
            return result;
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    throw new Error('No Message Class matched');
  };

  return MessageParser;
}(), (_applyDecoratedDescriptor$2(_class$5.prototype, 'parse', [tryParseJson, applyPlugins], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'parse'), _class$5.prototype)), _class$5);

var _this = undefined;

/** @module leancloud-realtime */
var debug$5 = d('LC:IMPlugin');

/**
 * 消息优先级枚举
 * @enum {Number}
 * @since 3.3.0
 */
var MessagePriority = {
  /** 高 */
  HIGH: 1,
  /** 普通 */
  NORMAL: 2,
  /** 低 */
  LOW: 3
};
_Object$freeze(MessagePriority);

/**
 * 为 Conversation 定义一个新属性
 * @param {String} prop 属性名
 * @param {Object} [descriptor] 属性的描述符，参见 {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor#Description getOwnPropertyDescriptor#Description - MDN}，默认为该属性名对应的 Conversation 自定义属性的 getter/setter
 * @returns void
 * @example
 *
 * conversation.get('type');
 * conversation.set('type', 1);
 *
 * // equals to
 * defineConversationProperty('type');
 * conversation.type;
 * conversation.type = 1;
 */
var defineConversationProperty = function defineConversationProperty(prop) {
  var descriptor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    get: function get() {
      return this.get(prop);
    },
    set: function set(value) {
      this.set(prop, value);
    }
  };

  _Object$defineProperty(Conversation.prototype, prop, descriptor);
};

var onRealtimeCreate = function onRealtimeCreate(realtime) {
  /* eslint-disable no-param-reassign */
  var deviceId = uuid();
  realtime._IMClients = {};
  realtime._IMClientsCreationCount = 0;
  var messageParser = new MessageParser(realtime._plugins);
  realtime._messageParser = messageParser;

  var signAVUser = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(user) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', realtime._request({
                method: 'POST',
                path: '/rtm/sign',
                data: {
                  session_token: user.getSessionToken()
                }
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function signAVUser(_x2) {
      return _ref.apply(this, arguments);
    };
  }();

  /**
   * 注册消息类
   *
   * 在接收消息、查询消息时，会按照消息类注册顺序的逆序依次尝试解析消息内容
   *
   * @memberof Realtime
   * @instance
   * @param  {Function | Function[]} messageClass 消息类，需要实现 {@link AVMessage} 接口，
   * 建议继承自 {@link TypedMessage}
   * @throws {TypeError} 如果 messageClass 没有实现 {@link AVMessage} 接口则抛出异常
   */
  var register = function register(messageClass) {
    return ensureArray(messageClass).map(messageParser.register.bind(messageParser));
  };
  register(ensureArray(realtime._plugins.messageClasses));
  /**
   * 创建一个即时通讯客户端，多次创建相同 id 的客户端会返回同一个实例
   * @memberof Realtime
   * @instance
   * @param  {String|AV.User} [identity] 客户端 identity，如果不指定该参数，服务端会随机生成一个字符串作为 identity，
   * 如果传入一个已登录的 AV.User，则会使用该用户的 id 作为客户端 identity 登录。
   * @param  {Object} [clientOptions] 详细参数 @see {@link IMClient}
   * @param  {String} [tag] 客户端类型标记，以支持单点登录功能
   * @return {Promise.<IMClient>}
   */
  var createIMClient = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(identity, clientOptions, tag) {
      var id, buildinOptions, sessionToken, promise;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = void 0;
              buildinOptions = {};

              if (!identity) {
                _context2.next = 18;
                break;
              }

              if (!(typeof identity === 'string')) {
                _context2.next = 7;
                break;
              }

              id = identity;
              _context2.next = 16;
              break;

            case 7:
              if (!(identity.id && identity.getSessionToken)) {
                _context2.next = 15;
                break;
              }

              id = identity.id;
              sessionToken = identity.getSessionToken();

              if (sessionToken) {
                _context2.next = 12;
                break;
              }

              throw new Error('User must be authenticated');

            case 12:
              buildinOptions.signatureFactory = signAVUser;
              _context2.next = 16;
              break;

            case 15:
              throw new TypeError('Identity must be a String or an AV.User');

            case 16:
              if (!(realtime._IMClients[id] !== undefined)) {
                _context2.next = 18;
                break;
              }

              return _context2.abrupt('return', realtime._IMClients[id]);

            case 18:
              promise = realtime._open().then(function (connection) {
                var client = new IMClient(id, _extends({}, buildinOptions, clientOptions), connection, {
                  _messageParser: messageParser,
                  _plugins: realtime._plugins,
                  _identity: identity
                });
                connection.on('reconnect', function () {
                  return client._open(realtime._options.appId, tag, deviceId, true)
                  /**
                   * 客户端连接恢复正常，该事件通常在 {@link Realtime#event:reconnect} 之后发生
                   * @event IMClient#reconnect
                   * @see Realtime#event:reconnect
                   * @since 3.2.0
                   */
                  /**
                   * 客户端重新登录发生错误（网络连接已恢复，但重新登录错误）
                   * @event IMClient#reconnecterror
                   * @since 3.2.0
                   */
                  .then(function () {
                    return client.emit('reconnect');
                  }, function (error) {
                    return client.emit('reconnecterror', error);
                  });
                });
                internal(client)._eventemitter.on('close', function () {
                  delete realtime._IMClients[client.id];
                  realtime._deregister(client);
                }, realtime);
                return client._open(realtime._options.appId, tag, deviceId).then(function () {
                  realtime._IMClients[client.id] = client;
                  realtime._IMClientsCreationCount += 1;
                  if (realtime._IMClientsCreationCount === 1) {
                    client._omitPeerId(true);
                    realtime._firstIMClient = client;
                  } else if (realtime._IMClientsCreationCount > 1 && realtime._firstIMClient) {
                    realtime._firstIMClient._omitPeerId(false);
                  }
                  realtime._register(client);
                  return client;
                }).catch(function (error) {
                  delete realtime._IMClients[client.id];
                  throw error;
                });
              });

              if (identity) {
                realtime._IMClients[id] = promise;
              }
              return _context2.abrupt('return', promise);

            case 21:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function createIMClient(_x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();
  _Object$assign(realtime, {
    register: register,
    createIMClient: createIMClient
  });
  /* eslint-enable no-param-reassign */
};

var beforeCommandDispatch = function beforeCommandDispatch(command, realtime) {
  var isIMCommand = command.service === null || command.service === 2;
  if (!isIMCommand) return true;
  var targetClient = command.peerId ? realtime._IMClients[command.peerId] : realtime._firstIMClient;
  if (targetClient) {
    _Promise.resolve(targetClient).then(function (client) {
      return client._dispatchCommand(command);
    }).catch(debug$5);
  } else {
    debug$5('[WARN] Unexpected message received without any live client match: %O', trim(command));
  }
  return false;
};

var IMPlugin = {
  name: 'leancloud-realtime-plugin-im',
  onRealtimeCreate: onRealtimeCreate,
  beforeCommandDispatch: beforeCommandDispatch,
  messageClasses: [Message, BinaryMessage, RecalledMessage, TextMessage]
};

Realtime.defineConversationProperty = defineConversationProperty;
Realtime.__preRegisteredPlugins = [IMPlugin];

exports.Protocals = message;
exports.Promise = _Promise;
exports.EventEmitter = EventEmitter;
exports.Realtime = Realtime;
exports.ErrorCode = ErrorCode;
exports.Message = Message;
exports.BinaryMessage = BinaryMessage;
exports.TypedMessage = TypedMessage;
exports.TextMessage = TextMessage;
exports.RecalledMessage = RecalledMessage;
exports.MessagePriority = MessagePriority;
exports.MessageStatus = MessageStatus;
exports.MessageQueryDirection = MessageQueryDirection;
exports.defineConversationProperty = defineConversationProperty;
exports.IMPlugin = IMPlugin;
exports.messageType = messageType;
exports.messageField = messageField;
exports.IE10Compatible = IE10Compatible;
exports.Conversation = Conversation;
exports.ChatRoom = ChatRoom;
exports.ServiceConversation = ServiceConversation;
exports.TemporaryConversation = TemporaryConversation;

//# sourceMappingURL=realtime.js.map