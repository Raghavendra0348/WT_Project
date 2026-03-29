// ============================================
// PaperVault - Login Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
        // Redirect if already logged in
        if (redirectIfLoggedIn()) return;

        setupLoginForm();
        setupPasswordToggle();
});

// Setup login form
function setupLoginForm() {
        const form = document.getElementById('loginForm');
        const errorDiv = document.getElementById('loginError');
        const errorText = document.getElementById('loginErrorText');
        const submitBtn = document.getElementById('loginBtn');
        const spinner = document.getElementById('loginSpinner');
        const icon = document.getElementById('loginIcon');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Get form data
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;

                // Validate
                if (!email || !password) {
                        showError('Please fill in all fields');
                        return;
                }

                // Show loading state
                setLoading(true);
                hideError();
                try {
                        const response = await AuthService.login({ email, password });

                        showToast('Login successful! Redirecting...', 'success');

                        // Redirect based on role and profile completion
                        setTimeout(() => {
                                const user = AuthService.getCurrentUser();
                                if (user && user.role === 'admin') {
                                        window.location.href = 'admin-dashboard.html';
                                } else if (user && !user.profileCompleted) {
                                        window.location.href = 'complete-profile.html';
                                } else {
                                        window.location.href = 'question-papers-dashboard.html';
                                }
                        }, 1000);
                } catch (error) {
                        showError(error.message || 'Invalid email or password');
                        setLoading(false);
                }
        });

        function showError(message) {
                errorText.textContent = message;
                errorDiv.classList.remove('d-none');
        }

        function hideError() {
                errorDiv.classList.add('d-none');
        }

        function setLoading(loading) {
                submitBtn.disabled = loading;
                spinner.classList.toggle('d-none', !loading);
                icon.classList.toggle('d-none', loading);
        }
}

// Setup password visibility toggle
function setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        if (toggleBtn && passwordInput) {
                toggleBtn.addEventListener('click', () => {
                        const type = passwordInput.type === 'password' ? 'text' : 'password';
                        passwordInput.type = type;
                        toggleBtn.innerHTML = `<i class="bi bi-eye${type === 'password' ? '' : '-slash'}"></i>`;
                });
        }
}

// Handle Google Credential Response
async function handleGoogleCredentialResponse(response) {
        const googleToken = response.credential;

        if (!googleToken) {
                showToast('Failed to get Google token', 'error');
                return;
        }

        try {
                // Show loading state
                const loginBtn = document.getElementById('loginBtn');
                const spinner = document.getElementById('loginSpinner');
                const icon = document.getElementById('loginIcon');

                if (loginBtn) {
                        loginBtn.disabled = true;
                        if (spinner) spinner.classList.remove('d-none');
                        if (icon) icon.classList.add('d-none');
                }

                // Send token to backend
                const response = await API.post('/auth/google', { token: googleToken });

                // Store token and user
                if (response.token) {
                        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, response.token);
                        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));

                        showToast('Google login successful! Redirecting...', 'success');

                        // Redirect based on role and profile completion
                        setTimeout(() => {
                                const user = response.user;
                                if (user && user.role === 'admin') {
                                        window.location.href = 'admin-dashboard.html';
                                } else if (user && !user.profileCompleted) {
                                        window.location.href = 'complete-profile.html';
                                } else {
                                        window.location.href = 'question-papers-dashboard.html';
                                }
                        }, 1000);
                } else {
                        showToast('Authentication failed', 'error');
                        if (loginBtn) loginBtn.disabled = false;
                        if (spinner) spinner.classList.add('d-none');
                        if (icon) icon.classList.remove('d-none');
                }
        } catch (error) {
                console.error('Google auth error:', error);
                showToast(error.message || 'Google authentication failed', 'error');

                const loginBtn = document.getElementById('loginBtn');
                const spinner = document.getElementById('loginSpinner');
                const icon = document.getElementById('loginIcon');

                if (loginBtn) loginBtn.disabled = false;
                if (spinner) spinner.classList.add('d-none');
                if (icon) icon.classList.remove('d-none');
        }
}
