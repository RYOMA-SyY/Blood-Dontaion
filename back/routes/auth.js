const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

// Validation schemas
const registerSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    cin: Joi.string().required().min(6).max(10),
    password: Joi.string().required().min(6),
    blood_type: Joi.string().required().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { name, email, cin, password, blood_type } = value;

        // Check if user already exists
        const existingUser = await db.get('SELECT * FROM users WHERE email = ? OR cin = ?', [email, cin]);
        if (existingUser) {
            return res.status(400).json({ error: 'Email or CIN already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert new user
        const result = await db.run(
            'INSERT INTO users (name, email, cin, password_hash, blood_type) VALUES (?, ?, ?, ?, ?)',
            [name, email, cin, passwordHash, blood_type]
        );

        // Generate JWT token
        const token = jwt.sign({ id: result.lastID }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.lastID,
                name,
                email,
                blood_type
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = value;

        // Find user
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update last login
        await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                blood_type: user.blood_type,
                points: user.points,
                avatar_url: user.avatar_url
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.get('SELECT id, name, email, blood_type, points, avatar_url FROM users WHERE id = ?', [decoded.id]);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
