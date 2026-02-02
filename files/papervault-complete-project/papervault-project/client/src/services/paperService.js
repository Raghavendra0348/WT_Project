import api from './api';

// Get all papers with filters
export const getPapers = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await api.get(`/papers?${queryParams}`);
  return response.data;
};

// Get single paper by ID
export const getPaper = async (id) => {
  const response = await api.get(`/papers/${id}`);
  return response.data;
};

// Create new paper (admin only)
export const createPaper = async (paperData) => {
  const response = await api.post('/papers', paperData);
  return response.data;
};

// Update paper (admin only)
export const updatePaper = async (id, paperData) => {
  const response = await api.put(`/papers/${id}`, paperData);
  return response.data;
};

// Delete paper (admin only)
export const deletePaper = async (id) => {
  const response = await api.delete(`/papers/${id}`);
  return response.data;
};

// Download paper
export const downloadPaper = async (id) => {
  const response = await api.get(`/papers/${id}/download`);
  return response.data;
};

// Search papers
export const searchPapers = async (query) => {
  const response = await api.get(`/papers?search=${query}`);
  return response.data;
};
