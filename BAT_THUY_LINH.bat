@echo off
chcp 65001 > nul
title HAITECH BOT - EM THÙY LINH TRỢ LÝ THÔNG MINH
color 0A

cd /d "%~dp0"

powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": true, \"mode\": \"smart_customer_only\", \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8" >nul 2>nul

echo =====================================================================
echo          🌸 EM THÙY LINH — TRỢ LÝ RIÊNG CỦA ANH NGUYỄN VĂN HẢI
echo =====================================================================
echo.
echo  ✅ Trạng thái: ĐANG BẬT (Trực chiến thông minh)
echo  🎯 Chế độ: TIẾP KHÁCH THÔNG MINH
echo      - Tự động tư vấn khách hỏi: Web, App, Tool MMO, Video AI, Bot Zalo...
echo      - BẢO VỆ BẠN BÈ: Bạn bè chat chuyện cá nhân thì Thùy Linh im lặng!
echo.
echo  ⚡ Tốc độ AI: Siêu tốc ~0.8s (Google Gemini Flash Lite)
echo  👑 Kênh Sếp: Mở "Cloud của tôi" trên Zalo để giao việc trực tiếp cho Thùy Linh!
echo =====================================================================
echo.

node bot-zalo-personal.js

pause
