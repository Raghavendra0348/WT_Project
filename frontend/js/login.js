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

                        // Redirect based on role
                        setTimeout(() => {
                                const user = AuthService.getCurrentUser();
                                if (user && user.role === 'admin') {
                                        window.location.href = 'admin/dashboard.html';
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
