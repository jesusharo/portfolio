import { Router } from 'express';

const router = Router();

// POST /api/contact  { name, email, message }
router.post('/', async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  return res.status(410).json({ error: 'Use the mail link to send a message' });
});

export default router;
