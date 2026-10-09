# 🌸 HƯỚNG DẪN EM THÙY LINH: ĐỔI AVATAR, TRỰC NHÓM CHỐT ĐƠN & LƯU SESSION

Tài liệu này tổng hợp đầy đủ 3 yêu cầu của anh Hải:
1. **Lưu trữ thông tin phiên đăng nhập (Session Cloud)** để dùng lâu dài.
2. **Hướng dẫn thay đổi ảnh đại diện (Avatar) cho Em Thùy Linh**.
3. **Cơ chế gọi `@thuylinh` trong Hội nhóm Zalo** để tư vấn và chốt đơn tự động.

---

## 1. 🔑 THÔNG TIN ĐÃ ĐƯỢC LƯU TRỮ VĨNH VIỄN
Tất cả thông tin đăng nhập và kết nối đã được lưu trữ an toàn trong các file sau:
- **File Session Cloud**: [SESSION_CLOUD_ENV.txt](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/SESSION_CLOUD_ENV.txt) *(chứa chuỗi `ZALO_SESSION_JSON` dùng cho Render/Cloud)*.
- **File Tổng hợp đấu nối**: [DANH_SACH_LINK_VA_THONG_TIN_DAU_NOI.txt](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/DANH_SACH_LINK_VA_THONG_TIN_DAU_NOI.txt).
- **Sao lưu Session gốc**: `session_backup_main_zalo.json` và `session.json`.

---

## 2. 🖼️ CÁCH THAY ĐỔI ẢNH ĐẠI DIỆN EM THÙY LINH & CÂU HỎI QUAN TRỌNG

### ⚠️ CÂU HỎI: "Nếu đổi avatar Thùy Linh thì có thay đổi ảnh đại diện cá nhân của tôi không?"
👉 **CÂU TRẢ LỜI: CÓ!** 
Nếu anh đổi trực tiếp trên ứng dụng Zalo ở điện thoại của số `0988 739 896`, thì **toàn bộ ảnh đại diện Zalo cá nhân của anh Hải cũng sẽ đổi thành ảnh Em Thùy Linh**.
Lý do: Zalo chỉ cho phép **1 ảnh đại diện duy nhất** cho 1 tài khoản Zalo. Bạn bè, người thân, đối tác khi xem Zalo của anh đều sẽ thấy ảnh Em Thùy Linh thay vì ảnh thật của anh.

---

### 💡 3 PHƯƠNG ÁN TỐI ƯU NHẤT DÀNH CHO ANH HẢI:

#### 🌟 PHƯƠNG ÁN 1 (KHUYÊN DÙNG NẾU DÙNG CHUNG 1 NICK ZALO):
- **Anh cứ giữ nguyên 100% ảnh đại diện thật của anh Hải** (ảnh cá nhân lịch lãm, uy tín của chủ doanh nghiệp).
- Khi khách hàng hoặc nhóm chat nhắn tin, Em Thùy Linh sẽ tự động xưng danh:
  > *"Dạ em chào anh/chị, em là Thùy Linh — Trợ lý AI của anh Nguyễn Văn Hải (HaiTech AI)..."*
- **Ưu điểm vượt trội:**
  + Giữ vững uy tín và thương hiệu cá nhân của anh Hải với bạn bè, người thân, đối tác.
  + Khách hàng và hội nhóm sẽ thấy công ty HaiTech AI cực kỳ đẳng cấp và chuyên nghiệp vì **anh Hải đã tích hợp hẳn một Trợ lý AI thông minh trực thay mình trên chính nick cá nhân**!

#### 🚀 PHƯƠNG ÁN 2 (MÔ HÌNH DOANH NGHIỆP — TÁCH BIỆT HOÀN TOÀN):
- Mua thêm 1 SIM phụ giá rẻ (SIM data/nghe gọi thông thường) và đăng ký 1 tài khoản Zalo riêng.
- Đặt tên tài khoản Zalo đó là: **"Em Thùy Linh — Trợ Lý HaiTech AI"**.
- Cài ảnh đại diện tài khoản Zalo phụ đó là **ảnh chân dung Em Thùy Linh AI xinh đẹp**.
- Dùng tài khoản Zalo phụ này quét mã QR đăng nhập Bot (chạy trên máy tính hoặc Render).
- **Ưu điểm vượt trội:**
  + Zalo cá nhân chính của anh Hải (0988 739 896) hoàn toàn độc lập, dùng để nghe gọi, tâm sự bạn bè bình thường.
  + Zalo phụ Em Thùy Linh chuyên dùng để add vào các nhóm đối tác, nhóm khách hàng, trực chiến và chốt đơn 24/7 như một nhân viên kinh doanh thực thụ.

