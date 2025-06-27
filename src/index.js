import express from 'express';
import cron from 'node-cron';
import db from './sqlite.js';
import { fetchAndStoreSubscription } from './utils/fetchSubs.js';
import mergedRouter from './routes/merged.js';
import nodesRouter from './routes/nodes.js';
import subsRouter from './routes/subscriptions.js';

const app = express();
app.use(express.json());

app.use('/api/merged', mergedRouter);
app.use('/api/nodes', nodesRouter);
app.use('/api/subscriptions', subsRouter);

cron.schedule('*/30 * * * *', async () => {
  const subs = db.prepare('SELECT url FROM subscriptions').all();
  for (const sub of subs) {
    await fetchAndStoreSubscription(sub.url);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));