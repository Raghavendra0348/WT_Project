// ============================================
// Admin - Paper Approvals
// ============================================

let allPapers = [];

document.addEventListener('DOMContentLoaded', () => {
        // Protect admin page
        if (!protectAdminPage()) return;

        loadPendingPapers();
});

// Load papers for review
async function loadPendingPapers() {
        const container = document.getElementById('papersList');
        if (!container) return;

        try {
                const response = await API.get('/admin/papers');

                if (response.success && response.data) {
                        allPapers = response.data || [];

                        // Update count
                        const paperCount = document.getElementById('paperCount');
                        if (paperCount) paperCount.textContent = `${allPapers.length} Papers`;

                        if (allPapers.length === 0) {
                                container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--muted);"><i class="bi bi-check-circle me-2" style="font-size:24px;"></i>All papers reviewed</div>';
                                return;
                        }

                        container.innerHTML = allPapers.map(paper => `
                <div class="paper-card">
                    <div>
                        <div style="font-weight:600; font-size:16px; color:var(--text-main); margin-bottom:8px;">
                            ${paper.title}
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; margin-bottom:12px;">
                            <div class="meta-text"><i class="bi bi-person me-1"></i>Uploaded by: ${paper.user?.firstName || 'User'}</div>
                            <div class="meta-text"><i class="bi bi-tag me-1"></i>Category: ${paper.category || 'N/A'}</div>
                            <div class="meta-text"><i class="bi bi-building me-1"></i>University: ${paper.university || 'N/A'}</div>
                            <div class="meta-text"><i class="bi bi-calendar me-1"></i>Year: ${paper.year || 'N/A'}</div>
                        </div>
                        <div class="meta-text" style="line-height:1.5;">
                            <strong>Description:</strong> ${paper.description || 'No description'}
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:16px; padding-top:12px; border-top:1px solid var(--border);">
                        <button class="btn-approve" onclick="approvePaper('${paper.id}')">
                            <i class="bi bi-check-lg me-1"></i>Approve
                        </button>
                        <button class="btn-reject" onclick="rejectPaper('${paper.id}')">
                            <i class="bi bi-x-lg me-1"></i>Reject
                        </button>
                        <a href="paper-detail.html?id=${paper.id}" class="btn-view" style="background:#06B6D4; color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; font-weight:600; font-size:14px; text-decoration:none; display:inline-flex; align-items:center;">
                            <i class="bi bi-eye me-1"></i>View
                        </a>
                    </div>
                </div>
            `).join('');
                }
        } catch (error) {
                console.error('Error loading papers:', error);
                container.innerHTML = '<div style="text-align:center; padding:40px; color:#EF4444;">Failed to load papers</div>';
        }
}

// Approve paper
async function approvePaper(paperId) {
        if (!confirm('Approve this paper?')) return;

        try {
                const response = await API.put(`/admin/papers/${paperId}`, { status: 'approved' });

                if (response.success) {
                        showToast('Paper approved successfully', 'success');
                        loadPendingPapers();
                } else {
                        showToast(response.message || 'Failed to approve paper', 'error');
                }
        } catch (error) {
                showToast(error.message || 'Error approving paper', 'error');
        }
}

// Reject paper
async function rejectPaper(paperId) {
        const reason = prompt('Enter rejection reason (optional):');
        if (reason === null) return;

        try {
                const response = await API.put(`/admin/papers/${paperId}`, {
                        status: 'rejected',
                        rejectionReason: reason
                });

                if (response.success) {
                        showToast('Paper rejected', 'success');
                        loadPendingPapers();
                } else {
                        showToast(response.message || 'Failed to reject paper', 'error');
                }
        } catch (error) {
                showToast(error.message || 'Error rejecting paper', 'error');
        }
}

window.approvePaper = approvePaper;
window.rejectPaper = rejectPaper;
