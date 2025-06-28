import axios from 'axios';
import db from '../sqlite.js';
import { Buffer } from 'node:buffer';

export async function fetchAndStoreSubscription(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        'cache-control': 'no-cache',
        "accept": '*/*',
        'user-agent': 'Streisand/22 CFNetwork/3826.500.111.1.1 Darwin/24.4.0',
        'accept-language': 'en-US,en;q=0.9',
        'accept-encoding': 'gzip, deflate',
        connection: 'keep-alive'
      }
    });
    const decoded = Buffer.from(res.data, 'base64').toString('utf-8');
    const lines = decoded.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const text_afterHash = line.split("#")[1];
      const text_decoded = decodeURIComponent(text_afterHash);
      if (text_decoded.includes("GB") || text_decoded.includes("اشتراکتون") || text_decoded.includes("📅")) continue;
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
