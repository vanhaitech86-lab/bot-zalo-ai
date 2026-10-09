# 🏆 CÔNG THỨC VẬN HÀNH & TÀI LIỆU HƯỚNG DẪN TỪNG BƯỚC MỘT
## HỆ THỐNG TRỢ LÝ AI EM THÙY LINH & HAITECH BOT (MASTER BLUEPRINT)

> **Tác giả & Bản quyền:** Nguyễn Văn Hải — HaiTech AI  
> **Hotline/Zalo hỗ trợ:** 0988 739 896  
> **Kho mã nguồn GitHub:** `https://github.com/vanhaitech86-lab/bot-zalo-ai.git`  
> **Mục tiêu:** Cẩm nang công thức chuẩn hoá (SOP - Standard Operating Procedure) giúp anh Hải tự vận hành, đào tạo nhân sự, chuyển giao thương mại hoặc làm tài liệu hướng dẫn cho khách hàng từ A đến Z.

---

```
                       ┌────────────────────────────────────────┐
                       │     KIẾN TRÚC TỔNG THỂ HAITECH AI      │
                       └───────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  BỘ NÃO 1: TRI THỨC │             │ BỘ NÃO 2: GEMINI │             │  BỘ LỌC NGỮ CẢNH │
│ (knowledge.json) │             │  (Flash Lite AI) │             │ (Nhóm & Bạn bè)  │
└────────┬─────────┘             └────────┬─────────┘             └────────┬─────────┘
         │                                │                                │
         └────────────────────────────────┼────────────────────────────────┘
                                           ▼
                       ┌────────────────────────────────────────┐
                       │   TRỢ LÝ ĐA NĂNG "EM THÙY LINH"        │
                       │ • Trợ lý riêng cho Sếp Hải (Cloud)     │
                       │ • Lọc khách thông minh (Chat 1-1)      │
                       │ • Trực nhóm & Chốt đơn (@thuylinh)     │
                       │ • Tự bắt SĐT Lead -> Đồng bộ Sheets    │
                       └────────────────────────────────────────┘
```

---

## 📌 MỤC LỤC CÔNG THỨC 6 BƯỚC CHUẨN HOÁ
1. **[BƯỚC 1] Công thức Quản trị Danh tính & Ảnh đại diện (Avatar)**
2. **[BƯỚC 2] Công thức Cấu hình Tri thức Sản phẩm & Báo giá**
3. **[BƯỚC 3] Công thức Trực nhóm Zalo & Kỹ thuật Chốt đơn với `@thuylinh`**
4. **[BƯỚC 4] Công thức Điều khiển Từ xa qua "Cloud của tôi" trên Điện thoại**
5. **[BƯỚC 5] Công thức Đưa Bot lên Cloud chạy 24/7 khi Tắt máy tính**
6. **[BƯỚC 6] Công thức Đóng gói, Cho thuê & Bàn giao Khách hàng**

---

## 🌟 BƯỚC 1: CÔNG THỨC QUẢN TRỊ DANH TÍNH & ẢNH ĐẠI DIỆN (AVATAR)

### 1.1. Bản chất kỹ thuật của Zalo:
* **Mỗi tài khoản Zalo (1 số điện thoại) chỉ có 1 ảnh đại diện duy nhất.**
* Nếu đổi avatar trên ứng dụng Zalo của nick đó -> Toàn bộ khách hàng, bạn bè và hội nhóm đều thấy avatar mới.

### 1.2. Công thức lựa chọn mô hình tối ưu:

