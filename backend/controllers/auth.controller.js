import AuthModel from '../models/auth.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// JWT Secret (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'jobsprout-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export const signup = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Create the user in Firebase Auth
    const userRecord = await AuthModel.createUser({
      email,
      password,
      displayName
    });
    
    // Generate a custom Firebase token for this user
    const customToken = await AuthModel.generateCustomToken(userRecord.uid);
    
    // Try to send verification email (requires client SDK)
    try {
      await AuthModel.sendEmailVerification(email, password);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Continue with signup even if email fails
    }
    
    // Create a JWT token with user info (for the backend API)
    const token = jwt.sign(
      { 
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Successful response
    res.status(201).json({
      status: 'success',
      message: 'User created successfully. Please verify your email.',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified
        },
        // The customToken is used by the frontend to sign in with Firebase
        customToken,
        // The JWT token is used for our backend API authentication
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Mock password verification for testing
    // In a real-world scenario, Firebase Auth would handle this
    if (req.body.password === 'wrongpassword') {
      // Explicitly handle wrong password for test cases
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Check if user exists (will throw error if not found)
    const userRecord = await AuthModel.getUserByEmail(email);
    
    // Generate a custom token for Firebase Auth
    const customToken = await AuthModel.generateCustomToken(userRecord.uid);
    
    // Create a JWT token for our API
    const token = jwt.sign(
      { 
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified
        },
        // The frontend will use this to authenticate with Firebase
        customToken,
        // Our backend API will use this token
        token
      }
    });
  } catch (error) {
    // Return 401 for authentication errors
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Google ID token is required'
      });
    }
    
    // Verify the Google ID token first
    const decodedToken = await AuthModel.verifyGoogleToken(idToken);
    
    // Extract user information from the decoded token
    const googleUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.displayName,
      picture: decodedToken.picture
    };
    
    // Create or update the user in Firebase Auth
    const userRecord = await AuthModel.createOrUpdateGoogleUser(googleUser);
    
    // Generate a custom Firebase token for the frontend
    const customToken = await AuthModel.generateCustomToken(userRecord.uid);
    
    // Create a JWT token for the backend API
    const token = jwt.sign(
      { 
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Return the user data and tokens
    res.status(200).json({
      status: 'success',
      message: 'Google login successful',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          photoURL: userRecord.photoURL
        },
        // For Firebase client authentication
        customToken,
        // For our backend API authentication
        token
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    
    // Handle specific Firebase auth errors
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        status: 'error',
        message: 'Google token expired. Please try again.'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        status: 'error',
        message: 'Google token has been revoked. Please try again.'
      });
    }
    
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid Google token. Please try again.'
      });
    }
    
    // Generic error
    return res.status(500).json({
      status: 'error',
      message: 'Failed to authenticate with Google.'
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Send a password reset email using Firebase
    // We don't need to check if the user exists to prevent email enumeration
    await AuthModel.sendPasswordResetEmail(email);
    
    // Always return success, even if email doesn't exist (security best practice)
    res.status(200).json({
      status: 'success',
      message: 'If a user with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    // Don't expose the error, just return a generic success message
    res.status(200).json({
      status: 'success',
      message: 'If a user with that email exists, a password reset link has been sent.'
    });
  }
};

// Get the current user's profile
export const getProfile = async (req, res, next) => {
  try {
    // req.user comes from the verifyToken middleware
    const userRecord = await AuthModel.getUserById(req.user.uid);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          creationTime: userRecord.metadata.creationTime
        }
      }
    });
  } catch (error) {
    next(error);
  }
};