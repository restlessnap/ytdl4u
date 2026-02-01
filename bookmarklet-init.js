// Bookmarklet initialization script
// Version: Ultimate PO Token Extractor (Trusted Types Safe)

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
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
            "       var cfg = window.ytcfg.data_ || (window.ytcfg.get ? window.ytcfg.get('INNERTUBE_CONTEXT') : null);",
            "       if(cfg && cfg.client && cfg.client.visitorData) visitorData = cfg.client.visitorData;",
            "    }",
            "    ",
            "    var modalId = 'ytdl-modal-' + Date.now();",
            "    if(document.getElementById('ytdl-m')) document.body.removeChild(document.getElementById('ytdl-m'));",
            "    ",
            "    var d=document.createElement('div'); d.id='ytdl-m';",
            "    d.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;';",
            "    ",
            "    var m=document.createElement('div');",
            "    m.style.cssText='background:#1a1a2e;color:white;padding:30px;border-radius:24px;width:90%;max-width:550px;box-shadow:0 30px 60px rgba(0,0,0,0.6);border:1px solid rgba(102,126,234,0.3);position:relative;';",
            "    ",
            "    var h2=document.createElement('h2'); h2.innerText='🚀 Authentication Ready'; h2.style.cssText='margin-top:0;color:#667eea;font-size:24px;';",
            "    var p1=document.createElement('p'); p1.innerText='Click the button below to copy your session data, then paste it into YTDL4U.'; p1.style.cssText='font-size:14px;color:#94a3b8;margin-bottom:20px;';",
            "    ",
            "    var content = '# PO TOKEN BYPASS DATA\\n' + ",
            "                  'visitor_data: ' + visitorData + '\\n' + ",
            "                  'po_token: AUTO_GENERATED_BY_SERVER\\n\\n' + ",
            "                  '# Netscape HTTP Cookie File\\n';",
            "    ",
            "    for(var i=0; i<c.length; i++) {",
            "      var p = c[i].split('=');",
            "      if(p.length>=2) {",
            "        content += '.youtube.com\\tTRUE\\t/\\tTRUE\\t2147483647\\t' + p[0].trim() + '\\t' + p.slice(1).join('=') + '\\n';",
            "      }",
            "    }",
            "    ",
            "    var tx=document.createElement('textarea'); tx.readOnly=true; tx.value=content;",
            "    tx.style.cssText='width:100%;height:180px;background:#0f172a;color:#8f9bff;border:1px solid #334155;border-radius:12px;padding:15px;font-family:monospace;font-size:12px;margin-bottom:20px;box-sizing:border-box;outline:none;';",
            "    ",
            "    var btn=document.createElement('button'); btn.innerText='📋 Copy & Finish';",
            "    btn.style.cssText='width:100%;padding:16px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:12px;font-weight:bold;font-size:16px;cursor:pointer;transition:0.2s;';",
            "    ",
            "    var cls=document.createElement('button'); cls.innerText='×'; ",
            "    cls.style.cssText='position:absolute;top:20px;right:20px;background:none;border:none;color:#64748b;font-size:28px;cursor:pointer;line-height:1;';",
            "    ",
            "    cls.onclick=function(){document.body.removeChild(d)};",
            "    btn.onclick=function(){tx.select();document.execCommand('copy');btn.innerText='✅ Copied! Now paste into YTDL4U';btn.style.background='#22c55e';setTimeout(function(){btn.innerText='📋 Copy & Finish';btn.style.background=''},3000)};",
            "    ",
            "    m.appendChild(cls); m.appendChild(h2); m.appendChild(p1); m.appendChild(tx); m.appendChild(btn);",
            "    d.appendChild(m); document.body.appendChild(d); tx.select();",
            "    ",
            "  } catch(e) { alert('Extractor Error: ' + e.message); }",
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
