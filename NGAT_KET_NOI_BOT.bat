@echo off
chcp 65001 > nul
title HAITECH BOT - NGẮT KẾT NỐI & DỪNG BOT
color 0C

echo =====================================================================
echo                HAITECH BOT - NGẮT KẾT NỐI HOÀN TOÀN
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Đang dừng tiến trình bot đang chạy ngầm...
:: Dừng tiến trình node nếu đang chạy bot
taskkill /F /FI "WINDOWTITLE eq HAITECH BOT*" >nul 2>nul
taskkill /F /IM node.exe /FI "MODULES eq zca-js" >nul 2>nul

echo [2/3] Đang xóa phiên đăng nhập cũ (session.json)...
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
echo   ✅ Bot đã NGỪNG hoạt động trên máy tính của bạn.
echo   📱 Mẹo: Để kiểm tra hoặc đăng xuất hẳn trên điện thoại:
echo      1. Mở ứng dụng Zalo trên điện thoại
echo      2. Vào Cá nhân -> Bấm biểu tượng Cài đặt (bánh răng) ở góc trên
echo      3. Chọn "Tài khoản và bảo mật" -> "Lịch sử đăng nhập"
echo      4. Bấm "Đăng xuất" khỏi phiên Web/Máy tính nếu có.
echo =====================================================================
echo.
pause
