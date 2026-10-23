@echo off
chcp 65001 > nul
title MỞ DASHBOARD BẢN MỚI NHẤT (CÓ CLAUDE & DEEPSEEK)
color 0B

echo =====================================================================
echo    🧠 MỞ DASHBOARD CẤU HÌNH BỘ NÃO AI (CLAUDE, DEEPSEEK, GEMINI)
echo =====================================================================
echo.
echo Đang mở Dashboard bản cập nhật mới nhất trên trình duyệt của anh...
echo.

start "" "%~dp0dashboard.html"
start https://bot-zalo-ai.vercel.app/dashboard.html

echo ✅ Đã mở Dashboard! Anh hãy kiểm tra mục chọn Nền Tảng AI (Provider)
echo    sẽ thấy ngay:
echo    👉 🟣 Anthropic Claude (Claude 3.7 / 3.5 Sonnet)
echo    👉 🇨🇳 DeepSeek AI (DeepSeek V3 / R1)
echo    👉 ⚡ GroqCloud LPU (DeepSeek R1 Miễn phí 0.3s)
echo    👉 🚀 xAI Grok (Elon Musk)
echo.
pause
