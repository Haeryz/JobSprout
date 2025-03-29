import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { db, firebaseApp } from './config/database.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('JobSprout API is running!');
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server started at http://localhost:${PORT}`);
  
  try {
    // Test Firebase connection
    await db.collection('users').limit(1).get();
    
    console.log('Connected to Firebase:');
    console.log(`Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    console.log(`Firebase App Name: ${firebaseApp.name}`);
  } catch (error) {
    console.error('Firebase connection test error:', error.message);
    // Even if there's an error querying data, we might still be connected
    console.log('Firebase app initialized, but test query failed.');
    console.log(`Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
  }
});