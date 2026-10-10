const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

// Create history table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_unit TEXT,
    to_unit TEXT,
    input_value REAL,
    output_value REAL,
    timestamp INTEGER
  )
`).run();

module.exports = db;
