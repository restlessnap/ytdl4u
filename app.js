const API_URL = 'https://ytdl4u-backend.onrender.com'; // Production - Render.com backend
// const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
//     ? 'http://localhost:10000'  // Local development
//     : 'https://ytdl4u-backend.onrender.com';  // Production - Render.com backend

// ===== State Management =====
const state = {
    currentTab: 'single',
    singleFormat: 'mp4',
    singleQuality: '1080',
    singleAudioQuality: '320',
    batchFormat: 'mp4',
    batchQuality: '1080',
    downloadQueue: [],
    totalDownloads: 0
};

// ===== DOM Elements =====
const elements = {
    singleTab: document.getElementById('single-tab'),
    batchTab: document.getElementById('batch-tab'),
    singleContent: document.getElementById('single-content'),
    batchContent: document.getElementById('batch-content'),
    singleUrl: document.getElementById('single-url'),
    batchUrls: document.getElementById('batch-urls'),
    pasteBtn: document.getElementById('paste-btn'),
    singleDownloadBtn: document.getElementById('single-download-btn'),
    batchDownloadBtn: document.getElementById('batch-download-btn'),
    downloadQueue: document.getElementById('download-queue'),
    queueItems: document.getElementById('queue-items'),
    toastContainer: document.getElementById('toast-container'),
    totalDownloadsEl: document.getElementById('total-downloads'),
    qualitySelector: document.getElementById('quality-selector'),
    audioQualitySelector: document.getElementById('audio-quality-selector')
};

// ===== Utility Functions =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.25s reverse';
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

function isValidYouTubeUrl(url) {
    const patterns = [
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
        /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
        /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/
    ];
    return patterns.some(pattern => pattern.test(url.trim()));
}

