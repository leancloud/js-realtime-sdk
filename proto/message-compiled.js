module.exports = require('protobufjs/dist/protobuf-light')
  .newBuilder({})
  ['import']({
    package: 'push_server.messages2',
    syntax: 'proto2',
    options: {
      objc_class_prefix: 'AVIM',
    },
    messages: [
      {
        name: 'JsonObjectMessage',
        syntax: 'proto2',
        fields: [
          {
            rule: 'required',
            type: 'string',
            name: 'data',
            id: 1,
          },
        ],
      },
      {
        name: 'UnreadTuple',
        syntax: 'proto2',
        fields: [
          {
            rule: 'required',
            type: 'string',
            name: 'cid',
            id: 1,
          },
          {
            rule: 'required',
            type: 'int32',
            name: 'unread',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'mid',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'timestamp',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'from',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'data',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'patchTimestamp',
            id: 7,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'mentioned',
            id: 8,
          },
          {
            rule: 'optional',
            type: 'bytes',
            name: 'binaryMsg',
            id: 9,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'convType',
            id: 10,
          },
        ],
      },
      {
        name: 'LogItem',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'from',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'data',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'timestamp',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'msgId',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'ackAt',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'readAt',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'patchTimestamp',
            id: 7,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'mentionAll',
            id: 8,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'mentionPids',
            id: 9,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'bin',
            id: 10,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'convType',
            id: 11,
          },
        ],
      },
      {
        name: 'ConvMemberInfo',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'pid',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'role',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'infoId',
            id: 3,
          },
        ],
      },
      {
        name: 'DataCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'repeated',
            type: 'string',
            name: 'ids',
            id: 1,
          },
          {
            rule: 'repeated',
            type: 'JsonObjectMessage',
            name: 'msg',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'offline',
            id: 3,
          },
        ],
      },
      {
        name: 'SessionCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'int64',
            name: 't',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'n',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 's',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'ua',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'r',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'tag',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'deviceId',
            id: 7,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'sessionPeerIds',
            id: 8,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'onlineSessionPeerIds',
            id: 9,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'st',
            id: 10,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'stTtl',
            id: 11,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'code',
            id: 12,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'reason',
            id: 13,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'deviceToken',
            id: 14,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'sp',
            id: 15,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'detail',
            id: 16,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'lastUnreadNotifTime',
            id: 17,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'lastPatchTime',
            id: 18,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'configBitmap',
            id: 19,
          },
        ],
      },
      {
        name: 'ErrorCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'required',
            type: 'int32',
            name: 'code',
            id: 1,
          },
          {
            rule: 'required',
            type: 'string',
            name: 'reason',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'appCode',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'detail',
            id: 4,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'pids',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'appMsg',
            id: 6,
          },
        ],
      },
      {
        name: 'DirectCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'msg',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'uid',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'fromPeerId',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'timestamp',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'offline',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'hasMore',
            id: 6,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'toPeerIds',
            id: 7,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'r',
            id: 10,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 11,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'id',
            id: 12,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'transient',
            id: 13,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'dt',
            id: 14,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'roomId',
            id: 15,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'pushData',
            id: 16,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'will',
            id: 17,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'patchTimestamp',
            id: 18,
          },
          {
            rule: 'optional',
            type: 'bytes',
            name: 'binaryMsg',
            id: 19,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'mentionPids',
            id: 20,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'mentionAll',
            id: 21,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'convType',
            id: 22,
          },
        ],
      },
      {
        name: 'AckCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'int32',
            name: 'code',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'reason',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'mid',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 't',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'uid',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'fromts',
            id: 7,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'tots',
            id: 8,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'type',
            id: 9,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'ids',
            id: 10,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'appCode',
            id: 11,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'appMsg',
            id: 12,
          },
        ],
      },
      {
        name: 'UnreadCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'repeated',
            type: 'UnreadTuple',
            name: 'convs',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'notifTime',
            id: 2,
          },
        ],
      },
      {
        name: 'ConvCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'repeated',
            type: 'string',
            name: 'm',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'transient',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'unique',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'cdate',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'initBy',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'sort',
            id: 7,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'limit',
            id: 8,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'skip',
            id: 9,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'flag',
            id: 10,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'count',
            id: 11,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'udate',
            id: 12,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 't',
            id: 13,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'n',
            id: 14,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 's',
            id: 15,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'statusSub',
            id: 16,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'statusPub',
            id: 17,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'statusTTL',
            id: 18,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'uniqueId',
            id: 19,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'targetClientId',
            id: 20,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'maxReadTimestamp',
            id: 21,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'maxAckTimestamp',
            id: 22,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'queryAllMembers',
            id: 23,
          },
          {
            rule: 'repeated',
            type: 'MaxReadTuple',
            name: 'maxReadTuples',
            id: 24,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'cids',
            id: 25,
          },
          {
            rule: 'optional',
            type: 'ConvMemberInfo',
            name: 'info',
            id: 26,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'tempConv',
            id: 27,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'tempConvTTL',
            id: 28,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'tempConvIds',
            id: 29,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'allowedPids',
            id: 30,
          },
          {
            rule: 'repeated',
            type: 'ErrorCommand',
            name: 'failedPids',
            id: 31,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'next',
            id: 40,
          },
          {
            rule: 'optional',
            type: 'JsonObjectMessage',
            name: 'results',
            id: 100,
          },
          {
            rule: 'optional',
            type: 'JsonObjectMessage',
            name: 'where',
            id: 101,
          },
          {
            rule: 'optional',
            type: 'JsonObjectMessage',
            name: 'attr',
            id: 103,
          },
          {
            rule: 'optional',
            type: 'JsonObjectMessage',
            name: 'attrModified',
            id: 104,
          },
        ],
      },
      {
        name: 'RoomCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'roomId',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 's',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 't',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'n',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'transient',
            id: 5,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'roomPeerIds',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'byPeerId',
            id: 7,
          },
        ],
      },
      {
        name: 'LogsCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'l',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'limit',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 't',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'tt',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'tmid',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'mid',
            id: 7,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'checksum',
            id: 8,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'stored',
            id: 9,
          },
          {
            rule: 'optional',
            type: 'QueryDirection',
            name: 'direction',
            id: 10,
            options: {
              default: 'OLD',
            },
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'tIncluded',
            id: 11,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'ttIncluded',
            id: 12,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'lctype',
            id: 13,
          },
          {
            rule: 'repeated',
            type: 'LogItem',
            name: 'logs',
            id: 105,
          },
        ],
        enums: [
          {
            name: 'QueryDirection',
            syntax: 'proto2',
            values: [
              {
                name: 'OLD',
                id: 1,
              },
              {
                name: 'NEW',
                id: 2,
              },
            ],
          },
        ],
      },
      {
        name: 'RcpCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'id',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 't',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'read',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'from',
            id: 5,
          },
        ],
      },
      {
        name: 'ReadTuple',
        syntax: 'proto2',
        fields: [
          {
            rule: 'required',
            type: 'string',
            name: 'cid',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'timestamp',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'mid',
            id: 3,
          },
        ],
      },
      {
        name: 'MaxReadTuple',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'pid',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'maxAckTimestamp',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'maxReadTimestamp',
            id: 3,
          },
        ],
      },
      {
        name: 'ReadCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 1,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'cids',
            id: 2,
          },
          {
            rule: 'repeated',
            type: 'ReadTuple',
            name: 'convs',
            id: 3,
          },
        ],
      },
      {
        name: 'PresenceCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'StatusType',
            name: 'status',
            id: 1,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'sessionPeerIds',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 3,
          },
        ],
      },
      {
        name: 'ReportCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'bool',
            name: 'initiative',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'type',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'data',
            id: 3,
          },
        ],
      },
      {
        name: 'PatchItem',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'mid',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'timestamp',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'recall',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'data',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'patchTimestamp',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'from',
            id: 7,
          },
          {
            rule: 'optional',
            type: 'bytes',
            name: 'binaryMsg',
            id: 8,
          },
          {
            rule: 'optional',
            type: 'bool',
            name: 'mentionAll',
            id: 9,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'mentionPids',
            id: 10,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'patchCode',
            id: 11,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'patchReason',
            id: 12,
          },
        ],
      },
      {
        name: 'PatchCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'repeated',
            type: 'PatchItem',
            name: 'patches',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'lastPatchTime',
            id: 2,
          },
        ],
      },
      {
        name: 'PubsubCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'cid',
            id: 1,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'cids',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'topic',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'subtopic',
            id: 4,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'topics',
            id: 5,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'subtopics',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'JsonObjectMessage',
            name: 'results',
            id: 7,
          },
        ],
      },
      {
        name: 'BlacklistCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'string',
            name: 'srcCid',
            id: 1,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'toPids',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'srcPid',
            id: 3,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'toCids',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'limit',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'next',
            id: 6,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'blockedPids',
            id: 8,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'blockedCids',
            id: 9,
          },
          {
            rule: 'repeated',
            type: 'string',
            name: 'allowedPids',
            id: 10,
          },
          {
            rule: 'repeated',
            type: 'ErrorCommand',
            name: 'failedPids',
            id: 11,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 't',
            id: 12,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'n',
            id: 13,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 's',
            id: 14,
          },
        ],
      },
      {
        name: 'GenericCommand',
        syntax: 'proto2',
        fields: [
          {
            rule: 'optional',
            type: 'CommandType',
            name: 'cmd',
            id: 1,
          },
          {
            rule: 'optional',
            type: 'OpType',
            name: 'op',
            id: 2,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'appId',
            id: 3,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'peerId',
            id: 4,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'i',
            id: 5,
          },
          {
            rule: 'optional',
            type: 'string',
            name: 'installationId',
            id: 6,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'priority',
            id: 7,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'service',
            id: 8,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'serverTs',
            id: 9,
          },
          {
            rule: 'optional',
            type: 'int64',
            name: 'clientTs',
            id: 10,
          },
          {
            rule: 'optional',
            type: 'int32',
            name: 'notificationType',
            id: 11,
          },
          {
            rule: 'optional',
            type: 'DataCommand',
            name: 'dataMessage',
            id: 101,
          },
          {
            rule: 'optional',
            type: 'SessionCommand',
            name: 'sessionMessage',
            id: 102,
          },
          {
            rule: 'optional',
            type: 'ErrorCommand',
            name: 'errorMessage',
            id: 103,
          },
          {
            rule: 'optional',
            type: 'DirectCommand',
            name: 'directMessage',
            id: 104,
          },
          {
            rule: 'optional',
            type: 'AckCommand',
            name: 'ackMessage',
            id: 105,
          },
          {
            rule: 'optional',
            type: 'UnreadCommand',
            name: 'unreadMessage',
            id: 106,
          },
          {
            rule: 'optional',
            type: 'ReadCommand',
            name: 'readMessage',
            id: 107,
          },
          {
            rule: 'optional',
            type: 'RcpCommand',
            name: 'rcpMessage',
            id: 108,
          },
          {
            rule: 'optional',
            type: 'LogsCommand',
            name: 'logsMessage',
            id: 109,
          },
          {
            rule: 'optional',
            type: 'ConvCommand',
            name: 'convMessage',
            id: 110,
          },
          {
            rule: 'optional',
            type: 'RoomCommand',
            name: 'roomMessage',
            id: 111,
          },
          {
            rule: 'optional',
            type: 'PresenceCommand',
            name: 'presenceMessage',
            id: 112,
          },
          {
            rule: 'optional',
            type: 'ReportCommand',
            name: 'reportMessage',
            id: 113,
          },
          {
            rule: 'optional',
            type: 'PatchCommand',
            name: 'patchMessage',
            id: 114,
          },
          {
            rule: 'optional',
            type: 'PubsubCommand',
            name: 'pubsubMessage',
            id: 115,
          },
          {
            rule: 'optional',
            type: 'BlacklistCommand',
            name: 'blacklistMessage',
            id: 116,
          },
        ],
      },
    ],
    enums: [
      {
        name: 'CommandType',
        syntax: 'proto2',
        values: [
          {
            name: 'session',
            id: 0,
          },
          {
            name: 'conv',
            id: 1,
          },
          {
            name: 'direct',
            id: 2,
          },
          {
            name: 'ack',
            id: 3,
          },
          {
            name: 'rcp',
            id: 4,
          },
          {
            name: 'unread',
            id: 5,
          },
          {
            name: 'logs',
            id: 6,
          },
          {
            name: 'error',
            id: 7,
          },
          {
            name: 'login',
            id: 8,
          },
          {
            name: 'data',
            id: 9,
          },
          {
            name: 'room',
            id: 10,
          },
          {
            name: 'read',
            id: 11,
          },
          {
            name: 'presence',
            id: 12,
          },
          {
            name: 'report',
            id: 13,
          },
          {
            name: 'echo',
            id: 14,
          },
          {
            name: 'loggedin',
            id: 15,
          },
          {
            name: 'logout',
            id: 16,
          },
          {
            name: 'loggedout',
            id: 17,
          },
          {
            name: 'patch',
            id: 18,
          },
          {
            name: 'pubsub',
            id: 19,
          },
          {
            name: 'blacklist',
            id: 20,
          },
          {
            name: 'goaway',
            id: 21,
          },
        ],
      },
      {
        name: 'OpType',
        syntax: 'proto2',
        values: [
          {
            name: 'open',
            id: 1,
          },
          {
            name: 'add',
            id: 2,
          },
          {
            name: 'remove',
            id: 3,
          },
          {
            name: 'close',
            id: 4,
          },
          {
            name: 'opened',
            id: 5,
          },
          {
            name: 'closed',
            id: 6,
          },
          {
            name: 'query',
            id: 7,
          },
          {
            name: 'query_result',
            id: 8,
          },
          {
            name: 'conflict',
            id: 9,
          },
          {
            name: 'added',
            id: 10,
          },
          {
            name: 'removed',
            id: 11,
          },
          {
            name: 'refresh',
            id: 12,
          },
          {
            name: 'refreshed',
            id: 13,
          },
          {
            name: 'start',
            id: 30,
          },
          {
            name: 'started',
            id: 31,
          },
          {
            name: 'joined',
            id: 32,
          },
          {
            name: 'members_joined',
            id: 33,
          },
          {
            name: 'left',
            id: 39,
          },
          {
            name: 'members_left',
            id: 40,
          },
          {
            name: 'results',
            id: 42,
          },
          {
            name: 'count',
            id: 43,
          },
          {
            name: 'result',
            id: 44,
          },
          {
            name: 'update',
            id: 45,
          },
          {
            name: 'updated',
            id: 46,
          },
          {
            name: 'mute',
            id: 47,
          },
          {
            name: 'unmute',
            id: 48,
          },
          {
            name: 'status',
            id: 49,
          },
          {
            name: 'members',
            id: 50,
          },
          {
            name: 'max_read',
            id: 51,
          },
          {
            name: 'is_member',
            id: 52,
          },
          {
            name: 'member_info_update',
            id: 53,
          },
          {
            name: 'member_info_updated',
            id: 54,
          },
          {
            name: 'member_info_changed',
            id: 55,
          },
          {
            name: 'join',
            id: 80,
          },
          {
            name: 'invite',
            id: 81,
          },
          {
            name: 'leave',
            id: 82,
          },
          {
            name: 'kick',
            id: 83,
          },
          {
            name: 'reject',
            id: 84,
          },
          {
            name: 'invited',
            id: 85,
          },
          {
            name: 'kicked',
            id: 86,
          },
          {
            name: 'upload',
            id: 100,
          },
          {
            name: 'uploaded',
            id: 101,
          },
          {
            name: 'subscribe',
            id: 120,
          },
          {
            name: 'subscribed',
            id: 121,
          },
          {
            name: 'unsubscribe',
            id: 122,
          },
          {
            name: 'unsubscribed',
            id: 123,
          },
          {
            name: 'is_subscribed',
            id: 124,
          },
          {
            name: 'modify',
            id: 150,
          },
          {
            name: 'modified',
            id: 151,
          },
          {
            name: 'block',
            id: 170,
          },
          {
            name: 'unblock',
            id: 171,
          },
          {
            name: 'blocked',
            id: 172,
          },
          {
            name: 'unblocked',
            id: 173,
          },
          {
            name: 'members_blocked',
            id: 174,
          },
          {
            name: 'members_unblocked',
            id: 175,
          },
          {
            name: 'check_block',
            id: 176,
          },
          {
            name: 'check_result',
            id: 177,
          },
          {
            name: 'add_shutup',
            id: 180,
          },
          {
            name: 'remove_shutup',
            id: 181,
          },
          {
            name: 'query_shutup',
            id: 182,
          },
          {
            name: 'shutup_added',
            id: 183,
          },
          {
            name: 'shutup_removed',
            id: 184,
          },
          {
            name: 'shutup_result',
            id: 185,
          },
          {
            name: 'shutuped',
            id: 186,
          },
          {
            name: 'unshutuped',
            id: 187,
          },
          {
            name: 'members_shutuped',
            id: 188,
          },
          {
            name: 'members_unshutuped',
            id: 189,
          },
          {
            name: 'check_shutup',
            id: 190,
          },
        ],
      },
      {
        name: 'StatusType',
        syntax: 'proto2',
        values: [
          {
            name: 'on',
            id: 1,
          },
          {
            name: 'off',
            id: 2,
          },
        ],
      },
    ],
    isNamespace: true,
  })
  .build();
