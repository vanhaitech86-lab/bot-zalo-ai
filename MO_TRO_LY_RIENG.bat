@echo off
chcp 65001 > nul
title MỞ TRỢ LÝ RIÊNG THÙY LINH - HAITECH AI
color 0B

cd /d "%~dp0"

echo =====================================================================
echo       👑 MỞ GIAO DIỆN TRỢ LÝ RIÊNG THÙY LINH - HAITECH AI
echo =====================================================================
echo.
echo  ⚡ Tốc độ AI: Siêu tốc ~0.8s (Google Gemini Flash Lite)
echo  📱 Đang mở giao diện trên trình duyệt của bạn...
echo.

start "" "%~dp0tro-ly-rieng.html"

echo =====================================================================
echo  ✅ Đã mở thành công! Bạn có thể bắt đầu làm việc cùng Em Thùy Linh.
echo =====================================================================
timeout /t 3
