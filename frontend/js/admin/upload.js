// ============================================
// PaperVault - Admin Upload JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
        // Protect admin page
        if (!protectAdminPage()) return;

        setupUploadForm();
        updateAdminName();
});

function updateAdminName() {
        const user = AuthService.getCurrentUser();
        const adminName = document.getElementById('adminName');
        if (adminName && user) {
                adminName.textContent = user.firstName || 'Admin';
        }
}

function setupUploadForm() {
        const form = document.getElementById('uploadForm');
        const errorDiv = document.getElementById('uploadError');
        const errorText = document.getElementById('uploadErrorText');
        const successDiv = document.getElementById('uploadSuccess');
        const submitBtn = document.getElementById('uploadBtn');
        const spinner = document.getElementById('uploadSpinner');
        const icon = document.getElementById('uploadIcon');
        const progressDiv = document.getElementById('uploadProgress');
        const progressBar = document.getElementById('progressBar');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Validate file
                const fileInput = document.getElementById('pdfFile');
                const file = fileInput.files[0];

                if (!file) {
                        showError('Please select a PDF file');
                        return;
                }

                if (file.size > CONFIG.MAX_FILE_SIZE) {
                        showError('File size must be less than 10MB');
                        return;
                }

                if (file.type !== 'application/pdf') {
                        showError('Only PDF files are allowed');
                        return;
                }

                // Create form data
                const formData = new FormData(form);

                setLoading(true);
                hideError();
                hideSuccess();
                progressDiv.classList.remove('d-none');

                try {
                        const response = await PaperService.createPaper(formData, (percent) => {
                                progressBar.style.width = `${percent}%`;
                                progressBar.textContent = `${percent}%`;
                        });

                        progressDiv.classList.add('d-none');
                        successDiv.classList.remove('d-none');
                        form.reset();
                        showToast('Paper uploaded successfully!', 'success');

                        // Redirect to papers list after delay
                        setTimeout(() => {
                                window.location.href = 'papers.html';
                        }, 2000);
                } catch (error) {
                        progressDiv.classList.add('d-none');
                        showError(error.message || 'Failed to upload paper. Please try again.');
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
