# 🌐 HƯỚNG DẪN VẬN HÀNH TRỢ LÝ THÙY LINH ONLINE 24/7 KHI MÁY TÍNH ĐÃ TẮT

> **Tác giả:** HAITECH AI (Nguyễn Văn Hải — Hotline/Zalo: 0988 739 896)  
> **Mục tiêu:** Giúp Em Thùy Linh luôn trực chiến 24/7/365, tự động tư vấn khách hàng, lưu số điện thoại online và phục vụ anh Hải mọi lúc mọi nơi trên điện thoại di động ngay cả khi **máy tính cá nhân tắt hoàn toàn**.

---

## 1. BẢN CHẤT HOẠT ĐỘNG: VÌ SAO CẦN CLOUD KHI TẮT MÁY TÍNH?

- **Khi chạy trên máy tính cá nhân:** File `bot-zalo-personal.js` chạy bằng CPU và nguồn điện của máy tính anh. Khi anh tắt máy hoặc gập laptop lại, tiến trình bị ngắt -> Zalo ngắt kết nối.
- **Giải pháp tối ưu nhất:** Đưa bot lên **Cloud (Máy chủ đám mây)**. Máy chủ đám mây hoạt động 24/24 trong trung tâm dữ liệu, có nguồn điện dự phòng và đường truyền internet tốc độ cao, không bao giờ tắt.

---

## 2. BẠN SỬ DỤNG TRÊN ĐIỆN THOẠI NHƯ THẾ NÀO KHI MÁY TÍNH ĐÃ TẮT?

Khi hệ thống đã chạy trên Cloud, anh Hải **không cần mở máy tính nữa**. Mọi thao tác thực hiện 100% trên điện thoại:

1. **Giao việc & Tâm sự cùng Trợ lý Thùy Linh:**
   - Mở Zalo trên điện thoại -> Vào mục **"Cloud của tôi" (Truyền File)**.
   - Nhắn bất kỳ câu hỏi nào: *Soạn bài viết, viết kịch bản video TikTok 60s, viết code, tư vấn chiến lược...* Thùy Linh sẽ trả lời anh ngay trên điện thoại trong **0.8 giây**.
2. **Khách hàng nhắn tin tới Zalo cá nhân của anh:**
   - Thùy Linh trên Cloud sẽ tự động nhận diện tin nhắn, tư vấn sản phẩm/dịch vụ và xin số điện thoại của khách.
   - Bạn bè nhắn tin cá nhân thì Thùy Linh sẽ tự động im lặng (nhờ chế độ Lọc khách thông minh).
3. **Nhận số điện thoại khách hàng tức thì:**
   - Khi có khách để lại SĐT, Thùy Linh tự động bắn thông báo ting ting vào *"Cloud của tôi"* trên Zalo của anh.
   - Dữ liệu đồng thời được lưu thẳng vào **Google Sheets online** trên Google Drive của anh. Anh chỉ cần mở app Google Sheets trên điện thoại là thấy ngay!

---

## 3. CÁC PHƯƠNG ÁN ĐƯA LÊN CLOUD (TỪ DỄ ĐẾN CHUYÊN NGHIỆP)

---

### 🌟 PHƯƠNG ÁN 1: DÙNG RENDER.COM HOẶC KOYEB (MIỄN PHÍ 100% — KHUYÊN DÙNG)
*Thời gian thiết lập: Khoảng 3 phút. Không tốn bất kỳ chi phí nào.*

Em đã chuẩn bị sẵn file cấu hình [`render.yaml`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/render.yaml) và [`Dockerfile`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/Dockerfile).

#### Các bước thực hiện:
1. **Lấy chuỗi đăng nhập Zalo:**
   - Nhấp đúp vào file [`XUAT_CHUOI_SESSION_LEN_CLOUD.bat`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/XUAT_CHUOI_SESSION_LEN_CLOUD.bat).
   - Mở file [`SESSION_CLOUD_ENV.txt`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/SESSION_CLOUD_ENV.txt) vừa được tạo ra và copy toàn bộ dòng mã `ZALO_SESSION_JSON`.
