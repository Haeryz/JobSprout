import profileModel from '../models/profile.model.js';
import { auth } from '../config/database.js';

// Controller for profile-related operations
export default {
  // Create or update a user profile
  async updateProfile(req, res) {
    try {
      // Get the user ID from the authenticated request
      const userId = req.user.uid;
      
      // Get profile data from request body
      const profileData = req.body;
      
      // Validate essential fields
      if (!profileData.fullName) {
        return res.status(400).json({
          status: 'error',
          message: 'Full name is required'
        });
      }
      
      // Update the profile
      const result = await profileModel.updateProfile(userId, profileData);
      
      return res.status(200).json({
        status: 'success',
        data: result.data
      });
    } catch (error) {
      console.error('Error in updateProfile controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update profile',
        error: error.message
      });
    }
  },
  
  // Get a user's profile
  async getProfile(req, res) {
    try {
      // Get the user ID from the authenticated request
      const userId = req.user.uid;
      
      // Get the profile from the model
      const result = await profileModel.getProfile(userId);
      
      if (!result.success) {
        return res.status(404).json({
          status: 'error',
          message: result.message
        });
      }
      
      return res.status(200).json({
        status: 'success',
        data: result.data
      });
    } catch (error) {
      console.error('Error in getProfile controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve profile',
        error: error.message
      });
    }
  },
  
  // Get a specific user's profile by ID (admin only)
  async getProfileById(req, res) {
    try {
      // First verify if the requesting user is an admin
      const currentUser = req.user;
      const userRecord = await auth.getUser(currentUser.uid);
      
      // Check if user record has admin claim
      // This assumes you've set custom claims for admin users
      const isAdmin = userRecord.customClaims && userRecord.customClaims.admin;
      
      if (!isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized. Only admins can access other user profiles'
        });
      }
      
      // Get the user ID from the request parameters
      const { userId } = req.params;
      
      // Get the profile from the model
      const result = await profileModel.getProfile(userId);
      
      if (!result.success) {
        return res.status(404).json({
          status: 'error',
          message: result.message
        });
      }
      
      return res.status(200).json({
        status: 'success',
        data: result.data
      });
    } catch (error) {
      console.error('Error in getProfileById controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve profile',
        error: error.message
      });
    }
  },
  
  // Delete a user's resume
  async deleteResume(req, res) {
    try {
      // Get the user ID from the authenticated request
      const userId = req.user.uid;
      
      // Delete the resume
      const result = await profileModel.deleteResume(userId);
      
      if (!result.success) {
        return res.status(404).json({
          status: 'error',
          message: result.message
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      console.error('Error in deleteResume controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete resume',
        error: error.message
      });
    }
  }
};