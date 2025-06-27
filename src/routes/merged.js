import express from 'express';
import db from '../sqlite.js';
import { Buffer } from 'node:buffer';
const router = express.Router();

router.get('/', (req, res) => {
  const nodes = db.prepare('SELECT raw FROM nodes').all();
  const list = nodes.map(n => n.raw.trim()).join('\n');
  const encoded = Buffer.from(list).toString('base64');
  res.type('text/plain').send(encoded);
});

export default router;