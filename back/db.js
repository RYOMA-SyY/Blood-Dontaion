const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join(process.cwd(), 'data', 'database.sqlite')
  : './database.sqlite';

// Ensure data directory exists in production
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to SQLite database', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Create tables if they don't exist
// Users
const userTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cin TEXT,
  password_hash TEXT NOT NULL,
  blood_type TEXT,
  donor_level TEXT,
  avatar_url TEXT
)`;
db.run(userTable);

// Donations
const donationTable = `CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT,
  volume INTEGER,
  points_awarded INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;
db.run(donationTable);

module.exports = db;
