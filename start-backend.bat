@echo off
echo Starting YTDL4U Backend Server...
echo.
echo Installing dependencies...
cd backend
pip install -r requirements.txt
echo.
echo Backend will be available at: http://localhost:10000
echo Health check: http://localhost:10000/health
echo Press Ctrl+C to stop the server
echo.
python app.py
