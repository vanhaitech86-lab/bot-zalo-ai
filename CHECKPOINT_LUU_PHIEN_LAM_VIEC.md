# 📌 CHECKPOINT LƯU TRỮ TRẠNG THÁI HỆ THỐNG
**Dự án:** HAITECH BOT Studio — Trợ lý AI Chăm sóc & Chốt đơn khách hàng trên Zalo  
**Trạng thái phiên:** ĐÃ LƯU TOÀN BỘ THÔNG TIN THÀNH CÔNG VÀO HỆ THỐNG & GITHUB  
**Thời gian ghi nhận:** 25/09/2026  

---

## 🎯 1. THÔNG TIN CẤU HÌNH TRỢ LÝ HIỆN TẠI
* **Tên trợ lý AI:** `Em Thùy Linh - Trợ lý HAITECH BOT`
* **Số điện thoại Zalo kết nối:** `0988 739 896`
* **Chế độ phản hồi:** **Chỉ chat riêng 1-1 với từng khách hàng** (`ThreadType.User` được khóa cứng trong mã nguồn), **tuyệt đối không bao giờ nhắn vào nhóm chat hay hội bạn bè**.
* **Bộ não 1 (Tri thức nội bộ RAG):** Đọc trực tiếp từ file `knowledge.json` và bảng `📚 Nạp tài liệu & FAQ` trên Dashboard. Tự động nhận diện thay đổi ngay trong 1 giây mà không cần khởi động lại bot.
* **Bộ não 2 (Trí tuệ nhân tạo linh hoạt):** Tích hợp Google Gemini 2.5 Flash (1.500 requests/ngày miễn phí 100%) và GroqCloud LPU (siêu tốc 0.3s) để tự động trả lời tự nhiên mọi câu hỏi ngoài kịch bản.

---

## 🎛️ 2. DANH SÁCH TÍNH NĂNG ĐIỀU KHIỂN ĐÃ BỔ SUNG
1. **Nút Kết Nối Zalo:**
   * Nút `[🔗 Kết Nối Zalo]` ở góc trên thanh Top Navigation của `dashboard.html`.
   * Nút `[🔗 KẾT NỐI ZALO (QUÉT QR)]` tại Banner tổng quan của `dashboard.html`.
   * Cửa sổ Quét QR Code popup hiển thị ảnh QR sắc nét, link trực tiếp `zalo.me/0988739896` và hướng dẫn 3 bước kết nối trong 10 giây.
2. **Nút Ngắt Bot Zalo Khẩn Cấp:**
   * Nút `[🛑 Ngắt Bot Zalo]` ở góc trên Top Navigation.
   * File ngắt cứng Windows: `NGAT_KET_NOI_BOT.bat`.
   * Lệnh ngắt từ xa qua điện thoại: Gửi `#tatbot` hoặc `#ngatketnoi` từ nick Zalo của bạn.
3. **Hệ Thống Trải Nghiệm Dùng Thử 7 Ngày & Leads CRM:**
   * Form đăng ký công khai tại `index.html#dung-thu` và `https://bot-zalo-ai.vercel.app/#dung-thu`.
   * Bảng quản trị khách hàng tiềm năng tại Tab `🎁 Đăng ký trải nghiệm` trên `dashboard.html`.
4. **Bảng Giá Thuê Bao SaaS Định Kỳ & Máy Tính Lợi Nhuận:**
   * 4 Gói cước: Khởi Nghiệp (199k/tháng), Pro Shop (499k/tháng), Doanh Nghiệp (990k/tháng), Agency (2.990k/tháng).
   * Thanh trượt tính toán Doanh thu & Lợi nhuận ròng trực quan trên Dashboard.

---

## 📂 3. CÁC TỆP TIN ĐANG MỞ & VỊ TRÍ TRONG HỆ THỐNG

1. **Lõi Bot Zalo cá nhân:** [bot-zalo-personal.js](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/bot-zalo-personal.js)
2. **Bảng điều khiển Studio:** [dashboard.html](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/dashboard.html)
3. **Cơ sở tri thức RAG:** [knowledge.json](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/knowledge.json)
4. **Bộ xử lý tri thức API:** [api/knowledge-engine.js](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/api/knowledge-engine.js)
5. **Widget nhúng Website:** [haitech-chat-widget.js](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/haitech-chat-widget.js)
6. **Landing Page bán hàng:** [index.html](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/index.html)
7. **Kế hoạch thương mại hóa:** [KE_HOACH_THUONG_MAI_HOA_VA_BANG_GIA_CHO_THUE.md](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/KE_HOACH_THUONG_MAI_HOA_VA_BANG_GIA_CHO_THUE.md)
8. **Sổ tay hướng dẫn chi tiết:** [SO_TAY_HUONG_DAN_CAI_DAT_VA_SU_DUNG.md](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/SO_TAY_HUONG_DAN_CAI_DAT_VA_SU_DUNG.md)

---

## 🚀 4. CÁCH MỞ LẠI HỆ THỐNG KHI BẠN KHỞI ĐỘNG LẠI MÁY
* **Khởi động Bot:** Nhấp đúp vào `CHAY_BOT_ZALO.bat` trên màn hình máy tính.
* **Mở Bảng Điều Khiển:** Nhấp đúp vào `dashboard.html` để vào màn hình quản trị.
* **Trang web trực tuyến (mở từ mọi nơi trên điện thoại/laptop):** [https://bot-zalo-ai.vercel.app](https://bot-zalo-ai.vercel.app)
* **Kho lưu trữ GitHub bảo mật:** [https://github.com/vanhaitech86-lab/bot-zalo-ai](https://github.com/vanhaitech86-lab/bot-zalo-ai)
