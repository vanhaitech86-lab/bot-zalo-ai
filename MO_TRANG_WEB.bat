@echo off
chcp 65001 > nul
title HAITECH BOT - KHOI DONG TRANG WEB LOCAL
color 0B

echo =====================================================================
echo           HAITECH BOT - HE THONG WEB TRUC CHAT DA KENH
echo =====================================================================
echo.
echo [*] Dang khoi dong Web Server local tai cong 5000...
cd /d "%~dp0"

start "" "http://localhost:5000/"
node server.js
pause
