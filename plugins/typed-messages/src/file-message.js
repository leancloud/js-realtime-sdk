import { File } from './storage';
import {
  TypedMessage,
  messageType,
  messageField,
} from './realtime';

export default class FileMessage extends TypedMessage {
  /**
   * @extends TypedMessage
   * @param  {AV.File} file LeanCloud 存储 SDK 中的 AV.File 实例，且必须是已经保存到服务端上的 File 实例
   * （如果是刚刚创建的，必须 save 后才能用于创建 FileMessage）
   */
  constructor(file) {
    if (!(file instanceof File)) {
      throw new TypeError('file must be an AV.File');
    }
    if (typeof file.id !== 'string') {
      throw new Error('file must be saved before used to create a Message');
    }
    super();
    this._file = file;
    this._lcfile = {
      objId: file.id,
      url: file.url(),
      metaData: Object.assign(file.metaData() || {}, {
        name: file.name(),
      }),
    };
  }

  /**
   * 在客户端需要以文本形式展示该消息时显示的文案，格式为 <code>[类型] file.name()</code>
   * @type {String}
   * @readonly
   */
  get summary() {
    return `[${this.constructor._summaryType}] ${this._file.name() || ''}`.trim();
  }

  /**
   * 获得 file 对象
   * @return {AV.File}
   */
  getFile() {
    return this._file;
  }

  static _parseFileFromRawData(data) {
    if (!(data && data._lcfile)) {
      throw new Error('malformed FileMessage content');
    }
    let id = data._lcfile.objId;
    if (typeof id !== 'string') {
      id = '';
    }
    const file = File.createWithoutData(id);
    file.attributes = file.attributes || {};
    file._url = file.attributes.url = data._lcfile.url;
    file._metaData = file.attributes.metaData = data._lcfile.metaData || {};
    if (data._lcfile.metaData) {
      file._name = file.attributes.name = data._lcfile.metaData.name;
    }
    return file;
  }

  static parse(json, message) {
    const file = this._parseFileFromRawData(json);
    return TypedMessage.parse(json, message || new this(file));
  }
}

FileMessage._summaryType = '文件';

/**
 * @name TYPE
 * @memberof FileMessage
 * @type Number
 * @static
 * @const
 */
messageType(-6)(FileMessage);
messageField('_lcfile')(FileMessage);
