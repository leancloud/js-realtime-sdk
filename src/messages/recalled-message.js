import TypedMessage from './typed-message';
import { messageType } from './helpers';

// jsdoc-ignore-start
@messageType(-127)
// jsdoc-ignore-end
export default class RecalledMessage extends TypedMessage {}
/**
 * 已撤回类型消息，当消息被撤回时，SDK 会使用该类型的消息替代原始消息
 * @class RecalledMessage
 */
