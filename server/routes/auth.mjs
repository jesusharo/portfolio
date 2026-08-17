import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const EDITOR_PASSCODE = process.env.EDITOR_PASSCODE || '';

router.post('/login', (req, res) => {
  const { passcode } = req.body;
  if (!EDITOR_PASSCODE) {
    return res.status(500).json({ error: 'Editor passcode not configured' });
  }
  if (passcode !== EDITOR_PASSCODE) {
    return res.status(401).json({ error: 'Invalid passcode' });
  }
  const token = jwt.sign({ editor: true }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

router.get('/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ valid: false });
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
