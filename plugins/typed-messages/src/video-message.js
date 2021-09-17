export function createVideoMessageClass({ FileMessage, realtime }) {
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
  realtime.messageType(-4)(VideoMessage);
  realtime.IE10Compatible(VideoMessage);

  return VideoMessage;
}
