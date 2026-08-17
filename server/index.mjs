import express from 'express';
import cors from 'cors';
import { query } from './db.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.mjs';
import projectRoutes from './routes/projects.mjs';
import aboutRoutes from './routes/about.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Run schema migration
async function migrate() {
  try {
    const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    await query(sql);
    console.log('✓ Schema ready');
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/about', aboutRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

migrate().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server running on port ${PORT}`);
  });
});
