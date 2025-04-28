const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 