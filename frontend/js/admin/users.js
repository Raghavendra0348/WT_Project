// ============================================
// Admin - User Management
// ============================================

let currentPage = 1;
let usersPerPage = 10;
let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
        // Protect admin page
        if (!protectAdminPage()) return;

        loadAdminUsers();
});

// Load all users for admin
async function loadAdminUsers() {
        const container = document.getElementById('usersList');
        if (!container) return;

        try {
                const response = await API.get(`/admin/users?page=${currentPage}&limit=${usersPerPage}`);

                if (response.success && response.data) {
                        allUsers = response.data.users || [];
                        const total = response.data.total || 0;

                        // Update count
                        const userCount = document.getElementById('userCount');
                        if (userCount) userCount.textContent = `${total} Users`;

                        if (allUsers.length === 0) {
                                container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--muted);">No users found</div>';
                                return;
                        }

                        container.innerHTML = allUsers.map(user => `
                <div class="user-card">
                    <div>
                        <div style="font-weight:600; font-size:16px; color:var(--text-main);">
                            <i class="bi bi-person-circle me-2"></i>${user.firstName || 'User'} ${user.lastName || ''}
                        </div>
                        <div class="meta-text"><i class="bi bi-envelope me-1"></i>${user.email}</div>
                        <div class="meta-text"><i class="bi bi-tag me-1"></i>Role: <span style="background:${user.role === 'admin' ? '#4F35D2' : '#06B6D4'}; color:white; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600;">${user.role.toUpperCase()}</span></div>
                        <div class="meta-text"><i class="bi bi-calendar me-1"></i>Joined: ${new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        ${user.role !== 'admin' ? `
                            <button class="btn-admin" onclick="makeAdmin('${user.id}')">
                                <i class="bi bi-shield-check me-1"></i>Make Admin
                            </button>
                        ` : ''}
                        <button class="btn-danger" onclick="deleteUser('${user.id}', '${user.email}')">
                            <i class="bi bi-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            `).join('');
                }
        } catch (error) {
                console.error('Error loading users:', error);
                container.innerHTML = '<div style="text-align:center; padding:40px; color:#EF4444;">Failed to load users</div>';
        }
}

// Make user admin
async function makeAdmin(userId) {
        if (!confirm('Promote this user to admin?')) return;

        try {
                const response = await API.put(`/admin/users/${userId}`, { role: 'admin' });

                if (response.success) {
                        showToast('User promoted to admin', 'success');
                        loadAdminUsers();
                } else {
                        showToast(response.message || 'Failed to promote user', 'error');
                }
        } catch (error) {
                showToast(error.message || 'Error promoting user', 'error');
        }
}

// Delete user
async function deleteUser(userId, email) {
        if (!confirm(`Delete user ${email}? This action cannot be undone.`)) return;

        try {
                const response = await API.delete(`/admin/users/${userId}`);

                if (response.success) {
                        showToast('User deleted successfully', 'success');
                        loadAdminUsers();
                } else {
                        showToast(response.message || 'Failed to delete user', 'error');
                }
        } catch (error) {
                showToast(error.message || 'Error deleting user', 'error');
        }
}

// Pagination next
function nextPage() {
        currentPage++;
        loadAdminUsers();
}

// Pagination previous
function prevPage() {
        if (currentPage > 1) {
                currentPage--;
                loadAdminUsers();
        }
}

window.makeAdmin = makeAdmin;
window.deleteUser = deleteUser;
window.nextPage = nextPage;
window.prevPage = prevPage;
