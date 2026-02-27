// ============================================
// PaperVault - Papers Page JavaScript
// ============================================

let currentPage = 1;
let currentFilters = {};
let isGridView = true;

document.addEventListener('DOMContentLoaded', () => {
        // Parse URL parameters
        parseURLParams();

        // Load papers
        loadPapers();

        // Setup event listeners
        setupFilters();
        setupViewToggle();
        setupSearch();
});

// Parse URL parameters for initial filters
function parseURLParams() {
        const params = new URLSearchParams(window.location.search);

        if (params.get('search')) {
                currentFilters.search = params.get('search');
                document.getElementById('filterSearch').value = params.get('search');
        }
        if (params.get('category')) {
                currentFilters.category = params.get('category');
                document.getElementById('filterCategory').value = params.get('category');
        }
        if (params.get('year')) {
                currentFilters.year = params.get('year');
                document.getElementById('filterYear').value = params.get('year');
        }
        if (params.get('university')) {
                currentFilters.university = params.get('university');
                document.getElementById('filterUniversity').value = params.get('university');
        }
}

// Load papers with filters
async function loadPapers() {
        const container = document.getElementById('papersContainer');
        const loading = document.getElementById('loadingPapers');
        const noResults = document.getElementById('noResults');
        const pagination = document.getElementById('paginationContainer');
        const resultsCount = document.getElementById('resultsCount');

        // Show loading
        container.innerHTML = '';
        loading.classList.remove('d-none');
        noResults.classList.add('d-none');
        pagination.classList.add('d-none');

        try {
                const filters = {
                        ...currentFilters,
                        page: currentPage,
                        limit: CONFIG.ITEMS_PER_PAGE
                };

                const response = await PaperService.getPapers(filters);
                const papers = response.data || response.papers || [];
                const total = response.total || papers.length;
                const totalPages = response.totalPages || Math.ceil(total / CONFIG.ITEMS_PER_PAGE);

                // Hide loading
                loading.classList.add('d-none');

                if (papers.length === 0) {
                        noResults.classList.remove('d-none');
                        resultsCount.textContent = '0';
                        return;
                }

                // Update results count
                resultsCount.textContent = total;

                // Render papers
                if (isGridView) {
                        container.innerHTML = papers.map(paper => generatePaperCard(paper)).join('');
                } else {
                        container.innerHTML = papers.map(paper => generatePaperListItem(paper)).join('');
                }

                // Render pagination
                if (totalPages > 1) {
                        pagination.classList.remove('d-none');
                        renderPagination(totalPages);
                }

        } catch (error) {
                console.error('Error loading papers:', error);
                loading.classList.add('d-none');
                container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
                <p class="text-muted mt-3">Failed to load papers. Please try again.</p>
                <button class="btn btn-primary" onclick="loadPapers()">Retry</button>
            </div>
        `;
        }
}

// Generate paper list item (for list view)
function generatePaperListItem(paper) {
        return `
        <div class="col-12">
            <div class="paper-list-item d-flex align-items-center">
                <div class="paper-icon bg-primary bg-opacity-10 rounded p-3 me-3">
                    <i class="bi bi-file-earmark-pdf text-primary display-6"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="badge bg-primary mb-1">${paper.category || 'General'}</span>
                            <h5 class="mb-1">${paper.title}</h5>
                            <p class="text-muted small mb-0">
                                <i class="bi bi-building me-1"></i>${paper.university || 'N/A'} • 
                                <i class="bi bi-calendar me-1"></i>${paper.year || 'N/A'} • 
                                <i class="bi bi-download me-1"></i>${paper.downloads || 0} downloads
                            </p>
                        </div>
                        <a href="paper-detail.html?id=${paper.id}" class="btn btn-outline-primary">
                            View <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render pagination
function renderPagination(totalPages) {
        const container = document.getElementById('pagination');
        let html = '';

        // Previous button
        html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
                html += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
                if (startPage > 2) {
                        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                }
        }

        for (let i = startPage; i <= endPage; i++) {
                html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
        }

        if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                }
                html += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }

        // Next button
        html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.page-link').forEach(link => {
                link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const page = parseInt(e.target.closest('.page-link').dataset.page);
                        if (page && page !== currentPage && page >= 1) {
                                currentPage = page;
                                loadPapers();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                });
        });
}

// Setup filter controls
function setupFilters() {
        const applyBtn = document.getElementById('applyFilters');
        const clearBtn = document.getElementById('clearFilters');
        const resetBtn = document.getElementById('resetFilters');

        if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                        currentFilters = {
                                search: document.getElementById('filterSearch').value.trim(),
                                category: document.getElementById('filterCategory').value,
                                university: document.getElementById('filterUniversity').value,
                                year: document.getElementById('filterYear').value,
                                semester: document.getElementById('filterSemester').value,
                                sort: document.getElementById('filterSort').value
                        };

                        // Remove empty filters
                        Object.keys(currentFilters).forEach(key => {
                                if (!currentFilters[key]) delete currentFilters[key];
                        });

                        currentPage = 1;
                        loadPapers();
                });
        }

        if (clearBtn) {
                clearBtn.addEventListener('click', clearFilters);
        }

        if (resetBtn) {
                resetBtn.addEventListener('click', clearFilters);
        }
}

function clearFilters() {
        document.getElementById('filterSearch').value = '';
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterUniversity').value = '';
        document.getElementById('filterYear').value = '';
        document.getElementById('filterSemester').value = '';
        document.getElementById('filterSort').value = 'newest';

        currentFilters = {};
        currentPage = 1;
        loadPapers();
}

// Setup view toggle (grid/list)
function setupViewToggle() {
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');

        if (gridBtn && listBtn) {
                gridBtn.addEventListener('click', () => {
                        isGridView = true;
                        gridBtn.classList.add('active');
                        listBtn.classList.remove('active');
                        loadPapers();
                });

                listBtn.addEventListener('click', () => {
                        isGridView = false;
                        listBtn.classList.add('active');
                        gridBtn.classList.remove('active');
                        loadPapers();
                });
        }
}

// Setup search form
function setupSearch() {
        const form = document.getElementById('searchForm');
        const input = document.getElementById('searchInput');

        if (form) {
                form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        currentFilters.search = input.value.trim();
                        currentPage = 1;
                        loadPapers();
                });
        }
}
