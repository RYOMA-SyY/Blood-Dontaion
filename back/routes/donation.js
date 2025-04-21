const express = require('express');
const Joi = require('joi');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Add donation
router.post('/', authenticateToken, (req, res) => {
  const schema = Joi.object({ volume: Joi.number().integer().positive().required(), points_awarded: Joi.number().integer().positive().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { volume, points_awarded } = value;
  const user_id = req.user.id;
  const date = new Date().toISOString();
  db.run('INSERT INTO donations (user_id, date, volume, points_awarded) VALUES (?, ?, ?, ?)',
    [user_id, date, volume, points_awarded], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ success: true, donationId: this.lastID });
    });
});

// Get donations for current user
router.get('/my', authenticateToken, (req, res) => {
  const user_id = req.user.id;
  db.all('SELECT * FROM donations WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

module.exports = router;
