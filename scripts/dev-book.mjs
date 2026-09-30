import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createBookHandler } from '../server/book-orders.mjs';

if (existsSync('.env')) process.loadEnvFile('.env');
// No mock success and no credentials are supplied by the dev runner.
const handler = createBookHandler();
const api = createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(`http://127.0.0.1:4322${incoming.url}`, {
      method: incoming.method, headers: incoming.headers,
      ...(incoming.method !== 'GET' && incoming.method !== 'HEAD' ? { body: Readable.toWeb(incoming), duplex: 'half' } : {}),
    });
    const response = await handler(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch { outgoing.writeHead(500); outgoing.end('{"code":"service_unavailable"}'); }
});
api.listen(4322, '127.0.0.1');
const child = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', '--host', '127.0.0.1', ...process.argv.slice(2)], { stdio: 'inherit' });
const stop = () => { child.kill(); api.close(); };
process.on('SIGINT', stop); process.on('SIGTERM', stop);
child.on('exit', code => {
  if (code) { api.close(); process.exitCode = code; }
  else console.log('API local do livro em http://127.0.0.1:4322; Astro mantém sua própria prévia.');
});
