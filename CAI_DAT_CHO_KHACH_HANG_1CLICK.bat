@echo off
chcp 65001 > nul
title CAI DAT VA KHOI DONG BOT ZALO AI - 1-CLICK CLIENT SETUP
color 0B

echo ===============================================================================
echo        🚀 CHAO MUNG QUY KHACH DEN VOI HE THONG TRO LY AI ZALO TU DONG 24/7
echo ===============================================================================
echo.
echo   [*] He thong dang tien hanh kiem tra va khoi chay Bot tren may tinh cua ban...
echo.

cd /d "%~dp0"

:: 1. Kiem tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] May tinh chua co Node.js de chay dong co Bot AI.
    echo [*] He thong se tu dong tai va cai dat Node.js LTS cho ban qua Winget...
    echo.
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    if %errorlevel% neq 0 (
        echo.
        echo [!] Khong the tu dong cai Node.js qua Winget.
        echo [*] Vui long tai Node.js ban LTS tai trang chu: https://nodejs.org/
        start https://nodejs.org/
        echo Sau khi cai xong, hay chay lai file nay!
        pause
        exit /b 1
    )
    echo [OK] Da cai dat xong Node.js! Vui long khoi dong lai file nay de hoan tat.
    pause
    exit /b 0
)

echo [1/3] Kiem tra Node.js: OK (%node -v%)

:: 2. Kiem tra va cai thu vien npm neu chua co node_modules
if not exist "node_modules\" (
    echo [2/3] Dang tai goi thu vien ho tro Bot Zalo (chi chay 1 lan dau tien)...
    call npm install --production --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo [Canh bao] Cai thu vien bi loi nhe, dang thu tiep tuc...
    )
) else (
    echo [2/3] Thu vien ho tro: Da san sang!
)

:: 3. Kiem tra file cau hinh knowledge.json
if not exist "knowledge.json" (
    if exist "knowledge.example.json" (
        copy "knowledge.example.json" "knowledge.json" >nul
        echo [*] Da khoi tao file cau hinh knowledge.json tu mau san co.
    )
)

:: 4. Tao shortcut ngoai Desktop cho khach tien su dung
set SCRIPT_DIR=%~dp0
set SHORTCUT_PATH=%USERPROFILE%\Desktop\TRO_LY_AI_ZALO_247.bat
if not exist "%SHORTCUT_PATH%" (
    (
        echo @echo off
        echo chcp 65001 ^> nul
        echo cd /d "%SCRIPT_DIR%"
        echo title TRO LY AI ZALO 24/7 DANG CHAY
        echo color 0A
        echo node bot-zalo-personal.js --force-active
        echo pause
    ) > "%SHORTCUT_PATH%"
    echo [*] Da tao bieu tuong khoi dong nhanh "TRO_LY_AI_ZALO_247" ngoai man hinh Desktop!
)

:: 5. Khoi dong Bot Zalo va mo giao dien quet ma QR
echo.
echo ===============================================================================
echo  [3/3] DANG KHOI CHAY TRO LY ZALO AI...
echo  👉 Hay mo ung dung Zalo tren dien thoai cua ban:
echo  👉 Bam bieu tuong [+] goc tren phai ➡️ Chon "Quet ma QR" de dang nhap!
echo ===============================================================================
echo.

:: Khoi dong server web dashboard neu can
start "" /b node server.js >nul 2>&1

:: Mo trang quet ma QR trong trinh duyet sau 3 giay
start "" powershell -Command "Start-Sleep -Seconds 3; if (Test-Path './qr.html') { Start-Process './qr.html' } else { Start-Process 'http://localhost:5000/dashboard.html' }"

:: Chay tien trinh Bot chinh
node bot-zalo-personal.js --force-active

pause
