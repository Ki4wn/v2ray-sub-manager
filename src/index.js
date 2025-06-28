import express from 'express';
import cron from 'node-cron';
import db from './sqlite.js';
import { fetchAndStoreSubscription } from './utils/fetchSubs.js';
import mergedRouter from './routes/merged.js';
import nodesRouter from './routes/nodes.js';
import subsRouter from './routes/subscriptions.js';
import updateRouter from './routes/update.js'
import viewRouter from './routes/view.js';

const app = express();
app.use(express.json());

app.use('/api/merged', mergedRouter);
app.use('/api/nodes', nodesRouter);
app.use('/api/subscriptions', subsRouter);
app.use('/api/update', updateRouter);
app.use('/api/view', viewRouter);

cron.schedule('*/30 * * * *', async () => {
  console.log("Cron job running every 30 minutes" + new Date().toISOString());
  const subs = db.prepare('SELECT url FROM subscriptions').all();

  for (const sub of subs) {
    db.prepare(`
    DELETE FROM nodes
    WHERE source = ?
    `).run(sub.url);
    await fetchAndStoreSubscription(sub.url);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));