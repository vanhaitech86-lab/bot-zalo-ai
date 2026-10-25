# 🚀 HƯỚNG DẪN SỬ DỤNG NHANH BOT ZALO CHĂM SÓC KHÁCH HÀNG 24/7 (HAITECH AI)

---

## 🔍 NGUYÊN NHÂN BOT KHÔNG HOẠT ĐỘNG VỪA QUA & ĐÃ ĐƯỢC XỬ LÝ:
1. **Phiên đăng nhập Zalo (`session.json`) đã hết hạn:** Zalo tự động vô hiệu hóa cookie sau một khoảng thời gian hoặc khi bạn đăng xuất trên điện thoại.
2. **Bot chạy ẩn nhưng chưa đăng nhập:** File chạy ngầm `.vbs` ẩn cửa sổ đen CMD khiến bạn không nhìn thấy mã QR để quét.
3. **Mã QR hết hạn không tự làm mới:** Mã QR cũ trước đây không tự refresh, dẫn đến việc quét bị báo lỗi hoặc không nhận.

---

## 🛠️ CÁC CẢI TIẾN ĐÃ ĐƯỢC CẬP NHẬT HOÀN TẤT:
- ✅ **Trang mã QR thông minh (`qr.html`):** Tự động làm mới mỗi 12 giây, chỉ mở trình duyệt 1 lần duy nhất, tự đổi sang thông báo **"🎉 ĐĂNG NHẬP THÀNH CÔNG"** khi bạn quét xong.
- ✅ **Tự động dọn dẹp tiến trình treo:** Khi bấm file `.bat`, hệ thống tự động tắt tiến trình cũ bị treo để tránh xung đột.
- ✅ **Bảo vệ chế độ chạy ẩn:** File `CHAY_AN_247_KHONG_LO_TAT.vbs` sẽ thông báo ngay nếu chưa quét QR, ngăn chặn tình trạng bot chạy ngầm mà không ai biết.
- ✅ **Bộ não AI Google Gemini:** Đã kiểm tra và phản hồi siêu tốc (~0.8s), kết hợp hoàn hảo cùng bộ quy tắc giá và lọc bạn bè thông minh.

---

## 📖 HƯỚNG DẪN 3 BƯỚC SỬ DỤNG NHANH:

### 👉 BƯỚC 1: BẬT BOT ĐỂ QUÉT MÃ QR
- Nhấp đúp chuột vào file: **`BAT_THUY_LINH.bat`** (hoặc `CHAY_BOT_ZALO.bat`).
- Cửa sổ màn hình đen và trình duyệt web sẽ hiển thị mã QR to rõ.

### 👉 BƯỚC 2: QUÉT MÃ QR TRÊN ĐIỆN THOẠI (10 GIÂY)
1. Mở ứng dụng **Zalo** trên điện thoại (tài khoản số Zalo dùng làm bot).
2. Bấm vào biểu tượng **Quét mã QR** ở góc trên cùng bên phải màn hình Zalo.
3. Hướng camera vào mã QR trên màn hình máy tính.
4. Bấm **"Đăng nhập"** (hoặc **"Xác nhận"**) trên điện thoại.
5. Khi màn hình trình duyệt hiện **"🎉 ĐĂNG NHẬP THÀNH CÔNG!"**, bot đã chính thức hoạt động 24/7!

---

### 👉 BƯỚC 3: CHỌN CÁCH VẬN HÀNH TIỆN LỢI NHẤT

| Mục đích | Thao tác |
|---|---|
| **Chạy ẩn ngầm 24/7 (Không có cửa sổ đen CMD)** | Nhấp đúp vào **`CHAY_AN_247_KHONG_LO_TAT.vbs`** (Không sợ bấm nhầm nút tắt máy). |
| **Kiểm tra bot có đang chạy không** | Nhấp đúp vào **`KIEM_TRA_TRANG_THAI_BOT.bat`** (Xem trạng thái, PID, đổi chế độ). |
| **Dừng bot hoàn toàn** | Nhấp đúp vào **`DUNG_BOT_HOAN_TOAN.bat`**. |

---

## 📱 ĐIỀU KHIỂN TỪ ĐIỆN THOẠI (Mở "Cloud của tôi" / Truyền file trên Zalo):

Bạn chỉ cần gửi các tin nhắn ngắn sau vào Cloud của chính mình để điều khiển:

- **`#bat`** hoặc **`#khach`**: Bật chế độ trực khách thông minh 24/7 (Tự động tư vấn khách hỏi dịch vụ/sản phẩm, **bảo vệ bạn bè riêng tư**).
- **`#tat`**: Tạm dừng bot để tự chat tay với khách.
- **`#rieng`**: Chuyển sang chế độ Trợ lý Riêng (Chỉ phục vụ một mình bạn, hoàn toàn không xen vào tin nhắn người ngoài).
- **`#leads`**: Xem danh sách số điện thoại khách hàng mà Bot vừa xin được.
- **`#trangthai`**: Kiểm tra tình trạng hoạt động hiện tại của bot.
- **Nhắn câu hỏi bất kỳ**: Để giao việc, nhờ bot viết bài content, lên kịch bản TikTok, viết code... trực tiếp từ điện thoại.
