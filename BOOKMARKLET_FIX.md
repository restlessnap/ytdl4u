# Quick Fix for Bookmarklet Display Issue

## Problem
The bookmarklet code is showing as raw text in the HTML because of escaping issues.

## Solution
I've created `bookmarklet-init.js` which sets the bookmarklet href dynamically.

## Steps to Fix:

### 1. Add the script to index.html

Find this line near the end of index.html (before `</body>`):
```html
<script src="auth-v2.js"></script>
```

Add this line BEFORE it:
```html
<script src="bookmarklet-init.js"></script>
```

So it looks like:
```html
<script src="bookmarklet-init.js"></script>
<script src="auth-v2.js"></script>
<script src="app.js"></script>
```

### 2. Fix the bookmarklet link in index.html

Find the bookmarklet section (around line 276-291) and replace it with:

```html
<div class="bookmarklet-container">
    <a href="#" id="bookmarkletLink" class="bookmarklet-btn" draggable="true">
        🔖 YTDL4U Cookie Extractor
    </a>
    <div class="bookmarklet-arrow">👆 Drag this to your bookmarks bar</div>
</div>
```

That's it! The JavaScript will populate the href automatically.

## Alternative: Manual Bookmarklet

If you want users to be able to create it manually, add this to the modal:

```html
<details style="margin-top: 10px;">
    <summary style="cursor: pointer; color: #667eea;">Or create bookmarklet manually</summary>
    <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
        <p style="font-size: 13px; margin-bottom: 10px;">Copy this code and create a new bookmark with it as the URL:</p>
        <textarea readonly style="width: 100%; height: 80px; font-family: monospace; font-size: 11px; padding: 8px; background: #16213e; color: white; border: 1px solid #667eea; border-radius: 4px;" onclick="this.select()">javascript:(function(){const c=document.cookie;const m=c.match(/VISITOR_INFO1_LIVE=([^;]+)/);if(m){const v=m[1];const w=window.open('','_blank','width=500,height=300');w.document.write('<html><head><title>YouTube Cookie</title><style>body{font-family:system-ui;padding:20px;background:#1a1a2e;color:white}textarea{width:100%;height:100px;padding:10px;border-radius:8px;border:1px solid #667eea;background:#16213e;color:white;font-family:monospace}.btn{background:#667eea;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;margin-top:10px}.btn:hover{background:#764ba2}</style></head><body><h2>🎉 Cookie Extracted!</h2><p>Copy this value and paste it into YTDL4U:</p><textarea id="cookie" readonly>'+v+'</textarea><button class="btn" onclick="navigator.clipboard.writeText(document.getElementById(\\'cookie\\').value);alert(\\'Copied!\\')">📋 Copy to Clipboard</button><p style="color:#888;font-size:12px;margin-top:20px">Close this window and paste into YTDL4U</p></body></html>')}else{alert('Please run this on YouTube.com')}})();</textarea>
    </div>
</details>
```

This gives users a fallback if drag-and-drop doesn't work.
