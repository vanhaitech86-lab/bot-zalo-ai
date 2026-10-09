@echo off
chcp 65001 > nul
title XUẤT CHUỖI ĐĂNG NHẬP ZALO CLOUD 24/7
color 0E

cd /d "%~dp0"

node xuat-session-cloud.mjs

echo.
pause
