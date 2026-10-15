# 🌐 CẨM NANG CHI TIẾT: ĐƯA BOT ZALO LÊN INTERNET CHẠY TỰ ĐỘNG 24/7
> **Hệ thống:** HAITECH BOT — Trợ lý AI Em Thùy Linh 24/7  
> **Tác giả:** Nguyễn Văn Hải (Hotline/Zalo: 0988 739 896 — Email: vanhaitech.86@gmail.com)  
> **Mục tiêu:** Giúp Bot hoạt động độc lập trên Cloud Internet 24/7/365, tự động tư vấn khách và phản hồi sếp mọi lúc mọi nơi ngay cả khi **máy tính cá nhân tắt hoàn toàn**.

---

## 📌 1. TỔNG QUAN THÔNG TIN KẾT NỐI HỆ THỐNG

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Kho mã nguồn GitHub** | `https://github.com/vanhaitech86-lab/bot-zalo-ai.git` (Nhánh: `master`) |
| **Nền tảng Cloud đề xuất** | **Render.com** (Miễn phí 100%, có máy chủ Singapore phản hồi cực nhanh) |
| **Công cụ giữ Bot thức 24/7** | **UptimeRobot.com** (Ping định kỳ chống ngủ đông tự động) |
| **Hệ thống Webhook Vercel** | `https://bot-zalo-ai.vercel.app` (Đang trực sẵn 24/7 cho Web & Fanpage) |
| **File lấy phiên Zalo** | Nhấp đúp: [`XUAT_CHUOI_SESSION_LEN_CLOUD.bat`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/XUAT_CHUOI_SESSION_LEN_CLOUD.bat) |
| **File đồng bộ mã nguồn** | Nhấp đúp: [`CAP_NHAT_LEN_INTERNET.bat`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/CAP_NHAT_LEN_INTERNET.bat) |

---

## 🚀 2. QUY TRÌNH 5 BƯỚC TRIỂN KHAI LÊN RENDER.COM (CHI TIẾT TỪ A-Z)

---

### BƯỚC 1: LẤY CHUỖI ĐĂNG NHẬP ZALO (ZALO_SESSION_JSON)

Bot sử dụng công nghệ đăng nhập tự động qua Session Cookie đã được mã hóa, **KHÔNG CẦN QUÉT MÃ QR TRÊN CLOUD**.

1. Nhấp đúp vào file [`XUAT_CHUOI_SESSION_LEN_CLOUD.bat`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/XUAT_CHUOI_SESSION_LEN_CLOUD.bat) trên máy tính.
2. Mở file [`SESSION_CLOUD_ENV.txt`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/SESSION_CLOUD_ENV.txt).
3. Tìm đến phần **`👉 GIÁ TRỊ (Value - Hãy sao chép toàn bộ dòng bên dưới):`**
4. Copy toàn bộ chuỗi JSON (bắt đầu bằng `{"cookie":[...`).

---

### BƯỚC 2: ĐỒNG BỘ MÃ NGUỒN LÊN GITHUB

Mã nguồn mới nhất đã được đẩy lên GitHub `vanhaitech86-lab/bot-zalo-ai`.

- Sau này, mỗi khi anh thay đổi bảng giá, kịch bản trong `knowledge.json` hoặc nâng cấp tính năng, anh chỉ cần **nhấp đúp** vào file:
  👉 [`CAP_NHAT_LEN_INTERNET.bat`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/CAP_NHAT_LEN_INTERNET.bat)
- Hệ thống sẽ tự động commit và đẩy lên GitHub. Cloud Render sẽ tự động cập nhật phiên bản mới ngay lập tức.

---

### BƯỚC 3: TẠO DỊCH VỤ WEB SERVICE TRÊN RENDER.COM

