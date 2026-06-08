import apiClient from './apiClient';

const API_URL = import.meta.env.VITE_API_URL || '';

export const PaperService = {
  async getPapers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await apiClient.get(`/papers?${params}`);
    return res.data;
  },

  async getPaper(id) {
    const res = await apiClient.get(`/papers/${id}`);
    return res.data;
  },

  async createPaper(formData, onProgress) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/api/papers`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.message || 'Upload failed'));
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  },

  async updatePaper(id, data) {
    const res = await apiClient.put(`/papers/${id}`, data);
    return res.data;
  },

  async deletePaper(id) {
    const res = await apiClient.delete(`/papers/${id}`);
    return res.data;
  },

  // Download — server streams ZIP through itself (Cloudinary restricted access)
  async downloadPaper(id) {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/api/papers/${id}/download`;

    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Download failed (${response.status})`);
    }

    const contentType = response.headers.get('content-type') || '';

    if (
      contentType.includes('application/zip') ||
      contentType.includes('application/octet-stream') ||
      contentType.includes('application/pdf')
    ) {
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = contentType.includes('zip') ? `paper-${id}.zip` : `paper-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } else {
      const data = await response.json().catch(() => ({}));
      if (data.url) window.open(data.url, '_blank', 'noopener,noreferrer');
    }
    return { success: true };
  },

  async searchPapers(query) {
    const res = await apiClient.get(`/papers?search=${encodeURIComponent(query)}`);
    return res.data;
  },
};

export const UserService = {
  async getProfile() {
    const res = await apiClient.get('/users/profile');
    return res.data;
  },
  async updateProfile(data) {
    const res = await apiClient.put('/users/profile', data);
    return res.data;
  },
  async getBookmarks() {
    const res = await apiClient.get('/users/bookmarks');
    return res.data;
  },
  async toggleBookmark(paperId) {
    const res = await apiClient.put(`/users/bookmarks/${paperId}`);
    return res.data;
  },
  async checkBookmark(paperId) {
    const res = await apiClient.get(`/users/bookmarks/${paperId}/check`);
    return res.data;
  },
  async getDownloadHistory() {
    const res = await apiClient.get('/users/downloads');
    return res.data;
  },
  async getStats() {
    const res = await apiClient.get('/users/stats');
    return res.data;
  },
  async getUsers() {
    const res = await apiClient.get('/users');
    return res.data;
  },
  async updateUser(id, data) {
    const res = await apiClient.put(`/users/${id}`, data);
    return res.data;
  },
  async deleteUser(id) {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },
};
