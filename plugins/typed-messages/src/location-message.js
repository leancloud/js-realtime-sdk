export function createLocationMessage({ AV, realtime }) {
  class LocationMessage extends realtime.TypedMessage {
    /**
     * @extends TypedMessage
     * @param  {AV.GeoPoint} geoPoint LeanCloud 存储 SDK 中的 AV.GeoPoint 实例
     */
    constructor(geoPoint) {
      if (!(geoPoint instanceof AV.GeoPoint)) {
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

    toJSON() {
      return {
        ...super.toJSON(),
        location: this.getLocation().toJSON(),
      };
    }

    static parse(json, message) {
      const { latitude, longitude } = json._lcloc;
      const geoPoint = new AV.GeoPoint({ latitude, longitude });
      return realtime.TypedMessage.parse(json, message || new this(geoPoint));
    }
  }

  /**
   * @name TYPE
   * @memberof LocationMessage
   * @type Number
   * @static
   * @const
   */
  realtime.messageType(-5)(LocationMessage);
  realtime.messageField('_lcloc')(LocationMessage);
  realtime.IE10Compatible(LocationMessage);

  return LocationMessage;
}
