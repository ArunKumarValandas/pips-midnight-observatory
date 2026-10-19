import http from 'http';
import fs from 'fs';
import path from 'path';
import { handleApiRequest } from './apiHandler.js';
import { initDatabase } from './db.js';

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

async function startServer() {
  await initDatabase();

  const server = http.createServer((req, res) => {
    // 1. Check API endpoints first
    if (req.url.startsWith('/api')) {
      return handleApiRequest(req, res);
    }

    // 2. Serve static files from dist/
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let safePath = path.normalize(decodeURIComponent(parsedUrl.pathname)).replace(/^(\.\.[/\\])+/, '');
    if (safePath === '/' || safePath === '') safePath = '/index.html';

    let filePath = path.join(DIST_DIR, safePath);

    // If file exists, serve it
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.statusCode = 200;
      res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      return fs.createReadStream(filePath).pipe(res);
    }

    // Otherwise serve index.html for client-side SPA routing
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return fs.createReadStream(indexPath).pipe(res);
    }

    res.statusCode = 404;
    res.end('Not Found');
  });

  server.listen(PORT, () => {
    console.log(`🌌 Pip's Midnight Observatory Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
