# 📌 CHECKPOINT LƯU TRỮ TOÀN BỘ DỮ LIỆU & PHIÊN LÀM VIỆC HỆ THỐNG
**Dự án:** HAITECH BOT Studio — Trợ lý AI Chăm sóc & Tư vấn khách hàng 24/7 trên Zalo Cá Nhân  
**Trạng thái phiên:** ✅ ĐÃ LƯU TOÀN BỘ CODE, CẤU HÌNH, DỮ LIỆU TRI THỨC VÀ GITHUB  
**Thời gian cập nhật:** 26/09/2026 - 16:06:00  

---

## 🎯 1. THÔNG TIN CẤU HÌNH TRỢ LÝ HIỆN TẠI
* **Tên trợ lý:** `Em Thùy Linh - Trợ lý HAITECH BOT`
* **Hotline/Zalo:** `0988 739 896` - Chủ tài khoản: Anh Hải (HAITECH BOT STUDIO)
* **Chế độ phản hồi:** 
  - **Chỉ chat riêng 1-1 với từng khách hàng** (`ThreadType.User` được khóa cứng trong mã nguồn).
  - **Tự động bỏ qua 100% hội nhóm (Group Chat)** để bảo đảm bảo mật và tránh làm phiền.
* **Bộ não 1 (Tri thức nội bộ & Cấu hình):** 
  - Lưu tại `knowledge.json`.
  - Tự động nhận diện thay đổi ngay lập tức (hot reload) mà không cần khởi động lại bot.
* **Bộ não 2 (Trí tuệ nhân tạo Gemini Full-AI):**
  - Model hoạt động chính: `gemini-3.5-flash-lite`, `gemini-flash-latest`, `gemini-3.8-flash`.
  - **Chế độ hoạt động:** `"mode": "full-ai"` — 100% cuộc hội thoại được xử lý thông minh qua AI, loại bỏ tình trạng kẹt văn mẫu hoặc lặp lại lời chào.
  - **Quy tắc ứng xử nghiêm ngặt:**
    1. Đi thẳng vào vấn đề cốt lõi, không nói văn mẫu quảng cáo chung chung.
    2. Tuyệt đối không tự ý chèn số điện thoại khi đang chat Zalo trực tiếp (chỉ cung cấp khi khách hỏi xin số).
    3. Không lặp lại lời chào hỏi khi đã trong cuộc hội thoại.
    4. Trả lời tự nhiên, có tâm, đóng vai trò như chuyên gia giàu kinh nghiệm.

---

## ⚡ 2. CÁC NÂNG CẤP KỸ THUẬT QUAN TRỌNG ĐÃ TRIỂN KHAI
1. **Bộ đệm gộp tin nhắn (Debounce Buffer 1.5s):**
   - Khi khách gửi nhiều câu ngắt quãng liên tiếp (hoặc gửi dạng bullet points), bot tự động đợi 1.5 giây để gộp thành 1 nội dung trọn vẹn trước khi chuyển cho AI.
   - Giải quyết triệt để tình trạng trả lời phân mảnh, tránh chạm trần giới hạn gọi API (Rate Limit / Quota Exceeded).
2. **Tăng Timeout lên 25s & Dự phòng đa tầng (Model Fallback):**
   - Không bị ngắt kết nối giữa chừng (`This operation was aborted`).
   - Tự động chuyển đổi giữa các model miễn phí của Google AI Studio nếu một model bận.
3. **Bộ nhớ hội thoại đa lượt (Multi-turn Context Memory):**
   - Lưu trữ 12 lượt chat gần nhất theo từng khách hàng (`threadId`) giúp bot ghi nhớ toàn bộ ngữ cảnh từ đầu đến cuối buổi nói chuyện.

---

## 💬 3. BẰNG CHỨNG THỰC TẾ ĐÃ HOẠT ĐỘNG HOÀN HẢO (TRÍCH LOG TRỰC TIẾP)
Hệ thống vừa hỗ trợ khách hàng thực tế về kỹ thuật bo mạch máy photocopy:
* **Khách:** *"Anh hải ơi tình hình bo máy photo thế nào rồi anh"*
* **Bot:** *"Dạ anh Hải đang trực tiếp kiểm tra và xử lý bo mạch cho mình rồi ạ. Khi có kết quả cụ thể, bên em sẽ báo ngay ạ..."*
* **Khách:** *"Vẫn chưa ra bệnh à anh ."*
* **Bot:** *"Dạ bo mạch máy photo dòng này khá phức tạp nên anh Hải đang đo đạc từng linh kiện để tìm đúng lỗi..."*
* **Khách:** *"Vâng , chi phí thế nào đấy anh."*
* **Bot:** *"Dạ tùy thuộc vào linh kiện trên bo mạch bị lỗi nặng hay nhẹ mà chi phí sẽ dao động từ vài trăm đến hơn một triệu..."*
* **Khách:** *"Nhắn em để em báo khách với nhé"*
* **Bot:** *"Dạ vâng anh, có kết quả kiểm tra và báo giá chính xác là em nhắn liền để anh kịp báo khách nhé!..."*
* **Khách:** *"Quá hay ạ."*

---

## 📂 4. DANH SÁCH TỆP TIN DỰ ÁN & VAI TRÒ
1. [bot-zalo-personal.js](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/bot-zalo-personal.js): Lõi chạy bot Zalo cá nhân 24/7, kết nối qua zca-js, tích hợp debounce buffer và auto-quote.
2. [api/knowledge-engine.js](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/api/knowledge-engine.js): Động cơ trí tuệ kép, điều phối Gemini AI, system prompt, đa model dự phòng.
3. [knowledge.json](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/knowledge.json): Cơ sở dữ liệu tri thức, cấu hình AI provider, API keys và quy tắc nghiệp vụ.
4. [session.json](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/session.json): Khóa phiên đăng nhập Zalo hiện tại (được bảo mật trong `.gitignore`).
5. [dashboard.html](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/dashboard.html): Bảng điều khiển quản trị, nạp dữ liệu, kết nối Zalo, cấu hình AI.
6. [CHAY_BOT_ZALO.bat](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/CHAY_BOT_ZALO.bat): File khởi động bot nhanh trên Windows chỉ với 1 click.
7. [NGAT_KET_NOI_BOT.bat](file:///e:/BOT%20ZALO%20CH%C4%82M%20S%C3%93C%20KH%C3%81CH%20%20T%E1%BB%B0%20%C4%90%E1%BB%98NG/NGAT_KET_NOI_BOT.bat): File ngắt kết nối an toàn và tắt bot khẩn cấp.

---

## 🚀 5. HƯỚNG DẪN QUẢN TRỊ KHI SỬ DỤNG
* **Khởi động Bot:** Nhấp đúp chuột vào `CHAY_BOT_ZALO.bat`. Bot sẽ tự nhận diện `session.json` và đăng nhập ngay lập tức.
* **Ngắt kết nối Bot:**
  - Nhấp đúp vào `NGAT_KET_NOI_BOT.bat`.
  - Hoặc từ Zalo trên điện thoại, nhắn tin riêng cho chính mình chữ: `#tatbot` hoặc `#ngatketnoi`.
* **Kho lưu trữ GitHub đồng bộ:** [https://github.com/vanhaitech86-lab/bot-zalo-ai](https://github.com/vanhaitech86-lab/bot-zalo-ai)
