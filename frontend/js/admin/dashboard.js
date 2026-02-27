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
}

// Load admin stats
async function loadStats() {
        try {
                // In production, fetch from API
                // const stats = await API.get('/admin/stats');

                // Placeholder data
                document.getElementById('statsPapers').textContent = '156';
                document.getElementById('statsUsers').textContent = '1,234';
                document.getElementById('statsDownloads').textContent = '5,678';
                document.getElementById('statsReviews').textContent = '892';
        } catch (error) {
                console.error('Error loading stats:', error);
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

window.deletePaper = deletePaper;
