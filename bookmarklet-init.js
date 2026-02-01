// Bookmarklet initialization script
// This sets up the bookmarklet link dynamically to avoid HTML escaping issues

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
        // Updated bookmarklet code with better logic and domain detection
        const bookmarkletCode = `javascript:(function(){
            const h = location.hostname;
            const isYT = h.includes('youtube.com');
            const c = document.cookie;
            const m = c.match(/VISITOR_INFO1_LIVE=([^;]+)/);
            
            if (!isYT) {
                alert('🚩 Please go to YouTube.com before clicking this bookmarklet.');
                return;
            }
            
            if (!m) {
                alert('🍪 YouTube cookie not found.\\n\\n1. Make sure you are signed in to YouTube.\\n2. Ensure your browser is not blocking cookies.\\n3. Try refreshing the page.');
                return;
            }

            const v = m[1];
            const w = window.open('','_blank','width=500,height=300');
            w.document.write('<html><head><title>YouTube Cookie</title><style>body{font-family:system-ui;padding:20px;background:#1a1a2e;color:white}textarea{width:100%;height:100px;padding:10px;border-radius:8px;border:1px solid #667eea;background:#16213e;color:white;font-family:monospace}.btn{background:#667eea;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;margin-top:10px}.btn:hover{background:#764ba2}</style></head><body><h2>🎉 Cookie Extracted!</h2><p>Copy this value and paste it into YTDL4U:</p><textarea id="cookie" readonly>'+v+'</textarea><button class="btn" onclick="navigator.clipboard.writeText(document.getElementById(\\'cookie\\').value);alert(\\'Copied!\\')">📋 Copy to Clipboard</button><p style="color:#888;font-size:12px;margin-top:20px">Close this window and paste into YTDL4U</p></body></html>');
        })();`;

        // Set the href attribute
        bookmarkletLink.href = bookmarkletCode.replace(/\s+/g, ' ');

        // Set manual code if element exists
        const manualCodeArea = document.getElementById('manualBookmarkletCode');
        if (manualCodeArea) {
            manualCodeArea.value = bookmarkletCode.replace(/\s+/g, ' ');
        }

        // Prevent default click (show helpful message instead)
        bookmarkletLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof showToast === 'function') {
                showToast('👆 Drag this button to your bookmarks bar!', 'info');
            } else {
                alert('Drag this button to your bookmarks bar!');
            }
        });

        console.log('✅ Bookmarklet updated with precise error handling');
    }
});

function copyManualCode() {
    const codeArea = document.getElementById('manualBookmarkletCode');
    if (codeArea) {
        codeArea.select();
        navigator.clipboard.writeText(codeArea.value);
        if (typeof showToast === 'function') {
            showToast('📋 Code copied to clipboard!', 'success');
        } else {
            alert('Code copied to clipboard!');
        }
    }
}
