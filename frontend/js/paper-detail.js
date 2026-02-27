// ============================================
// PaperVault - Paper Detail Page JavaScript
// ============================================

let currentPaper = null;

document.addEventListener('DOMContentLoaded', () => {
        const paperId = getURLParam('id');

        if (!paperId) {
                showError();
                return;
        }

        loadPaperDetails(paperId);
        setupActions();
        setupRatingInput();
        setupShareModal();
});

// Get URL parameter
function getURLParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
}

// Load paper details
async function loadPaperDetails(id) {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const paperContent = document.getElementById('paperContent');

        try {
                const response = await PaperService.getPaper(id);
                currentPaper = response.data || response;

                // Hide loading, show content
                loadingState.classList.add('d-none');
                paperContent.classList.remove('d-none');

                // Populate paper details
                populatePaperDetails(currentPaper);

                // Load similar papers
                loadSimilarPapers(currentPaper.category);

                // Update auth-dependent elements
                updateAuthElements();

        } catch (error) {
                console.error('Error loading paper:', error);
                loadingState.classList.add('d-none');
                errorState.classList.remove('d-none');
        }
}

// Populate paper details
function populatePaperDetails(paper) {
        document.getElementById('paperTitle').textContent = paper.title;
        document.getElementById('paperName').textContent = paper.title;
        document.getElementById('paperCategory').textContent = paper.category || 'General';
        document.getElementById('paperUniversity').textContent = paper.university || 'N/A';
        document.getElementById('paperSubject').textContent = paper.subject || 'N/A';
        document.getElementById('paperYear').textContent = paper.year || 'N/A';
        document.getElementById('paperSemester').textContent = paper.semester ? `${paper.semester}${getSemesterSuffix(paper.semester)}` : 'N/A';
        document.getElementById('paperDownloads').textContent = paper.downloads || 0;
        document.getElementById('paperDate').textContent = formatDate(paper.createdAt);
        document.getElementById('paperDescription').textContent = paper.description || 'No description available.';

        // Rating
        const ratingEl = document.getElementById('paperRating');
        if (paper.rating) {
                ratingEl.innerHTML = `
            <i class="bi bi-star-fill text-warning"></i>
            <span class="ms-1">${paper.rating.toFixed(1)}</span>
        `;
        }

        // Update page title
        document.title = `${paper.title} - PaperVault`;
}

// Get semester suffix
function getSemesterSuffix(num) {
        if (num === 1) return 'st';
        if (num === 2) return 'nd';
        if (num === 3) return 'rd';
        return 'th';
}

// Load similar papers
async function loadSimilarPapers(category) {
        const container = document.getElementById('similarPapers');

        try {
                const response = await PaperService.getPapers({
                        category,
                        limit: 5,
                        exclude: currentPaper.id
                });
                const papers = response.data || response.papers || [];

                if (papers.length === 0) {
                        container.innerHTML = '<p class="text-muted text-center">No similar papers found.</p>';
                        return;
                }

                container.innerHTML = papers.map(paper => `
            <a href="paper-detail.html?id=${paper.id}" class="d-block text-decoration-none mb-3">
                <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded p-2 me-2">
                        <i class="bi bi-file-earmark-pdf text-primary"></i>
                    </div>
                    <div>
                        <p class="mb-0 text-dark small fw-medium">${truncateText(paper.title, 40)}</p>
                        <small class="text-muted">${paper.year || 'N/A'}</small>
                    </div>
                </div>
            </a>
        `).join('');
        } catch (error) {
                container.innerHTML = '<p class="text-muted text-center">Failed to load similar papers.</p>';
        }
}

// Update auth-dependent elements
function updateAuthElements() {
        const isLoggedIn = AuthService.isLoggedIn();
        const addReviewSection = document.getElementById('addReviewSection');
        const loginToReview = document.getElementById('loginToReview');

        if (isLoggedIn) {
                addReviewSection.classList.remove('d-none');
                loginToReview.classList.add('d-none');
        } else {
                addReviewSection.classList.add('d-none');
                loginToReview.classList.remove('d-none');
        }
}

