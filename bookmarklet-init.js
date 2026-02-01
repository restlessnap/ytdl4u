// Bookmarklet initialization script
// Version: Injected Modal (Maximum Reliability)

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
        // This version injects a modal directly into the YouTube page
        // No popups = no blocks and no blank windows
        const code = [
            "(function(){",
            "  var h=location.hostname;",
            "  if(!h.includes('youtube.com')){alert('🚩 Please run this on YouTube.com');return;}",
            "  var c=document.cookie.split('; ');",
            "  if(c.length<1 || (c.length==1 && c[0]=='')){alert('🍪 No cookies found. Please sign in to YouTube.');return;}",
            "  var n='# Netscape HTTP Cookie File\\n';",
            "  for(var i=0;i<c.length;i++){",
            "    var p=c[i].split('=');",
            "    if(p.length>=2){",
            "      var k=p[0],v=p.slice(1).join('=');",
            "      n+='.youtube.com\\tTRUE\\t/\\tTRUE\\t2147483647\\t'+k+'\\t'+v+'\\n';",
            "    }",
            "  }",
            "  var d=document.createElement('div');",
            "  d.id='ytdl4u-modal';",
            "  d.style='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';",
            "  var m=document.createElement('div');",
            "  m.style='background:#1a1a2e;color:white;padding:30px;border-radius:20px;width:90%;max-width:500px;box-shadow:0 20px 50px rgba(0,0,0,0.5);border:1px solid #334155;position:relative;';",
            "  var h2=document.createElement('h2');h2.innerText='🎉 Auth Data Ready!';h2.style='margin-top:0;color:#667eea;';",
            "  var p1=document.createElement('p');p1.innerText='We found '+c.length+' session cookies. Copy the code below and paste it into YTDL4U.';p1.style='font-size:14px;color:#94a3b8;';",
            "  var tx=document.createElement('textarea');tx.value=n;tx.readOnly=true;",
            "  tx.style='width:100%;height:180px;background:#16213e;color:#8f9bff;border:2px solid #667eea;border-radius:10px;padding:12px;font-family:monospace;font-size:12px;margin:15px 0;box-sizing:border-box;';",
            "  var btn=document.createElement('button');btn.innerText='📋 Copy to Clipboard';",
            "  btn.style='width:100%;padding:14px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:10px;font-weight:bold;cursor:pointer;transition:0.2s;';",
            "  btn.onclick=function(){tx.select();document.execCommand('copy');btn.innerText='✅ Copied!';setTimeout(function(){btn.innerText='📋 Copy to Clipboard'},2000)};",
            "  var cls=document.createElement('button');cls.innerText='×';cls.style='position:absolute;top:15px;right:15px;background:none;border:none;color:#64748b;font-size:24px;cursor:pointer;';",
            "  cls.onclick=function(){document.body.removeChild(d)};",
            "  m.appendChild(cls);m.appendChild(h2);m.appendChild(p1);m.appendChild(tx);m.appendChild(btn);",
            "  d.appendChild(m);document.body.appendChild(d);",
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
