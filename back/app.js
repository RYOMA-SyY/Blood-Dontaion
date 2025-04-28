require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const { db, resetDatabase } = require('./db');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',  // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Security middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/healthz', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ status: 'OK' });
});

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donation', require('./routes/donation'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/user', require('./routes/user'));

// Add reset database route
app.post('/api/reset-database', async (req, res) => {
  try {
    await resetDatabase();
    res.json({ success: true, message: 'Database reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting database' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
