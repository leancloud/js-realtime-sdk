import { GeoPoint } from './storage';
import {
  TypedMessage,
  messageType,
  messageField,
} from './realtime';

export default class LocationMessage extends TypedMessage {
  /**
   * @extends TypedMessage
   * @param  {AV.GeoPoint} geoPoint LeanCloud 存储 SDK 中的 AV.GeoPoint 实例
   */
  constructor(geoPoint) {
    if (!(geoPoint instanceof GeoPoint)) {
      throw new TypeError('geoPoint must be an AV.GeoPoint');
    }
    super();
    this._geoPoint = geoPoint;
    const { latitude, longitude } = geoPoint;
    this._lcloc = { latitude, longitude };
  }

  /**
   * 在客户端需要以文本形式展示该消息时显示的文案，格式为 <code>[位置] message.text</code>
   * @type {String}
   * @readonly
   */
  get summary() {
    return `[位置] ${this.text || ''}`.trim();
  }

  /**
   * 获得 geoPoint 对象
   * @return {AV.GeoPoint}
   */
  getLocation() {
    return this._geoPoint;
  }

  static parse(json, message) {
    const { latitude, longitude } = json._lcloc;
    const geoPoint = new GeoPoint({ latitude, longitude });
    return TypedMessage.parse(json, message || new this(geoPoint));
  }
}

/**
 * @name TYPE
 * @memberof LocationMessage
 * @type Number
 * @static
 * @const
 */
messageType(-5)(LocationMessage);
messageField('_lcloc')(LocationMessage);
