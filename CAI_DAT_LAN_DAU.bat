@echo off
chcp 65001 > nul
title HAITECH BOT - CAI DAT MOI TRUONG LAN DAU
color 0B

echo =====================================================================
echo                HAITECH BOT - CAI DAT HE THONG LAN DAU
echo          Phan mem Tro Ly AI Cham Soc Khach Hang Da Kenh 24/7
echo =====================================================================
echo.

cd /d "%~dp0"

:: 1. Kiem tra Node.js
echo [1/3] Dang kiem tra moi truong Node.js tren may tinh...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo =====================================================================
    echo [THONG BAO] May tinh cua ban chua co Node.js (Moi truong chay Bot).
    echo Dang tu dong mo trinh duyet de tai Node.js ve cai dat mien phi...
    echo =====================================================================
    start https://nodejs.org/en/download/prebuilt-installer
    echo.
    echo Sau khi tai ve va cai dat Node.js xong, ban vui long chay lai file nay nhe!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo   -> Tim thay Node.js: %NODE_VER% (Hop le!)
echo.

:: 2. Cai dat thu vien can thiet
echo [2/3] Dang cai dat cac goi thu vien AI va ket noi Zalo...
echo (Qua trinh nay chi dien ra 1 lan duy nhat, vui long doi vai giay...)
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [LOI] Khong the tai thu vien. Vui long kiem tra ket noi mang Internet!
    pause
    exit /b 1
)
echo   -> Cai dat thu vien hoan tat 100%!
echo.

:: 3. Don dep va khoi tao file cau hinh
echo [3/3] Dang chuan hoa file du lieu tri thuc (knowledge.json)...
if exist "session.json" del /f /q "session.json"
if exist "qr.png" del /f /q "qr.png"
if exist "qr.html" del /f /q "qr.html"
echo   -> He thong da san sang!
echo.

echo =====================================================================
echo    CHUC MUNG! CAI DAT HAITECH BOT THANH CONG 100%!
echo =====================================================================
echo.
echo 👉 BUOC TIEP THEO:
echo    1. Mo file "knowledge.json" de sua bang gia va so dien thoai cua ban.
echo    2. Nhap dup vao file "CHAY_BOT_ZALO.bat" de bat dau su dung ngay!
echo.
echo Hotline ho tro ky thuat: 0988 739 896 - Email: vanhaitech.86@gmail.com
echo =====================================================================
echo.
pause
