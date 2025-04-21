const express = require('express');
const Joi = require('joi');
const multer = require('multer');
const db = require('../db');
const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only jpeg and png
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed'));
    }
  }
});

// Get user profile
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  db.get('SELECT id, name, email, blood_type, donor_level, avatar_data, avatar_type FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    
    // Convert avatar data to base64 if it exists
    if (user.avatar_data) {
      const base64Image = user.avatar_data.toString('base64');
      user.avatar_url = `data:${user.avatar_type};base64,${base64Image}`;
    } else {
      user.avatar_url = 'assets/img/unknown_profile.png';
    }
    
    // Remove binary data from response
    delete user.avatar_data;
    delete user.avatar_type;
    
    // Fetch lifePoints and donation count
    db.get('SELECT IFNULL(SUM(points_awarded),0) AS lifePoints, COUNT(*) AS donationCount FROM donations WHERE user_id = ?', [userId], (err2, stats) => {
      if (err2) return res.status(500).json({ error: 'Stats error' });
      res.json({ ...user, lifePoints: stats.lifePoints, donationCount: stats.donationCount });
    });
  });
});

// Upload avatar
router.post('/:id/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const userId = req.params.id;
  const imageData = req.file.buffer;
  const imageType = req.file.mimetype;

  // Update user's avatar in database
  db.run('UPDATE users SET avatar_data = ?, avatar_type = ? WHERE id = ?', 
    [imageData, imageType, userId], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Return the image as a base64 data URL
    const base64Image = imageData.toString('base64');
    const avatarUrl = `data:${imageType};base64,${base64Image}`;
    
    res.json({ 
      success: true, 
      avatar_url: avatarUrl
    });
  });
});

// Update user profile
router.put('/:id', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    blood_type: Joi.string().required(),
    donor_level: Joi.string().allow(null, ''),
    avatar_url: Joi.string().allow(null, '')
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const userId = req.params.id;
  const { name, blood_type, donor_level } = value;
  db.run('UPDATE users SET name = ?, blood_type = ?, donor_level = ? WHERE id = ?',
    [name, blood_type, donor_level, userId], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ success: true });
    });
});

module.exports = router;
