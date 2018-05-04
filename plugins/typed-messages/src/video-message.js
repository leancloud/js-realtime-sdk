import FileMessage from './file-message';
import { messageType, IE10Compatible } from './realtime';

/**
 * 构造方法参数同 {@link FileMessage}
 *
 * @extends FileMessage
 */
class VideoMessage extends FileMessage {}
VideoMessage._summaryType = '视频';

/**
 * @name TYPE
 * @memberof VideoMessage
 * @type Number
 * @static
 * @const
 */
messageType(-4)(VideoMessage);
IE10Compatible(VideoMessage);

export default VideoMessage;
