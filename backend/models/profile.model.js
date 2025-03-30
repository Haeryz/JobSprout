import { db, admin } from '../config/database.js';
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Load environment variables
dotenv.config();

// Configure Azure Blob Storage client
const azureStorageAccount = process.env.AZURE_STORAGE_ACCOUNT;
const azureStorageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER || 'resumes';

// Create the BlobServiceClient object with connection string
const sharedKeyCredential = new StorageSharedKeyCredential(azureStorageAccount, azureStorageAccessKey);
const blobServiceClient = new BlobServiceClient(
  `https://${azureStorageAccount}.blob.core.windows.net`,
  sharedKeyCredential
);

export default {
  // Create or update a user profile
  async updateProfile(userId, profileData) {
    try {
      // Get a reference to the user's profile document
      const profileRef = db.collection('profiles').doc(userId);
      
      // Create timestamp for tracking changes
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      
      // Extract resume file data if it exists (base64 string)
      const { resumeFile, ...dataToStore } = profileData;
      
      // Add timestamps
      dataToStore.updatedAt = timestamp;
      
      // Check if profile already exists to determine if this is a create or update
      const doc = await profileRef.get();
      
      if (!doc.exists) {
        // If it's a new profile, add createdAt timestamp
        dataToStore.createdAt = timestamp;
      }
      
      // Store the profile data in Firestore
      await profileRef.set(dataToStore, { merge: true });
      
      // If resume file is provided, handle it separately
      if (resumeFile) {
        // Check if the user already has a resume and delete it first
        if (doc.exists && doc.data().resumeUrl) {
          try {
            // Extract blob info from the existing URL
            const oldResumeUrl = doc.data().resumeUrl;
            const blobUrlParts = new URL(oldResumeUrl);
            const pathParts = blobUrlParts.pathname.split('/');
            
            // First part is empty, second is container name, rest is the blob path
            const oldContainerName = pathParts[1];
            const oldBlobName = pathParts.slice(2).join('/');
            
            // Get a reference to the old blob and delete it
            const containerClient = blobServiceClient.getContainerClient(oldContainerName);
            const oldBlockBlobClient = containerClient.getBlockBlobClient(oldBlobName);
            
            console.log(`Deleting old resume file: ${oldBlobName}`);
            await oldBlockBlobClient.delete();
            console.log(`Successfully deleted old resume file: ${oldBlobName}`);
          } catch (deleteError) {
            // Log but don't fail the entire operation if deletion fails
            console.error(`Error deleting previous resume: ${deleteError.message}`);
          }
        }
        
        // Upload the new resume file
        const resumeUrl = await this.uploadResume(userId, resumeFile);
        
        // Update the profile with the resume URL
        await profileRef.update({
          resumeUrl,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Add resume URL to the returned data
        dataToStore.resumeUrl = resumeUrl;
      }
      
      return {
        success: true,
        data: dataToStore
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  // Upload resume to Azure Blob Storage
  async uploadResume(userId, resumeData) {
    try {
      // Parse the base64 data and file info
      const [fileInfo, base64Data] = resumeData.split(',');
      const fileExtension = fileInfo.match(/data:application\/([a-zA-Z0-9]+);/)[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Generate a unique filename with userId to maintain association
      const fileName = `${userId}_${uuidv4()}.${fileExtension === 'pdf' ? 'pdf' : 'docx'}`;
      
      // Get a container client
      const containerClient = blobServiceClient.getContainerClient(containerName);
      
      // Create the container if it doesn't exist - without setting access level
      try {
        // Don't set any access level - respect the storage account's configuration
        await containerClient.createIfNotExists();
      } catch (error) {
        console.warn('Container exists or error creating container:', error.message);
      }
      
      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      
      // Upload data to the blob
      await blockBlobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: {
          blobContentType: `application/${fileExtension}`,
          blobContentDisposition: `attachment; filename="${fileName}"`
        }
      });
      
      // Return the URL to the blob
      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading resume to Azure Blob Storage:', error);
      throw error;
    }
  },
  
  // Get the profile for a user
  async getProfile(userId) {
    try {
      const doc = await db.collection('profiles').doc(userId).get();
      
      if (!doc.exists) {
        return { 
          success: false, 
          message: 'Profile not found'
        };
      }
      
      const profile = doc.data();
      
      // If profile has resumeUrl, generate a signed URL for temporary access
      if (profile.resumeUrl) {
        const signedUrl = await this.getSignedResumeUrl(profile.resumeUrl);
        profile.resumeSignedUrl = signedUrl;
      }
      
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
  
  // Generate a signed URL for temporary access to the resume
  async getSignedResumeUrl(resumeUrl) {
    try {
      // Extract container and blob name from the URL
      const blobUrlParts = new URL(resumeUrl);
      const pathParts = blobUrlParts.pathname.split('/');
      
      // First part is empty, second is container name, rest is the blob path
      const containerName = pathParts[1];
      const blobName = pathParts.slice(2).join('/');
      
      // Get a reference to the blob
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobClient = containerClient.getBlobClient(blobName);
      
      // Create SAS token that's valid for 15 minutes
      const sasOptions = {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // Read permission
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // 15 minutes
      };
      
      const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        sharedKeyCredential
      ).toString();
      
      // Return the blob URL with the SAS token
      return `${blobClient.url}?${sasToken}`;
    } catch (error) {
      console.error('Error generating signed URL for Azure Blob:', error);
      throw error;
    }
  },
  
  // Delete a user's resume
  async deleteResume(userId) {
    try {
      // Get the user's profile to find the resume URL
      const profileRef = db.collection('profiles').doc(userId);
      const profile = await profileRef.get();
      
      if (!profile.exists || !profile.data().resumeUrl) {
        return {
          success: false,
          message: 'No resume found for this user'
        };
      }
      
      // Extract blob info from the URL
      const resumeUrl = profile.data().resumeUrl;
      const blobUrlParts = new URL(resumeUrl);
      const pathParts = blobUrlParts.pathname.split('/');
      
      // First part is empty, second is container name, rest is the blob path
      const containerName = pathParts[1];
      const blobName = pathParts.slice(2).join('/');
      
      // Get a reference to the blob and delete it
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      await blockBlobClient.delete();
      
      // Update the profile to remove the resume URL
      await profileRef.update({
        resumeUrl: admin.firestore.FieldValue.delete(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return {
        success: true,
        message: 'Resume deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting resume from Azure Blob Storage:', error);
      throw error;
    }
  }
};