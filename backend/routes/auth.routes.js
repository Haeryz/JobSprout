import express from 'express';
import { signup, login, forgotPassword, getProfile, googleLogin } from '../controllers/auth.controller.js';
import { validateSignup, validateLogin, validatePasswordReset } from '../middleware/security/validation.js';
import { verifyToken } from '../middleware/security/auth.js';
import { authLimiter } from '../middleware/security/rateLimiter.js';

const router = express.Router();

// Apply the auth rate limiter to all auth routes
router.use(authLimiter);

// Auth routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/google', googleLogin);
router.post('/forgot-password', validatePasswordReset, forgotPassword);

// Protected route (requires authentication)
router.get('/profile', verifyToken, getProfile);

export default router;