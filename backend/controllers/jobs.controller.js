import jobsModel from '../models/jobs.model.js';
import profileModel from '../models/profile.model.js';

export default {
  // Search for jobs
  async searchJobs(req, res) {
    try {
      const userId = req.user.uid;
      
      // Get user's profile to use preferences in search
      const profileResult = await profileModel.getProfile(userId);
      const profile = profileResult.data;
      
      // Get jobs from the model
      const result = await jobsModel.searchJobs(
        profile?.desiredJobTitle || 'marketing',
        profile?.city || ''
      );

      if (!result.success) {
        return res.status(404).json({
          status: 'error',
          message: result.message || 'Failed to fetch jobs'
        });
      }

      // Log the jobs data before sending response
      console.log('Jobs data:', JSON.stringify(result.data, null, 2));
      
      return res.status(200).json({
        status: 'success',
        data: result.data
      });
    } catch (error) {
      console.error('Error in searchJobs controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to search jobs',
        error: error.message
      });
    }
  },

  // Track a new job application
  async trackApplication(req, res) {
    try {
      const userId = req.user.uid;
      const jobData = req.body;

      const result = await jobsModel.trackApplication(userId, jobData);

      return res.status(200).json({
        status: 'success',
        data: result.data
      });
    } catch (error) {
      console.error('Error in trackApplication controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to track job application',
        error: error.message
      });
    }
  },

  // Get user's job applications
  async getUserApplications(req, res) {
    try {
      const userId = req.user.uid;
      
      const result = await jobsModel.getUserApplications(userId);

      return res.status(200).json({
        status: 'success',
        data: result.data
      });
    } catch (error) {
      console.error('Error in getUserApplications controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get user applications',
        error: error.message
      });
    }
  },

  // Update application status
  async updateApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      const result = await jobsModel.updateApplicationStatus(applicationId, status);

      return res.status(200).json({
        status: 'success',
        data: result.data
      });
    } catch (error) {
      console.error('Error in updateApplicationStatus controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update application status',
        error: error.message
      });
    }
  }
};