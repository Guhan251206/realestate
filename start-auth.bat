@echo off
setlocal

cd /d "%~dp0"

echo Starting Auth Backend and Frontend...

start "Auth Backend" cmd /k "cd /d %~dp0\server && npm run dev"
start "Auth Frontend" cmd /k "cd /d %~dp0 && python -m http.server 5500"

timeout /t 3 >nul
start "" "http://127.0.0.1:5500/real-estate-app%%20(1).html"

echo.
echo Backend:  http://127.0.0.1:5000
echo Frontend: http://127.0.0.1:5500/real-estate-app%%20(1).html
echo.
echo Close the opened terminal windows to stop services.

endlocal
