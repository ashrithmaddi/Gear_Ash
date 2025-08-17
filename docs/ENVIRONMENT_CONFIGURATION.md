# Environment Configuration Guide

## Overview
This guide explains how to use the environment-based configuration system for switching between development and production modes.

## Environment Files

### `.env.development`
```env
VITE_NODE_ENV=development
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_pfUer13tbi82O8
VITE_APP_NAME=Gearup4 (Dev)
```

### `.env.production`
```env
VITE_NODE_ENV=production
VITE_API_BASE_URL=https://your-production-api.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_production_key
VITE_APP_NAME=Gearup4
```

## Usage in Components

### Method 1: Using Config Object (Recommended)
```javascript
import config from '../config/config';

// Get API URL
const apiUrl = config.getFullApiUrl('courses');
// Result: http://localhost:5000/api/courses (dev) or https://your-production-api.com/api/courses (prod)

// Make API calls
const response = await fetch(config.getFullApiUrl('courses/123'));
```

### Method 2: Using API Client (For Complex Requests)
```javascript
import apiClient from '../utils/apiClient';

// GET request
const courses = await apiClient.get('courses');

// POST request
const newCourse = await apiClient.post('courses', courseData);

// File upload
const formData = new FormData();
formData.append('image', file);
const result = await apiClient.upload('upload/course/123', formData);
```

### Method 3: Using Environment Utilities
```javascript
import { isDevelopment, getApiUrl, logInfo } from '../utils/environment';

if (isDevelopment()) {
  logInfo('Running in development mode');
}

const url = getApiUrl('courses/123');
```

## NPM Scripts

### Development
```bash
npm run dev              # Start development server
npm run start:dev        # Alternative development start
npm run build:dev        # Build for development
```

### Production
```bash
npm run build:prod       # Build for production
npm run start:prod       # Start with production config
```

## Configuration Object Properties

```javascript
import config from '../config/config';

console.log({
  environment: config.env,           // 'development' or 'production'
  apiBaseUrl: config.apiBaseUrl,     // Base URL for API
  apiUrl: config.apiUrl,             // Full API URL with /api
  isDevelopment: config.isDevelopment, // Boolean
  isProduction: config.isProduction,   // Boolean
  appName: config.appName,           // App name
  razorpayKeyId: config.razorpayKeyId // Payment key
});
```

## API Client Features

### Automatic Headers
- Automatically adds Authorization header from localStorage
- Sets Content-Type to application/json
- Handles environment-specific base URLs

### Error Handling
```javascript
try {
  const result = await apiClient.get('courses');
} catch (error) {
  console.error('API Error:', error.message);
  console.error('Status:', error.status);
}
```

### File Uploads
```javascript
const formData = new FormData();
formData.append('profilePicture', file);

const result = await apiClient.upload('upload/profile/123', formData);
```

## Migration from Static URLs

### Before (Static)
```javascript
const response = await fetch('http://localhost:5000/api/courses');
const response = await fetch('/api/courses');
```

### After (Dynamic)
```javascript
import config from '../config/config';
const response = await fetch(config.getFullApiUrl('courses'));

// Or using API client
import apiClient from '../utils/apiClient';
const result = await apiClient.get('courses');
```

## Environment Detection

```javascript
import { getCurrentEnvironment, isDevelopment } from '../utils/environment';

// Check environment
if (isDevelopment()) {
  console.log('Development mode features enabled');
} else {
  console.log('Production mode');
}

// Get current environment
const env = getCurrentEnvironment(); // 'development' or 'production'
```

## Deployment Setup

### Development Deployment
1. Set up `.env.development` with local API URLs
2. Run: `npm run build:dev`
3. Deploy built files

### Production Deployment
1. Update `.env.production` with production API URLs
2. Update Razorpay keys to live keys
3. Run: `npm run build:prod`
4. Deploy built files to production server

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_NODE_ENV` | Environment name | `development`, `production` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay payment key | `rzp_test_...` or `rzp_live_...` |
| `VITE_APP_NAME` | Application name | `Gearup4` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## Best Practices

1. **Never commit sensitive production keys** to version control
2. **Use environment-specific .env files** for different deployments
3. **Always use the config object** instead of hardcoded URLs
4. **Test both environments** before deployment
5. **Use the API client** for consistent error handling
6. **Keep environment variables documented** and up to date

## Troubleshooting

### API calls failing
- Check if `VITE_API_BASE_URL` is correctly set
- Verify the backend server is running on the specified URL
- Check browser network tab for the actual URLs being called

### Environment not switching
- Restart the development server after changing .env files
- Check if the correct .env file is being loaded
- Verify `VITE_NODE_ENV` is set correctly

### Build issues
- Make sure all environment variables start with `VITE_`
- Check that .env files exist and have correct syntax
- Clear build cache: `rm -rf dist node_modules/.vite`
