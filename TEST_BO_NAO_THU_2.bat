@echo off
chcp 65001 > nul
title HAITECH BOT - TEST BO NAO THU 2 (GOOGLE GEMINI)
color 0A

echo =====================================================================
echo           HAITECH BOT - TEST THU NGHIEM BO NAO THU 2 (GEMINI AI)
echo =====================================================================
echo.

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay Node.js tren may tinh!
    pause
    exit /b 1
)

node test-dual-brain.js

pause
