import express from 'express';
import db from '../sqlite.js';
import { fetchAndStoreSubscription } from '../utils/fetchSubs.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });
  db.prepare('INSERT OR IGNORE INTO subscriptions (url) VALUES (?)').run(url);
  await fetchAndStoreSubscription(url);
  res.json({ success: true });
});
export default router;