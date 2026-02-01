// Authentication Modal Functions - Bookmarklet Version

// Store cookie in sessionStorage (deleted when tab closes)
let userCookie = null;

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

function handleCookiePaste(event) {
    // Auto-detect if user pasted a cookie value
    setTimeout(() => {
        const input = event.target;
        const value = input.value.trim();

        if (value.length > 10) {
            const statusDiv = document.getElementById('cookieInputStatus');
            statusDiv.classList.remove('hidden', 'error');
            statusDiv.classList.add('info');
            statusDiv.textContent = '✓ Cookie detected! Click "Authenticate & Download" to continue.';
        }
    }, 100);
}

function submitCookie() {
    const input = document.getElementById('cookieInput');
    const value = input.value.trim();
    const statusDiv = document.getElementById('cookieInputStatus');

    statusDiv.classList.remove('hidden', 'success', 'error', 'info');

    if (!value) {
        statusDiv.classList.add('error');
        statusDiv.textContent = '❌ Please paste your cookie value first.';
        return;
    }

    if (value.length < 10) {
        statusDiv.classList.add('error');
        statusDiv.textContent = '❌ Cookie value seems too short. Please check and try again.';
        return;
    }

    try {
        // Store in sessionStorage (deleted when tab closes)
        sessionStorage.setItem('ytdl_cookie', value);
        userCookie = value;

        statusDiv.classList.add('success');
        statusDiv.textContent = '✅ Authentication successful! You can now download videos.';

        showToast('🎉 Authenticated! Cookies will be deleted when you close this tab.', 'success');

        // Close modal after 2 seconds
        setTimeout(() => {
            closeAuthModal();
        }, 2000);

    } catch (error) {
        statusDiv.classList.add('error');
        statusDiv.textContent = `❌ Error: ${error.message}`;
        showToast('Failed to save cookie. Please try again.', 'error');
    }
}

// Check if cookie is loaded
function hasCookie() {
    return sessionStorage.getItem('ytdl_cookie') !== null;
}

// Get cookie for API request
function getCookie() {
    return sessionStorage.getItem('ytdl_cookie');
}

// Clear cookie (called on page unload)
window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('ytdl_cookie');
});

// Modified download function to include cookie
async function processDownloadWithAuth(item) {
    try {
        updateDownloadStatus(item.id, 'processing', 'Preparing download...');

        const cookie = getCookie();

        // Intelligent Cookie Handling
        let cookiesText = null;
        if (cookie) {
            if (cookie.includes('# Netscape')) {
                // User pasted a full Netscape file (Super Extractor output)
                cookiesText = cookie;
            } else {
                // User pasted a single value (Manual Paste)
                // Fix: Domain starts with dot -> True, Domain no dot -> False
                cookiesText = `# Netscape HTTP Cookie File\n` +
                    `.youtube.com\tTRUE\t/\tTRUE\t2147483647\tVISITOR_INFO1_LIVE\t${cookie}\n` +
                    `www.youtube.com\tFALSE\t/\tTRUE\t2147483647\tVISITOR_INFO1_LIVE\t${cookie}`;
            }
        }

        const response = await fetch(`${API_URL}/api/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: item.url,
                format: item.format,
                quality: item.quality,
                cookies: cookiesText  // Send cookie in Netscape format
            })
        });

        if (!response.ok) {
            const errorData = await response.json();

            // If bot detection and no cookie, show auth modal
            if ((errorData.error && errorData.error.includes('bot')) || response.status === 401) {
                if (!cookie) {
                    showAuthModal();
                    throw new Error('Authentication required. Please provide your YouTube cookie.');
                }
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
            <span>Your cookie is stored <strong>only in your browser</strong> and deleted when you close this tab. 
            <a href="#" onclick="showPrivacyInfo(); return false;">Learn more</a></span>
        </div>
    `;
    document.body.appendChild(notice);
}

function showPrivacyInfo() {
    const info = `🔒 Your privacy is protected:

• Cookie stored in browser only (sessionStorage)
• Never permanently stored on servers
• Deleted automatically when tab closes
• Used only for YouTube downloads
• No tracking or data collection

The bookmarklet runs entirely in your browser and only extracts the cookie value you need.`;

    showToast(info, 'info', 10000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if cookie is already loaded
    if (hasCookie()) {
        console.log('✅ Cookie loaded from session');
        showToast('✅ Authenticated - ready to download!', 'success');
    }

    // Add privacy notice
    addPrivacyNotice();
});
