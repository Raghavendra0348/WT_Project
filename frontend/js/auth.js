// ============================================
// PaperVault - Auth UI Handler
// ============================================

// Check authentication status and update UI
function checkAuth() {
        const isLoggedIn = AuthService.isLoggedIn();
        const user = AuthService.getCurrentUser();

        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const adminLink = document.getElementById('adminLink');
        const userName = document.getElementById('userName');

        if (isLoggedIn && user) {
                // Hide auth buttons, show user menu
                if (authButtons) authButtons.classList.add('d-none');
                if (userMenu) userMenu.classList.remove('d-none');
                if (userName) userName.textContent = user.firstName || user.email.split('@')[0];

                // Show admin link if user is admin
                if (adminLink && user.role === 'admin') {
                        adminLink.classList.remove('d-none');
                }
        } else {
                // Show auth buttons, hide user menu
                if (authButtons) authButtons.classList.remove('d-none');
                if (userMenu) userMenu.classList.add('d-none');
                if (adminLink) adminLink.classList.add('d-none');
        }
}

// Setup logout button
function setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        AuthService.logout();
                });
        }
}

// Protect page (redirect to login if not authenticated)
function protectPage() {
        if (!AuthService.isLoggedIn()) {
                window.location.href = '/login.html';
                return false;
        }
        return true;
}

// Protect admin page
function protectAdminPage() {
        if (!AuthService.isLoggedIn()) {
                window.location.href = '/login.html';
                return false;
        }
        if (!AuthService.isAdmin()) {
                window.location.href = '/question-papers-dashboard.html';
                return false;
        }
        return true;
}

// Redirect if already logged in (for login/register pages)
function redirectIfLoggedIn() {
        if (AuthService.isLoggedIn()) {
                const user = AuthService.getCurrentUser();
                if (user && user.role === 'admin') {
                        window.location.href = '/admin/dashboard.html';
                } else {
                        window.location.href = '/question-papers-dashboard.html';
                }
                return true;
        }
        return false;
}

// Show toast notification
function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toastId = 'toast-' + Date.now();
        const iconMap = {
                success: 'check-circle-fill',
                error: 'exclamation-triangle-fill',
                warning: 'exclamation-triangle-fill',
                info: 'info-circle-fill'
        };
        const bgMap = {
                success: 'bg-success',
                error: 'bg-danger',
                warning: 'bg-warning',
                info: 'bg-info'
        };

        const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgMap[type]} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-${iconMap[type]} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

        container.insertAdjacentHTML('beforeend', toastHTML);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: CONFIG.TOAST_DURATION
        });
        toast.show();

        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
                toastElement.remove();
        });
}

// Format date
function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
}

// Truncate text
function truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
}

// Generate paper card HTML
function generatePaperCard(paper) {
        return `
        <div class="col-lg-4 col-md-6">
            <div class="card paper-card h-100">
                <div class="card-img-top d-flex align-items-center justify-content-center">
                    <i class="bi bi-file-earmark-pdf"></i>
                </div>
                <div class="card-body">
                    <span class="badge bg-primary mb-2">${paper.category || 'General'}</span>
                    <h5 class="card-title">${truncateText(paper.title, 50)}</h5>
                    <p class="text-muted small mb-2">
                        <i class="bi bi-building me-1"></i>${paper.university || 'N/A'} • 
                        <i class="bi bi-calendar me-1"></i>${paper.year || 'N/A'}
                    </p>
                    <p class="card-text small text-muted">${truncateText(paper.description || '', 80)}</p>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-download me-1"></i>${paper.downloads || 0} downloads
                        </small>
                        <a href="paper-detail.html?id=${paper.id}" class="btn btn-sm btn-outline-primary">
                            View <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
        checkAuth();
        setupLogout();
});

// Make functions globally accessible
window.checkAuth = checkAuth;
window.protectPage = protectPage;
window.protectAdminPage = protectAdminPage;
window.redirectIfLoggedIn = redirectIfLoggedIn;
window.showToast = showToast;
window.formatDate = formatDate;
window.truncateText = truncateText;
window.generatePaperCard = generatePaperCard;
