const path = require('path');

let db = null;
let inMemoryHistory = [];

try {
  // If running on Vercel/serverless, avoid native better-sqlite3 to prevent cold start crashes
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const Database = require('better-sqlite3');
    const dbPath = path.join(__dirname, 'data.db');
    db = new Database(dbPath);
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
  }
} catch (err) {
  console.warn("SQLite database disabled, using in-memory store:", err.message);
  db = null;
}

// Wrapper interface compatible with db.prepare(...).run() and db.prepare(...).all()
module.exports = {
  prepare(sql) {
    if (db) {
      try {
        return db.prepare(sql);
      } catch (e) {
        console.warn("SQLite query failed, falling back to in-memory:", e.message);
      }
    }

    const upper = sql.trim().toUpperCase();
    if (upper.startsWith('INSERT')) {
      return {
        run(from, to, input, output, timestamp) {
          inMemoryHistory.unshift({
            id: inMemoryHistory.length + 1,
            from_unit: from,
            to_unit: to,
            input_value: input,
            output_value: output,
            timestamp: timestamp || Date.now()
          });
          if (inMemoryHistory.length > 50) inMemoryHistory.pop();
          return { changes: 1 };
        }
      };
    } else if (upper.startsWith('SELECT')) {
      return {
        all() {
          return inMemoryHistory.slice(0, 50);
        }
      };
    } else if (upper.startsWith('DELETE')) {
      return {
        run() {
          inMemoryHistory = [];
          return { changes: 1 };
        }
      };
    }
    return {
      run() { return { changes: 0 }; },
      all() { return []; }
    };
  }
};
