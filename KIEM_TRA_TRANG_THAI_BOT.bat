@echo off
chcp 65001 > nul
title BẢNG ĐIỀU KHIỂN & KIỂM TRA TRẠNG THÁI BOT ZALO 24/7
color 0F

cd /d "%~dp0"

:menu
cls
echo =====================================================================
echo       📊 BẢNG ĐIỀU KHIỂN & KIỂM TRA TRẠNG THÁI BOT ZALO 24/7
echo                  HAITECH AI — NGUYỄN VĂN HẢI
echo =====================================================================
echo.

:: Kiểm tra tiến trình node bot-zalo-personal.js
powershell -NoProfile -Command "$procs = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*bot-zalo-personal.js*' }; if ($procs) { Write-Host '🟢 TIẾN TRÌNH BOT: ĐANG CHẠY TRỰC TUYẾN' -ForegroundColor Green; foreach ($p in $procs) { Write-Host ('   • Process ID (PID): ' + $p.ProcessId + ' | Bộ nhớ RAM: ' + [math]::Round($p.WorkingSetSize/1MB, 1) + ' MB') -ForegroundColor Gray; } } else { Write-Host '🛑 TIẾN TRÌNH BOT: ĐANG TẮT (Chưa chạy)' -ForegroundColor Red; }"

echo.
:: Đọc file bot-status.json
powershell -NoProfile -Command "if (Test-Path 'bot-status.json') { $s = Get-Content 'bot-status.json' -Raw | ConvertFrom-Json; if ($s.active -eq $true) { Write-Host '🟢 TRẠNG THÁI TRỰC KHÁCH: ĐANG BẬT (24/7)' -ForegroundColor Green; } else { Write-Host '🛑 TRẠNG THÁI TRỰC KHÁCH: ĐANG TẮT (Tạm dừng)' -ForegroundColor Yellow; }; if ($s.mode -eq 'assistant_only') { Write-Host '👑 Chế độ: TRỢ LÝ RIÊNG (Chỉ phục vụ Sếp Hải)' -ForegroundColor Cyan; } elseif ($s.mode -eq 'smart_customer_only') { Write-Host '🎯 Chế độ: TIẾP KHÁCH THÔNG MINH (Bảo vệ bạn bè)' -ForegroundColor Cyan; } else { Write-Host ('🌐 Chế độ: ' + $s.mode) -ForegroundColor Cyan; } } else { Write-Host '⚠️ Chưa có file cấu hình bot-status.json' -ForegroundColor DarkGray; }"

echo.
:: Kiểm tra phiên session.json
if exist "session.json" (
    echo  🔑 Phiên Zalo: ĐÃ LƯU SẴN (Tự động đăng nhập không cần quét lại QR)
) else (
    echo  ⚠️ Phiên Zalo: CHƯA CÓ (Cần quét mã QR khi bật lần đầu)
)

echo.
echo =====================================================================
echo                      CHỌN THAO TÁC NHANH:
echo =====================================================================
echo  [1] 🟢 BẬT TRỢ LÝ THÙY LINH (Hiện cửa sổ để xem tin nhắn)
echo  [2] 🌸 BẬT TRỢ LÝ CHẠY ẨN 24/7 (Không hiện cửa sổ đen CMD)
echo  [3] 👑 Chuyển sang Chế độ TRỢ LÝ RIÊNG (Chỉ phục vụ Sếp Hải)
echo  [4] 🎯 Chuyển sang Chế độ TIẾP KHÁCH THÔNG MINH (Lọc bạn bè)
echo  [5] 🛑 Tắt trực khách (Tạm dừng bot)
echo  [6] 🔄 Khởi động lại Bot
echo  [7] ⛔ Dừng Bot hoàn toàn
echo  [8] 📋 Xem danh sách Số điện thoại khách hàng đã lưu (Leads)
echo  [0] Thoát
echo =====================================================================
set /p choice="👉 Nhập lựa chọn của bạn (0-8) rồi nhấn Enter: "

if "%choice%"=="1" (
    start cmd /c "%~dp0BAT_THUY_LINH.bat"
    goto menu
)
if "%choice%"=="2" (
    wscript "%~dp0CHAY_AN_247_KHONG_LO_TAT.vbs"
    timeout /t 2 >nul
    goto menu
)
if "%choice%"=="3" (
    powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": true, \"mode\": \"assistant_only\", \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8"
    echo Đã chuyển sang Chế độ Trợ lý Riêng!
    timeout /t 2 >nul
    goto menu
)
if "%choice%"=="4" (
    powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": true, \"mode\": \"smart_customer_only\", \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8"
    echo Đã chuyển sang Chế độ Tiếp khách Thông minh!
    timeout /t 2 >nul
    goto menu
)
if "%choice%"=="5" (
    powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": false, \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8"
    echo Đã tắt trực khách!
    timeout /t 2 >nul
    goto menu
)
if "%choice%"=="6" (
    powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*bot-zalo-personal.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>nul
    timeout /t 2 >nul
    start cmd /c "%~dp0BAT_THUY_LINH.bat"
    goto menu
)
if "%choice%"=="7" (
    call "%~dp0DUNG_BOT_HOAN_TOAN.bat"
    timeout /t 2 >nul
    goto menu
)
if "%choice%"=="8" (
    cls
    echo =====================================================================
    echo                 DANH SÁCH SỐ ĐIỆN THOẠI KHÁCH HÀNG
    echo =====================================================================
    powershell -NoProfile -Command "if (Test-Path 'leads.json') { $leads = Get-Content 'leads.json' -Raw | ConvertFrom-Json; Write-Host ('Tổng cộng: ' + $leads.Count + ' khách hàng') -ForegroundColor Yellow; $leads | Select-Object -First 20 | ForEach-Object { Write-Host ('📞 ' + $_.phone + ' | 👤 ' + $_.customerName + ' | ⏰ ' + $_.time); Write-Host ('   💬 Tin nhắn: ' + $_.message) -ForegroundColor Gray; } } else { Write-Host 'Chưa có dữ liệu leads.json' -ForegroundColor Gray; }"
    echo.
    pause
    goto menu
)
if "%choice%"=="0" exit /b 0

goto menu
