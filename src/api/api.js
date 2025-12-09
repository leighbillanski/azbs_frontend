import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://azbs-backend.onrender.com/api';

console.log('🚀 API Configuration:');
console.log('   API_URL:', API_URL);
console.log('   Environment:', process.env.REACT_APP_API_URL ? 'From .env' : 'Default');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log('=== AXIOS REQUEST ===');
    console.log('Base URL:', API_URL);
    console.log('Request URL:', config.url);
    console.log('Full URL:', config.baseURL + config.url);
    console.log('Method:', config.method);
    console.log('Data:', config.data);
    console.log('====================');
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    console.log('=== AXIOS RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('======================');
    return response.data; // Return just the data part
  },
  (error) => {
    console.error('=== AXIOS ERROR ===');
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    if (error.response) {
      // Server responded with error status
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response URL:', error.response.config.url);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      // Something else happened
      console.error('Setup error:', error.message);
    }
    console.error('===================');
    return Promise.reject(error);
  }
);

// User APIs
export const registerUser = async (userData) => {
  return await api.post('/users', userData);
};

export const loginUser = async (email) => {
  return await api.get(`/users/${email}`);
};

export const getUserWithGuests = async (email) => {
  return await api.get(`/users/${email}/guests`);
};

// Guest APIs
export const getGuestsByUser = async (userEmail) => {
  return await api.get(`/guests/user/${userEmail}`);
};

export const createGuest = async (guestData) => {
  return await api.post('/guests', guestData);
};

// Item APIs
export const getAllItems = async () => {
  return await api.get('/items');
};

export const getClaimedItems = async () => {
  return await api.get('/items/claimed');
};

export const getUnclaimedItems = async () => {
  return await api.get('/items/unclaimed');
};

export const claimItem = async (itemName, guestData) => {
  return await api.post(`/items/${itemName}/claim`, guestData);
};

export const unclaimItem = async (itemName) => {
  return await api.post(`/items/${itemName}/unclaim`);
};

export const createItem = async (itemData) => {
  return await api.post('/items', itemData);
};

export const deleteItem = async (itemName) => {
  return await api.delete(`/items/${itemName}`);
};

export default api;
