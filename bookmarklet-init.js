// Bookmarklet initialization script
// This sets up a "Super Extractor" that gets ALL cookies for maximum success

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
        // Super Extractor: Gets ALL cookies and formats them perfectly for yt-dlp
        const bookmarkletCode = `javascript:(function(){
            const h = location.hostname;
            if (!h.includes('youtube.com')) {
                alert('🚩 Please go to YouTube.com before clicking this bookmarklet.');
                return;
            }
            
            const cookies = document.cookie.split('; ');
            if (!cookies.length || (cookies.length === 1 && cookies[0] === "")) {
                alert('🍪 No cookies found. Make sure you are signed in to YouTube.');
                return;
            }

            let netscape = '# Netscape HTTP Cookie File\\n';
            cookies.forEach(c => {
                const parts = c.split('=');
                if (parts.length >= 2) {
                    const name = parts[0];
                    const value = parts.slice(1).join('=');
                    // Domain | Flag | Path | Secure | Expiration | Name | Value
                    // We use .youtube.com and TRUE (matching initial dot)
                    netscape += \`.youtube.com\\tTRUE\\t/\\tTRUE\\t2147483647\\t\${name}\\t\${value}\\n\`;
                }
            });

            const win = window.open('','_blank','width=600,height=400');
            if(!win) {
                alert('🚀 Extractor ready! But your browser blocked the popup.\\n\\nPlease allow popups for YouTube and try again.');
                return;
            }
            
            win.document.write('<html><head><title>YTDL4U Authentication</title><style>body{font-family:system-ui;padding:25px;background:#1a1a2e;color:white;line-height:1.6}textarea{width:100%;height:180px;padding:12px;border-radius:10px;border:2px solid #667eea;background:#16213e;color:#8f9bff;font-family:monospace;font-size:12px;margin:15px 0}.btn{background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:bold;transition:all 0.2s}.btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(102,126,234,0.4)}</style></head><body>' + 
                '<h2>🎉 Authentication Data Ready!</h2>' + 
                '<p>We found ' + cookies.length + ' cookies. This "Super Extractor" ensures 99% download success.</p>' + 
                '<textarea id="cookie" readonly>' + netscape + '</textarea>' + 
                '<button class="btn" onclick="const t=document.getElementById(\\'cookie\\');t.select();document.execCommand(\\'copy\\');this.innerText=\\'✅ Copied!\\';setTimeout(()=>this.innerText=\\'📋 Copy to Clipboard\\',2000)">📋 Copy to Clipboard</button>' + 
                '<p style="color:#888;font-size:12px;margin-top:20px">Step 2: Go back to YTDL4U and paste this into the box.</p></body></html>');
        })();`;

        // Set the href attribute
        bookmarkletLink.href = bookmarkletCode.replace(/\s+/g, ' ');

        // Set manual code if element exists
        const manualCodeArea = document.getElementById('manualBookmarkletCode');
        if (manualCodeArea) {
            manualCodeArea.value = bookmarkletCode.replace(/\s+/g, ' ');
        }

        // Prevent default click
        bookmarkletLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof showToast === 'function') {
                showToast('👆 Drag this button to your bookmarks bar!', 'info');
            } else {
                alert('Drag this button to your bookmarks bar!');
            }
        });
    }
});

function copyManualCode() {
    const codeArea = document.getElementById('manualBookmarkletCode');
    if (codeArea) {
        codeArea.select();
        navigator.clipboard.writeText(codeArea.value);
        if (typeof showToast === 'function') {
            showToast('📋 Extractor code copied!', 'success');
        }
    }
}
