#!/usr/bin/env node
// Tiny static server for local preview that mimics Vercel's cleanUrls + directory index behaviour.
//   npm run serve   → http://localhost:4321
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', 'build');
const PORT = Number(process.env.PORT) || 4321;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  const candidates = [path.join(ROOT, p), path.join(ROOT, p + '.html'), path.join(ROOT, p, 'index.html')];
  let file = candidates.find(f => fs.existsSync(f) && fs.statSync(f).isFile());
  let status = 200;
  if (!file) { file = path.join(ROOT, '404.html'); status = 404; }
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving build/ at http://localhost:${PORT}`));
