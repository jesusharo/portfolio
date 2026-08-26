import express from 'express';
import cors from 'cors';
import { query } from './db.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import authRoutes from './routes/auth.mjs';
import projectRoutes from './routes/projects.mjs';
import aboutRoutes from './routes/about.mjs';
import settingsRoutes from './routes/settings.mjs';
import uploadRoutes from './routes/upload.mjs';
import imageRoutes from './routes/images.mjs';
import agentRoutes from './routes/agent.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

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
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/agent', agentRoutes);

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/api/health', (_, res) => res.json({ ok: true }));

// In production, serve the Vite build and handle SPA routing
if (isProd) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get(/.*/,  (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

migrate().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server running on port ${PORT}`);
  });
});
