import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { db, firebaseApp } from './config/database.js';
import { securityMiddleware, errorHandler } from './middleware/security/index.js';

// Import routes
import authRoutes from './routes/auth.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global middleware
app.use(express.json({ limit: '10kb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // In production, specify your frontend domain
  credentials: true // Allow cookies
}));

// Logging middleware in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Apply all security middleware
app.use(securityMiddleware);

// API Routes
app.use('/api/v1/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('JobSprout API is running!');
});

// 404 handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server!`
  });
});

// Global error handling middleware
app.use(errorHandler);

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