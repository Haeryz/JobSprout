import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { useAuthStore, getAuthHeader } from './useAuthStore'

// Define types for profile data
interface Profile {
  fullName: string
  email: string
  phone: string
  desiredJobTitle: string
  country: string
  experience: string
  workPreferences: string[]
  linkedinUrl: string
  currentEmployer: string
  educationLevel: string
  employmentTypePreferences: string[]
  city: string
  willingToRelocate: boolean
  howDidYouFindUs: string
  resumeUrl?: string
  resumeSignedUrl?: string
  additionalInfo: string
  
  // Demographic information
  gender: string
  hispanicLatino: string
  veteranStatus: string
  disabilityStatus: string
  workAuthorization: string
  sponsorshipRequired: string
  minimumSalary: number
  
  // Timestamps
  createdAt?: string
  updatedAt?: string
}

// Define an extended interface for request data that includes resumeFile
interface ProfileRequestData extends Partial<Profile> {
  resumeFile?: string | null
}

interface ProfileState {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  
  // Profile actions
  fetchProfile: () => Promise<void>
  updateProfile: (profileData: Partial<Profile>, resumeFile?: string | null) => Promise<void>
  deleteResume: () => Promise<void>
  clearError: () => void
}

const initialProfile: Profile = {
  fullName: '',
  email: '',
  phone: '',
  desiredJobTitle: '',
  country: '',
  experience: '',
  workPreferences: [],
  linkedinUrl: '',
  currentEmployer: '',
  educationLevel: '',
  employmentTypePreferences: [],
  city: '',
  willingToRelocate: false,
  howDidYouFindUs: '',
  additionalInfo: '',
  gender: '',
  hispanicLatino: '',
  veteranStatus: '',
  disabilityStatus: '',
  workAuthorization: '',
  sponsorshipRequired: '',
  minimumSalary: 50000
}

// Create the profile store with persistence
export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      
      // Fetch the user's profile from the API
      fetchProfile: async () => {
        try {
          set({ isLoading: true, error: null })
          
          // Get fresh auth headers with refreshed token
          const headers = await getAuthHeader();
          
          if (!headers.Authorization) {
            throw new Error('Authentication required')
          }
          
          // Fetch profile from backend API
          const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...headers
            }
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to fetch profile')
          }
          
          const data = await response.json()
          
          if (data.status === 'success') {
            set({ profile: data.data || initialProfile, isLoading: false })
          } else {
            // If profile doesn't exist yet, set to initial empty profile
            set({ profile: initialProfile, isLoading: false })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          set({ error: errorMessage, isLoading: false })
          
          // If it's a 404 (profile not found), we'll set an initial profile
          if (errorMessage.includes('not found')) {
            set({ profile: initialProfile })
          }
          
          toast.error(errorMessage)
        }
      },
      
      // Update the user's profile
      updateProfile: async (profileData, resumeFile = null) => {
        try {
          set({ isLoading: true, error: null })
          
          // Get fresh auth headers with refreshed token
          const headers = await getAuthHeader();
          
          if (!headers.Authorization) {
            throw new Error('Authentication required')
          }
          
          // Create the request data with proper typing
          const requestData: ProfileRequestData = {
            ...profileData
          }
          
          // If resumeFile is provided (as base64 string), add it to the request
          if (resumeFile) {
            requestData.resumeFile = resumeFile
          }
          
          // Send profile update to backend API
          const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers
            },
            body: JSON.stringify(requestData)
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to update profile')
          }
          
          const data = await response.json()
          
          // Update the local state with the returned profile data
          set({
            profile: {
              ...get().profile,
              ...data.data
            },
            isLoading: false
          })
          
          toast.success('Profile updated successfully')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
        }
      },
      
      // Delete the user's resume
      deleteResume: async () => {
        try {
          set({ isLoading: true, error: null })
          
          // Get fresh auth headers with refreshed token
          const headers = await getAuthHeader();
          
          if (!headers.Authorization) {
            throw new Error('Authentication required')
          }
          
          // Send delete request to backend API
          const response = await fetch('/api/profile/resume', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...headers
            }
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to delete resume')
          }
          
          const data = await response.json()
          
          // Update the profile to remove resume URL
          const currentProfile = get().profile
          if (currentProfile) {
            set({
              profile: {
                ...currentProfile,
                resumeUrl: undefined,
                resumeSignedUrl: undefined
              },
              isLoading: false
            })
          }
          
          toast.success('Resume deleted successfully')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'jobsprout-profile-storage',
      partialize: (state) => ({
        profile: state.profile
      }),
    }
  )
)