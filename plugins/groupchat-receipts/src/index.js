/** @module leancloud-realtime-plugin-groupchat-receipts */

import ReadReceipt from './read-receipt';
import { name } from '../package.json';

/**
 * @typedef {Object.<String, Date>} GroupchatLastReadTimestamps 对话成员 ID - 最后已读消息时间
 */

/**
 * 群聊已读状态插件。
 * 使用后多人 Conversation 会增加 lastReadTimestamps 属性，该属性是 对话成员 ID - 最后已读消息时间 的键值对。
 * 在首次查询该会话的消息记录后，lastReadTimestamps 将会得到初始值，
 * 之后在该属性有变化时 Conversation 会派发 lastreadtimestampsupdate 事件。
 * @example
 * var realtime = new Realtime({
 *   appId: appId,
 *   plugins: [GroupchatReceiptsPlugin],
 * });
 */
export const GroupchatReceiptsPlugin = {
  name,
  messageClasses: [ReadReceipt],
  onIMClientCreate: (client) => {
    const originalSendReadCommand = client._sendReadCommand;
    // eslint-disable-next-line no-param-reassign
    client._sendReadCommand = (conversations, ...args) => {
      conversations.forEach((conversation) => {
        if (!conversation.transient && conversation.members.length > 2) {
          conversation.send(
            new ReadReceipt(conversation.lastMessageAt || new Date()),
          ).catch(error => console.warn(`Sending groupchat receipt fail: ${error.message}`));
        }
      });
      return originalSendReadCommand.call(client, conversations, ...args);
    };
  },
  onConversationCreate: (conversation) => {
    const originalQueryMessages = conversation.queryMessages;
    // eslint-disable-next-line no-param-reassign
    conversation.queryMessages = (...args) => {
      if (
        !conversation.transient &&
        conversation.members.length > 2 &&
        !conversation.lastReadTimestamps
      ) {
        conversation._fetchAllReceiptTimestamps().then((maxReadTuple) => {
          // eslint-disable-next-line no-param-reassign
          conversation.lastReadTimestamps = maxReadTuple.reduce(
            (result, { pid, lastReadAt }) => Object.assign(result, { [pid]: lastReadAt }),
            {},
          );
          conversation.emit('lastreadtimestampsupdate', conversation.lastReadTimestamps);
        }).catch(error => console.warn(`Initialize group receipts fail: ${error.message}`));
      }
      return originalQueryMessages.call(conversation, ...args);
    };
  },
  beforeMessageDispatch: (message, conversation) => {
    if (message.type === ReadReceipt.TYPE) {
      if (conversation.lastReadTimestamps) {
        // eslint-disable-next-line no-param-reassign
        conversation.lastReadTimestamps[message.from] = message.timestamp;
        /**
         * 群聊的已读状态更新，由 Conversation 派发
         * @event lastreadtimestampsupdate
         * @param {GroupchatLastReadTimestamps} updatedTimestamps 有更新的成员的最后已读消息时间
         */
        conversation.emit('lastreadtimestampsupdate', {
          [message.from]: message.timestamp,
        });
      }
      return false;
    }
    return true;
  },
};

export {
  ReadReceipt,
};
