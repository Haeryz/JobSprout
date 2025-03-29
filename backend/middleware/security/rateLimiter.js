import rateLimit from 'express-rate-limit';

// Basic rate limiter - limits requests to 100 per 15 minutes per IP
export const basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { 
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Auth rate limiter - limits auth endpoint requests to 5 per 15 minutes per IP
// This is more strict as authentication endpoints are more sensitive
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    status: 'error',
    message: 'Too many authentication attempts, please try again after 15 minutes'
  },
  // Track failed auth attempts to enforce stricter limits on suspicious IPs
  skipSuccessfulRequests: true
});