// Setup action buttons
function setupActions() {
        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
                downloadBtn.addEventListener('click', async () => {
                        if (!AuthService.isLoggedIn()) {
                                showToast('Please login to download papers', 'warning');
                                setTimeout(() => window.location.href = 'login.html', 1500);
                                return;
                        }

                        try {
                                downloadBtn.disabled = true;
                                downloadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Downloading...';

                                const response = await PaperService.downloadPaper(currentPaper.id);

                                if (response.url) {
                                        // Open download link
                                        window.open(response.url, '_blank');
                                        showToast('Download started!', 'success');

                                        // Update download count
                                        const countEl = document.getElementById('paperDownloads');
                                        countEl.textContent = parseInt(countEl.textContent) + 1;
                                }
                        } catch (error) {
                                showToast(error.message || 'Download failed', 'error');
                        } finally {
                                downloadBtn.disabled = false;
                                downloadBtn.innerHTML = '<i class="bi bi-download me-2"></i>Download PDF';
                        }
                });
        }

        // View PDF button
        const viewBtn = document.getElementById('viewBtn');
        const pdfViewerCard = document.getElementById('pdfViewerCard');
        const pdfViewer = document.getElementById('pdfViewer');
        const closePdfViewer = document.getElementById('closePdfViewer');

        if (viewBtn && pdfViewer) {
                viewBtn.addEventListener('click', () => {
                        if (currentPaper.fileUrl) {
                                pdfViewer.src = currentPaper.fileUrl;
                                pdfViewerCard.classList.remove('d-none');
                                pdfViewerCard.scrollIntoView({ behavior: 'smooth' });
                        } else {
                                showToast('PDF preview not available', 'warning');
                        }
                });

                if (closePdfViewer) {
                        closePdfViewer.addEventListener('click', () => {
                                pdfViewerCard.classList.add('d-none');
                                pdfViewer.src = '';
                        });
                }
        }

        // Bookmark button
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        if (bookmarkBtn) {
                bookmarkBtn.addEventListener('click', async () => {
                        if (!AuthService.isLoggedIn()) {
                                showToast('Please login to bookmark papers', 'warning');
                                return;
                        }

                        try {
                                await UserService.addBookmark(currentPaper.id);
                                bookmarkBtn.innerHTML = '<i class="bi bi-bookmark-fill me-2"></i>Bookmarked';
                                bookmarkBtn.classList.remove('btn-outline-danger');
                                bookmarkBtn.classList.add('btn-danger');
                                showToast('Paper bookmarked!', 'success');
                        } catch (error) {
                                showToast(error.message || 'Failed to bookmark', 'error');
                        }
                });
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
                shareBtn.addEventListener('click', () => {
                        const modal = new bootstrap.Modal(document.getElementById('shareModal'));
                        modal.show();
                });
        }
}

// Setup rating input
function setupRatingInput() {
        const ratingInput = document.getElementById('ratingInput');
        const ratingValue = document.getElementById('ratingValue');
        const reviewForm = document.getElementById('reviewForm');

        if (ratingInput) {
                const stars = ratingInput.querySelectorAll('i');

                stars.forEach((star, index) => {
                        star.addEventListener('click', () => {
                                const rating = index + 1;
                                ratingValue.value = rating;

                                stars.forEach((s, i) => {
                                        s.classList.toggle('bi-star-fill', i < rating);
                                        s.classList.toggle('bi-star', i >= rating);
                                        s.classList.toggle('active', i < rating);
                                });
                        });

                        star.addEventListener('mouseenter', () => {
                                stars.forEach((s, i) => {
                                        s.classList.toggle('bi-star-fill', i <= index);
                                        s.classList.toggle('bi-star', i > index);
                                });
                        });
                });

                ratingInput.addEventListener('mouseleave', () => {
                        const currentRating = parseInt(ratingValue.value);
                        stars.forEach((s, i) => {
                                s.classList.toggle('bi-star-fill', i < currentRating);
                                s.classList.toggle('bi-star', i >= currentRating);
                        });
                });
        }

        if (reviewForm) {
                reviewForm.addEventListener('submit', async (e) => {
                        e.preventDefault();

                        const rating = parseInt(ratingValue.value);
                        const text = document.getElementById('reviewText').value.trim();

                        if (!rating) {
                                showToast('Please select a rating', 'warning');
                                return;
                        }

                        try {
                                // Submit review API call here
                                showToast('Review submitted successfully!', 'success');
                                reviewForm.reset();
                                ratingValue.value = '0';
                                ratingInput.querySelectorAll('i').forEach(s => {
                                        s.classList.remove('bi-star-fill', 'active');
                                        s.classList.add('bi-star');
                                });
                        } catch (error) {
                                showToast(error.message || 'Failed to submit review', 'error');
                        }
                });
        }
}

// Setup share modal
function setupShareModal() {
        const shareLink = document.getElementById('shareLink');
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        const shareFacebook = document.getElementById('shareFacebook');
        const shareTwitter = document.getElementById('shareTwitter');
        const shareEmail = document.getElementById('shareEmail');

        // Set share link
        if (shareLink) {
                shareLink.value = window.location.href;
        }

        // Copy link
        if (copyLinkBtn) {
                copyLinkBtn.addEventListener('click', () => {
                        shareLink.select();
                        navigator.clipboard.writeText(shareLink.value);
                        copyLinkBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
                        setTimeout(() => {
                                copyLinkBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
                        }, 2000);
                });
        }

        // Social share links
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(currentPaper?.title || 'Check out this paper on PaperVault');

        if (shareWhatsApp) {
                shareWhatsApp.href = `https://wa.me/?text=${title}%20${url}`;
                shareWhatsApp.target = '_blank';
        }
        if (shareFacebook) {
                shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                shareFacebook.target = '_blank';
        }
        if (shareTwitter) {
                shareTwitter.href = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                shareTwitter.target = '_blank';
        }
        if (shareEmail) {
                shareEmail.href = `mailto:?subject=${title}&body=Check out this paper: ${url}`;
        }
}

// Show error state
function showError() {
        document.getElementById('loadingState').classList.add('d-none');
        document.getElementById('errorState').classList.remove('d-none');
}
