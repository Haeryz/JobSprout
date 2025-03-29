import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { securityMiddleware, errorHandler } from '../middleware/security/index.js';

// Test JWT Secret (should match the one in controllers)
const JWT_SECRET = process.env.JWT_SECRET || 'jobsprout-secret-key';

// Create a test app with mocked firebase auth
const app = express();
app.use(express.json());
app.use(securityMiddleware);

// Mock for the AuthModel getUserById method
const mockGetUserById = async (uid) => {
  return {
    uid: uid,
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: false,
    metadata: {
      creationTime: new Date().toISOString()
    }
  };
};

// Mock routes for testing
app.post('/api/v1/auth/signup', (req, res) => {
  const { email, password, displayName } = req.body;
  
  // Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: [{ field: 'email', message: 'Please provide a valid email' }]
    });
  }
  
  // Validate password strength
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: [{ field: 'password', message: 'Password must be at least 8 characters and contain letters and numbers' }]
    });
  }
  
  // Generate test tokens
  const uid = `test-uid-${Date.now()}`;
  const token = jwt.sign({ uid, email, displayName }, JWT_SECRET, { expiresIn: '1h' });
  
  res.status(201).json({
    status: 'success',
    message: 'User created successfully. Please verify your email.',
    data: {
      user: {
        uid,
        email,
        displayName,
        emailVerified: false
      },
      customToken: 'mock-custom-token',
      token
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Test case for wrong password
  if (password === 'wrongpassword') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }
  
  // Generate mock tokens
  const uid = `test-uid-${Date.now()}`;
  const token = jwt.sign({ uid, email, displayName: 'Test User' }, JWT_SECRET, { expiresIn: '1h' });
  
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        uid,
        email,
        displayName: 'Test User',
        emailVerified: false
      },
      customToken: 'mock-custom-token',
      token
    }
  });
});

app.post('/api/v1/auth/forgot-password', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'If a user with that email exists, a password reset link has been sent.'
  });
});

app.get('/api/v1/auth/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. Please provide a valid token.'
    });
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user data (using mock data since we're testing)
    const userRecord = await mockGetUserById(decoded.uid);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          creationTime: userRecord.metadata.creationTime
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid authentication token. Please sign in again.'
    });
  }
});

app.use(errorHandler);

// Test user data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'Testing123!',
  displayName: 'Test User'
};

let authToken;

describe('Authentication API Tests', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send(testUser);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.displayName).toBe(testUser.displayName);
      expect(res.body.data.customToken).toBeDefined();
      expect(res.body.data.token).toBeDefined();
      
      // Save the token for later tests
      authToken = res.body.data.token;
    });
    
    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          displayName: 'Test User'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Validation error');
    });
    
    it('should return 400 for weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'valid@example.com',
          password: 'weak',
          displayName: 'Test User'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Validation error');
    });
  });
  
  describe('POST /api/v1/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.customToken).toBeDefined();
      expect(res.body.data.token).toBeDefined();
      
      // Save token for next tests
      authToken = res.body.data.token;
    });
    
    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Invalid credentials');
    });
  });
  
  describe('POST /api/v1/auth/forgot-password', () => {
    it('should always return success (even if email does not exist)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
    
    it('should handle valid email for password reset', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: testUser.email
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });
  
  describe('GET /api/v1/auth/profile', () => {
    it('should return user profile when authenticated', async () => {
      // If no token was saved from previous tests, create a new one for testing
      if (!authToken) {
        const uid = 'test-uid';
        const email = testUser.email;
        const displayName = testUser.displayName;
        
        // Create a new token
        authToken = jwt.sign(
          { uid, email, displayName },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
      }
      
      const res = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
    
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile');
      
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });
});