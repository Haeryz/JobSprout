import authService from '../services/authService.js';

/**
 * Auth Controller - Handles HTTP requests related to authentication
 */
class AuthController {
  /**
   * Register a new user
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and password are required' 
        });
      }
      
      const userData = await authService.createUser(email, password, { name });
      
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: userData.uid,
            email: userData.email,
            name: userData.name
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already in use' 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Registration failed', 
        error: error.message 
      });
    }
  }

  /**
   * Get user profile
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.uid; // Populated by authMiddleware
      
      const user = await authService.getUserById(userId);
      
      res.status(200).json({
        success: true,
        data: { profile: user.toObject() }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        success: false,

        message: 'Failed to fetch profile', 
        error: error.message 
      });
    }
  }

  /**
   * Update user profile
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.uid; // Populated by authMiddleware
      const updates = req.body;
      
      // Service will handle sanitizing the updates
      const updatedUser = await authService.updateUser(userId, updates);
      
      res.status(200).json({
        success: true,
        data: { profile: updatedUser.toObject() }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update profile', 
        error: error.message 
      });
    }
  }

  /**
   * Delete user account
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async deleteAccount(req, res) {
    try {
      const userId = req.user.uid; // Populated by authMiddleware
      
      await authService.deleteUser(userId);
      
      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete account', 
        error: error.message 
      });
    }
  }
}

export default new AuthController();