import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { 
  signInWithGoogle, 
  loginWithEmailPassword, 
  registerWithEmailPassword, 
  logoutUser,
  getIdToken,
  auth
} from '@/config/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Define types for our auth store
interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  authInitialized: boolean // Track if Firebase auth has initialized
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>
  googleLogin: () => Promise<void>
  signup: (email: string, password: string, confirmPassword: string, displayName?: string) => Promise<void>
  logout: () => void
  clearError: () => void
  refreshToken: () => Promise<string | null>
  initAuth: () => void
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      authInitialized: false, // Initialize as false
      
      // Initialize auth state by checking Firebase
      initAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in, update token
            try {
              const idToken = await firebaseUser.getIdToken(true);
              set({ 
                token: idToken,
                isAuthenticated: true,
                authInitialized: true // Mark as initialized
              });
            } catch (error) {
              console.error('Error refreshing token during init:', error);
              set({ authInitialized: true }); // Still mark as initialized despite error
            }
          } else if (get().isAuthenticated) {
            // Firebase says not authenticated, but store thinks we are
            // This is a mismatch, so reset the auth state
            set({ 
              user: null,
              token: null,
              isAuthenticated: false,
              error: 'Session expired. Please sign in again.',
              authInitialized: true // Mark as initialized
            });
            toast.error('Session expired. Please sign in again.');
          } else {
            // User is not authenticated, which matches our store state
            set({ authInitialized: true }); // Mark as initialized
          }
        });
        
        // Return unsubscribe function
        return unsubscribe;
      },
      
      // Login with email and password
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          // First authenticate with Firebase
          const authResult = await loginWithEmailPassword(email, password)
          
          // Then send the token to our backend to get user data
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email, 
              password,
              idToken: authResult.idToken
            }),
          })
          
          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.message || 'Login failed')
          }
          
          // Extract additional fields from backend response
          const backendUserData = data.data.user || {}
          
          set({ 
            user: {
              id: authResult.user.uid,
              name: authResult.user.displayName || backendUserData.displayName || email.split('@')[0],
              email: authResult.user.email || email,
              avatarUrl: authResult.user.photoURL || backendUserData.photoURL || undefined
            },
            token: data.data?.token || authResult.idToken,
            isAuthenticated: true,
            isLoading: false 
          })
          
          toast.success('Login successful!')
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
        }
      },
      
      // Google login
      googleLogin: async () => {
        try {
          set({ isLoading: true, error: null })
          
          // Authenticate with Google using Firebase
          const authResult = await signInWithGoogle()
          
          // Try to send the token to our backend
          try {
            const response = await fetch('/api/auth/google', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken: authResult.idToken }),
            })
            
            if (response.ok) {
              const data = await response.json()
              
              // Backend integration succeeded
              set({ 
                user: {
                  id: data.data.user.uid || authResult.user.uid,
                  name: data.data.user.displayName || authResult.user.displayName || 'User',
                  email: data.data.user.email || authResult.user.email || 'anonymous@example.com',
                  // Ensure we're getting the photoURL from the correct location
                  avatarUrl: data.data.user.photoURL || authResult.user.photoURL || undefined
                },
                token: data.data.token || authResult.idToken,
                isAuthenticated: true,
                isLoading: false 
              })
              
              toast.success('Google login successful!')
              return
            }
          } catch (e) {
            // We'll continue with client-side auth only
          }
          
          // If we reached here, the backend integration failed, but we still have Firebase auth
          // We can proceed with client-side-only authentication
          set({ 
            user: {
              id: authResult.user.uid,
              name: authResult.user.displayName || authResult.user.email?.split('@')[0] || 'User',
              email: authResult.user.email || 'anonymous@example.com',
              // Explicitly set the photoURL from the Firebase user object
              avatarUrl: authResult.user.photoURL || undefined
            },
            token: authResult.idToken,
            isAuthenticated: true,
            isLoading: false 
          })
          
          toast.success('Google login successful! (Client-side only)')
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Google login failed'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
        }
      },
      
      // Sign up
      signup: async (email: string, password: string, confirmPassword: string, displayName?: string) => {
        try {
          // Check if passwords match
          if (password !== confirmPassword) {
            throw new Error('Passwords do not match')
          }
          
          set({ isLoading: true, error: null })
          
          // First, try to register with Firebase
          let authResult: any = null
          let firebaseError: any = null
          
          try {
            // Try to register with Firebase
            authResult = await registerWithEmailPassword(email, password)
          } catch (error: any) {
            // Save the Firebase error but don't throw yet - our backend might handle it
            firebaseError = error
          }
          
          // Prepare the user data to send to backend
          const userData = {
            email,
            displayName: displayName || email.split('@')[0],
            emailVerified: false,
            authProvider: 'email',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            role: 'user',
            isActive: true
          }
          
          // Always try to send registration to backend, even if Firebase failed
          // Our backend will handle existing users properly
          try {
            const response = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email, 
                password,
                displayName: displayName || email.split('@')[0],
                idToken: authResult?.idToken || null,
                userData // Send user data directly in the request body
              }),
            })
            
            const data = await response.json()
            
            if (response.ok) {
              set({ 
                user: {
                  id: data.data.user.uid,
                  name: data.data.user.displayName || displayName || email.split('@')[0],
                  email: data.data.user.email || email,
                  avatarUrl: data.data.user.photoURL || undefined
                },
                token: data.data.token,
                isAuthenticated: true,
                isLoading: false 
              })
              
              toast.success('Account created successfully!')
              return
            } else {
              // If backend fails, throw the error
              throw new Error(data.message || 'Signup failed')
            }
          } catch (e) {
            // If backend failed and we already had a Firebase error, throw the Firebase error
            if (firebaseError) {
              throw firebaseError
            }
            
            // Otherwise throw the backend error
            throw e
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
        }
      },
      
      // Logout
      logout: async () => {
        try {
          await logoutUser()
          set({ 
            user: null,
            token: null,
            isAuthenticated: false,
            error: null 
          })
          toast.success('Successfully logged out')
        } catch (error) {
          toast.error('Error logging out')
          console.error(error)
        }
      },
      
      // Clear error
      clearError: () => set({ error: null }),

      // New function to refresh the token
      refreshToken: async () => {
        try {
          // Only try to refresh if auth is initialized and we're authenticated
          if (!get().authInitialized) {
            console.log('Auth not yet initialized, waiting...');
            return get().token;
          }
          
          if (!get().isAuthenticated) {
            return null;
          }

          // Get a fresh token from Firebase
          const freshToken = await getIdToken();
          
          if (freshToken) {
            // Update the token in the store
            set({ token: freshToken });
            return freshToken;
          } else {
            // If Firebase reports no current user, but our store thinks we're authenticated,
            // this is likely because the Firebase session expired
            if (auth.currentUser === null) {
              // Reset auth state
              set({ 
                isAuthenticated: false,
                token: null,
                error: 'Session expired. Please sign in again.'
              });
              toast.error('Session expired. Please sign in again.');
              return null;
            }
          }
          
          return get().token;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          return get().token;
        }
      }
    }),
    {
      name: 'jobsprout-auth-storage', // name for the localStorage key
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Updated utility for using auth token in requests
export const getAuthHeader = async () => {
  const { authInitialized } = useAuthStore.getState();
  
  // Wait for auth to initialize (with timeout to prevent infinite waiting)
  if (!authInitialized) {
    console.log('Auth not initialized, waiting before making API request...');
    // Simple wait to see if auth initializes within a short time
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Try to refresh the token
  const token = await useAuthStore.getState().refreshToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}