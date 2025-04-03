import { db, admin } from '../config/database.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search';

export default {
  // Search for jobs using JSearch API
  async searchJobs(query = 'marketing', location = '') {
    try {
      // For development, always use 'marketing' as the search query
      const searchQuery = 'marketing';
      console.log('Development mode: Using fixed search query:', searchQuery);
      
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
        }
      });

      console.log('Raw API response:', JSON.stringify(response.data, null, 2));

      // Limit to 5 jobs to conserve API calls
      const jobs = response.data.data.slice(0, 5);
      
      console.log('Processed jobs data:', JSON.stringify(jobs, null, 2));

      return {
        success: true,
        data: jobs
      };
    } catch (error) {
      console.error('Error searching jobs:', error.response ? error.response.data : error.message);
      throw error;
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
      console.error('Error tracking job application:', error);
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

      console.log('Retrieved applications:', JSON.stringify(applications, null, 2));

      return {
        success: true,
        data: applications
      };
    } catch (error) {
      console.error('Error getting user applications:', error);
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
      console.error('Error updating application status:', error);
      throw error;
    }
  }
};