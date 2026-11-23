Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      Starting SkillBridge Full-Stack Application       " -ForegroundColor Cyan
Write-Host "   Discover Talent. Connect Skills. Build Together.     " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm.cmd run dev"

Write-Host ""
Write-Host "SkillBridge is launching!" -ForegroundColor Green
Write-Host "• Frontend UI: http://localhost:5173" -ForegroundColor Green
Write-Host "• Backend API: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "• Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
