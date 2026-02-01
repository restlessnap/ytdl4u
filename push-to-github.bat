@echo off
echo ========================================
echo   YTDL4U - Push to GitHub
echo ========================================
echo.
echo IMPORTANT: Replace YOUR_USERNAME with your actual GitHub username!
echo.
set /p username="Enter your GitHub username: "
echo.
echo Connecting to GitHub repository...
git remote add origin https://github.com/%username%/ytdl4u.git
echo.
echo Renaming branch to main...
git branch -M main
echo.
echo Pushing code to GitHub...
git push -u origin main
echo.
echo ========================================
echo   Done! Your code is now on GitHub
echo ========================================
echo.
echo Next step: Deploy backend to Render.com
echo Visit: https://render.com
echo.
pause
