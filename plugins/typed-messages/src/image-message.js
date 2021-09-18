export default function createImageMessageClass({ FileMessage, IM }) {
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
  IM.messageType(-2)(ImageMessage);
  IM.IE10Compatible(ImageMessage);

  return ImageMessage;
}
