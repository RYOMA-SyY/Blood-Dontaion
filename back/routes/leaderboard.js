const express = require('express');
const db = require('../db');
const router = express.Router();

// Get leaderboard (top donors by points)
router.get('/', (req, res) => {
  db.all(`SELECT users.id, users.name, users.avatar_url, SUM(donations.points_awarded) as total_points, COUNT(donations.id) as total_donations
          FROM users
          LEFT JOIN donations ON users.id = donations.user_id
          GROUP BY users.id
          ORDER BY total_points DESC
          LIMIT 10`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

module.exports = router;
