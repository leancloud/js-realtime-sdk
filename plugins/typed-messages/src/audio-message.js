import FileMessage from './file-message';
import { messageType } from './realtime';

/**
 * 构造方法参数同 {@link FileMessage}
 *
 * @extends FileMessage
 */
class AudioMessage extends FileMessage {}
AudioMessage._summaryType = '语音';

/**
 * @name TYPE
 * @memberof AudioMessage
 * @type Number
 * @static
 * @const
 */
messageType(-3)(AudioMessage);

export default AudioMessage;
