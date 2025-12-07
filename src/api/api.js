import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const registerUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const loginUser = async (email) => {
  const response = await api.get(/users/src/api/api.js{email});
  return response.data;
};

export const getUserWithGuests = async (email) => {
  const response = await api.get(/users/src/api/api.js{email}/guests);
  return response.data;
};

// Guest APIs
export const getGuestsByUser = async (userEmail) => {
  const response = await api.get(/guests/user/src/api/api.js{userEmail});
  return response.data;
};

export const createGuest = async (guestData) => {
  const response = await api.post('/guests', guestData);
  return response.data;
};

// Item APIs
export const getAllItems = async () => {
  const response = await api.get('/items');
  return response.data;
};

export const getClaimedItems = async () => {
  const response = await api.get('/items/claimed');
  return response.data;
};

export const getUnclaimedItems = async () => {
  const response = await api.get('/items/unclaimed');
  return response.data;
};

export const claimItem = async (itemName, guestData) => {
  const response = await api.post(/items/src/api/api.js{itemName}/claim, guestData);
  return response.data;
};

export const unclaimItem = async (itemName) => {
  const response = await api.post(/items/src/api/api.js{itemName}/unclaim);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post('/items', itemData);
  return response.data;
};

export default api;
