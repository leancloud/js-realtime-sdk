module.exports = require("protobufjs/dist/protobuf-light").newBuilder({})['import']({
    "package": "push_server.messages",
    "options": {
        "objc_class_prefix": "AVIM"
    },
    "messages": [
        {
            "name": "JsonObjectMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "data",
                    "id": 1
                }
            ]
        },
        {
            "name": "UnreadTuple",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "cid",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "unread",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mid",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timestamp",
                    "id": 4
                }
            ]
        },
        {
            "name": "LogItem",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "from",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "data",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timestamp",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "msgId",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "ackAt",
                    "id": 5
                }
            ]
        },
        {
            "name": "LoginCommand",
            "fields": []
        },
        {
            "name": "DataCommand",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "ids",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "JsonObjectMessage",
                    "name": "msg",
                    "id": 2
                }
            ]
        },
        {
            "name": "SessionCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "t",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "n",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "s",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ua",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "r",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "tag",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "deviceId",
                    "id": 7
                },
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "sessionPeerIds",
                    "id": 8
                },
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "onlineSessionPeerIds",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "st",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "stTtl",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "code",
                    "id": 12
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "reason",
                    "id": 13
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "deviceToken",
                    "id": 14
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "sp",
                    "id": 15
                }
            ]
        },
        {
            "name": "ErrorCommand",
            "fields": [
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "code",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "reason",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "appCode",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "detail",
                    "id": 4
                }
            ]
        },
        {
            "name": "DirectCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "msg",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "uid",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "fromPeerId",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timestamp",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "offline",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "hasMore",
                    "id": 6
                },
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "toPeerIds",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "r",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "cid",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "id",
                    "id": 12
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "transient",
                    "id": 13
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "dt",
                    "id": 14
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "roomId",
                    "id": 15
                }
            ]
        },
        {
            "name": "AckCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "code",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "reason",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mid",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "cid",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "t",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "uid",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "fromts",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "tots",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "type",
                    "id": 9
                },
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "ids",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "appCode",
                    "id": 11
                }
            ]
        },
        {
            "name": "UnreadCommand",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "UnreadTuple",
                    "name": "convs",
                    "id": 1
                }
            ]
        },
        {
            "name": "ConvCommand",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "m",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "transient",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "unique",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "cid",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "cdate",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "initBy",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "sort",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "limit",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "skip",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "flag",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "count",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "udate",
                    "id": 12
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "t",
                    "id": 13
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "n",
                    "id": 14
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "s",
                    "id": 15
                },
                {
                    "rule": "optional",
                    "type": "JsonObjectMessage",
                    "name": "results",
                    "id": 100
                },
                {
                    "rule": "optional",
                    "type": "JsonObjectMessage",
                    "name": "where",
                    "id": 101
                },
                {
                    "rule": "optional",
                    "type": "JsonObjectMessage",
                    "name": "attr",
                    "id": 103
                }
            ]
        },
        {
            "name": "RoomCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "roomId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "s",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "t",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "n",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "transient",
                    "id": 5
                },
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "roomPeerIds",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "byPeerId",
                    "id": 7
                }
            ]
        },
        {
            "name": "LogsCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "cid",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "l",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "limit",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "t",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "tt",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "tmid",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mid",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "checksum",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "stored",
                    "id": 9
                },
                {
                    "rule": "repeated",
                    "type": "LogItem",
                    "name": "logs",
                    "id": 105
                }
            ]
        },
        {
            "name": "RcpCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "id",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "cid",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "t",
                    "id": 3
                }
            ]
        },
        {
            "name": "ReadTuple",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "cid",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timestamp",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mid",
                    "id": 3
                }
            ]
        },
        {
            "name": "ReadCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "cid",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "cids",
                    "id": 2
                },
                {
                    "rule": "repeated",
                    "type": "ReadTuple",
                    "name": "convs",
                    "id": 3
                }
            ]
        },
        {
            "name": "PresenceCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "StatusType",
                    "name": "status",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "string",
                    "name": "sessionPeerIds",
                    "id": 2
                }
            ]
        },
        {
            "name": "ReportCommand",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "initiative",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "data",
                    "id": 3
                }
            ]
        },
        {
            "name": "GenericCommand",
            "fields": [
                {
                    "rule": "required",
                    "type": "CommandType",
                    "name": "cmd",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "OpType",
                    "name": "op",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "appId",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "peerId",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "i",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "installationId",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "LoginCommand",
                    "name": "loginMessage",
                    "id": 100
                },
                {
                    "rule": "optional",
                    "type": "DataCommand",
                    "name": "dataMessage",
                    "id": 101
                },
                {
                    "rule": "optional",
                    "type": "SessionCommand",
                    "name": "sessionMessage",
                    "id": 102
                },
                {
                    "rule": "optional",
                    "type": "ErrorCommand",
                    "name": "errorMessage",
                    "id": 103
                },
                {
                    "rule": "optional",
                    "type": "DirectCommand",
                    "name": "directMessage",
                    "id": 104
                },
                {
                    "rule": "optional",
                    "type": "AckCommand",
                    "name": "ackMessage",
                    "id": 105
                },
                {
                    "rule": "optional",
                    "type": "UnreadCommand",
                    "name": "unreadMessage",
                    "id": 106
                },
                {
                    "rule": "optional",
                    "type": "ReadCommand",
                    "name": "readMessage",
                    "id": 107
                },
                {
                    "rule": "optional",
                    "type": "RcpCommand",
                    "name": "rcpMessage",
                    "id": 108
                },
                {
                    "rule": "optional",
                    "type": "LogsCommand",
                    "name": "logsMessage",
                    "id": 109
                },
                {
                    "rule": "optional",
                    "type": "ConvCommand",
                    "name": "convMessage",
                    "id": 110
                },
                {
                    "rule": "optional",
                    "type": "RoomCommand",
                    "name": "roomMessage",
                    "id": 111
                },
                {
                    "rule": "optional",
                    "type": "PresenceCommand",
                    "name": "presenceMessage",
                    "id": 112
                },
                {
                    "rule": "optional",
                    "type": "ReportCommand",
                    "name": "reportMessage",
                    "id": 113
                }
            ]
        }
    ],
    "enums": [
        {
            "name": "CommandType",
            "values": [
                {
                    "name": "session",
                    "id": 0
                },
                {
                    "name": "conv",
                    "id": 1
                },
                {
                    "name": "direct",
                    "id": 2
                },
                {
                    "name": "ack",
                    "id": 3
                },
                {
                    "name": "rcp",
                    "id": 4
                },
                {
                    "name": "unread",
                    "id": 5
                },
                {
                    "name": "logs",
                    "id": 6
                },
                {
                    "name": "error",
                    "id": 7
                },
                {
                    "name": "login",
                    "id": 8
                },
                {
                    "name": "data",
                    "id": 9
                },
                {
                    "name": "room",
                    "id": 10
                },
                {
                    "name": "read",
                    "id": 11
                },
                {
                    "name": "presence",
                    "id": 12
                },
                {
                    "name": "report",
                    "id": 13
                },
                {
                    "name": "echo",
                    "id": 14
                }
            ]
        },
        {
            "name": "OpType",
            "values": [
                {
                    "name": "open",
                    "id": 1
                },
                {
                    "name": "add",
                    "id": 2
                },
                {
                    "name": "remove",
                    "id": 3
                },
                {
                    "name": "close",
                    "id": 4
                },
                {
                    "name": "opened",
                    "id": 5
                },
                {
                    "name": "closed",
                    "id": 6
                },
                {
                    "name": "query",
                    "id": 7
                },
                {
                    "name": "query_result",
                    "id": 8
                },
                {
                    "name": "conflict",
                    "id": 9
                },
                {
                    "name": "added",
                    "id": 10
                },
                {
                    "name": "removed",
                    "id": 11
                },
                {
                    "name": "start",
                    "id": 30
                },
                {
                    "name": "started",
                    "id": 31
                },
                {
                    "name": "joined",
                    "id": 32
                },
                {
                    "name": "members_joined",
                    "id": 33
                },
                {
                    "name": "left",
                    "id": 39
                },
                {
                    "name": "members_left",
                    "id": 40
                },
                {
                    "name": "results",
                    "id": 42
                },
                {
                    "name": "count",
                    "id": 43
                },
                {
                    "name": "result",
                    "id": 44
                },
                {
                    "name": "update",
                    "id": 45
                },
                {
                    "name": "updated",
                    "id": 46
                },
                {
                    "name": "mute",
                    "id": 47
                },
                {
                    "name": "unmute",
                    "id": 48
                },
                {
                    "name": "join",
                    "id": 80
                },
                {
                    "name": "invite",
                    "id": 81
                },
                {
                    "name": "leave",
                    "id": 82
                },
                {
                    "name": "kick",
                    "id": 83
                },
                {
                    "name": "reject",
                    "id": 84
                },
                {
                    "name": "invited",
                    "id": 85
                },
                {
                    "name": "kicked",
                    "id": 86
                },
                {
                    "name": "upload",
                    "id": 100
                },
                {
                    "name": "uploaded",
                    "id": 101
                }
            ]
        },
        {
            "name": "StatusType",
            "values": [
                {
                    "name": "on",
                    "id": 1
                },
                {
                    "name": "off",
                    "id": 2
                }
            ]
        }
    ]
}).build();
