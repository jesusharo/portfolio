import { Router } from 'express';
import { query } from '../db.mjs';
import jwt from 'jsonwebtoken';

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

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT content_html FROM about_content WHERE id = 1');
    res.json({ content_html: result.rows[0]?.content_html || '' });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  const { content_html } = req.body;
  try {
    await query(
      'UPDATE about_content SET content_html = $1, updated_at = NOW() WHERE id = 1',
      [content_html]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;
