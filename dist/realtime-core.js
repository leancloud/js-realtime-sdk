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
            "name": "modify",
            "id": 150
        }, {
            "name": "modified",
            "id": 151
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





var isIE10 = global$1.navigator && global$1.navigator.userAgent && global$1.navigator.userAgent.indexOf('MSIE 10.') !== -1;

/* eslint-disable no-proto */

/* eslint-enable no-proto */




var map = new _WeakMap();

// protected property helper
var internal = function internal(object) {
  if (!map.has(object)) {
    map.set(object, {});
  }
  return map.get(object);
};

// debug utility
var removeNull = function removeNull(obj) {
  if (!isPlainObject(obj)) return obj;
  var object = _Object$assign({}, obj);
  // eslint-disable-next-line no-restricted-syntax
  for (var prop in object) {
    if ({}.hasOwnProperty.call(object, prop)) {
      var value = object[prop];
      if (value === null) {
        delete object[prop];
      } else {
        object[prop] = removeNull(value);
      }
    }
  }
  return object;
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



// eslint-disable-next-line no-undef
var isWeapp = (typeof wx === 'undefined' ? 'undefined' : _typeof(wx)) === 'object' && typeof wx.connectSocket === 'function';

// throttle decorator

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

    return getUrls().then(function (wsUrls) {
      var urls = wsUrls;
      if (!(urls instanceof Array)) {
        urls = [urls];
      }
      return tryAll(urls.map(function (url) {
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
 * 接受一个参数为原始消息，是某个消息 JSON 化（<code>message.toJSON()</code>）的返回值，一般是一个 JSON 对象。
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
   *                                            适用于 WebSocket 实现不支持二进制数据格式的情况（如微信小程序）
   * @param  {Boolean} [options.ssl=true] 使用 wss 进行连接
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
      noBinary: isWeapp,
      ssl: true,
      server: process.env.SERVER
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
              return this.constructor._fetchAppRouter({ appId: appId, region: region });

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
        return _this2._getEndpoints(_this2._options);
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

  Realtime.prototype._getEndpoints = function _getEndpoints(options) {
    var _this3 = this;

    return _Promise.resolve(this._cache.get('endpoints') || this.constructor._fetchEndpointsInfo(options).then(tap(function (info) {
      return _this3._cache.set('endpoints', info, info.ttl * 1000);
    }))).then(function (info) {
      debug('endpoint info: %O', info);
      return [info.server, info.secondary];
    });
  };

  Realtime._fetchAppRouter = function _fetchAppRouter(_ref4) {
    var appId = _ref4.appId,
        region = _ref4.region;

    debug('fetch router');
    switch (region) {
      case 'cn':
        {
          var cachedRouter = routerCache.get(appId);
          if (cachedRouter) {
            return _Promise.resolve(cachedRouter);
          }
          return axios.get('https://app-router.leancloud.cn/2/route', {
            params: {
              appId: appId
            },
            timeout: 20000
          }).then(function (res) {
            return res.data;
          }).then(tap(debug)).then(function (_ref5) {
            var rtmRouter = _ref5.rtm_router_server,
                api = _ref5.api_server,
                _ref5$ttl = _ref5.ttl,
                ttl = _ref5$ttl === undefined ? 3600 : _ref5$ttl;

            if (!rtmRouter) {
              throw new Error('rtm router not exists');
            }
            var router = {
              rtmRouter: rtmRouter,
              api: api
            };
            routerCache.set(appId, router, ttl * 1000);
            return router;
          }).catch(function () {
            var id = appId.slice(0, 8).toLowerCase();
            return {
              rtmRouter: id + '.rtm.lncld.net',
              api: id + '.api.lncld.net'
            };
          });
        }
      case 'us':
        return _Promise.resolve({
          rtmRouter: 'router-a0-push.leancloud.cn',
          api: 'us-api.leancloud.cn'
        });
      default:
        throw new Error('Region [' + region + '] is not supported.');
    }
  };

  Realtime._fetchEndpointsInfo = function _fetchEndpointsInfo(_ref6) {
    var appId = _ref6.appId,
        region = _ref6.region,
        ssl = _ref6.ssl,
        server = _ref6.server;

    debug('fetch endpoint info');
    return this._fetchAppRouter({ appId: appId, region: region }).then(tap(debug)).then(function (_ref7) {
      var rtmRouter = _ref7.rtmRouter;
      return axios.get('https://' + rtmRouter + '/v1/route', {
        params: {
          appId: appId,
          secure: ssl,
          features: isWeapp ? 'wechat' : undefined,
          server: server,
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

exports.Protocals = message;
exports.Promise = _Promise;
exports.EventEmitter = EventEmitter;
exports.Realtime = Realtime;
exports.ErrorCode = ErrorCode;

//# sourceMappingURL=realtime-core.js.map