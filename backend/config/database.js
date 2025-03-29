import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check for required Firebase credentials
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('FIREBASE_PROJECT_ID must be provided in .env file');
}

// Initialize Firebase Admin SDK
// There are two ways to initialize:
// 1. Using a service account JSON file (more secure for production)
// 2. Using environment variables (easier for development)

let firebaseConfig;

// Option 1: Using service account file if GOOGLE_APPLICATION_CREDENTIALS is set
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // The SDK will automatically use the GOOGLE_APPLICATION_CREDENTIALS env variable
  firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID
  };
} 
// Option 2: Using environment variables
else if (process.env.FIREBASE_PRIVATE_KEY) {
  firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  };
} else {
  throw new Error('Firebase credentials not properly configured. Set either GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_PRIVATE_KEY in your .env file');
}

// Initialize the app
const firebaseApp = admin.initializeApp({
  credential: process.env.GOOGLE_APPLICATION_CREDENTIALS 
    ? admin.credential.applicationDefault()
    : admin.credential.cert(firebaseConfig)
});

// Get Firestore database instance
const db = admin.firestore();

// Get Authentication instance
const auth = admin.auth();

export { 
  admin, 
  db, 
  auth, 
  firebaseApp 
};