import Database from 'better-sqlite3';
const db = new Database('./db/database.sqlite');

db.exec(`
CREATE TABLE IF NOT EXISTS nodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  raw TEXT NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  source TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  last_fetched DATETIME
);
`);
export default db;