require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
// Security middlewares
app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/healthz', (req, res) => res.json({ status: 'OK' }));
// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donation', require('./routes/donation'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
