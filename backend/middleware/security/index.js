import helmet from 'helmet';
import xssClean from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { basicLimiter } from './rateLimiter.js';

// Custom XSS clean middleware for more thorough sanitization
const customXssSanitizer = (req, res, next) => {
  if (req.body) {
    // Recursively sanitize objects
    const sanitizeObject = (obj) => {
      if (!obj) return obj;
      
      // If it's not an object or array, and it's a string, sanitize it
      if (typeof obj === 'string') {
        return obj
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+="[^"]*"/gi, '') // Remove onerror and similar attributes
          .replace(/on\w+='[^']*'/gi, '')
          .replace(/on\w+=\S+/gi, '');
      }
      
      // If it's an array, sanitize each item
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
      }
      
      // If it's an object, sanitize each property
      if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          obj[key] = sanitizeObject(obj[key]);
        });
      }
      
      return obj;
    };
    
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    // Apply the same sanitization to query params
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+="[^"]*"/gi, '')
          .replace(/on\w+='[^']*'/gi, '')
          .replace(/on\w+=\S+/gi, '');
      }
    });
  }
  
  next();
};

// Centralized security middleware
export const securityMiddleware = [
  // Set security headers with helmet
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
        connectSrc: ["'self'", "https://*.firebase.com", "https://*.firebaseio.com"],
        frameSrc: ["'self'", "https://*.firebaseapp.com"],
        imgSrc: ["'self'", "data:", "https://*.googleapis.com"],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' }
  }),
  
  // Sanitize request data to prevent NoSQL injection
  mongoSanitize({
    replaceWith: '_'
  }),
  
  // Apply our custom XSS sanitizer first
  customXssSanitizer,
  
  // Then apply the standard xss-clean as an additional layer
  xssClean(),
  
  // Prevent HTTP Parameter Pollution
  hpp(),
  
  // Apply the general rate limiter to all routes
  basicLimiter
];

// Error handling middleware remains the same
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Default error message for production
  const error = {
    status: 'error',
    message: 'Something went wrong'
  };
  
  // Add more details in development environment
  if (process.env.NODE_ENV === 'development') {
    error.details = err.message;
    error.stack = err.stack;
  }
  
  // Authentication errors
  if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }
  
  // Email already in use
  if (err.code === 'auth/email-already-exists' || err.code === 'auth/email-already-in-use') {
    return res.status(400).json({
      status: 'error',
      message: 'Email already in use'
    });
  }
  
  // Invalid token
  if (err.code === 'auth/id-token-expired' || err.code === 'auth/invalid-id-token') {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token expired or invalid'
    });
  }
  
  // Default error response
  res.status(err.statusCode || 500).json(error);
};