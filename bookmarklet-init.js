// Bookmarklet initialization script
// This version is optimized for maximum reliability and strict Netscape format compliance

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarkletLink');

    if (bookmarkletLink) {
        // Create the code as a single string to avoid template literal bugs
        const lines = [
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
            "  var w=window.open('','_blank','width=600,height=450');",
            "  if(!w){alert('🚀 Popup blocked! Please allow popups for YouTube.');return;}",
            "  var html='<html><head><title>YTDL4U Auth</title><style>body{font-family:system-ui;padding:25px;background:#1a1a2e;color:white;line-height:1.6}textarea{width:100%;height:200px;padding:12px;border-radius:10px;border:2px solid #667eea;background:#16213e;color:#8f9bff;font-family:monospace;font-size:12px;margin:15px 0}.btn{background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:bold;display:block;width:100%}</style></head><body>'+",
            "    '<h2>🎉 Authentication Ready</h2>'+",
            "    '<p>We found '+c.length+' session cookies. Copy the code below and paste it into YTDL4U.</p>'+",
            "    \"<textarea id='c' readonly>\"+n+\"</textarea>\"+",
            "    '<button class=\"btn\" onclick=\"var t=document.getElementById(\\'c\\');t.select();document.execCommand(\\'copy\\');this.innerText=\\'✅ Copied!\\';setTimeout(function(){document.querySelector(\\'button\\').innerText=\\'📋 Copy to Clipboard\\'},2000)\">📋 Copy to Clipboard</button>'+",
            "    '</body></html>';",
            "  w.document.write(html);",
            "  w.document.close();",
            "})();"
        ];

        const bookmarkletCode = "javascript:" + lines.join("");

        // Set the href attribute
        bookmarkletLink.href = bookmarkletCode;

        // Set manual code area
        const manualCodeArea = document.getElementById('manualBookmarkletCode');
        if (manualCodeArea) {
            manualCodeArea.value = bookmarkletCode;
        }

        // Help toast on click
        bookmarkletLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof showToast === 'function') {
                showToast('👆 Drag this button to your bookmarks bar!', 'info');
            }
        });

        console.log('✅ Bookmarklet Initialized');
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
