@echo off
chcp 65001 > nul
title TẮT TRỢ LÝ THÙY LINH - HAITECH BOT
color 0C

cd /d "%~dp0"

powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": false, \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8" >nul 2>nul

echo =====================================================================
echo                🛑 ĐÃ TẮT TRỢ LÝ THÙY LINH!
echo =====================================================================
echo.
echo  ⏸️  Trạng thái: ĐÃ TẠM DỪNG
echo  🔒  Thùy Linh sẽ KHÔNG tự động trả lời khách hàng nữa.
echo  ✍️  Bây giờ anh có thể tự do nhắn tin riêng tư với khách và bạn bè!
echo.
echo  💡 Khi muốn bật lại để Thùy Linh trực, chỉ cần bấm: BAT_THUY_LINH.bat
echo =====================================================================
echo.
timeout /t 5
