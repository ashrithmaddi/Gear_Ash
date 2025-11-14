/**
 * Simple configuration utility for environment-based settings
 * All configuration comes from .env files
 */

const config = {
  // Environment
  env: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
  
  // API Configuration - directly from .env
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://gearash-production.up.railway.app',
  
  // Payment Configuration
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Gearup4',
  
  // Computed properties
  get apiUrl() {
    return `${this.apiBaseUrl}/api`;
  },
  
  get isDevelopment() {
    return this.env === 'development';
  },
  
  get isProduction() {
    return this.env === 'production';
  },
  
  // Utility method to build full API URLs
  getFullApiUrl(endpoint) {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.apiUrl}/${cleanEndpoint}`;
  }
};

// Log configuration in development
if (config.isDevelopment) {
  console.log('🔧 Configuration loaded:', {
    environment: config.env,
    apiBaseUrl: config.apiBaseUrl,
    appName: config.appName
  });
}

export default config;
