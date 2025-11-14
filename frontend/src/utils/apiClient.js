/**
 * API Client utility for making HTTP requests
 * Automatically handles base URL configuration and common headers
 */

import config from '../config/config.js';

class ApiClient {
  constructor() {
    this.baseURL = config.apiUrl;
  }

  // Get authorization header from localStorage
  getAuthHeaders() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.token) {
          return {
            'Authorization': `Bearer ${parsedUser.token}`
          };
        }
      } catch (error) {
        config.warn('Error parsing user token:', error);
      }
    }
    return {};
  }

  // Common headers for all requests
  getHeaders(customHeaders = {}) {
    return {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...customHeaders
    };
  }

  // Build full URL
  buildUrl(endpoint) {
    return config.getFullApiUrl(endpoint);
  }

  // GET request
  async get(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(options.headers),
      ...options
    });
    
    config.log('GET', url, response.status);
    return this.handleResponse(response);
  }

  // POST request
  async post(endpoint, data = null, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(options.headers),
      body: data ? JSON.stringify(data) : null,
      ...options
    });
    
    config.log('POST', url, response.status);
    return this.handleResponse(response);
  }

  // PUT request
  async put(endpoint, data = null, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(options.headers),
      body: data ? JSON.stringify(data) : null,
      ...options
    });
    
    config.log('PUT', url, response.status);
    return this.handleResponse(response);
  }

  // PATCH request
  async patch(endpoint, data = null, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(options.headers),
      body: data ? JSON.stringify(data) : null,
      ...options
    });
    
    config.log('PATCH', url, response.status);
    return this.handleResponse(response);
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(options.headers),
      ...options
    });
    
    config.log('DELETE', url, response.status);
    return this.handleResponse(response);
  }

  // File upload (multipart/form-data)
  async upload(endpoint, formData, options = {}) {
    const url = this.buildUrl(endpoint);
    const headers = this.getAuthHeaders(); // Don't set Content-Type for FormData
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
      ...options
    });
    
    config.log('UPLOAD', url, response.status);
    return this.handleResponse(response);
  }

  // Handle response and errors
  async handleResponse(response) {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      return data;
    } catch (error) {
      if (error.name === 'SyntaxError') {
        // Response is not JSON
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      }
      throw error;
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
