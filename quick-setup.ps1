# Quick Start Script for Iris Scan Authentication System
# Run this script in PowerShell to quickly set up and start the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iris Scan Authentication System" -ForegroundColor Cyan
Write-Host "  Quick Start Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download and install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Navigate to backend directory
$backendPath = "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    
    # Check if .env exists
    if (-not (Test-Path ".env")) {
        Write-Host "⚠ .env file not found!" -ForegroundColor Yellow
        Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host ""
        Write-Host "⚠ IMPORTANT: Edit backend/.env and add your MongoDB URI!" -ForegroundColor Red
        Write-Host "   Get MongoDB URI from: https://www.mongodb.com/cloud/atlas" -ForegroundColor Yellow
        Write-Host ""
        $response = Read-Host "Have you updated the .env file with your MongoDB URI? (y/n)"
        if ($response -ne "y") {
            Write-Host "Please update backend/.env first, then run this script again." -ForegroundColor Yellow
            Set-Location ..
            exit
        }
    }
    
    # Install backend dependencies
    Write-Host ""
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install backend dependencies!" -ForegroundColor Red
        Set-Location ..
        exit
    }
    
    Set-Location ..
} else {
    Write-Host "✗ Backend directory not found!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Navigate to frontend directory
$frontendPath = "frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    
    # Install frontend dependencies
    Write-Host ""
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Write-Host "(This may take a few minutes...)" -ForegroundColor Gray
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install frontend dependencies!" -ForegroundColor Red
        Set-Location ..
        exit
    }
    
    Set-Location ..
} else {
    Write-Host "✗ Frontend directory not found!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ All dependencies installed!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open a terminal and run:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Open ANOTHER terminal and run:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or use the start-dev.ps1 script to start both automatically!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
