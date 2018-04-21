// Types
import { Server } from 'http';

// Builtins
import { resolve } from 'path';

// Externals
import * as express from 'express';

// Internals
import { readFile } from '../src/index';

// readFile is attached to window on the server in module.mjs
declare global {
  interface Window {
    readFile: (location: string) => Promise<string>;
  }
}

let server: Server;

beforeAll(() => {
  const app = express();
  const serverRoot = resolve(__dirname, '../__fixtures__/server');
  app.use('/', express.static(serverRoot));
  server = app.listen(8081);
});

afterAll(() => {
  server.close();
});

describe('rejects if location parameter is missing or of wrong type', () => {
  test('in browser', async () => {
    await page.goto('http://localhost:8081/a/');

    // @ts-ignore
    const result1 = await page.evaluate(() => window.readFile().catch(e => e.message));
    // @ts-ignore
    const result2 = await page.evaluate(() => window.readFile(42).catch(e => e.message));

    expect(result1.indexOf('parameter')).not.toBe(-1);
    expect(result2.indexOf('string')).not.toBe(-1);
  });

  test('in node', async () => {
    // @ts-ignore
    await expect(readFile()).rejects.toThrow('parameter');
    // @ts-ignore
    await expect(readFile(42)).rejects.toThrow('string');
  });
});

describe('retrieves contents of text file as string', () => {
  describe('by absolute path', () => {
    test('in browser', async () => {
      await page.goto('http://localhost:8081/a/');
      const result = await page.evaluate(() => window.readFile('/test.txt'));
      expect(result).toEqual('Hello world!\n');
    });

    test('in node', async () => {
      const result = await readFile(resolve(__dirname, '../__fixtures__/server/test.txt'));
      expect(result).toEqual('Hello world!\n');
    });
  });

  describe('by relative path', () => {
    test('in browser', async () => {
      await page.goto('http://localhost:8081/a/');
      const result = await page.evaluate(() => window.readFile('../test.txt'));
      expect(result).toEqual('Hello world!\n');
    });

    test('in node', async () => {
      const result = await readFile('../__fixtures__/server/test.txt');
      expect(result).toEqual('Hello world!\n');
    });
  });
});

// TODO: Handle file not found errors
