import { promisify } from 'util';
import { readFile as rf } from 'fs';

const readFile = promisify(rf);

export const universalReadFile = (location: string) => {
  if (window && window.document) {
    return fetch(location);
  } else if (process && process.platform) {
    return readFile(location, 'utf8');
  } else {
    throw new Error('Unable to detect server or browser environment.');
  }
};
