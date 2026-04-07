@echo off
REM Kill any process on port 3001
netstat -ano | findstr :3001 | for /f "tokens=5" %%i in ('netstat -ano | findstr :3001') do taskkill /PID %%i /F >nul 2>&1

echo Port 3001 cleared. Starting json-server...
npm run server
pause
