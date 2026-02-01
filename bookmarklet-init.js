// Bookmarklet initialization script
// Version: Stable Modal (Final)

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
        // This version is focused on 100% stability and avoiding reloads
        const code = [
            "(function(){",
            "  try {",
            "    var h=location.hostname;",
            "    if(!h.includes('youtube.com')){alert('🚩 Please run this on YouTube.com');return;}",
            "    var c=document.cookie.split('; ');",
            "    if(c.length<1 || (c.length==1 && c[0]=='')){alert('🍪 No cookies found. Please sign in to YouTube.');return;}",
            "    var n='# Netscape HTTP Cookie File\\n';",
            "    for(var i=0;i<c.length;i++){",
            "      var p=c[i].split('=');",
            "      if(p.length>=2){",
            "        var k=p[0].trim(),v=p.slice(1).join('=');",
            "        n+='.youtube.com\\tTRUE\\t/\\tTRUE\\t2147483647\\t'+k+'\\t'+v+'\\n';",
            "      }",
            "    }",
            "    if(document.getElementById('ytdl-m')) document.body.removeChild(document.getElementById('ytdl-m'));",
            "    var d=document.createElement('div');",
            "    d.id='ytdl-m';",
            "    d.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';",
            "    var m=document.createElement('div');",
            "    m.style.cssText='background:#1a1a2e;color:white;padding:30px;border-radius:20px;width:90%;max-width:500px;box-shadow:0 20px 50px rgba(0,0,0,0.5);border:1px solid #334155;position:relative;';",
            "    m.innerHTML='<h2 style=\"margin-top:0;color:#667eea\">🎉 Data Ready!</h2>' +",
            "      '<p style=\"font-size:14px;color:#94a3b8\">Copy the code below and paste it into YTDL4U.</p>' +",
            "      '<textarea id=\"ytdl-t\" readonly style=\"width:100%;height:180px;background:#0f172a;color:#8f9bff;border:1px solid #334155;border-radius:10px;padding:12px;font-family:monospace;font-size:12px;margin:15px 0;box-sizing:border-box;outline:none\"></textarea>' +",
            "      '<button id=\"ytdl-b\" style=\"width:100%;padding:14px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:10px;font-weight:bold;cursor:pointer\">📋 Copy to Clipboard</button>' +",
            "      '<button id=\"ytdl-c\" style=\"position:absolute;top:15px;right:15px;background:none;border:none;color:#64748b;font-size:24px;cursor:pointer\">&times;</button>';",
            "    d.appendChild(m);",
            "    document.body.appendChild(d);",
            "    var tx=document.getElementById('ytdl-t');tx.value=n;",
            "    document.getElementById('ytdl-c').onclick=function(){document.body.removeChild(d)};",
            "    var btn=document.getElementById('ytdl-b');",
            "    btn.onclick=function(){tx.select();document.execCommand('copy');btn.innerText='✅ Copied!';btn.style.background='#22c55e';setTimeout(function(){btn.innerText='📋 Copy to Clipboard';btn.style.background=''},2000)};",
            "    tx.select();",
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

        console.log('✅ Bookmarklet Re-Initialized (Stable)');
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