| Mô hình | Cách triển khai | Ưu điểm | Trường hợp nên dùng |
| :--- | :--- | :--- | :--- |
| **Mô hình 1: Dùng chung Zalo cá nhân (0988 739 896)** | Giữ **100% ảnh đại diện thật của anh Hải**. Bot tự xưng: *"Em là Thùy Linh — Trợ lý AI của anh Hải..."* | • Nâng tầm uy tín cá nhân của anh Hải.<br>• Bạn bè, người thân thấy bình thường.<br>• Khách hàng thấy công ty công nghệ rất xịn vì Sếp có trợ lý AI trực thay. | **Khuyên dùng hiện tại**, tiết kiệm chi phí, tận dụng tệp bạn bè và uy tín sẵn có. |
| **Mô hình 2: Tách biệt hoàn toàn (Mô hình Doanh nghiệp)** | Mua thêm **1 SIM phụ giá rẻ**, tạo nick Zalo riêng tên **"Em Thùy Linh — HaiTech AI"** và đặt ảnh chân dung AI. | • Nick chính của anh Hải hoàn toàn riêng tư.<br>• Nick Thùy Linh chuyên đi add nhóm, săn lead, chốt đơn 24/7 độc lập. | Dành cho giai đoạn quy mô mở rộng, chạy nhiều hội nhóm lớn. |
| **Mô hình 3: Đổi ảnh trên Web/Dashboard** | Copy ảnh mới, đổi tên thành `AVATAR_THUY_LINH.jpg` và `bot-avatar.png` bỏ vào thư mục bot. | Cập nhật giao diện web máy tính đẹp mắt, **100% không ảnh hưởng nick Zalo thật**. | Dùng khi trình chiếu demo hoặc quản trị nội bộ. |

---

## 📚 BƯỚC 2: CÔNG THỨC CẤU HÌNH TRI THỨC & BÁO GIÁ

Dữ liệu tri thức được lưu tại file: [knowledge.json](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/knowledge.json).

### 2.1. Cấu trúc bảng giá & dịch vụ mẫu chuẩn:
1. **Dịch vụ Tool & Video AI:** Từ 500.000đ – 2.000.000đ / dự án.
2. **Thiết kế Website / Web App AI:** Từ 2.500.000đ – 5.000.000đ (Bàn giao trọn gói).
3. **Phần mềm / Bot Zalo tự động chăm sóc khách 24/7:**
   - Gói Cơ bản: 300.000đ / tháng.
   - Gói Tiêu chuẩn: 500.000đ / tháng.
   - Gói Pro Không giới hạn: 1.000.000đ / tháng.
   - **Chính sách đặc biệt: Cho trải nghiệm dùng thử 7 ngày hoàn toàn miễn phí!**

### 2.2. Quy tắc tự động nạp (Hot-Reload):
* Khi sửa file `knowledge.json` và bấm **Save (Ctrl + S)**, Bot sẽ **tự động nạp lại dữ liệu ngay lập tức trong 0.1 giây** mà không cần phải khởi động lại phần mềm!

---

## 👥 BƯỚC 3: CÔNG THỨC TRỰC NHÓM ZALO & KỸ THUẬT CHỐT ĐƠN

Mã nguồn xử lý: [bot-zalo-personal.js](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/bot-zalo-personal.js).

### 3.1. Cơ chế lọc kích hoạt:
* **Hội thoại nhóm tự nhiên:** Thùy Linh **TUYỆT ĐỐI IM LẶNG**, không can thiệp, không làm phiền thành viên nhóm.
* **Kích hoạt khi gọi:** Chỉ khi có tin nhắn chứa:
  - Tag `@` chọn nick Thùy Linh.
  - Chữ: `@thuylinh`, `@thùylinh`, `@Thùy Linh`, `thùy linh ơi`, `thuylinh ơi`, `em thùy linh`, `@bot`, `bot ơi`.

### 3.2. Quy trình 4 bước trả lời & chốt đơn:
1. **Bước 1 — Trích dẫn (Quote):** Tự động trích dẫn câu hỏi của người gọi để cả nhóm nắm bắt.
2. **Bước 2 — Trả lời súc tích (2 - 3 câu):** Xưng "em", gọi "anh/chị" lịch sự, đi thẳng vào đáp án kỹ thuật/dịch vụ.
3. **Bước 3 — Điều hướng chốt đơn:** Gợi ý kết nối ngay với anh Nguyễn Văn Hải (Hotline/Zalo: 0988 739 896) hoặc để lại số điện thoại để nhận demo mẫu và ưu đãi.
4. **Bước 4 — Thu thập Lead tự động (Lead Capture Engine):**
   - Nếu khách nhắn số điện thoại (10 số: 03x, 05x, 07x, 08x, 09x...):
     + Tự động lưu vào file `leads.json`.
     + Đồng bộ tức thì lên Google Sheets Online.
     + Bắn tin nhắn báo động đỏ lập tức về **"Cloud của tôi"** trên Zalo của anh Hải:
       ```
       🔔 [CÓ KHÁCH HÀNG MỚI ĐỂ LẠI SĐT]
       👤 Khách: Nguyễn Văn A
       📞 Số điện thoại: 0912345678
       💬 Lời nhắn: "@thuylinh tư vấn web sđt mình nhé"
       👉 Anh Hải hãy gọi điện tư vấn chốt đơn ngay nhé! 🚀
       ```

