@echo off
chcp 65001 > nul
title HAITECH BOT - DONG GOI SAN PHAM THUONG MAI
color 0A

echo =====================================================================
echo              HAITECH BOT - DONG GOI SAN PHAM THUONG MAI
echo =====================================================================
echo.

cd /d "%~dp0"

set "RELEASE_NAME=HAITECH_BOT_COMMERCIAL_v1.0"
set "TARGET_DIR=%~dp0%RELEASE_NAME%"
set "ZIP_FILE=%~dp0%RELEASE_NAME%.zip"

echo [1/4] Chuan bi thu muc dong goi: "%RELEASE_NAME%"...
if exist "%TARGET_DIR%" rd /s /q "%TARGET_DIR%"
if exist "%ZIP_FILE%" del /f /q "%ZIP_FILE%"
mkdir "%TARGET_DIR%"
mkdir "%TARGET_DIR%\api"

echo [2/4] Sao chep cac tap tin ma nguon va tai lieu...
copy /y "CAI_DAT_LAN_DAU.bat" "%TARGET_DIR%\" >nul
copy /y "CHAY_BOT_ZALO.bat" "%TARGET_DIR%\" >nul
copy /y "NGAT_KET_NOI_BOT.bat" "%TARGET_DIR%\" >nul
copy /y "bot-zalo-personal.js" "%TARGET_DIR%\" >nul
copy /y "knowledge.json" "%TARGET_DIR%\" >nul
copy /y "package.json" "%TARGET_DIR%\" >nul
copy /y "vercel.json" "%TARGET_DIR%\" >nul
copy /y "dashboard.html" "%TARGET_DIR%\" >nul
copy /y "index.html" "%TARGET_DIR%\" >nul
copy /y "login.html" "%TARGET_DIR%\" >nul
copy /y "style.css" "%TARGET_DIR%\" >nul
copy /y "haitech-chat-widget.js" "%TARGET_DIR%\" >nul
copy /y "README.md" "%TARGET_DIR%\" >nul
copy /y "SO_TAY_HUONG_DAN_CAI_DAT_VA_SU_DUNG.md" "%TARGET_DIR%\" >nul
copy /y "HUONG_DAN_DONG_GOI_THUONG_MAI.md" "%TARGET_DIR%\" >nul
copy /y "CHUNG_NHAN_BAN_QUYEN_VA_HOP_DONG_MAU.md" "%TARGET_DIR%\" >nul

copy /y "api\facebook-webhook.js" "%TARGET_DIR%\api\" >nul
copy /y "api\knowledge-engine.js" "%TARGET_DIR%\api\" >nul
copy /y "api\zalo-webhook.js" "%TARGET_DIR%\api\" >nul
copy /y "api\website-chat.js" "%TARGET_DIR%\api\" >nul

echo [3/4] Nen toan bo san pham thanh file ZIP thuong mai...
powershell -NoProfile -Command "Compress-Archive -Path '%TARGET_DIR%\*' -DestinationPath '%ZIP_FILE%' -Force"

echo [4/4] Don dep thu muc tam...
rd /s /q "%TARGET_DIR%"

echo.
echo =====================================================================
echo    [+] CHUC MUNG! DA DONG GOI SAN PHAM THANH CONG 100%!
echo =====================================================================
echo.
echo Tap tin dong goi san sang ban giao cho khach hang:
echo    ==^> %ZIP_FILE%
echo.
echo Uu diem cua file dong goi nay:
echo    - Dung luong sieu nhe, khong chua file rac hay cache.
echo    - Co day du file CAI_DAT_LAN_DAU.bat giup khach dung ngay.
echo    - Ho tro da kenh: Zalo ca nhan, Zalo OA, Fanpage, Website LiveChat.
echo    - Co day du Cam nang huong dan tu A-Z va Hop dong ban quyen mau.
echo.
echo Ban chi can gui file "%RELEASE_NAME%.zip" nay qua Zalo hoac Email cho khach!
echo =====================================================================
echo.
pause
