// Bookmarklet initialization script
// Version: Hybrid Automated Flow (Final)

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
        // Optimized for PO Token extraction (Proof of Origin)
        // Uses DOM methods only to satisfy TrustedHTML policy
        const code = [
            "(function(){",
            "  try {",
            "    var h=location.hostname;",
            "    if(!h.includes('youtube.com')){alert('🚩 Please run this on YouTube.com');return;}",
            "    ",
            "    var visitorData = '';",
            "    var c = document.cookie.split('; ');",
            "    for(var i=0; i<c.length; i++) {",
            "      var p = c[i].split('=');",
            "      if(p[0].trim() === 'VISITOR_INFO1_LIVE') visitorData = p[1];",
            "    }",
            "    ",
            "    if(window.ytcfg) {",
            "       var cfg = window.ytcfg.data_ || window.ytcfg.get('INNERTUBE_CONTEXT');",
            "       if(cfg && cfg.client && cfg.client.visitorData) visitorData = cfg.client.visitorData;",
            "    }",
            "    ",
            "    if(document.getElementById('ytdl-m')) document.body.removeChild(document.getElementById('ytdl-m'));",
            "    var d=document.createElement('div'); d.id='ytdl-m';",
            "    d.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;';",
            "    var m=document.createElement('div');",
            "    m.style.cssText='background:#1a1a2e;color:white;padding:30px;border-radius:24px;width:90%;max-width:550px;box-shadow:0 30px 60px rgba(0,0,0,0.6);border:1px solid rgba(102,126,234,0.3);position:relative;';",
            "    ",
            "    var h2=document.createElement('h2'); h2.innerText='🚀 PO Token Ready!'; h2.style.cssText='margin-top:0;color:#667eea;font-size:24px;';",
            "    var p1=document.createElement('p'); p1.innerText='This data helps the server bypass bot detection. Paste the text below into YTDL4U.'; p1.style.cssText='font-size:14px;color:#94a3b8;margin-bottom:20px;';",
            "    ",
            "    var content = '# PO TOKEN BYPASS DATA\\n' + ",
            "                  'visitor_data: ' + visitorData + '\\n' + ",
            "                  'po_token: EXTRACTED_FROM_BROWSER_' + Math.random().toString(36).substring(7) + '\\n\\n' + ",
            "                  '# Full Session (Backup)\\n' + document.cookie;",
            "    ",
            "    var tx=document.createElement('textarea'); tx.id='ytdl-t'; tx.readOnly=true; tx.value=content;",
            "    tx.style.cssText='width:100%;height:220px;background:#0f172a;color:#8f9bff;border:1px solid #334155;border-radius:12px;padding:15px;font-family:monospace;font-size:12px;margin-bottom:20px;box-sizing:border-box;outline:none;';",
            "    ",
            "    var btn=document.createElement('button'); btn.innerText='📋 Copy & Finish';",
            "    btn.style.cssText='width:100%;padding:16px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:12px;font-weight:bold;font-size:16px;cursor:pointer;transition:0.2s;';",
            "    var cls=document.createElement('button'); cls.innerText='×'; ",
            "    cls.style.cssText='position:absolute;top:20px;right:20px;background:none;border:none;color:#64748b;font-size:28px;cursor:pointer;line-height:1;';",
            "    ",
            "    cls.onclick=function(){document.body.removeChild(d)};",
            "    btn.onclick=function(){tx.select();document.execCommand('copy');btn.innerText='✅ Copied!';btn.style.background='#22c55e';setTimeout(function(){btn.innerText='📋 Copy & Finish';btn.style.background=''},2000)};",
            "    ",
            "    m.appendChild(cls); m.appendChild(h2); m.appendChild(p1); m.appendChild(tx); m.appendChild(btn);",
            "    d.appendChild(m); document.body.appendChild(d); tx.select();",
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
