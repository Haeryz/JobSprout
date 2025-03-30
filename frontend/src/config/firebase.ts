// Import the required Firebase services
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy2CBBCGT-S-xfz3IGOWSZbwJP1MTYSto",
  authDomain: "jobsprout-c217b.firebaseapp.com",
  projectId: "jobsprout-c217b",
  storageBucket: "jobsprout-c217b.firebasestorage.app",
  messagingSenderId: "735593721229",
  appId: "1:735593721229:web:a9a56c2ea5e7bf38f0e1c4",
  measurementId: "G-CE3ZLHZBGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth = getAuth(app);

// Google Auth Provider with additional scopes for profile info
const googleProvider = new GoogleAuthProvider();
// Add scopes to request additional permission for profile data
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.setCustomParameters({
  prompt: 'select_account', // Force account selection every time
  access_type: 'offline'    // Get refresh token
});

// Get a fresh ID token from the current user
export const getIdToken = async (forceRefresh = true) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('No user is signed in');
      return null;
    }
    
    // Force refresh ensures we get a fresh token
    return await currentUser.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Error getting fresh ID token:', error);
    return null;
  }
};

// Firebase auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get full profile information including profile picture
    const user = result.user;
    
    return {
      user,
      idToken: await user.getIdToken()
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: result.user,
      idToken: await result.user.getIdToken()
    };
  } catch (error) {
    console.error('Error signing in with email/password:', error);
    throw error;
  }
};

export const registerWithEmailPassword = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return {
      user: result.user,
      idToken: await result.user.getIdToken()
    };
  } catch (error) {
    console.error('Error creating user with email/password:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export { auth };