// server.js — 簡單的上傳與靜態檔案伺服器
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

// 靜態提供上傳的檔案
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/', express.static(path.join(__dirname)));

// 限制：圖片格式與大小
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  }
});

function fileFilter (req, file, cb) {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Only image files are allowed'));
}

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

// 上傳 endpoint（單檔：欄位名稱 photo）
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ filename: req.file.filename, url });
});

// 列出上傳的照片（按時間倒序）
app.get('/api/photos', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read uploads' });
    const images = files
      .filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f))
      .map(f => ({ filename: f, url: `/uploads/${f}`, mtime: fs.statSync(path.join(UPLOAD_DIR, f)).mtime }))
      .sort((a,b) => b.mtime - a.mtime);
    res.json(images);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
