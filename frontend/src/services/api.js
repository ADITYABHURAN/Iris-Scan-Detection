/**
 * API SERVICE MODULE
 * Location: frontend/src/services/api.js
 * 
 * This file handles all HTTP requests to the backend API:
 * - User registration with iris embedding
 * - User login with iris comparison
 */

import axios from 'axios';

// Base API URL - will use proxy in development, update for production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Register a new user with iris embedding
 * @param {string} username - User's username
 * @param {Array} irisEmbedding - 128-dimensional iris embedding vector
 * @returns {Promise} - API response
 */
export const registerUser = async (username, irisEmbedding) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      irisEmbedding
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Error setting up request
      throw new Error('Error: ' + error.message);
    }
  }
};

/**
 * Login user by comparing iris embedding
 * @param {string} username - User's username
 * @param {Array} irisEmbedding - 128-dimensional iris embedding vector to compare
 * @returns {Promise} - API response with authentication result
 */
export const loginUser = async (username, irisEmbedding) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      irisEmbedding
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error: ' + error.message);
    }
  }
};

/**
 * Test backend connection
 * @returns {Promise} - API response
 */
export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error('Cannot connect to backend server');
  }
};
