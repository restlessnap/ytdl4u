# YTDL4U - Premium YouTube Downloader 🎬

A beautiful, fast, and free YouTube downloader with support for multiple formats and qualities. Built with a stunning Vercel-inspired UI and powered by yt-dlp.

![YTDL4U Preview](https://img.shields.io/badge/Status-Ready-success)

## ✨ Features

- **🎯 Multiple Formats**: Download as MP4 video or MP3 audio
- **📊 Quality Options**: From 360p to 4K (2160p) for videos, up to 320kbps for audio
- **⚡ Batch Downloads**: Process multiple URLs at once
- **🎨 Premium UI**: Vercel-inspired design with glassmorphism and smooth animations
- **🔒 Privacy First**: No tracking, no ads, no data collection
- **💯 Free Hosting**: Runs on Render.com free tier

## 🏗️ Architecture

- **Frontend**: Static HTML/CSS/JS (can be hosted on Cloudflare Pages, Vercel, Netlify, etc.)
- **Backend**: Python Flask + yt-dlp on Render.com

## 🚀 Quick Start

### Option 1: Deploy to Render.com (Recommended)

1. **Fork this repository** to your GitHub account

2. **Create a new Web Service** on [Render.com](https://render.com):
   - Connect your GitHub repository
   - Select the `backend` directory as the root
   - Render will automatically detect the `render.yaml` configuration
   - Click "Create Web Service"

3. **Update the frontend** with your Render URL:
   - Open `app.js`
   - Replace `https://ytdl4u-backend.onrender.com` with your actual Render URL (line 4)

4. **Deploy the frontend** to Cloudflare Pages, Vercel, or Netlify:
   - Connect your repository
   - Set build directory to root (or just upload `index.html`, `styles.css`, `app.js`)
   - Deploy!

### Option 2: Local Development

1. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the backend**:
   ```bash
   python app.py
   ```
   Backend will run on `http://localhost:10000`

3. **Serve the frontend**:
   ```bash
   # In the root directory
   python -m http.server 8000
   ```
   Frontend will be available at `http://localhost:8000`

## 📁 Project Structure

```
ytdl4u/
├── index.html          # Main HTML file
├── styles.css          # Vercel-inspired styling
├── app.js             # Frontend logic
├── backend/
│   ├── app.py         # Flask backend with yt-dlp
│   ├── requirements.txt
│   └── render.yaml    # Render.com configuration
├── worker.js          # (Optional) Cloudflare Worker alternative
└── README.md
```

## 🎨 Design Features

- **Glassmorphism**: Frosted glass effect on cards
- **Gradient Accents**: Beautiful purple-blue gradients
- **Smooth Animations**: Micro-interactions on hover and click
- **Responsive Design**: Works perfectly on mobile and desktop
- **Dark Mode**: Sleek dark theme by default
- **Toast Notifications**: Real-time feedback for user actions

## ⚙️ Configuration

### Backend (app.py)

The backend automatically handles:
- Video quality selection
- Format conversion (MP4, MP3)
- File cleanup (removes files older than 1 hour)
- CORS for cross-origin requests

### Frontend (app.js)

Update the `API_URL` constant to point to your backend:

```javascript
const API_URL = 'https://your-backend-url.onrender.com';
```

## 🔧 Customization

### Change Color Scheme

Edit CSS variables in `styles.css`:

```css
:root {
    --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Add your custom colors */
}
```

### Add More Formats

Update the format buttons in `index.html` and add handling in `app.py`.

## 📊 API Endpoints

### `POST /api/download`

Download a video.

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=...",
  "format": "mp4",
  "quality": "1080"
}
```

**Response:**
```json
{
  "success": true,
  "title": "Video Title",
  "downloadId": "uuid",
  "filename": "video.mp4",
  "downloadUrl": "/api/file/uuid"
}
```

### `GET /api/file/:downloadId`

Retrieve the downloaded file.

### `GET /health`

Health check endpoint.

## ⚠️ Important Notes

### Render.com Free Tier Limitations

- **Cold Starts**: Service spins down after 15 minutes of inactivity
- **RAM**: 512MB limit (large videos may fail)
- **Bandwidth**: Limited monthly bandwidth

### Recommendations

- For production use, consider upgrading to a paid tier
- Implement rate limiting to prevent abuse
- Add authentication if needed
- Consider using a CDN for the frontend

## 🛠️ Troubleshooting

### "Backend service unavailable"

The Render free tier spins down after inactivity. The first request after spin-down takes ~60 seconds to start up. Just wait and try again.

### "Download failed"

- Check if the YouTube URL is valid
- Some videos may be restricted or unavailable
- Large videos (>500MB) may fail on free tier due to RAM limits

### CORS Errors

Make sure your backend URL in `app.js` matches your actual Render deployment URL.

## 📝 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🙏 Credits

- Built with [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- Inspired by Vercel's design system
- Icons from custom SVG designs

## 🔗 Links

- [Render.com](https://render.com)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)
- [Cloudflare Pages](https://pages.cloudflare.com)

---

Made with ❤️ for the community • No ads, no tracking, just downloads
