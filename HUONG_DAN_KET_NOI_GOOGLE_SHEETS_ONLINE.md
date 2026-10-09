# 📊 HƯỚNG DẪN LƯU TRỮ DỮ LIỆU KHÁCH HÀNG ONLINE 24/7 QUA GOOGLE SHEETS

> **Mục tiêu:** Mỗi khi khách hàng nhắn tin hoặc để lại số điện thoại trên Zalo, Bot sẽ tự động đẩy thông tin vào Bảng tính Google Sheets Online. Bạn và nhân viên có thể mở điện thoại xem ngay lập tức ở bất kỳ đâu!

---

## BƯỚC 1: TẠO BẢNG TÍNH GOOGLE SHEETS MỚI (30 GIÂY)

1. Mở trình duyệt và truy cập: 👉 **https://sheets.new** (hoặc vào [Google Drive](https://drive.google.com) tạo 1 file Trang tính mới).
2. Đặt tên file: **"DANH SÁCH KHÁCH HÀNG ZALO BOT"**.
3. Tại hàng đầu tiên (Dòng 1), tạo các cột tiêu đề sau:
   - Cột A: **Thời Gian**
   - Cột B: **Tên Khách Hàng**
   - Cột C: **Số Điện Thoại**
   - Cột D: **Nội Dung Tin Nhắn**
   - Cột E: **Tên Shop / Nguồn**
   - Cột F: **Trạng Thái (Mới / Đã Gọi / Đã Chốt)**

---

## BƯỚC 2: DÁN ĐOẠN MÃ GOOGLE APPS SCRIPT (TỰ ĐỘNG GHI DỮ LIỆU)

1. Trên thanh menu của Google Sheets, bấm: **Tiện ích mở rộng (Extensions)** ➡️ **Apps Script**.
2. Xóa hết mã cũ trong cửa sổ và dán đoạn mã sau vào:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Ghi một dòng mới vào Google Sheets
    sheet.appendRow([
      data.time || new Date().toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh"}),
      data.customerName || "Khách Zalo",
      data.phone || "",
      data.message || "",
      data.shopName || "HAITECH BOT",
      "Khách Mới"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu vào Google Sheets thành công!"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Bấm **Lưu (Save)** biểu tượng đĩa mềm.

---

## BƯỚC 3: XUẤT BẢN THÀNH WEB APP ĐỂ LẤY LINK WEBHOOK

1. Bấm nút màu xanh **Triển khai (Deploy)** ở góc trên bên phải ➡️ Chọn **Triển khai mới (New deployment)**.
2. Chọn loại: Bấm biểu tượng bánh răng ⚙️ ➡️ Chọn **Ứng dụng web (Web app)**.
3. Điền cấu hình:
   - **Mô tả**: *Webhook Zalo Bot*
   - **Thực thi dưới dạng (Execute as)**: *Tôi (Tài khoản của bạn)*
   - **Người có quyền truy cập (Who has access)**: 👉 Chọn **Bất kỳ ai (Anyone)** *(Quan trọng: Phải chọn mục này để bot gửi được dữ liệu vào)*.
4. Bấm **Triển khai (Deploy)** ➡️ Bấm **Ủy quyền truy cập (Authorize access)** ➡️ Chọn tài khoản Google của bạn.
5. Google sẽ cấp cho bạn một đường link Webhook dạng:
   👉 `https://script.google.com/macros/s/AKfycb.../exec`
6. **Sao chép (Copy) đường link này!**

---

## BƯỚC 4: KẾT NỐI VÀO BOT CỦA BẠN & KHÁCH HÀNG

- **Cách 1 (Khi tạo Bot mới cho khách):**
  - Chạy file [**`TAO_BOT_CHO_KHACH.bat`**](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/TAO_BOT_CHO_KHACH.bat).
  - Khi công cụ hỏi mục `6️⃣ Link Webhook lưu trữ Online`, bạn chỉ cần dán đường link Google Script ở trên vào.

- **Cách 2 (Cho Bot đang chạy):**
  - Mở file `knowledge.json` trong thư mục bot, thêm dòng:
    ```json
    "onlineStorageUrl": "https://script.google.com/macros/s/AKfycb.../exec"
    ```
  - Lưu lại file là xong!

---

### 🎉 KẾT QUẢ ĐẠT ĐƯỢC:
- Bất cứ khi nào khách hàng nhắn tin trên Zalo có để lại số điện thoại (ví dụ: *0988...* hoặc *0912...*):
  1. Dòng thông tin khách sẽ tự động nhảy vào **Bảng tính Google Sheets** trong 1 giây.
  2. Điện thoại của bạn mở app Google Sheets là thấy ngay số điện thoại của khách để gọi tư vấn.
  3. Đồng thời Bot cũng tự động gửi 1 tin nhắn thông báo vào mục **"Cloud của tôi"** trên Zalo để bạn không bao giờ bỏ lỡ đơn hàng!
