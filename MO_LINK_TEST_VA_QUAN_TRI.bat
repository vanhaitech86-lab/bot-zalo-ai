@echo off
chcp 65001 > nul
title HỆ THỐNG LINK CẤU HÌNH & TEST BOT CHO KHÁCH
color 0B

cd /d "%~dp0"

echo =====================================================================
echo    🌐 TỔNG HỢP LINK CẤU HÌNH & GỬI KHÁCH HÀNG TEST BOT
echo                  HAITECH BOT — NGUYỄN VĂN HẢI
echo =====================================================================
echo.
echo [1] Mở Dashboard Quản Trị, Phân Quyền & Quản Lý Khách Hàng (Dùng Thử & Mua Thật)
echo [2] Mở Trang Giới Thiệu & Đăng Ký 7 Ngày Dùng Thử
echo [3] Mở Trang Trợ Lý Riêng Test Trực Tiếp AI Toàn Màn Hình
echo [4] Mở Toàn Bộ File Tài Liệu Hướng Dẫn & Mẫu Tin Nhắn Gửi Khách
echo.
echo =====================================================================
set /p choice="👉 Nhập lựa chọn của anh (1, 2, 3 hoặc 4): "

if "%choice%"=="1" (
    echo Đang mở Dashboard Quản Trị...
    start https://trolybotai.com/dashboard.html
) else if "%choice%"=="2" (
    echo Đang mở Trang Landing Page Dùng Thử...
    start https://trolybotai.com/#dung-thu
) else if "%choice%"=="3" (
    echo Đang mở Trang Trợ Lý Riêng Test AI...
    start https://trolybotai.com/tro-ly-rieng.html
) else (
    echo Đang mở File Tài Liệu Chi Tiết...
    start "" "TAI_LIEU_LINK_WEB_CAU_HINH_VA_TEST_BOT_CHO_KHACH.md"
)

echo.
echo ✅ Thao tác thành công!
pause
