// ============================================
// PaperVault - Forgot Password Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
        setupForgotPasswordForm();
});

function setupForgotPasswordForm() {
        const form = document.getElementById('forgotPasswordForm');
        const errorDiv = document.getElementById('forgotError');
        const errorText = document.getElementById('forgotErrorText');
        const successDiv = document.getElementById('forgotSuccess');
        const successText = document.getElementById('forgotSuccessText');
        const submitBtn = document.getElementById('submitBtn');
        const spinner = document.getElementById('submitSpinner');
        const icon = document.getElementById('submitIcon');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value.trim();

                if (!email) {
                        showError('Please enter your email address');
                        return;
                }

                setLoading(true);
                hideError();
                hideSuccess();

                try {
                        await AuthService.forgotPassword(email);
                        showSuccess('Password reset link has been sent to your email. Please check your inbox.');
                        form.reset();
                } catch (error) {
                        showError(error.message || 'Failed to send reset link. Please try again.');
                } finally {
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
