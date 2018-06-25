import { encode as encodeBase64 } from 'base64-arraybuffer';
import Message from './message';
import { IE10Compatible } from './helpers';
// jsdoc-ignore-start
@IE10Compatible
// jsdoc-ignore-end
export default class BinaryMessage extends Message {
  /**
   * 二进制消息
   * @extends Message
   * @param {ArrayBuffer} buffer
   * @since 4.0.0
   */
  constructor(buffer) {
    if (!(buffer instanceof ArrayBuffer)) {
      throw new TypeError(`${buffer} is not an ArrayBuffer`);
    }
    super(buffer);
  }

  /**
   * @type ArrayBuffer
   */
  get buffer() {
    return this.content;
  }

  set buffer(buffer) {
    this.content = buffer;
  }

  static validate(target) {
    return target instanceof ArrayBuffer;
  }

  toJSON() {
    return {
      ...super._toJSON(),
      data: encodeBase64(this.content),
    };
  }

  toFullJSON() {
    return {
      ...super.toFullJSON(),
      bin: true,
      data: encodeBase64(this.content),
    };
  }
}
