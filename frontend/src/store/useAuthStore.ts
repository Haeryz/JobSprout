import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { 
  signInWithGoogle, 
  loginWithEmailPassword, 
  registerWithEmailPassword, 
  logoutUser 
} from '@/config/firebase'

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
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>
  googleLogin: () => Promise<void>
  signup: (email: string, password: string, confirmPassword: string, displayName?: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
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
          
          set({ 
            user: {
              id: authResult.user.uid,
              name: authResult.user.displayName || email.split('@')[0],
              email: authResult.user.email || email,
              avatarUrl: authResult.user.photoURL || undefined
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
          
          // Log the Firebase user object to see what we're getting
          console.log('Google auth result:', authResult.user)
          
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
              // Log the backend response to see what we're getting
              console.log('Backend response:', data)
              
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
            console.log('Backend integration failed, using Firebase client auth only', e)
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
          
          // Register with Firebase
          const authResult = await registerWithEmailPassword(email, password)
          
          // Try to send registration data to backend
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
                idToken: authResult.idToken
              }),
            })
            
            if (response.ok) {
              const data = await response.json()
              
              set({ 
                user: {
                  id: authResult.user.uid,
                  name: displayName || email.split('@')[0],
                  email: email,
                  avatarUrl: authResult.user.photoURL || undefined
                },
                token: data.data?.token || authResult.idToken,
                isAuthenticated: true,
                isLoading: false 
              })
              
              toast.success('Account created successfully!')
              return
            }
          } catch (e) {
            console.log('Backend integration failed, using Firebase client auth only', e)
            // We'll continue with client-side auth only
          }
          
          // If backend integration failed, still log them in client-side
          set({ 
            user: {
              id: authResult.user.uid,
              name: displayName || email.split('@')[0],
              email: email,
              avatarUrl: authResult.user.photoURL || undefined
            },
            token: authResult.idToken,
            isAuthenticated: true,
            isLoading: false 
          })
          
          toast.success('Account created successfully! (Client-side only)')
          
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

// Utility for using auth token in requests
export const getAuthHeader = () => {
  const token = useAuthStore.getState().token
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}