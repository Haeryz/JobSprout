import { auth } from '../config/database.js';
import { getAuth, sendPasswordResetEmail, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase client config (imported directly to avoid ESM issues)
const firebaseConfig = {
  apiKey: "AIzaSyBy2CBBCGT-S-xfz3IGOWSZbwJP1MTYSto",
  authDomain: "jobsprout-c217b.firebaseapp.com",
  projectId: "jobsprout-c217b",
  storageBucket: "jobsprout-c217b.firebasestorage.app",
  messagingSenderId: "735593721229",
  appId: "1:735593721229:web:a9a56c2ea5e7bf38f0e1c4",
  measurementId: "G-CE3ZLHZBGD"
};

// Initialize Firebase client SDK for email operations
const app = initializeApp(firebaseConfig);
const clientAuth = getAuth(app);

export default {
  // Create a new user in Firebase Auth
  async createUser(userData) {
    try {
      // Create user with Firebase Admin SDK
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName || null,
        emailVerified: false, // Default is false, will be verified via email
        disabled: false
      });
      
      return userRecord;
    } catch (error) {
      throw error;
    }
  },
  
  // Generate custom token for a user (used for frontend authentication)
  async generateCustomToken(uid) {
    try {
      return await auth.createCustomToken(uid);
    } catch (error) {
      throw error;
    }
  },
  
  // Send email verification
  async sendEmailVerification(email, password) {
    try {
      // This requires the Firebase client SDK and a recent login
      // We'll sign in temporarily to send the verification
      const userCredential = await signInWithEmailAndPassword(
        clientAuth, 
        email, 
        password
      );
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  
  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      // Use Firebase client SDK
      await sendPasswordResetEmail(clientAuth, email);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  
  // Get user by email
  async getUserByEmail(email) {
    try {
      return await auth.getUserByEmail(email);
    } catch (error) {
      // Don't expose whether an email exists or not
      // This prevents email enumeration attacks
      if (error.code === 'auth/user-not-found') {
        throw new Error('Invalid credentials');
      }
      throw error;
    }
  },
  
  // Get user by UID
  async getUserById(uid) {
    try {
      return await auth.getUser(uid);
    } catch (error) {
      throw error;
    }
  }
};