#### 💻 PHƯƠNG ÁN 3 (CHỈ ĐỔI TRÊN GIAO DIỆN WEB NỘI BỘ):
- Nếu anh chỉ muốn đổi ảnh đại diện hiển thị trên trang Dashboard web hoặc giao diện Trợ lý riêng trên máy tính:
  1. Chuẩn bị ảnh chân dung em Thùy Linh mới (JPG/PNG).
  2. Đổi tên thành: `AVATAR_THUY_LINH.jpg` và `bot-avatar.png`.
  3. Chép đè vào thư mục: `e:\BOT ZALO CHĂM SÓC KHÁCH  TỰ ĐỘNG\`.
  4. Mở lại web [dashboard.html](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/dashboard.html) hoặc [tro-ly-rieng.html](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/tro-ly-rieng.html).
  5. **Cách này 100% KHÔNG ảnh hưởng gì đến Zalo cá nhân của anh!**

---

## 3. 👥 CƠ CHẾ GỌI `@thuylinh` TRONG HỘI NHÓM ZALO ĐỂ CHỐT ĐƠN

Hệ thống đã được lập trình và kích hoạt tính năng **Thông minh theo ngữ cảnh nhóm**:

### 🚫 Khi KHÔNG gọi tên (Hội thoại nhóm tự nhiên):
- Em Thùy Linh sẽ **HOÀN TOÀN IM LẶNG 100%**.
- Không chen ngang cuộc trò chuyện, không làm phiền hay làm loãng nhóm.

### ⚡ Khi CÓ GỌI TÊN:
Thành viên trong nhóm chỉ cần gõ bất kỳ từ khóa nào sau đây:
- `@thuylinh` hoặc `@thùylinh` *(kể cả gõ `@` rồi chọn nick Zalo của Thùy Linh)*
- `thùy linh ơi`, `thuylinh ơi`, `em thùy linh`
- `@bot`, `bot ơi`

### 🎯 Quy trình phản hồi & Hỗ trợ Chốt đơn trong nhóm:
1. **Trích dẫn tin nhắn (Quote message):** Thùy Linh tự động trích dẫn đúng tin nhắn của người hỏi để cả nhóm theo dõi minh bạch.
2. **Nội dung tư vấn súc tích (2 - 3 câu):** Xưng 'em', gọi 'anh/chị' lễ phép, tập trung giải quyết đúng câu hỏi (Web, App, Video AI, MMO Tool, Báo giá...).
3. **Kỹ năng chốt đơn khéo léo:** Khẳng định HaiTech AI triển khai nhanh, chuẩn SEO, tối ưu chi phí -> Mời kết nối riêng với anh Hải (Hotline/Zalo 0988 739 896) hoặc để lại số điện thoại để bên em gửi demo & báo giá ưu đãi!
4. **Tự động bắt số điện thoại:** Nếu người hỏi để lại SĐT trong nhóm, hệ thống tự động:
   - Lưu vào `leads.json`.
   - Đồng bộ tức thì lên Google Sheets.
   - Bắn tin nhắn báo động đỏ ngay vào **"Cloud của tôi"** trên Zalo của anh Hải: *"🔔 CÓ KHÁCH HÀNG MỚI ĐỂ LẠI SĐT TRONG NHÓM..."* để anh vào chốt đơn nóng!

---

## 4. 🚀 TRẠNG THÁI HIỆN TẠI
- Bot Zalo cá nhân hiện đang **ĐANG CHẠY TRỰC CHIẾN 24/7** trên máy của anh.
- Mã nguồn mới nhất đã được đồng bộ lên GitHub: `https://github.com/vanhaitech86-lab/bot-zalo-ai.git`.
- Bất cứ khi nào anh muốn chuyển lên Render/Cloud để tắt máy tính, chỉ cần dùng chuỗi trong [SESSION_CLOUD_ENV.txt](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/SESSION_CLOUD_ENV.txt) là xong ngay!
