import FileMessage from './file-message';
import { messageType, IE10Compatible } from './realtime';

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
IE10Compatible(AudioMessage);

export default AudioMessage;
