// Tiny local dev server that mounts api/*.js routes the same way Vercel does.
// Usage: node scripts/dev-api.mjs  (auto-loads .env.local if present)
// Vite proxies /api/* to this server (port 3001) during `npm run dev:full`.

import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const PORT = parseInt(process.env.PORT, 10) || 3002;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const API_DIR = path.join(ROOT, 'api');

// Minimal .env.local loader (no dotenv dep needed).
const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
  console.log('[dev-api] loaded .env.local');
}

const server = http.createServer(async (req, res) => {
  // CORS preflight (vite proxy handles same-origin, but be permissive locally).
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // Strip query string and /api prefix to map URL → file.
  const url = new URL(req.url, 'http://x');
  const pathname = url.pathname;
  if (!pathname.startsWith('/api/')) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }
  const route = pathname.slice('/api/'.length).replace(/\.js$/, '');
  const filePath = path.join(API_DIR, route + '.js');
  if (!fs.existsSync(filePath)) {
    sendJson(res, 404, { error: 'Route not found: ' + route });
    return;
  }

  // Bypass module cache so edits take effect without restart.
  const mod = await import(pathToFileURL(filePath).href + '?t=' + Date.now());
  const handler = mod.default;
  if (typeof handler !== 'function') {
    sendJson(res, 500, { error: 'Route exports no default handler' });
    return;
  }

  // Mimic Vercel's req/res surface.
  const query = Object.fromEntries(url.searchParams.entries());
  const wrappedReq = Object.assign(req, { query });
  const wrappedRes = wrapResponse(res);

  try {
    await handler(wrappedReq, wrappedRes);
  } catch (e) {
    console.error('[dev-api] handler error:', e);
    if (!res.headersSent) sendJson(res, 500, { error: e?.message || 'Server error' });
  }
});

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(body));
}

function wrapResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.end(JSON.stringify(body));
    return res;
  };
  res.send = (body) => {
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
    return res;
  };
  return res;
}

server.listen(PORT, () => {
  console.log(`[dev-api] listening on http://localhost:${PORT}`);
  console.log(`[dev-api] routes: ${fs.readdirSync(API_DIR).join(', ')}`);
});
