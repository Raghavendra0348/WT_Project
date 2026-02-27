// ============================================
// PaperVault - Admin Papers Management JavaScript
// ============================================

let currentPage = 1;
let currentFilters = {};

document.addEventListener('DOMContentLoaded', () => {
        // Protect admin page
        if (!protectAdminPage()) return;

        updateAdminName();
        loadPapers();
        setupFilters();
        setupModals();
});

function updateAdminName() {
        const user = AuthService.getCurrentUser();
        const adminName = document.getElementById('adminName');
        if (adminName && user) {
                adminName.textContent = user.firstName || 'Admin';
        }
}

// Load papers
async function loadPapers() {
        const container = document.getElementById('papersTable');
        if (!container) return;

        container.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>
    `;

        try {
                const filters = {
                        ...currentFilters,
                        page: currentPage,
                        limit: 10
                };

                const response = await PaperService.getPapers(filters);
                const papers = response.data || response.papers || [];
                const totalPages = response.totalPages || 1;

                if (papers.length === 0) {
                        container.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">
                        No papers found
                    </td>
                </tr>
            `;
                        return;
                }

                container.innerHTML = papers.map(paper => `
            <tr>
                <td><input type="checkbox" class="form-check-input paper-checkbox" value="${paper.id}"></td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-pdf text-danger me-2"></i>
                        <span>${truncateText(paper.title, 35)}</span>
                    </div>
                </td>
                <td><span class="badge bg-primary">${paper.category || 'N/A'}</span></td>
                <td>${paper.university || 'N/A'}</td>
                <td>${paper.year || 'N/A'}</td>
                <td>${paper.downloads || 0}</td>
                <td>
                    <span class="badge ${paper.status === 'inactive' ? 'bg-warning' : 'bg-success'}">
                        ${paper.status || 'Active'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editPaper('${paper.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${paper.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

                renderPagination(totalPages);
        } catch (error) {
                console.error('Error loading papers:', error);
                container.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    Failed to load papers. <button class="btn btn-sm btn-primary" onclick="loadPapers()">Retry</button>
                </td>
            </tr>
        `;
        }
}

// Render pagination
function renderPagination(totalPages) {
        const container = document.getElementById('pagination');
        if (!container || totalPages <= 1) {
                container.innerHTML = '';
                return;
        }

        let html = '';

        // Previous
        html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage - 1}); return false;">Previous</a>
        </li>
    `;

        // Pages
        for (let i = 1; i <= totalPages; i++) {
                html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>
            </li>
        `;
        }

        // Next
        html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage + 1}); return false;">Next</a>
        </li>
    `;

        container.innerHTML = html;
}

function goToPage(page) {
        currentPage = page;
        loadPapers();
}

// Setup filters
function setupFilters() {
        const applyBtn = document.getElementById('applyFilters');
        const clearBtn = document.getElementById('clearFilters');

        if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                        currentFilters = {
                                search: document.getElementById('searchInput').value.trim(),
                                category: document.getElementById('filterCategory').value,
                                year: document.getElementById('filterYear').value,
                                status: document.getElementById('filterStatus').value
                        };

                        Object.keys(currentFilters).forEach(key => {
                                if (!currentFilters[key]) delete currentFilters[key];
                        });

                        currentPage = 1;
                        loadPapers();
                });
        }

        if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                        document.getElementById('searchInput').value = '';
                        document.getElementById('filterCategory').value = '';
                        document.getElementById('filterYear').value = '';
                        document.getElementById('filterStatus').value = '';
                        currentFilters = {};
                        currentPage = 1;
                        loadPapers();
                });
        }

        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
                selectAll.addEventListener('change', (e) => {
                        document.querySelectorAll('.paper-checkbox').forEach(cb => {
                                cb.checked = e.target.checked;
                        });
                });
        }
}

// Setup modals
function setupModals() {
        const saveEditBtn = document.getElementById('saveEditBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        if (saveEditBtn) {
                saveEditBtn.addEventListener('click', saveEdit);
        }

        if (confirmDeleteBtn) {
                confirmDeleteBtn.addEventListener('click', deletePaper);
        }
}

// Edit paper
async function editPaper(id) {
        try {
                const response = await PaperService.getPaper(id);
                const paper = response.data || response;

                document.getElementById('editPaperId').value = paper.id;
                document.getElementById('editTitle').value = paper.title;
                document.getElementById('editCategory').value = paper.category;
                document.getElementById('editUniversity').value = paper.university;
                document.getElementById('editYear').value = paper.year;
                document.getElementById('editSemester').value = paper.semester || '';
                document.getElementById('editStatus').value = paper.status || 'active';
                document.getElementById('editDescription').value = paper.description || '';

                const modal = new bootstrap.Modal(document.getElementById('editModal'));
                modal.show();
        } catch (error) {
                showToast(error.message || 'Failed to load paper details', 'error');
        }
}

// Save edit
async function saveEdit() {
        const id = document.getElementById('editPaperId').value;
        const data = {
                title: document.getElementById('editTitle').value,
                category: document.getElementById('editCategory').value,
                university: document.getElementById('editUniversity').value,
                year: parseInt(document.getElementById('editYear').value),
                semester: document.getElementById('editSemester').value ? parseInt(document.getElementById('editSemester').value) : null,
                status: document.getElementById('editStatus').value,
                description: document.getElementById('editDescription').value
        };

        try {
                await PaperService.updatePaper(id, data);
                showToast('Paper updated successfully', 'success');
                bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
                loadPapers();
        } catch (error) {
                showToast(error.message || 'Failed to update paper', 'error');
        }
}

// Confirm delete
function confirmDelete(id) {
        document.getElementById('deletePaperId').value = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
}

// Delete paper
async function deletePaper() {
        const id = document.getElementById('deletePaperId').value;

        try {
                await PaperService.deletePaper(id);
                showToast('Paper deleted successfully', 'success');
                bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
                loadPapers();
        } catch (error) {
                showToast(error.message || 'Failed to delete paper', 'error');
        }
}

// Make functions global
window.editPaper = editPaper;
window.confirmDelete = confirmDelete;
window.goToPage = goToPage;
