import express from 'express';
import db from '../sqlite.js';
const router = express.Router();

router.post('/', (req, res) => {
  const { raw, type, name } = req.body;
  if (!raw || !type) return res.status(400).json({ error: 'Missing raw or type' });
  db.prepare('INSERT INTO nodes (type, raw, source) VALUES (?, ?, ?)')
    .run(type, raw.trim(), name || 'manual');
  res.json({ success: true });
});

export default router;