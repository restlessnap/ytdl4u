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
            'quiet': False,
            'no_warnings': False,
            'extract_flat': False,
            # Use android_vr - matches working local config
            'extractor_args': {
                'youtube': {
                    'player_client': ['android_vr', 'web'],
                    'skip': ['hls'],
                }
            },
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
        cookies_text = data.get('cookies')  # Client-provided cookies
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        # Try yt-dlp first
        try:
            return download_with_ytdlp(url, format_type, quality, cookies_text)
        except Exception as ytdlp_error:
            error_msg = str(ytdlp_error)
            print(f"yt-dlp failed: {error_msg}")
            
            # If bot detection error, try fallback API
            if 'bot' in error_msg.lower() or 'sign in' in error_msg.lower():
                print("Bot detection - trying fallback API...")
                try:
                    return download_with_fallback(url, format_type, quality)
                except Exception as fallback_error:
                    print(f"Fallback also failed: {fallback_error}")
                    return jsonify({
                        "error": "Authentication required. Please provide YouTube cookies to download this video."
                    }), 401  # 401 = Unauthorized
            else:
                raise ytdlp_error
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def download_with_ytdlp(url, format_type, quality, cookies_text=None):
    """Download using yt-dlp with optional cookies"""
    # Generate unique filename
    download_id = str(uuid.uuid4())
    output_template = os.path.join(DOWNLOAD_DIR, f'ytdl4u_{download_id}.%(ext)s')
    
    # Configure yt-dlp options - Match working local configuration
    ydl_opts = {
        'format': get_format_string(format_type, quality),
        'outtmpl': output_template,
        'quiet': False,  # Show errors for debugging
        'no_warnings': False,
        # Use webpage extraction with android_vr (what works locally!)
        'extractor_args': {
            'youtube': {
                'player_client': ['android_vr', 'web'],  # android_vr works!
                'skip': ['hls'],
            }
        },
        # Don't force any specific user agent - let yt-dlp decide
        'nocheckcertificate': True,
    }
    
    # Add cookies if provided by client
    cookie_file = None
    if cookies_text:
        # Create temporary cookie file
        cookie_file = os.path.join(DOWNLOAD_DIR, f'cookies_{download_id}.txt')
        with open(cookie_file, 'w') as f:
            f.write(cookies_text)
        ydl_opts['cookiefile'] = cookie_file
        print(f"Using client-provided cookies from: {cookie_file}")
    
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
    
    try:
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
    finally:
        # Clean up temporary cookie file
        if cookie_file and os.path.exists(cookie_file):
            try:
                os.remove(cookie_file)
                print(f"Cleaned up cookie file: {cookie_file}")
            except Exception as e:
                print(f"Failed to clean up cookie file: {e}")

def download_with_fallback(url, format_type, quality):
    """Fallback download using third-party API (privacy-friendly)"""
    import requests
    
    print(f"Attempting fallback download for: {url}")
    
    # Use Cobalt v9 API (v7 was shut down Nov 2024)
    cobalt_api = "https://api.cobalt.tools/"
    
    # Map our quality to Cobalt's format
    quality_map = {
        '2160': '2160',
        '1440': '1440',
        '1080': '1080',
        '720': '720',
        '480': '480',
        '360': '360'
    }
    
    # Cobalt v9 API format
    payload = {
        "url": url,
        "videoQuality": quality_map.get(quality, '1080'),
        "filenameStyle": "basic",
        "downloadMode": "audio" if format_type == 'mp3' else "auto"
    }
    
    print(f"Cobalt v9 API request: {payload}")
    
    try:
        response = requests.post(
            cobalt_api, 
            json=payload, 
            headers={
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout=30
        )
        
        print(f"Cobalt response status: {response.status_code}")
        print(f"Cobalt response: {response.text[:500]}")  # First 500 chars
        
        if response.status_code == 200:
            result = response.json()
            
            # Cobalt v9 returns different status types
            status = result.get('status')
            
            if status == 'tunnel':
                # Direct download URL
                download_url = result.get('url')
            elif status == 'redirect':
                # Redirect to download
                download_url = result.get('url')
            elif status == 'picker':
                # Multiple quality options - pick first one
                picker = result.get('picker', [])
                if picker and len(picker) > 0:
                    download_url = picker[0].get('url')
                else:
                    raise Exception("No download URL in picker response")
            elif status == 'error':
                error_text = result.get('text', 'Unknown error')
                raise Exception(f"Cobalt error: {error_text}")
            else:
                raise Exception(f"Unexpected Cobalt status: {status}")
            
            if not download_url:
                raise Exception("No download URL in Cobalt response")
            
            print(f"Got download URL from Cobalt: {download_url[:100]}...")
            
            # Download the file from Cobalt
            download_id = str(uuid.uuid4())
            ext = 'mp3' if format_type == 'mp3' else 'mp4'
            filename = f'ytdl4u_{download_id}.{ext}'
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            print(f"Downloading file to: {filepath}")
            
            # Stream download
            file_response = requests.get(download_url, stream=True, timeout=120)
            file_response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                for chunk in file_response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            print(f"Download complete: {filepath}")
            
            return jsonify({
                "success": True,
                "title": f"Video_{download_id}",
                "downloadId": download_id,
                "filename": f"video.{ext}",
                "downloadUrl": f"/api/file/{download_id}"
            })
        else:
            raise Exception(f"Cobalt API returned status {response.status_code}: {response.text[:200]}")
    
    except requests.exceptions.Timeout:
        raise Exception("Cobalt API timeout - try again later")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Cobalt API request failed: {str(e)}")
    except Exception as e:
        raise Exception(f"Cobalt fallback error: {str(e)}")

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