2. **Đưa mã nguồn lên GitHub:**
   - Tạo 1 repository riêng tư (Private Repo) trên [GitHub.com](https://github.com).
   - Đẩy toàn bộ thư mục bot này lên repo đó.
3. **Kết nối vào Render.com:**
   - Đăng nhập [Render.com](https://render.com) (bằng tài khoản GitHub miễn phí).
   - Bấm **New** -> **Web Service** -> Chọn Repository GitHub của anh.
   - Tại mục **Environment Variables**, thêm 1 biến:
     - **Key:** `ZALO_SESSION_JSON`
     - **Value:** Dán toàn bộ chuỗi session đã copy ở Bước 1 vào.
   - Bấm **Create Web Service**.
4. **Hoàn tất:**
   - Render sẽ tự động dựng và chạy bot.
   - Bot tự động đăng nhập Zalo của anh ngay trên Cloud mà **KHÔNG CẦN QUÉT LẠI MÃ QR**!
   - Từ giờ anh có thể tắt máy tính thoải mái!

---

### 🌟 PHƯƠNG ÁN 2: THUÊ VPS LINUX GIÁ RẺ (50.000đ – 90.000đ/tháng HOẶC DÙNG ORACLE CLOUD FREE)
*Phù hợp khi anh muốn chạy hệ thống kinh doanh lớn, ổn định 100% quanh năm suốt tháng.*

Anh có thể thuê VPS tại Việt Nam (Vietnix, TinoHost, BKNS...) hoặc VPS quốc tế:

1. Đăng nhập vào VPS qua SSH (dùng phần mềm MobaXterm hoặc PuTTY).
2. Chạy lệnh cài đặt Node.js và PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. Tải thư mục bot lên VPS và chạy lệnh:
   ```bash
   cd "BOT ZALO CHĂM SÓC KHÁCH  TỰ ĐỘNG"
   npm install
   pm2 start bot-zalo-personal.js --name "haitech-bot"
   pm2 startup
   pm2 save
   ```
4. **Xong!** Bot sẽ chạy ngầm vĩnh viễn trên máy chủ, dù máy chủ có khởi động lại thì PM2 cũng tự động bật lại bot.

---

### 🌟 PHƯƠNG ÁN 3: KẾT NỐI VÀO ZALO OA DOANH NGHIỆP TRÊN VERCEL (100% SERVERLESS CLOUD)
*Hoàn toàn không cần máy chủ, không tốn tài nguyên.*

Hệ thống của anh hiện đã được triển khai sẵn trên nền tảng **Vercel Cloud toàn cầu**:
- **Trang chủ Studio:** `https://bot-zalo-ai.vercel.app`
- **Webhook Zalo OA:** `https://bot-zalo-ai.vercel.app/api/zalo-webhook`
- **Webhook Fanpage Facebook:** `https://bot-zalo-ai.vercel.app/api/facebook-webhook`
- **LiveChat AI Website:** `https://bot-zalo-ai.vercel.app/api/website-chat`

Chỉ cần đăng ký một trang **Zalo Official Account (Zalo OA)** miễn phí tại [oa.zalo.me](https://oa.zalo.me), dán webhook Vercel vào cổng nhà phát triển Zalo, khách hàng chat vào OA là Thùy Linh trả lời 24/7 không cần mở máy tính một giây nào!

---

## 4. TỔNG KẾT QUY TRÌNH TỐI ƯU NHẤT CHO ANH HẢI

| Nhu cầu của anh | Giải pháp tối ưu nhất | Thao tác thực hiện |
| :--- | :--- | :--- |
| **Muốn dùng Zalo cá nhân hiện tại (0988 739 896) khi tắt máy** | **Phương án 1 (Render.com)** hoặc **Phương án 2 (VPS)** | Bấm `XUAT_CHUOI_SESSION_LEN_CLOUD.bat` lấy chuỗi session dán lên Render là xong. |
| **Muốn mở điện thoại là chat được với Thùy Linh** | **Zalo -> "Cloud của tôi"** | Nhắn tin trực tiếp trên điện thoại, Thùy Linh phản hồi trong 0.8s. |
| **Muốn xem danh sách khách hàng khi máy tính tắt** | **Google Sheets trên điện thoại** | Mở app Google Sheets trên điện thoại để xem số điện thoại khách tự động cập nhật. |
| **Muốn trực chat trên Website & Fanpage khi tắt máy** | **Vercel Cloud (Đã sẵn sàng 100%)** | Đã online 24/7 tại `https://bot-zalo-ai.vercel.app`. |