---

## 📱 BƯỚC 4: CÔNG THỨC ĐIỀU KHIỂN TỪ XA QUA "CLOUD CỦA TÔI"

Anh Hải chỉ cần mở Zalo trên điện thoại, vào mục **Cloud của tôi (Truyền File / My Documents)** và nhắn các cú pháp sau:

| Lệnh nhắn | Ý nghĩa | Hành vi của Em Thùy Linh |
| :--- | :--- | :--- |
| `#rieng` | **Chế độ Trợ lý Riêng** | Chỉ làm việc 1 mình với anh Hải (soạn bài, viết code, dịch thuật). Bỏ qua 100% người ngoài. |
| `#khach` | **Lọc khách thông minh** | Tự động tư vấn khách hỏi mua hàng/dịch vụ. Tự động bỏ qua bạn bè nhắn tán gẫu. |
| `#leads` | **Xem danh sách Lead** | In ra toàn bộ số điện thoại và tên khách hàng tiềm năng vừa thu thập được. |
| `#tat` | **Tạm dừng trực khách** | Bot dừng tự động trả lời, để anh Hải tự chat tay với khách. |
| `#bat` | **Bật lại trực khách** | Bật lại chế độ trực chiến 24/7. |
| `#trangthai` | **Kiểm tra hệ thống** | Báo cáo tình trạng BẬT/TẮT, chế độ hiện tại, tốc độ AI. |
| `#dangxuat` | **Ngắt kết nối sạch** | Đăng xuất tài khoản Zalo và xóa phiên khỏi hệ thống. |
| *(Câu hỏi bất kỳ)* | **Chat với Trợ lý** | Em Thùy Linh sẽ trả lời, tư vấn chiến lược, viết nội dung content cho anh Hải ngay trong Cloud. |

---

## ☁️ BƯỚC 5: CÔNG THỨC ĐƯA BOT LÊN CLOUD CHẠY 24/7 (TẮT MÁY VẪN CHẠY)

### 5.1. File dữ liệu cần thiết:
* Chuỗi đăng nhập đã tạo sẵn: [SESSION_CLOUD_ENV.txt](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/SESSION_CLOUD_ENV.txt).
* Kho Git GitHub: `https://github.com/vanhaitech86-lab/bot-zalo-ai.git` (nhánh `master`).

