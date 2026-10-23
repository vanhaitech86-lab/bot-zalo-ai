# 🌐 HƯỚNG DẪN KÍCH HOẠT HAITECH BOT CHẠY 24/7 TRÊN HOST TENTEN (trolybotai.com)

> **Tác giả:** HAITECH AI (Nguyễn Văn Hải — Hotline/Zalo: 0988 739 896)  
> **Tên miền chính thức:** `https://trolybotai.com`  
> **Địa chỉ IP Host Tenten:** `150.95.109.12`  
> **Mục tiêu:** Giúp Bot Zalo cá nhân chạy 24/7/365 trực tiếp trên máy chủ Tenten của anh, tắt máy tính cá nhân thoải mái!

---

## 📌 1. BẢN CHẤT HỆ THỐNG TRÊN TENTEN HIỆN TẠI

1. **Website & Dashboard (`trolybotai.com`):** Đã chạy thành công 100% trên Tenten. Khách truy cập web, xem bảng giá hay dashboard đều trực tiếp từ Tenten.
2. **Động cơ Bot Zalo Cá nhân (`bot-zalo-personal.js`):** Cần một tiến trình Node.js chạy ngầm liên tục 24/24 trên Tenten. Trước đây bot chạy trên máy tính của anh nên khi tắt máy là bot dừng.

Để Bot chạy 24/7 ngay trên máy chủ Tenten mà **KHÔNG CẦN BẬT MÁY TÍNH CÁ NHÂN**, anh chỉ cần thực hiện 1 trong 2 cách dưới đây tùy theo gói Tenten anh đang có:

---

## 🚀 CÁCH 1: NẾU GÓI TENTEN CỦA ANH LÀ CLOUD VPS (KHUYÊN DÙNG — CỰC KỲ MẠNH MẼ)

Máy chủ Tenten của anh (`150.95.109.12`) đã **mở sẵn cổng SSH 22**.

### Bước 1: Mở Terminal hoặc PowerShell trên máy tính gõ:
```bash
ssh root@150.95.109.12
```
*(Nhập mật khẩu SSH root do Tenten gửi vào email lúc anh mua VPS)*.

### Bước 2: Dán đúng 1 dòng lệnh duy nhất này vào VPS:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs git && npm install -g pm2 && git clone https://github.com/vanhaitech86-lab/bot-zalo-ai.git /root/bot-zalo && cd /root/bot-zalo && npm install && pm2 start bot-zalo-personal.js --name "haitech-bot" -- --force-active && pm2 startup && pm2 save
```

### Bước 3: Đẩy file đăng nhập Zalo `session.json` lên VPS:
Từ cửa sổ PowerShell trên máy tính của anh, gõ lệnh:
```bash
scp "e:\BOT ZALO CHĂM SÓC KHÁCH  TỰ ĐỘNG\session.json" root@150.95.109.12:/root/bot-zalo/
scp "e:\BOT ZALO CHĂM SÓC KHÁCH  TỰ ĐỘNG\.env" root@150.95.109.12:/root/bot-zalo/
```
Sau đó trên VPS khởi động lại:
```bash
pm2 restart haitech-bot
```
👉 **XONG 100%!** Bot sẽ chạy ngầm vĩnh viễn trên VPS Tenten. Anh tắt máy tính thoải mái!

---

## 🚀 CÁCH 2: NẾU QUẢN TRỊ QUA BẢNG ĐIỀU KHIỂN PLESK PANEL CỦA TENTEN

Máy chủ Tenten của anh có cổng Plesk **8443** đang mở sẵn.

1. Mở trình duyệt web truy cập: **`https://trolybotai.com:8443`** (hoặc `https://150.95.109.12:8443`).
2. Đăng nhập bằng tên đăng nhập & mật khẩu quản trị Hosting Tenten cấp.
3. Vào mục **Websites & Domains** -> Tìm tên miền `trolybotai.com` -> Nhấp vào biểu tượng **Node.js**:
   - **Node.js Version:** Chọn phiên bản `20.x` (hoặc `18.x`).
   - **Document Root:** `/httpdocs`
   - **Application Root:** `/httpdocs`
   - **Application Startup File:** `bot-zalo-personal.js`
   - Bấm nút **Enable Node.js** và bấm **NPM Install**.
4. Vào phần **Custom environment variables** (Biến môi trường) thêm:
   - `GEMINI_API_KEY`: *(Lấy trong file .env trên máy tính của anh)*
   - `FORCE_ACTIVE`: `true`
5. Bấm **Restart**.

👉 **HOÀN TẤT!** Bot sẽ được chính Plesk Tenten duy trì chạy 24/24.
