@echo off
chcp 65001 > nul
title HAITECH BOT - ĐỘNG CƠ TỰ ĐỘNG TRẢ LỜI ZALO 24/7
color 0B

echo =====================================================================
echo                HAITECH BOT - ZALO CÁ NHÂN 24/7
echo             Hệ Thống Tự Động Chăm Sóc Khách Hàng Online
echo =====================================================================
echo.

cd /d "%~dp0"

:: Đảm bảo bot-status.json luôn ở trạng thái BẬT khi khởi động
powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": true, \"mode\": \"smart_customer_only\", \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8" >nul 2>nul

:: Tự động dọn dẹp tiến trình bot cũ nếu đang chạy ngầm để tránh xung đột
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*bot-zalo-personal.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>nul

:: Kiểm tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LỖI] Không tìm thấy Node.js trên máy tính của bạn!
    echo Vui lòng cài đặt Node.js từ https://nodejs.org/ và thử lại.
    pause
    exit /b 1
)

:: Cài đặt dependencies nếu chưa có
if not exist "node_modules\" (
    echo [1/2] Đang cài đặt thư viện cần thiết (chỉ mất 1-2 phút lần đầu)...
    call npm install
    if %errorlevel% neq 0 (
        echo [LỖI] Không thể cài đặt thư viện. Vui lòng kiểm tra kết nối Internet!
        pause
        exit /b 1
    )
    echo [OK] Cài đặt thư viện thành công!
    echo.
)

echo [2/2] Đang khởi động HAITECH BOT 24/7...
echo.

:bot_loop
node bot-zalo-personal.js --force-active

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ [CẢNH BÁO] Kết nối bị gián đoạn hoặc ngắt mạng (Mã lỗi: %errorlevel%).
    echo 🔄 Hệ thống 24/7 đang tự động kết nối lại sau 5 giây...
    timeout /t 5 /nobreak >nul
    goto bot_loop
)

echo.
echo Bot đã dừng hoạt động bình thường.
pause
