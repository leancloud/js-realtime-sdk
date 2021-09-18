export default function createAudioMessageClass({ FileMessage, IM }) {
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
  IM.messageType(-3)(AudioMessage);
  IM.IE10Compatible(AudioMessage);

  return AudioMessage;
}
