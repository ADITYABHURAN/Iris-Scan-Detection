# Development Startup Script
# Starts both backend and frontend servers in separate windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Iris Scan Authentication" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend in new window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "✓ Both servers starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servers are running in separate windows." -ForegroundColor Yellow
Write-Host "Close those windows to stop the servers." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
