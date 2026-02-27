// ============================================
// PaperVault - Home Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
        loadRecentPapers();
        setupSearchForm();
});

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
