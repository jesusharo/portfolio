import { Router } from 'express';
import { query } from '../db.mjs';
import jwt from 'jsonwebtoken';
import { sanitizePlainText, sanitizeContentBlocks, sanitizeHexColor, sanitizeTextAlign } from '../sanitize.mjs';

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

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Public — list visible projects by type
router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    const cond = type ? 'WHERE type = $1 AND hidden = false' : 'WHERE hidden = false';
    const params = type ? [type] : [];
    const result = await query(
      `SELECT * FROM projects ${cond} ORDER BY sort_order ASC, created_at ASC`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Public — single project by id
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Editor — list all (including hidden)
router.get('/editor/all', requireAuth, async (req, res) => {
  const { type } = req.query;
  try {
    const cond = type ? 'WHERE type = $1' : '';
    const params = type ? [type] : [];
    const result = await query(
      `SELECT * FROM projects ${cond} ORDER BY sort_order ASC, created_at ASC`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Editor — create project
router.post('/editor', requireAuth, async (req, res) => {
  const { type, name: rawName } = req.body;
  if (!type || !rawName) return res.status(400).json({ error: 'type and name required' });
  const name = sanitizePlainText(rawName);
  if (!name) return res.status(400).json({ error: 'name is required' });
  const id = toSlug(name) + '-' + Date.now().toString(36);
  const slug = toSlug(name);
  try {
    const count = await query('SELECT COUNT(*) FROM projects WHERE type = $1', [type]);
    const order = parseInt(count.rows[0].count);
    const result = await query(
      `INSERT INTO projects (id, type, name, slug, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, type, name, slug, order]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Editor — update project
router.put('/editor/:id', requireAuth, async (req, res) => {
  const fields = req.body;
  const allowed = [
    'name','subtitle','slug','sort_order','hidden','background_color','accent_color','text_color',
    'logo_grid_image','logo_header_image','hero_image','hero_foreground_image','content_blocks','description',
    'description_alignment'
  ];
  const sets = [];
  const vals = [];
  let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (!allowed.includes(k)) continue;
    let sanitized;
    if (k === 'name' || k === 'subtitle') sanitized = sanitizePlainText(String(v));
    else if (k === 'text_color') sanitized = sanitizeHexColor(v);
    else if (k === 'description_alignment') sanitized = sanitizeTextAlign(v);
    else if (k === 'content_blocks') sanitized = JSON.stringify(sanitizeContentBlocks(v));
    else sanitized = v;
    sets.push(`${k} = $${i++}`);
    vals.push(sanitized);
  }
  if (!sets.length) return res.status(400).json({ error: 'No valid fields' });
  sets.push(`updated_at = NOW()`);
  vals.push(req.params.id);
  try {
    const result = await query(
      `UPDATE projects SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
      vals
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Editor — delete project
router.delete('/editor/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Editor — bulk reorder
router.post('/editor/reorder', requireAuth, async (req, res) => {
  const { ids } = req.body; // ordered array of ids
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
  try {
    await Promise.all(ids.map((id, idx) =>
      query('UPDATE projects SET sort_order = $1 WHERE id = $2', [idx, id])
    ));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;
