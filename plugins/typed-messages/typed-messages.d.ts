import AV from 'leancloud-storage';
import IM from 'leancloud-realtime';

declare class FileMessage extends IM.TypedMessage {
  constructor(file: AV.File);
  getFile(): AV.File;
}

declare class LocationMessage extends IM.TypedMessage {
  constructor(geoPoint: AV.GeoPoint);
  getLocation(): AV.GeoPoint;
}

declare interface Plugin {
  TypedMessagesPlugin: IM.Plugin;
  FileMessage: typeof FileMessage;
  ImageMessage: typeof FileMessage;
  AudioMessage: typeof FileMessage;
  VideoMessage: typeof FileMessage;
  LocationMessage: typeof LocationMessage;
}

declare function initPlugin(avNs: typeof AV, imNs: typeof IM): Plugin;

export = initPlugin;
