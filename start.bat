@echo off
setlocal

cd /d "%~dp0"

set "PYTHON_EXE=python"
if exist ".venv\Scripts\python.exe" (
  set "PYTHON_EXE=.venv\Scripts\python.exe"
) else if exist ".venv311\Scripts\python.exe" (
  set "PYTHON_EXE=.venv311\Scripts\python.exe"
)

echo Using Python: %PYTHON_EXE%

echo Starting backend on http://127.0.0.1:8000 ...
start "RealEstate Backend" cmd /k "cd /d %~dp0 && %PYTHON_EXE% -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Starting frontend server on http://127.0.0.1:5500 ...
start "RealEstate Frontend Server" cmd /k "cd /d %~dp0 && %PYTHON_EXE% -m http.server 5500"

timeout /t 2 >nul
start "" "http://127.0.0.1:5500/real-estate-app%%20(1).html"

echo.
echo Backend:  http://127.0.0.1:8000/docs
echo Frontend: http://127.0.0.1:5500/real-estate-app%%20(1).html
echo.
echo Close the opened terminal windows to stop services.

endlocal
