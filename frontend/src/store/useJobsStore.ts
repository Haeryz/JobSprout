import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { getAuthHeader } from './useAuthStore';

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_city?: string;
  job_country: string;
  job_employment_type: string;
  job_description: string;
  job_google_link: string;
  job_apply_link?: string;
  job_location?: string;
  job_posted_at?: string;
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  employerLogo: string | null;
  jobLocation: string;
  employmentType: string;
  jobDescription: string;
  jobUrl: string;
  status: 'applied' | 'interviewing' | 'rejected' | 'accepted';
  appliedAt: string;
  updatedAt: string;
}

interface JobsState {
  jobs: Job[];
  applications: JobApplication[];
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  cacheTTL: number;
  searchJobs: () => Promise<void>;
  applyToJob: (jobData: Job) => Promise<void>;
  getApplications: () => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: JobApplication['status']) => Promise<void>;
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: [],
      applications: [],
      isLoading: false,
      error: null,
      lastFetchTime: null,
      cacheTTL: 10 * 60 * 1000, // 10 minutes in milliseconds

      searchJobs: async () => {
        try {
          const now = Date.now();
          const lastFetch = get().lastFetchTime;
          const cacheTTL = get().cacheTTL;
          
          // Use client-side cache if available and not expired
          if (lastFetch && now - lastFetch < cacheTTL && get().jobs.length > 0) {
            console.log('Using client-side cached jobs data');
            return Promise.resolve();
          }
          
          // Clear any previous jobs and set loading state
          set({ isLoading: true, error: null });
          
          const headers = await getAuthHeader();
          
          if (!headers.Authorization) {
            throw new Error('Authentication required');
          }

          // Set up timeout for the fetch request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          try {
            const response = await fetch('/api/jobs/search', {
              headers: {
                'Content-Type': 'application/json',
                ...headers
              },
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to search jobs');
            }

            const data = await response.json();
            
            // Set the jobs data, turn off loading state, and update lastFetchTime
            set({ 
              jobs: data.data, 
              isLoading: false,
              lastFetchTime: Date.now()
            });
            
            return Promise.resolve();
          } catch (fetchError) {
            clearTimeout(timeoutId);
            throw fetchError;
          }
        } catch (error) {
          // If we have cached jobs data, keep using it when an error occurs
          if (get().jobs.length > 0) {
            set({ 
              isLoading: false,
              error: 'Failed to refresh job data. Showing cached results.'
            });
            toast.error('Unable to refresh jobs. Showing cached results.');
            return Promise.resolve();
          }
          
          const errorMessage = error instanceof Error ? error.message : 'Failed to search jobs';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return Promise.reject(error);
        }
      },

      applyToJob: async (jobData) => {
        try {
          set({ isLoading: true, error: null });
          
          const headers = await getAuthHeader();
          
          if (!headers.Authorization) {
            throw new Error('Authentication required');
          }

          const response = await fetch('/api/jobs/applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers
            },
            body: JSON.stringify(jobData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to apply to job');
          }

          await response.json();
          
          // Update applications list
          await get().getApplications();
          
          set({ isLoading: false });
          toast.success('Successfully applied to job');
          return Promise.resolve();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to apply to job';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return Promise.reject(error);
        }
      },

      getApplications: async () => {
        try {
          // Clear previous applications and set loading state
          set({ isLoading: true, error: null, applications: [] });
          
          const headers = await getAuthHeader();
          
          if (!headers.Authorization) {
            throw new Error('Authentication required');
          }

          const response = await fetch('/api/jobs/applications', {
            headers: {
              'Content-Type': 'application/json',
              ...headers
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get applications');
          }

          const data = await response.json();
          
          // Set the applications data and turn off loading state
          set({ applications: data.data, isLoading: false });
          return Promise.resolve();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get applications';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return Promise.reject(error);
        }
      },

      updateApplicationStatus: async (applicationId, status) => {
        try {
          set({ isLoading: true, error: null });
          
          const headers = await getAuthHeader();
          
          if (!headers.Authorization) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`/api/jobs/applications/${applicationId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...headers
            },
            body: JSON.stringify({ status })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update application status');
          }

          // Update applications list
          await get().getApplications();
          
          set({ isLoading: false });
          toast.success('Application status updated');
          return Promise.resolve();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update application status';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return Promise.reject(error);
        }
      }
    }),
    {
      name: 'jobs-storage', // Name for localStorage
      partialize: (state) => ({ 
        jobs: state.jobs,
        lastFetchTime: state.lastFetchTime
      })
    }
  )
);