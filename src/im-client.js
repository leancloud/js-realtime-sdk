import Client from './client';
import Conversation from './conversation';
import ConversationQuery from './conversation-query';
import {
  GenericCommand,
  SessionCommand,
  ConvCommand,
  JsonObjectMessage,
  CommandType,
  OpType,
} from '../proto/message';
import { Promise } from 'rsvp';
import { tap, Cache, keyRemap, union, difference, trim } from './utils';
import { default as d } from 'debug';
import { version as VERSION } from '../package.json';

const debug = d('LC:IMClient');

export default class IMClient extends Client {
  constructor(...args) {
    super(...args);
    if (!this._messageParser) {
      throw new Error('IMClient must be initialized with a MessageParser');
    }
    this._conversationCache = new Cache(`client:${this.id}`);
    [
      'invited',
      'kicked',
      'membersjoined',
      'membersleft',
      'message',
      'unhandledmessage',
    ].forEach(event => this.on(
      event,
      payload => this._debug(`${event} event emitted.`, payload)
    ));
  }

  _debug(...params) {
    debug(...params, `[${this.id}]`);
  }

  _dispatchMessage(message) {
    this._debug(trim(message), 'received');
    if (message.cmd === CommandType.conv) {
      return this._dispatchConvMessage(message);
    }
    if (message.cmd === CommandType.direct) {
      return this._dispatchDirectMessage(message);
    }
    this.emit('unhandledmessage', message);
    return Promise.resolve();
  }

  _dispatchConvMessage(message) {
    const {
      convMessage,
      convMessage: {
        initBy, m,
      },
    } = message;
    switch (message.op) {
      case OpType.joined: {
        return this.getConversation(convMessage.cid).then(
          conversation => this.emit('invited', {
            conversation,
            invitedBy: initBy,
          })
        );
      }
      case OpType.left: {
        return this.getConversation(convMessage.cid).then(conversation => {
          // eslint-disable-next-line no-param-reassign
          conversation.members = difference(conversation.members, [this.id]);
          const payload = {
            kickedBy: initBy,
          };
          this.emit('kicked', Object.assign({
            conversation,
          }, payload));
          conversation.emit('kicked', payload);
        });
      }
      case OpType.members_joined: {
        return this.getConversation(convMessage.cid).then(conversation => {
          // eslint-disable-next-line no-param-reassign
          conversation.members = union(conversation.members, convMessage.m);
          const payload = {
            invitedBy: initBy,
            members: m,
          };
          this.emit('membersjoined', Object.assign({
            conversation,
          }, payload));
          conversation.emit('membersjoined', payload);
        });
      }
      case OpType.members_left: {
        return this.getConversation(convMessage.cid).then(conversation => {
          // eslint-disable-next-line no-param-reassign
          conversation.members = difference(conversation.members, convMessage.m);
          const payload = {
            kickedBy: initBy,
            members: m,
          };
          this.emit('membersleft', Object.assign({
            conversation,
          }, payload));
          conversation.emit('membersleft', payload);
        });
      }
      default:
        this.emit('unhandledmessage', message);
        return Promise.reject(new Error('Unrecognized conversation command'));
    }
  }

  _dispatchDirectMessage(originalMessage) {
    const {
      directMessage,
      directMessage: {
        id, cid, fromPeerId, timestamp, transient,
      },
    } = originalMessage;
    return this.getConversation(directMessage.cid).then(conversation => {
      let msg;
      try {
        msg = JSON.parse(directMessage.msg);
      } catch (error) {
        msg = directMessage.msg;
      }
      const messageProps = {
        id,
        cid,
        timestamp: timestamp.toNumber(),
        from: fromPeerId,
        transient,
      };
      const message = this._messageParser.parse(msg);
      message._setProps(messageProps);
      this.emit('message', {
        conversation,
        message,
      });
      conversation.emit('message', message);
    });
  }

  _send(cmd) {
    const command = cmd;
    if (this.id) {
      command.peerId = this.id;
    }
    return this._connection.send(command);
  }

  _open(appId, isReconnect = false) {
    this._debug('open session');
    return Promise
      .resolve(new GenericCommand({
        cmd: 'session',
        op: 'open',
        appId,
        sessionMessage: new SessionCommand({
          ua: `js/${VERSION}`,
          r: isReconnect,
        }),
      }))
      .then(cmd => {
        const command = cmd;
        if (this.options.signatureFactory) {
          this._debug(`call signatureFactory with [${this.id}]`);
          return Promise
            .resolve()
            .then(() => this.options.signatureFactory(this.id))
            .then(tap(signatureResult => this._debug('signatureResult', signatureResult)))
            .then((signatureResult = {}) => {
              const {
                signature,
                timestamp,
                nonce,
              } = signatureResult;
              if (typeof signature !== 'string'
                  || typeof timestamp !== 'number'
                  || typeof nonce !== 'string') {
                throw new Error('malformed signature');
              }
              Object.assign(command.sessionMessage, {
                s: signature,
                t: timestamp,
                n: nonce,
              });
              return command;
            }, error => {
              this._debug(error);
              throw new Error(`signatureFactory error: ${error.message}`);
            });
        }
        return command;
      })
      .then(this._send.bind(this))
      .then(resCommand => {
        const peerId = resCommand.peerId;
        if (!peerId) {
          console.warn('Unexpected session opened without peerId.');
          return;
        }
        this.id = peerId;
      });
  }

