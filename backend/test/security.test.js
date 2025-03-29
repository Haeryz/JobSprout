import request from 'supertest';
import { describe, it, expect } from 'vitest';
import express from 'express';
import { securityMiddleware, errorHandler } from '../middleware/security/index.js';

// Create a test app with security middleware
const app = express();
app.use(express.json());
app.use(securityMiddleware);

// Test route that echoes request body for testing
app.post('/api/v1/test/echo', (req, res) => {
  res.status(200).json({
    data: req.body
  });
});

// Route for testing XSS protection
app.get('/api/v1/test/xss', (req, res) => {
  res.status(200).json({
    data: req.query.input
  });
});

app.use(errorHandler);

describe('Security Middleware Tests', () => {
  describe('XSS Protection', () => {
    it('should sanitize potential XSS in query parameters', async () => {
      const xssScript = '<script>alert("XSS")</script>';
      
      const res = await request(app)
        .get(`/api/v1/test/xss?input=${encodeURIComponent(xssScript)}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.data).not.toBe(xssScript);
      expect(res.body.data).not.toContain('<script>');
    });
    
    it('should sanitize potential XSS in JSON body', async () => {
      const xssPayload = {
        name: '<script>alert("XSS")</script>',
        description: 'Normal text with <img src="x" onerror="alert(1)">'
      };
      
      const res = await request(app)
        .post('/api/v1/test/echo')
        .send(xssPayload);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).not.toBe(xssPayload.name);
      expect(res.body.data.name).not.toContain('<script>');
      expect(res.body.data.description).not.toContain('onerror');
    });
  });

  describe('Content Security Policy', () => {
    it('should set CSP headers', async () => {
      const res = await request(app)
        .get('/api/v1/test/xss');
      
      expect(res.headers['content-security-policy']).toBeDefined();
    });
  });
  
  describe('NoSQL Injection Protection', () => {
    it('should sanitize potential NoSQL injection attempts', async () => {
      const maliciousPayload = {
        email: { $gt: '' },  // NoSQL injection attempt
        password: 'password'
      };
      
      const res = await request(app)
        .post('/api/v1/test/echo')
        .send(maliciousPayload);
      
      expect(res.statusCode).toBe(200);
      // The $ operator should be sanitized
      expect(JSON.stringify(res.body)).not.toContain('$gt');
    });
  });
});