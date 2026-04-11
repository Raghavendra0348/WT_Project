// ============================================
// PaperVault - Home Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
        loadRecentPapers();
        loadPublicStats();
        setupSearchForm();
});

// Load real stats from public API
async function loadPublicStats() {
        try {
                const response = await API.get('/stats');
                const stats = response.data || {};

                // Update hero section counters
                const heroPaperCount = document.getElementById('heroPaperCount');
                const heroUserCount = document.getElementById('heroUserCount');
                const heroDownloadCount = document.getElementById('heroDownloadCount');

                if (heroPaperCount) heroPaperCount.setAttribute('data-count', stats.totalPapers || 0);
                if (heroUserCount) heroUserCount.setAttribute('data-count', stats.totalUsers || 0);
                if (heroDownloadCount) heroDownloadCount.setAttribute('data-count', stats.totalDownloads || 0);

                // Update stats section counters
                const totalPapers = document.getElementById('totalPapers');
                const totalUsers = document.getElementById('totalUsers');
                const totalDownloads = document.getElementById('totalDownloads');
                const totalUniversities = document.getElementById('totalUniversities');

                if (totalPapers) totalPapers.setAttribute('data-target', stats.totalPapers || 0);
                if (totalUsers) totalUsers.setAttribute('data-target', stats.totalUsers || 0);
                if (totalDownloads) totalDownloads.setAttribute('data-target', stats.totalDownloads || 0);
                if (totalUniversities) totalUniversities.setAttribute('data-target', stats.totalSubjects || 0);
        } catch (error) {
                console.error('Error loading stats:', error);
        }
}

// Load recent papers
async function loadRecentPapers() {
        const container = document.getElementById('recentPapers');
        if (!container) return;

        try {
                const response = await PaperService.getPapers({ limit: 6, sort: 'newest' });
                const papers = response.data || response.papers || [];

                if (papers.length === 0) {
                        container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-file-earmark-x display-1 text-muted"></i>
                    <p class="text-muted mt-3">No papers available yet.</p>
                    <a href="papers.html" class="btn btn-primary">Browse All Papers</a>
                </div>
            `;
                        return;
                }

                container.innerHTML = papers.map(paper => generatePaperCard(paper)).join('');
        } catch (error) {
                console.error('Error loading papers:', error);
                container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
                <p class="text-muted mt-3">Failed to load papers. Please try again later.</p>
                <button class="btn btn-primary" onclick="loadRecentPapers()">Retry</button>
            </div>
        `;
        }
}

// Setup search form
function setupSearchForm() {
        const form = document.getElementById('searchForm');
        const input = document.getElementById('searchInput');

        if (form && input) {
                form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const query = input.value.trim();
                        if (query) {
                                window.location.href = `papers.html?search=${encodeURIComponent(query)}`;
                        }
                });
        }
}