  close() {
    this._debug('close session');
    const command = new GenericCommand({
      cmd: 'session',
      op: 'close',
    });
    return this._send(command).then(
      () => {
        this.emit('close', {
          code: 0,
        });
      }
    );
  }

  ping(ids) {
    this._debug('ping');
    if (!(ids instanceof Array)) {
      throw new TypeError(`ids ${ids} is not an Array`);
    }
    const command = new GenericCommand({
      cmd: 'session',
      op: 'query',
      sessionMessage: new SessionCommand({
        sessionPeerIds: ids,
      }),
    });
    return this._send(command)
      .then(resCommand => resCommand.sessionMessage.onlineSessionPeerIds);
  }

  getConversation(id) {
    if (typeof id !== 'string') {
      throw new TypeError(`${id} is not a String`);
    }
    const cachedConversation = this._conversationCache.get(id);
    if (cachedConversation) {
      return Promise.resolve(cachedConversation);
    }
    return this
      .getQuery()
      .equalTo('objectId', id)
      .find()
      .then(conversations => conversations[0] || null);
  }

  getQuery() {
    return new ConversationQuery(this);
  }

  _executeQuery(query) {
    const queryJSON = query.toJSON();
    queryJSON.where = new JsonObjectMessage({
      data: JSON.stringify(queryJSON.where),
    });
    const command = new GenericCommand({
      cmd: 'conv',
      op: 'query',
      convMessage: new ConvCommand(queryJSON),
    });
    return this
      ._send(command)
      .then(resCommand => {
        try {
          return JSON.parse(resCommand.convMessage.results.data);
        } catch (error) {
          const commandString = JSON.stringify(trim(resCommand));
          throw new Error(`Parse query result failed: ${error.message}. Command: ${commandString}`);
        }
      })
      .then(conversations => conversations.map(this._parseConversationFromRawData.bind(this)))
      .then(conversations => conversations.map(fetchedConversation => {
        let conversation = this._conversationCache.get(fetchedConversation.id);
        if (!conversation) {
          conversation = fetchedConversation;
          this._debug('no match, set cache');
          this._conversationCache.set(fetchedConversation.id, fetchedConversation);
        } else {
          this._debug('update cached conversation');
          [
            'name',
            'creator',
            'createdAt',
            'updatedAt',
            'lastMessageAt',
            'lastMessage',
            'mutedMembers',
            'members',
            '_attributes',
            'isTransient',
            'muted',
          ].forEach(key => {
            const value = fetchedConversation[key];
            if (value !== null) conversation[key] = value;
          });
          delete conversation._pendingAttributes;
          delete conversation._pendingName;
        }
        return conversation;
      }));
  }

  _parseConversationFromRawData(rawData) {
    const data = keyRemap({
      objectId: 'id',
      lm: 'lastMessageAt',
      msg: 'lastMessage',
      m: 'members',
      attr: 'attributes',
      tr: 'isTransient',
      c: 'creator',
      mu: 'mutedMembers',
    }, rawData);
    return new Conversation(data, this);
  }

  createConversation(options = {}) {
    let attr = {};
    const {
      name,
      attributes,
      members,
      isTransient,
      isUnique,
    } = options;
    if (!Array.isArray(members)) {
      throw new TypeError(`conversation members ${members} is not an array`);
    }
    if (name) {
      if (typeof name !== 'string') {
        throw new TypeError(`conversation name ${name} is not a string`);
      }
      attr.name = name;
    }
    if (attributes) {
      attr.attr = attributes;
    }
    attr = new JsonObjectMessage({
      data: JSON.stringify(attr),
    });

    const startCommandJson = {
      m: members,
      attr,
      transient: isTransient,
      unique: isUnique,
    };

    const command = new GenericCommand({
      cmd: 'conv',
      op: 'start',
      convMessage: new ConvCommand(startCommandJson),
    });

    return this
      ._send(command)
      .then(resCommand => new Conversation(Object.assign({}, options, {
        id: resCommand.convMessage.cid,
        createdAt: resCommand.convMessage.cdate,
        updatedAt: resCommand.convMessage.cdate,
        lastMessageAt: null,
        creator: this.id,
        members: members.concat([this.id]),
      }), this))
      .then(tap(conversation =>
        this._conversationCache.set(conversation.id, conversation)
      ));
  }
}
