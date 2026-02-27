// ============================================
// PaperVault - Register Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
        // Redirect if already logged in
        if (redirectIfLoggedIn()) return;

        setupRegisterForm();
        setupPasswordToggles();
});

// Setup register form
function setupRegisterForm() {
        const form = document.getElementById('registerForm');
        const errorDiv = document.getElementById('registerError');
        const errorText = document.getElementById('registerErrorText');
        const successDiv = document.getElementById('registerSuccess');
        const successText = document.getElementById('registerSuccessText');
        const submitBtn = document.getElementById('registerBtn');
        const spinner = document.getElementById('registerSpinner');
        const icon = document.getElementById('registerIcon');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Get form data
                const firstName = document.getElementById('firstName').value.trim();
                const lastName = document.getElementById('lastName').value.trim();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const agreeTerms = document.getElementById('agreeTerms').checked;

                // Validate
                if (!firstName || !lastName || !email || !password || !confirmPassword) {
                        showError('Please fill in all fields');
                        return;
                }

                if (password.length < 6) {
                        showError('Password must be at least 6 characters long');
                        return;
                }

                if (password !== confirmPassword) {
                        showError('Passwords do not match');
                        return;
                }

                if (!agreeTerms) {
                        showError('Please agree to the terms and conditions');
                        return;
                }

                // Show loading state
                setLoading(true);
                hideError();
                hideSuccess();

                try {
                        const response = await AuthService.register({
                                firstName,
                                lastName,
                                email,
                                password
                        });

                        showSuccess('Registration successful! Please login to continue.');
                        form.reset();

                        // Redirect to login after 2 seconds
                        setTimeout(() => {
                                window.location.href = 'login.html';
                        }, 2000);
                } catch (error) {
                        showError(error.message || 'Registration failed. Please try again.');
                        setLoading(false);
                }
        });

        function showError(message) {
                errorText.textContent = message;
                errorDiv.classList.remove('d-none');
                successDiv.classList.add('d-none');
        }

        function hideError() {
                errorDiv.classList.add('d-none');
        }

        function showSuccess(message) {
                successText.textContent = message;
                successDiv.classList.remove('d-none');
                errorDiv.classList.add('d-none');
        }

        function hideSuccess() {
                successDiv.classList.add('d-none');
        }

        function setLoading(loading) {
                submitBtn.disabled = loading;
                spinner.classList.toggle('d-none', !loading);
                icon.classList.toggle('d-none', loading);
        }
}

// Setup password visibility toggles
function setupPasswordToggles() {
        setupToggle('togglePassword', 'password');
        setupToggle('toggleConfirmPassword', 'confirmPassword');

        function setupToggle(btnId, inputId) {
                const btn = document.getElementById(btnId);
                const input = document.getElementById(inputId);

                if (btn && input) {
                        btn.addEventListener('click', () => {
                                const type = input.type === 'password' ? 'text' : 'password';
                                input.type = type;
                                btn.innerHTML = `<i class="bi bi-eye${type === 'password' ? '' : '-slash'}"></i>`;
                        });
                }
        }
}
