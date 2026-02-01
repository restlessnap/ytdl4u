from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import tempfile
import uuid
from pathlib import Path
import threading
import time

app = Flask(__name__)
CORS(app)

# Store download status in memory (for free tier)
download_status = {}

# Cleanup old files periodically
DOWNLOAD_DIR = tempfile.gettempdir()

def cleanup_old_files():
    """Remove files older than 1 hour"""
    while True:
        try:
            current_time = time.time()
            for file in Path(DOWNLOAD_DIR).glob("ytdl4u_*"):
                if current_time - file.stat().st_mtime > 3600:  # 1 hour
                    file.unlink()
        except Exception as e:
            print(f"Cleanup error: {e}")
        time.sleep(600)  # Run every 10 minutes

# Start cleanup thread
cleanup_thread = threading.Thread(target=cleanup_old_files, daemon=True)
cleanup_thread.start()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "ytdl4u"})

@app.route('/api/info', methods=['POST'])
def get_video_info():
    """Get video information without downloading"""
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            # Bypass bot detection
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'extractor_args': {'youtube': {'player_client': ['android', 'web']}},
            'nocheckcertificate': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Get available formats
            formats = []
            if info.get('formats'):
                seen_heights = set()
                for f in info['formats']:
                    if f.get('height') and f['height'] not in seen_heights:
                        seen_heights.add(f['height'])
                        formats.append({
                            'quality': f['height'],
                            'ext': f.get('ext', 'mp4')
                        })
            
            return jsonify({
                "title": info.get('title', 'Unknown'),
                "duration": info.get('duration', 0),
                "thumbnail": info.get('thumbnail', ''),
                "uploader": info.get('uploader', 'Unknown'),
                "view_count": info.get('view_count', 0),
                "formats": sorted(formats, key=lambda x: x['quality'], reverse=True)
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download_video():
    """Download video and return file"""
    try:
        data = request.json
        url = data.get('url')
        format_type = data.get('format', 'mp4')
        quality = data.get('quality', '1080')
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        # Generate unique filename
        download_id = str(uuid.uuid4())
        output_template = os.path.join(DOWNLOAD_DIR, f'ytdl4u_{download_id}.%(ext)s')
        
        # Configure yt-dlp options with bot bypass
        ydl_opts = {
            'format': get_format_string(format_type, quality),
            'outtmpl': output_template,
            'quiet': True,
            'no_warnings': True,
            # Bypass YouTube bot detection
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'extractor_args': {
                'youtube': {
                    'player_client': ['android', 'web', 'ios'],
                    'skip': ['hls', 'dash'],
                }
            },
            'nocheckcertificate': True,
            'geo_bypass': True,
            'age_limit': None,
            # Additional options to avoid detection
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-us,en;q=0.5',
                'Sec-Fetch-Mode': 'navigate',
            },
        }
        
        # Add audio-specific options for MP3
        if format_type == 'mp3':
            ydl_opts.update({
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': quality,
                }],
            })
        
        # Download the video
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get('title', 'video')
            
            # Find the downloaded file
            if format_type == 'mp3':
                filename = f'ytdl4u_{download_id}.mp3'
            else:
                filename = f'ytdl4u_{download_id}.{info.get("ext", "mp4")}'
            
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            # Return download URL (for direct download)
            return jsonify({
                "success": True,
                "title": title,
                "downloadId": download_id,
                "filename": f"{sanitize_filename(title)}.{format_type}",
                "downloadUrl": f"/api/file/{download_id}"
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/file/<download_id>', methods=['GET'])
def get_file(download_id):
    """Serve the downloaded file"""
    try:
        # Find file with this ID
        files = list(Path(DOWNLOAD_DIR).glob(f'ytdl4u_{download_id}.*'))
        
        if not files:
            return jsonify({"error": "File not found"}), 404
        
        filepath = files[0]
        
        # Get filename from query param or use default
        filename = request.args.get('filename', filepath.name)
        
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_format_string(format_type, quality):
    """Generate yt-dlp format string"""
    if format_type == 'mp3':
        return 'bestaudio/best'
    
    # For video, try to get the requested quality
    quality_map = {
        '2160': 'bestvideo[height<=2160]+bestaudio/best[height<=2160]',
        '1440': 'bestvideo[height<=1440]+bestaudio/best[height<=1440]',
        '1080': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]',
        '720': 'bestvideo[height<=720]+bestaudio/best[height<=720]',
        '480': 'bestvideo[height<=480]+bestaudio/best[height<=480]',
        '360': 'bestvideo[height<=360]+bestaudio/best[height<=360]',
    }
    
    return quality_map.get(quality, 'best')

def sanitize_filename(filename):
    """Remove invalid characters from filename"""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '')
    return filename[:100]  # Limit length

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
