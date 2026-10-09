import fs from 'fs';
import path from 'path';

const sessionPath = path.resolve(process.cwd(), 'session.json');

if (!fs.existsSync(sessionPath)) {
    console.error('❌ Không tìm thấy file session.json. Hãy chạy bot và đăng nhập Zalo ít nhất 1 lần trước.');
    process.exit(1);
}

try {
    const raw = fs.readFileSync(sessionPath, 'utf8');
    const parsed = JSON.parse(raw);
    const minified = JSON.stringify(parsed);

    const outText = `=====================================================================
🔑 CHUỖI ĐĂNG NHẬP ZALO CLOUD (ZALO_SESSION_JSON)
Dùng để chạy Bot trên Render.com / Koyeb / Railway / VPS Linux 24/7
kể cả khi TẮT MÁY TÍNH CÁ NHÂN!
=====================================================================

👉 TÊN BIẾN MÔI TRƯỜNG (Key / Name):
ZALO_SESSION_JSON

👉 GIÁ TRỊ (Value - Hãy sao chép toàn bộ dòng bên dưới):
${minified}

=====================================================================
💡 HƯỚNG DẪN DÁN VÀO CLOUD:
1. Vào trang quản lý ứng dụng trên Render.com hoặc Koyeb.
2. Tìm mục "Environment Variables" (Biến môi trường).
3. Thêm biến:
   - Key: ZALO_SESSION_JSON
   - Value: (Dán toàn bộ chuỗi ở trên vào)
4. Bấm "Save" / "Deploy".
5. Bot trên Cloud sẽ tự động đăng nhập 100% mà KHÔNG CẦN QUÉT LẠI MÃ QR!
=====================================================================
`;

    fs.writeFileSync('SESSION_CLOUD_ENV.txt', outText, 'utf8');
    console.log(outText);
    console.log('✅ Đã lưu sẵn vào file: SESSION_CLOUD_ENV.txt để bạn tiện mở xem và copy bất kỳ lúc nào!');
} catch (e) {
    console.error('❌ Lỗi khi đọc session.json:', e.message);
}
