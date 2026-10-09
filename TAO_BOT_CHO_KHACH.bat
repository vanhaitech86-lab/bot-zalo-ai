@echo off
chcp 65001 > nul
title HAITECH BOT - TỰ ĐỘNG KHỞI TẠO BOT CHO TỪNG KHÁCH HÀNG
color 0B

echo =====================================================================
echo    🚀 HAITECH BOT STUDIO - CÔNG CỤ TỰ ĐỘNG TẠO BOT CHO KHÁCH HÀNG
echo =====================================================================
echo.

cd /d "%~dp0"

:: Kiểm tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LỖI] Máy tính của bạn chưa có Node.js!
    pause
    exit /b 1
)

node tao-bot-khach-hang.mjs

pause
