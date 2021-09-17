export function createAudioMessageClass({ FileMessage, realtime }) {
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
  realtime.messageType(-3)(AudioMessage);
  realtime.IE10Compatible(AudioMessage);

  return AudioMessage;
}
