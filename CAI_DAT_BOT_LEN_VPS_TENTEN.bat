@echo off
chcp 65001 > nul
title KÍCH HOẠT HAITECH BOT TRÊN MÁY CHỦ TENTEN (trolybotai.com)
color 0A

echo =====================================================================
echo    🚀 HỖ TRỢ ĐẨY VÀ KÍCH HOẠT BOT LÊN HOST TENTEN (150.95.109.12)
echo                  Website: https://trolybotai.com
echo =====================================================================
echo.
echo Hệ thống sẽ giúp anh tải session đăng nhập Zalo hiện tại và mã nguồn
echo lên thẳng máy chủ Tenten để Bot chạy vĩnh viễn 24/7/365.
echo.
echo Đang kiểm tra kết nối tới IP Tenten (150.95.109.12)...
powershell -NoProfile -Command "if (Test-NetConnection -ComputerName '150.95.109.12' -Port 22 -InformationLevel Quiet) { Write-Host '✅ Cổng SSH 22 trên máy chủ Tenten ĐANG MỞ SẴN SÀNG!' -ForegroundColor Green } else { Write-Host '⚠️ Cổng 22 chưa kết nối được.' -ForegroundColor Yellow }"

echo.
echo =====================================================================
echo [LỰA CHỌN 1] NẾU TENTEN LÀ MÁY CHỦ VPS LINUX:
echo    - Anh chỉ cần mở cửa sổ này và chạy lệnh SSH bên dưới:
echo.
echo      ssh root@150.95.109.12
echo.
echo    - Sau khi nhập mật khẩu VPS Tenten, dán 1 dòng lệnh này để chạy 24/7:
echo.
echo      curl -fsSL https://deb.nodesource.com/setup_20.x ^| bash - ^&^& apt-get install -y nodejs git ^&^& npm install -g pm2 ^&^& git clone https://github.com/vanhaitech86-lab/bot-zalo-ai.git /root/bot-zalo ^&^& cd /root/bot-zalo ^&^& npm install ^&^& pm2 start bot-zalo-personal.js --name "haitech-bot" -- --force-active ^&^& pm2 startup ^&^& pm2 save
echo.
echo =====================================================================
echo [LỰA CHỌN 2] NẾU QUẢN TRỊ QUA GIAO DIỆN PLESK TENTEN:
echo    - Mở trình duyệt vào trang quản trị: https://trolybotai.com:8443
echo    - Vào "Websites & Domains" -> Nhấp vào mục "Node.js"
echo    - Application Startup File: bot-zalo-personal.js
echo    - Bấm "Enable Node.js" và "NPM Install" -> "Restart"
echo =====================================================================
echo.
pause
