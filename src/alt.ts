let universalReadFile;

if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
  universalReadFile = (url: string) => fetch(url);
} else if (typeof process !== 'undefined' && typeof process.platform !== 'undefined') {
  const { promisify } = require('util');
  const fs = require('fs');
  const readFile = promisify(fs.readFile);
  universalReadFile = (path: string) => readFile(path, 'utf8');
} else {
  throw new Error('Unable to detect server or browser environment.');
}

typeof module !== 'undefined' && (module.exports = { universalReadFile });
