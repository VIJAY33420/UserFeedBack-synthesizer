const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes and verify JWT token
 */
const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from DB based on decoded ID, excluding the password field
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                res.status(401);
                return next(new Error('User belonging to this token no longer exists.'));
            }

            return next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401); // Unauthorized
            return next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401); // Unauthorized
        return next(new Error('Not authorized, no token provided'));
    }
};

module.exports = { protect };
