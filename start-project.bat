@echo off
title Student Study Group Finder - Uganda Christian University
color 0B

echo ===================================================================
echo   STUDENT STUDY GROUP FINDER - UGANDA CHRISTIAN UNIVERSITY (UCU)
echo   Web and Mobile Application Development Project
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/3] Initializing Database & Seed Data...
if exist "%APPDATA%\Antigravity\bin\agy-node.cmd" (
    call "%APPDATA%\Antigravity\bin\agy-node.cmd" backend\database\initDb.js
) else (
    call node backend\database\initDb.js
)

echo.
echo [2/3] Launching Backend REST API Server (Port 5000)...
start "UCU Study Group Finder - Backend API" cmd /k "cd backend && (if exist "%APPDATA%\Antigravity\bin\agy-node.cmd" ("%APPDATA%\Antigravity\bin\agy-node.cmd" server.js) else (node server.js))"

echo.
echo [3/3] Opening Interactive Student Portal in Browser...
timeout /t 2 /nobreak >nul
start "" "%~dp0frontend\standalone_app.html"

echo.
echo ===================================================================
echo   PROJECT LAUNCHED SUCCESSFULLY!
echo   - Backend Server: http://localhost:5000
echo   - Interactive Client: Opened in default web browser
echo   - Sample Logins:
echo       1. Group Leader:  kigozi.brian@ucu.ac.ug | Student@123
echo       2. Student:       nakato.sarah@ucu.ac.ug | Student@123
echo       3. Administrator: admin@ucu.ac.ug        | Admin@123
echo ===================================================================
echo.
pause
