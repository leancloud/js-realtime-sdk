import inherit from 'inherit';
import FileMessage from './file-message';
import { messageType } from './realtime';

/**
 * 构造方法参数同 {@link FileMessage}
 * @class
 * @extends FileMessage
 */
const ImageMessage = inherit(FileMessage);

/**
 * @name TYPE
 * @memberof ImageMessage
 * @type Number
 * @static
 * @const
 */
messageType(-2)(ImageMessage);

export { ImageMessage as default };
