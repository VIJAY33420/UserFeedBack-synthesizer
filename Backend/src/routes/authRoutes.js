const express = require('express');
const router = express.Router();
const { signup, login, googleLogin, getMe } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validateAuth');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validateSignup, signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, login);

// @route   POST /api/auth/google
// @desc    Authenticate user via Google & get token
// @access  Public
router.post('/google', googleLogin);

// @route   GET /api/auth/me
// @desc    Get current logged in user profile
// @access  Private (Requires Token)
router.get('/me', protect, getMe);

module.exports = router;
