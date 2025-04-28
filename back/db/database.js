const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'blood_donation.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Helper function to run SQL queries with promises
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error running sql ' + sql);
                console.error(err);
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
}

// Helper function to get single row
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) {
                console.error('Error running sql: ' + sql);
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Helper function to get all rows
function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('Error running sql: ' + sql);
                console.error(err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Initialize database with schema
async function initializeDatabase() {
    try {
        const fs = require('fs');
        const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
        
        // Split the SQL file into individual statements
        const statements = initSQL.split(';').filter(stmt => stmt.trim());
        
        // Execute each statement
        for (let statement of statements) {
            if (statement.trim()) {
                await run(statement);
            }
        }
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    }
}

// Initialize database when this module is imported
initializeDatabase().catch(console.error);

module.exports = {
    run,
    get,
    all,
    close: () => {
        return new Promise((resolve, reject) => {
            db.close(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}; 