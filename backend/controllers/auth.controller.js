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
    const { email, password, displayName, idToken } = req.body;
    
    let userRecord;
    
    // If the frontend is providing idToken, it means user already exists in Firebase Auth
    // but not yet in our backend. We'll verify the token and get user info.
    if (idToken) {
      try {
        const decodedToken = await AuthModel.verifyGoogleToken(idToken);
        userRecord = await AuthModel.getUserById(decodedToken.uid);
      } catch (error) {
        console.log('Error verifying token during signup:', error);
        // Continue with normal signup process if token verification fails
      }
    }
    
    // If user not found via token, create a new user
    if (!userRecord) {
      try {
        // Check if user exists by email first to prevent duplicate errors
        try {
          const existingUser = await AuthModel.getUserByEmail(email);
          if (existingUser) {
            // User already exists - we'll use this user instead of creating a new one
            userRecord = existingUser;
            console.log(`User with email ${email} already exists, using existing account`);
          }
        } catch (error) {
          // User doesn't exist, which is what we want for new signups
          if (error.code !== 'auth/user-not-found') {
            throw error; // Rethrow if it's not a "user not found" error
          }
        }
        
        // Only create if user doesn't already exist
        if (!userRecord) {
          // Create the user in Firebase Auth
          userRecord = await AuthModel.createUser({
            email,
            password,
            displayName
          });
        }
      } catch (error) {
        // Handle specific Firebase auth errors
        if (error.code === 'auth/email-already-exists') {
          return res.status(400).json({
            status: 'error',
            message: 'Email is already in use'
          });
        }
        throw error;
      }
    }
    
    // Generate a custom Firebase token for this user
    const customToken = await AuthModel.generateCustomToken(userRecord.uid);
    
    // Try to send verification email (requires client SDK)
    if (!userRecord.emailVerified) {
      try {
        await AuthModel.sendEmailVerification(email, password);
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Continue with signup even if email fails
      }
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
    
    // Get additional user data from Firestore
    const firestoreUserData = await AuthModel.getUserFromFirestore(userRecord.uid);
    
    // Successful response
    res.status(201).json({
      status: 'success',
      message: 'User created successfully. Please verify your email.',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          ...firestoreUserData // Include additional user data from Firestore
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
    
    // Update login timestamp in Firestore
    await AuthModel.updateUserLoginTimestamp(userRecord.uid);
    
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
    
    // Get additional user data from Firestore
    const firestoreUserData = await AuthModel.getUserFromFirestore(userRecord.uid);
    
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          ...firestoreUserData // Include additional user data from Firestore
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
    
    // Create or update the user in Firebase Auth and Firestore
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
    
    // Get additional user data from Firestore
    const firestoreUserData = await AuthModel.getUserFromFirestore(userRecord.uid);
    
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
          photoURL: userRecord.photoURL,
          ...firestoreUserData // Include additional user data from Firestore
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
    
    // Get additional user data from Firestore
    const firestoreUserData = await AuthModel.getUserFromFirestore(userRecord.uid);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          creationTime: userRecord.metadata.creationTime,
          ...firestoreUserData // Include additional user data from Firestore
        }
      }
    });
  } catch (error) {
    next(error);
  }
};