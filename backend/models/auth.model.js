import { auth, db } from '../config/database.js';
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
      
      // Also save the user to Firestore
      await this.saveUserToFirestore(userRecord.uid, {
        email: userRecord.email,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        emailVerified: userRecord.emailVerified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add any additional fields you want to store for users
        role: 'user',
        isActive: true
      });
      
      return userRecord;
    } catch (error) {
      throw error;
    }
  },
  
  // Save user data to Firestore
  async saveUserToFirestore(uid, userData) {
    try {
      // Create a user document with the same ID as the Auth UID
      await db.collection('users').doc(uid).set(userData, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
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
  
  // Verify Google ID token and get the user info
  async verifyGoogleToken(idToken) {
    try {
      // Verify the ID token using Firebase Admin SDK
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw error;
    }
  },
  
  // Create or update a user with Google provider data
  async createOrUpdateGoogleUser(googleUser) {
    try {
      const { uid, email, name, picture } = googleUser;
      
      try {
        // Try to get the existing user
        const userRecord = await auth.getUser(uid);
        
        // Update user in Firestore (even if they exist, keep their data updated)
        await this.saveUserToFirestore(uid, {
          email: email,
          displayName: name,
          photoURL: picture,
          emailVerified: true,
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authProvider: 'google'
        });
        
        // User exists, update if needed and return
        return userRecord;
      } catch (error) {
        // User doesn't exist, create a new one
        if (error.code === 'auth/user-not-found') {
          const userRecord = await auth.createUser({
            uid,
            email,
            displayName: name,
            photoURL: picture,
            emailVerified: true // Google emails are verified
          });
          
          // Save the new user to Firestore
          await this.saveUserToFirestore(uid, {
            email: email,
            displayName: name,
            photoURL: picture,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            authProvider: 'google',
            role: 'user',
            isActive: true
          });
          
          return userRecord;
        }
        
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Update user login timestamp
  async updateUserLoginTimestamp(uid) {
    try {
      await db.collection('users').doc(uid).update({
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user login timestamp:', error);
      // Don't throw error here, as it's not critical to the login process
      return { success: false, error };
    }
  },
  
  // Get user data from Firestore
  async getUserFromFirestore(uid) {
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        console.warn(`User document not found in Firestore for uid: ${uid}. Creating one now.`);
        // Create a basic user document if it doesn't exist yet
        const basicUserData = {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: 'user',
          isActive: true
        };
        await this.saveUserToFirestore(uid, basicUserData);
        return basicUserData;
      }
      return userDoc.data();
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      // Return an empty object instead of throwing - this prevents auth failures if Firestore is down
      return {};
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