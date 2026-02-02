import api from './api';

// Register new user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Get current user
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgotpassword', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/resetpassword/${token}`, { password });
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Update profile
export const updateProfile = async (updates) => {
  const response = await api.put('/users/profile', updates);
  return response.data;
};
