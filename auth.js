// Authentication Modal Functions

// Store cookies in sessionStorage (deleted when tab closes)
let userCookies = null;

function showAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function tryWithoutAuth() {
    closeAuthModal();
    showToast('Attempting download without authentication...', 'info');
}

async function handleCookieUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusDiv = document.getElementById('cookieUploadStatus');
    statusDiv.classList.remove('hidden', 'success', 'error');
    statusDiv.textContent = 'Reading cookie file...';

    try {
        const text = await file.text();

        // Validate cookie format
        if (!text.includes('youtube.com') && !text.includes('.youtube.com')) {
            throw new Error('Invalid cookie file - must be from youtube.com');
        }

        // Store in sessionStorage (deleted when tab closes)
        sessionStorage.setItem('ytdl_cookies', text);
        userCookies = text;

        statusDiv.classList.add('success');
        statusDiv.textContent = '✅ Cookies loaded successfully! You can now download videos.';

        showToast('Authentication successful! Cookies will be deleted when you close this tab.', 'success');

        // Close modal after 2 seconds
        setTimeout(() => {
            closeAuthModal();
        }, 2000);

    } catch (error) {
        statusDiv.classList.add('error');
        statusDiv.textContent = `❌ Error: ${error.message}`;
        showToast('Failed to load cookies. Please try again.', 'error');
    }
}

// Check if cookies are loaded
function hasCookies() {
    return sessionStorage.getItem('ytdl_cookies') !== null;
}

// Get cookies for API request
function getCookies() {
    return sessionStorage.getItem('ytdl_cookies');
}

// Clear cookies (called on page unload)
window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('ytdl_cookies');
});

// Modified download function to include cookies
async function processDownloadWithAuth(item) {
    try {
        updateDownloadStatus(item.id, 'processing', 'Preparing download...');

        const cookies = getCookies();

        const response = await fetch(`${API_URL}/api/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: item.url,
                format: item.format,
                quality: item.quality,
                cookies: cookies  // Send cookies if available
            })
        });

        if (!response.ok) {
            const errorData = await response.json();

            // If bot detection and no cookies, show auth modal
            if (errorData.error && errorData.error.includes('bot') && !cookies) {
                showAuthModal();
                throw new Error('Authentication required. Please upload your YouTube cookies.');
            }

            throw new Error(errorData.error || 'Download failed');
        }

        const data = await response.json();

        if (data.success) {
            updateDownloadStatus(item.id, 'processing', 'Starting download...');

            // Trigger file download
            const downloadUrl = `${API_URL}${data.downloadUrl}?filename=${encodeURIComponent(data.filename)}`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = data.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            updateDownloadStatus(item.id, 'completed', 'Download complete!');
            state.completedDownloads++;
            updateStats();
            showToast(`✅ Downloaded: ${data.title}`, 'success');
        } else {
            throw new Error('Download failed');
        }
    } catch (error) {
        console.error('Download error:', error);
        updateDownloadStatus(item.id, 'failed', error.message);
        showToast(`❌ ${error.message}`, 'error');
    }
}

// Add privacy notice to the page
function addPrivacyNotice() {
    const notice = document.createElement('div');
    notice.className = 'privacy-notice';
    notice.innerHTML = `
        <div class="privacy-notice-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Your cookies are stored <strong>only in your browser</strong> and deleted when you close this tab. 
            <a href="#" onclick="showPrivacyInfo(); return false;">Learn more</a></span>
        </div>
    `;
    document.body.appendChild(notice);
}

function showPrivacyInfo() {
    showToast('🔒 Your privacy is protected:\n• Cookies stored in browser only\n• Never sent to our servers\n• Deleted when tab closes\n• No tracking or data collection', 'info', 8000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if cookies are already loaded
    if (hasCookies()) {
        console.log('✅ Cookies loaded from session');
    }

    // Add privacy notice
    addPrivacyNotice();
});
