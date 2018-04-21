// Types
import { Server } from 'http';

// Builtins
import { resolve } from 'path';

// Externals
import * as express from 'express';

// Internals
import { exists } from '../src/index';

// exists is attached to window on the server in module.mjs
declare global {
  interface Window {
    exists: (location: string) => Promise<boolean>;
  }
}

let server: Server;

beforeAll(() => {
  const app = express();
  const serverRoot = resolve(__dirname, '../__fixtures__/server');
  app.use('/', express.static(serverRoot));
  server = app.listen(8082);
});

afterAll(() => {
  server.close();
});

describe('rejects if location parameter is missing or of wrong type', () => {
  test('in browser', async () => {
    await page.goto('http://localhost:8082/a/');

    // @ts-ignore
    const result1 = await page.evaluate(() => window.exists().catch(e => e.message));
    // @ts-ignore
    const result2 = await page.evaluate(() => window.exists(42).catch(e => e.message));

    expect(result1.indexOf('parameter')).not.toBe(-1);
    expect(result2.indexOf('string')).not.toBe(-1);
  });

  test('in node', async () => {
    // @ts-ignore
    await expect(exists()).rejects.toThrow('parameter');
    // @ts-ignore
    await expect(exists(42)).rejects.toThrow('string');
  });
});

describe('returns existence of file as boolean by absolute path', () => {});

describe('returns true for existing file', () => {
  describe('by absolute path', () => {
    test('in browser', async () => {
      await page.goto('http://localhost:8082/a/');
      const result = await page.evaluate(() => window.exists('/test.txt'));
      expect(result).toEqual(true);
    });

    test('in node', async () => {
      const result = await exists(resolve(__dirname, '../__fixtures__/server/test.txt'));
      expect(result).toEqual(true);
    });
  });

  describe('by relative path', () => {
    test('in browser', async () => {
      await page.goto('http://localhost:8082/a/');
      const result = await page.evaluate(() => window.exists('../test.txt'));
      expect(result).toEqual(true);
    });

    test('in node', async () => {
      const result = await exists('../__fixtures__/server/test.txt');
      expect(result).toEqual(true);
    });
  });
});

describe('returns false for missing file', () => {
  describe('by absolute path', () => {
    test('in browser', async () => {
      await page.goto('http://localhost:8082/a/');
      const result = await page.evaluate(() => window.exists('/noexist.txt'));
      expect(result).toEqual(false);
    });

    test('in node', async () => {
      const result = await exists(resolve(__dirname, '../__fixtures__/server/noexist.txt'));
      expect(result).toEqual(false);
    });
  });

  describe('by relative path', () => {
    test('in browser', async () => {
      await page.goto('http://localhost:8082/a/');
      const result = await page.evaluate(() => window.exists('../noexist.txt'));
      expect(result).toEqual(false);
    });

    test('in node', async () => {
      const result = await exists('../__fixtures__/server/noexist.txt');
      expect(result).toEqual(false);
    });
  });
});
