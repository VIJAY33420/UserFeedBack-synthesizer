const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Helper function to generate a JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
};

/**
 * POST /api/auth/signup
 * Register a new user and return a JWT token
 */
const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400); // Bad Request
            return next(new Error('User already exists with this email'));
        }

        // Create the user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/login
 * Authenticate user and return a JWT token
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        
        // If user not found, or password doesn't match
        if (!user || !(await user.comparePassword(password))) {
            res.status(401); // Unauthorized
            return next(new Error('Invalid email or password'));
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/google
 * Authenticate user via Google and return a JWT token
 */
const googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;
        
        // Fetch user info from Google using access token
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
            res.status(401);
            return next(new Error('Invalid Google token'));
        }
        
        const data = await response.json();
        const { email, name } = data;
        
        // Find user by email
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create a new user with a random password
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                name: name || 'Google User',
                email,
                password: randomPassword
            });
        }
        
        // Generate JWT token
        const jwtToken = generateToken(user._id);

        res.status(200).json({
            success: true,
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};


/**
 * GET /api/auth/me
 * Fetch logged-in user's own profile using their token
 */
const getMe = async (req, res, next) => {
    try {
        // req.user is set by the authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from result
        
        if (!user) {
            res.status(404); // Not Found
            return next(new Error('User not found'));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
    googleLogin,
    getMe
};
