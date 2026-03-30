// ============================================
// PaperVault - Configuration
// ============================================

const CONFIG = {
        // API Base URL - auto-detect host for LAN usage
        API_URL: (() => {
                const isFileProtocol = window.location.protocol === 'file:';
                const protocol = isFileProtocol ? 'http:' : window.location.protocol;
                const host = window.location.hostname || 'localhost';
                return `${protocol}//${host}:5000/api`;
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