1. Truy cập: **[https://dashboard.render.com](https://dashboard.render.com)**.
2. Bấm **Sign In with GitHub** (Đăng nhập bằng tài khoản GitHub có repo `vanhaitech86-lab/bot-zalo-ai`).
3. Nhấp vào nút **`New +`** (màu xanh ở góc phải) -> Chọn **`Web Service`**.
4. Tìm và chọn repository **`bot-zalo-ai`** (hoặc dán đường dẫn `https://github.com/vanhaitech86-lab/bot-zalo-ai.git`).
5. Điền các mục cấu hình chính xác như sau:
   - **Name**: `haitech-zalo-bot` (hoặc tên tùy thích)
   - **Region**: Chọn **`Singapore (Southeast Asia)`** *(Bắt buộc chọn Singapore để đường truyền về Zalo Việt Nam nhanh nhất)*
   - **Branch**: `master`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Chọn **`Free`** ($0/tháng)

---

### BƯỚC 4: THIẾT LẬP BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

Cuộn xuống mục **Environment Variables**, bấm **Add Environment Variable** để thêm 4 biến sau:

| Tên biến (Key) | Giá trị (Value) | Giải thích |
| :--- | :--- | :--- |
| **`ZALO_SESSION_JSON`** | *(Dán toàn bộ chuỗi JSON đã copy ở **Bước 1**)* | Phiên đăng nhập Zalo cá nhân của anh |
| **`GEMINI_API_KEY`** | *(Lấy trong file `.env` trên máy tính)* | Khóa AI Google Gemini Bộ Não 2 |
| **`PORT`** | `3000` | Cổng HTTP Keep-Alive |
| **`NODE_ENV`** | `production` | Chế độ tối ưu hóa hiệu năng |

Sau khi nhập đủ, bấm nút **`Deploy Web Service`** (hoặc *Create Web Service*).

Chờ 1-2 phút, Render sẽ cài đặt thư viện và khởi động bot. Khi anh xem tab **Logs** thấy dòng chữ:
```text
✅ Đăng nhập bằng phiên cũ thành công! Không cần quét lại mã QR.
🌐 [Cloud Keep-Alive]: HTTP Server đang lắng nghe cổng 3000
```
==> **Chúc mừng anh! Bot đã chính thức chạy trên Internet toàn cầu!**

---

### BƯỚC 5: CÀI ĐẶT CHỐNG NGỦ ĐÔNG 24/7 (KEEP-ALIVE VĨNH VIỄN)

Gói miễn phí của Render sẽ tạm dừng dịch vụ sau 15 phút nếu không có lượt truy cập web. Để bot chạy **liên tục 24/24 không bao giờ ngắt kết nối Zalo**:

1. Lấy đường link trang web của Render vừa cấp cho anh (ví dụ: `https://haitech-zalo-bot.onrender.com`).
2. Mở trang web giám sát miễn phí: **[https://uptimerobot.com](https://uptimerobot.com)**.
3. Đăng ký/Đăng nhập tài khoản miễn phí.
4. Bấm **`+ Add New Monitor`**:
   - **Monitor Type**: Chọn **`HTTP(s)`**
   - **Friendly Name**: `Bot Zalo Thùy Linh 24/7`
   - **URL (or IP)**: Dán link Render của anh kèm thêm `/health`  
     *(Ví dụ: `https://haitech-zalo-bot.onrender.com/health`)*
   - **Monitoring Interval**: Chọn **`5 minutes`** (Mỗi 5 phút kiểm tra 1 lần)
5. Bấm **`Create Monitor`**.

> **Kết quả:** Cứ mỗi 5 phút UptimeRobot gửi tín hiệu HTTP đến bot một lần, máy chủ Render sẽ luôn trong trạng thái thức và trực chiến liên tục 24/7/365!

---

## 📱 3. TRẢI NGHIỆM TRÊN ĐIỆN THOẠI KHI MÁY TÍNH ĐÃ TẮT

Sau khi hoàn thành, anh có thể **tắt nguồn máy tính, rút phích cắm**:

1. **Làm việc cùng Trợ lý riêng**:
   - Mở app Zalo trên điện thoại.
   - Vào mục **"Cloud của tôi"** (Truyền File).
   - Nhắn tin bất kỳ câu hỏi nào: *Soạn báo giá, viết bài quảng cáo, dịch thuật...*  
   - Thùy Linh sẽ trả lời ngay lập tức trên điện thoại của anh trong **0.8 giây**.

2. **Chăm sóc & Tư vấn khách hàng tự động**:
   - Khi có khách hàng nhắn tin tới Zalo cá nhân của anh, Thùy Linh trên Cloud sẽ tự động tư vấn, chào giá và xin số điện thoại.
   - Bạn bè, người thân nhắn tin bình thường thì Thùy Linh sẽ tự im lặng (chế độ Lọc khách thông minh).

3. **Nhận số điện thoại khách hàng**:
   - Khi có khách để lại số điện thoại, Thùy Linh sẽ tự động bắn tin nhắn báo động *"Ting Ting"* vào "Cloud của tôi" trên điện thoại anh.
   - Dữ liệu đồng thời được lưu tự động vào **Google Sheets Online** trên Google Drive của anh.

---

## 🛠️ 4. XỬ LÝ SỰ CỐ & THẮC MẮC THƯỜNG GẶP

### Q1: Sau này đổi mật khẩu Zalo hoặc phiên đăng nhập hết hạn thì làm thế nào?
- **Cách xử lý:**
  1. Trên máy tính, chạy file [`KET_NOI_ZALO_THUY_LINH.bat`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/KET_NOI_ZALO_THUY_LINH.bat) để quét lại mã QR 1 lần.
  2. Bấm file [`XUAT_CHUOI_SESSION_LEN_CLOUD.bat`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/XUAT_CHUOI_SESSION_LEN_CLOUD.bat).
  3. Mở [`SESSION_CLOUD_ENV.txt`](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/SESSION_CLOUD_ENV.txt) copy chuỗi JSON mới.
  4. Lên Render.com -> Mục **Environment Variables** -> Dán đè chuỗi mới vào biến `ZALO_SESSION_JSON` -> Bấm **Save Changes**. Bot sẽ tự khởi động lại với tài khoản mới.

### Q2: Muốn tạm dừng bot trên Cloud để tự nhắn tin tay thì làm thế nào?
- Mở Zalo trên điện thoại -> Vào **"Cloud của tôi"** -> Nhắn tin lệnh:  
  `tat bot` hoặc `nghi ngoi`  
- Thùy Linh sẽ phản hồi: *"Dạ, em đã tạm dừng trực rồi ạ!"*. Khi nào muốn bật lại chỉ cần nhắn:  
  `bat bot` hoặc `lam viec`.

---

*(Tài liệu này được tạo và lưu trữ tự động trong hệ thống HAITECH BOT để anh Hải sử dụng lâu dài).*
