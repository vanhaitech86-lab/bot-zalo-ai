@echo off
chcp 65001 > nul
title ĐỒNG BỘ MÃ NGUỒN LÊN INTERNET (GITHUB & CLOUD HOST)
color 0B

cd /d "%~dp0"

echo =====================================================================
echo       🚀 ĐỒNG BỘ CẬP NHẬT MÃ NGUỒN LÊN HOST INTERNET TỰ ĐỘNG
echo                     HAITECH AI — NGUYỄN VĂN HẢI
echo =====================================================================
echo.
echo Khi anh bấm chạy file này:
echo   1. Toàn bộ nội dung tri thức, code mới sửa trên máy sẽ được lưu lại.
echo   2. Hệ thống đẩy lên GitHub: https://github.com/vanhaitech86-lab/bot-zalo-ai.git
echo   3. Máy chủ Cloud (Vercel / Render) sẽ TỰ ĐỘNG CẬP NHẬT ngay lập tức!
echo   4. KHÔNG làm mất phiên Zalo, KHÔNG phải quét lại mã QR!
echo.
echo =====================================================================
echo.

set /p note="👉 Nhập ghi chú cho lần sửa này (hoặc Enter để để mặc định): "
if "%note%"=="" set note="Cap nhat tinh nang va tri thuc moi nhat"

echo.
echo ⏳ [1/3] Đang gom các thay đổi mới...
git add .

echo ⏳ [2/3] Đang đóng gói bản cập nhật...
git commit -m "%note%"

echo ⏳ [3/3] Đang đẩy lên GitHub và Cloud Host...
git push origin master

if %errorlevel% equ 0 (
    echo.
    echo =====================================================================
    echo ✅ ĐỒNG BỘ THÀNH CÔNG RỰC RỠ!
    echo Máy chủ trên Internet đã nhận code mới và tự động cập nhật ngay bây giờ.
    echo =====================================================================
) else (
    echo.
    echo ⚠️ Có lỗi khi đẩy code. Vui lòng kiểm tra lại kết nối mạng Internet!
)

echo.
pause
