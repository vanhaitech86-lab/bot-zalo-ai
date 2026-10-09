@echo off
chcp 65001 > nul
title CHẾ ĐỘ TRỢ LÝ RIÊNG - EM THÙY LINH
color 0B

cd /d "%~dp0"

powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": true, \"mode\": \"assistant_only\", \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8" >nul 2>nul

echo =====================================================================
echo          👑 CHẾ ĐỘ TRỢ LÝ RIÊNG CHO ANH NGUYỄN VĂN HẢI
echo =====================================================================
echo.
echo  ✅ Đã kích hoạt: CHẾ ĐỘ TRỢ LÝ RIÊNG BIỆT (ASSISTANT ONLY)
echo.
echo  🔒 RIÊNG TƯ TUYỆT ĐỐI:
echo      • Thùy Linh CHỈ phục vụ riêng một mình anh Hải trong "Cloud của tôi".
echo      • HOÀN TOÀN KHÔNG trả lời hay làm phiền bạn bè, người ngoài trên Zalo!
echo      • Anh thoải mái tự tay nhắn tin với mọi người mà không sợ bot xen vào.
echo.
echo  💡 Anh mở Zalo -> "Cloud của tôi" (Truyền File) để ra lệnh cho Thùy Linh:
echo      - Viết bài quảng cáo, kịch bản video TikTok
echo      - Viết code tool tự động, lập trình, giải toán
echo      - Xem danh sách SĐT khách hàng (#leads)
echo      - Báo giá, tư vấn kế hoạch...
echo.
echo  👉 Khi muốn mở lại trực khách, bấm: BAT_THUY_LINH.bat (hoặc nhắn #khach)
echo =====================================================================
echo.

timeout /t 5
