/**
 * Image Storage Configuration
 * Set up different storage options for different environments
 */

const imageConfigs = {
  development: {
    storage: 'filesystem',
    uploadDir: './uploads',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  
  production: {
    storage: 'cloudinary', // or 's3'
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  
  testing: {
    storage: 'filesystem',
    uploadDir: './test-uploads',
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/png']
  }
};

const getImageConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return imageConfigs[env] || imageConfigs.development;
};

module.exports = { imageConfigs, getImageConfig };
