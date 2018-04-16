import { createServer } from 'http';

import { universalReadFile } from '../src/index';

let server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello World!');
  res.end();
});

beforeAll(() => {
  server.listen(8080);
});

afterAll(() => {
  server.close();
});

test('acts as fetch (not readFile)', async () => {
  const fetchResult = await page.evaluate(universalReadFile, 'http://localhost:8080');
  expect(fetchResult).toBe(200);
});
