@echo off
chcp 65001 > nul
title HAITECH BOT - EM THÙY LINH TRỢ LÝ THÔNG MINH (24/7 ONLINE)
color 0A

cd /d "%~dp0"

:: Đảm bảo trạng thái luôn BẬT và Chế độ Tiếp khách thông minh
powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": true, \"mode\": \"smart_customer_only\", \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8" >nul 2>nul

echo =====================================================================
echo          🌸 EM THÙY LINH — TRỢ LÝ RIÊNG CỦA ANH NGUYỄN VĂN HẢI
echo =====================================================================
echo.
echo  ✅ Trạng thái: ĐANG BẬT TRỰC CHIẾN 24/7
echo  🎯 Chế độ: TIẾP KHÁCH THÔNG MINH (TỰ ĐỘNG BẢO VỆ BẠN BÈ)
echo      • Tự động tư vấn: Web, App, Tool MMO, Video AI, Bot Zalo, Báo giá...
echo      • Tự động xin SĐT khách hàng và lưu trữ Online
echo      • BẢO VỆ BẠN BÈ: Bạn bè chat riêng thì Thùy Linh im lặng để anh tự chat!
echo.
echo  ⚡ Tốc độ AI: Siêu tốc ~0.8s (Google Gemini Flash Lite)
echo  👑 Kênh Sếp: Mở "Cloud của tôi" trên Zalo để giao việc trực tiếp cho Thùy Linh!
echo  🛡️  Bảo vệ 24/7: Tự động kết nối lại nếu mất mạng hoặc mạng chập chờn.
echo =====================================================================
echo.

:bot_loop
node bot-zalo-personal.js --force-active

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ [CẢNH BÁO] Kết nối bị gián đoạn hoặc ngắt mạng (Mã: %errorlevel%).
    echo 🔄 Hệ thống 24/7 đang tự động kết nối lại sau 5 giây...
    timeout /t 5 /nobreak >nul
    goto bot_loop
)

echo.
echo Bot đã dừng hoạt động bình thường.
pause
