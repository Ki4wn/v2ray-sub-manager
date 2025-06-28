import express from 'express';
import db from '../sqlite.js';
import { fetchAndStoreSubscription } from '../utils/fetchSubs.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const subs = db.prepare('SELECT url FROM subscriptions').all();

  for (const sub of subs) {
    db.prepare(`
    DELETE FROM nodes
    WHERE source = ?
    `).run(sub.url);
    await fetchAndStoreSubscription(sub.url);
  }
  res.json({ success: true });
});
export default router;