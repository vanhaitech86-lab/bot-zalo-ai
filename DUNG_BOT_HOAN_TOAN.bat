@echo off
chcp 65001 > nul
title DỪNG BOT ZALO HOÀN TOÀN - HAITECH AI
color 0C

cd /d "%~dp0"

echo =====================================================================
echo                🛑 DỪNG TOÀN BỘ TIẾN TRÌNH BOT ZALO
echo =====================================================================
echo.

powershell -NoProfile -Command "$procs = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*bot-zalo-personal.js*' }; if ($procs) { foreach ($p in $procs) { Write-Host ('⏳ Đang dừng tiến trình PID: ' + $p.ProcessId); Stop-Process -Id $p.ProcessId -Force; }; Write-Host '✅ Đã dừng toàn bộ Bot Zalo thành công!' -ForegroundColor Green; } else { Write-Host 'ℹ️ Không có tiến trình Bot nào đang chạy.' -ForegroundColor Yellow; }"

:: Cập nhật trạng thái trong bot-status.json
powershell -NoProfile -Command "Set-Content -Path 'bot-status.json' -Value '{\"active\": false, \"updatedAt\": \"' + (Get-Date).ToString('o') + '\"}' -Encoding UTF8" >nul 2>nul

echo.
echo =====================================================================
echo  💡 Khi muốn bật lại Bot, bạn chỉ cần bấm file:
echo      👉 'BAT_THUY_LINH.bat' (Hiện cửa sổ xem tin)
echo      👉 'CHAY_AN_247_KHONG_LO_TAT.vbs' (Chạy ẩn 24/7 trong nền)
echo =====================================================================
echo.
timeout /t 4
