@echo off
chcp 65001 > nul
title HAITECH BOT - KẾT NỐI TRỢ LÝ THÙY LINH RIÊNG BIỆT 24/7
color 0A

echo =====================================================================
echo       HAITECH BOT - KHỞI TẠO TRỢ LÝ THÙY LINH RIÊNG BIỆT
echo =====================================================================
echo.
echo  ✅ Zalo chính của bạn đã được ngắt kết nối an toàn 100%.
echo  🌸 Tài khoản này sẽ dành riêng cho Em Thùy Linh (Trợ lý AI 24/7).
echo.
echo  👉 CÁC BƯỚC CHUẨN BỊ (Chỉ làm 1 lần):
echo     1. Chuẩn bị 1 tài khoản Zalo phụ (dùng SIM 2 hoặc SIM phụ).
echo     2. Đặt Tên hiển thị Zalo: "Em Thùy Linh - Trợ lý HAITECH"
echo     3. Cài Avatar: Sử dụng ảnh "AVATAR_THUY_LINH.jpg" có sẵn trong thư mục.
echo     4. Lấy ứng dụng Zalo Thùy Linh quét mã QR sắp hiện ra bên dưới.
echo.
echo =====================================================================
echo.

cd /d "%~dp0"

:: Đảm bảo giải phóng phiên cũ nếu có
if exist "session.json" (
    echo [1/3] Đang làm mới phiên kết nối...
    del /f /q "session.json"
)

:: Kiểm tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LỖI] Chưa cài đặt Node.js trên máy tính!
    pause
    exit /b 1
)

echo [2/3] Đang khởi động động cơ Zalo và tạo mã QR mới...
echo.
node bot-zalo-personal.js

pause
