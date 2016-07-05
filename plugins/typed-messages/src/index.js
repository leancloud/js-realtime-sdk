import { FileMessage } from './file-message';
import { ImageMessage } from './image-message';
import { AudioMessage } from './audio-message';
import { VideoMessage } from './video-message';
import { LocationMessage } from './location-message';

export {
  FileMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  LocationMessage,
};

export const TypedMessagePlugin = {
  messageClasses: [
    FileMessage,
    ImageMessage,
    AudioMessage,
    VideoMessage,
    LocationMessage,
  ],
};
