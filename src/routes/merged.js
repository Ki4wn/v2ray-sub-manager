import express from 'express';
import db from '../sqlite.js';
import { Buffer } from 'node:buffer';
import { findNameInText, numberAndSortByCountry } from "../utils/nameFinder.js";
const router = express.Router();

router.get('/', (req, res) => {
  const nodes = db.prepare(`
  SELECT
    nodes.raw,
    nodes.source,
    subscriptions.name
  FROM nodes
  LEFT JOIN subscriptions ON nodes.source = subscriptions.url
`).all();
  const list = nodes.map(item => {
    const link = item.raw
    const text_afterHash = link.split("#")[1];
    const decoded = decodeURIComponent(text_afterHash);
    const detail = findNameInText(decoded);
    return ({ ...detail, provider: item.name || item.source, url: link.split("#")[0] });
  });
  console.log(list)
  const sorted_list = numberAndSortByCountry(list)
  const joined_list = sorted_list.map(item => {
    const fullName = `${item.emoji} ${item.country} (${item.provider})`;
    return `${item.url}#${encodeURIComponent(fullName)}`;
  }).join('\n');
  const encoded = Buffer.from(joined_list).toString('base64');
  res.setHeader("Content-Type", "text/plain");
  res.send(encoded);
});

export default router;