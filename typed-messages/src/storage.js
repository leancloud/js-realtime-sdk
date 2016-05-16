/* eslint-disable import/no-unresolved */
import { File } from 'avoscloud-sdk';

if (!File) {
  throw new Error('LeanCloud Storage SDK not installed');
}

export {
  File,
  GeoPoint,
} from 'avoscloud-sdk';
