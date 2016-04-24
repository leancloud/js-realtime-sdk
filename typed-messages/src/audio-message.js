import { FileMessage } from './file-message';
import { messageType } from './realtime';
import inherit from 'inherit';

/**
 * 需要安装 [leancloud-realtime-typed-messages]{@link https://www.npmjs.com/package/leancloud-realtime-typed-messages} package
 * 构造方法参数同 {@link FileMessage}
 * @class
 * @extends FileMessage
 */
export const AudioMessage = inherit(FileMessage);

/**
 * @name TYPE
 * @memberof AudioMessage
 * @type Number
 * @static
 * @const
 */
messageType(-3)(AudioMessage);
