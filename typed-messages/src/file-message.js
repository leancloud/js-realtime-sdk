import File from './file';
import {
  TypedMessage,
  messageType,
  messageField,
} from './realtime';
import inherit from 'inherit';

export const FileMessage = inherit(TypedMessage, {
  __constructor(file) {
    if (!(file instanceof File)) {
      throw new TypeError('file must be an AV.File');
    }
    if (!file.id) {
      throw new Error('file must be saved before used to create a Message');
    }
    this.__base();
    this._file = file;
    this._lcfile = {
      objId: file.id,
      url: file._url,
      metaData: Object.assign(file._metaData, {
        name: file.name(),
      }),
    };
  },
  getFile() {
    return this._file;
  },
}, {
  _parseFileFromRawData(data) {
    if (!(data && data._lcfile)) {
      throw new Error('malformed FileMessage content');
    }
    const file = File.createWithoutData(data._lcfile.objId);
    file._url = data._lcfile.url;
    file._metaData = data._lcfile.metaData;
    if (data._lcfile.metaData) {
      file._name = data._lcfile.metaData.name;
    }
    return file;
  },
  parse(json, message) {
    const file = this._parseFileFromRawData(json);
    return this.__base(json, message || new this(file));
  },
});

messageType(-6)(FileMessage);
messageField('_lcfile')(FileMessage);
