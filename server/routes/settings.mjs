import { Router } from 'express';
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

function sanitizeFaviconUrl(value) {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!url) return '';
  if (url.startsWith('/api/images/') || url.startsWith('/uploads/')) return url;

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

// Public — the app needs this value before the editor is available.
router.get('/', async (_req, res) => {
  try {
    const result = await query(
      'SELECT favicon_url, case_studies_visible, agent_visible FROM site_settings WHERE id = 1'
    );
    res.json({
      favicon_url: result.rows[0]?.favicon_url || '',
      case_studies_visible: result.rows[0]?.case_studies_visible ?? true,
      agent_visible: result.rows[0]?.agent_visible ?? true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Editor — update all general site settings atomically.
router.put('/', requireAuth, async (req, res) => {
  const faviconUrl = sanitizeFaviconUrl(req.body?.favicon_url);
  const { case_studies_visible, agent_visible } = req.body || {};

  if (faviconUrl === null) return res.status(400).json({ error: 'Invalid favicon URL' });
  if (typeof case_studies_visible !== 'boolean' || typeof agent_visible !== 'boolean') {
    return res.status(400).json({ error: 'Visibility values must be booleans' });
  }

  try {
    const result = await query(
      `UPDATE site_settings
       SET favicon_url = $1,
           case_studies_visible = $2,
           agent_visible = $3,
           updated_at = NOW()
       WHERE id = 1
       RETURNING favicon_url, case_studies_visible, agent_visible`,
      [faviconUrl, case_studies_visible, agent_visible]
    );
    res.json({
      favicon_url: result.rows[0]?.favicon_url || '',
      case_studies_visible: result.rows[0]?.case_studies_visible ?? true,
      agent_visible: result.rows[0]?.agent_visible ?? true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Editor — update or clear the site favicon.
router.put('/favicon', requireAuth, async (req, res) => {
  const faviconUrl = sanitizeFaviconUrl(req.body?.favicon_url);
  if (faviconUrl === null) return res.status(400).json({ error: 'Invalid favicon URL' });

  try {
    const result = await query(
      'UPDATE site_settings SET favicon_url = $1, updated_at = NOW() WHERE id = 1 RETURNING favicon_url',
      [faviconUrl]
    );
    res.json({ favicon_url: result.rows[0]?.favicon_url || '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Editor — update public page visibility.
router.put('/visibility', requireAuth, async (req, res) => {
  const { case_studies_visible, agent_visible } = req.body || {};
  if (typeof case_studies_visible !== 'boolean' || typeof agent_visible !== 'boolean') {
    return res.status(400).json({ error: 'Visibility values must be booleans' });
  }

  try {
    const result = await query(
      `UPDATE site_settings
       SET case_studies_visible = $1, agent_visible = $2, updated_at = NOW()
       WHERE id = 1
       RETURNING case_studies_visible, agent_visible`,
      [case_studies_visible, agent_visible]
    );
    res.json({
      case_studies_visible: result.rows[0]?.case_studies_visible ?? true,
      agent_visible: result.rows[0]?.agent_visible ?? true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;