// ============================================
// PaperVault - Admin Dashboard JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
        // Protect admin page
        if (!protectAdminPage()) return;

        loadAdminDashboard();
});

// Load admin dashboard data
async function loadAdminDashboard() {
        const user = AuthService.getCurrentUser();

        // Update admin name
        const adminName = document.getElementById('adminName');
        if (adminName && user) {
                adminName.textContent = user.firstName || 'Admin';
        }

        // Load stats
        loadStats();

        // Load recent papers
        loadRecentPapers();

        // Load recent activity
        loadRecentActivity();
}

// Load admin stats
async function loadStats() {
        try {
                // Fetch from API
                const response = await API.get('/admin/stats');
                if (response.success) {
                    const stats = response.data;
                    document.getElementById('statsPapers').textContent = stats.totalPapers || 0;
                    document.getElementById('statsUsers').textContent = stats.totalUsers || 0;
                    document.getElementById('statsDownloads').textContent = stats.totalDownloads || 0;
                    document.getElementById('statsReviews').textContent = stats.todayPapers || 0; 
                }
        } catch (error) {
                console.error('Error loading stats:', error);
                document.getElementById('statsPapers').textContent = '!';
                document.getElementById('statsUsers').textContent = '!';
                document.getElementById('statsDownloads').textContent = '!';
                document.getElementById('statsReviews').textContent = '!';
        }
}

// Load recent papers for admin
async function loadRecentPapers() {
        const container = document.getElementById('recentPapersTable');
        if (!container) return;

        try {
                const response = await PaperService.getPapers({ limit: 5, sort: 'newest' });
                const papers = response.data || response.papers || [];

                if (papers.length === 0) {
                        container.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-muted">
                        No papers available
                    </td>
                </tr>
            `;
                        return;
                }

                container.innerHTML = papers.map(paper => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-pdf text-danger me-2"></i>
                        <span>${truncateText(paper.title, 40)}</span>
                    </div>
                </td>
                <td><span class="badge bg-primary">${paper.category || 'N/A'}</span></td>
                <td>${paper.downloads || 0}</td>
                <td>
                    <span class="badge ${paper.status === 'active' ? 'bg-success' : 'bg-warning'}">
                        ${paper.status || 'Active'}
                    </span>
                </td>
                <td>
                    <a href="papers.html?edit=${paper.id}" class="btn btn-sm btn-outline-primary me-1">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePaper('${paper.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        } catch (error) {
                console.error('Error loading papers:', error);
                container.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    Failed to load papers
                </td>
            </tr>
        `;
        }
}

// Delete paper
async function deletePaper(id) {
        if (!confirm('Are you sure you want to delete this paper?')) return;

        try {
                await PaperService.deletePaper(id);
                showToast('Paper deleted successfully', 'success');
                loadRecentPapers();
        } catch (error) {
                showToast(error.message || 'Failed to delete paper', 'error');
        }
}

// Load recent activity
async function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;

    try {
        const response = await API.get('/admin/activity');
        if (response.success && response.data) {
            const downloads = response.data.recentDownloads || [];
            if(downloads.length === 0) {
               container.innerHTML = '<div class="text-center py-3 text-muted">No recent activity</div>';
               return;
            }
            container.innerHTML = downloads.slice(0, 5).map(dl => {
               return `
                <div class="activity-item d-flex pb-3 mb-3 border-bottom">
                        <div class="flex-shrink-0">
                                <div class="bg-primary bg-opacity-10 rounded-circle p-2">
                                        <i class="bi bi-download text-primary"></i>
                                </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                                <p class="mb-0 small text-white">\${dl.user ? dl.user.name : 'A student'} downloaded \${dl.paper ? dl.paper.title : 'a paper'}</p>
                                <small class="text-muted">\${new Date(dl.downloadedAt || dl.createdAt).toLocaleString()}</small>
                        </div>
                </div>
               `;
            }).join('');
        }
    } catch(error) {
        container.innerHTML = '<div class="text-center py-3 text-muted">Error loading activity</div>';
    }
}

window.deletePaper = deletePaper;
