import inherit from 'inherit';
import { messageType, messageField, TypedMessage } from './realtime';

const ReadReceipt = inherit(TypedMessage, {
  __constructor(timestamp) {
    this.__base();
    this.timestamp = new Date(timestamp);
  },
});
messageType(-101)(ReadReceipt);
messageField(['timestamp'])(ReadReceipt);
ReadReceipt.sendOptions = {
  transient: true,
};

export default ReadReceipt;
