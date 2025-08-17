/**
 * Environment switching utility
 * Provides easy methods to check and switch environments
 */

import config from '../config/config.js';

export const Environment = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
};

export const getCurrentEnvironment = () => {
  return config.env;
};

export const isDevelopment = () => {
  return config.isDevelopment;
};

export const isProduction = () => {
  return config.isProduction;
};

export const getApiUrl = (endpoint = '') => {
  return config.getFullApiUrl(endpoint);
};

export const logInfo = (message, ...args) => {
  config.log(message, ...args);
};

export const logWarning = (message, ...args) => {
  config.warn(message, ...args);
};

export const logError = (message, ...args) => {
  config.error(message, ...args);
};

// Environment-specific configurations
export const getConfig = () => ({
  apiBaseUrl: config.apiBaseUrl,
  apiUrl: config.apiUrl,
  environment: config.env,
  isDevelopment: config.isDevelopment,
  isProduction: config.isProduction,
  appName: config.appName,
  appVersion: config.appVersion,
  razorpayKeyId: config.razorpayKeyId
});

export default {
  Environment,
  getCurrentEnvironment,
  isDevelopment,
  isProduction,
  getApiUrl,
  logInfo,
  logWarning,
  logError,
  getConfig
};
