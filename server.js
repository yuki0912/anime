const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

const CATEGORIES = {
  'Arknights': 'arknight',
  'Project Sekai': 'pjsk',
  'other1': '照片',
  'other2':'圖片',
};

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function getImages() {
  const result = {};
  for (const [label, folder] of Object.entries(CATEGORIES)) {
    const imgs = [];
    try {
      const files = fs.readdirSync(folder).sort();
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (IMAGE_EXTS.has(ext)) {
          imgs.push(`/${folder}/${file}`);
        }
      }
    } catch {}
    result[label] = imgs;
  }
  return result;
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === '/api/images') {
    const data = JSON.stringify(getImages());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  if (pathname === '/' || pathname === '') {
    serveFile(res, path.join(__dirname, 'index.html'));
    return;
  }

  // 修正安全漏洞：使用 path.resolve 確保解析為絕對路徑
  const safePath = path.resolve(path.join(__dirname, pathname));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  serveFile(res, safePath);
});

server.listen(PORT, HOST, () => {
  console.log(`Gallery running at http://localhost:${PORT}`);
})