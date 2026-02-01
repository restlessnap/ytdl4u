# Deployment Guide for YTDL4U

## 🚀 Deploying to Render.com (Backend)

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ytdl4u.git
   git push -u origin main
   ```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 3: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your `ytdl4u` repository
3. Configure the service:
   - **Name**: `ytdl4u-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: `Free`

4. Add Environment Variables (optional):
   - `PYTHON_VERSION`: `3.11.0`

5. Click **"Create Web Service"**

6. Wait for deployment (takes 2-5 minutes)

7. **Copy your service URL** (e.g., `https://ytdl4u-backend.onrender.com`)

### Step 4: Update Frontend Configuration

1. Open `app.js` in your project
2. Find line 4 and update the API_URL:
   ```javascript
   const API_URL = 'https://YOUR-SERVICE-NAME.onrender.com';
   ```
3. Save the file

## 🌐 Deploying Frontend

You have several options for hosting the frontend:

### Option A: Cloudflare Pages (Recommended)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Click **"Create a project"**
3. Connect your GitHub repository
4. Configure:
   - **Project name**: `ytdl4u`
   - **Production branch**: `main`
   - **Build command**: Leave empty
   - **Build output directory**: `/`
5. Click **"Save and Deploy"**

### Option B: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Click **"Deploy"**

### Option C: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure:
   - **Build command**: Leave empty
   - **Publish directory**: `/`
5. Click **"Deploy site"**

### Option D: GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** section
3. Select source: **Deploy from a branch**
4. Select branch: `main` and folder: `/ (root)`
5. Click **"Save"**

## 🔧 Post-Deployment Configuration

### Enable CORS (if needed)

The backend already has CORS enabled. If you encounter issues:

1. Check that your frontend URL is making requests to the correct backend URL
2. Verify the backend is running: `https://your-backend.onrender.com/health`

### Test Your Deployment

1. Visit your frontend URL
2. Try downloading a YouTube video
3. First request may take 60 seconds (cold start on free tier)
4. Subsequent requests should be faster

## 📊 Monitoring

### Render Dashboard

- View logs: Render Dashboard → Your Service → Logs
- Check metrics: CPU, Memory usage
- Monitor deployments

### Health Check

Visit `https://your-backend.onrender.com/health` to verify backend is running.

## 🔄 Updating Your Deployment

### Backend Updates

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
2. Render automatically redeploys

### Frontend Updates

1. Update `app.js`, `index.html`, or `styles.css`
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push
   ```
3. Your hosting platform automatically redeploys

## ⚡ Performance Optimization

### Keep Backend Warm

Render free tier spins down after 15 minutes. To keep it warm:

1. Use a service like [UptimeRobot](https://uptimerobot.com):
   - Create a monitor for `https://your-backend.onrender.com/health`
   - Set interval to 14 minutes
   - This pings your service to keep it alive

2. Or use a cron job:
   ```bash
   */14 * * * * curl https://your-backend.onrender.com/health
   ```

### CDN for Frontend

All recommended frontend hosts (Cloudflare, Vercel, Netlify) include CDN by default.

## 🐛 Troubleshooting

### Backend won't start

- Check Render logs for errors
- Verify `requirements.txt` is correct
- Ensure Python version is compatible (3.11 recommended)

### CORS errors

- Verify `API_URL` in `app.js` matches your Render URL
- Check browser console for exact error
- Ensure backend has `flask-cors` installed

### Downloads fail

- Check Render logs for yt-dlp errors
- Some videos may be geo-restricted
- Large videos may exceed free tier RAM (512MB)

### Cold start is slow

- This is normal for Render free tier
- First request after 15 min takes ~60 seconds
- Consider upgrading to paid tier for instant starts

## 💰 Cost Breakdown

### Free Tier (Current Setup)

- **Render Backend**: Free (with limitations)
- **Cloudflare Pages**: Free (unlimited bandwidth)
- **Total**: $0/month

### Recommended Paid Tier

- **Render Starter**: $7/month (no cold starts, more RAM)
- **Cloudflare Pages**: Free
- **Total**: $7/month

## 🔐 Security Considerations

### Rate Limiting

Add rate limiting to prevent abuse:

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/download', methods=['POST'])
@limiter.limit("10 per minute")
def download_video():
    # ... existing code
```

### Authentication (Optional)

For private use, add basic auth:

```python
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username, password):
    if username == 'admin' and password == 'your-secret-password':
        return username
```

## 📝 Environment Variables

Create a `.env` file for local development:

```env
PORT=10000
FLASK_ENV=development
```

For production (Render), set in dashboard:
- `PYTHON_VERSION`: `3.11.0`
- `PORT`: Auto-set by Render

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend health check returns 200
- [ ] Frontend updated with correct API_URL
- [ ] Frontend deployed to hosting platform
- [ ] Test single video download
- [ ] Test batch download
- [ ] Test MP3 conversion
- [ ] Set up uptime monitoring (optional)
- [ ] Configure custom domain (optional)

## 🎉 You're Done!

Your YouTube downloader is now live and ready to use!

**Share your deployment**: Feel free to share your instance with friends, but be mindful of Render's free tier limitations.
