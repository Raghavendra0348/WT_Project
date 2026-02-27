// ============================================
// PaperVault - Contact Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
        setupContactForm();
});

function setupContactForm() {
        const form = document.getElementById('contactForm');
        const errorDiv = document.getElementById('contactError');
        const errorText = document.getElementById('contactErrorText');
        const successDiv = document.getElementById('contactSuccess');
        const submitBtn = document.getElementById('submitBtn');
        const spinner = document.getElementById('submitSpinner');
        const icon = document.getElementById('submitIcon');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();

                if (!name || !email || !subject || !message) {
                        showError('Please fill in all fields');
                        return;
                }

                setLoading(true);
                hideError();
                hideSuccess();

                try {
                        // Simulate API call (replace with actual API endpoint)
                        await new Promise(resolve => setTimeout(resolve, 1500));

                        // In production, you would send to: API.post('/contact', { name, email, subject, message });

                        successDiv.classList.remove('d-none');
                        form.reset();
                        showToast('Message sent successfully!', 'success');
                } catch (error) {
                        showError(error.message || 'Failed to send message. Please try again.');
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

        function hideSuccess() {
                successDiv.classList.add('d-none');
        }

        function setLoading(loading) {
                submitBtn.disabled = loading;
                spinner.classList.toggle('d-none', !loading);
                icon.classList.toggle('d-none', loading);
        }
}
