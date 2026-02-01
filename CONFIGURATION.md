# YTDL4U Configuration Guide

## 🎨 Customizing the Design

### Changing Colors

Edit `styles.css` and modify the CSS variables:

```css
:root {
    /* Background colors */
    --bg-primary: #000000;        /* Main background */
    --bg-secondary: #0a0a0a;      /* Secondary background */
    --bg-tertiary: #111111;       /* Card backgrounds */
    
    /* Text colors */
    --text-primary: #ffffff;      /* Main text */
    --text-secondary: #a1a1a1;    /* Secondary text */
    
    /* Accent gradients - CUSTOMIZE THESE! */
    --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --accent-gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
```

### Popular Color Schemes

**Sunset Orange:**
```css
--accent-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
```

**Ocean Blue:**
```css
--accent-gradient: linear-gradient(135deg, #2196f3 0%, #00bcd4 100%);
```

**Forest Green:**
```css
--accent-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
```

**Neon Pink:**
```css
--accent-gradient: linear-gradient(135deg, #ff6ec4 0%, #7873f5 100%);
```

## ⚙️ Backend Configuration

### Changing Port

Edit `backend/app.py`, line at the bottom:

```python
port = int(os.environ.get('PORT', 10000))  # Change 10000 to your port
```

### Adding Rate Limiting

Install flask-limiter:
```bash
pip install flask-limiter
```

Add to `backend/app.py`:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/download', methods=['POST'])
@limiter.limit("10 per minute")  # Max 10 downloads per minute
def download_video():
    # ... existing code
```

### Custom Download Directory

Edit `backend/app.py`:

```python
# Change this line
DOWNLOAD_DIR = tempfile.gettempdir()

# To this (create a custom directory)
DOWNLOAD_DIR = '/path/to/your/downloads'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)
```

### Increasing File Retention

Edit `backend/app.py`, in the `cleanup_old_files` function:

```python
if current_time - file.stat().st_mtime > 3600:  # Change 3600 (1 hour)
```

Change to:
- `7200` for 2 hours
- `86400` for 24 hours
- `604800` for 1 week

## 🔧 Frontend Configuration

### Changing API Endpoint

Edit `app.js`, line 2-4:

```javascript
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:10000'
    : 'https://your-backend.onrender.com';  // CHANGE THIS
```

### Adding More Quality Options

Edit `index.html`, add to quality grid:

```html
<button class="quality-btn" data-quality="480">SD (480p)</button>
```

### Changing Default Quality

Edit `app.js`, in the state object:

```javascript
const state = {
    singleQuality: '1080',  // Change to '720', '480', etc.
    singleAudioQuality: '320',  // Change to '256', '192', '128'
    // ...
};
```

## 📱 Adding Mobile App Features

### Install Prompt (PWA)

Create `manifest.json`:

```json
{
  "name": "YTDL4U",
  "short_name": "YTDL4U",
  "description": "YouTube Downloader",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add to `index.html` head:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#667eea">
```

## 🔐 Adding Authentication

### Simple Password Protection

Add to `backend/app.py`:

```python
from functools import wraps
from flask import request

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization')
        if auth != 'Bearer YOUR_SECRET_TOKEN':
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/download', methods=['POST'])
@require_auth
def download_video():
    # ... existing code
```

Update `app.js`:

```javascript
const response = await fetch(`${API_URL}/api/download`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_SECRET_TOKEN'
    },
    body: JSON.stringify({ url, format, quality })
});
```

## 📊 Adding Analytics

### Simple Download Counter

Backend already tracks downloads. To add analytics:

1. Use Google Analytics
2. Add to `index.html` head:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

3. Track downloads in `app.js`:

```javascript
function updateDownloadCount() {
    state.totalDownloads++;
    elements.totalDownloadsEl.textContent = state.totalDownloads;
    
    // Track with Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'engagement',
            'event_label': item.format
        });
    }
}
```

## 🌐 Custom Domain

### Cloudflare Pages

1. Go to your Pages project
2. Click "Custom domains"
3. Add your domain
4. Update DNS records as instructed

### Render Backend

1. Go to your Render service
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update DNS with provided CNAME

## 🎯 Advanced Features

### Progress Bar (Real-time)

This requires WebSockets. Add to `backend/requirements.txt`:
```
flask-socketio==5.3.0
```

Implement in `backend/app.py`:
```python
from flask_socketio import SocketIO, emit

socketio = SocketIO(app, cors_allowed_origins="*")

# Emit progress updates during download
def progress_hook(d):
    if d['status'] == 'downloading':
        socketio.emit('progress', {
            'percent': d.get('_percent_str', '0%'),
            'speed': d.get('_speed_str', 'N/A')
        })
```

### Download History

Add to `app.js`:

```javascript
// Save to localStorage
function saveToHistory(item) {
    let history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
    history.unshift({
        title: item.title,
        format: item.format,
        date: new Date().toISOString()
    });
    history = history.slice(0, 50); // Keep last 50
    localStorage.setItem('downloadHistory', JSON.stringify(history));
}
```

## 🐛 Debug Mode

Add to `app.js`:

```javascript
const DEBUG = true;  // Set to false in production

function log(...args) {
    if (DEBUG) console.log('[YTDL4U]', ...args);
}

// Use throughout code
log('Processing download:', item);
```

## 📝 Notes

- Always test changes locally before deploying
- Keep your API keys and tokens secret
- Monitor your Render usage to avoid overages
- Consider implementing caching for frequently downloaded videos
