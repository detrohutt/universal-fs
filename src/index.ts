const isBrowser = () => typeof window !== 'undefined';
const isNode = () => typeof process !== 'undefined';

export async function readFile(location: string) {
  if (typeof location !== 'string') {
    throw new Error(
      'The readFile function requires a string (path or url) as its first parameter.'
    );
  }

  if (isBrowser()) {
    return (await fetch(location, { credentials: 'include' })).text();
  }

  if (isNode()) {
    const { isAbsolute, join, callerDirname, fsReadFile } = await getNodeImports();
    const loc = isAbsolute(location) ? location : join(callerDirname(), location);
    return fsReadFile(loc, 'utf8');
  }

  throw new Error('Unable to detect server or browser environment.');
}

export async function exists(location: string) {
  if (typeof location !== 'string') {
    throw new Error('The exists function requires a string (path or url) as its first parameter.');
  }

  if (isBrowser()) {
    return (await fetch(location, { method: 'head', credentials: 'include' })).ok;
  }

  if (isNode()) {
    const { isAbsolute, join, callerDirname, fsExists } = await getNodeImports();
    const loc = isAbsolute(location) ? location : join(callerDirname(), location);
    return fsExists(loc);
  }

  throw new Error('Unable to detect server or browser environment.');
}

async function getNodeImports() {
  const { promisify } = await import('util');
  const { isAbsolute, join } = await import('path');
  const { callerDirname } = await import('caller-dirname');
  const { readFile: rf } = await import('fs');
  const { exists: e } = await import('fs');
  const fsReadFile = promisify(rf);
  const fsExists = promisify(e);

  return { isAbsolute, join, callerDirname, fsReadFile, fsExists };
}
