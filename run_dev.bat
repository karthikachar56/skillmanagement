@echo off
echo ========================================================
echo       Starting SkillBridge Full-Stack Application
echo   Discover Talent. Connect Skills. Build Together.
echo ========================================================

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "SkillBridge Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Vite React Frontend on http://localhost:5173 ...
start "SkillBridge Frontend" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo ========================================================
echo   Backend API:  http://127.0.0.1:8000
echo   API Docs:     http://127.0.0.1:8000/docs
echo   Frontend Web: http://localhost:5173
echo ========================================================
pause
