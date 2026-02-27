// ============================================
// PaperVault - API Service
// ============================================

const API = {
        // Base URL from config
        baseURL: CONFIG.API_URL,

        // Get authorization headers
        getHeaders() {
                const headers = {
                        'Content-Type': 'application/json'
                };
                const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
                if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                }
                return headers;
        },

        // Generic fetch wrapper
        async request(endpoint, options = {}) {
                const url = `${this.baseURL}${endpoint}`;
                const config = {
                        ...options,
                        headers: {
                                ...this.getHeaders(),
                                ...options.headers
                        }
                };

                try {
                        const response = await fetch(url, config);
                        const data = await response.json();

                        if (!response.ok) {
                                // Handle 401 Unauthorized
                                if (response.status === 401) {
                                        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
                                        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
                                        window.location.href = '/login.html';
                                }
                                throw new Error(data.message || 'Something went wrong');
                        }

                        return data;
                } catch (error) {
                        console.error('API Error:', error);
                        throw error;
                }
        },

        // GET request
        async get(endpoint) {
                return this.request(endpoint, { method: 'GET' });
        },

        // POST request
        async post(endpoint, data) {
                return this.request(endpoint, {
                        method: 'POST',
                        body: JSON.stringify(data)
                });
        },

        // PUT request
        async put(endpoint, data) {
                return this.request(endpoint, {
                        method: 'PUT',
                        body: JSON.stringify(data)
                });
        },

        // DELETE request
        async delete(endpoint) {
                return this.request(endpoint, { method: 'DELETE' });
        },

        // Upload file with progress
        async uploadFile(endpoint, formData, onProgress) {
                return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);

                        xhr.open('POST', `${this.baseURL}${endpoint}`);

                        if (token) {
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }

                        xhr.upload.onprogress = (e) => {
                                if (e.lengthComputable && onProgress) {
                                        const percent = Math.round((e.loaded / e.total) * 100);
                                        onProgress(percent);
                                }
                        };

                        xhr.onload = () => {
                                if (xhr.status >= 200 && xhr.status < 300) {
                                        resolve(JSON.parse(xhr.responseText));
                                } else {
                                        reject(new Error(JSON.parse(xhr.responseText).message || 'Upload failed'));
                                }
                        };

                        xhr.onerror = () => reject(new Error('Network error'));
                        xhr.send(formData);
                });
        }
};

// ============================================
// Auth Service
// ============================================
const AuthService = {
        // Register
        async register(userData) {
                return API.post('/auth/register', userData);
        },

        // Login
        async login(credentials) {
                const response = await API.post('/auth/login', credentials);
                if (response.token) {
                        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, response.token);
                        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
                }
                return response;
        },

        // Logout
        logout() {
                localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
                localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
                window.location.href = '/login.html';
        },

        // Get current user
        async getMe() {
                return API.get('/auth/me');
        },

        // Forgot password
        async forgotPassword(email) {
                return API.post('/auth/forgotpassword', { email });
        },

        // Reset password
        async resetPassword(token, password) {
                return API.put(`/auth/resetpassword/${token}`, { password });
        },

        // Check if logged in
        isLoggedIn() {
                return !!localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        },

        // Get current user from storage
        getCurrentUser() {
                const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
                return user ? JSON.parse(user) : null;
        },

        // Check if user is admin
        isAdmin() {
                const user = this.getCurrentUser();
                return user && user.role === 'admin';
        }
};

// ============================================
// Paper Service
// ============================================
const PaperService = {
        // Get all papers
        async getPapers(filters = {}) {
                const params = new URLSearchParams(filters).toString();
                return API.get(`/papers?${params}`);
        },

        // Get single paper
        async getPaper(id) {
                return API.get(`/papers/${id}`);
        },

        // Create paper (admin)
        async createPaper(formData, onProgress) {
                return API.uploadFile('/papers', formData, onProgress);
        },

        // Update paper (admin)
        async updatePaper(id, data) {
                return API.put(`/papers/${id}`, data);
        },

        // Delete paper (admin)
        async deletePaper(id) {
                return API.delete(`/papers/${id}`);
        },

        // Download paper
        async downloadPaper(id) {
                return API.get(`/papers/${id}/download`);
        },

        // Search papers
        async searchPapers(query) {
                return API.get(`/papers?search=${encodeURIComponent(query)}`);
        }
};

// ============================================
// User Service
// ============================================
const UserService = {
        // Get user profile
        async getProfile() {
                return API.get('/users/profile');
        },

        // Update profile
        async updateProfile(data) {
                return API.put('/users/profile', data);
        },

        // Get bookmarks
        async getBookmarks() {
                return API.get('/users/bookmarks');
        },

        // Add bookmark
        async addBookmark(paperId) {
                return API.post('/users/bookmarks', { paperId });
        },

        // Remove bookmark
        async removeBookmark(paperId) {
                return API.delete(`/users/bookmarks/${paperId}`);
        },

        // Get download history
        async getDownloadHistory() {
                return API.get('/users/downloads');
        },

        // Get all users (admin)
        async getUsers() {
                return API.get('/users');
        },

        // Update user (admin)
        async updateUser(id, data) {
                return API.put(`/users/${id}`, data);
        },

        // Delete user (admin)
        async deleteUser(id) {
                return API.delete(`/users/${id}`);
        }
};

// Make services globally accessible
window.API = API;
window.AuthService = AuthService;
window.PaperService = PaperService;
window.UserService = UserService;
