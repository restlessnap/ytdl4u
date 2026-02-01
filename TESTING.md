# Test URLs for YTDL4U

Use these YouTube URLs to test your downloader:

## Short Videos (Quick Testing)

1. **YouTube Shorts** (~1 min)
   ```
   https://www.youtube.com/shorts/example
   ```

2. **Music Video** (~3-4 min)
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

## Testing Different Formats

### MP4 Video Test
- Paste URL
- Select "MP4 Video"
- Choose quality (1080p recommended)
- Click "Download Now"

### MP3 Audio Test
- Paste URL
- Select "MP3 Audio"
- Choose quality (320 kbps recommended)
- Click "Download Now"

## Batch Download Test

Paste multiple URLs (one per line):
```
https://www.youtube.com/watch?v=VIDEO_ID_1
https://www.youtube.com/watch?v=VIDEO_ID_2
https://www.youtube.com/watch?v=VIDEO_ID_3
```

## Expected Behavior

### Success Flow
1. URL is validated ✓
2. Toast notification: "Processing: VIDEO_ID"
3. Queue item appears with progress bar
4. Progress reaches 100%
5. Download starts automatically
6. Toast notification: "Download ready: [Video Title]"
7. Download counter increments

### Error Scenarios

**Invalid URL:**
- Toast: "Please enter a valid YouTube URL"

**Backend Offline (Cold Start):**
- Toast: "Backend service unavailable. It may be starting up (takes ~1 min on free tier)."
- Wait 60 seconds and try again

**Download Failed:**
- Queue item shows error status (red dot)
- Toast: "Download failed: [error message]"

## Testing Checklist

- [ ] Single MP4 download (1080p)
- [ ] Single MP4 download (720p)
- [ ] Single MP3 download (320 kbps)
- [ ] Single MP3 download (128 kbps)
- [ ] Batch download (3+ videos)
- [ ] Invalid URL handling
- [ ] Paste button functionality
- [ ] Tab switching (Single ↔ Batch)
- [ ] Format switching (MP4 ↔ MP3)
- [ ] Quality selection
- [ ] Download counter persistence (refresh page)
- [ ] Mobile responsive design
- [ ] Toast notifications
- [ ] Queue management

## Performance Testing

### Local Backend
- Response time: < 1 second
- Download start: Immediate

### Render.com (Warm)
- Response time: 1-3 seconds
- Download start: 2-5 seconds

### Render.com (Cold Start)
- First response: 30-60 seconds
- Subsequent requests: Fast

## Notes

- Always test with short videos first (< 5 minutes)
- Large videos (> 500MB) may fail on free tier
- Some videos may be geo-restricted or unavailable
- Age-restricted videos may require authentication (not implemented)

## Troubleshooting

**"Failed to fetch"**
- Backend is not running
- Check backend URL in app.js
- Verify backend health: `https://your-backend.onrender.com/health`

**"Invalid YouTube URL"**
- URL format is incorrect
- Must be youtube.com or youtu.be
- Must include video ID

**Download doesn't start**
- Check browser's download settings
- Check browser console for errors
- Try different browser

**Video quality not available**
- Requested quality may not exist for this video
- Backend will automatically fall back to best available
- Check backend logs for details