### 5.2. Các bước triển khai trên Render.com (Miễn phí 100%):
1. Truy cập: [https://dashboard.render.com](https://dashboard.render.com) và đăng nhập bằng GitHub.
2. Bấm **New +** -> Chọn **Background Worker** (hoặc Web Service).
3. Chọn Repository: `bot-zalo-ai`.
4. Điền cấu hình cơ bản:
   - **Name:** `haitech-zalo-bot`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node bot-zalo-personal.js`
   - **Instance Type:** `Free`
5. Cuộn xuống mục **Environment Variables (Biến môi trường)**, bấm **Add Environment Variable**:
   - **Biến 1:**
     + Key: `ZALO_SESSION_JSON`
     + Value: *(Sao chép toàn bộ dòng JSON trong file `SESSION_CLOUD_ENV.txt` dán vào)*
   - **Biến 2:**
     + Key: `GEMINI_API_KEY`
     + Value: *(Khóa Gemini API của anh)*
   - **Biến 3:**
     + Key: `ONLINE_LEADS_WEBHOOK` *(Tùy chọn nếu dùng Google Sheets)*
     + Value: *(Link Webhook Google Sheets)*
6. Bấm **Create Background Worker**.
7. Chờ 1 - 2 phút, màn hình hiện **"Live / Active"** -> **Hoàn tất! Bot sẽ trực vĩnh viễn 24/7 ngay cả khi máy tính của anh tắt hoàn toàn!**

---

## 💼 BƯỚC 6: CÔNG THỨC ĐÓNG GÓI, CHO THUÊ & BÀN GIAO CHO KHÁCH HÀNG

### 6.1. Quy trình cấp quyền trải nghiệm cho khách mới:
1. **Bước 1:** Giải nén gói `HAITECH_BOT_COMMERCIAL_v1.0.zip` ra thư mục riêng, ví dụ: `E:\BOT_KHACH_HANG_A\`.
2. **Bước 2:** Mở `knowledge.json` trong thư mục đó, sửa lại:
   - Tên shop của khách.
   - Số điện thoại hotline của khách.
   - Bảng giá, sản phẩm của khách.
3. **Bước 3:** Nhấp đúp vào [KET_NOI_ZALO_THUY_LINH.bat](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/KET_NOI_ZALO_THUY_LINH.bat).
4. **Bước 4:** Gửi ảnh `qr.png` qua Zalo cho khách (hoặc UltraViewer) và bảo khách: *"Anh/chị mở Zalo trên điện thoại -> Quét mã QR này để trợ lý kích hoạt trực chiến nhé!"*.
5. **Bước 5:** Khách quét xong là hệ thống của họ tự chạy 100%.

### 6.2. Kịch bản tư vấn chốt đơn cho khách thuê:
* **Lời chào:** *"Chào anh/chị, bên em có giải pháp Trợ lý AI Em Thùy Linh trực Zalo cá nhân 24/7, tự động tư vấn, lọc bạn bè và thu thập số điện thoại khách hàng gửi thẳng về Zalo cho anh/chị."*
* **Chính sách phễu:** *"Bên em đang hỗ trợ doanh nghiệp và chủ shop DÙNG THỬ 7 NGÀY HOÀN TOÀN MIỄN PHÍ, không cần cọc tiền. Anh/chị chỉ cần quét mã QR là trải nghiệm ngay lập tức!"*

---

## 📁 DANH MỤC CÁC FILE QUAN TRỌNG TRONG HỆ THỐNG

| Tên File | Chức năng chính |
| :--- | :--- |
| [bot-zalo-personal.js](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/bot-zalo-personal.js) | Trái tim vận hành Bot: Bộ não kép Gemini, lọc nhóm `@thuylinh`, bắt SĐT Lead, điều khiển Cloud. |
| [knowledge.json](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/knowledge.json) | Cơ sở tri thức, giá cả, dịch vụ của HaiTech AI (Auto-reload khi lưu). |
| [SESSION_CLOUD_ENV.txt](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/SESSION_CLOUD_ENV.txt) | Chuỗi phiên Zalo chuẩn hoá để nạp lên Render.com chạy không cần mở máy tính. |
| [XUAT_CHUOI_SESSION_LEN_CLOUD.bat](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/XUAT_CHUOI_SESSION_LEN_CLOUD.bat) | File 1-click tự động trích xuất chuỗi session nén khi đăng nhập mới. |
| [dashboard.html](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/dashboard.html) | Bảng điều khiển Studio trực quan xem trạng thái và quản lý dữ liệu. |
| [tro-ly-rieng.html](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/tro-ly-rieng.html) | Giao diện làm việc riêng giữa Sếp Hải và Em Thùy Linh trên trình duyệt. |
| [BAT_THUY_LINH.bat](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/BAT_THUY_LINH.bat) | Bật bot trực chiến trên máy tính cá nhân. |
| [TAT_THUY_LINH.bat](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/TAT_THUY_LINH.bat) | Tạm dừng bot để tự chat tay. |
| [NGAT_KET_NOI_BOT.bat](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/NGAT_KET_NOI_BOT.bat) | Ngắt kết nối và đăng xuất Zalo an toàn. |
| [DANH_SACH_LINK_VA_THONG_TIN_DAU_NOI.txt](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/DANH_SACH_LINK_VA_THONG_TIN_DAU_NOI.txt) | Toàn bộ đường link Webhook, LiveChat Widget và tài nguyên đấu nối. |
