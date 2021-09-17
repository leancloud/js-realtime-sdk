export default function createImageMessageClass({ FileMessage, realtime }) {
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
  realtime.messageType(-2)(ImageMessage);
  realtime.IE10Compatible(ImageMessage);

  return ImageMessage;
}
