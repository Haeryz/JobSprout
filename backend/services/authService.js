import { auth, db } from '../config/database.js';
import User from '../models/User.js';

/**
 * User Auth Service - Handles Firebase authentication operations and database interactions
 */
class AuthService {
  /**
   * Creates a new user in Firebase Authentication and Firestore
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {object} userData - Additional user data (name, etc.)
   * @returns {Promise<object>} - Created user data
   */
  async createUser(email, password, userData = {}) {
    try {
      // Input validation
      if (!email) throw new Error('Email is required');
      if (!this.isValidEmail(email)) throw new Error('Email is invalid');
      if (!password) throw new Error('Password is required');
      
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: userData.name || '',
        disabled: false
      });

      // Create user model instance
      const user = new User({
        id: userRecord.uid,
        email: userRecord.email,
        name: userData.name || userRecord.displayName || '',
        created_at: new Date().toISOString()
      });

      // Save to Firestore
      await db.collection('profiles').doc(user.id).set(user.toObject());

      return {
        uid: userRecord.uid,
        ...user.toObject()
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get a user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<User>} - User profile
   */
  async getUserById(userId) {
    try {
      const doc = await db.collection('profiles').doc(userId).get();
      
      if (!doc.exists) {
        throw new Error('User profile not found');
      }
      
      return new User(doc.data());
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} - User or null if not found
   */
  async getUserByEmail(email) {
    try {
      const snapshot = await db.collection('profiles')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      return new User(snapshot.docs[0].data());
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Update a user profile
   * @param {string} userId - User ID
   * @param {object} updates - Profile fields to update
   * @returns {Promise<User>} - Updated user
   */
  async updateUser(userId, updates) {
    try {
      // Prevent updating critical fields
      delete updates.id;
      delete updates.email;
      delete updates.created_at;
      
      // Update auth display name if name is being updated
      if (updates.name) {
        await auth.updateUser(userId, {
          displayName: updates.name
        });
      }
      
      // Get current user
      const userDoc = await db.collection('profiles').doc(userId).get();
      
      if (!userDoc.exists) {
        throw new Error('User profile not found');
      }
      
      // Create updated user object
      const userData = userDoc.data();
      const updatedUser = new User({
        ...userData,
        ...updates,
        updated_at: new Date().toISOString()
      });
      
      // Save to Firestore
      await db.collection('profiles').doc(userId).update(updatedUser.toObject());
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Delete a user and their profile data
   * @param {string} userId - User ID to delete
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    try {
      // Delete from Firestore first
      await db.collection('profiles').doc(userId).delete();
      
      // Delete from Firebase Auth
      await auth.deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new AuthService();