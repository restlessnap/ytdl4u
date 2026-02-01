// Bookmarklet initialization script
// Version: Session Hybrid (Maximum Success Rate)

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
        const code = [
            "(function(){",
            "  var h=location.hostname;",
            "  if(!h.includes('youtube.com')){alert('🚩 Please run this on YouTube.com');return;}",
            "  var c=document.cookie.split('; ');",
            "  if(c.length<1 || (c.length==1 && c[0]=='')){alert('🍪 No cookies found. Please sign in to YouTube.');return;}",
            "  var n='# Netscape HTTP Cookie File\\n';",
            "  var foundVisitor=false;",
            "  for(var i=0;i<c.length;i++){",
            "    var p=c[i].split('=');",
            "    if(p.length>=2){",
            "      var k=p[0],v=p.slice(1).join('=');",
            "      if(k=='VISITOR_INFO1_LIVE') foundVisitor=true;",
            "      n+='.youtube.com\\tTRUE\\t/\\tTRUE\\t2147483647\\t'+k+'\\t'+v+'\\n';",
            "    }",
            "  }",
            "  if(!foundVisitor){",
            "    console.warn('VISITOR_INFO1_LIVE missing, attempting to refresh cookies...');",
            "    location.reload();",
            "  }",
            "  var d=document.createElement('div');",
            "  d.id='ytdl4u-modal';",
            "  d.style='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;';",
            "  var m=document.createElement('div');",
            "  m.style='background:#1a1a2e;color:white;padding:35px;border-radius:24px;width:90%;max-width:550px;box-shadow:0 30px 60px rgba(0,0,0,0.6);border:1px solid rgba(102,126,234,0.3);position:relative;animation:ytdlIn 0.3s ease;';",
            "  var style=document.createElement('style');style.innerHTML='@keyframes ytdlIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}';document.head.appendChild(style);",
            "  var h2=document.createElement('h2');h2.innerText='🚀 Authentication Ready';h2.style='margin-top:0;color:#667eea;font-size:24px;';",
            "  var p1=document.createElement('p');p1.innerText='We successfully captured your session headers. This will allow the server to bypass bot detection by acting as your browser.';p1.style='font-size:14px;color:#94a3b8;margin-bottom:20px;';",
            "  var tx=document.createElement('textarea');tx.value=n;tx.readOnly=true;",
            "  tx.style='width:100%;height:220px;background:#0f172a;color:#8f9bff;border:1px solid #334155;border-radius:12px;padding:15px;font-family:monospace;font-size:12px;margin-bottom:20px;box-sizing:border-box;outline:none;';",
            "  var btn=document.createElement('button');btn.innerText='📋 Copy & Finish';",
            "  btn.style='width:100%;padding:16px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:12px;font-weight:bold;font-size:16px;cursor:pointer;transition:0.2s;box-shadow:0 4px 15px rgba(102,126,234,0.3);';",
            "  btn.onclick=function(){tx.select();document.execCommand('copy');btn.innerText='✅ Copied! Close this and paste into YTDL4U';setTimeout(function(){btn.style.background=\\'#22c55e\\'},100)};",
            "  var cls=document.createElement('button');cls.innerText='×';cls.style='position:absolute;top:20px;right:20px;background:none;border:none;color:#64748b;font-size:28px;cursor:pointer;line-height:1;';",
            "  cls.onclick=function(){document.body.removeChild(d)};",
            "  m.appendChild(cls);m.appendChild(h2);m.appendChild(p1);m.appendChild(tx);m.appendChild(btn);",
            "  d.appendChild(m);document.body.appendChild(d);",
            "  tx.select();",
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
