const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Add CORS headers middleware
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS method
  if ('OPTIONS' === req.method) {
    return res.sendStatus(200);
  }
  next();
});

// Register
router.post('/register', (req, res) => {
  const schema = Joi.object({ name: Joi.string().required(), email: Joi.string().email().required(), password: Joi.string().min(6).required(), cin: Joi.string().required(), blood_type: Joi.string().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { name, email, password, cin, blood_type } = value;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (user) return res.status(409).json({ error: 'Email already exists' });
    bcrypt.hash(password, 10, (err, hash) => {
      db.run('INSERT INTO users (name, email, cin, password_hash, blood_type) VALUES (?, ?, ?, ?, ?)',
        [name, email, cin, hash, blood_type], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, user: { id: this.lastID, name, email, cin, blood_type } });
      });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const schema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { email, password } = value;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (!result) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, cin: user.cin, blood_type: user.blood_type } });
    });
  });
});

module.exports = router;
