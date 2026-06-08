import apiClient from './apiClient';

export const AuthService = {
  async register(data) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await apiClient.put('/auth/updatepassword', { currentPassword, newPassword });
    return res.data;
  },

  async login(credentials) {
    const res = await apiClient.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  async forgotPassword(email) {
    const res = await apiClient.post('/auth/forgotpassword', { email });
    return res.data;
  },

  async resetPassword(token, password) {
    const res = await apiClient.put(`/auth/resetpassword/${token}`, { password });
    return res.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },

  isAdmin() {
    const u = this.getCurrentUser();
    return u?.role === 'admin';
  },
};
