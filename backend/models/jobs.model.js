import { db, admin } from '../config/database.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search';

// Cache job search results to improve performance
const jobSearchCache = {
  data: null,
  timestamp: null,
  expiryTime: 30 * 60 * 1000 // 30 minutes in milliseconds
};

// Function to trim job data to only necessary fields to reduce payload size
const trimJobData = (job) => {
  return {
    job_id: job.job_id,
    job_title: job.job_title,
    employer_name: job.employer_name,
    employer_logo: job.employer_logo,
    job_city: job.job_city,
    job_country: job.job_country,
    job_employment_type: job.job_employment_type,
    // Trim job description to 500 characters to reduce payload
    job_description: job.job_description ? job.job_description.substring(0, 500) + (job.job_description.length > 500 ? '...' : '') : '',
    job_google_link: job.job_google_link,
    job_apply_link: job.job_apply_link,
    // Include only essential fields
    job_location: job.job_location,
    job_posted_at: job.job_posted_at
  };
};

export default {
  // Search for jobs using JSearch API
  async searchJobs(query = 'marketing', location = '') {
    try {
      // Check if we have valid cached data
      const now = Date.now();
      if (jobSearchCache.data && jobSearchCache.timestamp && 
          now - jobSearchCache.timestamp < jobSearchCache.expiryTime) {
        console.log('Returning cached job data');
        return {
          success: true,
          data: jobSearchCache.data,
          cached: true
        };
      }
      
      // For development, always use 'marketing' as the search query
      const searchQuery = 'marketing';
      // Reduced logging for performance
      
      console.time('API request time');
      
      // Set a longer timeout to abort hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      try {
        const response = await axios.get(JSEARCH_API_URL, {
          headers: {
            'X-RapidAPI-Key': JSEARCH_API_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
          },
          params: {
            query: searchQuery,
            page: '1',
            num_pages: '1',
            date_posted: 'month' // Get jobs posted in the last month
          },
          timeout: 5000, // Set a 5 second timeout to prevent long hanging requests
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.timeEnd('API request time');

        // Limit to 5 jobs to conserve API calls and trim the data
        const jobs = response.data.data.slice(0, 5).map(trimJobData);
        
        // Update cache
        jobSearchCache.data = jobs;
        jobSearchCache.timestamp = now;

        return {
          success: true,
          data: jobs
        };
      } catch (axiosError) {
        clearTimeout(timeoutId);
        throw axiosError;
      }
    } catch (error) {
      // Log only essential error information
      console.error('Error searching jobs:', error.message);
      
      // If we have cached data, return it even if it's expired when an error occurs
      if (jobSearchCache.data) {
        console.log('Returning stale cached data due to API error');
        return {
          success: true,
          data: jobSearchCache.data,
          cached: true,
          stale: true
        };
      }
      
      // If we don't have cached data and the API failed, return empty results instead of failing
      return {
        success: true,
        data: [],
        error: true,
        message: 'Failed to fetch jobs, please try again later'
      };
    }
  },

  // Track a job application
  async trackApplication(userId, jobData) {
    try {
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      
      // Create a unique ID for the application
      const applicationId = `${userId}_${jobData.job_id || Date.now()}`;
      
      // Store the job application in Firestore
      await db.collection('job_applications').doc(applicationId).set({
        userId,
        jobId: jobData.job_id,
        jobTitle: jobData.job_title,
        companyName: jobData.employer_name,
        employerLogo: jobData.employer_logo,
        jobLocation: jobData.job_city || jobData.job_country,
        employmentType: jobData.job_employment_type,
        jobDescription: jobData.job_description,
        jobUrl: jobData.job_apply_link || jobData.job_google_link,
        status: 'applied',
        appliedAt: timestamp,
        updatedAt: timestamp
      });

      return {
        success: true,
        data: {
          applicationId,
          status: 'applied',
          appliedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error tracking job application:', error.message);
      throw error;
    }
  },

  // Get user's job applications
  async getUserApplications(userId) {
    try {
      // Temporarily remove the orderBy clause until the index is created
      const snapshot = await db.collection('job_applications')
        .where('userId', '==', userId)
        .get();

      const applications = [];
      snapshot.forEach(doc => {
        applications.push({
          id: doc.id,
          ...doc.data(),
          appliedAt: doc.data().appliedAt?.toDate().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate().toISOString()
        });
      });

      // Sort applications by appliedAt in memory instead
      applications.sort((a, b) => {
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      });

      return {
        success: true,
        data: applications
      };
    } catch (error) {
      console.error('Error getting user applications:', error.message);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(applicationId, status) {
    try {
      await db.collection('job_applications').doc(applicationId).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        success: true,
        data: { status }
      };
    } catch (error) {
      console.error('Error updating application status:', error.message);
      throw error;
    }
  }
};