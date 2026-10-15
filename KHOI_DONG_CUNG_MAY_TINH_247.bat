@echo off
chcp 65001 > nul
title CÀI ĐẶT BOT TỰ BẬT KHI KHỞI ĐỘNG MÁY TÍNH (24/7)
color 0E

cd /d "%~dp0"

echo =====================================================================
echo         ⚙️ THIẾT LẬP BOT TỰ ĐỘNG KHỞI ĐỘNG CÙNG WINDOWS 24/7
echo =====================================================================
echo.
echo Thao tác này sẽ giúp Em Thùy Linh tự động bật chạy ngầm mỗi khi máy tính
echo của anh bật lên hoặc khởi động lại, anh không cần phải bấm thủ công nữa!
echo.
echo [1] CÀI ĐẶT: Cho phép Bot tự khởi động cùng máy tính
echo [2] HỦY BỎ: Xóa Bot khỏi danh sách tự khởi động
echo [0] Thoát
echo.
set /p opt="👉 Nhập lựa chọn của anh (1/2/0): "

if "%opt%"=="1" (
    powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([Environment]::GetFolderPath('Startup') + '\Haitech_Zalo_Bot_247.lnk'); $s.TargetPath = '%~dp0CHAY_AN_247_KHONG_LO_TAT.vbs'; $s.WorkingDirectory = '%~dp0'; $s.Save()"
    echo.
    echo ✅ ĐÃ CÀI ĐẶT THÀNH CÔNG!
    echo Từ nay mỗi khi mở máy tính, Em Thùy Linh sẽ tự động trực chiến 24/7!
    echo.
    pause
    exit /b 0
)

if "%opt%"=="2" (
    powershell -NoProfile -Command "Remove-Item -Path ([Environment]::GetFolderPath('Startup') + '\Haitech_Zalo_Bot_247.lnk') -ErrorAction SilentlyContinue"
    echo.
    echo 🗑️ Đã hủy bỏ tự khởi động cùng máy tính thành công!
    echo.
    pause
    exit /b 0
)

exit /b 0
