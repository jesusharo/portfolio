import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { query } from '../db.mjs';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type. Use JPEG, PNG, GIF, WebP, or AVIF.'));
  },
});

// Detect the real content type from magic bytes; never trust the client-supplied mime.
function sniffImageType(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'image/gif';
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  if (buf.slice(4, 8).toString('ascii') === 'ftyp') {
    const brand = buf.slice(8, 12).toString('ascii');
    if (brand.startsWith('avi')) return 'image/avif';
  }
  return null;
}

// Editor — upload an image
router.post('/editor/upload', requireAuth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Image too large (max 8 MB)' : err.message;
      return res.status(400).json({ error: msg });
    }
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const sniffed = sniffImageType(req.file.buffer);
    if (!sniffed) {
      return res.status(400).json({ error: 'File content is not a supported image (JPEG, PNG, GIF, WebP, or AVIF)' });
    }
    const id = crypto.randomUUID();
    try {
      await query(
        'INSERT INTO images (id, filename, mime_type, data) VALUES ($1, $2, $3, $4)',
        [id, req.file.originalname, sniffed, req.file.buffer]
      );
      res.json({ id, url: `/api/images/${id}` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'DB error' });
    }
  });
});

// Public — serve an image
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT mime_type, data FROM images WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    const { mime_type, data } = result.rows[0];
    res.set('Content-Type', mime_type);
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Content-Security-Policy', "default-src 'none'");
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(data);
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;
