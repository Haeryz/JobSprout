import express from 'express';
import profileController from '../controllers/profile.controller.js';
import { verifyToken } from '../middleware/security/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// GET user's own profile
router.get('/', profileController.getProfile);

// GET a specific user's profile by ID (admin only)
router.get('/:userId', profileController.getProfileById);

// POST/PUT update profile (create or update)
router.post('/', profileController.updateProfile);
router.put('/', profileController.updateProfile);

// DELETE resume
router.delete('/resume', profileController.deleteResume);

export default router;