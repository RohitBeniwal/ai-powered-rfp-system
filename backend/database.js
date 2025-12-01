const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  // Create RFPs table
  db.run(`
    CREATE TABLE IF NOT EXISTS rfps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      structured_data TEXT,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating rfps table:', err.message);
    } else {
      console.log('RFPs table ready');
    }
  });

  // Create Vendors table
  db.run(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      contact_person TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating vendors table:', err.message);
    } else {
      console.log('Vendors table ready');
    }
  });

  // Create Proposals table
  db.run(`
    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rfp_id INTEGER NOT NULL,
      vendor_id INTEGER NOT NULL,
      raw_response TEXT NOT NULL,
      parsed_data TEXT,
      status TEXT DEFAULT 'received',
      received_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rfp_id) REFERENCES rfps (id),
      FOREIGN KEY (vendor_id) REFERENCES vendors (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating proposals table:', err.message);
    } else {
      console.log('Proposals table ready');
    }
  });

  // Create RFP-Vendor junction table (for tracking which vendors RFP was sent to)
  db.run(`
    CREATE TABLE IF NOT EXISTS rfp_vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rfp_id INTEGER NOT NULL,
      vendor_id INTEGER NOT NULL,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rfp_id) REFERENCES rfps (id),
      FOREIGN KEY (vendor_id) REFERENCES vendors (id),
      UNIQUE(rfp_id, vendor_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating rfp_vendors table:', err.message);
    } else {
      console.log('RFP-Vendors junction table ready');
    }
  });
}

// Helper function to run queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
function getOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get all rows
function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  runQuery,
  getOne,
  getAll
};
