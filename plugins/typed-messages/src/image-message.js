import FileMessage from './file-message';
import { messageType } from './realtime';


/**
 * 构造方法参数同 {@link FileMessage}
 *
 * @extends FileMessage
 */
class ImageMessage extends FileMessage {}
ImageMessage._summaryType = '图片';

/**
 * @name TYPE
 * @memberof ImageMessage
 * @type Number
 * @static
 * @const
 */
messageType(-2)(ImageMessage);

export default ImageMessage;
