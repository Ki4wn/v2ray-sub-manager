import axios from 'axios';
import db from '../sqlite.js';
import { Buffer } from 'node:buffer';

export async function fetchAndStoreSubscription(url) {
  try {
    const res = await axios.get(url, { responseType: 'text' });
    const decoded = Buffer.from(res.data, 'base64').toString('utf-8');
    const lines = decoded.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const type = line.startsWith('vmess://') ? 'vmess' :
        line.startsWith('vless://') ? 'vless' : 'other';
      if (!db.prepare('SELECT 1 FROM nodes WHERE raw = ?').get(line)) {
        db.prepare('INSERT INTO nodes (type, raw, source) VALUES (?, ?, ?)')
          .run(type, line, url);
      }
    }
    db.prepare('UPDATE subscriptions SET last_fetched = CURRENT_TIMESTAMP WHERE url = ?').run(url);
  } catch (err) {
    console.error('Failed to fetch subscription:', url, err.message);
  }
}

export default { fetchAndStoreSubscription };
