import { create } from 'zustand';
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
  searchJobs: () => Promise<void>;
  applyToJob: (jobData: Job) => Promise<void>;
  getApplications: () => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: JobApplication['status']) => Promise<void>;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  applications: [],
  isLoading: false,
  error: null,

  searchJobs: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const headers = await getAuthHeader();
      
      if (!headers.Authorization) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/jobs/search', {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to search jobs');
      }

      const data = await response.json();
      set({ jobs: data.data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search jobs';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
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

      const data = await response.json();
      
      // Update applications list
      await get().getApplications();
      
      set({ isLoading: false });
      toast.success('Successfully applied to job');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply to job';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  getApplications: async () => {
    try {
      set({ isLoading: true, error: null });
      
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
      set({ applications: data.data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get applications';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update application status';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  }
}));