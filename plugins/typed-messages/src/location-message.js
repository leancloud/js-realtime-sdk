import inherit from 'inherit';
import { GeoPoint } from './storage';
import {
  TypedMessage,
  messageType,
  messageField,
} from './realtime';

const LocationMessage = inherit(TypedMessage, /** @lends LocationMessage.prototype */ {
  /**
   * @constructs
   * @extends TypedMessage
   * @param  {AV.GeoPoint} geoPoint LeanCloud 存储 SDK 中的 AV.GeoPoint 实例
   */
  __constructor(geoPoint) {
    if (!(geoPoint instanceof GeoPoint)) {
      throw new TypeError('geoPoint must be an AV.GeoPoint');
    }
    this.__base();
    this._geoPoint = geoPoint;
    const { latitude, longitude } = geoPoint;
    this._lcloc = { latitude, longitude };
  },
  /**
   * 获得 geoPoint 对象
   * @return {AV.GeoPoint}
   */
  getLocation() {
    return this._geoPoint;
  },
}, {
  parse(json, message) {
    const { latitude, longitude } = json._lcloc;
    const geoPoint = new GeoPoint({ latitude, longitude });
    return this.__base(json, message || new this(geoPoint));
  },
});

/**
 * @name TYPE
 * @memberof LocationMessage
 * @type Number
 * @static
 * @const
 */
messageType(-5)(LocationMessage);
messageField('_lcloc')(LocationMessage);

export { LocationMessage as default };
