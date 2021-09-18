export default function createVideoMessageClass({ FileMessage, IM }) {
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
  IM.messageType(-4)(VideoMessage);
  IM.IE10Compatible(VideoMessage);

  return VideoMessage;
}
