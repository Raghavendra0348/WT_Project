// ============================================
// PaperVault - Configuration
// ============================================

const CONFIG = {
        // API Base URL - auto-detect local vs production
        API_URL: (() => {
                const hostname = window.location.hostname;
                const isLocal = !hostname || hostname === 'localhost' || hostname === '127.0.0.1' || window.location.protocol === 'file:';
                if (isLocal) {
                        const protocol = window.location.protocol === 'file:' ? 'http:' : window.location.protocol;
                        const host = hostname || 'localhost';
                        return `${protocol}//${host}:5000/api`;
                }
                // Production — Render backend
                return 'https://wt-project-grw7.onrender.com/api';
        })(),

        // App Info
        APP_NAME: 'PaperVault',
        APP_VERSION: '1.0.0',

        // Storage Keys
        STORAGE_KEYS: {
                TOKEN: 'token',
                USER: 'user',
                THEME: 'theme'
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
