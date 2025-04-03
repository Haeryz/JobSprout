import express from 'express';
import jobsController from '../controllers/jobs.controller.js';
import { verifyToken } from '../middleware/security/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// GET jobs search
router.get('/search', jobsController.searchJobs);

// GET user's job applications
router.get('/applications', jobsController.getUserApplications);

// POST track new job application
router.post('/applications', jobsController.trackApplication);

// PATCH update application status
router.patch('/applications/:applicationId', jobsController.updateApplicationStatus);

export default router;