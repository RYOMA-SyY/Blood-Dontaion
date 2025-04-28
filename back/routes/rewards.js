const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

// Get all available rewards
router.get('/', auth, async (req, res) => {
    try {
        const rewards = await db.all('SELECT * FROM rewards WHERE is_active = 1');
        res.json(rewards);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Failed to fetch rewards' });
    }
});

// Redeem a reward
router.post('/redeem/:rewardId', auth, async (req, res) => {
    const { rewardId } = req.params;
    const userId = req.user.id;

    try {
        // Start transaction
        await db.run('BEGIN TRANSACTION');

        // Get reward details
        const reward = await db.get('SELECT * FROM rewards WHERE id = ? AND is_active = 1', [rewardId]);
        if (!reward) {
            await db.run('ROLLBACK');
            return res.status(404).json({ error: 'Reward not found' });
        }

        // Get user's current points
        const user = await db.get('SELECT points FROM users WHERE id = ?', [userId]);
        if (user.points < reward.points_cost) {
            await db.run('ROLLBACK');
            return res.status(400).json({ error: 'Not enough points' });
        }

        // Deduct points and create redemption record
        await db.run('UPDATE users SET points = points - ? WHERE id = ?', [reward.points_cost, userId]);
        await db.run(
            'INSERT INTO reward_redemptions (user_id, reward_id, points_cost) VALUES (?, ?, ?)',
            [userId, rewardId, reward.points_cost]
        );

        await db.run('COMMIT');
        res.json({ message: 'Reward redeemed successfully' });
    } catch (error) {
        await db.run('ROLLBACK');
        console.error('Error redeeming reward:', error);
        res.status(500).json({ error: 'Failed to redeem reward' });
    }
});

// Get user's redemption history
router.get('/history', auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const redemptions = await db.all(`
            SELECT r.*, rew.name as reward_name, rew.description as reward_description
            FROM reward_redemptions r
            JOIN rewards rew ON r.reward_id = rew.id
            WHERE r.user_id = ?
            ORDER BY r.redeemed_at DESC
        `, [userId]);

        res.json(redemptions);
    } catch (error) {
        console.error('Error fetching redemption history:', error);
        res.status(500).json({ error: 'Failed to fetch redemption history' });
    }
});

module.exports = router; 