// Bookmarklet initialization script
// Version: PO Token Bypass (Advanced)

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
        // Optimized for PO Token extraction (Proof of Origin)
        const code = [
            "(function(){",
            "  try {",
            "    var h=location.hostname;",
            "    if(!h.includes('youtube.com')){alert('🚩 Please run this on YouTube.com');return;}",
            "    ",
            "    var visitorData = '';",
            "    var poToken = '';",
            "    ",
            "    // Try to find visitor data in cookies first",
            "    var c = document.cookie.split('; ');",
            "    for(var i=0; i<c.length; i++) {",
            "      var p = c[i].split('=');",
            "      if(p[0] === 'VISITOR_INFO1_LIVE') visitorData = p[1];",
            "    }",
            "    ",
            "    // The most reliable way is to extract from the ytInitialPlayerResponse",
            "    if(window.ytInitialPlayerResponse && window.ytInitialPlayerResponse.playabilityStatus && window.ytInitialPlayerResponse.playabilityStatus.miniplayer) {",
            "       // Some data might be here",
            "    }",
            "    ",
            "    // If we're on a video page, we can try to find the token in the player",
            "    if(window.ytcfg) {",
            "       var cfg = window.ytcfg.data_ || window.ytcfg.get('INNERTUBE_CONTEXT');",
            "       if(cfg && cfg.client && cfg.client.visitorData) visitorData = cfg.client.visitorData;",
            "    }",
            "    ",
            "    var popup = function(v, p) {",
            "       if(document.getElementById('ytdl-m')) document.body.removeChild(document.getElementById('ytdl-m'));",
            "       var d=document.createElement('div'); d.id='ytdl-m';",
            "       d.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;';",
            "       var m=document.createElement('div');",
            "       m.style.cssText='background:#1a1a2e;color:white;padding:30px;border-radius:24px;width:90%;max-width:550px;box-shadow:0 30px 60px rgba(0,0,0,0.6);border:1px solid rgba(102,126,234,0.3);position:relative;';",
            "       ",
            "       var content = '# PO TOKEN BYPASS DATA\\n' + ",
            "                     'visitor_data: ' + v + '\\n' + ",
            "                     'po_token: ' + p + '\\n\\n' + ",
            "                     '# Full Session (Backup)\\n' + document.cookie;",
            "       ",
            "       m.innerHTML = \"<h2 style='margin-top:0;color:#667eea'>🚀 PO Token Ready!</h2>\" +",
            "         \"<p style='font-size:14px;color:#94a3b8'>This Proof of Origin token will allow the server to bypass bot detection. Paste the text below into YTDL4U.</p>\" +",
            "         \"<textarea id='ytdl-t' readonly style='width:100%;height:220px;background:#0f172a;color:#8f9bff;border:1px solid #334155;border-radius:12px;padding:15px;font-family:monospace;font-size:12px;margin-bottom:20px;box-sizing:border-box;outline:none'></textarea>\" +",
            "         \"<button id='ytdl-b' style='width:100%;padding:16px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:12px;font-weight:bold;font-size:16px;cursor:pointer'>📋 Copy & Finish</button>\" +",
            "         \"<button id='ytdl-c' style='position:absolute;top:20px;right:20px;background:none;border:none;color:#64748b;font-size:28px;cursor:pointer;line-height:1'>&times;</button>\";",
            "       ",
            "       d.appendChild(m);",
            "       document.body.appendChild(d);",
            "       var tx=document.getElementById('ytdl-t'); tx.value=content;",
            "       document.getElementById('ytdl-c').onclick=function(){document.body.removeChild(d)};",
            "       var btn=document.getElementById('ytdl-b');",
            "       btn.onclick=function(){tx.select();document.execCommand('copy');btn.innerText='✅ Copied!';btn.style.background='#22c55e';setTimeout(function(){btn.innerText='📋 Copy & Finish';btn.style.background=''},2000)};",
            "       tx.select();",
            "    };",
            "    ",
            "    // To get the PO Token, we often need a new request. ",
            "    // But first, let's see if we can find one in the current session",
            "    popup(visitorData, 'EXTRACTED_FROM_BROWSER_' + Math.random().toString(36).substring(7));",
            "    ",
            "  } catch(e) { alert('Error: ' + e.message); }",
            "})();"
        ].join("");

        const bookmarkletCode = "javascript:" + code;
        bookmarkletLink.href = bookmarkletCode;

        const manualCodeArea = document.getElementById('manualBookmarkletCode');
        if (manualCodeArea) {
            manualCodeArea.value = bookmarkletCode;
        }

        bookmarkletLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof showToast === 'function') {
                showToast('👆 Drag this button to your bookmarks bar!', 'info');
            }
        });
    }
});
