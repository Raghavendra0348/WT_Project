// ============================================
// PaperVault - Configuration
// ============================================

const CONFIG = {
        // API Base URL - Change this to your server URL
        API_URL: 'http://localhost:5000/api',

        // App Info
        APP_NAME: 'PaperVault',
        APP_VERSION: '1.0.0',

        // Storage Keys
        STORAGE_KEYS: {
                TOKEN: 'papervault_token',
                USER: 'papervault_user',
                THEME: 'papervault_theme'
        },

        // Pagination
        ITEMS_PER_PAGE: 12,

        // File Upload
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_FILE_TYPES: ['application/pdf'],

        // Toast Duration
        TOAST_DURATION: 3000
};

// Make config globally accessible
window.CONFIG = CONFIG;
