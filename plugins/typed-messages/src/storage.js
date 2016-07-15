/* eslint-disable import/no-unresolved */
import { File } from 'leancloud-storage';

if (!File) {
  throw new Error('LeanCloud Storage SDK not installed');
}

export {
  File,
  GeoPoint,
} from 'leancloud-storage';