function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
        /youtube\.com\/embed\/([\w-]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function updateDownloadCount() {
    state.totalDownloads++;
    elements.totalDownloadsEl.textContent = state.totalDownloads;

    // Animate the counter
    elements.totalDownloadsEl.style.transform = 'scale(1.2)';
    setTimeout(() => {
        elements.totalDownloadsEl.style.transform = 'scale(1)';
    }, 200);
}

// ===== Tab Switching =====
function switchTab(tab) {
    state.currentTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-content`).classList.add('active');
}

elements.singleTab.addEventListener('click', () => switchTab('single'));
elements.batchTab.addEventListener('click', () => switchTab('batch'));

// ===== Format Selection =====
document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const format = btn.dataset.format;
        const isBatch = btn.dataset.batch === 'true';

        // Update active state
        const container = btn.closest('.tab-content');
        container.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update state
        if (isBatch) {
            state.batchFormat = format;
        } else {
            state.singleFormat = format;

            // Toggle quality selectors
            if (format === 'mp3') {
                elements.qualitySelector.classList.add('hidden');
                elements.audioQualitySelector.classList.remove('hidden');
            } else {
                elements.qualitySelector.classList.remove('hidden');
                elements.audioQualitySelector.classList.add('hidden');
            }
        }
    });
});

// ===== Quality Selection =====
document.querySelectorAll('.quality-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const quality = btn.dataset.quality;
        const audioQuality = btn.dataset.audioQuality;
        const isBatch = btn.dataset.batch === 'true';

        // Update active state
        const container = btn.closest('.quality-selector, .audio-quality-selector');
        container.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update state
        if (audioQuality) {
            state.singleAudioQuality = audioQuality;
        } else if (isBatch) {
            state.batchQuality = quality;
        } else {
            state.singleQuality = quality;
        }
    });
});

// ===== Paste Button =====
elements.pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        elements.singleUrl.value = text;
        showToast('URL pasted from clipboard', 'success');
    } catch (err) {
        showToast('Failed to read clipboard', 'error');
    }
});

// ===== Download Queue Management =====
function addToQueue(url, format, quality) {
    const videoId = extractVideoId(url);
    if (!videoId) {
        showToast('Invalid YouTube URL', 'error');
        return;
    }

    const queueItem = {
        id: Date.now(),
        url,
        videoId,
        format,
        quality,
        status: 'pending',
        progress: 0,
        title: `Video ${videoId}`
    };

    state.downloadQueue.push(queueItem);
    renderQueue();
    processDownload(queueItem);
}

function renderQueue() {
    if (state.downloadQueue.length === 0) {
        elements.downloadQueue.classList.add('hidden');
        return;
    }

    elements.downloadQueue.classList.remove('hidden');
    elements.queueItems.innerHTML = state.downloadQueue.map(item => `
        <div class="queue-item" data-id="${item.id}">
            <div class="queue-item-icon">
                ${item.format === 'mp3' ? '🎵' : '🎬'}
            </div>
            <div class="queue-item-info">
                <div class="queue-item-title">${item.title}</div>
                <div class="queue-item-meta">${item.format.toUpperCase()} • ${item.quality}${item.format === 'mp3' ? ' kbps' : 'p'}</div>
                ${item.status === 'downloading' ? `
                    <div class="queue-item-progress">
                        <div class="queue-item-progress-bar" style="width: ${item.progress}%"></div>
                    </div>
                ` : ''}
            </div>
            <div class="queue-item-status">
                <span class="status-dot ${item.status}"></span>
                ${item.status === 'pending' ? 'Pending' :
            item.status === 'downloading' ? 'Downloading' :
                item.status === 'completed' ? 'Completed' : 'Error'}
            </div>
        </div>
    `).join('');
}

// ===== Download Processing with Authentication =====
async function processDownload(item) {
    try {
        // Update status to downloading
        item.status = 'downloading';
        renderQueue();

        showToast(`Processing: ${item.videoId}`, 'info');

        // Simulate initial progress
        item.progress = 10;
        renderQueue();

        // Get cookie if available
        const cookie = sessionStorage.getItem('ytdl_cookie');

        let cookiesText = null;
        let poToken = null;
        let visitorData = null;

        if (cookie) {
            // Check for PO Token and Visitor Data first
            if (cookie.includes('po_token:')) {
                const poMatch = cookie.match(/po_token:\s*([^\n\r]+)/);
                const visitorMatch = cookie.match(/visitor_data:\s*([^\n\r]+)/);
                if (poMatch && !poMatch[1].includes('AUTO_GENERATED')) poToken = poMatch[1].trim();
                if (visitorMatch) visitorData = visitorMatch[1].trim();

                // Extract cookie part if it exists
                if (cookie.includes('# Netscape')) {
                    cookiesText = '# Netscape' + cookie.split('# Netscape')[1];
                }
            } else if (cookie.includes('# Netscape')) {
                cookiesText = cookie;
            } else {
                cookiesText = `# Netscape HTTP Cookie File\n` +
                    `.youtube.com\tTRUE\t/\tTRUE\t2147483647\tVISITOR_INFO1_LIVE\t${cookie}\n` +
                    `www.youtube.com\tFALSE\t/\tTRUE\t2147483647\tVISITOR_INFO1_LIVE\t${cookie}`;
            }
        }

        // Make API request to download service
        const response = await fetch(`${API_URL}/api/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: item.url,
                format: item.format,
                quality: item.quality,
                cookies: cookiesText,
                po_token: poToken,
                visitor_data: visitorData
            })
        });

        if (!response.ok) {
            const errorData = await response.json();

            // If bot detection or 401 Unauthorized, show auth modal
            if ((errorData.error && (errorData.error.includes('bot') || errorData.error.includes('Authentication required'))) || response.status === 401) {
                if (!cookie) {
                    // Show auth modal
                    if (typeof showAuthModal === 'function') {
                        showAuthModal();
                    }
                    throw new Error('Authentication required. Please provide your YouTube cookie.');
                }
            }

            throw new Error(errorData.error || 'Download failed');
        }

        const data = await response.json();

        // Update item with video info
        item.title = data.title || item.title;
        item.progress = 100;
        item.status = 'completed';
        renderQueue();

        // Trigger download by creating a link to the backend file endpoint
        if (data.downloadId) {
            const downloadUrl = `${API_URL}/api/file/${data.downloadId}?filename=${encodeURIComponent(data.filename)}`;
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = data.filename;
            a.target = '_blank';  // Open in new tab as fallback
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        updateDownloadCount();
        showToast(`Download ready: ${item.title}`, 'success');

    } catch (error) {
        console.error('Download error:', error);
        item.status = 'error';
        item.progress = 0;
        renderQueue();

        // Show more helpful error messages
        let errorMessage = error.message;
        if (errorMessage.includes('Failed to fetch')) {
            errorMessage = 'Backend service unavailable. It may be starting up (takes ~1 min on free tier).';
        }
        showToast(`Download failed: ${errorMessage}`, 'error');
    }
}

// ===== Single Download =====
elements.singleDownloadBtn.addEventListener('click', () => {
    const url = elements.singleUrl.value.trim();

    if (!url) {
        showToast('Please enter a YouTube URL', 'error');
        return;
    }

    if (!isValidYouTubeUrl(url)) {
        showToast('Please enter a valid YouTube URL', 'error');
        return;
    }

    const quality = state.singleFormat === 'mp3' ? state.singleAudioQuality : state.singleQuality;
    addToQueue(url, state.singleFormat, quality);
    elements.singleUrl.value = '';
});

// ===== Batch Download =====
elements.batchDownloadBtn.addEventListener('click', () => {
    const urls = elements.batchUrls.value
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

    if (urls.length === 0) {
        showToast('Please enter at least one YouTube URL', 'error');
        return;
    }

    const validUrls = urls.filter(isValidYouTubeUrl);
    const invalidCount = urls.length - validUrls.length;

    if (invalidCount > 0) {
        showToast(`${invalidCount} invalid URL(s) skipped`, 'error');
    }

    if (validUrls.length === 0) {
        showToast('No valid YouTube URLs found', 'error');
        return;
    }

    validUrls.forEach(url => {
        addToQueue(url, state.batchFormat, state.batchQuality);
    });

    elements.batchUrls.value = '';
    showToast(`Added ${validUrls.length} video(s) to queue`, 'success');
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + V in single URL input
    if ((e.ctrlKey || e.metaKey) && e.key === 'v' && document.activeElement === elements.singleUrl) {
        setTimeout(() => {
            const url = elements.singleUrl.value;
            if (isValidYouTubeUrl(url)) {
                showToast('Valid YouTube URL detected', 'success');
            }
        }, 100);
    }

    // Enter to download in single mode
    if (e.key === 'Enter' && document.activeElement === elements.singleUrl) {
        elements.singleDownloadBtn.click();
    }
});

// ===== Initialize =====
function init() {
    // Load saved download count from localStorage
    const savedCount = localStorage.getItem('totalDownloads');
    if (savedCount) {
        state.totalDownloads = parseInt(savedCount);
        elements.totalDownloadsEl.textContent = state.totalDownloads;
    }

    // Save download count on change
    const originalUpdateDownloadCount = updateDownloadCount;
    updateDownloadCount = function () {
        originalUpdateDownloadCount();
        localStorage.setItem('totalDownloads', state.totalDownloads);
    };

    console.log('YTDL4U initialized');
}

// Start the app
init();
