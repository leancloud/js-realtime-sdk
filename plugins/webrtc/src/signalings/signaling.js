import inherit from 'inherit';
import { TypedMessage, messageField } from '../realtime';

// use dynamic class inherit helper instead of ES class syntex
// to prevent TypedMessage from being included in the bundler
const Signaling = inherit(TypedMessage, {
  __constructor(payload) {
    this.__base();
    this.payload = payload;
    this.setTransient(true);
  },
});

messageField('payload')(Signaling);

export { Signaling as default };
