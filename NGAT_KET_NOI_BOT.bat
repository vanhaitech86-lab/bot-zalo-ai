@echo off
chcp 65001 > nul
title HAITECH BOT - NGẮT KẾT NỐI & DỪNG BOT
color 0C

echo =====================================================================
echo                HAITECH BOT - NGẮT KẾT NỐI HOÀN TOÀN
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Đang dừng tiến trình Bot Zalo đang chạy...
:: Dừng tiến trình chạy bot-zalo-personal.js một cách chính xác
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"name = 'node.exe'\" | Where-Object { $_.CommandLine -like '*bot-zalo-personal.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force; Write-Host '  -> Đã dừng tiến trình Bot PID:' $_.ProcessId }" >nul 2>nul
taskkill /F /FI "WINDOWTITLE eq HAITECH BOT*" >nul 2>nul

echo [2/3] Đang xóa phiên đăng nhập cũ (session.json) & file tạm...
if exist "session.json" (
    del /f /q "session.json"
    echo   -> Đã xóa session.json thành công!
) else (
    echo   -> Không có phiên session.json nào đang lưu.
)

if exist "qr.png" del /f /q "qr.png"
if exist "qr.html" del /f /q "qr.html"

echo.
echo [3/3] HOÀN TẤT NGẮT KẾT NỐI 100%!
echo.
echo =====================================================================
echo   ✅ Bot đã NGỪNG hoạt động và ĐÃ ĐĂNG XUẤT hoàn toàn.
echo   🔒 Bot sẽ không thể tự động trả lời tin nhắn nào nữa.
echo.
echo   📱 Mẹo: Để đăng xuất triệt để khỏi hệ thống Zalo:
echo      1. Mở ứng dụng Zalo trên điện thoại
echo      2. Vào Cá nhân -> Bấm Cài đặt (bánh răng) ở góc trên
echo      3. Chọn "Tài khoản và bảo mật" -> "Lịch sử đăng nhập"
echo      4. Bấm "Đăng xuất" khỏi phiên Web/Máy tính nếu có.
echo =====================================================================
echo.
pause
