import { auth } from '../../config/database.js';

// Verify Firebase authentication token
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a valid token.'
      });
    }
    
    // Extract the token
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a valid token.'
      });
    }
    
    // Verify the token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Add the user info to the request object
    req.user = decodedToken;
    
    next();
  } catch (error) {
    // Handle specific Firebase auth errors
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please sign in again.'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has been revoked. Please sign in again.'
      });
    }
    
    // Generic auth error
    return res.status(401).json({
      status: 'error',
      message: 'Invalid authentication token. Please sign in again.'
    });
  }
};