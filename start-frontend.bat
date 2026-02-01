@echo off
echo Starting YTDL4U Frontend Server...
echo.
echo Frontend will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
