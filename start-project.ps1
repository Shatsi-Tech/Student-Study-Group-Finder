# PowerShell Quick Start Launcher for UCU Student Study Group Finder
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  STUDENT STUDY GROUP FINDER - UGANDA CHRISTIAN UNIVERSITY (UCU)  " -ForegroundColor Yellow
Write-Host "  Web and Mobile Application Development Project                   " -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

$NodeExe = if (Test-Path "$env:APPDATA\Antigravity\bin\agy-node.cmd") { "$env:APPDATA\Antigravity\bin\agy-node.cmd" } else { "node" }

Write-Host "[1/3] Initializing Database & Seed Data..." -ForegroundColor Green
& $NodeExe "$ScriptDir\backend\database\initDb.js"

Write-Host "`n[2/3] Launching Backend REST API Server (Port 5000)..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k cd /d `"$ScriptDir\backend`" && `"$NodeExe`" server.js"

Start-Sleep -Seconds 2

Write-Host "`n[3/3] Opening Interactive Student Portal..." -ForegroundColor Green
Start-Process "$ScriptDir\frontend\standalone_app.html"

Write-Host "`n===================================================================" -ForegroundColor Cyan
Write-Host "  PROJECT LAUNCHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "  - Backend Server: http://localhost:5000"
Write-Host "  - Interactive Client: Opened in browser"
Write-Host "  - Sample Logins:"
Write-Host "      1. Group Leader:  kigozi.brian@ucu.ac.ug | Student@123"
Write-Host "      2. Student:       nakato.sarah@ucu.ac.ug | Student@123"
Write-Host "      3. Administrator: admin@ucu.ac.ug        | Admin@123"
Write-Host "===================================================================" -ForegroundColor Cyan
