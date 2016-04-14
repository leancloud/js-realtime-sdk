import { FileMessage } from './file-message';
import { messageType } from './realtime';
import inherit from 'inherit';

/**
 * 构造方法参数同 {@link FileMessage}
 * @class
 * @extends FileMessage
 */
export const VideoMessage = inherit(FileMessage);

messageType(-4)(VideoMessage);
