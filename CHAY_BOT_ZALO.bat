@echo off
chcp 65001 > nul
title HAITECH BOT - DONG CO TU DONG TRA LOI ZALO 24/7
color 0B

echo =====================================================================
echo                HAITECH BOT - ZALO CA NHAN 24/7
echo             He Thong Tu Dong Cham Soc Khach Hang
echo =====================================================================
echo.

cd /d "%~dp0"

:: Kiem tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay Node.js tren may tinh cua ban!
    echo Vui long cai dat Node.js tu https://nodejs.org/ va thu lai.
    pause
    exit /b 1
)

:: Cai dat dependencies neu chua co
if not exist "node_modules\" (
    echo [1/2] Dang cai dat thu vien can thiet (chi mat 1-2 phut lan dau)...
    call npm install
    if %errorlevel% neq 0 (
        echo [LOI] Khong the cai dat thu vien. Vui long kiem tra ket noi Internet!
        pause
        exit /b 1
    )
    echo [OK] Cai dat thu vien thanh cong!
    echo.
)

echo [2/2] Dang khoi dong HAITECH BOT...
echo.
node bot-zalo-personal.js

pause
