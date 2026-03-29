// ============================================
// Role-Based Navigation Renderer
// ============================================

/**
 * Render sidebar navigation based on user role.
 * For admins: replaces entire sidebar nav with Admin Center + Quick Access.
 * For students: keeps default nav, hides admin-only sections.
 */
function renderRoleBasedNav() {
        const user = AuthService.getCurrentUser();
        const isAdmin = user && user.role === 'admin';

        if (!isAdmin) return; // Students keep default sidebar

        // --- Admin sidebar swap ---
        const logoSub = document.getElementById('logoSub');
        if (logoSub) logoSub.textContent = 'ADMIN PANEL';

        const sidebarNav = document.getElementById('sidebarNav');
        if (sidebarNav) {
                // Detect current page for active state
                const path = window.location.pathname;
                const isUpload = path.includes('upload-paper');
                const isDashboard = path.includes('question-papers-dashboard');

                sidebarNav.innerHTML = `
                        <div class="nav-label" style="color:#818cf8;">Admin Center</div>
                        <a class="nav-item" href="admin-dashboard.html"><i class="bi bi-graph-up"></i> System Overview</a>
                        <a class="nav-item" href="admin-approvals.html"><i class="bi bi-shield-check"></i> Approvals Hub</a>
                        <a class="nav-item" href="admin-users.html"><i class="bi bi-people-fill"></i> Manage Users</a>
                        <div class="nav-label" style="margin-top:24px;">Quick Access</div>
                        <a class="nav-item${isDashboard ? ' active' : ''}" href="question-papers-dashboard.html"><i class="bi bi-grid-fill"></i> Browse Papers</a>
                        <a class="nav-item${isUpload ? ' active' : ''}" href="upload-paper.html"><i class="bi bi-cloud-arrow-up-fill"></i> Upload Paper</a>
                `;
        }
}

// Run immediately (sync) since scripts load after DOM is present
renderRoleBasedNav();

// Also run on DOMContentLoaded as a fallback
document.addEventListener('DOMContentLoaded', renderRoleBasedNav);

// Export for reuse
window.renderRoleBasedNav = renderRoleBasedNav;
